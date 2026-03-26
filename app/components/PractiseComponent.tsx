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
import { fetchDefinitions as fetchDefinitionsApi } from "@/app/lib/dict-api";
import { markWord as markWordApi, submitReviewResult, unmarkWord as unmarkWordApi } from "@/app/lib/practice-api";

export type PractiseMode = "reading" | "review" | "daily" | "custom";

type Props = {
    list: Word[]
    onClose: (() => void) | undefined
    mode: PractiseMode
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

const PractiseComponent: React.FC<Props> = ({ list, onClose, mode }) => {
    const [wordList, setWordList] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completed, setCompleted] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false)
    const handleOnClose = () => setIsOpen(false)
    const { isAuthenticated, login } = useCustomAuth()

    const word = wordList[currentIndex]
    const marked = !!word?.marked
    const definition = word?.definition || ""
    const displayWord = word?.display_word || word?.surface_word || word?.word || ""

    useEffect(() => {
        let cancelled = false
        const baseList = buildBaseWordList(list)

        setWordList(baseList)
        setCurrentIndex(0)
        setCompleted(false)

        const wordsToLookup = Array.from(
            new Set(baseList.filter((item) => !item.definition).map((item) => item.word).filter(Boolean))
        )

        if (wordsToLookup.length === 0) {
            return () => {
                cancelled = true
            }
        }

        fetchDefinitionsApi(wordsToLookup)
            .then((definitions) => {
                if (cancelled) {
                    return
                }

                const definitionMap = new Map(
                    definitions.map((item) => [((item.query_word || item.word) || "").toLowerCase(), item])
                )

                setWordList(baseList.map((item) => {
                    const lookup = definitionMap.get(item.word.toLowerCase())
                    if (!lookup) {
                        return item
                    }

                    return {
                        ...item,
                        definition: item.definition || lookup.definition || "",
                        phonetic: item.phonetic ?? lookup.phonetic,
                        cn: item.cn ?? lookup.cn,
                        level: typeof item.level === "number" ? item.level : lookup.level,
                        display_word: item.display_word || item.surface_word || lookup.display_word || item.word,
                        surface_word: item.surface_word ?? lookup.surface_word ?? null,
                    }
                }))
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error("Failed to load practice definitions:", error)
                    setWordList(baseList)
                }
            })

        return () => {
            cancelled = true
        }
    }, [list])

    useEffect(() => {
        if (wordList.length === 0) {
            setCurrentIndex(0)
            return
        }

        if (currentIndex >= wordList.length) {
            setCurrentIndex(wordList.length - 1)
        }
    }, [currentIndex, wordList.length])

    function nextWord() {
        setCompleted(false)
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, wordList.length - 1))
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
                selectItems={[]}
                selectLevel={undefined}
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

            {completed && <StarComponent word={displayWord}></StarComponent>}

            <WordComponent
                word={displayWord}
                next={() => nextWord()}
                complete={() => setCompleted(true)}
                onSolved={handleSolved}
                onSkip={handleSkipped}
                definition={definition}
                imgurl={word?.imgurl ?? ""}
                emoji={word?.emoji ?? ""}
                showExample={true}
                prev={() => prevWord()}
            />

            <KeyBoardComponent />
            <HelpSlideOver open={isOpen} onClose={handleOnClose} />

        </div>
    );
};

export default PractiseComponent;
