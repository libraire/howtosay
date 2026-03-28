"use client"

import { FormEvent, useState } from "react"
import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"
import { useAppPreferences } from "../context/AppPreferencesProvider"

export default function AboutPage() {
    const { copy } = useAppPreferences()
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!feedback.trim() || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setMessage("")

        try {
            const response = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ body: feedback.trim() }),
            })

            if (!response.ok) {
                throw new Error(copy.about.feedbackError)
            }

            setFeedback("")
            setMessage(copy.about.feedbackThanks)
        } catch (error) {
            console.error(error)
            setMessage(copy.about.feedbackError)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="theme-page flex min-h-screen flex-col items-center">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="w-full max-w-4xl px-6 pb-20 pt-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-medium tracking-tight">{copy.about.title}</h1>
                    <p className="theme-muted mt-4 text-sm leading-7">
                        {copy.about.intro}
                    </p>
                </div>

                <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-3">
                    <div className="theme-card rounded-2xl p-6">
                        <h2 className="text-sm font-semibold tracking-wide">{copy.about.readTitle}</h2>
                        <p className="theme-muted mt-3 text-sm leading-7">
                            {copy.about.readDescription}
                        </p>
                    </div>
                    <div className="theme-card rounded-2xl p-6">
                        <h2 className="text-sm font-semibold tracking-wide">{copy.about.practiceTitle}</h2>
                        <p className="theme-muted mt-3 text-sm leading-7">
                            {copy.about.practiceDescription}
                        </p>
                    </div>
                    <div className="theme-card rounded-2xl p-6">
                        <h2 className="text-sm font-semibold tracking-wide">{copy.about.bankTitle}</h2>
                        <p className="theme-muted mt-3 text-sm leading-7">
                            {copy.about.bankDescription}
                        </p>
                    </div>
                </div>

                <div className="theme-panel mx-auto mt-14 max-w-2xl rounded-3xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-medium tracking-tight">{copy.about.feedbackTitle}</h2>
                        <p className="theme-muted mt-2 text-sm leading-7">
                            {copy.about.feedbackDescription}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder={copy.about.feedbackPlaceholder}
                            className="theme-input min-h-[180px] w-full rounded-2xl px-4 py-3 text-sm outline-none transition"
                        />

                        <div className="flex items-center justify-between gap-4">
                            <p className="theme-muted text-sm">{message}</p>
                            <button
                                type="submit"
                                disabled={isSubmitting || !feedback.trim()}
                                className="theme-button-primary rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isSubmitting ? copy.about.feedbackSending : copy.about.feedbackSubmit}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}
