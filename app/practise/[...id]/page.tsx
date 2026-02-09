"use client"
import { useSession } from "next-auth/react"
import { Word } from "@/app/components/types";
import Navbar from "@/app/components/Navbar";
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import { redirect } from "next/navigation"
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Practise() {


    const pathname = usePathname()
    const { data: session, update } = useSession({
        required: true,
        onUnauthenticated() {
            // redirect("/api/auth/signin")
        }
    })

    const [wordList, setWordList] = useState<Word[]>([]);

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

    }, [pathname])

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">

            <Navbar />
            <AudioComponent str={"xxxx"} />
            <PractiseComponent list={wordList} onClose={undefined} />

        </main>
    );
}
