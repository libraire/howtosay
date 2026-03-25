"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import { fetchDailyWords } from "@/app/lib/dict-api";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { submitReviewResult } from "@/app/lib/practice-api";


const BoardComponent: React.FC<{}> = () => {
    const [word, setWord] = useState<Word>();;
    const [wordList, setWordList] = useState<Word[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isAuthenticated } = useCustomAuth();

    useEffect(() => {
        fetchData();
    }, []);

    function shuffleList(list: Word[]) {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    const fetchData = async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            const list = shuffleList([...(await fetchDailyWords())]);
            const wd = list[0];
            setWord(wd);
            setWordList(list);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    function nextWord() {
        setCompleted(false);
        if (word) {
            var idx = wordList.indexOf(word);
            if (idx < wordList.length - 1) {
                var wd = wordList[idx + 1];
                setWord(wd);
            }
        } else if (wordList.length > 0) {
            var wd = wordList[0];
            setWord(wd);
        }
    }

    function prevWord() {
        setCompleted(false);
        if (word) {
            var idx = wordList.indexOf(word);
            if (idx > 0) {
                var wd = wordList[idx - 1];
                setWord(wd);
            }
        }
    }

    function handleSolved(result: "correct" | "hinted") {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, result, "daily").catch((error) => {
            console.error("Failed to submit review result:", error)
        })
    }

    function handleSkipped() {
        if (!isAuthenticated || !word?.word) {
            return
        }

        submitReviewResult(word.word, "skipped", "daily").catch((error) => {
            console.error("Failed to submit skipped result:", error)
        })
    }

    return (
        <div className={styles.boardContainer}>
            <WordComponent
                word={word?.word ?? ""}
                next={() => nextWord()}
                complete={() => setCompleted(true)}
                onSolved={handleSolved}
                onSkip={handleSkipped}
                definition={word?.definition ?? ""}
                imgurl={word?.imgurl ?? ""}
                emoji={word?.emoji ?? ""}
                showExample={false}
                prev={() => { prevWord() }}
            />

            <KeyBoardComponent />

        </div>
    );
};

export default BoardComponent;
