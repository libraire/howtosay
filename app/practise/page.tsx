"use client"
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"
import WordList from "@/app/components/WordList";
import { Word } from "@/app/components/types";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import UserButton from "@/app/components/user-button"

export default function Home() {

    const { data: session } = useSession({
        required: false,
    })

    const [message, setMessage] = useState('');
    const [practise, setPractise] = useState(false)
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [wordList, setWordList] = useState<Word[]>([]);

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
                setPractise(true)
            } else {
                console.log('Post request failed');
            }
        } catch (error) {
            // TODO login first
        } finally {
            setButtonDisabled(false)
        }
    };

    useEffect(() => {


    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-900">

            <div className={styles.headContainer}>
                <div className={styles.title}>
                    {" "}
                    <span className={styles.displayNarrow}>💡 </span>How To Say
                </div>
                <div className="flex-1 "> </div>
                <MyDropDown showHelpSlide={() => {
                    // setIsOpen(true)
                }} />
                <UserButton />
            </div>

            {!practise &&
                <div className="container mx-auto pt-2">
                    <div className='max-w-screen-sm mx-auto p-4'>
                        <label htmlFor="email" className="mb-2 block text-m font-medium leading-6 text-white">
                            Filter the words
                        </label>

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
                                            placeholder=" Paste text here..."
                                            defaultValue={''}
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
                                                onClick={handleSending}
                                                disabled={isButtonDisabled}
                                            >
                                                Practice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }


            {!practise && wordList.length > 0 && <WordList wordList={wordList} practise={() => setPractise(true)}></WordList>}


            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} />
            </>}

        </main>
    );
}
