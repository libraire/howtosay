import { fetchJson } from "@/app/lib/api-client"
import { getMockLiteraryPassageDetail, getMockLiteratureTimeline } from "@/app/lib/literature-mock"
import type { LiteraryPassageDetail, LiteraryTimelinePage } from "@/app/lib/literature-models"

function buildQuery(params: Record<string, string | number | undefined>): string {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            searchParams.set(key, String(value))
        }
    })

    return searchParams.toString()
}

export async function fetchLiteratureTimeline(params: {
    page?: number
    perPage?: number
    authorName?: string
    workTitle?: string
} = {}): Promise<LiteraryTimelinePage> {
    const query = buildQuery({
        page: params.page ?? 1,
        per_page: params.perPage ?? 12,
        author_name: params.authorName,
        work_title: params.workTitle,
    })

    try {
        const data = await fetchJson<LiteraryTimelinePage>(`/hts/api/v1/literary-passages?${query}`, {
            method: "GET",
        })

        if (data.data.length > 0) {
            return data
        }
    } catch (error) {
        console.warn("Falling back to mock literature timeline:", error)
    }

    return getMockLiteratureTimeline(params)
}

export async function fetchLiteraryPassageDetail(id: number | string): Promise<LiteraryPassageDetail | null> {
    try {
        const data = await fetchJson<{ status: string, passage?: LiteraryPassageDetail | null }>(`/hts/api/v1/literary-passages/${id}`, {
            method: "GET",
        })

        if (data.passage) {
            return data.passage
        }
    } catch (error) {
        console.warn("Falling back to mock literature detail:", error)
    }

    return getMockLiteraryPassageDetail(id)
}
