"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { fetchWordDefinition, fetchWordExamples } from "@/app/lib/dict-api"
import type { SearchResult, WordModel } from "@/app/lib/dict-models"

function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
        return false
    }

    const tagName = target.tagName
    return target.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT"
}

export default function QuickWordSearch() {
    const { copy } = useAppPreferences()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [result, setResult] = useState<WordModel | null>(null)
    const [examples, setExamples] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (isTypingTarget(event.target)) {
                return
            }

            const pressedSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey
            const pressedCommandK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)

            if (!pressedSlash && !pressedCommandK) {
                return
            }

            event.preventDefault()
            setOpen(true)
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
        if (!open) {
            return
        }

        const timeout = window.setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        }, 20)

        return () => window.clearTimeout(timeout)
    }, [open])

    async function handleSearch(event?: React.FormEvent) {
        event?.preventDefault()
        const keyword = query.trim()

        if (!keyword || loading) {
            return
        }

        setLoading(true)
        setError("")

        try {
            const [word, wordExamples] = await Promise.all([
                fetchWordDefinition(keyword),
                fetchWordExamples(keyword).catch(() => []),
            ])
            setResult(word)
            setExamples(wordExamples.slice(0, 3))
        } catch (searchError) {
            setResult(null)
            setExamples([])
            setError(searchError instanceof Error ? searchError.message : copy.search.notFound)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={copy.search.open}
                title={`${copy.menu.quickSearch} (${copy.search.shortcutHint})`}
                className="theme-button-secondary inline-flex h-10 w-10 items-center justify-center rounded-full transition"
            >
                <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="theme-overlay fixed inset-0 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
                        <div className="flex min-h-full items-start justify-center pt-[8vh]">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 translate-y-2 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-2 scale-95"
                            >
                                <Dialog.Panel className="theme-surface w-full max-w-2xl rounded-[32px] p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <Dialog.Title className="text-2xl font-medium">
                                                {copy.search.title}
                                            </Dialog.Title>
                                            <p className="theme-muted mt-2 text-sm">
                                                {copy.search.description}
                                            </p>
                                            <p className="theme-faint mt-2 text-xs uppercase tracking-[0.18em]">
                                                {copy.search.shortcutHint}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            aria-label={copy.search.close}
                                            className="theme-button-secondary inline-flex h-10 w-10 items-center justify-center rounded-full transition"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSearch} className="mt-6 flex gap-3">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            placeholder={copy.search.placeholder}
                                            className="theme-input h-12 flex-1 rounded-2xl px-4 text-sm focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || query.trim().length === 0}
                                            className="theme-button-primary inline-flex h-12 items-center rounded-2xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {loading ? copy.search.searching : copy.search.submit}
                                        </button>
                                    </form>

                                    <div className="mt-6">
                                        {error ? (
                                            <div className="rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                                                {error}
                                            </div>
                                        ) : result ? (
                                            <div className="space-y-5">
                                                <div className="theme-card rounded-3xl p-5">
                                                    <div className="flex flex-wrap items-baseline gap-3">
                                                        <h2 className="text-3xl font-medium">{result.display_word || result.word}</h2>
                                                        {result.phonetic && (
                                                            <span className="theme-muted text-sm">
                                                                {copy.search.phonetic}: {result.phonetic}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 space-y-3">
                                                        <div>
                                                            <div className="theme-faint text-xs uppercase tracking-[0.22em]">{copy.search.definition}</div>
                                                            <div className="mt-2 whitespace-pre-wrap text-sm leading-7">{result.definition || copy.search.notFound}</div>
                                                        </div>
                                                        {result.cn && (
                                                            <div>
                                                                <div className="theme-faint text-xs uppercase tracking-[0.22em]">{copy.search.chinese}</div>
                                                                <div className="mt-2 text-sm leading-7">{result.cn}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {examples.length > 0 && (
                                                    <div className="theme-card rounded-3xl p-5">
                                                        <div className="theme-faint text-xs uppercase tracking-[0.22em]">{copy.search.examples}</div>
                                                        <div className="mt-3 space-y-3">
                                                            {examples.map((item, index) => (
                                                                <p key={`${item.snippet}-${index}`} className="theme-muted text-sm leading-7">
                                                                    {item.snippet}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="theme-card rounded-3xl p-5 text-sm theme-muted">
                                                {copy.search.empty}
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
