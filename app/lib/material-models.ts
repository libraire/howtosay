import type { WordModel } from "@/app/lib/dict-models"

export interface MaterialModel {
    id: number
    title?: string
    content: string
}

export interface MaterialWordsResult {
    words: WordModel[]
}
