"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { createDeck, fetchDecks } from "@/app/lib/cards-api"
import type { DeckSummary } from "@/app/lib/cards-models"

export default function CardsPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [decks, setDecks] = useState<DeckSummary[]>([])
    const [loadingDecks, setLoadingDecks] = useState(true)
    const [saving, setSaving] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return
        }

        loadDecks()
    }, [isAuthenticated, isLoading])

    async function loadDecks() {
        setLoadingDecks(true)
        try {
            setDecks(await fetchDecks())
        } catch (deckError) {
            console.error("Failed to load decks:", deckError)
            setError(deckError instanceof Error ? deckError.message : "Unable to load decks.")
        } finally {
            setLoadingDecks(false)
        }
    }

    async function handleCreateDeck(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (name.trim().length === 0 || saving) {
            return
        }

        setSaving(true)
        setError("")
        try {
            const deck = await createDeck({
                name: name.trim(),
                description: description.trim(),
            })
            setDecks((prev) => [deck, ...prev])
            setName("")
            setDescription("")
        } catch (createError) {
            setError(createError instanceof Error ? createError.message : "Unable to create deck.")
        } finally {
            setSaving(false)
        }
    }

    const totalDue = useMemo(() => decks.reduce((sum, deck) => sum + deck.dueCount, 0), [decks])
    const totalCards = useMemo(() => decks.reduce((sum, deck) => sum + deck.cardCount, 0), [decks])

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
                        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Cards</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Build reusable memory decks for anything</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                            Create Anki-like cards for concepts, interview answers, language notes, or any material you want to revisit on a schedule.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <FeatureCard title="Any content" text="Mix text, images, audio, and links inside the same card." />
                            <FeatureCard title="Deck-based review" text="Group cards by topic and review only the deck you care about." />
                            <FeatureCard title="Memory curve reuse" text="Use the same scheduling engine already powering the vocabulary experience." />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                                Login to create cards
                            </button>
                            <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/10">
                                Back to home
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
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.24)]">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Cards</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Your memory decks</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                            Keep reusable review decks beside your vocabulary workflow and open a focused review round whenever cards come due.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <StatCard label="Decks" value={decks.length} />
                            <StatCard label="Cards" value={totalCards} />
                            <StatCard label="Due now" value={totalDue} />
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/cards/review"
                                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                                Open cards review
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleCreateDeck} className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.24)]">
                        <h2 className="text-xl font-medium text-white">Create a deck</h2>
                        <p className="mt-2 text-sm leading-7 text-white/48">
                            Start with a topic, then add cards inside the deck page.
                        </p>

                        <div className="mt-6 space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Deck name"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                            />
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="What kind of material lives in this deck?"
                                className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                            />
                        </div>

                        {error && (
                            <div className="mt-4 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
                        >
                            {saving ? "Creating..." : "Create deck"}
                        </button>
                    </form>
                </div>

                <div className="mt-8 rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.24)]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-medium text-white">Deck library</h2>
                            <p className="mt-2 text-sm text-white/48">Open a deck to add, edit, archive, or review its cards.</p>
                        </div>
                    </div>

                    {loadingDecks ? (
                        <div className="py-12 text-center text-sm text-white/48">Loading decks...</div>
                    ) : decks.length === 0 ? (
                        <div className="py-12 text-center text-sm text-white/48">No decks yet. Create your first deck to start building cards.</div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {decks.map((deck) => (
                                <Link
                                    key={deck.id}
                                    href={`/cards/decks/${deck.id}`}
                                    className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:bg-black/30"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-medium text-white">{deck.name}</h3>
                                            <p className="mt-2 text-sm leading-7 text-white/48">
                                                {deck.description || "No description yet."}
                                            </p>
                                        </div>
                                        {deck.isArchived && (
                                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/55">
                                                Archived
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
                                        <span>{deck.cardCount} cards</span>
                                        <span>{deck.dueCount} due</span>
                                        <span>{deck.newCardCount} new</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm text-white/45">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight text-white">{value}</div>
        </div>
    )
}

function FeatureCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm font-medium text-white">{title}</div>
            <div className="mt-2 text-sm leading-6 text-white/55">{text}</div>
        </div>
    )
}
