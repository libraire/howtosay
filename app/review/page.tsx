"use client"

import { useEffect, useState } from "react"
import AudioComponent from "@/app/components/AudioComponent"
import Navbar from "@/app/components/Navbar"
import PractiseComponent from "@/app/components/PractiseComponent"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import type { Word } from "@/app/components/types"
import { fetchReviewQueue } from "@/app/lib/practice-api"

export default function ReviewPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [wordList, setWordList] = useState<Word[]>([])
    const [totalDue, setTotalDue] = useState(0)
    const [loadingQueue, setLoadingQueue] = useState(true)
    const [practise, setPractise] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login()
            return
        }

        if (isAuthenticated) {
            loadQueue()
        }
    }, [isAuthenticated, isLoading, login])

    async function loadQueue() {
        setLoadingQueue(true)
        try {
            const data = await fetchReviewQueue(20)
            setWordList(data.words as Word[])
            setTotalDue(data.totalDue)
        } catch (error) {
            console.error("Failed to load review queue:", error)
            setWordList([])
            setTotalDue(0)
        } finally {
            setLoadingQueue(false)
        }
    }

    if (isLoading || !isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
                <Navbar />
            </main>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
            <Navbar />

            {!practise && (
                <section className="w-full max-w-4xl px-6 pb-12 pt-8">
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Review</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Review Queue</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                            Focus on the words that are due to come back now. Correct answers push them further away, while hinted words return sooner.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
                                {loadingQueue ? "Loading..." : `${totalDue} words due`}
                            </div>
                            {!loadingQueue && (
                                <button
                                    type="button"
                                    onClick={loadQueue}
                                    className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Refresh queue
                                </button>
                            )}
                            {!loadingQueue && wordList.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setPractise(true)}
                                    className="h-10 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
                                >
                                    Start review
                                </button>
                            )}
                        </div>

                        {!loadingQueue && wordList.length === 0 && (
                            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-6 py-10 text-center text-white/55">
                                No review words are due right now. Come back later or keep learning from Word Book and Daily Guess.
                            </div>
                        )}
                    </div>
                </section>
            )}

            {practise && (
                <>
                    <AudioComponent str={"xxxx"} />
                    <PractiseComponent list={wordList} onClose={() => {
                        setPractise(false)
                        loadQueue()
                    }} />
                </>
            )}
        </main>
    )
}
