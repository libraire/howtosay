"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import CardComposer from "@/app/components/CardComposer"
import { CardBlockList } from "@/app/components/CardBlocks"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { createCard, deleteCard, deleteDeck, fetchDeckCards, updateCard, updateDeck } from "@/app/lib/cards-api"
import type { CardModel, DeckSummary } from "@/app/lib/cards-models"

export default function DeckDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [deck, setDeck] = useState<DeckSummary | null>(null)
    const [cards, setCards] = useState<CardModel[]>([])
    const [loadingDeck, setLoadingDeck] = useState(true)
    const [savingDeck, setSavingDeck] = useState(false)
    const [savingCard, setSavingCard] = useState(false)
    const [editingCardId, setEditingCardId] = useState<number | null>(null)
    const [deckName, setDeckName] = useState("")
    const [deckDescription, setDeckDescription] = useState("")
    const [error, setError] = useState("")

    const deckId = Number(params?.id ?? 0)

    useEffect(() => {
        if (isLoading || !isAuthenticated || !deckId) {
            return
        }

        void loadDeck()
    }, [deckId, isAuthenticated, isLoading])

    async function loadDeck() {
        setLoadingDeck(true)
        await refreshDeckData(true)
    }

    async function refreshDeckData(withLoadingState = false) {
        if (withLoadingState) {
            setLoadingDeck(true)
        }

        setError("")
        try {
            const data = await fetchDeckCards(deckId)
            setDeck(data.deck)
            setCards(data.cards)
            setDeckName(data.deck.name)
            setDeckDescription(data.deck.description || "")
        } catch (deckError) {
            console.error("Failed to load deck:", deckError)
            setError(deckError instanceof Error ? deckError.message : "Unable to load deck.")
        } finally {
            if (withLoadingState) {
                setLoadingDeck(false)
            }
        }
    }

    async function handleDeckSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!deck || savingDeck) {
            return
        }

        if (deckName.trim().length === 0) {
            setError("Deck name is required.")
            return
        }

        setSavingDeck(true)
        setError("")
        try {
            const nextDeck = await updateDeck(deck.id, {
                name: deckName.trim(),
                description: deckDescription.trim(),
            })
            setDeck(nextDeck)
            setDeckName(nextDeck.name)
            setDeckDescription(nextDeck.description || "")
        } catch (deckError) {
            setError(deckError instanceof Error ? deckError.message : "Unable to save deck.")
        } finally {
            setSavingDeck(false)
        }
    }

    async function handleArchiveToggle() {
        if (!deck || savingDeck) {
            return
        }

        setSavingDeck(true)
        setError("")
        try {
            const nextDeck = await updateDeck(deck.id, {
                archived: !deck.isArchived,
            })
            setDeck(nextDeck)
        } catch (deckError) {
            setError(deckError instanceof Error ? deckError.message : "Unable to update archive status.")
        } finally {
            setSavingDeck(false)
        }
    }

    async function handleDeleteDeck() {
        if (!deck) {
            return
        }

        const confirmed = window.confirm(`Delete "${deck.name}" and all of its cards?`)
        if (!confirmed) {
            return
        }

        try {
            await deleteDeck(deck.id)
            router.push("/cards")
        } catch (deckError) {
            setError(deckError instanceof Error ? deckError.message : "Unable to delete deck.")
        }
    }

    async function handleCreateCard(payload: Parameters<typeof createCard>[1]) {
        if (!deck || savingCard) {
            return
        }

        setSavingCard(true)
        setError("")
        try {
            await createCard(deck.id, payload)
            await refreshDeckData()
        } catch (cardError) {
            setError(cardError instanceof Error ? cardError.message : "Unable to create card.")
        } finally {
            setSavingCard(false)
        }
    }

    async function handleUpdateCard(cardId: number, payload: Parameters<typeof updateCard>[1]) {
        setSavingCard(true)
        setError("")
        try {
            const card = await updateCard(cardId, payload)
            setCards((prev) => prev.map((item) => item.id === cardId ? card : item))
            await refreshDeckData()
            setEditingCardId(null)
        } catch (cardError) {
            setError(cardError instanceof Error ? cardError.message : "Unable to update card.")
        } finally {
            setSavingCard(false)
        }
    }

    async function handleDeleteCard(cardId: number) {
        const confirmed = window.confirm("Delete this card?")
        if (!confirmed) {
            return
        }

        setError("")
        try {
            await deleteCard(cardId)
            await refreshDeckData()
        } catch (cardError) {
            setError(cardError instanceof Error ? cardError.message : "Unable to delete card.")
        }
    }

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
                <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-8">
                    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 text-white">
                        <h1 className="text-3xl font-medium">Login to manage this deck</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                            Deck pages let you edit the deck itself, create cards with multiple content blocks, and control which cards stay active in review.
                        </p>
                        <button
                            type="button"
                            onClick={() => login()}
                            className="mt-8 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Login to continue
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#101010] pb-12">
            <Navbar />
            <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                {loadingDeck ? (
                    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center text-sm text-white/48">
                        Loading deck...
                    </div>
                ) : !deck ? (
                    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center text-sm text-white/48">
                        Unable to load this deck.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/cards" className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10">
                                Back to cards
                            </Link>
                            <Link href={`/cards/review?deck=${deck.id}`} className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90">
                                Review this deck
                            </Link>
                        </div>

                        <form onSubmit={handleDeckSave} className="rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">Deck</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">{deck.name}</h1>
                                    <p className="mt-3 text-sm leading-7 text-white/58">
                                        {deck.cardCount} cards · {deck.dueCount} due now · {deck.newCardCount} still new
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button type="button" onClick={handleArchiveToggle} className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/10">
                                        {deck.isArchived ? "Unarchive deck" : "Archive deck"}
                                    </button>
                                    <button type="button" onClick={handleDeleteDeck} className="inline-flex h-11 items-center rounded-xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-5 text-sm font-medium text-[#f0c9c9] transition hover:bg-[#d17a7a]/15">
                                        Delete deck
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                <input
                                    type="text"
                                    value={deckName}
                                    onChange={(event) => setDeckName(event.target.value)}
                                    placeholder="Deck name"
                                    className="h-12 rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                />
                                <textarea
                                    rows={4}
                                    value={deckDescription}
                                    onChange={(event) => setDeckDescription(event.target.value)}
                                    placeholder="What does this deck cover?"
                                    className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                />
                            </div>

                            {error && (
                                <div className="mt-4 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={savingDeck}
                                className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
                            >
                                {savingDeck ? "Saving..." : "Save deck"}
                            </button>
                        </form>

                        <CardComposer submitLabel="Create card" busy={savingCard} onSubmit={handleCreateCard} />

                        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
                            <h2 className="text-xl font-medium text-white">Cards in this deck</h2>
                            <p className="mt-2 text-sm text-white/48">Edit existing cards inline, or turn them off without deleting the whole deck.</p>

                            <div className="mt-6 space-y-5">
                                {cards.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/42">
                                        No cards yet. Create your first card above.
                                    </div>
                                ) : cards.map((card) => (
                                    <div key={card.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                        {editingCardId === card.id ? (
                                            <CardComposer
                                                initialCard={card}
                                                submitLabel="Save card"
                                                busy={savingCard}
                                                onSubmit={(payload) => handleUpdateCard(card.id, payload)}
                                                onCancel={() => setEditingCardId(null)}
                                            />
                                        ) : (
                                            <>
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-white">{card.title}</h3>
                                                        <p className="mt-2 text-sm text-white/48">
                                                            {card.progress?.status || "new"} · {card.isActive ? "active" : "paused"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button type="button" onClick={() => setEditingCardId(card.id)} className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10">
                                                            Edit
                                                        </button>
                                                        <button type="button" onClick={() => handleDeleteCard(card.id)} className="inline-flex h-10 items-center rounded-xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 text-sm font-medium text-[#f0c9c9] transition hover:bg-[#d17a7a]/15">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                                    <div>
                                                        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/35">Prompt</div>
                                                        <CardBlockList blocks={card.promptBlocks} />
                                                    </div>
                                                    <div>
                                                        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/35">Answer</div>
                                                        <CardBlockList blocks={card.answerBlocks} />
                                                    </div>
                                                </div>

                                                {card.notesBlocks && card.notesBlocks.length > 0 && (
                                                    <div className="mt-4">
                                                        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/35">Notes</div>
                                                        <CardBlockList blocks={card.notesBlocks} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}
