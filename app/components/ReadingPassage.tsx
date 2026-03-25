"use client"

import { useMemo, useRef, useState } from "react"
import { Cormorant_Garamond } from "next/font/google"
import { HeartIcon as HeartOutlineIcon, PlayIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { fetchDefinitions } from "@/app/lib/dict-api"
import { addWords } from "@/app/lib/practice-api"
import { useCustomAuth } from "@/app/context/CustomAuthProvider"

const displaySerif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
})

type LookupState = {
    tokenId: string
    word: string
    definition: string
    loading: boolean
    added: boolean
    top: number
    left: number
}

function tokenizeExcerpt(excerpt: string) {
    return excerpt.split(/([A-Za-z][A-Za-z'-]*)/g).filter(Boolean)
}

function normalizeWord(token: string) {
    return token.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "").toLowerCase()
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
    const [lookup, setLookup] = useState<LookupState | null>(null)
    const [definitionCache, setDefinitionCache] = useState<Record<string, string>>({})
    const [addedWords, setAddedWords] = useState<Record<string, boolean>>({})
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const tokens = useMemo(() => tokenizeExcerpt(excerpt), [excerpt])

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
            word,
            definition: cachedDefinition ?? "",
            loading: !cachedDefinition,
            added: !!addedWords[word],
            ...position,
        })

        if (cachedDefinition) {
            return
        }

        try {
            const words = await fetchDefinitions([word])
            const definition = words[0]?.definition ?? "No definition available yet."
            setDefinitionCache((prev) => ({ ...prev, [word]: definition }))
            setLookup((prev) => prev && prev.tokenId === tokenId
                ? { ...prev, definition, loading: false }
                : prev)
        } catch (error) {
            setLookup((prev) => prev && prev.tokenId === tokenId
                ? { ...prev, definition: "Failed to load definition.", loading: false }
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

        await addWords(lookup.word, "reading-passage")
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
                <blockquote className={`${displaySerif.className} text-[1.65rem] leading-[1.52] text-[#f6efe3] sm:text-[2.15rem] lg:text-[2.45rem]`}>
                    <span className="mr-2 text-[#e2c48f]">“</span>
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
                                className={`cursor-help rounded-sm transition ${isActive ? "bg-white/10 text-[#fff4d6]" : "hover:bg-white/7 hover:text-[#fff0c8]"}`}
                                onMouseEnter={(event) => handleWordEnter(token, tokenId, event.currentTarget)}
                                onMouseLeave={scheduleHide}
                            >
                                {token}
                            </span>
                        )
                    })}
                    <span className="ml-2 text-[#e2c48f]">”</span>
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
                            <p className="text-sm uppercase tracking-[0.28em] text-white/38">Author</p>
                            <p className="mt-3 text-base font-semibold text-white/84">{author}</p>
                            <p className="mt-2 text-base italic text-white/64">
                                {year ? `${work} · ${year}` : work}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onPractice}
                                aria-label={practiceLoading ? "Preparing practice" : "Start practice"}
                                title={practiceLoading ? "Preparing practice" : "Start practice"}
                                className="rounded-full bg-white/[0.035] p-2.5 text-white/46 transition hover:bg-white hover:text-black"
                            >
                                <PlayIcon className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={onToggleSavePassage}
                                disabled={!canSavePassage}
                                aria-label={
                                    canSavePassage
                                        ? (passageSaved ? "Remove saved passage" : "Save this passage")
                                        : "Save is unavailable for preview passages"
                                }
                                title={
                                    canSavePassage
                                        ? (passageSaved ? "Remove saved passage" : "Save this passage")
                                        : "Save is unavailable for preview passages"
                                }
                                className="rounded-full bg-white/[0.035] p-2.5 text-white/46 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-white/[0.025] disabled:text-white/20"
                            >
                                {passageSaved ? <HeartSolidIcon className="h-5 w-5" /> : <HeartOutlineIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </footer>
            </div>

            {lookup && (
                <div
                    className="fixed z-50 w-[280px] rounded-2xl border border-white/10 bg-[#161311]/95 p-4 text-sm text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
                    style={{ top: lookup.top, left: lookup.left }}
                    onMouseEnter={clearHideTimer}
                    onMouseLeave={scheduleHide}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-white/35">Lookup</p>
                            <p className="mt-2 text-lg font-semibold capitalize text-[#fff0c8]">{lookup.word}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddWord}
                            aria-label={lookup.added ? "Added to word list" : "Add to word list"}
                            title={lookup.added ? "Added to word list" : "Add to word list"}
                            className={`rounded-full p-2 transition ${lookup.added ? "bg-[#3c5f45] text-white" : "bg-[#e2c48f] text-[#1a1713] hover:bg-[#edd3a2]"}`}
                        >
                            {lookup.added ? <HeartSolidIcon className="h-4 w-4" /> : <HeartOutlineIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    <p className="mt-4 leading-6 text-white/72">
                        {lookup.loading ? "Loading definition..." : lookup.definition}
                    </p>
                </div>
            )}
        </article>
    )
}
