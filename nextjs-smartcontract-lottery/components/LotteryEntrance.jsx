import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")
  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  const updateUI = async () => {
    const entranceFeeCall = (await getEntranceFee()).toString()
    const numPlayersCall = (await getNumPlayers()).toString()
    const recentWinnerCall = await getRecentWinner()
    setEntranceFee(entranceFeeCall)
    setNumPlayers(numPlayersCall)
    setRecentWinner(recentWinnerCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1)
    updateUI()
    handleNewNotification(tx)
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction completed!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div>
      {raffleAddress ? (
        <div className="flex flex-col items-center md:h-[calc(100vh-7rem)] h-[calc(100vh-12rem)] justify-center">
          <button
            className="text-white text-3xl border-white rounded-full border-2 p-8 w-fit bg-slate-800 hover:bg-slate-900 transition-all duration-200 mb-8"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <p className="text-white text-lg mb-3">Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")}ETH </p>
          <p className="text-white text-lg mb-3">Number of players: {numPlayers}</p>
          <p className="text-white text-lg overflow-auto w-full md:w-auto">Recent winner: {recentWinner}</p>
        </div>
      ) : (
        <div>No Raffle Address Detected!</div>
      )}
    </div>
  )
}

export { LotteryEntrance }
