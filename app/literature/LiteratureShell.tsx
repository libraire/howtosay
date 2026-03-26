"use client"

import Navbar from "@/app/components/Navbar"
import LiteratureTimeline from "@/app/components/LiteratureTimeline"
import type { LiteraryTimelinePage } from "@/app/lib/literature-models"

type Props = {
    initialData: LiteraryTimelinePage
    className: string
}

export default function LiteratureShell({ initialData, className }: Props) {
    return (
        <main className={`flex h-screen flex-col overflow-hidden bg-[#101010] ${className}`}>
            <Navbar />
            <section className="relative flex-1 overflow-hidden px-6 pb-6 pt-6">
                <div className="absolute inset-0 opacity-70">
                    <div className="absolute left-[-8rem] top-10 h-72 w-72 rounded-full bg-[#8a6740]/20 blur-3xl" />
                    <div className="absolute right-[-6rem] top-28 h-80 w-80 rounded-full bg-[#2f4858]/30 blur-3xl" />
                    <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#5f4b8b]/10 blur-3xl" />
                </div>

                <div className="relative mx-auto flex h-full max-w-7xl min-h-0 flex-col">
                    <div className="scrollbar-hidden flex-1 min-h-0 overflow-y-auto pr-2">
                        <LiteratureTimeline initialData={initialData} />
                    </div>
                </div>
            </section>
        </main>
    )
}
