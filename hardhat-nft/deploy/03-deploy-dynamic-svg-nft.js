const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let ethUsdPriceFeedAddress

  if (developmentChains.includes(network.name)){
    const EthUsdAggregator = await ethers.getContract("MockV3Aggregator") 
    ethUsdPriceFeedAddress = EthUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed 
  }

  log("------------------------------------")

  const lowSVG = await fs.readFileSync("./images/dynamic/frown.svg", {encoding: "utf-8"})
  const highSVG = await fs.readFileSync("./images/dynamic/happy.svg", {encoding: "utf-8"})

  args = [ethUsdPriceFeedAddress, lowSVG, highSVG]

  const dynamicNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(dynamicNft.address, args)
  }
  log("---------------------------")
}

module.exports.tags = ["all", "dynamicNft", "main"]
