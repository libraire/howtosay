"use client"

import { FormEvent, useState } from "react"
import AudioComponent from "../components/AudioComponent"
import Navbar from "../components/Navbar"

export default function AboutPage() {
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
                throw new Error("Failed to submit feedback")
            }

            setFeedback("")
            setMessage("Thanks. Your feedback has been sent.")
        } catch (error) {
            console.error(error)
            setMessage("Submission failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#101010]">
            <Navbar check={false} />
            <AudioComponent str={"xxxx"} />

            <section className="w-full max-w-4xl px-6 pb-20 pt-10 text-white">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-medium tracking-tight">About How To Say</h1>
                    <p className="mt-4 text-sm leading-7 text-white/65">
                        How To Say is built for immersive vocabulary learning. It turns reading,
                        guessing, bookmarking, and repeated exposure into one continuous workflow,
                        so new words stay connected to real language instead of isolated lists.
                    </p>
                </div>

                <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                        <h2 className="text-sm font-semibold tracking-wide text-white">Read in context</h2>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                            Learn through literary passages, examples, and sentence-level exposure instead of flashcards alone.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                        <h2 className="text-sm font-semibold tracking-wide text-white">Practice actively</h2>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                            Move from recognition to recall with guessing flows, graded practice, and image-based prompts.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                        <h2 className="text-sm font-semibold tracking-wide text-white">Build your own bank</h2>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                            Save words as you read, revisit them later, and keep your practice focused on what is still unfamiliar.
                        </p>
                    </div>
                </div>

                <div className="mx-auto mt-14 max-w-2xl rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-medium tracking-tight text-white">Send feedback</h2>
                        <p className="mt-2 text-sm leading-7 text-white/60">
                            Share bugs, product suggestions, missing features, or anything that feels unclear.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder="Tell us what would make How To Say better..."
                            className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
                        />

                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-white/50">{message}</p>
                            <button
                                type="submit"
                                disabled={isSubmitting || !feedback.trim()}
                                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35"
                            >
                                {isSubmitting ? "Sending..." : "Submit feedback"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}
