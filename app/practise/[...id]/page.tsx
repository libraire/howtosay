"use client"
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { Word } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { fetchMaterial, filterWordsFromContent } from "@/app/lib/material-api";

export default function Practise() {


    const pathname = usePathname()
    const { isAuthenticated, isLoading, login } = useCustomAuth();

    const [wordList, setWordList] = useState<Word[]>([]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login()
        }
    }, [isAuthenticated, isLoading, login]);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!pathname) return;

        const id = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (id) {
            fetchMaterial(id)
                .then((material) => material?.content ?? "")
                .then((msg: string) => filterWordsFromContent(msg))
                .then((words) => {
                    setWordList(words as Word[])
                });
        }

    }, [isAuthenticated, pathname])

    if (isLoading || !isAuthenticated) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-[#101010]">
                <Navbar />
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">

            <Navbar />
            <AudioComponent str={"xxxx"} />
            <PractiseComponent list={wordList} onClose={undefined} mode="reading" />

        </main>
    );
}
