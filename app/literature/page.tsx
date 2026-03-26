import { Manrope } from "next/font/google"
import LiteratureShell from "@/app/literature/LiteratureShell"
import { getMockLiteratureTimeline } from "@/app/lib/literature-mock"
import type { LiteraryTimelinePage } from "@/app/lib/literature-models"

const uiSans = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export const metadata = {
    title: "Literature Timeline - HowToSay",
    description: "Browse literary passages by author and work across a timeline.",
}

async function fetchInitialLiteratureTimeline(): Promise<LiteraryTimelinePage> {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST

    if (!apiHost) {
        return getMockLiteratureTimeline({ page: 1, perPage: 12 })
    }

    try {
        const response = await fetch(`${apiHost}/hts/api/v1/literary-passages?per_page=12`, {
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch literary passages")
        }

        const data = await response.json() as LiteraryTimelinePage

        if (data.data.length > 0) {
            return data
        }
    } catch (error) {
        console.warn("Falling back to mock literature timeline on server:", error)
    }

    return getMockLiteratureTimeline({ page: 1, perPage: 12 })
}

export default async function LiteraturePage() {
    const initialData = await fetchInitialLiteratureTimeline()

    return <LiteratureShell initialData={initialData} className={uiSans.className} />
}
