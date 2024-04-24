import { useEffect, useState } from "react";
import Link from 'next/link';


export interface Word {
    word: string;
    level: number;
    query_count: number;
}

const WordList: React.FC<{ wordList: Word[], practise: () => void; }> = ({ wordList, practise }) => {


    const [mylist, setWordList] = useState<Word[]>(wordList ?? []);

    function ignoreWord(word: Word, index: number) {
        fetch("/hts/api/v1/ignore", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: word.word }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                setWordList((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                });

            }
        });
    }

    function addWord() {

        const body = mylist?.map(w => w.word).join(' ')
        fetch("/hts/api/v1/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: body }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                console.log("done")
            }
        });

    }

    useEffect(() => {
        setWordList(wordList)
    }, [wordList])

    return <>

        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="bg-white py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-gray-900">Word List</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Build your vocabulary Notebook by addign or ignoring words.
                                </p>
                            </div>
                            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                <button
                                    type="button"
                                    onClick={() =>
                                        addWord()
                                    }
                                    className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Add All
                                </button>
                            </div>

                            <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-none">
                                <button
                                    type="button"
                                    onClick={() =>
                                        practise()
                                    }
                                    className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Practise
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Word
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Level
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Query
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Youglish
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {mylist?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                        {item.word}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.level}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.query_count}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">

                                                        <Link target="_blank" href={'https://youglish.com/pronounce/' + item.word + '/english?'} >
                                                            view
                                                        </Link>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                        <a className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                                            ignoreWord(item, index)
                                                        }}>
                                                            Ignore <span className="sr-only">, {item.word}</span>
                                                        </a>
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