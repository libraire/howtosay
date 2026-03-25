"use client"

import type { MarkedWord, SearchResult, WordBankPage, WordModel } from "@/app/lib/models"

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        credentials: 'include',
        ...init,
        headers: {
            'Accept': 'application/json',
            ...(init?.headers ?? {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data && typeof data.message === 'string'
            ? data.message
            : `Request failed with status ${response.status}`
        throw new Error(message)
    }

    return data as T
}

export async function fetchWordBook(page: number, level?: number): Promise<WordBankPage> {
    const params = new URLSearchParams({ page: String(page) })
    if (level && level !== 0) {
        params.set('level', String(level))
    }

    const data = await fetchJson<{ words?: WordModel[]; page?: number; total?: number }>(
        `/hts/api/v1/word?${params.toString()}`,
        { method: 'GET' }
    )

    return {
        words: data.words ?? [],
        page: data.page ?? page,
        total: data.total ?? 0,
    }
}

export async function addWords(body: string): Promise<void> {
    await fetchJson('/hts/api/v1/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
    })
}

export async function ignoreWord(word: string): Promise<void> {
    await fetchJson('/hts/api/v1/ignore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: word }),
    })
}

export async function markWord(word: string): Promise<void> {
    await fetchJson(`/hts/api/v1/mark?word=${encodeURIComponent(word)}`, {
        method: 'POST',
    })
}

export async function unmarkWord(word: string): Promise<void> {
    await fetchJson(`/hts/api/v1/mark?word=${encodeURIComponent(word)}`, {
        method: 'DELETE',
    })
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

export async function updateWordLevel(word: string, level: number): Promise<void> {
    await fetchJson(`/hts/api/v1/level?word=${encodeURIComponent(word)}&level=${level}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function removeWord(word: string): Promise<void> {
    await fetchJson(`/hts/api/v1/word?word=${encodeURIComponent(word)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
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

export async function fetchWordExamples(word: string): Promise<SearchResult[]> {
    const data = await fetchJson<{ results?: SearchResult[] }>(
        `/hts/api/v1/search?word=${encodeURIComponent(word)}`,
        { method: 'POST' }
    )

    return data.results ?? []
}

export async function reportWordIssue(word: string, content: string): Promise<void> {
    await fetchJson('/api/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: `${word}:${content}`, app: 'howtosay' }),
    })
}
