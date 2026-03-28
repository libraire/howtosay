"use client"
import { useState } from "react";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { Word } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { useEffect } from "react";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";

export default function Home() {
    const { isAuthenticated, isLoading, login } = useCustomAuth();
    const { copy } = useAppPreferences()

    const [message, setMessage] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [wordList, setWordList] = useState<Word[]>([]);
    const [practise, setPractise] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login()
        }
    }, [isAuthenticated, isLoading, login]);

    if (isLoading || !isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010]">
                <Navbar />
            </main>
        );
    }

    const handleSending = () => {
        if (!message) {
            alert(copy.customPractice.emptyContent);
            return;
        }

        const list = Array.from(new Set(message.split(/[\n\t\s]+/)))
            .filter((word) => word.trim() != "")
            .map((word) => {
                return { word: word.trim(), marked: false, level: 0, query_count: 0, definition: "", imgurl: "", emoji: "" }
            })

        setWordList(list);

    };

    async function togglePractise() {
        if (practise) {
            setPractise(false)
        } else {
            handleSending()
            setPractise(true)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">

            <Navbar />

            {!practise &&
                <div className="container mx-auto pt-2">
                    <div className='max-w-screen-sm mx-auto p-4'>
                        <div className="flex items-start space-x-4">
                            <div className="min-w-0 flex-1">
                                <div className="relative">
                                    <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                        <textarea
                                            rows={10}
                                            name="comment"
                                            id="comment"
                                            className="block w-full resize-none border-0 bg-transparent py-1.5 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                            placeholder={copy.customPractice.placeholder}
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
                                                    <span className="sr-only">{copy.customPractice.attachFile}</span>
                                                </button>
                                            </div>

                                        </div>
                                        <div className="flex-shrink-0">

                                            <button
                                                type="button"
                                                id='send'
                                                className="mr-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={() => { togglePractise() }}
                                                disabled={isButtonDisabled}
                                            >
                                                {copy.customPractice.practise}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }


            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} onClose={togglePractise} mode="custom" />
            </>}

        </main>
    );
}
