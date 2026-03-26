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

export default function ReviewPage() {
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [wordList, setWordList] = useState<Word[]>([])
    const [totalDue, setTotalDue] = useState(0)
    const [loadingPage, setLoadingPage] = useState(true)
    const [practise, setPractise] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login()
            return
        }

        if (isAuthenticated) {
            loadReviewPage()
        }
    }, [isAuthenticated, isLoading, login])

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

    if (isLoading || !isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
                <Navbar />
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
        <main className="min-h-screen bg-[#101010] pb-12">
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
                        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">Review</p>
                                    <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Learning overview</h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                                        Review now uses the dashboard as its home base: check what is due, see where your memory is fragile, then jump straight into the queue.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
                                        {loadingPage ? "Loading..." : `${totalDue} words due`}
                                    </div>
                                    {canStartReview && (
                                        <button
                                            type="button"
                                            onClick={() => setPractise(true)}
                                            className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
                                        >
                                            Start review
                                        </button>
                                    )}
                                    {!canStartReview && !loadingPage && (
                                        <Link href="/vocabulary" className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10">
                                            Open vocabulary
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {loadingPage || !summary ? (
                                <div className="py-16 text-center text-sm text-white/50">Loading review dashboard...</div>
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
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-medium text-white">7-day activity</h2>
                                                    <p className="mt-1 text-sm text-white/50">Reviews and new words across the last week.</p>
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
                                                                    className="w-3 rounded-full bg-white/80"
                                                                    style={{ height: `${reviewHeight}px` }}
                                                                    title={`${item.reviews} reviews`}
                                                                />
                                                                <div
                                                                    className="w-3 rounded-full bg-[#9bb7d4]"
                                                                    style={{ height: `${addHeight}px` }}
                                                                    title={`${item.added} added`}
                                                                />
                                                            </div>
                                                            <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                                                {item.date.slice(5)}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Memory profile</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                We translate the memory model into simple states so you can tell which words are fragile, stabilizing, or already long-term.
                                            </p>

                                            <div className="mt-6 space-y-3 text-sm text-white/70">
                                                <Link href="/vocabulary?status=fragile" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]">
                                                    <span>Fragile</span>
                                                    <span className="text-white">{summary.fragileCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=building" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]">
                                                    <span>Building</span>
                                                    <span className="text-white">{summary.buildingCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=stable" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]">
                                                    <span>Stable</span>
                                                    <span className="text-white">{summary.stableCount}</span>
                                                </Link>
                                                <Link href="/vocabulary?status=mastered" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]">
                                                    <span>Mastered</span>
                                                    <span className="text-white">{summary.masteredCount}</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Suggested next action</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                {summary.nextAction === "review" && "Your queue already has due words. Clearing those will improve spacing quality the fastest."}
                                                {summary.nextAction === "read" && "You could add fresh input, but this page now prioritizes review first so the queue stays healthy before you branch out."}
                                                {summary.nextAction === "wordbook" && "Your queue is under control. You can still start a review round here, or refine your saved words in vocabulary."}
                                            </p>

                                            <div className="mt-6 space-y-3 text-sm text-white/70">
                                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                                    {summary.dueNow} words due now
                                                </div>
                                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                                    {summary.streakDays} day active streak
                                                </div>
                                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                                    {summary.addedThisWeek} words added this week
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Often wrong</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                Words with repeated wrong answers and rising difficulty.
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {oftenWrongWords.length > 0 ? oftenWrongWords.map((item) => (
                                                    <Link
                                                        key={item.word}
                                                        href="/vocabulary?status=fragile"
                                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{item.word}</div>
                                                            <div className="mt-1 text-xs text-white/45">
                                                                {item.wrongCount ?? 0} wrong answers
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-xs text-white/45">
                                                            <div>Difficulty {item.difficulty ?? 0}</div>
                                                            <div>Stability {item.stability ?? 0}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                                                        No repeated wrong-answer words yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Needs hints</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                Words you usually reach with support, but have not fully internalized yet.
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {needsHintsWords.length > 0 ? needsHintsWords.map((item) => (
                                                    <Link
                                                        key={item.word}
                                                        href="/vocabulary?status=fragile"
                                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.07]"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{item.word}</div>
                                                            <div className="mt-1 text-xs text-white/45">
                                                                {item.hintedCount ?? 0} hinted completions
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-xs text-white/45">
                                                            <div>Difficulty {item.difficulty ?? 0}</div>
                                                            <div>Stability {item.stability ?? 0}</div>
                                                        </div>
                                                    </Link>
                                                )) : (
                                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                                                        No hint-heavy words yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                                            <h2 className="text-lg font-medium text-white">Most skipped</h2>
                                            <p className="mt-2 text-sm leading-7 text-white/58">
                                                Words you are most likely to move past before solving.
                                            </p>
                                            <div className="mt-5 space-y-3">
                                                {mostSkippedWords.length > 0 ? mostSkippedWords.map((item) => (
                                                    <button
                                                        key={item.word}
                                                        type="button"
                                                        onClick={() => setPractise(true)}
                                                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.07]"
                                                    >
                                                        <div className="text-sm font-medium text-white">{item.word}</div>
                                                        <div className="text-xs text-white/45">{item.skipCount ?? 0} skips</div>
                                                    </button>
                                                )) : (
                                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
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
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm text-white/45">{label}</div>
            <div className="mt-3 text-3xl font-medium tracking-tight text-white">{value}</div>
            <div className="mt-2 text-sm leading-6 text-white/55">{hint}</div>
        </div>
    )
}
