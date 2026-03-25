"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { WordModel } from "@/app/lib/dict-models"
import type { LicenseVerificationResult, WordBankPage } from "@/app/lib/practice-models"

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
