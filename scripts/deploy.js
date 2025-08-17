const hre = require("hardhat");

async function main() {
  const Land = await hre.ethers.getContractFactory("LandRegistry");
  const land = await Land.deploy();
  await land.waitForDeployment();
  console.log("LandRegistry deployed to:", await land.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
