export type CardBlockType = "text" | "image" | "audio" | "link"

export interface CardBlock {
    type: CardBlockType
    content?: string
    url?: string
    caption?: string | null
    meta?: Record<string, unknown> | null
}

export interface CardProgress {
    status: string
    memoryBadge?: string | null
    memoryStatus?: string | null
    difficulty?: number
    stability?: number
    lastIntervalDays?: number
    reviewCount?: number
    againCount?: number
    hardCount?: number
    goodCount?: number
    easyCount?: number
    lastRating?: string | null
    nextReviewAt?: string | null
}

export interface DeckSummary {
    id: number
    name: string
    description?: string | null
    archivedAt?: string | null
    isArchived: boolean
    cardCount: number
    dueCount: number
    overdueCount: number
    dueTodayCount: number
    newCardCount: number
    updatedAt?: string | null
}

export interface CardModel {
    id: number
    deckId: number
    title: string
    promptBlocks: CardBlock[]
    answerBlocks: CardBlock[]
    notesBlocks?: CardBlock[] | null
    sourceType?: string | null
    sourceId?: string | null
    isActive: boolean
    updatedAt?: string | null
    progress?: CardProgress | null
}

export interface CardReviewItem {
    id: number
    deckId: number
    deckName?: string | null
    title: string
    promptBlocks: CardBlock[]
    answerBlocks: CardBlock[]
    notesBlocks?: CardBlock[] | null
    isActive: boolean
    progress: CardProgress
}

export interface CardDueSummary {
    dueNow: number
    overdue: number
    dueToday: number
    newCards: number
    decks: DeckSummary[]
}
