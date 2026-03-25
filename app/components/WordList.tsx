import { useEffect, useState } from "react";
import Link from 'next/link';
import { BookmarkIcon, EyeSlashIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import type { WordModel } from "@/app/lib/models";
import { addWords, ignoreWord, markWord } from "@/app/lib/word-api";

const WordList: React.FC<{ wordList: WordModel[], practise: () => void; }> = ({ wordList, practise }) => {

    const [mylist, setWordList] = useState<WordModel[]>(wordList ?? []);
    function handleIgnoreWord(word: WordModel, index: number) {
        ignoreWord(word.word).then(() => {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });
        });
    }

    function handleMarkWord(word: string, index: number) {
        markWord(word).then(() => {
                    setWordList((prevList) => {
                        const newList = [...prevList];
                        newList.splice(index, 1);
                        return newList;
                    });
            });
    }


    function handleAddWord() {

        const body = mylist?.map(w => w.word).join(' ')
        addWords(body).then(() => {
            console.log("done")
        });

    }

    useEffect(() => {
        setWordList(wordList)
    }, [wordList])

    return <>

        <div className="bg-[#101010]">
            <div className="mx-auto max-w-7xl">
                <div className="bg-white">
                    <div className="">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <p className="text-sm text-gray-600">
                                    Build your vocabulary Notebook by adding or ignoring words.
                                </p>
                            </div>
                            <div className="flex mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddWord()
                                    }
                                    className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Add All
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        practise()
                                    }
                                    className="ml-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Practise
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Word
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {mylist?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                        {item.word}
                                                    </td>
                                                    <td className="flex justify-around relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">

                                                        <BookmarkIcon className="cursor-pointer h-4 w-4 text-gray-900" onClick={() => {
                                                            handleMarkWord(item.word, index)
                                                        }}> </BookmarkIcon>

                                                        <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} >
                                                            <PlayCircleIcon className="cursor-pointer h-4 w-4 text-gray-900" ></PlayCircleIcon>
                                                        </Link>

                                                        <EyeSlashIcon className="cursor-pointer h-4 w-4 text-gray-900" onClick={() => {
                                                            handleIgnoreWord(item, index)
                                                        }}> </EyeSlashIcon>


                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    </>
};

export default WordList;
