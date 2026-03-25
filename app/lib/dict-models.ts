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
}

export interface MarkedWord {
    word: string
    mark: number
}

export interface SearchResult {
    snippet: string
}
