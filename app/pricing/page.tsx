"use client"

import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import PriceComponent from "../components/PriceComponent"
import VideoPlayer from "../components/VideoComponent"
import { useAppPreferences } from "../context/AppPreferencesProvider"

export default function PricingPage() {
    const { copy } = useAppPreferences()

    return (
        <main className="theme-page flex min-h-screen flex-col items-center">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="flex w-full flex-col items-center">
                <PriceComponent />

                <section className="w-full max-w-6xl px-6 pb-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-medium tracking-tight">{copy.pricing.unlockTitle}</h2>
                        <p className="theme-muted mt-3 text-sm leading-7">
                            {copy.pricing.unlockDescription}
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        <div className="theme-card rounded-2xl p-6">
                            <h3 className="text-lg font-medium">{copy.pricing.advancedTitle}</h3>
                            <p className="theme-muted mt-3 text-sm leading-7">
                                {copy.pricing.advancedDescription}
                            </p>
                        </div>
                        <div className="theme-card rounded-2xl p-6">
                            <h3 className="text-lg font-medium">{copy.pricing.coverageTitle}</h3>
                            <p className="theme-muted mt-3 text-sm leading-7">
                                {copy.pricing.coverageDescription}
                            </p>
                        </div>
                        <div className="theme-card rounded-2xl p-6">
                            <h3 className="text-lg font-medium">{copy.pricing.controlTitle}</h3>
                            <p className="theme-muted mt-3 text-sm leading-7">
                                {copy.pricing.controlDescription}
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
