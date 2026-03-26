"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import HelpSlideOver from "./HelpSlideOver";
import ToolBoxComponent from "./ToolBoxComponent";
import StarComponent from "./StarComponent";
import { fetchDefinitions as fetchDefinitionsApi } from "@/app/lib/dict-api";
import { markWord as markWordApi, submitReviewResult, unmarkWord as unmarkWordApi } from "@/app/lib/practice-api";

const PractiseComponent: React.FC<{ list: Word[], onClose: (() => void) | undefined }> = ({ list, onClose }) => {
    const [word, setWord] = useState<Word>();
    const [definition, setDefinition] = useState<string>("");
    const [wordList, setWordList] = useState<Word[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);
    const [marked, setMarked] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleOnClose = () => setIsOpen(false);
    const { isAuthenticated, login } = useCustomAuth();

    function shuffleList(list: Word[]) {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    useEffect(() => {
        if (list && list.length > 0) {
            fetchDefinitions(list)
        }
    }, [list]);

    function nextWord() {
        setCompleted(false);

        if (word) {
            var idx = wordList.indexOf(word)
            if (idx < wordList.length - 1) {
                var wd = wordList[idx + 1];
                setWord(wd);
                setMarked(!!wd?.marked);
                setDefinition(wd?.definition || "");
            }
        }
    }

    function prevWord() {
        setCompleted(false);
        if (word) {
            var idx = wordList.indexOf(word);
            if (idx > 0) {
                var wd = wordList[idx - 1];
                setWord(wd);
                setMarked(!!wd?.marked);
            }
        }

    }

    function fetchDefinitions(list: Word[]) {
        list = [...list]
        fetchDefinitionsApi(list.map((w) => w.word)).then((words) => {
            words.forEach((w: Word) => {
                const lookupWord = w.query_word || w.word
                const wd = list.find(x => x.word == lookupWord)
                if (wd) {
                    wd.definition = w.definition
                    wd.word = w.word || wd.word
                }
            })
            var wd = list[0];
            setWord(wd);
            setMarked(!!wd?.marked);
            setDefinition(wd?.definition || "");
            setWordList(list)
        })
    }



    function markWord() {
        if (!isAuthenticated) {
            login()
            return
        }

        if (word) {
            markWordApi(word.word).then(() => {
                word.marked = true;
                setMarked(true);
            });
        }
    }

    function unmarkWord() {
        if (!isAuthenticated) {
            login()
            return
        }

        if (word) {
            unmarkWordApi(word.word).then(() => {
                word.marked = false;
                setMarked(false);
            });
        }
    }

    function handleSolved(result: "correct" | "hinted") {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, result, "practice").catch((error) => {
            console.error("Failed to submit review result:", error)
        })
    }

    function handleSkipped() {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, "skipped", "practice").catch((error) => {
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
                random={() => {
                    setWordList([...shuffleList(wordList)])
                    nextWord()
                }}
                next={() => nextWord()}
                showIgnore={true}
                playable={true}
            />

            {completed && <StarComponent word={word?.word ?? ""}></StarComponent>}

            <WordComponent
                word={word?.word ?? ""}
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
