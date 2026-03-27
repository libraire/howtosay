"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import CardReviewBoard from "@/app/components/CardReviewBoard"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { fetchCardDueSummary, fetchCardReviewQueue, submitCardReviewResult } from "@/app/lib/cards-api"
import type { CardDueSummary, CardReviewItem } from "@/app/lib/cards-models"

export default function CardsReviewPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const searchParams = useSearchParams()
    const [summary, setSummary] = useState<CardDueSummary | null>(null)
    const [queue, setQueue] = useState<CardReviewItem[]>([])
    const [totalDue, setTotalDue] = useState(0)
    const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null)
    const [loadingPage, setLoadingPage] = useState(true)
    const [reviewing, setReviewing] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const deckParam = searchParams?.get("deck")
        setSelectedDeckId(deckParam ? Number(deckParam) : null)
    }, [searchParams])

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return
        }

        loadReviewCenter(selectedDeckId)
    }, [isAuthenticated, isLoading, selectedDeckId])

    async function loadReviewCenter(deckId: number | null) {
        setLoadingPage(true)
        setError("")
        try {
            const [summaryData, queueData] = await Promise.all([
                fetchCardDueSummary(),
                fetchCardReviewQueue(deckId, 20),
            ])

            setSummary(summaryData)
            setQueue(queueData.cards)
            setTotalDue(queueData.totalDue)
        } catch (reviewError) {
            console.error("Failed to load cards review center:", reviewError)
            setError(reviewError instanceof Error ? reviewError.message : "Unable to load cards review.")
            setSummary(null)
            setQueue([])
            setTotalDue(0)
        } finally {
            setLoadingPage(false)
        }
    }

    const dueDecks = useMemo(() => (summary?.decks ?? []).filter((deck) => deck.dueCount > 0), [summary])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#101010]">
                <Navbar />
            </main>
        )
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#101010] pb-12">
                <Navbar />
                <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.24)]">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Cards Review</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Review any saved topic on a memory schedule</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                            The cards review center gathers due cards across your decks, lets you flip each one, then grade recall with Anki-style ratings.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <PreviewStat title="Due now" text="See what needs attention immediately." />
                            <PreviewStat title="Overdue" text="Spot cards that have slipped past their ideal interval." />
                            <PreviewStat title="Deck filter" text="Focus on one deck or clear a mixed queue." />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                                Login to review cards
                            </button>
                            <Link href="/cards" className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/10">
                                Back to cards
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#101010] pb-12">
            <Navbar />
            <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                {reviewing ? (
                    <CardReviewBoard
                        items={queue}
                        onClose={() => {
                            setReviewing(false)
                            loadReviewCenter(selectedDeckId)
                        }}
                        onRate={submitCardReviewResult}
                        onComplete={() => {
                            setReviewing(false)
                            loadReviewCenter(selectedDeckId)
                        }}
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.24)]">
                            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">Cards Review</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Memory queue for your custom decks</h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                                        Review what is due right now, inspect overdue load, then start a self-graded card round.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        value={selectedDeckId ?? ""}
                                        onChange={(event) => setSelectedDeckId(event.target.value ? Number(event.target.value) : null)}
                                        className="h-11 rounded-xl border border-white/10 bg-[#111111] px-4 text-sm text-white focus:border-white/20 focus:outline-none"
                                    >
                                        <option value="">All decks</option>
                                        {(summary?.decks ?? []).map((deck) => (
                                            <option key={deck.id} value={deck.id}>
                                                {deck.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setReviewing(true)}
                                        disabled={loadingPage || queue.length === 0}
                                        className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
                                    >
                                        Start review
                                    </button>
                                </div>
                            </div>

                            {loadingPage ? (
                                <div className="py-16 text-center text-sm text-white/48">Loading cards review center...</div>
                            ) : (
                                <>
                                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                                        <ReviewStat label="Due now" value={summary?.dueNow ?? 0} />
                                        <ReviewStat label="Overdue" value={summary?.overdue ?? 0} />
                                        <ReviewStat label="Due today" value={summary?.dueToday ?? 0} />
                                        <ReviewStat label="New cards" value={summary?.newCards ?? 0} />
                                    </div>

                                    {error && (
                                        <div className="mt-6 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Decks with due cards</h2>
                                            <div className="mt-5 space-y-3">
                                                {dueDecks.length === 0 ? (
                                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
                                                        No due cards right now.
                                                    </div>
                                                ) : dueDecks.map((deck) => (
                                                    <Link
                                                        key={deck.id}
                                                        href={`/cards/decks/${deck.id}`}
                                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.07]"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{deck.name}</div>
                                                            <div className="mt-1 text-xs text-white/45">
                                                                {deck.cardCount} cards · {deck.newCardCount} new
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-xs text-white/45">
                                                            <div>{deck.dueCount} due</div>
                                                            <div>{deck.overdueCount} overdue</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Current round preview</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                {selectedDeckId ? "This queue is filtered to one deck." : "This queue blends all currently due decks."}
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {queue.length > 0 ? queue.slice(0, 5).map((card, index) => (
                                                    <div key={card.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                                                        <div className="text-sm font-medium text-white">{index + 1}. {card.title}</div>
                                                        <div className="mt-1 text-xs text-white/45">
                                                            {card.deckName || "Cards"} · {card.progress.status}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
                                                        {totalDue === 0 ? "No cards are due in this filter." : "Nothing is ready to review yet."}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link href="/cards" className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10">
                                                    Open deck library
                                                </Link>
                                                {queue.length === 0 && (
                                                    <Link href="/cards" className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90">
                                                        Create more cards
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

function ReviewStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm text-white/45">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight text-white">{value}</div>
        </div>
    )
}

function PreviewStat({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm font-medium text-white">{title}</div>
            <div className="mt-2 text-sm leading-6 text-white/55">{text}</div>
        </div>
    )
}
