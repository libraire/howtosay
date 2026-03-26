import type { LiteraryTimelineItem } from "@/app/lib/literature-models"

type CountryCode = "CN" | "GB" | "DE" | "RU" | "IN" | "AR" | "US" | "FR" | "IT" | "ES" | "JP" | "NG" | "EG" | "BR" | "MX"

type CountryMeta = {
    code: CountryCode
    name: string
    x: number
    y: number
    color: string
}

export type CountryHighlight = CountryMeta & {
    authors: string[]
    count: number
}

const countryMeta: Record<CountryCode, CountryMeta> = {
    CN: { code: "CN", name: "China", x: 70, y: 40, color: "#d6b06a" },
    GB: { code: "GB", name: "United Kingdom", x: 46, y: 28, color: "#92a4cf" },
    DE: { code: "DE", name: "Germany", x: 49, y: 30, color: "#9d8e74" },
    RU: { code: "RU", name: "Russia", x: 63, y: 26, color: "#8fa1c8" },
    IN: { code: "IN", name: "India", x: 64, y: 50, color: "#9d9a60" },
    AR: { code: "AR", name: "Argentina", x: 29, y: 82, color: "#8f81b3" },
    US: { code: "US", name: "United States", x: 21, y: 34, color: "#7592aa" },
    FR: { code: "FR", name: "France", x: 46, y: 33, color: "#8f7cba" },
    IT: { code: "IT", name: "Italy", x: 50, y: 36, color: "#86a06b" },
    ES: { code: "ES", name: "Spain", x: 43, y: 35, color: "#b78f5e" },
    JP: { code: "JP", name: "Japan", x: 79, y: 40, color: "#b77474" },
    NG: { code: "NG", name: "Nigeria", x: 46, y: 58, color: "#6ca288" },
    EG: { code: "EG", name: "Egypt", x: 54, y: 50, color: "#b0a061" },
    BR: { code: "BR", name: "Brazil", x: 30, y: 66, color: "#6fa27e" },
    MX: { code: "MX", name: "Mexico", x: 16, y: 42, color: "#88a46c" },
}

const authorCountryMap: Record<string, CountryCode> = {
    "孔子": "CN",
    "孟子": "CN",
    "李白": "CN",
    "苏轼": "CN",
    "屈原": "CN",
    "陶渊明": "CN",
    "王维": "CN",
    "杜甫": "CN",
    "李清照": "CN",
    "辛弃疾": "CN",
    "曹雪芹": "CN",
    "鲁迅": "CN",
    "William Shakespeare": "GB",
    "Jane Austen": "GB",
    "Charlotte Bronte": "GB",
    "Virginia Woolf": "GB",
    "Charles Dickens": "GB",
    "Johann Wolfgang von Goethe": "DE",
    "Alexander Pushkin": "RU",
    "Leo Tolstoy": "RU",
    "Rabindranath Tagore": "IN",
    "Jorge Luis Borges": "AR",
    "F. Scott Fitzgerald": "US",
    "Ernest Hemingway": "US",
    "Victor Hugo": "FR",
    "Dante Alighieri": "IT",
    "Miguel de Cervantes": "ES",
    "Natsume Soseki": "JP",
    "Chinua Achebe": "NG",
    "Naguib Mahfouz": "EG",
    "Machado de Assis": "BR",
    "Octavio Paz": "MX",
}

export function getAuthorCountryCode(authorName: string): CountryCode | null {
    return authorCountryMap[authorName] ?? null
}

export function getAuthorCountryName(authorName: string): string | null {
    const code = getAuthorCountryCode(authorName)
    return code ? countryMeta[code].name : null
}

export function getCountryHighlights(items: LiteraryTimelineItem[]): CountryHighlight[] {
    const groups = new Map<CountryCode, Set<string>>()

    items.forEach((item) => {
        const code = getAuthorCountryCode(item.author_name)

        if (!code) {
            return
        }

        if (!groups.has(code)) {
            groups.set(code, new Set())
        }

        groups.get(code)?.add(item.author_name)
    })

    return Array.from(groups.entries())
        .map(([code, authors]) => ({
            ...countryMeta[code],
            authors: Array.from(authors),
            count: authors.size,
        }))
        .sort((left, right) => left.x - right.x)
}
