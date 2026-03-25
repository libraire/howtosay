"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import { useCustomAuth } from "../context/CustomAuthProvider"
import { getLevelLabel } from "../lib/level-options"
import { levelAssessmentQuestions, recommendLevel } from "../lib/level-assessment"

export default function LevelAssessmentPage() {
    const { user, login, setUserLevel } = useCustomAuth()
    const [answers, setAnswers] = useState<number[]>(() => Array(levelAssessmentQuestions.length).fill(-1))
    const [submitted, setSubmitted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")

    const score = useMemo(() => {
        return levelAssessmentQuestions.reduce((total, question, index) => {
            return total + (answers[index] === question.correctIndex ? 1 : 0)
        }, 0)
    }, [answers])

    const recommendedLevel = recommendLevel(score)
    const allAnswered = answers.every((answer) => answer >= 0)

    async function applyRecommendedLevel() {
        if (!user) {
            login(typeof window !== "undefined" ? window.location.href : undefined)
            return
        }

        setIsSaving(true)
        setSaveMessage("")
        try {
            await setUserLevel(recommendedLevel)
            setSaveMessage(`Your level has been updated to ${getLevelLabel(recommendedLevel)}.`)
        } catch (error) {
            console.error(error)
            setSaveMessage("Failed to update your level. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="w-full max-w-5xl px-6 pb-20 pt-10 text-white">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">Level Assessment</p>
                    <h1 className="mt-4 text-4xl font-medium tracking-tight">Estimate your working vocabulary level</h1>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                        This quick assessment is meant to help you choose a useful starting level for daily practice.
                        It is not a formal test, but it is good enough to calibrate your word flow before you begin.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 md:p-8">
                    <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                        <div>
                            <div className="text-sm text-white/60">Questions</div>
                            <div className="mt-1 text-xl font-medium">{levelAssessmentQuestions.length} quick checks</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-white/60">Current level</div>
                            <div className="mt-1 text-xl font-medium">
                                {user ? getLevelLabel(user.level ?? 0) : "Sign in to save"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {levelAssessmentQuestions.map((question, questionIndex) => (
                            <div key={question.id} className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/8">
                                <div className="text-sm text-white/40">Question {questionIndex + 1}</div>
                                <div className="mt-2 text-base leading-7 text-white">{question.prompt}</div>

                                <div className="mt-4 grid gap-3">
                                    {question.options.map((option, optionIndex) => {
                                        const isSelected = answers[questionIndex] === optionIndex
                                        const isCorrect = submitted && optionIndex === question.correctIndex
                                        const isWrongSelection = submitted && isSelected && !isCorrect

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    const nextAnswers = [...answers]
                                                    nextAnswers[questionIndex] = optionIndex
                                                    setAnswers(nextAnswers)
                                                }}
                                                className={[
                                                    "rounded-2xl px-4 py-3 text-left text-sm transition",
                                                    isSelected ? "bg-white text-black" : "bg-white/5 text-white/75 hover:bg-white/10",
                                                    isCorrect ? "ring-2 ring-emerald-400" : "",
                                                    isWrongSelection ? "ring-2 ring-red-400" : "",
                                                ].join(" ")}
                                            >
                                                {option}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                        <div className="text-sm text-white/50">
                            {submitted ? `You answered ${score} out of ${levelAssessmentQuestions.length} correctly.` : "Answer all questions to see your suggested level."}
                        </div>
                        <button
                            type="button"
                            disabled={!allAnswered}
                            onClick={() => setSubmitted(true)}
                            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35"
                        >
                            See result
                        </button>
                    </div>
                </div>

                {submitted && (
                    <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-[#151515] p-6 ring-1 ring-white/10 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <div className="text-sm uppercase tracking-[0.24em] text-white/35">Recommended level</div>
                                <div className="mt-3 text-3xl font-medium text-white">{getLevelLabel(recommendedLevel)}</div>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                                    Use this as your default practice band. You can still fine-tune it later from your user menu
                                    if the words feel too easy or too dense.
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:items-end">
                                <button
                                    type="button"
                                    onClick={applyRecommendedLevel}
                                    disabled={isSaving}
                                    className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35"
                                >
                                    {user ? (isSaving ? "Applying..." : "Apply this level") : "Sign in to apply"}
                                </button>
                                <Link href="/daily" className="text-sm text-white/55 transition hover:text-white">
                                    Go to Daily Guess
                                </Link>
                                {saveMessage && <div className="text-sm text-white/55">{saveMessage}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}
