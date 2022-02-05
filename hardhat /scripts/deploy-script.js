const hre = require("hardhat");

async function main() {
  const Debuy = await hre.ethers.getContractFactory("Debuy");
  const debuy = await Debuy.deploy();

  await debuy.deployed();

  await new Promise((resolve) => setTimeout(resolve, 20000)); // pause for explorer update

  await run("verify:verify", {
    address: debuy.address,
    contract: "contracts/Debuy.sol:Debuy",
  });

  console.log("Debuy deployed and verified to:", debuy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
