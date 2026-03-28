"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { createDeck, fetchDecks } from "@/app/lib/cards-api"
import type { DeckSummary } from "@/app/lib/cards-models"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

export default function CardsPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const { copy } = useAppPreferences()
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
            setError(deckError instanceof Error ? deckError.message : copy.cards.loadDecksFailed)
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
            setError(createError instanceof Error ? createError.message : copy.cards.createDeckFailed)
        } finally {
            setSaving(false)
        }
    }

    const totalDue = useMemo(() => decks.reduce((sum, deck) => sum + deck.dueCount, 0), [decks])
    const totalCards = useMemo(() => decks.reduce((sum, deck) => sum + deck.cardCount, 0), [decks])

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
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.cards.title}</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.cards.marketingTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.cards.marketingBody}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <FeatureCard title={copy.cards.feature1Title} text={copy.cards.feature1Body} />
                            <FeatureCard title={copy.cards.feature2Title} text={copy.cards.feature2Body} />
                            <FeatureCard title={copy.cards.feature3Title} text={copy.cards.feature3Body} />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                {copy.cards.loginCta}
                            </button>
                            <Link href="/" className="theme-button-secondary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition">
                                {copy.common.backHome}
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
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="theme-surface rounded-[36px] p-8">
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.cards.title}</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.cards.decksTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.cards.decksBody}
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <StatCard label={copy.cards.statsDecks} value={decks.length} />
                            <StatCard label={copy.cards.statsCards} value={totalCards} />
                            <StatCard label={copy.cards.statsDueNow} value={totalDue} />
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/cards/review"
                                className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                {copy.cards.openReview}
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleCreateDeck} className="theme-surface rounded-[36px] p-8">
                        <h2 className="text-xl font-medium">{copy.cards.createDeckTitle}</h2>
                        <p className="theme-faint mt-2 text-sm leading-7">
                            {copy.cards.createDeckBody}
                        </p>

                        <div className="mt-6 space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder={copy.cards.deckName}
                                className="theme-input h-12 w-full rounded-2xl px-4 text-sm focus:outline-none"
                            />
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder={copy.cards.deckDescription}
                                className="theme-input w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
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
                            className="theme-button-primary mt-6 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? copy.cards.creatingDeck : copy.cards.createDeck}
                        </button>
                    </form>
                </div>

                <div className="theme-surface mt-8 rounded-[36px] p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-medium">{copy.cards.libraryTitle}</h2>
                            <p className="theme-faint mt-2 text-sm">{copy.cards.libraryBody}</p>
                        </div>
                    </div>

                    {loadingDecks ? (
                        <div className="theme-faint py-12 text-center text-sm">{copy.cards.loadingDecks}</div>
                    ) : decks.length === 0 ? (
                        <div className="theme-faint py-12 text-center text-sm">{copy.cards.emptyDecks}</div>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {decks.map((deck) => (
                                <Link
                                    key={deck.id}
                                    href={`/cards/decks/${deck.id}`}
                                    className="theme-card rounded-3xl p-5 transition hover:bg-[var(--button-secondary-hover)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-medium">{deck.name}</h3>
                                            <p className="theme-faint mt-2 text-sm leading-7">
                                                {deck.description || copy.common.noDescription}
                                            </p>
                                        </div>
                                        {deck.isArchived && (
                                            <span className="theme-button-secondary rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">
                                                {copy.common.archived}
                                            </span>
                                        )}
                                    </div>

                                    <div className="theme-faint mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
                                        <span>{copy.cards.cardsCount.replace("{count}", String(deck.cardCount))}</span>
                                        <span>{copy.cards.dueCount.replace("{count}", String(deck.dueCount))}</span>
                                        <span>{copy.cards.newCount.replace("{count}", String(deck.newCardCount))}</span>
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
        <div className="theme-card rounded-3xl p-5">
            <div className="theme-faint text-sm">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight">{value}</div>
        </div>
    )
}

function FeatureCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="theme-card rounded-3xl p-5">
            <div className="text-sm font-medium">{title}</div>
            <div className="theme-muted mt-2 text-sm leading-6">{text}</div>
        </div>
    )
}
