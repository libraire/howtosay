"use client"
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import WordSlideOver from "@/app/components/WordSlideOver";
import { BookmarkIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/20/solid';
import { Word } from "@/app/components/types";
import styles from "@/app/components/ComponentStyle.module.css";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import Navbar from "@/app/components/Navbar";

export default function DynamicPage() {

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [hidden, setHidden] = useState(false)
    const [message, setMessage] = useState('');
    const [wordList, setWordList] = useState<Word[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    var wordbackup: Word[] = []
    const [popoverVisible, setPopoverVisible] = useState<boolean[]>(Array(10000).fill(false));
    const [practise, setPractise] = useState(false);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const handleOnClose = () => setIsOpen(false);

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

    const handleSending = async (message: string) => {

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

    async function togglePractise() {

        if (practise) {
            setPractise(false)
        } else {
            await handleSending(message)
            setPractise(true)
        }
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

    useEffect(() => {

        const id = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (id) {
            fetch("/hts/api/v1/material?id=" + id)
                .then((response: Response) => {
                    return response.json()
                }).then((data) => {
                    console.log(data)
                    if (data.status == 'ok') {
                        return data.article.content
                    }
                    return ""

                }).then((msg: string) => {
                    setMessage(msg)
                    return handleSending(msg)
                });
        }

    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">

            <Navbar />
            {!practise && <div className="text-lg  font-serif bg-white text-gray-700 rounded-lg shadow-lg p-6  whitespace-pre-wrap max-w-screen-md mb-20 mt-5 px-16">

                <div className="flex justify-end mb-10">
                    {!hidden && <EyeSlashIcon className="cursor-pointer -mr-1 h-6 w-6 mr-2" onClick={() => { wordbackup = wordList; setWordList([]); setHidden(true) }}> </EyeSlashIcon>}
                    {hidden && <EyeIcon className="cursor-pointer -mr-1 h-6 w-6 mr-2" onClick={() => { setWordList(wordbackup); setHidden(false) }}> </EyeIcon>}
                    <Bars3Icon className="cursor-pointer -mr-1 h-6 w-10 mr-2" onClick={() => { setIsOpen(true) }} > </Bars3Icon>
                </div>

                <div className='min-w-[600px]'>
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
                        })}
                </div>

            </div>
            }

            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} onClose={togglePractise} />
            </>}

            <WordSlideOver open={isOpen} onClose={handleOnClose} wordList={wordList} practise={() => {
                setIsOpen(false)
                togglePractise()
            }} />
        </main>
    )
}