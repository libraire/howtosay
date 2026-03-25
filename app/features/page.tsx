"use client"

import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import PriceComponent from "../components/PriceComponent"
import VideoPlayer from "../components/VideoComponent"

export default function FeaturesPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="flex w-full flex-col items-center">
                <div className="mt-10 max-w-2xl px-6 text-center">
                    <h1 className="text-4xl font-medium tracking-tight text-white">Features & Pricing</h1>
                    <p className="mt-3 text-sm text-white/65">
                        Explore the pro workflow, then choose the license plan that fits your usage.
                    </p>
                </div>
                <VideoPlayer src="https://audio.bytegush.com/howtosayone.mp4" />
                <PriceComponent />
            </section>
        </main>
    )
}
