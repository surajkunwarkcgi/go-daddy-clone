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

    // List a domain
    const transaction = await contract
      .connect(deployer)
      .list("suraj.eth", tokens(10));
    await transaction.wait();
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

    it("returns the max supply", async () => {
      const result = await contract.maxSupply();
      expect(result).to.equal(1);
    });

    it("returns the total supply", async () => {
      const result = await contract.totalSupply();
      expect(result).to.equal(0);
    });
  });

  describe("Domain", () => {
    it("returns domain attributes", async () => {
      let domain = await contract.getDomain(1);
      expect(domain.name).to.equal("suraj.eth");
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");

    beforeEach(async () => {
      const transaction = await contract
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("updates the owner", async () => {
      let owner = await contract.ownerOf(ID);
      expect(owner).to.equal(owner1.address);
    });

    it("updates the domain status", async () => {
      const domain = await contract.getDomain(ID);
      expect(domain.isOwned).to.equal(true);
    });

    it("updates the contract balance", async () => {
      const result = await contract.getBalance();
      expect(result).to.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await contract
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await contract.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.greaterThan(balanceBefore);
    });

    it("updates the contract balance", async () => {
      const result = await contract.getBalance();
      expect(result).to.equal(0);
    });
  });
});
