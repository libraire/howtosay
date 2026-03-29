"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { MarkedWord, SearchResult, WordModel } from "@/app/lib/dict-models"

type WordDefinitionLookupResponse = {
    status?: string
    reason?: string
    message?: string
    word?: string
    display_word?: string
    surface_word?: string | null
    query_word?: string
    definition?: string
    en?: string
    cn?: string
    phonetic?: string
    level?: number | null
    example?: string
    cn_example?: string
    url?: string
    category?: string
}

type FetchWordDefinitionOptions = {
    matchVariations?: boolean
}

export async function fetchDefinitions(words: string[]): Promise<WordModel[]> {
    if (words.length === 0) {
        return []
    }

    const data = await fetchJson<{ words?: WordModel[] }>(
        `/hts/api/v1/definitions?words=${encodeURIComponent(words.join(','))}`,
        { method: 'GET' }
    )

    return data.words ?? []
}

export async function fetchWordDefinition(
    word: string,
    options: FetchWordDefinitionOptions = {}
): Promise<WordModel> {
    const params = new URLSearchParams({
        word,
    })

    if (options.matchVariations === false) {
        params.set("match_variations", "0")
    }

    const data = await fetchJson<WordDefinitionLookupResponse>(
        `/hts/api/v1/definition?${params.toString()}`,
        { method: 'GET' }
    )

    if (data.status !== 'ok') {
        throw new Error(data.reason || data.message || 'Word not found')
    }

    return {
        word: data.word || word,
        display_word: data.display_word || data.word || word,
        surface_word: data.surface_word || null,
        query_word: data.query_word || word,
        definition: data.definition || data.en || '',
        en: data.en || data.definition || '',
        cn: data.cn,
        phonetic: data.phonetic,
        level: typeof data.level === 'number' ? data.level : undefined,
        example: data.example,
        cn_example: data.cn_example,
        imgurl: data.url,
    }
}

export async function fetchWordExamples(word: string): Promise<SearchResult[]> {
    const data = await fetchJson<{ results?: SearchResult[] }>(
        `/hts/api/v1/search?word=${encodeURIComponent(word)}`,
        { method: 'POST' }
    )

    return data.results ?? []
}

export async function fetchDailyWords(): Promise<WordModel[]> {
    const data = await fetchJson<{ wordlist?: WordModel[] }>('/hts/api/v1/dict/daily', {
        method: 'GET',
    })

    return data.wordlist ?? []
}

export async function fetchImageWords(category: string): Promise<WordModel[]> {
    const data = await fetchJson<{ wordlist?: WordModel[] }>(
        `/hts/api/v1/dict/image?category=${encodeURIComponent(category)}`,
        { method: 'GET' }
    )

    return data.wordlist ?? []
}

export async function fetchNextWords(level: string): Promise<WordModel[]> {
    const data = await fetchJson<{ wordlist?: WordModel[] }>(
        `/api/next/words?level=${encodeURIComponent(level)}`,
        { method: 'GET' }
    )

    return data.wordlist ?? []
}

export async function fetchMarkedWords(words: string[]): Promise<MarkedWord[]> {
    if (words.length === 0) {
        return []
    }

    const data = await fetchJson<{ words?: MarkedWord[] }>(
        `/hts/api/v1/mark?words=${encodeURIComponent(words.join(','))}`,
        { method: 'GET' }
    )

    return data.words ?? []
}
