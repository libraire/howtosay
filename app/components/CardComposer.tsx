"use client"

import { useEffect, useState } from "react"
import { CardBlockEditor } from "@/app/components/CardBlocks"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import type { CardBlock, CardModel } from "@/app/lib/cards-models"

function sanitizeBlocks(blocks: CardBlock[]): CardBlock[] {
    return blocks
        .map((block) => ({
            ...block,
            content: block.content?.trim() || undefined,
            url: block.url?.trim() || undefined,
            caption: block.caption?.trim() || undefined,
        }))
        .filter((block) => (block.type === "text" ? !!block.content : !!block.url))
}

export default function CardComposer({
    initialCard,
    submitLabel,
    busy = false,
    onSubmit,
    onCancel,
}: {
    initialCard?: CardModel | null
    submitLabel: string
    busy?: boolean
    onSubmit: (payload: {
        title: string
        prompt_blocks: CardBlock[]
        answer_blocks: CardBlock[]
        notes_blocks: CardBlock[] | null
        is_active: boolean
    }) => Promise<void>
    onCancel?: () => void
}) {
    const { copy } = useAppPreferences()
    const [title, setTitle] = useState("")
    const [promptBlocks, setPromptBlocks] = useState<CardBlock[]>([{ type: "text", content: "" }])
    const [answerBlocks, setAnswerBlocks] = useState<CardBlock[]>([{ type: "text", content: "" }])
    const [notesBlocks, setNotesBlocks] = useState<CardBlock[]>([])
    const [isActive, setIsActive] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        setTitle(initialCard?.title ?? "")
        setPromptBlocks(initialCard?.promptBlocks?.length ? initialCard.promptBlocks : [{ type: "text", content: "" }])
        setAnswerBlocks(initialCard?.answerBlocks?.length ? initialCard.answerBlocks : [{ type: "text", content: "" }])
        setNotesBlocks(initialCard?.notesBlocks?.length ? initialCard.notesBlocks : [])
        setIsActive(initialCard?.isActive ?? true)
        setError("")
    }, [initialCard])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        const nextPromptBlocks = sanitizeBlocks(promptBlocks)
        const nextAnswerBlocks = sanitizeBlocks(answerBlocks)
        const nextNotesBlocks = sanitizeBlocks(notesBlocks)

        if (title.trim().length === 0) {
            setError(copy.cardComposer.titleRequired)
            return
        }

        if (nextPromptBlocks.length === 0 || nextAnswerBlocks.length === 0) {
            setError(copy.cardComposer.blocksRequired)
            return
        }

        try {
            await onSubmit({
                title: title.trim(),
                prompt_blocks: nextPromptBlocks,
                answer_blocks: nextAnswerBlocks,
                notes_blocks: nextNotesBlocks.length > 0 ? nextNotesBlocks : null,
                is_active: isActive,
            })

            if (!initialCard) {
                setTitle("")
                setPromptBlocks([{ type: "text", content: "" }])
                setAnswerBlocks([{ type: "text", content: "" }])
                setNotesBlocks([])
                setIsActive(true)
            }
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : copy.cardComposer.unableToSave)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="theme-surface space-y-5 rounded-[32px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-xl font-medium">{initialCard ? copy.cardComposer.editTitle : copy.cardComposer.createTitle}</h2>
                    <p className="theme-muted mt-1 text-sm">
                        {copy.cardComposer.intro}
                    </p>
                </div>
                <label className="theme-button-secondary inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(event) => setIsActive(event.target.checked)}
                        className="h-4 w-4 rounded"
                    />
                    {copy.cardComposer.activeInReview}
                </label>
            </div>

            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={copy.cardComposer.titlePlaceholder}
                className="theme-input h-12 w-full rounded-2xl px-4 text-sm focus:outline-none"
            />

            <CardBlockEditor label="Prompt" blocks={promptBlocks} onChange={setPromptBlocks} />
            <CardBlockEditor label="Answer" blocks={answerBlocks} onChange={setAnswerBlocks} />
            <CardBlockEditor label="Notes" blocks={notesBlocks} onChange={setNotesBlocks} optional />

            {error && (
                <div className="rounded-2xl border border-[#d17a7a]/30 bg-[#d17a7a]/10 px-4 py-3 text-sm text-[#f0c9c9]">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={busy}
                    className="theme-button-primary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {busy ? copy.cardComposer.saving : submitLabel}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="theme-button-secondary inline-flex h-11 items-center rounded-xl px-5 text-sm font-medium transition"
                    >
                        {copy.cardComposer.cancel}
                    </button>
                )}
            </div>
        </form>
    )
}
