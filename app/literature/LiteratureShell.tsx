"use client"

import { useMemo, useRef, useState } from "react"
import Navbar from "@/app/components/Navbar"
import LiteratureTimeline from "@/app/components/LiteratureTimeline"
import LiteratureWorldMap from "@/app/components/LiteratureWorldMap"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { getCountryHighlights } from "@/app/lib/literature-geo"
import type { LiteraryTimelinePage } from "@/app/lib/literature-models"

type Props = {
    initialData: LiteraryTimelinePage
    className: string
}

export default function LiteratureShell({ initialData, className }: Props) {
    const { theme } = useAppPreferences()
    const [activeAuthor, setActiveAuthor] = useState<string | null>(null)
    const [activeAuthorCountryCode, setActiveAuthorCountryCode] = useState<string | null>(null)
    const [loadedItems, setLoadedItems] = useState(initialData.data)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const highlights = useMemo(() => getCountryHighlights(loadedItems), [loadedItems])

    return (
        <main className={`theme-page flex h-screen flex-col overflow-hidden ${className}`}>
            <Navbar />
            <section className="relative flex-1 overflow-hidden px-6 pb-6 pt-6">
                <div className="absolute inset-0 opacity-70">
                    <div className="absolute left-[-8rem] top-10 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--glow-amber)" }} />
                    <div className="absolute right-[-6rem] top-28 h-80 w-80 rounded-full blur-3xl" style={{ background: "var(--glow-teal)" }} />
                    <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "var(--glow-rose)" }} />
                </div>

                <div className="pointer-events-none absolute inset-x-[2%] top-1/2 z-0 hidden h-[80%] -translate-y-1/2 md:block">
                    <div className="relative h-full w-full">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: theme === "dark"
                                    ? "radial-gradient(circle at center, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.34) 52%, rgba(0,0,0,0.5) 100%)"
                                    : "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(247,243,237,0.38) 56%, rgba(247,243,237,0.76) 100%)",
                            }}
                        />
                        <LiteratureWorldMap
                            highlights={highlights}
                            activeAuthor={activeAuthor}
                            activeAuthorCountryCode={activeAuthorCountryCode}
                            className={`translate-x-[8%] scale-[1.12] ${theme === "dark" ? "opacity-55" : "opacity-60"}`}
                        />
                    </div>
                </div>

                <div className="relative mx-auto flex h-full max-w-7xl min-h-0 flex-col">
                    <div ref={scrollContainerRef} className="scrollbar-hidden flex-1 min-h-0 overflow-y-auto pr-2">
                        <LiteratureTimeline
                            initialData={initialData}
                            scrollContainerRef={scrollContainerRef}
                            onActiveAuthorChange={setActiveAuthor}
                            onActiveAuthorCountryCodeChange={setActiveAuthorCountryCode}
                            onItemsChange={setLoadedItems}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
