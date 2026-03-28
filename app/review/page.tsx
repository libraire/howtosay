"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AudioComponent from "@/app/components/AudioComponent"
import Navbar from "@/app/components/Navbar"
import PractiseComponent from "@/app/components/PractiseComponent"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import type { Word } from "@/app/components/types"
import { fetchReviewQueue } from "@/app/lib/practice-api"
import { fetchDashboard } from "@/app/lib/dashboard-api"
import type { DashboardData } from "@/app/lib/dashboard-models"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { formatCopy } from "@/app/lib/copy"
import { getLevelLabel } from "@/app/lib/level-options"

function panelItemClassName() {
    return "theme-button-secondary flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-[var(--button-secondary-hover)]"
}

export default function ReviewPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const { copy, locale } = useAppPreferences()
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [wordList, setWordList] = useState<Word[]>([])
    const [totalDue, setTotalDue] = useState(0)
    const [loadingPage, setLoadingPage] = useState(true)
    const [practise, setPractise] = useState(false)

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return
        }

        loadReviewPage()
    }, [isAuthenticated, isLoading])

    async function loadReviewPage() {
        setLoadingPage(true)
        try {
            const [dashboardData, queueData] = await Promise.all([
                fetchDashboard(),
                fetchReviewQueue(20),
            ])

            setDashboard(dashboardData)
            setWordList(queueData.words as Word[])
            setTotalDue(queueData.totalDue)
        } catch (error) {
            console.error("Failed to load review page:", error)
            setDashboard(null)
            setWordList([])
            setTotalDue(0)
        } finally {
            setLoadingPage(false)
        }
    }

    if (isLoading) {
        return (
            <main className="theme-page flex min-h-screen flex-col items-center pb-10">
                <Navbar />
            </main>
        )
    }

    if (!isAuthenticated) {
        return (
            <main className="theme-page min-h-screen pb-12">
                <Navbar />
                <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                    <div className="theme-surface rounded-[32px] p-8">
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.reviewPage.eyebrow}</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.reviewPage.loginTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.reviewPage.loginBody}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">{copy.reviewPage.feature1Title}</div>
                                <div className="theme-muted mt-2 text-sm leading-6">{copy.reviewPage.feature1Body}</div>
                            </div>
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">{copy.reviewPage.feature2Title}</div>
                                <div className="theme-muted mt-2 text-sm leading-6">{copy.reviewPage.feature2Body}</div>
                            </div>
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">{copy.reviewPage.feature3Title}</div>
                                <div className="theme-muted mt-2 text-sm leading-6">{copy.reviewPage.feature3Body}</div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                {copy.reviewPage.loginCta}
                            </button>
                            <Link
                                href="/"
                                className="theme-button-secondary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    const summary = dashboard?.summary
    const activity = dashboard?.activity ?? []
    const oftenWrongWords = dashboard?.oftenWrongWords ?? []
    const needsHintsWords = dashboard?.needsHintsWords ?? []
    const mostSkippedWords = dashboard?.mostSkippedWords ?? []
    const maxBar = Math.max(1, ...activity.map((item) => Math.max(item.reviews, item.added)))
    const canStartReview = !loadingPage && wordList.length > 0

    return (
        <main className="theme-page min-h-screen pb-12">
            <Navbar />

            {practise ? (
                <div className="mt-16">
                    <AudioComponent str={"xxxx"} />
                    <PractiseComponent
                        list={wordList}
                        onClose={() => {
                            setPractise(false)
                            loadReviewPage()
                        }}
                        mode="review"
                    />
                </div>
            ) : (
                <>
                    <AudioComponent str={"xxxx"} />

                    <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                        <div className="theme-surface rounded-[32px] p-6">
                            <div className="flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: "var(--border-soft)" }}>
                                <div>
                                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.reviewPage.eyebrow}</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.reviewPage.title}</h1>
                                    <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">
                                        {copy.reviewPage.intro}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="theme-button-secondary rounded-full px-4 py-2 text-sm">
                                        {loadingPage ? copy.reviewPage.loadingBadge : formatCopy(copy.reviewPage.wordsDue, { count: totalDue })}
                                    </div>
                                    {canStartReview && (
                                        <button
                                            type="button"
                                            onClick={() => setPractise(true)}
                                            className="theme-button-primary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition"
                                        >
                                            {copy.reviewPage.startReview}
                                        </button>
                                    )}
                                    {!canStartReview && !loadingPage && (
                                        <Link href="/vocabulary" className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                            {copy.reviewPage.openVocabulary}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {loadingPage || !summary ? (
                                <div className="theme-muted py-16 text-center text-sm">{copy.reviewPage.loading}</div>
                            ) : (
                                <>
                                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <StatCard label={copy.reviewPage.statDueNow} value={summary.dueNow} hint={copy.reviewPage.statDueNowHint} />
                                        <StatCard label={copy.reviewPage.statLearning} value={summary.learningCount} hint={copy.reviewPage.statLearningHint} />
                                        <StatCard label={copy.reviewPage.statInReview} value={summary.reviewCount} hint={copy.reviewPage.statInReviewHint} />
                                        <StatCard label={copy.reviewPage.statMastered} value={summary.masteredCount} hint={copy.reviewPage.statMasteredHint} />
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                                        <StatCard label={copy.reviewPage.statAddedThisWeek} value={summary.addedThisWeek} hint={copy.reviewPage.statAddedThisWeekHint} />
                                        <StatCard label={copy.reviewPage.statReviewsToday} value={summary.reviewsToday} hint={formatCopy(copy.reviewPage.statReviewsTodayHint, { count: summary.skippedToday })} />
                                        <StatCard
                                            label={copy.reviewPage.statCurrentLevel}
                                            value={summary.currentLevel !== undefined ? getLevelLabel(summary.currentLevel, locale) : "-"}
                                            hint={formatCopy(copy.reviewPage.statCurrentLevelHint, { count: summary.streakDays })}
                                        />
                                    </div>

                                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                                        <div className="theme-panel rounded-3xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-medium">{copy.reviewPage.activityTitle}</h2>
                                                    <p className="theme-muted mt-1 text-sm">{copy.reviewPage.activityBody}</p>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-end gap-3">
                                                {activity.map((item) => {
                                                    const reviewHeight = Math.max(8, (item.reviews / maxBar) * 140)
                                                    const addHeight = Math.max(6, (item.added / maxBar) * 90)
                                                    return (
                                                        <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
                                                            <div className="flex h-40 items-end gap-1">
                                                                <div
                                                                    className="w-3 rounded-full"
                                                                    style={{ height: `${reviewHeight}px`, background: "var(--text-primary)", opacity: 0.76 }}
                                                                    title={formatCopy(copy.reviewPage.reviewsBarTitle, { count: item.reviews })}
                                                                />
                                                                <div
                                                                    className="w-3 rounded-full"
                                                                    style={{ height: `${addHeight}px`, background: "var(--accent)", opacity: 0.88 }}
                                                                    title={formatCopy(copy.reviewPage.addedBarTitle, { count: item.added })}
                                                                />
                                                            </div>
                                                            <div className="theme-faint text-[11px] uppercase tracking-[0.18em]">
                                                                {item.date.slice(5)}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.reviewPage.memoryProfileTitle}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {copy.reviewPage.memoryProfileBody}
                                            </p>

                                            <div className="mt-6 space-y-3">
                                                <Link href="/vocabulary?status=fragile" className={panelItemClassName()}>
                                                    <span>{copy.reviewPage.fragile}</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.fragileCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=building" className={panelItemClassName()}>
                                                    <span>{copy.reviewPage.building}</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.buildingCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=stable" className={panelItemClassName()}>
                                                    <span>{copy.reviewPage.stable}</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.stableCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=mastered" className={panelItemClassName()}>
                                                    <span>{copy.reviewPage.mastered}</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.masteredCount}</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.reviewPage.nextActionTitle}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {summary.nextAction === "review" && copy.reviewPage.nextActionReview}
                                                {summary.nextAction === "read" && copy.reviewPage.nextActionRead}
                                                {summary.nextAction === "wordbook" && copy.reviewPage.nextActionWordbook}
                                            </p>

                                            <div className="theme-muted mt-6 space-y-3 text-sm">
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {formatCopy(copy.reviewPage.dueNowSummary, { count: summary.dueNow })}
                                                </div>
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {formatCopy(copy.reviewPage.streakSummary, { count: summary.streakDays })}
                                                </div>
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {formatCopy(copy.reviewPage.addedThisWeekSummary, { count: summary.addedThisWeek })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.reviewPage.oftenWrongTitle}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {copy.reviewPage.oftenWrongBody}
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {oftenWrongWords.length > 0 ? oftenWrongWords.map((item) => (
                                                    <Link
                                                        key={item.word}
                                                        href="/vocabulary?status=fragile"
                                                        className={panelItemClassName()}
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium">{item.word}</div>
                                                            <div className="theme-faint mt-1 text-xs">
                                                                {formatCopy(copy.reviewPage.wrongAnswers, { count: item.wrongCount ?? 0 })}
                                                            </div>
                                                        </div>
                                                        <div className="theme-faint text-right text-xs">
                                                            <div>{formatCopy(copy.reviewPage.difficulty, { count: item.difficulty ?? 0 })}</div>
                                                            <div>{formatCopy(copy.reviewPage.stability, { count: item.stability ?? 0 })}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        {copy.reviewPage.noOftenWrong}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.reviewPage.needsHintsTitle}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {copy.reviewPage.needsHintsBody}
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {needsHintsWords.length > 0 ? needsHintsWords.map((item) => (
                                                    <Link
                                                        key={item.word}
                                                        href="/vocabulary?status=fragile"
                                                        className={panelItemClassName()}
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium">{item.word}</div>
                                                            <div className="theme-faint mt-1 text-xs">
                                                                {formatCopy(copy.reviewPage.hintedCompletions, { count: item.hintedCount ?? 0 })}
                                                            </div>
                                                        </div>
                                                        <div className="theme-faint text-right text-xs">
                                                            <div>{formatCopy(copy.reviewPage.difficulty, { count: item.difficulty ?? 0 })}</div>
                                                            <div>{formatCopy(copy.reviewPage.stability, { count: item.stability ?? 0 })}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        {copy.reviewPage.noNeedsHints}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">{copy.reviewPage.mostSkippedTitle}</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {copy.reviewPage.mostSkippedBody}
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {mostSkippedWords.length > 0 ? mostSkippedWords.map((item) => (
                                                    <button
                                                        key={item.word}
                                                        type="button"
                                                        onClick={() => setPractise(true)}
                                                        className={`${panelItemClassName()} w-full`}
                                                    >
                                                        <div className="text-sm font-medium">{item.word}</div>
                                                        <div className="theme-faint text-xs">{formatCopy(copy.reviewPage.skips, { count: item.skipCount ?? 0 })}</div>
                                                    </button>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        {copy.reviewPage.noMostSkipped}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </>
            )}
        </main>
    )
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
    return (
        <div className="theme-card rounded-3xl p-5">
            <div className="theme-faint text-sm">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight">{value}</div>
            <div className="theme-muted mt-2 text-sm leading-6">{hint}</div>
        </div>
    )
}
