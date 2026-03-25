"use client"

import { fetchJson } from "@/app/lib/api-client"
import type { DashboardActivityPoint, DashboardData, DashboardSummary, DashboardWordInsight } from "@/app/lib/dashboard-models"

function mapSummary(data: Record<string, unknown>): DashboardSummary {
    return {
        dueNow: Number(data.due_now ?? 0),
        learningCount: Number(data.learning_count ?? 0),
        reviewCount: Number(data.review_count ?? 0),
        masteredCount: Number(data.mastered_count ?? 0),
        fragileCount: Number(data.fragile_count ?? 0),
        buildingCount: Number(data.building_count ?? 0),
        stableCount: Number(data.stable_count ?? 0),
        addedThisWeek: Number(data.added_this_week ?? 0),
        reviewsToday: Number(data.reviews_today ?? 0),
        skippedToday: Number(data.skipped_today ?? 0),
        streakDays: Number(data.streak_days ?? 0),
        currentLevel: typeof data.current_level === "number" ? data.current_level : undefined,
        nextAction: String(data.next_action ?? "review"),
    }
}

function mapActivity(items: Record<string, unknown>[]): DashboardActivityPoint[] {
    return items.map((item) => ({
        date: String(item.date ?? ""),
        reviews: Number(item.reviews ?? 0),
        added: Number(item.added ?? 0),
    }))
}

function mapInsights(items: Record<string, unknown>[]): DashboardWordInsight[] {
    return items.map((item) => ({
        word: String(item.word ?? ""),
        wrongCount: typeof item.wrong_count === "number" ? item.wrong_count : undefined,
        hintedCount: typeof item.hinted_count === "number" ? item.hinted_count : undefined,
        skipCount: typeof item.skip_count === "number" ? item.skip_count : undefined,
        difficulty: typeof item.difficulty === "number" ? item.difficulty : undefined,
        stability: typeof item.stability === "number" ? item.stability : undefined,
    }))
}

export async function fetchDashboard(): Promise<DashboardData> {
    const data = await fetchJson<{
        summary?: Record<string, unknown>;
        activity?: Record<string, unknown>[];
        often_wrong_words?: Record<string, unknown>[];
        needs_hints_words?: Record<string, unknown>[];
        most_skipped_words?: Record<string, unknown>[];
    }>(
        "/hts/api/v1/dashboard",
        { method: "GET" }
    )

    return {
        summary: mapSummary(data.summary ?? {}),
        activity: mapActivity(data.activity ?? []),
        oftenWrongWords: mapInsights(data.often_wrong_words ?? []),
        needsHintsWords: mapInsights(data.needs_hints_words ?? []),
        mostSkippedWords: mapInsights(data.most_skipped_words ?? []),
    }
}
