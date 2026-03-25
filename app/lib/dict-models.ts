export interface WordModel {
    word: string
    definition?: string
    imgurl?: string
    emoji?: string
    marked?: boolean
    level?: number
    query_count?: number
    phonetic?: string
    cn?: string
    in_bank?: boolean
    canonical?: string
    memory_badge?: string | null
    memory_status?: string | null
    difficulty?: number | null
    stability?: number | null
}

export interface MarkedWord {
    word: string
    mark: number
}

export interface SearchResult {
    snippet: string
}
