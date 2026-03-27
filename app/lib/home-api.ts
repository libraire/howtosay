"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { WordModel } from "@/app/lib/dict-models"
import type { LiteraryPassage } from "@/app/lib/home-models"

const mockPassage: LiteraryPassage = {
    id: "jane-eyre",
    slug: "jane-eyre",
    title: "Jane Eyre",
    excerpt: "I am no bird; and no net ensnares me: I am a free human being with an independent will, which I now exert to leave you. I care for myself. The more solitary, the more friendless, the more unsustained I am, the more I will respect myself. Laws and principles are not for the times when there is no temptation: they are for such moments as this, when body and soul rise in mutiny against their rigour.",
    author: "Charlotte Bronte",
    work: "Jane Eyre",
    year: 1847,
    accent: "#dcc38f",
    isFavorited: false,
    isPersisted: false,
    practiceWords: [],
}

function mapPracticeWords(data: unknown): WordModel[] {
    if (!Array.isArray(data)) {
        return []
    }

    return data
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
            word: typeof item.word === "string" ? item.word : "",
            display_word: typeof item.display_word === "string" ? item.display_word : undefined,
            surface_word: typeof item.surface_word === "string" ? item.surface_word : null,
            definition: typeof item.definition === "string" ? item.definition : undefined,
            cn: typeof item.cn === "string" ? item.cn : undefined,
            phonetic: typeof item.phonetic === "string" ? item.phonetic : undefined,
            level: typeof item.level === "number" ? item.level : undefined,
            in_bank: typeof item.in_bank === "boolean" ? item.in_bank : undefined,
            canonical: typeof item.canonical === "string" ? item.canonical : undefined,
            memory_badge: typeof item.memory_badge === "string" ? item.memory_badge : null,
            memory_status: typeof item.memory_status === "string" ? item.memory_status : null,
            progress_status: typeof item.progress_status === "string" ? item.progress_status : null,
            difficulty: typeof item.difficulty === "number" ? item.difficulty : null,
            stability: typeof item.stability === "number" ? item.stability : null,
        }))
        .filter((item) => item.word.length > 0)
}

function mapPassage(data: Record<string, unknown>): LiteraryPassage {
    return {
        id: typeof data.id === "number" || typeof data.id === "string" ? data.id : 0,
        slug: typeof data.slug === "string" ? data.slug : undefined,
        title: typeof data.title === "string" ? data.title : undefined,
        excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
        author: typeof data.author_name === "string" ? data.author_name : "",
        work: typeof data.work_title === "string" ? data.work_title : "",
        year: typeof data.work_year === "number" ? data.work_year : undefined,
        accent: typeof data.theme_accent === "string" && data.theme_accent.length > 0 ? data.theme_accent : "#dcc38f",
        isFavorited: Boolean(data.is_favorited),
        isPersisted: true,
        practiceWords: mapPracticeWords(data.practice_words),
    }
}

export async function fetchHomepagePassage(): Promise<LiteraryPassage> {
    try {
        const data = await fetchJson<{ passage?: Record<string, unknown> | null }>('/hts/api/v1/home/passage', {
            method: 'GET',
        })

        if (data.passage) {
            return mapPassage(data.passage)
        }
    } catch (error) {
        console.error("Failed to fetch featured passage, falling back to mock:", error)
    }

    return mockPassage
}

export async function favoriteHomepagePassage(id: number | string): Promise<void> {
    await fetchJson(`/hts/api/v1/literary-passages/${id}/favorite`, {
        method: 'POST',
    })
}

export async function unfavoriteHomepagePassage(id: number | string): Promise<void> {
    await fetchJson(`/hts/api/v1/literary-passages/${id}/favorite`, {
        method: 'DELETE',
    })
}
