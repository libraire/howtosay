"use client"

import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import type { CardBlock, CardBlockType } from "@/app/lib/cards-models"

const blockTypes: CardBlockType[] = ["text", "image", "audio", "link"]

function createEmptyBlock(type: CardBlockType): CardBlock {
    if (type === "text") {
        return { type, content: "" }
    }

    return { type, url: "", caption: "" }
}

export function CardBlockList({ blocks }: { blocks: CardBlock[] }) {
    const { copy } = useAppPreferences()

    return (
        <div className="space-y-3">
            {blocks.map((block, index) => (
                <div key={`${block.type}-${index}`} className="theme-card rounded-2xl p-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {block.type === "text" && <p className="whitespace-pre-wrap leading-7">{block.content}</p>}
                    {block.type === "image" && block.url && (
                        <div className="space-y-3">
                            <img src={block.url} alt={block.caption || copy.cardBlocks.imageAlt} className="max-h-72 w-full rounded-xl object-cover" />
                            {block.caption && <p className="theme-muted text-xs">{block.caption}</p>}
                        </div>
                    )}
                    {block.type === "audio" && block.url && (
                        <div className="space-y-3">
                            <audio controls className="w-full">
                                <source src={block.url} />
                            </audio>
                            {block.caption && <p className="theme-muted text-xs">{block.caption}</p>}
                        </div>
                    )}
                    {block.type === "link" && block.url && (
                        <a
                            href={block.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full border border-[#9bb7d4]/30 bg-[#9bb7d4]/10 px-3 py-1.5 text-xs font-medium text-[#dbe8f8] transition hover:bg-[#9bb7d4]/15"
                        >
                            {block.content || block.caption || block.url}
                        </a>
                    )}
                </div>
            ))}
        </div>
    )
}

export function CardBlockEditor({
    label,
    blocks,
    onChange,
    optional = false,
}: {
    label: string
    blocks: CardBlock[]
    onChange: (blocks: CardBlock[]) => void
    optional?: boolean
}) {
    const { copy } = useAppPreferences()

    function getTypeLabel(type: CardBlockType) {
        return copy.cardBlocks.types[type]
    }

    function updateBlock(index: number, patch: Partial<CardBlock>) {
        onChange(blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block))
    }

    function removeBlock(index: number) {
        const nextBlocks = blocks.filter((_, blockIndex) => blockIndex !== index)
        onChange(nextBlocks)
    }

    function addBlock(type: CardBlockType) {
        onChange([...blocks, createEmptyBlock(type)])
    }

    return (
        <div className="theme-card rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-medium">{label}</h3>
                    <p className="theme-faint mt-1 text-sm">
                        {optional ? copy.cardBlocks.optionalIntro : copy.cardBlocks.requiredIntro}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {blockTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => addBlock(type)}
                            className="theme-button-secondary rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition"
                        >
                            + {getTypeLabel(type)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 space-y-4">
                {blocks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed px-4 py-5 text-sm theme-faint" style={{ borderColor: "var(--border-soft)" }}>
                        {copy.cardBlocks.noBlocks}
                    </div>
                ) : blocks.map((block, index) => (
                    <div key={`${label}-${index}`} className="theme-panel rounded-2xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <select
                                value={block.type}
                                onChange={(event) => {
                                    const nextType = event.target.value as CardBlockType
                                    updateBlock(index, createEmptyBlock(nextType))
                                }}
                                className="theme-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                            >
                                {blockTypes.map((type) => (
                                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => removeBlock(index)}
                                className="theme-button-secondary rounded-full px-3 py-1.5 text-xs font-medium transition"
                            >
                                {copy.cardBlocks.remove}
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {block.type === "text" ? (
                                <textarea
                                    rows={4}
                                    value={block.content || ""}
                                    onChange={(event) => updateBlock(index, { content: event.target.value })}
                                    placeholder={copy.cardBlocks.textPlaceholder}
                                    className="theme-input w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                />
                            ) : (
                                <>
                                    <input
                                        type="url"
                                        value={block.url || ""}
                                        onChange={(event) => updateBlock(index, { url: event.target.value })}
                                        placeholder={copy.cardBlocks.urlPlaceholder.replace("{type}", getTypeLabel(block.type))}
                                        className="theme-input h-11 w-full rounded-2xl px-4 text-sm focus:outline-none"
                                    />
                                    {block.type === "link" && (
                                        <input
                                            type="text"
                                            value={block.content || ""}
                                            onChange={(event) => updateBlock(index, { content: event.target.value })}
                                            placeholder={copy.cardBlocks.linkLabelPlaceholder}
                                            className="theme-input h-11 w-full rounded-2xl px-4 text-sm focus:outline-none"
                                        />
                                    )}
                                    <input
                                        type="text"
                                        value={block.caption || ""}
                                        onChange={(event) => updateBlock(index, { caption: event.target.value })}
                                        placeholder={copy.cardBlocks.captionPlaceholder}
                                        className="theme-input h-11 w-full rounded-2xl px-4 text-sm focus:outline-none"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
