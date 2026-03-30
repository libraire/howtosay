"use client"

import { useEffect, useRef, useState } from "react"
import { TrashIcon } from "@heroicons/react/24/outline"
import Navbar from "@/app/components/Navbar"
import PractiseComponent from "@/app/components/PractiseComponent"
import type { Word } from "@/app/components/types"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { unfavoriteHomepagePassage } from "@/app/lib/home-api"
import { formatCopy } from "@/app/lib/copy"
import { fetchFavoriteLiteraryPassages } from "@/app/lib/literature-api"
import { getMockFavoriteLiteraryPassages } from "@/app/lib/literature-mock"
import { filterWordsFromContent } from "@/app/lib/material-api"
import type { LiteraryPassageDetail } from "@/app/lib/literature-models"

const previewFavorites = getMockFavoriteLiteraryPassages()
const shouldUseMockPreview = process.env.NODE_ENV === "development"

function yearLabel(year: number | null, fallback: string) {
    return year ? String(year) : fallback
}

function TypewriterIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M7 8.5V6.8C7 5.81 7.81 5 8.8 5h6.4C16.19 5 17 5.81 17 6.8v1.7" />
            <path d="M5.5 9.5h13a2.5 2.5 0 0 1 2.5 2.5v4.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V12a2.5 2.5 0 0 1 2.5-2.5Z" />
            <path d="M8 13.5h.01M11 13.5h.01M14 13.5h.01M17 13.5h.01" />
            <path d="M7.5 16.5h9" />
            <path d="M9 9.5h6" />
        </svg>
    )
}

function getSlidePalette(index: number, theme: "dark" | "light") {
    if (theme === "light") {
        return index % 2 === 0
            ? {
                background: "linear-gradient(145deg, #f6f0e7 0%, #fffdf9 100%)",
                foreground: "#241c14",
                secondary: "rgba(36, 28, 20, 0.72)",
                border: "rgba(87, 63, 40, 0.14)",
            }
            : {
                background: "linear-gradient(145deg, #251d16 0%, #0f0d0b 100%)",
                foreground: "#f7f1e6",
                secondary: "rgba(247, 241, 230, 0.76)",
                border: "rgba(247, 241, 230, 0.14)",
            }
    }

    return index % 2 === 0
        ? {
            background: "linear-gradient(145deg, #f1e9dd 0%, #fffaf4 100%)",
            foreground: "#171310",
            secondary: "rgba(23, 19, 16, 0.7)",
            border: "rgba(23, 19, 16, 0.14)",
        }
        : {
            background: "linear-gradient(145deg, #1d1814 0%, #090909 100%)",
            foreground: "#f6efe3",
            secondary: "rgba(246, 239, 227, 0.74)",
            border: "rgba(246, 239, 227, 0.14)",
        }
}

function SavedLiteratureStatus({
    eyebrow,
    title,
    body,
    actionLabel,
    onAction,
}: {
    eyebrow: string
    title: string
    body: string
    actionLabel?: string
    onAction?: () => void
}) {
    return (
        <main className="theme-page min-h-screen">
            <Navbar />
            <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-6 py-12">
                <div className="absolute inset-0 opacity-80">
                    <div className="absolute left-[-5rem] top-10 h-64 w-64 rounded-full blur-3xl" style={{ background: "var(--glow-amber)" }} />
                    <div className="absolute right-[-4rem] top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--glow-teal)" }} />
                    <div className="absolute bottom-10 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "var(--glow-rose)" }} />
                </div>

                <section className="theme-surface relative z-10 w-full max-w-2xl rounded-[36px] px-8 py-10 text-center sm:px-12">
                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{eyebrow}</p>
                    <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
                    <p className="theme-muted mt-4 text-sm leading-7 sm:text-base">{body}</p>
                    {actionLabel && onAction ? (
                        <button
                            type="button"
                            onClick={onAction}
                            className="theme-button-primary mt-8 inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                        >
                            {actionLabel}
                        </button>
                    ) : null}
                </section>
            </section>
        </main>
    )
}

