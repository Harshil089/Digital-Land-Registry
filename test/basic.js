const hre = require("hardhat");
const { ethers } = hre;

function toBytes32(str) {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}

async function main() {
  console.log("Starting basic demo...");

  // Get signers
  const [admin, officer1, bank1, userA, userB, userC] = await ethers.getSigners();
  console.log("Admin:", await admin.getAddress());

  // Deploy contract
  const Land = await ethers.getContractFactory("LandRegistry");
  const land = await Land.connect(admin).deploy();
  await land.waitForDeployment();
  const landAddr = await land.getAddress();
  console.log("LandRegistry deployed at:", landAddr);

  // Grant roles
  await (await land.connect(admin).setOfficer(await officer1.getAddress(), true)).wait();
  await (await land.connect(admin).setBankOrOfficer(await bank1.getAddress(), true)).wait();
  console.log("Roles set: officer1 and bank1");

  // Create 3 parcels
  const gh1 = toBytes32("parcel-1-geo.json");
  const gh2 = toBytes32("parcel-2-geo.json");
  const gh3 = toBytes32("parcel-3-geo.json");

  await (await land.connect(officer1).createParcel(1, gh1, 1_000, "PUNE-001", "AGRI", await userA.getAddress())).wait();
  await (await land.connect(officer1).createParcel(2, gh2, 800,   "PUNE-001", "AGRI", await userB.getAddress())).wait();
  await (await land.connect(officer1).createParcel(3, gh3, 1_200, "PUNE-002", "RES",  await userC.getAddress())).wait();
  console.log("Parcels created: 1, 2, 3");

  // Set encumbrance on parcel 2
  await (await land.connect(bank1).setEncumbrance(2, true)).wait();
  console.log("Encumbrance set on parcel 2 = true");

  // Transfer parcel 1 to userB (should succeed)
  await (await land.connect(officer1).transferOwnership(1, await userB.getAddress())).wait();
  console.log("Transferred parcel 1 to userB (success)");

  // Attempt transfer parcel 2 (should fail due to encumbrance)
  try {
    await (await land.connect(officer1).transferOwnership(2, await userA.getAddress())).wait();
    console.log("Unexpected: parcel 2 transfer succeeded (it should fail)");
  } catch (e) {
    console.log("Expected failure: parcel 2 transfer blocked by encumbrance");
  }

  // Create allocation program with parcels [2,3]
  await (await land.connect(officer1).createAllocation(101, [2, 3])).wait();
  console.log("Allocation program 101 created for parcels [2,3]");

  // Users apply for allocation
  await (await land.connect(userA).applyForAllocation(101)).wait();
  await (await land.connect(userB).applyForAllocation(101)).wait();
  await (await land.connect(userC).applyForAllocation(101)).wait();

  const apps = await land.getApplications(101);
  console.log("Applicants for program 101:", apps);

  // Allocate (deterministic: sorted addresses, pick first 2)
  await (await land.connect(officer1).allocate(101)).wait();
  const winners = await land.getWinners(101);
  console.log("Winners for program 101:", winners);

  // Read back parcel 1 details
  const [p1, own1] = await land.getParcel(1);
  console.log("Parcel 1 details:", {
    area: p1.area.toString(),
    locationCode: p1.locationCode,
    landUse: p1.landUse,
    encumbrance: p1.activeEncumbrance,
    owner: own1.owner,
    startBlock: own1.startBlock.toString(),
  });

  console.log("Basic demo complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
