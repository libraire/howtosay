"use client"

import AudioComponent from "../components/AudioComponent"
import BoardComponent from "../components/DemoBoardComponet"
import Navbar from "../components/Navbar"

export default function DailyPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="flex w-full flex-col items-center">
                <div className="mt-10 max-w-2xl px-6 text-center">
                    <h1 className="text-4xl font-medium tracking-tight text-white">Daily Guess</h1>
                    <p className="mt-3 text-sm text-white/65">
                        A lightweight daily challenge to learn one word from image hints and spelling practice.
                    </p>
                </div>
                <BoardComponent />
            </section>
        </main>
    )
}
