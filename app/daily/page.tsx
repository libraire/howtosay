"use client"

import { useEffect, useState } from "react"
import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import PractiseComponent from "../components/PractiseComponent"
import type { Word } from "../components/types"
import { fetchDailyWords } from "../lib/dict-api"

function shuffleWords(list: Word[]) {
    const nextList = [...list]
    for (let i = nextList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[nextList[i], nextList[j]] = [nextList[j], nextList[i]]
    }
    return nextList
}

export default function DailyPage() {
    const [wordList, setWordList] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadDailyWords() {
            setLoading(true)
            setHasError(false)

            try {
                const dailyWords = await fetchDailyWords()
                if (!cancelled) {
                    setWordList(shuffleWords(dailyWords as Word[]))
                }
            } catch (error) {
                console.error("Failed to load daily words:", error)
                if (!cancelled) {
                    setWordList([])
                    setHasError(true)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadDailyWords()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="flex w-full flex-col items-center">
                <div className="mt-10 max-w-2xl px-6 text-center">
                    <h1 className="text-4xl font-medium tracking-tight text-white">Daily Guess</h1>
                    <p className="mt-3 text-sm text-white/65">
                        A short daily word-guess challenge with text clues and spelling practice.
                    </p>
                </div>

                {loading ? (
                    <div className="mt-16 text-sm text-white/55">Loading daily challenge...</div>
                ) : hasError ? (
                    <div className="mt-16 text-sm text-white/55">Unable to load today&apos;s words right now.</div>
                ) : wordList.length > 0 ? (
                    <PractiseComponent
                        list={wordList}
                        onClose={undefined}
                        mode="daily"
                        showVisualHints={false}
                    />
                ) : (
                    <div className="mt-16 text-sm text-white/55">No daily challenge is available yet.</div>
                )}
            </section>
        </main>
    )
}
