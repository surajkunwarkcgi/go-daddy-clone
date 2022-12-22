// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts and variables
  const [deployer] = await ethers.getSigners();
  const NAME = "ETH Daddy";
  const SYMBOL = "ETHD";

  // Deploy contracts
  const Contract = await ethers.getContractFactory("ETHDaddy");
  const contract = await Contract.deploy(NAME, SYMBOL);
  await contract.deployed();

  console.log(`Deployed Domain Contract at: ${contract.address}`);

  // List 6 domains
  const names = [
    "jack.eth",
    "john.eth",
    "henry.eth",
    "ruby.eth",
    "caroline.eth",
    "suraj.eth",
  ];
  const costs = [
    tokens(10),
    tokens(25),
    tokens(15),
    tokens(2.5),
    tokens(3),
    tokens(1),
  ];

  for (var i = 0; i < 6; i++) {
    const transaction = await contract
      .connect(deployer)
      .list(names[i], costs[i]);
    await transaction.wait();

    console.log(`Listed Domain ${i + 1}: ${names[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
