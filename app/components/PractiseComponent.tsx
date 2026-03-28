"use client";

import React, { useEffect, useState } from "react";
import { Word } from "./types";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import HelpSlideOver from "./HelpSlideOver";
import ToolBoxComponent from "./ToolBoxComponent";
import StarComponent from "./StarComponent";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";
import { fetchDefinitions as fetchDefinitionsApi, fetchMarkedWords } from "@/app/lib/dict-api";
import { markWord as markWordApi, submitReviewResult, unmarkWord as unmarkWordApi } from "@/app/lib/practice-api";

export type PractiseMode = "reading" | "review" | "daily" | "custom" | "image-mode" | "grade-mode";

type SelectItem = {
    value: string
    label: string
}

type Props = {
    list?: Word[]
    onClose: (() => void) | undefined
    mode: PractiseMode
    loadWords?: (selection: string) => Promise<Word[]>
    selectItems?: SelectItem[]
    initialSelection?: string
    refillOnEnd?: boolean
    showExample?: boolean
    showVisualHints?: boolean
}

function shuffleList(list: Word[]) {
    const nextList = [...list]
    for (let i = nextList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[nextList[i], nextList[j]] = [nextList[j], nextList[i]]
    }
    return nextList
}

function buildBaseWordList(list: Word[]): Word[] {
    return list.map((item) => ({
        ...item,
        display_word: item.display_word || item.word,
        surface_word: item.surface_word ?? null,
    }))
}

async function enrichWordList(list: Word[], isAuthenticated: boolean): Promise<Word[]> {
    const baseList = buildBaseWordList(list)

    if (baseList.length === 0) {
        return []
    }

    const definitionWords = Array.from(
        new Set(baseList.filter((item) => !item.definition).map((item) => item.word).filter(Boolean))
    )

    const [definitions, markedWords] = await Promise.all([
        definitionWords.length > 0 ? fetchDefinitionsApi(definitionWords) : Promise.resolve([]),
        isAuthenticated ? fetchMarkedWords(baseList.map((item) => item.word)) : Promise.resolve([]),
    ])

    const definitionMap = new Map(
        definitions.map((item) => [((item.query_word || item.word) || "").toLowerCase(), item])
    )
    const markedMap = new Map(markedWords.map((item) => [item.word.toLowerCase(), Boolean(item.mark)]))

    return baseList.map((item) => {
        const lookup = definitionMap.get(item.word.toLowerCase())

        return {
            ...item,
            definition: item.definition || lookup?.definition || "",
            phonetic: item.phonetic ?? lookup?.phonetic,
            cn: item.cn ?? lookup?.cn,
            level: typeof item.level === "number" ? item.level : lookup?.level,
            display_word: item.display_word || item.surface_word || lookup?.display_word || item.word,
            surface_word: item.surface_word ?? lookup?.surface_word ?? null,
            marked: markedMap.has(item.word.toLowerCase()) ? markedMap.get(item.word.toLowerCase()) : item.marked,
        }
    })
}

