"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import HelpSlideOver from "./HelpSlideOver";
import ToolBoxComponent from "./ToolBoxComponent";
import StarComponent from "./StarComponent";

const PractiseComponent: React.FC<{ list: Word[], onClose: (() => void) | undefined }> = ({ list, onClose }) => {
    const [word, setWord] = useState<Word>();
    const [definition, setDefinition] = useState<string>("");
    const [wordList, setWordList] = useState<Word[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);
    const [marked, setMarked] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleOnClose = () => setIsOpen(false);
    const router = useRouter()

    const { data: session, update } = useSession({
        required: false,
    })

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
        let words = list.map((w) => w.word).join(',')
        fetch("/hts/api/v1/definitions?words=" + words).then((response: Response) => {
            return response.json()
        }).then((data) => {
            data.words.forEach((w: Word) => {
                const wd = list.find(x => x.word == w.word)
                if (wd) {
                    wd.definition = w.definition
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

        // TODO
        // if (!session?.user) {
        //     console.log("333333333")
        //     router.push('/api/auth/signin')
        // }

        if (word) {
            fetch("/hts/api/v1/mark?word=" + word.word, { method: 'POST', }).then((response: Response) => {
                word.marked = true;
                setMarked(true);
            });
        }
    }

    function unmarkWord() {
        if (!session?.user) {
            console.log("44444444444444")
            router.push('/api/auth/signin')
        }

        if (word) {
            fetch("/hts/api/v1/mark?word=" + word.word, { method: 'DELETE', }).then((response: Response) => {
                word.marked = false;
                setMarked(false);
            });
        }
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
