"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { Word } from "@/app/components/types";
import styles from "@/app/components/ComponentStyle.module.css";
import Navbar from "@/app/components/Navbar";
import { XMarkIcon, Bars3Icon } from '@heroicons/react/20/solid'
import WordSlideOver from "@/app/components/WordSlideOver";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { BookmarkIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { redirect } from "next/navigation"

export default function Home() {

    const { data: session, update } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/signin")
        }
    })

    const [message, setMessage] = useState('');
    const [read, setRead] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [wordList, setWordList] = useState<Word[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const handleOnClose = () => setIsOpen(false);
    const [practise, setPractise] = useState(false)
    var wordbackup: Word[] = []

    const [popoverVisible, setPopoverVisible] = useState<boolean[]>(Array(10000).fill(false));

    const handlePopoverToggle = (index: number) => {
        setPopoverVisible((prevState) => {
            const updatedState = [...prevState];
            updatedState[index] = !updatedState[index];
            return updatedState;
        });
    };

    function ignoreWord(word: string) {
        fetch("/hts/api/v1/ignore", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: word }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                setWordList((prevList) => {
                    return [...prevList.filter((item) => item.word !== word)]
                })
            }
        });
    }

    function markWord(word: string) {
        fetch("/hts/api/v1/mark?word=" + word, { method: 'POST', })
            .then((response: Response) => {
                return response.json()
            }).then((data) => {
                if (data.status == 'ok') {
                    setWordList((prevList) => {
                        return [...prevList.filter((item) => item.word !== word)]
                    })
                }
            });
    }

    const handleSending = async () => {
        if (!message) {
            alert('The content is empty');
            return;
        }

        const url = '/hts/api/v1/filter';
        const data = {
            app: 'howtosay',
            body: message,
        };

        setButtonDisabled(true)

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const json = await response.json();
                setWordList(json.words)
            } else {
                console.log('Post request failed');
            }
        } catch (error) {
            // TODO login first
        } finally {
            setButtonDisabled(false)
        }
    };

    async function toggleReading() {

        if (read) {
            setRead(false)
        } else {
            await handleSending()
            setRead(true)
        }
    }

    async function togglePractise() {

        if (practise) {
            setPractise(false)
        } else {
            await handleSending()
            setPractise(true)
        }
    }


    useEffect(() => {

    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-900">

            <Navbar />

            {!read && !practise &&
                <div className="container mx-auto pt-2">
                    <div className='max-w-screen-sm mx-auto p-4'>
                        <div className="flex items-start space-x-4">
                            <div className="min-w-0 flex-1">
                                <div className="relative">
                                    <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                        <label htmlFor="comment" className="sr-only">
                                            Word list...
                                        </label>
                                        <textarea
                                            rows={10}
                                            name="comment"
                                            id="comment"
                                            className="block w-full resize-none border-0 bg-transparent py-1.5 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                            placeholder=" Paste words  here..."
                                            onChange={(e) => setMessage(e.target.value)}
                                            value={message}
                                        />

                                        <div className="py-2" aria-hidden="true">
                                            <div className="py-px">
                                                <div className="h-9" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                        <div className="flex items-center space-x-5">
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                                >
                                                    <span className="sr-only">Attach a file</span>
                                                </button>
                                            </div>

                                        </div>
                                        <div className="flex-shrink-0">

                                            <button
                                                type="button"
                                                id='send'
                                                className="mr-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={togglePractise}
                                                disabled={isButtonDisabled}
                                            >
                                                Practise
                                            </button>

                                            <button
                                                type="button"
                                                id='send'
                                                className="mr-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={toggleReading}
                                                disabled={isButtonDisabled}
                                            >
                                                Read Mode
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

            {read && <>
                <div className="text-lg  font-serif bg-white text-gray-700 rounded-lg shadow-lg p-6  whitespace-pre-wrap max-w-screen-md mb-20 mt-5 px-16">

                    <div className="flex justify-end mb-10">
                        {!hidden && <EyeSlashIcon className="cursor-pointer -mr-1 h-6 w-6 mr-2" onClick={() => { wordbackup = wordList; setWordList([]); setHidden(true) }}> </EyeSlashIcon>}
                        {hidden && <EyeIcon className="cursor-pointer -mr-1 h-6 w-6 mr-2" onClick={() => { setWordList(wordbackup); setHidden(false) }}> </EyeIcon>}
                        <Bars3Icon className="cursor-pointer -mr-1 h-6 w-10 mr-2" onClick={() => { setIsOpen(true) }} > </Bars3Icon>
                        <XMarkIcon className="cursor-pointer -mr-1 h-6 w-6" onClick={() => { toggleReading() }}> </XMarkIcon>
                    </div>


                    {
                        message.split(' ').map((item, index) => {
                            if (wordList.some(v => v.word == item)) {
                                return (
                                    <div key={index} className={styles.popoverContainer}>
                                        <span className={styles.trigger} onClick={() => handlePopoverToggle(index)} >
                                            {`${item} `}
                                            {popoverVisible[index] && (
                                                <div className={styles.popover}>
                                                    <EyeSlashIcon className="cursor-pointer h-5 w-5 text-gray-900" onClick={() => {
                                                        ignoreWord(item)
                                                    }}> </EyeSlashIcon>

                                                    <BookmarkIcon className="cursor-pointer h-5 w-5 text-gray-900" onClick={() => {
                                                        markWord(item)
                                                    }}></BookmarkIcon>
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                )
                            }
                            return `${item} `
                        })
                    }
                </div>
            </>}

            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} onClose={togglePractise} />
            </>}

            <WordSlideOver open={isOpen} onClose={handleOnClose} wordList={wordList} practise={() => {
                setIsOpen(false)
                setRead(false)
                togglePractise()

            }} />

        </main>
    );
}
