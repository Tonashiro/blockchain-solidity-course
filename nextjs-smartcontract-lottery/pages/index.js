import Head from "next/head"

import { Header } from "../components/Header"
import { LotteryEntrance } from "../components/LotteryEntrance"

export default function Home() {
  return (
    <div className="flex flex-col p-8 min-h-[100vh] bg-zinc-800 text-white">
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  )
}
