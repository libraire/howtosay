"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { WordModel } from "@/app/lib/dict-models"
import type { LicenseVerificationResult, ReviewQueueResponse, WordBankPage } from "@/app/lib/practice-models"

export async function fetchWordBook(page: number, level?: number, status?: string, word?: string): Promise<WordBankPage> {
    const params = new URLSearchParams({ page: String(page) })
    if (level && level !== 0) {
        params.set('level', String(level))
    }
    if (status) {
        params.set('status', status)
    }
    if (word && word.trim().length > 0) {
        params.set('word', word.trim())
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

export async function addWords(body: string, source = 'wordbook'): Promise<void> {
    await fetchJson('/hts/api/v1/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body, source }),
    })
}

export async function ignoreWord(word: string, source = 'wordbook'): Promise<void> {
    await fetchJson('/hts/api/v1/ignore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: word, source }),
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

export async function updateWordLevel(word: string, level: number, source = 'wordbook'): Promise<void> {
    await fetchJson(`/hts/api/v1/level?word=${encodeURIComponent(word)}&level=${level}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source }),
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

export async function fetchReviewQueue(limit = 20): Promise<ReviewQueueResponse> {
    const data = await fetchJson<{ words?: WordModel[]; total_due?: number }>(
        `/hts/api/v1/review/queue?limit=${encodeURIComponent(String(limit))}`,
        { method: 'GET' }
    )

    return {
        words: data.words ?? [],
        totalDue: data.total_due ?? 0,
    }
}

export async function submitReviewResult(
    word: string,
    result: 'correct' | 'hinted' | 'failed' | 'ignored' | 'skipped',
    source: string
): Promise<void> {
    await fetchJson('/hts/api/v1/review/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, result, source }),
    })
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

export async function verifyLicense(license: string): Promise<LicenseVerificationResult> {
    return fetchJson<LicenseVerificationResult>(
        `/hts/api/v1/license/verify?license=${encodeURIComponent(license)}`,
        { method: 'POST' }
    )
}
