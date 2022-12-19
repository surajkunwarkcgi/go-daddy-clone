const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("ETHDaddy", () => {
  let contract, deployer, owner1;

  const NAME = "suraj";
  const SYMBOL = "ETHD";

  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("ETHDaddy");
    contract = await Contract.deploy("suraj", "ETHD");
    await contract.deployed();
  });

  describe("Deployement", () => {
    it("has a name", async () => {
      const result = await contract.name();
      expect(result).to.equal(NAME);
    });

    it("sets the owner", async () => {
      const result = await contract.owner();
      expect(result).to.equal(deployer.address);
    });
  });
});
