"use client"

import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import PriceComponent from "../components/PriceComponent"
import VideoPlayer from "../components/VideoComponent"

export default function PricingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="flex w-full flex-col items-center">
                <PriceComponent />

                <section className="w-full max-w-6xl px-6 pb-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-medium tracking-tight text-white">What Pro unlocks</h2>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                            HowToSay Pro is designed for learners who want a more structured workflow, deeper exposure,
                            and better control over long-term vocabulary retention.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-lg font-medium text-white">Advanced practice modes</h3>
                            <p className="mt-3 text-sm leading-7 text-white/60">
                                Move beyond basic guessing with richer exercises, audio-supported prompts, and more
                                demanding recognition-to-recall flows.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-lg font-medium text-white">Deeper content coverage</h3>
                            <p className="mt-3 text-sm leading-7 text-white/60">
                                Access broader vocabulary, more examples, and stronger sentence context for learning
                                words in real usage rather than in isolation.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-lg font-medium text-white">Personal learning control</h3>
                            <p className="mt-3 text-sm leading-7 text-white/60">
                                Maintain your own word book, organize what matters, and keep reviewing with a workflow
                                built for continuous progress.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center">
                        <VideoPlayer src="https://audio.bytegush.com/howtosayone.mp4" />
                    </div>
                </section>
            </section>
        </main>
    )
}
