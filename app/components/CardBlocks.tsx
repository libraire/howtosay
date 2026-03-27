"use client"

import type { CardBlock, CardBlockType } from "@/app/lib/cards-models"

const blockTypes: CardBlockType[] = ["text", "image", "audio", "link"]

function createEmptyBlock(type: CardBlockType): CardBlock {
    if (type === "text") {
        return { type, content: "" }
    }

    return { type, url: "", caption: "" }
}

export function CardBlockList({ blocks }: { blocks: CardBlock[] }) {
    return (
        <div className="space-y-3">
            {blocks.map((block, index) => (
                <div key={`${block.type}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/78">
                    {block.type === "text" && <p className="whitespace-pre-wrap leading-7">{block.content}</p>}
                    {block.type === "image" && block.url && (
                        <div className="space-y-3">
                            <img src={block.url} alt={block.caption || "Card image"} className="max-h-72 w-full rounded-xl object-cover" />
                            {block.caption && <p className="text-xs text-white/55">{block.caption}</p>}
                        </div>
                    )}
                    {block.type === "audio" && block.url && (
                        <div className="space-y-3">
                            <audio controls className="w-full">
                                <source src={block.url} />
                            </audio>
                            {block.caption && <p className="text-xs text-white/55">{block.caption}</p>}
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
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-medium text-white">{label}</h3>
                    <p className="mt-1 text-sm text-white/45">
                        {optional ? "Optional blocks shown after the answer." : "Add one or more blocks in the order learners should see them."}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {blockTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => addBlock(type)}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/68 transition hover:bg-white/10"
                        >
                            + {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 space-y-4">
                {blocks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-white/38">
                        No blocks yet.
                    </div>
                ) : blocks.map((block, index) => (
                    <div key={`${label}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <select
                                value={block.type}
                                onChange={(event) => {
                                    const nextType = event.target.value as CardBlockType
                                    updateBlock(index, createEmptyBlock(nextType))
                                }}
                                className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                            >
                                {blockTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => removeBlock(index)}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/62 transition hover:bg-white/10"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {block.type === "text" ? (
                                <textarea
                                    rows={4}
                                    value={block.content || ""}
                                    onChange={(event) => updateBlock(index, { content: event.target.value })}
                                    placeholder="Write the prompt, answer, or note here..."
                                    className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                />
                            ) : (
                                <>
                                    <input
                                        type="url"
                                        value={block.url || ""}
                                        onChange={(event) => updateBlock(index, { url: event.target.value })}
                                        placeholder={`${block.type} URL`}
                                        className="h-11 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                    />
                                    {block.type === "link" && (
                                        <input
                                            type="text"
                                            value={block.content || ""}
                                            onChange={(event) => updateBlock(index, { content: event.target.value })}
                                            placeholder="Link label"
                                            className="h-11 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
                                        />
                                    )}
                                    <input
                                        type="text"
                                        value={block.caption || ""}
                                        onChange={(event) => updateBlock(index, { caption: event.target.value })}
                                        placeholder="Caption"
                                        className="h-11 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
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
