"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { formatCopy } from "@/app/lib/copy"
import { fetchFavoriteLiteraryPassages } from "@/app/lib/literature-api"
import type { LiteraryPassageDetail } from "@/app/lib/literature-models"

function yearLabel(year: number | null) {
    return year ? String(year) : ""
}

export default function SavedLiteraturePage() {
    const { copy } = useAppPreferences()
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [items, setItems] = useState<LiteraryPassageDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return
        }

        let cancelled = false

        async function loadSavedPassages() {
            setLoading(true)
            setError("")

            try {
                const data = await fetchFavoriteLiteraryPassages()
                if (!cancelled) {
                    setItems(data)
                }
            } catch (loadError) {
                if (!cancelled) {
                    console.error("Failed to load saved literature:", loadError)
                    setError(loadError instanceof Error ? loadError.message : copy.literatureTimeline.listLoadFailed)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadSavedPassages()

        return () => {
            cancelled = true
        }
    }, [isAuthenticated, isLoading])

    if (isLoading) {
        return (
            <main className="theme-page min-h-screen">
                <Navbar />
            </main>
        )
    }

    if (!isAuthenticated) {
        return (
            <main className="theme-page min-h-screen pb-12">
                <Navbar />
                <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-8">
                    <div className="theme-surface rounded-[36px] p-8">
                        <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.savedLiterature.title}</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.savedLiterature.loginTitle}</h1>
                        <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                            {copy.savedLiterature.loginBody}
                        </p>
                        <button
                            type="button"
                            onClick={() => login()}
                            className="theme-button-primary mt-8 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                        >
                            {copy.savedLiterature.loginCta}
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="theme-page min-h-screen pb-12">
            <Navbar />
            <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8">
                <div className="theme-surface rounded-[36px] p-8">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                        <div>
                            <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.savedLiterature.title}</p>
                            <h1 className="mt-3 text-3xl font-medium tracking-tight">{copy.savedLiterature.title}</h1>
                            <p className="theme-muted mt-3 max-w-2xl text-sm leading-7">{copy.savedLiterature.intro}</p>
                        </div>
                        <div className="theme-button-secondary rounded-full px-4 py-2 text-sm font-medium">
                            {formatCopy(copy.savedLiterature.savedCount, { count: items.length })}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/literature" className="theme-button-secondary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                            {copy.common.backToLiterature}
                        </Link>
                        <Link href="/literature" className="theme-button-primary inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition">
                            {copy.savedLiterature.openLiterature}
                        </Link>
                    </div>

                    {loading ? (
                        <div className="theme-faint py-16 text-center text-sm">{copy.savedLiterature.loading}</div>
                    ) : error ? (
                        <div className="mt-6 rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">{error}</div>
                    ) : items.length === 0 ? (
                        <div className="mt-8 rounded-3xl border border-dashed px-6 py-12 text-center" style={{ borderColor: "var(--border-soft)" }}>
                            <h2 className="text-xl font-medium">{copy.savedLiterature.emptyTitle}</h2>
                            <p className="theme-muted mt-3 text-sm leading-7">{copy.savedLiterature.emptyBody}</p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {items.map((item) => (
                                <article key={item.id} className="theme-card rounded-3xl p-6">
                                    <div className="theme-faint text-xs uppercase tracking-[0.24em]">
                                        {yearLabel(item.work_year) || copy.literatureTimeline.unknownYear}
                                    </div>
                                    <h2 className="mt-3 text-2xl font-medium">{item.work_title}</h2>
                                    <p className="theme-muted mt-2 text-sm">
                                        {item.author_name}
                                    </p>
                                    <p className="theme-muted mt-5 whitespace-pre-wrap text-sm leading-7">
                                        {item.excerpt}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
