const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Unit Tests", () => {
      let basicNft, deployer

      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["mocks", "basicnft"])
        basicNft = await ethers.getContract("BasicNft")
      })

      it("Should mint an NFT and update properly", async () => {
        const txResponse = await basicNft.mintNft()
        await txResponse.wait(1)
        const tokenUri = await basicNft.tokenURI(0)
        const tokenCounter = await basicNft.getTokenCounter()

        assert.equal(tokenUri, await basicNft.TOKEN_URI())
        assert.equal(tokenCounter.toString(), "1")
      })
    })
