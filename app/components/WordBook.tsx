import { useEffect, useState } from "react";
import Link from 'next/link';
import { TrashIcon, PlayCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import LevelComponent from "./LevelComponent"
import type { WordModel } from "@/app/lib/dict-models";
import { ignoreWord, removeWord, updateWordLevel } from "@/app/lib/practice-api";
import { fetchDefinitions } from "@/app/lib/dict-api";

type HoverCardState = {
    index: number
    word: string
    definition: string
}

type DefinitionLookup = {
    word: string
    definition: string
}

const WordBook: React.FC<{ wordList: WordModel[], onCollectionChange: (e: { id: number, name: string }) => void }> = ({ wordList, onCollectionChange }) => {

    const [mylist, setWordList] = useState<WordModel[]>(wordList ?? []);
    const [hoverCard, setHoverCard] = useState<HoverCardState | null>(null)

    function handleRemoveWord(word: WordModel, index: number) {
        removeWord(word.word).then(() => {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });
        });
    }

    function handleUpdateLevel(word: WordModel, level: number) {
        updateWordLevel(word.word, level).then(() => {
                word.level = level
                setWordList((prevList) => {
                    return [...prevList];
                });
        });
    }

    function handleIgnoreWord(word: WordModel, index: number) {
        ignoreWord(word.word).then(() => {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });
        });
    }

    useEffect(() => {
        setWordList(wordList)
    }, [wordList])

    useEffect(() => {
        if (!wordList?.length) {
            return
        }

        const wordsToLookup = wordList
            .filter((item) => !item.definition)
            .map((item) => item.word)

        if (!wordsToLookup.length) {
            return
        }

        let cancelled = false

        fetchDefinitions(wordsToLookup)
            .then((definitions) => {
                if (cancelled) {
                    return
                }

                const definitionMap = new Map<string, DefinitionLookup>(
                    definitions.map((item) => [
                        (item.query_word || item.word).toLowerCase(),
                        {
                            word: item.word,
                            definition: item.definition ?? "",
                        },
                    ])
                )

                setWordList((prevList) => prevList.map((item) => ({
                    ...item,
                    canonical: item.canonical || definitionMap.get(item.word.toLowerCase())?.word || item.word,
                    definition: item.definition || definitionMap.get(item.word.toLowerCase())?.definition || "",
                })))
            })
            .catch((error) => {
                console.error("Failed to load word definitions:", error)
            })

        return () => {
            cancelled = true
        }
    }, [wordList])

    function getDisplayMemoryBadge(item: WordModel): string | null {
        if ((!item.memory_badge || item.memory_badge === "untracked") && (item.level ?? 0) >= 5) {
            return "mastered"
        }

        return item.memory_badge ?? null
    }

    function getDisplayFamiliarityLevel(item: WordModel): number {
        if (getDisplayMemoryBadge(item) === "mastered") {
            return 5
        }

        return item.level ?? 0
    }

    function memoryBadgeClass(badge?: string | null) {
        switch (badge) {
            case "fragile":
                return "border-[#f0b38a]/20 bg-[#f0b38a]/10 text-[#f8d8c1]"
            case "building":
                return "border-[#9bb7d4]/20 bg-[#9bb7d4]/10 text-[#d7e4f1]"
            case "stable":
                return "border-[#8fbf9f]/20 bg-[#8fbf9f]/10 text-[#d6ebdd]"
            case "mastered":
            case "ignored":
                return "border-[#c7b4e6]/20 bg-[#c7b4e6]/10 text-[#eadff8]"
            default:
                return "border-white/10 bg-white/[0.03] text-white/45"
        }
    }

    function memoryBadgeLabel(badge?: string | null) {
        switch (badge) {
            case "fragile":
                return "Fragile"
            case "building":
                return "Building"
            case "stable":
                return "Stable"
            case "mastered":
            case "ignored":
                return "Mastered"
            default:
                return "Untracked"
        }
    }

    function showHoverCard(item: WordModel, index: number) {
        setHoverCard({
            index,
            word: item.display_word || item.canonical || item.word,
            definition: item.definition || "Loading definition...",
        })
    }

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Word
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Memory
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Familiarity
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Query
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {mylist?.length > 0 ? mylist.map((item, index) => (
                                <tr key={index} className="transition hover:bg-white/[0.025]">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white">
                                        <div className="relative inline-flex items-center">
                                            <button
                                                type="button"
                                                className="inline-flex w-fit cursor-help items-center rounded-md text-left decoration-white/20 underline-offset-4 transition hover:text-[#fff0c8]"
                                                onMouseEnter={() => showHoverCard(item, index)}
                                                onMouseLeave={() => setHoverCard(null)}
                                            >
                                                {item.display_word || item.word}
                                            </button>
                                            {hoverCard?.index === index && (
                                                <div
                                                    className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-[320px] -translate-y-1/2 rounded-2xl border border-white/10 bg-[#161311]/95 p-4 text-sm text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
                                                >
                                                    <div className="text-xs uppercase tracking-[0.28em] text-white/35">Definition</div>
                                                    <div className="mt-2 text-base font-semibold text-[#fff0c8]">{hoverCard.word}</div>
                                                    <div className="mt-3 whitespace-pre-line leading-6 text-white/72">
                                                        {hoverCard.definition}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white/70">
                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${memoryBadgeClass(getDisplayMemoryBadge(item))}`}>
                                            {memoryBadgeLabel(getDisplayMemoryBadge(item))}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white/70">
                                        <LevelComponent updateLevel={(level) => {
                                            handleUpdateLevel(item, level == item.level ? 0 : level)
                                        }} currentLevel={getDisplayFamiliarityLevel(item)} pages={[1, 2, 3, 4, 5]} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white/55">{item.query_count ?? 0}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-4 text-white/55">
                                            <button
                                                type="button"
                                                className="transition hover:text-white"
                                                onClick={() => handleIgnoreWord(item, index)}
                                                title="Ignore word"
                                            >
                                                <EyeSlashIcon className="h-5 w-5" />
                                            </button>

                                            <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} className="transition hover:text-white" title="Listen on YouGlish">
                                                <PlayCircleIcon className="h-5 w-5" />
                                            </Link>

                                            <button
                                                type="button"
                                                className="transition hover:text-white"
                                                onClick={() => handleRemoveWord(item, index)}
                                                title="Remove word"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/45">
                                        No saved words in this view yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default WordBook;
