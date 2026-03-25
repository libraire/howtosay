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

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Word
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Level
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Query
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {mylist?.length > 0 ? mylist.map((item, index) => (
                                <tr key={index} className="transition hover:bg-white/[0.025]">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white">
                                        {item.word}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white/70">
                                        <LevelComponent updateLevel={(level) => {
                                            handleUpdateLevel(item, level == item.level ? 0 : level)
                                        }} currentLevel={item.level ?? 0} pages={[1, 2, 3, 4, 5]} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white/55">{item.query_count ?? 0}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-4 text-white/55">
                                            <button
                                                type="button"
                                                className="transition hover:text-white"
                                                onClick={() => handleIgnoreWord(item, index)}
                                                title="Ignore word"
                                            >
                                                <EyeSlashIcon className="h-5 w-5" />
                                            </button>

                                            <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} className="transition hover:text-white" title="Listen on YouGlish">
                                                <PlayCircleIcon className="h-5 w-5" />
                                            </Link>

                                            <button
                                                type="button"
                                                className="transition hover:text-white"
                                                onClick={() => handleRemoveWord(item, index)}
                                                title="Remove word"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-white/45">
                                        No saved words in this view yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default WordBook;
