export interface DashboardSummary {
    dueNow: number
    learningCount: number
    reviewCount: number
    masteredCount: number
    fragileCount: number
    buildingCount: number
    stableCount: number
    addedThisWeek: number
    reviewsToday: number
    skippedToday: number
    streakDays: number
    currentLevel?: number
    nextAction: "review" | "read" | "wordbook" | string
}

export interface DashboardActivityPoint {
    date: string
    reviews: number
    added: number
}

export interface DashboardWordInsight {
    word: string
    wrongCount?: number
    hintedCount?: number
    skipCount?: number
    difficulty?: number
    stability?: number
}

export interface DashboardData {
    summary: DashboardSummary
    activity: DashboardActivityPoint[]
    weakWords: DashboardWordInsight[]
    mostSkippedWords: DashboardWordInsight[]
}
