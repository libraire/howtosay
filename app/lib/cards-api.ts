"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { CardBlock, CardDueSummary, CardModel, CardProgress, CardReviewItem, DeckSummary } from "@/app/lib/cards-models"

type RawRecord = Record<string, unknown>

function mapBlock(item: unknown): CardBlock | null {
    if (!item || typeof item !== "object") {
        return null
    }

    const record = item as RawRecord
    const type = record.type
    if (type !== "text" && type !== "image" && type !== "audio" && type !== "link") {
        return null
    }

    return {
        type,
        content: typeof record.content === "string" ? record.content : undefined,
        url: typeof record.url === "string" ? record.url : undefined,
        caption: typeof record.caption === "string" ? record.caption : null,
        meta: record.meta && typeof record.meta === "object" ? record.meta as Record<string, unknown> : null,
    }
}

function mapBlocks(items: unknown): CardBlock[] {
    if (!Array.isArray(items)) {
        return []
    }

    return items.map(mapBlock).filter((item): item is CardBlock => item !== null)
}

function mapProgress(record: RawRecord | null | undefined): CardProgress | null {
    if (!record) {
        return null
    }

    return {
        status: typeof record.status === "string" ? record.status : "new",
        memoryBadge: typeof record.memory_badge === "string" ? record.memory_badge : null,
        memoryStatus: typeof record.memory_status === "string" ? record.memory_status : null,
        difficulty: typeof record.difficulty === "number" ? record.difficulty : undefined,
        stability: typeof record.stability === "number" ? record.stability : undefined,
        lastIntervalDays: typeof record.last_interval_days === "number" ? record.last_interval_days : undefined,
        reviewCount: typeof record.review_count === "number" ? record.review_count : undefined,
        againCount: typeof record.again_count === "number" ? record.again_count : undefined,
        hardCount: typeof record.hard_count === "number" ? record.hard_count : undefined,
        goodCount: typeof record.good_count === "number" ? record.good_count : undefined,
        easyCount: typeof record.easy_count === "number" ? record.easy_count : undefined,
        lastRating: typeof record.last_rating === "string" ? record.last_rating : null,
        nextReviewAt: typeof record.next_review_at === "string" ? record.next_review_at : null,
    }
}

function mapDeck(record: RawRecord): DeckSummary {
    return {
        id: Number(record.id ?? 0),
        name: String(record.name ?? ""),
        description: typeof record.description === "string" ? record.description : null,
        archivedAt: typeof record.archived_at === "string" ? record.archived_at : null,
        isArchived: Boolean(record.is_archived),
        cardCount: Number(record.card_count ?? 0),
        dueCount: Number(record.due_count ?? 0),
        overdueCount: Number(record.overdue_count ?? 0),
        dueTodayCount: Number(record.due_today_count ?? 0),
        newCardCount: Number(record.new_card_count ?? 0),
        updatedAt: typeof record.updated_at === "string" ? record.updated_at : null,
    }
}

function mapCard(record: RawRecord): CardModel {
    return {
        id: Number(record.id ?? 0),
        deckId: Number(record.deck_id ?? 0),
        title: String(record.title ?? ""),
        promptBlocks: mapBlocks(record.prompt_blocks),
        answerBlocks: mapBlocks(record.answer_blocks),
        notesBlocks: Array.isArray(record.notes_blocks) ? mapBlocks(record.notes_blocks) : null,
        sourceType: typeof record.source_type === "string" ? record.source_type : null,
        sourceId: typeof record.source_id === "string" ? record.source_id : null,
        isActive: Boolean(record.is_active),
        updatedAt: typeof record.updated_at === "string" ? record.updated_at : null,
        progress: mapProgress(record.progress && typeof record.progress === "object" ? record.progress as RawRecord : null),
    }
}

function mapReviewCard(record: RawRecord): CardReviewItem {
    return {
        id: Number(record.id ?? 0),
        deckId: Number(record.deck_id ?? 0),
        deckName: typeof record.deck_name === "string" ? record.deck_name : null,
        title: String(record.title ?? ""),
        promptBlocks: mapBlocks(record.prompt_blocks),
        answerBlocks: mapBlocks(record.answer_blocks),
        notesBlocks: Array.isArray(record.notes_blocks) ? mapBlocks(record.notes_blocks) : null,
        isActive: Boolean(record.is_active),
        progress: mapProgress(record.progress && typeof record.progress === "object" ? record.progress as RawRecord : null) ?? { status: "new" },
    }
}

