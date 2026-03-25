"use client"
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { Word } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Practise() {


    const pathname = usePathname()
    const { isAuthenticated, isLoading, login } = useCustomAuth();

    const [wordList, setWordList] = useState<Word[]>([]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login()
        }
    }, [isAuthenticated, isLoading, login]);

    const handleSending = async (message: string) => {

        const url = '/hts/api/v1/filter';
        const data = {
            app: 'howtosay',
            body: message,
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };


    useEffect(() => {
        if (!isAuthenticated) return;
        if (!pathname) return;

        const id = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (id) {
            fetch("/hts/api/v1/material?id=" + id)
                .then((response: Response) => {
                    return response.json()
                }).then((data) => {
                    console.log(data)
                    if (data.status == 'ok') {
                        return data.article.content
                    }
                    return ""

                }).then((msg: string) => {
                    return handleSending(msg)
                }).then((response: Response) => {
                    return response.json();
                }).then((data) => {
                    setWordList(data.words)
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
            <PractiseComponent list={wordList} onClose={undefined} />

        </main>
    );
}
