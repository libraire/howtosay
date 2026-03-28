"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import { useAppPreferences } from "../context/AppPreferencesProvider"
import { useCustomAuth } from "../context/CustomAuthProvider"
import { formatCopy } from "../lib/copy"
import { getLevelLabel } from "../lib/level-options"
import { levelAssessmentQuestions, recommendLevel } from "../lib/level-assessment"

export default function LevelAssessmentPage() {
    const { user, login, setUserLevel } = useCustomAuth()
    const { copy, locale } = useAppPreferences()
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
            setSaveMessage(formatCopy(copy.assessment.saveSuccess, { level: getLevelLabel(recommendedLevel, locale) }))
        } catch (error) {
            console.error(error)
            setSaveMessage(copy.assessment.saveError)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="theme-page flex min-h-screen flex-col items-center">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="w-full max-w-5xl px-6 pb-20 pt-10">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="theme-faint text-xs uppercase tracking-[0.28em]">{copy.assessment.eyebrow}</p>
                    <h1 className="mt-4 text-4xl font-medium tracking-tight">{copy.assessment.title}</h1>
                    <p className="theme-muted mt-4 text-sm leading-7">
                        {copy.assessment.intro}
                    </p>
                </div>

                <div className="theme-panel mx-auto mt-12 max-w-3xl rounded-3xl p-6 md:p-8">
                    <div className="mb-8 flex items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--border-soft)" }}>
                        <div>
                            <div className="theme-muted text-sm">{copy.assessment.questions}</div>
                            <div className="mt-1 text-xl font-medium">{levelAssessmentQuestions.length} {copy.assessment.quickChecks}</div>
                        </div>
                        <div className="text-right">
                            <div className="theme-muted text-sm">{copy.assessment.currentLevel}</div>
                            <div className="mt-1 text-xl font-medium">
                                {user ? getLevelLabel(user.level ?? 0, locale) : copy.assessment.signInToSave}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {levelAssessmentQuestions.map((question, questionIndex) => (
                            <div key={question.id} className="theme-card rounded-2xl p-5">
                                <div className="theme-faint text-sm">{copy.assessment.question} {questionIndex + 1}</div>
                                <div className="mt-2 text-base leading-7">{question.prompt}</div>

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
                                                    isSelected ? "theme-button-primary" : "theme-button-secondary",
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

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: "var(--border-soft)" }}>
                        <div className="theme-muted text-sm">
                            {submitted
                                ? formatCopy(copy.assessment.answered, { score, total: levelAssessmentQuestions.length })
                                : copy.assessment.answerAll}
                        </div>
                        <button
                            type="button"
                            disabled={!allAnswered}
                            onClick={() => setSubmitted(true)}
                            className="theme-button-primary rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {copy.assessment.seeResult}
                        </button>
                    </div>
                </div>

                {submitted && (
                    <div className="theme-panel mx-auto mt-8 max-w-3xl rounded-3xl p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <div className="theme-faint text-sm uppercase tracking-[0.24em]">{copy.assessment.recommendedLevel}</div>
                                <div className="mt-3 text-3xl font-medium">{getLevelLabel(recommendedLevel, locale)}</div>
                                <p className="theme-muted mt-3 max-w-xl text-sm leading-7">
                                    {copy.assessment.recommendedDescription}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:items-end">
                                <button
                                    type="button"
                                    onClick={applyRecommendedLevel}
                                    disabled={isSaving}
                                    className="theme-button-primary rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {user ? (isSaving ? copy.assessment.applying : copy.assessment.applyLevel) : copy.assessment.signInToApply}
                                </button>
                                <Link href="/daily" className="theme-muted text-sm transition hover:text-[color:var(--text-primary)]">
                                    {copy.assessment.goToDaily}
                                </Link>
                                {saveMessage && <div className="theme-muted text-sm">{saveMessage}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}