export async function fetchDecks(): Promise<DeckSummary[]> {
    const data = await fetchJson<{ decks?: RawRecord[] }>("/hts/api/v1/decks", { method: "GET" })
    return (data.decks ?? []).map(mapDeck)
}

export async function createDeck(payload: { name: string; description?: string }): Promise<DeckSummary> {
    const data = await fetchJson<{ deck?: RawRecord }>("/hts/api/v1/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    return mapDeck((data.deck ?? {}) as RawRecord)
}

export async function updateDeck(id: number, payload: { name?: string; description?: string | null; archived?: boolean }): Promise<DeckSummary> {
    const data = await fetchJson<{ deck?: RawRecord }>(`/hts/api/v1/decks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    return mapDeck((data.deck ?? {}) as RawRecord)
}

export async function deleteDeck(id: number): Promise<void> {
    await fetchJson(`/hts/api/v1/decks/${id}`, { method: "DELETE" })
}

export async function fetchDeckCards(id: number): Promise<{ deck: DeckSummary; cards: CardModel[] }> {
    const data = await fetchJson<{ deck?: RawRecord; cards?: RawRecord[] }>(`/hts/api/v1/decks/${id}/cards`, {
        method: "GET",
    })

    return {
        deck: mapDeck((data.deck ?? {}) as RawRecord),
        cards: (data.cards ?? []).map(mapCard),
    }
}

export async function createCard(deckId: number, payload: {
    title: string
    prompt_blocks: CardBlock[]
    answer_blocks: CardBlock[]
    notes_blocks?: CardBlock[] | null
    is_active?: boolean
}): Promise<CardModel> {
    const data = await fetchJson<{ card?: RawRecord }>(`/hts/api/v1/decks/${deckId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    return mapCard((data.card ?? {}) as RawRecord)
}

export async function updateCard(id: number, payload: {
    deck_id?: number
    title?: string
    prompt_blocks?: CardBlock[]
    answer_blocks?: CardBlock[]
    notes_blocks?: CardBlock[] | null
    is_active?: boolean
}): Promise<CardModel> {
    const data = await fetchJson<{ card?: RawRecord }>(`/hts/api/v1/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    return mapCard((data.card ?? {}) as RawRecord)
}

export async function deleteCard(id: number): Promise<void> {
    await fetchJson(`/hts/api/v1/cards/${id}`, { method: "DELETE" })
}

export async function fetchCardDueSummary(): Promise<CardDueSummary> {
    const data = await fetchJson<{ summary?: RawRecord; decks?: RawRecord[] }>("/hts/api/v1/cards/due-summary", {
        method: "GET",
    })

    const summary = (data.summary ?? {}) as RawRecord

    return {
        dueNow: Number(summary.due_now ?? 0),
        overdue: Number(summary.overdue ?? 0),
        dueToday: Number(summary.due_today ?? 0),
        newCards: Number(summary.new_cards ?? 0),
        decks: (data.decks ?? []).map(mapDeck),
    }
}

export async function fetchCardReviewQueue(deckId?: number | null, limit = 20): Promise<{ cards: CardReviewItem[]; totalDue: number }> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (deckId) {
        params.set("deck_id", String(deckId))
    }

    const data = await fetchJson<{ cards?: RawRecord[]; total_due?: number }>(`/hts/api/v1/cards/review/queue?${params.toString()}`, {
        method: "GET",
    })

    return {
        cards: (data.cards ?? []).map(mapReviewCard),
        totalDue: Number(data.total_due ?? 0),
    }
}

export async function submitCardReviewResult(cardId: number, rating: "again" | "hard" | "good" | "easy"): Promise<CardProgress> {
    const data = await fetchJson<{ progress?: RawRecord }>("/hts/api/v1/cards/review/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId, rating }),
    })

    return mapProgress((data.progress ?? {}) as RawRecord) ?? { status: "new" }
}
