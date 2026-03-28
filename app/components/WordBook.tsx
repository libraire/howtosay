import { useEffect, useState } from "react";
import Link from 'next/link';
import { TrashIcon, PlayCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import LevelComponent from "./LevelComponent"
import type { WordModel } from "@/app/lib/dict-models";
import { ignoreWord, removeWord, updateWordLevel } from "@/app/lib/practice-api";
import { fetchDefinitions } from "@/app/lib/dict-api";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";

type HoverCardState = {
    index: number
    word: string
    definition: string
}

type DefinitionLookup = {
    word: string
    definition: string
}

const WordBook: React.FC<{ wordList: WordModel[], onCollectionChange: (e: { id: number | null, name: string }) => void }> = ({ wordList, onCollectionChange }) => {
    const { copy } = useAppPreferences()

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
                return "theme-button-secondary text-[var(--text-faint)]"
        }
    }

    function memoryBadgeLabel(badge?: string | null) {
        switch (badge) {
            case "fragile":
                return copy.wordBook.fragile
            case "building":
                return copy.wordBook.building
            case "stable":
                return copy.wordBook.stable
            case "mastered":
            case "ignored":
                return copy.wordBook.mastered
            default:
                return copy.wordBook.untracked
        }
    }

    function showHoverCard(item: WordModel, index: number) {
        setHoverCard({
            index,
            word: item.display_word || item.canonical || item.word,
            definition: item.definition || copy.wordBook.loadingDefinition,
        })
    }

    return (
        <div className="w-full">
            <div className="theme-panel overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full" style={{ borderColor: "var(--border-soft)" }}>
                        <thead style={{ background: "var(--button-secondary-bg)" }}>
                            <tr>
                                <th scope="col" className="theme-faint py-4 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-[0.22em]">
                                    {copy.wordBook.word}
                                </th>
                                <th scope="col" className="theme-faint px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em]">
                                    {copy.wordBook.memory}
                                </th>
                                <th scope="col" className="theme-faint px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em]">
                                    {copy.wordBook.familiarity}
                                </th>
                                <th scope="col" className="theme-faint px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em]">
                                    {copy.wordBook.query}
                                </th>
                                <th scope="col" className="theme-faint px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.22em]">
                                    {copy.wordBook.actions}
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ borderColor: "var(--border-soft)" }}>
                            {mylist?.length > 0 ? mylist.map((item, index) => (
                                <tr key={index} className="transition hover:bg-[var(--button-secondary-bg)]">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium">
                                        <div className="relative inline-flex items-center">
                                            <button
                                                type="button"
                                                className="inline-flex w-fit cursor-help items-center rounded-md text-left underline decoration-[var(--border-strong)] underline-offset-4 transition hover:text-[var(--quote-accent)]"
                                                onMouseEnter={() => showHoverCard(item, index)}
                                                onMouseLeave={() => setHoverCard(null)}
                                            >
                                                {item.display_word || item.word}
                                            </button>
                                            {hoverCard?.index === index && (
                                                <div
                                                    className="theme-menu pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-[320px] -translate-y-1/2 rounded-2xl p-4 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
                                                >
                                                    <div className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.wordBook.definition}</div>
                                                    <div className="mt-2 text-base font-semibold text-[var(--quote-accent)]">{hoverCard.word}</div>
                                                    <div className="theme-muted mt-3 whitespace-pre-line leading-6">
                                                        {hoverCard.definition}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="theme-muted whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${memoryBadgeClass(getDisplayMemoryBadge(item))}`}>
                                            {memoryBadgeLabel(getDisplayMemoryBadge(item))}
                                        </span>
                                    </td>
                                    <td className="theme-muted whitespace-nowrap px-3 py-4 text-sm">
                                        <LevelComponent updateLevel={(level) => {
                                            handleUpdateLevel(item, level == item.level ? 0 : level)
                                        }} currentLevel={getDisplayFamiliarityLevel(item)} pages={[1, 2, 3, 4, 5]} />
                                    </td>
                                    <td className="theme-faint whitespace-nowrap px-3 py-4 text-sm">{item.query_count ?? 0}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <div className="theme-faint flex items-center gap-4">
                                            <button
                                                type="button"
                                                className="transition hover:text-white"
                                                onClick={() => handleIgnoreWord(item, index)}
                                                title={copy.wordBook.ignoreWord}
                                            >
                                                <EyeSlashIcon className="h-5 w-5" />
                                            </button>

                                            <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} className="transition hover:text-[var(--text-primary)]" title={copy.wordBook.listenOnYouGlish}>
                                                <PlayCircleIcon className="h-5 w-5" />
                                            </Link>

                                            <button
                                                type="button"
                                                className="transition hover:text-[var(--text-primary)]"
                                                onClick={() => handleRemoveWord(item, index)}
                                                title={copy.wordBook.removeWord}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="theme-faint px-6 py-12 text-center text-sm">
                                        {copy.wordBook.empty}
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
