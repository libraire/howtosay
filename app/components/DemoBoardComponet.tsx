"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";


const BoardComponent: React.FC<{}> = () => {
    const [word, setWord] = useState<Word>();;
    const [wordList, setWordList] = useState<Word[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);

    useEffect(() => {
        if (wordList.length == 0) {
            fetchData();
        }
    }, [word, wordList]);

    function shuffleList(list: Word[]) {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    const fetchData = async () => {
        try {
            const response = await fetch("hts/api/v1/dict/daily");
            const jsonData = await response.json();
            let list = shuffleList(jsonData.wordlist);
            var wd = list[0]
            setWord(wd);
            setWordList(list);
        } catch (error) {
            console.error("Error fetching data:", error);
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

    return (
        <div className={styles.boardContainer}>

            <h2 className="text-indigo-600 mt-10 font-medium">20 new words everyday for free</h2>
            <div className="text-4xl font-medium"> Guess and type the word</div>
            <div className="text-gray-200 mb-10">Press &lt;Enter&gt; to prompt and to continue</div>
            <WordComponent
                word={word?.word ?? ""}
                next={() => nextWord()}
                complete={() => setCompleted(true)}
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
