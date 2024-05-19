"use client";
import { Word } from "./types";
import React, { useState, useEffect } from "react";
import styles from "./ComponentStyle.module.css";
import WordComponent from "./WordComponent";
import KeyBoardComponent from "./KeyBoardComponent";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import HelpSlideOver from "./HelpSlideOver";



const PractiseComponent: React.FC<{ list: Word[], onClose: () => void }> = ({ list, onClose }) => {
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

    useEffect(() => {
        if (list && list.length > 0) {
            fetchDefinitions(list)
        }
    }, []);

    function nextWord() {
        setCompleted(false);
        fetchDefinition(wordList)
    }

    function fetchDefinitions(list: Word[]) {
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

            var wd = list.shift();
            setWord(wd);
            setMarked(!!wd?.marked);
            console.log(wd?.definition)
            setDefinition(wd?.definition || "");
            setWordList(list);
        })
    }

    function fetchDefinition(list: Word[]) {

        var wd = list.shift();
        if (wd == undefined) {
            return
        }

        setWord(wd);
        setMarked(!!wd?.marked);
        setDefinition(wd?.definition || "");
        setWordList(list);
    }

    function markWord() {

        if (!session?.user) {
            router.push('/api/auth/signin')
        }

        if (word) {
            fetch("/hts/api/v1/mark?word=" + word.word, { method: 'POST', }).then((response: Response) => {
                console.log(response.body)
                word.marked = true;
                setMarked(true);
            });
        }
    }

    function unmarkWord() {
        if (!session?.user) {
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

            {completed && (
                <div className="text-yellow-500 text-base mt-10">
                    🎉🎉🎉 Bravo! Press any key to continue.
                    {!marked && <button onClick={markWord} className={styles.star_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>}
                    {marked && <button onClick={unmarkWord} className={styles.star_button_marked}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>}
                    {<button onClick={onClose} className={styles.star_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </button>}
                </div>
            )}

            {!completed && (
                <div className="text-base≠ mt-10">
                    Type the word by its definition.
                    {!marked && <button onClick={markWord} className={styles.star_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>}
                    {marked && <button onClick={unmarkWord} className={styles.star_button_marked}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>}

                    {<button onClick={onClose} className={styles.star_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </button>}

                </div>
            )}

            <WordComponent
                word={word?.word ?? ""}
                next={() => nextWord()}
                complete={() => setCompleted(true)}
                definition={definition}
                imgurl={word?.imgurl ?? ""}
                emoji={word?.emoji ?? ""}
                showExample={true}
            />

            <KeyBoardComponent />
            <HelpSlideOver open={isOpen} onClose={handleOnClose} />

        </div>
    );
};

export default PractiseComponent;
