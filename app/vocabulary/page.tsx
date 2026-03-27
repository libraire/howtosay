"use client"
import { Fragment, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AcademicCapIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import WordBook from "@/app/components/WordBook";
import { Word } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import Pagination from '@/app/components/Pagination'
import ListMenu from '@/app/components/ListMenu'
import InputModal from '@/app/components/InputModal'
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { addWords, fetchWordBook } from "@/app/lib/practice-api";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

function VocabularyPageContent() {
    const { isAuthenticated, isLoading, login } = useCustomAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [wordList, setWordList] = useState<Word[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number[]>([]);
    const [level, setLevel] = useState<number | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [practise, setPractise] = useState(false)
    const [searchWord, setSearchWord] = useState("")
    const [searchKeyword, setSearchKeyword] = useState("")
    const statusFilter = searchParams?.get("status") ?? ""
    const memoryLabel = getMemoryLabel(statusFilter)

    function fetchCollection(currentPage: number, level: number | null, status = statusFilter, keyword = searchKeyword) {
        fetchWordBook(currentPage, level, status || undefined, keyword || undefined).then((data) => {
            setWordList(data.words as Word[])
            setTotal(data.total)

            if (keyword.trim().length > 0) {
                setPages([1])
                return
            }

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
    }

    function importWords(words: string) {
        addWords(words).then(() => {
            console.log("done")
        });
    }

    function handleWordSearch() {
        const nextKeyword = searchWord.trim()
        setPage(1)
        setSearchKeyword(nextKeyword)
        fetchCollection(1, level, statusFilter, nextKeyword)
    }

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return
        }

        fetchCollection(page, level, statusFilter, searchKeyword)
    }, [isAuthenticated, isLoading, level, page, searchKeyword, statusFilter])

    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
                <Navbar />
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
                <Navbar />
                <section className="w-full max-w-5xl px-6 pb-12 pt-8">
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Vocabulary</p>
                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">Build your personal word library</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                            Save words you meet while reading, filter them by level and memory state, and start targeted practice from your own collection.
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                <div className="text-sm text-white">Organize what you save</div>
                                <div className="mt-2 text-sm leading-6 text-white/55">Browse your words by level, search quickly, and focus on exactly the set you want to revisit.</div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                <div className="text-sm text-white">See memory status</div>
                                <div className="mt-2 text-sm leading-6 text-white/55">Track which words are fragile, building, stable, or already mastered.</div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                <div className="text-sm text-white">Practice from your list</div>
                                <div className="mt-2 text-sm leading-6 text-white/55">Turn your saved vocabulary into focused typing and recall sessions whenever you are ready.</div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => login()}
                                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                                Login to open vocabulary
                            </button>
                            <Link
                                href="/"
                                className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">

            <Navbar />
            {!practise && <>
                <section className="w-full max-w-5xl px-6 pb-12 pt-8">
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-white/35">Library</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {memoryLabel && (
                                    <button
                                        type="button"
                                        onClick={() => router.push("/vocabulary")}
                                        className="rounded-full border border-[#9bb7d4]/25 bg-[#9bb7d4]/10 px-4 py-2 text-sm text-[#dce8f6] transition hover:bg-[#9bb7d4]/15"
                                    >
                                        Memory: {memoryLabel} ×
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="w-full max-w-[220px]">
                                <ListMenu onChange={(e) => {
                                    setPage(1)
                                    setLevel(e.id)
                                    fetchCollection(1, e.id, statusFilter, searchKeyword)
                                }}></ListMenu>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="w-full sm:w-[220px]">
                                    <input
                                        type="text"
                                        value={searchWord}
                                        onChange={(event) => setSearchWord(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                handleWordSearch()
                                            }
                                        }}
                                        placeholder="Search word"
                                        className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setImportOpen(true)}
                                    className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Import words
                                </button>

                                <Menu as="div" className="relative inline-block text-left">
                                    <Menu.Button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90">
                                        Practise
                                        <ChevronDownIcon className="h-4 w-4 text-black/60" />
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-20 mt-2 w-60 origin-top-right rounded-2xl border border-white/10 bg-[#161616] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.28)] focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPractise(true)}
                                                        className={classNames(
                                                            active ? "bg-white/10 text-white" : "text-white/75",
                                                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition"
                                                        )}
                                                    >
                                                        <AcademicCapIcon className="h-5 w-5 text-white/45" />
                                                        Practise saved words
                                                    </button>
                                                )}
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/practise"
                                                        className={classNames(
                                                            active ? "bg-white/10 text-white" : "text-white/75",
                                                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
                                                        )}
                                                    >
                                                        <ArrowTopRightOnSquareIcon className="h-5 w-5 text-white/45" />
                                                        Open Custom Practise
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Pagination
                                total={total}
                                pages={pages}
                                currentPage={page}
                                nextPage={(p, offset) => {
                                    if (p == -1) {
                                        return
                                    }

                                    if (offset == 0) {
                                        fetchCollection(p, level, statusFilter, searchKeyword)
                                        setPage(p)
                                    } else {
                                        fetchCollection(page + offset, level, statusFilter, searchKeyword)
                                        setPage(page + offset)
                                    }
                                }}
                            ></Pagination>
                        </div>

                        <div className="mt-6">
                            <WordBook wordList={wordList} onCollectionChange={(e) => {
                                setPage(1)
                                setLevel(e.id)
                                fetchCollection(1, e.id, statusFilter, searchKeyword)
                            }}></WordBook>
                        </div>
                    </div>
                </section>
            </>}
            {practise && <>
                <AudioComponent str={"xxxx"} />
                <PractiseComponent list={wordList} onClose={() => { setPractise(false) }} mode="custom" />
            </>}

            <InputModal open={importOpen} onClose={() => { setImportOpen(false) }} importWords={importWords} ></InputModal>

        </main>
    );
}

export default function Home() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen flex-col items-center bg-[#101010] pb-10">
                    <Navbar />
                </main>
            }
        >
            <VocabularyPageContent />
        </Suspense>
    );
}

function getMemoryLabel(status: string): string | null {
    switch (status) {
        case "fragile":
            return "Fragile"
        case "building":
            return "Building"
        case "stable":
            return "Stable"
        case "mastered":
            return "Mastered"
        default:
            return null
    }
}
