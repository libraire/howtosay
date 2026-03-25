export interface LiteraryPassage {
    id: number | string
    slug?: string
    title?: string
    excerpt: string
    author: string
    work: string
    year?: number
    accent: string
    isFavorited?: boolean
    isPersisted?: boolean
}
