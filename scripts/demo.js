const hre = require("hardhat");
const { ethers } = hre;

function toBytes32(str) {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}

async function main() {
  const [admin, officer1, bank1, userA, userB, userC] = await ethers.getSigners();

  const Land = await ethers.getContractFactory("LandRegistry");
  const land = await Land.connect(admin).deploy();
  await land.waitForDeployment();
  console.log("Deployed:", await land.getAddress());

  // Set roles
  await (await land.connect(admin).setOfficer(await officer1.getAddress(), true)).wait();
  await (await land.connect(admin).setBankOrOfficer(await bank1.getAddress(), true)).wait();

  // Create parcels
  const gh1 = toBytes32("parcel-1-geo.json");
  const gh2 = toBytes32("parcel-2-geo.json");
  const gh3 = toBytes32("parcel-3-geo.json");

  await (await land.connect(officer1).createParcel(1, gh1, 1000, "PUNE-001", "AGRI", await userA.getAddress())).wait();
  await (await land.connect(officer1).createParcel(2, gh2, 800, "PUNE-001", "AGRI", await userB.getAddress())).wait();
  await (await land.connect(officer1).createParcel(3, gh3, 1200, "PUNE-002", "RES", await userC.getAddress())).wait();
  console.log("Parcels created.");

  // Set encumbrance on parcel 2
  await (await land.connect(bank1).setEncumbrance(2, true)).wait();
  console.log("Encumbrance set on parcel 2.");

  // Try transfer — success for parcel 1
  await (await land.connect(officer1).transferOwnership(1, await userB.getAddress())).wait();
  console.log("Transferred parcel 1 to userB.");

  // Try transfer — fail for parcel 2
  try {
    await (await land.connect(officer1).transferOwnership(2, await userA.getAddress())).wait();
  } catch {
    console.log("Expected failure: parcel 2 blocked by encumbrance.");
  }

  // Create allocation program
  await (await land.connect(officer1).createAllocation(101, [2, 3])).wait();
  console.log("Program 101 created for parcels [2,3].");

  // Apply for allocation
  await (await land.connect(userA).applyForAllocation(101)).wait();
  await (await land.connect(userB).applyForAllocation(101)).wait();
  await (await land.connect(userC).applyForAllocation(101)).wait();

  console.log("Applicants:", await land.getApplications(101));

  // Allocation
  await (await land.connect(officer1).allocate(101)).wait();
  console.log("Winners:", await land.getWinners(101));

  // Check parcel 1
  const [p1, own1] = await land.getParcel(1);
  console.log("Parcel 1:", {
    area: p1.area.toString(),
    location: p1.locationCode,
    landUse: p1.landUse,
    encumbrance: p1.activeEncumbrance,
    owner: own1.owner,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
