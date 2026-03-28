"use client"

import { useMemo, useState } from "react"
import { CardBlockList } from "@/app/components/CardBlocks"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import type { CardProgress, CardReviewItem } from "@/app/lib/cards-models"
import { formatCopy } from "@/app/lib/copy"

type Rating = "again" | "hard" | "good" | "easy"

export default function CardReviewBoard({
    items,
    onClose,
    onRate,
    onComplete,
}: {
    items: CardReviewItem[]
    onClose: () => void
    onRate: (cardId: number, rating: Rating) => Promise<CardProgress>
    onComplete: () => void
}) {
    const { copy } = useAppPreferences()
    const [queue, setQueue] = useState(items)
    const [revealed, setRevealed] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const current = queue[0]
    const currentPosition = items.length - queue.length + 1
    const memoryBadge = useMemo(() => current?.progress.memoryBadge || current?.progress.status || "new", [current])

    async function handleRate(rating: Rating) {
        if (!current || submitting) {
            return
        }

        setSubmitting(true)
        setError("")

        try {
            await onRate(current.id, rating)
            const nextQueue = queue.slice(1)
            setQueue(nextQueue)
            setRevealed(false)

            if (nextQueue.length === 0) {
                onComplete()
            }
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : copy.cardsReview.unableToSave)
        } finally {
            setSubmitting(false)
        }
    }

    if (!current) {
        return (
            <div className="theme-surface mx-auto max-w-4xl rounded-[32px] p-8 text-center">
                <p className="text-lg font-medium">{copy.cardsReview.noCardsLeft}</p>
                <button
                    type="button"
                    onClick={onComplete}
                    className="theme-button-primary mt-6 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                >
                    {copy.cardsReview.backToCenter}
                </button>
            </div>
        )
    }

    return (
        <div className="theme-surface mx-auto max-w-4xl rounded-[36px] p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-soft)" }}>
                <div>
                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{current.deckName || copy.cardsReview.title}</p>
                    <h1 className="mt-2 text-2xl font-medium">{current.title}</h1>
                    <p className="theme-muted mt-2 text-sm">
                        {formatCopy(copy.cardsReview.cardProgress, { current: currentPosition, total: items.length, badge: memoryBadge })}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition"
                >
                    {copy.cardsReview.closeRound}
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="theme-card rounded-3xl p-5">
                    <div className="theme-faint text-xs uppercase tracking-[0.24em]">{copy.cardsReview.prompt}</div>
                    <div className="mt-4">
                        <CardBlockList blocks={current.promptBlocks} />
                    </div>
                </div>

                <div className="theme-card rounded-3xl p-5">
                    <div className="theme-faint text-xs uppercase tracking-[0.24em]">{copy.cardsReview.answer}</div>
                    <div className="mt-4">
                        {revealed ? (
                            <CardBlockList blocks={current.answerBlocks} />
                        ) : (
                            <div className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm theme-faint" style={{ borderColor: "var(--border-soft)" }}>
                                {copy.cardsReview.revealHelp}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {revealed && current.notesBlocks && current.notesBlocks.length > 0 && (
                <div className="theme-card mt-6 rounded-3xl p-5">
                    <div className="theme-faint text-xs uppercase tracking-[0.24em]">{copy.cardsReview.notes}</div>
                    <div className="mt-4">
                        <CardBlockList blocks={current.notesBlocks} />
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                    {error}
                </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
                {!revealed ? (
                    <button
                        type="button"
                        onClick={() => setRevealed(true)}
                        className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                    >
                        {copy.cardsReview.revealAnswer}
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={() => handleRate("again")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#b85c5c] px-5 text-sm font-medium text-white transition hover:bg-[#c26868] disabled:cursor-not-allowed disabled:opacity-70">{copy.cardsReview.again}</button>
                        <button type="button" onClick={() => handleRate("hard")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#8f6d4d] px-5 text-sm font-medium text-white transition hover:bg-[#9d7a57] disabled:cursor-not-allowed disabled:opacity-70">{copy.cardsReview.hard}</button>
                        <button type="button" onClick={() => handleRate("good")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#496b93] px-5 text-sm font-medium text-white transition hover:bg-[#567aa3] disabled:cursor-not-allowed disabled:opacity-70">{copy.cardsReview.good}</button>
                        <button type="button" onClick={() => handleRate("easy")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#3f7d65] px-5 text-sm font-medium text-white transition hover:bg-[#488c72] disabled:cursor-not-allowed disabled:opacity-70">{copy.cardsReview.easy}</button>
                    </>
                )}
            </div>
        </div>
    )
}
