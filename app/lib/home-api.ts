"use client"

import type { LiteraryPassage } from "@/app/lib/home-models"

const mockPassages: LiteraryPassage[] = [
    {
        id: "jane-eyre",
        excerpt: "I am no bird; and no net ensnares me: I am a free human being with an independent will, which I now exert to leave you. I care for myself. The more solitary, the more friendless, the more unsustained I am, the more I will respect myself. Laws and principles are not for the times when there is no temptation: they are for such moments as this, when body and soul rise in mutiny against their rigour.",
        author: "Charlotte Bronte",
        work: "Jane Eyre",
        year: 1847,
        accent: "#dcc38f",
    },
]

export async function fetchHomepagePassages(): Promise<LiteraryPassage[]> {
    return mockPassages
}