export default function SavedLiteraturePage() {
    const { copy, theme } = useAppPreferences()
    const { isAuthenticated, isLoading, login } = useCustomAuth()
    const [items, setItems] = useState<LiteraryPassageDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeIndex, setActiveIndex] = useState(0)
    const [usingMockPreview, setUsingMockPreview] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [isPreparingPractice, setIsPreparingPractice] = useState(false)
    const [practiceWords, setPracticeWords] = useState<Word[]>([])
    const [isPracticeOpen, setIsPracticeOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const blockRefs = useRef<Array<HTMLDivElement | null>>([])
    const visiblePracticeWords = practiceWords.filter((word) => {
        const memoryState = word.memory_badge || word.memory_status
        return memoryState !== "mastered" && (word.level ?? 0) < 5
    })

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
                    const nextItems = data.length > 0 ? data : shouldUseMockPreview ? previewFavorites : []
                    setItems(nextItems)
                    setUsingMockPreview(data.length === 0 && shouldUseMockPreview)
                    setActiveIndex(0)
                }
            } catch (loadError) {
                if (!cancelled) {
                    console.error("Failed to load saved literature:", loadError)
                    if (shouldUseMockPreview) {
                        setItems(previewFavorites)
                        setUsingMockPreview(true)
                        setActiveIndex(0)
                    } else {
                        setError(loadError instanceof Error ? loadError.message : copy.literatureTimeline.listLoadFailed)
                    }
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
    }, [copy.literatureTimeline.listLoadFailed, isAuthenticated, isLoading])

    useEffect(() => {
        if (!items.length || !containerRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0]

                if (!visibleEntry) {
                    return
                }

                const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.index)
                if (!Number.isNaN(nextIndex)) {
                    setActiveIndex(nextIndex)
                }
            },
            {
                root: containerRef.current,
                threshold: [0.35, 0.6, 0.85],
            }
        )

        blockRefs.current.forEach((block) => {
            if (block) {
                observer.observe(block)
            }
        })

        return () => {
            observer.disconnect()
        }
    }, [items])

    useEffect(() => {
        if (!items.length) {
            return
        }

        function scrollToIndex(nextIndex: number) {
            blockRefs.current[nextIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }

        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return
            }

            if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
                event.preventDefault()
                scrollToIndex(Math.min(activeIndex + 1, items.length - 1))
            }

            if (event.key === "ArrowUp" || event.key === "PageUp") {
                event.preventDefault()
                scrollToIndex(Math.max(activeIndex - 1, 0))
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeIndex, items.length])

    async function handleRemoveActiveItem() {
        const activeItem = items[activeIndex]
        if (!activeItem || isRemoving) {
            return
        }

        setIsRemoving(true)
        try {
            if (!usingMockPreview) {
                await unfavoriteHomepagePassage(activeItem.id)
            }

            setItems((prev) => prev.filter((item) => item.id !== activeItem.id))
            setActiveIndex((prev) => Math.max(0, Math.min(prev, items.length - 2)))
        } catch (removeError) {
            console.error("Failed to remove saved literature:", removeError)
            setError(removeError instanceof Error ? removeError.message : copy.reading.removeSavedPassage)
        } finally {
            setIsRemoving(false)
        }
    }

    async function handleStartPractice() {
        const activeItem = items[activeIndex]
        if (!activeItem || isPreparingPractice) {
            return
        }

        setIsPreparingPractice(true)
        try {
            const words = await filterWordsFromContent(activeItem.excerpt)
            const uniqueWords = words.filter((item, index, list) => {
                return list.findIndex((candidate) => candidate.word === item.word) === index
            })
            setPracticeWords(uniqueWords as Word[])
            setIsPracticeOpen(true)
        } catch (practiceError) {
            console.error("Failed to prepare practice words:", practiceError)
            setPracticeWords([])
            setIsPracticeOpen(true)
        } finally {
            setIsPreparingPractice(false)
        }
    }

    if (isLoading) {
        return (
            <SavedLiteratureStatus
                eyebrow={copy.savedLiterature.title}
                title={copy.savedLiterature.loading}
                body={copy.savedLiterature.intro}
            />
        )
    }

    if (!isAuthenticated) {
        return (
            <SavedLiteratureStatus
                eyebrow={copy.savedLiterature.title}
                title={copy.savedLiterature.loginTitle}
                body={copy.savedLiterature.loginBody}
                actionLabel={copy.savedLiterature.loginCta}
                onAction={() => login()}
            />
        )
    }

    if (loading) {
        return (
            <SavedLiteratureStatus
                eyebrow={copy.savedLiterature.title}
                title={copy.savedLiterature.loading}
                body={copy.savedLiterature.intro}
            />
        )
    }

    if (error) {
        return (
            <SavedLiteratureStatus
                eyebrow={copy.savedLiterature.title}
                title={copy.literatureTimeline.listLoadFailed}
                body={error}
            />
        )
    }

    if (!items.length) {
        return (
            <SavedLiteratureStatus
                eyebrow={copy.savedLiterature.title}
                title={copy.savedLiterature.emptyTitle}
                body={copy.savedLiterature.emptyBody}
            />
        )
    }

    const activeItem = items[activeIndex] ?? items[0]
    const activePalette = getSlidePalette(activeIndex, theme)

    return (
        <main className="theme-page min-h-screen">
            <div className={`transition-opacity duration-200 ${isPracticeOpen ? "opacity-30" : "opacity-100"}`}>
                <Navbar />
                <section className="relative h-[calc(100vh-76px)] overflow-hidden">
                <div className="absolute inset-0 opacity-80">
                    <div className="absolute left-[-6rem] top-8 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--glow-amber)" }} />
                    <div className="absolute right-[-5rem] top-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "var(--glow-teal)" }} />
                    <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "var(--glow-rose)" }} />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
                    <div className="max-w-[60vw]">
                        <p className="text-xs uppercase tracking-[0.32em]" style={{ color: activePalette.secondary }}>
                            {copy.savedLiterature.title}
                        </p>
                        <p className="mt-3 text-sm leading-6 sm:text-base" style={{ color: activePalette.secondary }}>
                            {formatCopy(copy.savedLiterature.savedCount, { count: items.length })}
                        </p>
                    </div>

                <div className="pointer-events-auto flex flex-col items-end gap-1.5">
                    <div
                        className="rounded-full px-3 py-1.5 text-xs tracking-[0.28em] sm:px-4"
                        style={{
                            color: activePalette.secondary,
                            border: `1px solid ${activePalette.border}`,
                            background: "rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handleRemoveActiveItem}
                            disabled={isRemoving}
                            aria-label={copy.reading.removeSavedPassage}
                            title={copy.reading.removeSavedPassage}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:w-9"
                            style={{
                                color: activePalette.secondary,
                                border: `1px solid ${activePalette.border}`,
                                background: "rgba(0, 0, 0, 0.025)",
                                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            {isRemoving ? (
                                <span className="text-[10px] leading-none">...</span>
                            ) : (
                                <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleStartPractice}
                            disabled={isPreparingPractice}
                            aria-label={copy.reading.startPractice}
                            title={isPreparingPractice ? copy.reading.preparingPractice : copy.reading.startPractice}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:w-9"
                            style={{
                                color: activePalette.secondary,
                                border: `1px solid ${activePalette.border}`,
                                background: "rgba(0, 0, 0, 0.025)",
                                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            {isPreparingPractice ? (
                                <span className="text-[10px] leading-none">...</span>
                            ) : (
                                <TypewriterIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 py-20 sm:px-10">
                    <article
                        className="w-full max-w-4xl text-center transition-colors duration-500"
                        style={{ color: activePalette.foreground }}
                    >
                        <p className="mx-auto max-w-3xl whitespace-pre-wrap text-base leading-8 sm:text-lg sm:leading-9 md:text-[2rem] md:leading-[1.7]">
                            {activeItem.excerpt}
                        </p>
                        <div className="mx-auto mt-8 h-px w-20" style={{ background: activePalette.border }} />
                        <p className="mt-7 text-xs uppercase tracking-[0.3em]" style={{ color: activePalette.secondary }}>
                            {yearLabel(activeItem.work_year, copy.literatureTimeline.unknownYear)}
                        </p>
                        <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
                            {activeItem.work_title}
                        </h1>
                        {activeItem.title && activeItem.title !== activeItem.work_title ? (
                            <p className="mt-3 text-sm sm:text-base" style={{ color: activePalette.secondary }}>
                                {activeItem.title}
                            </p>
                        ) : null}
                        <p className="mt-4 text-base italic sm:text-lg" style={{ color: activePalette.secondary }}>
                            {activeItem.author_name}
                        </p>
                    </article>
                </div>

                <div
                    ref={containerRef}
                    className="scrollbar-hidden relative z-0 h-full overflow-y-auto snap-y snap-mandatory"
                >
                    {items.map((item, index) => {
                        const palette = getSlidePalette(index, theme)
                        const isActive = index === activeIndex

                        return (
                            <div
                                key={item.id}
                                ref={(node) => {
                                    blockRefs.current[index] = node
                                }}
                                data-index={index}
                                aria-hidden="true"
                                className="relative flex h-[calc(100vh-76px)] snap-start items-center justify-center transition-opacity duration-500"
                                style={{
                                    background: palette.background,
                                    opacity: isActive ? 1 : 0.92,
                                }}
                            >
                                <div
                                    className="absolute inset-x-[8%] top-[12%] h-px"
                                    style={{ background: palette.border }}
                                />
                                <div
                                    className="absolute inset-x-[8%] bottom-[12%] h-px"
                                    style={{ background: palette.border }}
                                />
                                <div
                                    className="absolute left-[8%] top-[12%] bottom-[12%] w-px"
                                    style={{ background: palette.border }}
                                />
                                <div
                                    className="absolute right-[8%] top-[12%] bottom-[12%] w-px"
                                    style={{ background: palette.border }}
                                />
                                <div className="sr-only">
                                    {item.work_title} {item.author_name}
                                </div>
                            </div>
                        )
                    })}
                </div>
                </section>
            </div>

            {isPracticeOpen ? (
                <div
                    className="theme-overlay fixed inset-0 z-50 overflow-y-auto px-4 py-6 backdrop-blur-sm"
                    onClick={() => setIsPracticeOpen(false)}
                >
                    <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center pb-12 pt-[12vh]">
                        <div onClick={(event) => event.stopPropagation()}>
                            {visiblePracticeWords.length > 0 ? (
                                <PractiseComponent
                                    list={visiblePracticeWords}
                                    onClose={() => setIsPracticeOpen(false)}
                                    mode="reading"
                                />
                            ) : (
                                <div className="theme-panel w-[min(92vw,720px)] rounded-[28px] px-8 py-10 text-center">
                                    <p className="text-lg font-semibold">{copy.home.noPracticeWordsLeft}</p>
                                    <p className="theme-muted mt-3 text-sm">
                                        {copy.home.noPracticeWordsDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    )
}
