"use client"
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"
import ArticleList from "@/app/components/ArticleList";
import { Article } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import Pagination from '@/app/components/Pagination'
import { redirect } from "next/navigation"
import InputArticle from "../components/InputArticle";

export default function Home() {

    const { data: session, update } = useSession({
        required: true,
        onUnauthenticated() {
            // redirect("/api/auth/signin")
        }
    })

    const [wordList, setWordList] = useState<Article[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number[]>([]);
    const [level, setLevel] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [practise, setPractise] = useState(false)


    function fetchCollection(currentPage: number, level: number) {

        var url = "/hts/api/v1/material/list?page=" + currentPage
        fetch(url).then((response: Response) => {
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



    useEffect(() => {
        fetchCollection(page, level)
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">

            <Navbar />
            {!practise && <>
                <div className="flex justify-start mt-4 bg-white w-[600px] px-4 py-4 ">

                    <div className="sm:flex sm:items-center">
                        <label className="block text-xl font-medium leading-6 text-gray-900 ">
                            Article List
                        </label>

                    </div>
                    <div className="flex-1"></div>
                    <button
                        type="button"
                        onClick={() =>
                            setImportOpen(true)
                        }
                        className="h-10 ml-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        New
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

                <ArticleList wordList={wordList} onCollectionChange={(e) => {
                    setPage(1)
                    setLevel(e.id)
                    fetchCollection(page, level)
                }}></ArticleList>
            </>}

            <InputArticle open={importOpen} onClose={() => { setImportOpen(false) }} id={undefined} title="" content="" />

        </main>
    );
}
