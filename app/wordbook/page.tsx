"use client"
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"
import WordBook from "@/app/components/WordBook";
import { Word } from "@/app/components/types";
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import UserButton from "@/app/components/user-button"
import Pagination from '@/app/components/Pagination'
import ListMenu from '@/app/components/ListMenu'
import InputModal from '@/app/components/InputModal'
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"

export default function Home() {

    const { data: session } = useSession({
        required: false,
    })

    const [wordList, setWordList] = useState<Word[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number[]>([]);
    const [level, setLevel] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [practise, setPractise] = useState(false)


    function fetchCollection(currentPage: number, level: number) {

        fetch("/hts/api/v1/word?level=" + level + "&page=" + currentPage).then((response: Response) => {
            response.json().then((data) => {
                setWordList(data.words)
                setTotal(data.total)
                let n = Math.floor(data.total / 20) + (data.total % 20 == 0 ? 0 : 1)

                if (n > 7) {
                    let arr = []
                    arr.push(...[1, 2, 3])
                    arr.push(-1)
                    arr.push(...[n - 2, n - 1, n])
                    setPages(arr)
                } else {
                    let arr = []
                    for (let i = 1; i <= n; i++) {
                        arr.push(i);
                    }
                    setPages(arr)
                }

            })
        })
    }

    function importWords(words: string) {
        fetch("/hts/api/v1/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: words }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                console.log("done")
            }
        });
    }

    useEffect(() => {
        fetchCollection(page, level)
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-900 pb-10">

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

            {!practise && <>
                <div className="flex justify-start mt-4 bg-white w-[600px] px-4 py-4 ">

                    <div className="sm:flex sm:items-center">
                        <label className="block text-xl font-medium leading-6 text-gray-900 ">
                            Word Book
                        </label>

                    </div>
                    <div className="flex-1"></div>
                    <ListMenu onChange={(e) => {
                        setPage(1)
                        setLevel(e.id)
                        fetchCollection(page, e.id)
                    }}></ListMenu>

                    <button
                        type="button"
                        onClick={() =>
                            setImportOpen(true)
                        }
                        className="h-10 ml-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Import
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setPractise(true)
                        }}
                        className="ml-4 h-10 block rounded-md bg-indigo-500 px-3 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Practise
                    </button>


                </div>

                <Pagination
                    total={
                        total
                    }
                    pages={
                        pages
                    }
                    currentPage={
                        page
                    }
                    nextPage={
                        (p, offset) => {
                            if (p == -1) {
                                return
                            }

                            if (offset == 0) {
                                fetchCollection(p, level)
                                setPage(p)
                            } else {
                                fetchCollection(page + offset, level)
                                setPage(page + offset)
                            }

                        }
                    }></Pagination>

                <WordBook wordList={wordList} onCollectionChange={(e) => {
                    setPage(1)
                    setLevel(e.id)
                    fetchCollection(page, level)
                }}></WordBook>
            </>}
            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} />
            </>}

            <InputModal open={importOpen} onClose={() => { setImportOpen(false) }} importWords={importWords} ></InputModal>

        </main>
    );
}
