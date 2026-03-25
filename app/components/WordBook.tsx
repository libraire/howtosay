import { useEffect, useState } from "react";
import Link from 'next/link';
import { TrashIcon, PlayCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import LevelComponent from "./LevelComponent"
import type { WordModel } from "@/app/lib/dict-models";
import { ignoreWord, removeWord, updateWordLevel } from "@/app/lib/practice-api";

const WordBook: React.FC<{ wordList: WordModel[], onCollectionChange: (e: { id: number, name: string }) => void }> = ({ wordList, onCollectionChange }) => {

    const [mylist, setWordList] = useState<WordModel[]>(wordList ?? []);

    function handleRemoveWord(word: WordModel, index: number) {
        removeWord(word.word).then(() => {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });
        });
    }

    function handleUpdateLevel(word: WordModel, level: number) {
        updateWordLevel(word.word, level).then(() => {
                word.level = level
                setWordList((prevList) => {
                    return [...prevList];
                });
        });
    }

    function handleIgnoreWord(word: WordModel, index: number) {
        ignoreWord(word.word).then(() => {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });
        });
    }

    useEffect(() => {
        setWordList(wordList)
    }, [wordList])

    return <>

        <div className="bg-[#101010] w-[600px]">
            <div className="mx-auto max-w-7xl">
                <div className="bg-white">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Word
                                                </th>
                                                <th scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Level
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Query
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {mylist?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 text-sm font-medium text-gray-900 sm:pl-0">
                                                        {item.word}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 text-sm text-gray-500">

                                                        <LevelComponent updateLevel={(level) => {
                                                            handleUpdateLevel(item, level == item.level ? 0 : level)
                                                        }} currentLevel={item.level ?? 0} pages={[1, 2, 3, 4, 5]} />

                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.query_count}</td>
                                                    <td className="flex justify-start relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">

                                                        <EyeSlashIcon className="cursor-pointer h-5 w-5 text-gray-900" onClick={() => {
                                                            handleIgnoreWord(item, index)
                                                        }}> </EyeSlashIcon>

                                                        <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} >
                                                            <PlayCircleIcon className="cursor-pointer ml-4 h-5 w-5 text-gray-900"></PlayCircleIcon>
                                                        </Link>

                                                        <TrashIcon className="cursor-pointer ml-4 h-5 w-5 text-gray-900" onClick={() => {
                                                            handleRemoveWord(item, index)
                                                        }}> </TrashIcon>
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

export default WordBook;
