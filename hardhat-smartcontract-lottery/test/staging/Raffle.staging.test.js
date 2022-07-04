const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", () => {
      let raffle, raffleEntranceFee, deployer

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        raffle = await ethers.getContract("Raffle", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
      })

      describe("FulfillRandomWords", () => {
        it("Works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
          // enter the raffle
          const startingTimeStamp = await raffle.getLatestTimeStamp()
          const accounts = await ethers.getSigners()

          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("Winner event fired")
              resolve()
              try {
                const recentWinner = await raffle.getRecentWinner()
                const raffleState = await raffle.getRaffleState()
                const winnerEndingBalance = await accounts[0].getBalance()
                const endingTimeStamp = await raffle.getLatestTimeStamp()

                await expect(raffle.getPlayer(0)).to.be.reverted
                assert.equal(recentWinner.toString(), accounts[0].address)
                assert.equal(raffleState, 0)
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee.toString())
                )
                assert(endingTimeStamp > startingTimeStamp)
                resolve()
              } catch (error) {
                console.log(error)
                reject(e)
              }
            })

            await raffle.enterRaffle({ value: raffleEntranceFee })
            const winnerStartingBalance = await accounts[0].getBalance()
          })
          // setup listener before we enter the raffle
          // just in case the blockchain moves really fast
        })
      })
    })
