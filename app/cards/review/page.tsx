"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import CardReviewBoard from "@/app/components/CardReviewBoard"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { fetchCardDueSummary, fetchCardReviewQueue, submitCardReviewResult } from "@/app/lib/cards-api"
import type { CardDueSummary, CardReviewItem } from "@/app/lib/cards-models"
import { formatCopy } from "@/app/lib/copy"

function CardsReviewPageContent() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const { copy } = useAppPreferences()
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
            setError(reviewError instanceof Error ? reviewError.message : copy.cardsReview.unableToLoad)
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
            <main className="theme-page min-h-screen">
                <Navbar />
            </main>
        )
    }

    if (!isAuthenticated) {
        return (
            <main className="theme-page min-h-screen pb-12">
                <Navbar />
                <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                    <div className="theme-surface rounded-[36px] p-8">
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.cardsReview.title}</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.cardsReview.marketingTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.cardsReview.marketingBody}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <PreviewStat title={copy.cardsReview.statDueNow} text={copy.cardsReview.statDueNowBody} />
                            <PreviewStat title={copy.cardsReview.statOverdue} text={copy.cardsReview.statOverdueBody} />
                            <PreviewStat title={copy.cardsReview.deckFilter} text={copy.cardsReview.statDeckFilterBody} />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                {copy.cardsReview.loginCta}
                            </button>
                            <Link href="/cards" className="theme-button-secondary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition">
                                {copy.cardsReview.backToCards}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="theme-page min-h-screen pb-12">
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
                        <div className="theme-surface rounded-[36px] p-8">
                            <div className="flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: "var(--border-soft)" }}>
                                <div>
                                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.cardsReview.title}</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.cardsReview.queueTitle}</h1>
                                    <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">
                                        {copy.cardsReview.queueBody}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        value={selectedDeckId ?? ""}
                                        onChange={(event) => setSelectedDeckId(event.target.value ? Number(event.target.value) : null)}
                                        className="theme-input h-11 rounded-xl px-4 text-sm focus:outline-none"
                                    >
                                        <option value="">{copy.cardsReview.allDecks}</option>
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
                                        className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {copy.cardsReview.startReview}
                                    </button>
                                </div>
                            </div>

                            {loadingPage ? (
                                <div className="theme-faint py-16 text-center text-sm">{copy.cardsReview.loadingCenter}</div>
                            ) : (
                                <>
                                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                                        <ReviewStat label={copy.cardsReview.statDueNow} value={summary?.dueNow ?? 0} />
                                        <ReviewStat label={copy.cardsReview.statOverdue} value={summary?.overdue ?? 0} />
                                        <ReviewStat label={copy.cardsReview.statDueToday} value={summary?.dueToday ?? 0} />
                                        <ReviewStat label={copy.cardsReview.statNewCards} value={summary?.newCards ?? 0} />
                                    </div>

                                    {error && (
                                        <div className="mt-6 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                        <div className="theme-card rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.cardsReview.decksWithDueCards}</h2>
                                            <div className="mt-5 space-y-3">
                                                {dueDecks.length === 0 ? (
                                                    <div className="theme-card rounded-2xl px-4 py-4 text-sm theme-faint">
                                                        {copy.cardsReview.noDueCards}
                                                    </div>
                                                ) : dueDecks.map((deck) => (
                                                    <Link
                                                        key={deck.id}
                                                        href={`/cards/decks/${deck.id}`}
                                                        className="theme-card flex items-center justify-between rounded-2xl px-4 py-4 transition hover:bg-[var(--button-secondary-hover)]"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium">{deck.name}</div>
                                                            <div className="theme-faint mt-1 text-xs">
                                                                {formatCopy(copy.cardsReview.cardsCount, { count: deck.cardCount })} · {formatCopy(copy.cardsReview.newCount, { count: deck.newCardCount })}
                                                            </div>
                                                        </div>
                                                        <div className="theme-faint text-right text-xs">
                                                            <div>{formatCopy(copy.cardsReview.dueCount, { count: deck.dueCount })}</div>
                                                            <div>{formatCopy(copy.cardsReview.overdueCount, { count: deck.overdueCount })}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="theme-card rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.cardsReview.currentRoundPreview}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {selectedDeckId ? copy.cardsReview.filteredToOneDeck : copy.cardsReview.blendedQueue}
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {queue.length > 0 ? queue.slice(0, 5).map((card, index) => (
                                                    <div key={card.id} className="theme-card rounded-2xl px-4 py-4">
                                                        <div className="text-sm font-medium">{index + 1}. {card.title}</div>
                                                        <div className="theme-faint mt-1 text-xs">
                                                            {card.deckName || copy.cardsReview.cardsLabel} · {card.progress.status}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="theme-card rounded-2xl px-4 py-4 text-sm theme-faint">
                                                        {totalDue === 0 ? copy.cardsReview.noCardsInFilter : copy.cardsReview.nothingReady}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link href="/cards" className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                                    {copy.cardsReview.backToCards}
                                                </Link>
                                                {queue.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setReviewing(true)}
                                                        className="theme-button-primary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition"
                                                    >
                                                        {copy.cardsReview.continue}
                                                    </button>
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

export default function CardsReviewPage() {
    return (
        <Suspense
            fallback={
                <main className="theme-page min-h-screen pb-12">
                    <Navbar />
                </main>
            }
        >
            <CardsReviewPageContent />
        </Suspense>
    )
}

function ReviewStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="theme-card rounded-3xl p-5">
            <div className="theme-faint text-sm">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight">{value}</div>
        </div>
    )
}

function PreviewStat({ title, text }: { title: string; text: string }) {
    return (
        <div className="theme-card rounded-3xl p-5">
            <div className="text-sm font-medium">{title}</div>
            <div className="theme-muted mt-2 text-sm leading-6">{text}</div>
        </div>
    )
}
