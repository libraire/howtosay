"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { WordModel } from "@/app/lib/dict-models"
import type { MaterialModel } from "@/app/lib/material-models"

export async function fetchMaterial(id: string): Promise<MaterialModel | null> {
    const data = await fetchJson<{ status: string; article?: MaterialModel }>(
        `/hts/api/v1/material?id=${encodeURIComponent(id)}`,
        { method: 'GET' }
    )

    return data.status === 'ok' && data.article ? data.article : null
}

export async function filterWordsFromContent(content: string): Promise<WordModel[]> {
    const data = await fetchJson<{ words?: WordModel[] }>('/hts/api/v1/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            app: 'howtosay',
            body: content,
        }),
    })

    return data.words ?? []
}
