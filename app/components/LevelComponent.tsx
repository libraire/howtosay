export default function LevelComponent({ updateLevel, pages, currentLevel }: { updateLevel: (p: number) => void, pages: number[], currentLevel: number }) {
    const labels: Record<number, string> = {
        1: "Unfamiliar",
        2: "Emerging",
        3: "Recognized",
        4: "Comfortable",
        5: "Solid",
    }
    const activeClasses: Record<number, string> = {
        1: "bg-gradient-to-r from-[#d96b6b] to-[#b94f4f] shadow-[0_0_0_1px_rgba(217,107,107,0.16),0_0_14px_rgba(217,107,107,0.12)]",
        2: "bg-gradient-to-r from-[#d69362] to-[#bf7541] shadow-[0_0_0_1px_rgba(214,147,98,0.16),0_0_14px_rgba(214,147,98,0.12)]",
        3: "bg-gradient-to-r from-[#d8c06f] to-[#c0a44d] shadow-[0_0_0_1px_rgba(216,192,111,0.16),0_0_14px_rgba(216,192,111,0.12)]",
        4: "bg-gradient-to-r from-[#8fbe7a] to-[#6d9f59] shadow-[0_0_0_1px_rgba(143,190,122,0.16),0_0_14px_rgba(143,190,122,0.12)]",
        5: "bg-gradient-to-r from-[#57b27f] to-[#3b8f61] shadow-[0_0_0_1px_rgba(87,178,127,0.16),0_0_14px_rgba(87,178,127,0.12)]",
    }

    return (
        <div className="inline-flex items-center gap-1.5">
            {pages.map((pageNumber) => (
                <button
                    type="button"
                    key={pageNumber}
                    onClick={() => { updateLevel(pageNumber) }}
                    title={labels[pageNumber] ?? `Familiarity ${pageNumber}`}
                    aria-label={labels[pageNumber] ?? `Familiarity ${pageNumber}`}
                    className={`relative h-2.5 w-6 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#dcc38f]/35 ${
                        pageNumber <= currentLevel
                            ? activeClasses[currentLevel] ?? activeClasses[3]
                            : "bg-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_1px_6px_rgba(255,255,255,0.12)] hover:bg-white"
                    }`}
                >
                    {pageNumber <= currentLevel && (
                        <span className="pointer-events-none absolute inset-y-[2px] left-[3px] w-2 rounded-full bg-white/35 blur-[1px]" />
                    )}
                    <span className="sr-only">{labels[pageNumber] ?? `Familiarity ${pageNumber}`}</span>
                </button>
            ))}
        </div>
    )
}
