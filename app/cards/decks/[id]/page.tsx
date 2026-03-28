"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import CardComposer from "@/app/components/CardComposer"
import { CardBlockList } from "@/app/components/CardBlocks"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { createCard, deleteCard, deleteDeck, fetchDeckCards, updateCard, updateDeck } from "@/app/lib/cards-api"
import type { CardModel, DeckSummary } from "@/app/lib/cards-models"
import { formatCopy } from "@/app/lib/copy"

export default function DeckDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const { copy } = useAppPreferences()
    const [deck, setDeck] = useState<DeckSummary | null>(null)
    const [cards, setCards] = useState<CardModel[]>([])
    const [loadingDeck, setLoadingDeck] = useState(true)
    const [savingDeck, setSavingDeck] = useState(false)
    const [savingCard, setSavingCard] = useState(false)
    const [editingCardId, setEditingCardId] = useState<number | null>(null)
    const [deckName, setDeckName] = useState("")
    const [deckDescription, setDeckDescription] = useState("")
    const [error, setError] = useState("")

    function formatCardStatus(status?: string | null) {
        if (!status) {
            return copy.deckDetail.statusNew
        }

        return copy.cardsReview.badges[status] || status
    }

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
            setError(deckError instanceof Error ? deckError.message : copy.deckDetail.unableToLoadDeck)
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
            setError(copy.deckDetail.deckNameRequired)
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
            setError(deckError instanceof Error ? deckError.message : copy.deckDetail.unableToSaveDeck)
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
            setError(deckError instanceof Error ? deckError.message : copy.deckDetail.unableToUpdateArchive)
        } finally {
            setSavingDeck(false)
        }
    }

    async function handleDeleteDeck() {
        if (!deck) {
            return
        }

        const confirmed = window.confirm(formatCopy(copy.deckDetail.deleteDeckConfirm, { name: deck.name }))
        if (!confirmed) {
            return
        }

        try {
            await deleteDeck(deck.id)
            router.push("/cards")
        } catch (deckError) {
            setError(deckError instanceof Error ? deckError.message : copy.deckDetail.unableToDeleteDeck)
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
            setError(cardError instanceof Error ? cardError.message : copy.deckDetail.unableToCreateCard)
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
            setError(cardError instanceof Error ? cardError.message : copy.deckDetail.unableToUpdateCard)
        } finally {
            setSavingCard(false)
        }
    }

    async function handleDeleteCard(cardId: number) {
        const confirmed = window.confirm(copy.deckDetail.deleteCardConfirm)
        if (!confirmed) {
            return
        }

        setError("")
        try {
            await deleteCard(cardId)
            await refreshDeckData()
        } catch (cardError) {
            setError(cardError instanceof Error ? cardError.message : copy.deckDetail.unableToDeleteCard)
        }
    }

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
                <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-8">
                    <div className="theme-surface rounded-[36px] p-8">
                        <h1 className="text-3xl font-medium">{copy.deckDetail.loginTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.deckDetail.loginBody}
                        </p>
                        <button
                            type="button"
                            onClick={() => login()}
                            className="theme-button-primary mt-8 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                        >
                            {copy.deckDetail.loginCta}
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="theme-page min-h-screen pb-12">
            <Navbar />
            <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                {loadingDeck ? (
                    <div className="theme-surface px-6 py-16 text-center text-sm theme-faint rounded-[36px]">
                        {copy.deckDetail.loading}
                    </div>
                ) : !deck ? (
                    <div className="theme-surface px-6 py-16 text-center text-sm theme-faint rounded-[36px]">
                        {copy.deckDetail.unableToLoad}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/cards" className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                {copy.deckDetail.backToCards}
                            </Link>
                            <Link href={`/cards/review?deck=${deck.id}`} className="theme-button-primary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                {copy.deckDetail.reviewThisDeck}
                            </Link>
                        </div>

                        <form onSubmit={handleDeckSave} className="theme-surface rounded-[36px] p-8">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.deckDetail.eyebrow}</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight">{deck.name}</h1>
                                    <p className="theme-muted mt-3 text-sm leading-7">
                                        {formatCopy(copy.deckDetail.deckStats, { cards: deck.cardCount, due: deck.dueCount, newCards: deck.newCardCount })}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button type="button" onClick={handleArchiveToggle} className="theme-button-secondary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition">
                                        {deck.isArchived ? copy.deckDetail.unarchiveDeck : copy.deckDetail.archiveDeck}
                                    </button>
                                    <button type="button" onClick={handleDeleteDeck} className="inline-flex h-11 items-center rounded-xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-5 text-sm font-medium text-[#f0c9c9] transition hover:bg-[#d17a7a]/15">
                                        {copy.deckDetail.deleteDeck}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                <input
                                    type="text"
                                    value={deckName}
                                    onChange={(event) => setDeckName(event.target.value)}
                                    placeholder={copy.deckDetail.deckNamePlaceholder}
                                    className="theme-input h-12 rounded-2xl px-4 text-sm focus:outline-none"
                                />
                                <textarea
                                    rows={4}
                                    value={deckDescription}
                                    onChange={(event) => setDeckDescription(event.target.value)}
                                    placeholder={copy.deckDetail.deckDescriptionPlaceholder}
                                    className="theme-input rounded-2xl px-4 py-3 text-sm focus:outline-none"
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
                                className="theme-button-primary mt-6 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingDeck ? copy.deckDetail.savingDeck : copy.deckDetail.saveDeck}
                            </button>
                        </form>

                        <CardComposer submitLabel={copy.deckDetail.createCard} busy={savingCard} onSubmit={handleCreateCard} />

                        <div className="theme-surface rounded-[36px] p-6">
                            <h2 className="text-xl font-medium">{copy.deckDetail.cardsInDeck}</h2>
                            <p className="theme-muted mt-2 text-sm">{copy.deckDetail.cardsInDeckBody}</p>

                            <div className="mt-6 space-y-5">
                                {cards.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed px-5 py-10 text-center text-sm theme-faint" style={{ borderColor: "var(--border-soft)" }}>
                                        {copy.deckDetail.noCards}
                                    </div>
                                ) : cards.map((card) => (
                                    <div key={card.id} className="theme-card rounded-3xl p-5">
                                        {editingCardId === card.id ? (
                                            <CardComposer
                                                initialCard={card}
                                                submitLabel={copy.deckDetail.saveCard}
                                                busy={savingCard}
                                                onSubmit={(payload) => handleUpdateCard(card.id, payload)}
                                                onCancel={() => setEditingCardId(null)}
                                            />
                                        ) : (
                                            <>
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium">{card.title}</h3>
                                                        <p className="theme-muted mt-2 text-sm">
                                                            {formatCardStatus(card.progress?.status)} · {card.isActive ? copy.deckDetail.statusActive : copy.deckDetail.statusPaused}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button type="button" onClick={() => setEditingCardId(card.id)} className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                                            {copy.deckDetail.edit}
                                                        </button>
                                                        <button type="button" onClick={() => handleDeleteCard(card.id)} className="inline-flex h-10 items-center rounded-xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 text-sm font-medium text-[#f0c9c9] transition hover:bg-[#d17a7a]/15">
                                                            {copy.deckDetail.delete}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                                    <div>
                                                        <div className="theme-faint mb-3 text-xs uppercase tracking-[0.18em]">{copy.deckDetail.prompt}</div>
                                                        <CardBlockList blocks={card.promptBlocks} />
                                                    </div>
                                                    <div>
                                                        <div className="theme-faint mb-3 text-xs uppercase tracking-[0.18em]">{copy.deckDetail.answer}</div>
                                                        <CardBlockList blocks={card.answerBlocks} />
                                                    </div>
                                                </div>

                                                {card.notesBlocks && card.notesBlocks.length > 0 && (
                                                    <div className="mt-4">
                                                        <div className="theme-faint mb-3 text-xs uppercase tracking-[0.18em]">{copy.deckDetail.notes}</div>
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
