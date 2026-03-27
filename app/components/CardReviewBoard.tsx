"use client"

import { useMemo, useState } from "react"
import { CardBlockList } from "@/app/components/CardBlocks"
import type { CardProgress, CardReviewItem } from "@/app/lib/cards-models"

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
            setError(submitError instanceof Error ? submitError.message : "Unable to save review result.")
        } finally {
            setSubmitting(false)
        }
    }

    if (!current) {
        return (
            <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center text-white">
                <p className="text-lg font-medium">No cards left in this round.</p>
                <button
                    type="button"
                    onClick={onComplete}
                    className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                    Back to review center
                </button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">{current.deckName || "Cards review"}</p>
                    <h1 className="mt-2 text-2xl font-medium text-white">{current.title}</h1>
                    <p className="mt-2 text-sm text-white/48">
                        Card {currentPosition} of {items.length} · {memoryBadge}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10"
                >
                    Close round
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/35">Prompt</div>
                    <div className="mt-4">
                        <CardBlockList blocks={current.promptBlocks} />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/35">Answer</div>
                    <div className="mt-4">
                        {revealed ? (
                            <CardBlockList blocks={current.answerBlocks} />
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/38">
                                Reveal the answer when you are ready to grade your recall.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {revealed && current.notesBlocks && current.notesBlocks.length > 0 && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/35">Notes</div>
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
                        className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                        Reveal answer
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={() => handleRate("again")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#b85c5c] px-5 text-sm font-medium text-white transition hover:bg-[#c26868] disabled:cursor-not-allowed disabled:opacity-70">Again</button>
                        <button type="button" onClick={() => handleRate("hard")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#8f6d4d] px-5 text-sm font-medium text-white transition hover:bg-[#9d7a57] disabled:cursor-not-allowed disabled:opacity-70">Hard</button>
                        <button type="button" onClick={() => handleRate("good")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#496b93] px-5 text-sm font-medium text-white transition hover:bg-[#567aa3] disabled:cursor-not-allowed disabled:opacity-70">Good</button>
                        <button type="button" onClick={() => handleRate("easy")} disabled={submitting} className="inline-flex h-11 items-center rounded-xl bg-[#3f7d65] px-5 text-sm font-medium text-white transition hover:bg-[#488c72] disabled:cursor-not-allowed disabled:opacity-70">Easy</button>
                    </>
                )}
            </div>
        </div>
    )
}
