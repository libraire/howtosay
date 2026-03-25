import type { WordModel } from "@/app/lib/dict-models"

export interface WordBankPage {
    words: WordModel[]
    page: number
    total: number
}

export interface LicenseVerificationResult {
    status: string
    reason?: string
}
