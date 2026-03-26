export interface LiteraryTimelineItem {
    id: number
    slug: string
    title: string
    preview: string
    author_name: string
    author_country_code?: string | null
    work_title: string
    work_year: number | null
    language: string | null
    theme_accent: string | null
    cover_image_url: string | null
}

export interface LiteraryTimelinePage {
    current_page: number
    data: LiteraryTimelineItem[]
    last_page: number
    next_page_url: string | null
    per_page: number
    total: number
}

export interface LiteraryPassageDetail {
    id: number
    slug: string
    title: string
    excerpt: string
    author_name: string
    author_country_code?: string | null
    work_title: string
    work_year: number | null
    language: string | null
    theme_accent: string | null
    cover_image_url: string | null
    is_active: boolean
    is_featured: boolean
    featured_at: string | null
    display_order: number
    metadata: Record<string, unknown> | null
    is_favorited: boolean
}
