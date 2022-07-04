import { ConnectButton } from "web3uikit"

const Header = () => {
  return (
    <div className="w-full flex justify-center">
      <h1 className="font-sans text-3xl font-bold text-white mt-12 lg:mt-0">Decentralized Lottery</h1>
      <div className="absolute right-0"><ConnectButton/></div>
    </div>
  )
}

export { Header }
