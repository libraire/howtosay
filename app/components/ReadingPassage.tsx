"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Cormorant_Garamond } from "next/font/google"
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { fetchDefinitions } from "@/app/lib/dict-api"
import { addWords } from "@/app/lib/practice-api"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"

const displaySerif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
})

type LookupState = {
    tokenId: string
    word: string
    displayWord: string
    surfaceWord: string
    definition: string
    loading: boolean
    added: boolean
    top: number
    left: number
}

type DefinitionLookup = {
    word: string
    displayWord: string
    surfaceWord: string
    definition: string
}

function tokenizeExcerpt(excerpt: string) {
    return excerpt.split(/([A-Za-z][A-Za-z'-]*)/g).filter(Boolean)
}

function normalizeWord(token: string) {
    return token.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "").toLowerCase()
}

function extractUniqueWords(tokens: string[]) {
    return Array.from(
        new Set(
            tokens
                .map((token) => normalizeWord(token))
                .filter(Boolean)
        )
    )
}

function isUnauthenticatedError(error: unknown) {
    if (!(error instanceof Error)) {
        return false
    }

    const message = error.message.toLowerCase()
    return message.includes("unauthenticated") || message.includes("unauthorized") || message.includes("status 401")
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

export default function ReadingPassage({
    excerpt,
    accent,
    author,
    work,
    year,
    onPractice,
    onToggleSavePassage,
    practiceLoading,
    passageSaved,
    canSavePassage,
}: {
    excerpt: string
    accent: string
    author: string
    work: string
    year?: number
    onPractice: () => void
    onToggleSavePassage: () => void
    practiceLoading: boolean
    passageSaved: boolean
    canSavePassage: boolean
}) {
    const { isAuthenticated, login } = useCustomAuth()
    const { copy } = useAppPreferences()
    const [lookup, setLookup] = useState<LookupState | null>(null)
    const [definitionCache, setDefinitionCache] = useState<Record<string, DefinitionLookup>>({})
    const [addedWords, setAddedWords] = useState<Record<string, boolean>>({})
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const tokens = useMemo(() => tokenizeExcerpt(excerpt), [excerpt])
    const uniqueWords = useMemo(() => extractUniqueWords(tokens), [tokens])

    useEffect(() => {
        let cancelled = false

        async function preloadDefinitions() {
            if (!isAuthenticated || uniqueWords.length === 0) {
                setDefinitionCache({})
                return
            }

            try {
                const definitions = await fetchDefinitions(uniqueWords)
                if (cancelled) {
                    return
                }

                const definitionMap = new Map<string, DefinitionLookup>(
                    definitions.map((item) => [
                        (item.surface_word || item.query_word || item.word).toLowerCase(),
                        {
                            word: item.word,
                            displayWord: item.surface_word || item.display_word || item.word,
                            surfaceWord: item.surface_word || item.query_word || item.word,
                            definition: item.definition ?? copy.reading.noDefinition,
                        },
                    ])
                )

                const nextCache = uniqueWords.reduce<Record<string, DefinitionLookup>>((accumulator, word) => {
                    accumulator[word] = definitionMap.get(word) ?? {
                        word,
                        displayWord: word,
                        surfaceWord: word,
                        definition: copy.reading.noDefinition,
                    }
                    return accumulator
                }, {})

                setDefinitionCache(nextCache)
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to preload homepage definitions:", error)
                    setDefinitionCache({})
                }
            }
        }

        preloadDefinitions()

        return () => {
            cancelled = true
        }
    }, [copy.reading.noDefinition, isAuthenticated, uniqueWords])

    function clearHideTimer() {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current)
            hideTimerRef.current = null
        }
    }

    function scheduleHide() {
        clearHideTimer()
        hideTimerRef.current = setTimeout(() => {
            setLookup(null)
        }, 140)
    }

    function updateLookupPosition(target: HTMLElement) {
        const rect = target.getBoundingClientRect()
        return {
            top: rect.bottom + 12,
            left: Math.min(rect.left, window.innerWidth - 320),
        }
    }

    async function handleWordEnter(token: string, tokenId: string, target: HTMLElement) {
        clearHideTimer()
        const word = normalizeWord(token)
        if (!word) {
            return
        }

        const position = updateLookupPosition(target)
        const cachedDefinition = definitionCache[word]

        setLookup({
            tokenId,
            word: cachedDefinition?.word ?? word,
            displayWord: cachedDefinition?.displayWord ?? word,
            surfaceWord: cachedDefinition?.surfaceWord ?? word,
            definition: cachedDefinition?.definition ?? "",
            loading: isAuthenticated ? !cachedDefinition : false,
            added: !!addedWords[cachedDefinition?.word ?? word],
            ...position,
        })

        if (cachedDefinition) {
            return
        }

        if (!isAuthenticated) {
            setLookup((prev) => prev && prev.tokenId === tokenId
                ? { ...prev, definition: copy.reading.loginToViewDefinitions, loading: false }
                : prev)
            return
        }

        try {
            const words = await fetchDefinitions([word])
            const resolvedWord = words[0]?.word ?? word
            const surfaceWord = words[0]?.surface_word ?? word
            const displayWord = words[0]?.surface_word || words[0]?.display_word || word
            const definition = words[0]?.definition ?? copy.reading.noDefinition

            setDefinitionCache((prev) => ({
                ...prev,
                [word]: {
                    word: resolvedWord,
                    displayWord,
                    surfaceWord,
                    definition,
                },
            }))

            setLookup((prev) => prev && prev.tokenId === tokenId
                ? {
                    ...prev,
                    word: resolvedWord,
                    displayWord,
                    surfaceWord,
                    definition,
                    added: !!addedWords[resolvedWord],
                    loading: false,
                }
                : prev)
        } catch (error) {
            const definition = isUnauthenticatedError(error)
                ? copy.reading.loginToViewDefinitions
                : copy.reading.failedToLoadDefinition

            setLookup((prev) => prev && prev.tokenId === tokenId
                ? { ...prev, definition, loading: false }
                : prev)
        }
    }

    async function handleAddWord() {
        if (!lookup) {
            return
        }

        if (!isAuthenticated) {
            login()
            return
        }

        await addWords(lookup.word, "reading-passage", lookup.surfaceWord)
        setAddedWords((prev) => ({ ...prev, [lookup.word]: true }))
        setLookup((prev) => prev ? { ...prev, added: true } : prev)
    }

    return (
        <article className="relative mx-auto mt-10 max-w-4xl px-2 py-4 sm:px-6 sm:py-8 lg:px-10">
            <div
                className="absolute left-0 top-0 h-24 w-24 rounded-full blur-3xl"
                style={{ backgroundColor: `${accent}18` }}
            />
            <div className="relative mx-auto max-w-3xl">
                <blockquote className={`${displaySerif.className} text-[1.65rem] leading-[1.52] text-[color:var(--quote-text)] sm:text-[2.15rem] lg:text-[2.45rem]`}>
                    <span className="mr-2 text-[color:var(--quote-accent)]">“</span>
                    {tokens.map((token, index) => {
                        const word = normalizeWord(token)
                        const tokenId = `${word || "token"}-${index}`
                        if (!word) {
                            return <span key={`${token}-${index}`}>{token}</span>
                        }

                        const isActive = lookup?.tokenId === tokenId

                        return (
                            <span
                                key={`${token}-${index}`}
                                className={`cursor-help rounded-sm transition ${
                                    isActive
                                        ? "bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]"
                                        : "hover:bg-[var(--button-secondary-bg)] hover:text-[color:var(--text-primary)]"
                                }`}
                                onMouseEnter={(event) => handleWordEnter(token, tokenId, event.currentTarget)}
                                onMouseLeave={scheduleHide}
                            >
                                {token}
                            </span>
                        )
                    })}
                    <span className="ml-2 text-[color:var(--quote-accent)]">”</span>
                </blockquote>

                <footer className="mt-14 pt-6">
                    <div
                        className="mb-6 h-px w-24"
                        style={{
                            background: `linear-gradient(90deg, ${accent}88 0%, rgba(255,255,255,0.08) 100%)`,
                        }}
                    />
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="theme-faint text-sm uppercase tracking-[0.28em]">{copy.reading.author}</p>
                            <p className="mt-3 text-base font-semibold">{author}</p>
                            <p className="theme-muted mt-2 text-base italic">
                                {year ? `${work} · ${year}` : work}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="group relative">
                                <button
                                    type="button"
                                    onClick={onPractice}
                                    aria-label={practiceLoading ? copy.reading.preparingPractice : copy.reading.startPractice}
                                    title={practiceLoading ? copy.reading.preparingPractice : copy.reading.startPractice}
                                    className="theme-button-secondary rounded-full p-2.5 transition"
                                >
                                    <TypewriterIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="group relative">
                                <button
                                    type="button"
                                    onClick={onToggleSavePassage}
                                    disabled={!canSavePassage}
                                    aria-label={
                                        canSavePassage
                                            ? (passageSaved ? copy.reading.removeSavedPassage : copy.reading.savePassage)
                                            : copy.reading.previewSaveUnavailable
                                    }
                                    title={
                                        canSavePassage
                                            ? (passageSaved ? copy.reading.removeSavedPassage : copy.reading.savePassage)
                                            : copy.reading.previewSaveUnavailable
                                    }
                                    className="theme-button-secondary rounded-full p-2.5 transition disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    {passageSaved ? <HeartSolidIcon className="h-5 w-5" /> : <HeartOutlineIcon className="h-5 w-5" />}
                                </button>
                                {!isAuthenticated && canSavePassage && (
                                    <span className="theme-menu pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium text-[color:var(--text-secondary)] group-hover:block group-focus-within:block">
                                        {copy.reading.loginToSavePassages}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {lookup && (
                <div
                    className="theme-menu fixed z-50 w-[280px] rounded-2xl p-4 text-sm backdrop-blur"
                    style={{ top: lookup.top, left: lookup.left }}
                    onMouseEnter={clearHideTimer}
                    onMouseLeave={scheduleHide}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.reading.lookup}</p>
                            <p className="mt-2 text-lg font-semibold capitalize text-[color:var(--accent)]">{lookup.displayWord}</p>
                            {lookup.word !== lookup.displayWord && (
                                <p className="theme-faint mt-1 text-xs uppercase tracking-[0.2em]">
                                    {copy.reading.canonical}: {lookup.word}
                                </p>
                            )}
                        </div>
                        <div className="group relative">
                            <button
                                type="button"
                                onClick={handleAddWord}
                                aria-label={lookup.added ? copy.reading.addedToWordList : copy.reading.addToWordList}
                                title={lookup.added ? copy.reading.addedToWordList : copy.reading.addToWordList}
                                className={`rounded-full p-2 transition ${lookup.added ? "bg-[#3c5f45] text-white" : "bg-[#e2c48f] text-[#1a1713] hover:bg-[#edd3a2]"}`}
                            >
                                {lookup.added ? <HeartSolidIcon className="h-4 w-4" /> : <HeartOutlineIcon className="h-4 w-4" />}
                            </button>
                            {!isAuthenticated && !lookup.added && (
                                <span className="theme-menu pointer-events-none absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium text-[color:var(--text-secondary)] group-hover:block group-focus-within:block">
                                    {copy.reading.loginToAddWords}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="theme-muted mt-4 leading-6">
                        {lookup.loading ? copy.reading.loadingDefinition : lookup.definition}
                    </p>
                </div>
            )}
        </article>
    )
}