const PractiseComponent: React.FC<Props> = ({
    list = [],
    onClose,
    mode,
    loadWords,
    selectItems = [],
    initialSelection,
    refillOnEnd = false,
    showExample = true,
    showVisualHints = true,
}) => {
    const [wordList, setWordList] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completed, setCompleted] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selection, setSelection] = useState<string>(initialSelection || selectItems[0]?.value || "")
    const [loadingWords, setLoadingWords] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const handleOnClose = () => setIsOpen(false)
    const { isAuthenticated, login } = useCustomAuth()
    const { copy } = useAppPreferences()

    const word = wordList[currentIndex]
    const marked = !!word?.marked
    const definition = word?.definition || ""
    const displayWord = word?.display_word || word?.surface_word || word?.word || ""

    useEffect(() => {
        let cancelled = false

        async function loadStaticWords() {
            setLoadingWords(true)
            setLoadError(false)
            setCurrentIndex(0)
            setCompleted(false)

            try {
                const nextWords = await enrichWordList(list, isAuthenticated)
                if (!cancelled) {
                    setWordList(nextWords)
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load practice words:", error)
                    setWordList(buildBaseWordList(list))
                    setLoadError(true)
                }
            } finally {
                if (!cancelled) {
                    setLoadingWords(false)
                }
            }
        }

        if (!loadWords) {
            loadStaticWords()
        }

        return () => {
            cancelled = true
        }
    }, [isAuthenticated, list, loadWords])

    useEffect(() => {
        if (!loadWords || !selection) {
            return
        }

        let cancelled = false
        const loader = loadWords

        async function loadSelectableWords() {
            setLoadingWords(true)
            setLoadError(false)
            setCurrentIndex(0)
            setCompleted(false)

            try {
                const loadedWords = await loader(selection)
                const nextWords = await enrichWordList(loadedWords, isAuthenticated)
                if (!cancelled) {
                    setWordList(nextWords)
                }
            } catch (error) {
                console.error("Failed to load selectable practice words:", error)
                if (!cancelled) {
                    setWordList([])
                    setLoadError(true)
                }
            } finally {
                if (!cancelled) {
                    setLoadingWords(false)
                }
            }
        }

        loadSelectableWords()

        return () => {
            cancelled = true
        }
    }, [isAuthenticated, loadWords, selection])

    useEffect(() => {
        if (wordList.length === 0) {
            setCurrentIndex(0)
            return
        }

        if (currentIndex >= wordList.length) {
            setCurrentIndex(wordList.length - 1)
        }
    }, [currentIndex, wordList.length])

    async function nextWord() {
        setCompleted(false)
        if (currentIndex < wordList.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1)
            return
        }

        if (!loadWords || !refillOnEnd || !selection) {
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, wordList.length - 1))
            return
        }

        const loader = loadWords

        setLoadingWords(true)
        setLoadError(false)
        try {
            const loadedWords = await loader(selection)
            const nextWords = await enrichWordList(loadedWords, isAuthenticated)
            setWordList(nextWords)
            setCurrentIndex(0)
        } catch (error) {
            console.error("Failed to refill practice words:", error)
            setLoadError(true)
        } finally {
            setLoadingWords(false)
        }
    }

    function prevWord() {
        setCompleted(false)
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    function randomizeWords() {
        setCompleted(false)
        setCurrentIndex(0)
        setWordList((prevList) => shuffleList(prevList))
    }

    function markWord() {
        if (!isAuthenticated) {
            login()
            return
        }

        if (!word?.word) {
            return
        }

        markWordApi(word.word).then(() => {
            setWordList((prevList) => prevList.map((item, index) => {
                if (index !== currentIndex) {
                    return item
                }

                return { ...item, marked: true }
            }))
        })
    }

    function unmarkWord() {
        if (!isAuthenticated) {
            login()
            return
        }

        if (!word?.word) {
            return
        }

        unmarkWordApi(word.word).then(() => {
            setWordList((prevList) => prevList.map((item, index) => {
                if (index !== currentIndex) {
                    return item
                }

                return { ...item, marked: false }
            }))
        })
    }

    function handleSolved(result: "correct" | "hinted") {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, result, mode, word.surface_word).catch((error) => {
            console.error("Failed to submit review result:", error)
        })
    }

    function handleSkipped() {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, "skipped", mode, word.surface_word).catch((error) => {
            console.error("Failed to submit skipped result:", error)
        })
    }

    return (
        <div className={styles.boardContainer}>

            <ToolBoxComponent
                selectItems={selectItems}
                selectLevel={selectItems.length > 0 ? setSelection : undefined}
                marked={marked}
                mark={markWord}
                unmark={unmarkWord}
                onClose={onClose}
                word={word?.word ?? ""}
                displayWord={displayWord}
                source={mode}
                random={randomizeWords}
                next={() => nextWord()}
                showIgnore={true}
                playable={true}
            />

            {completed && <StarComponent word={displayWord} currentLevel={word?.level ?? 0}></StarComponent>}

            {loadingWords ? (
                <div className="theme-muted px-6 py-16 text-center text-sm">{copy.practice.loadingWords}</div>
            ) : loadError ? (
                <div className="theme-muted px-6 py-16 text-center text-sm">{copy.practice.loadError}</div>
            ) : word ? (
                <WordComponent
                    word={displayWord}
                    next={() => nextWord()}
                    complete={() => setCompleted(true)}
                    onSolved={handleSolved}
                    onSkip={handleSkipped}
                    definition={definition}
                    imgurl={showVisualHints ? (word?.imgurl ?? "") : ""}
                    emoji={showVisualHints ? (word?.emoji ?? "") : ""}
                    showExample={showExample}
                    prev={() => prevWord()}
                />
            ) : (
                <div className="theme-muted px-6 py-16 text-center text-sm">{copy.practice.empty}</div>
            )}

            <KeyBoardComponent />
            <HelpSlideOver open={isOpen} onClose={handleOnClose} />

        </div>
    );
};

export default PractiseComponent;
