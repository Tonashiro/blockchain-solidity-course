const { expect, assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", () => {
  let simpleStorageFactory, simpleStorage

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0";

    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Should update when we call store", async () => {
    const expectedValue = "8"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()

    assert.equal(currentValue.toString(), expectedValue)
  })
})  
