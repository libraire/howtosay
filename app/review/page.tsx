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
import { getLevelLabel } from "@/app/lib/level-options"

function panelItemClassName() {
    return "theme-button-secondary flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-[var(--button-secondary-hover)]"
}

export default function ReviewPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
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
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">Progress</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">See your review rhythm in one place</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            This page brings together your due queue, recent activity, memory profile, and the next best review action so you can keep the system healthy.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">Due queue overview</div>
                                <div className="theme-muted mt-2 text-sm leading-6">See how many words are waiting and when it makes sense to start another review round.</div>
                            </div>
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">Memory profile</div>
                                <div className="theme-muted mt-2 text-sm leading-6">Spot fragile words, stable words, and areas that still need repeated support.</div>
                            </div>
                            <div className="theme-card rounded-3xl p-5">
                                <div className="text-sm">Weekly momentum</div>
                                <div className="theme-muted mt-2 text-sm leading-6">Follow review volume, streaks, and recent additions so progress stays visible.</div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                            >
                                Login to view progress
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
                                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">Progress</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight">Learning overview</h1>
                                    <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">
                                        Track what is due, see where your memory is fragile, and jump straight into a review round when you are ready.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="theme-button-secondary rounded-full px-4 py-2 text-sm">
                                        {loadingPage ? "Loading..." : `${totalDue} words due`}
                                    </div>
                                    {canStartReview && (
                                        <button
                                            type="button"
                                            onClick={() => setPractise(true)}
                                            className="theme-button-primary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition"
                                        >
                                            Start review
                                        </button>
                                    )}
                                    {!canStartReview && !loadingPage && (
                                        <Link href="/vocabulary" className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                                            Open vocabulary
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {loadingPage || !summary ? (
                                <div className="theme-muted py-16 text-center text-sm">Loading review dashboard...</div>
                            ) : (
                                <>
                                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <StatCard label="Due now" value={summary.dueNow} hint="Words waiting in your review queue" />
                                        <StatCard label="Learning" value={summary.learningCount} hint="Words still forming stable memory" />
                                        <StatCard label="In review" value={summary.reviewCount} hint="Words in spaced repetition rotation" />
                                        <StatCard label="Mastered" value={summary.masteredCount} hint="Words currently pushed to long intervals" />
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                                        <StatCard label="Added this week" value={summary.addedThisWeek} hint="New words entering your system" />
                                        <StatCard label="Reviews today" value={summary.reviewsToday} hint={`${summary.skippedToday} skipped since midnight`} />
                                        <StatCard
                                            label="Current level"
                                            value={summary.currentLevel !== undefined ? getLevelLabel(summary.currentLevel) : "-"}
                                            hint={`${summary.streakDays} day learning streak`}
                                        />
                                    </div>

                                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                                        <div className="theme-panel rounded-3xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-medium">7-day activity</h2>
                                                    <p className="theme-muted mt-1 text-sm">Reviews and new words across the last week.</p>
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
                                                                    title={`${item.reviews} reviews`}
                                                                />
                                                                <div
                                                                    className="w-3 rounded-full"
                                                                    style={{ height: `${addHeight}px`, background: "var(--accent)", opacity: 0.88 }}
                                                                    title={`${item.added} added`}
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
                                            <h2 className="text-lg font-medium">Memory profile</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                We translate the memory model into simple states so you can tell which words are fragile, stabilizing, or already long-term.
                                            </p>

                                            <div className="mt-6 space-y-3">
                                                <Link href="/vocabulary?status=fragile" className={panelItemClassName()}>
                                                    <span>Fragile</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.fragileCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=building" className={panelItemClassName()}>
                                                    <span>Building</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.buildingCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=stable" className={panelItemClassName()}>
                                                    <span>Stable</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.stableCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=mastered" className={panelItemClassName()}>
                                                    <span>Mastered</span>
                                                    <span className="text-[color:var(--text-primary)]">{summary.masteredCount}</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">Suggested next action</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                {summary.nextAction === "review" && "Your queue already has due words. Clearing those will improve spacing quality the fastest."}
                                                {summary.nextAction === "read" && "You could add fresh input, but this page now prioritizes review first so the queue stays healthy before you branch out."}
                                                {summary.nextAction === "wordbook" && "Your queue is under control. You can still start a review round here, or refine your saved words in vocabulary."}
                                            </p>

                                            <div className="theme-muted mt-6 space-y-3 text-sm">
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {summary.dueNow} words due now
                                                </div>
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {summary.streakDays} day active streak
                                                </div>
                                                <div className="theme-button-secondary rounded-2xl px-4 py-3">
                                                    {summary.addedThisWeek} words added this week
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">Often wrong</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                Words with repeated wrong answers and rising difficulty.
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
                                                                {item.wrongCount ?? 0} wrong answers
                                                            </div>
                                                        </div>
                                                        <div className="theme-faint text-right text-xs">
                                                            <div>Difficulty {item.difficulty ?? 0}</div>
                                                            <div>Stability {item.stability ?? 0}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        No repeated wrong-answer words yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">Needs hints</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                Words you usually reach with support, but have not fully internalized yet.
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
                                                                {item.hintedCount ?? 0} hinted completions
                                                            </div>
                                                        </div>
                                                        <div className="theme-faint text-right text-xs">
                                                            <div>Difficulty {item.difficulty ?? 0}</div>
                                                            <div>Stability {item.stability ?? 0}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        No hint-heavy words yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="theme-panel rounded-3xl p-6">
                                            <h2 className="text-lg font-medium">Most skipped</h2>
                                            <p className="theme-muted mt-2 text-sm leading-7">
                                                Words you are most likely to move past before solving.
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
                                                        <div className="theme-faint text-xs">{item.skipCount ?? 0} skips</div>
                                                    </button>
                                                )) : (
                                                    <div className="theme-button-secondary theme-faint rounded-2xl px-4 py-3 text-sm">
                                                        No skipped words recorded yet.
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
