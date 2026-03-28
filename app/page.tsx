"use client"

import { useEffect, useState } from "react"
import { Manrope } from "next/font/google"
import AudioComponent from "./components/AudioComponent";
import Navbar from "./components/Navbar";
import PractiseComponent from "./components/PractiseComponent";
import { favoriteHomepagePassage, fetchHomepagePassage, unfavoriteHomepagePassage } from "./lib/home-api";
import type { LiteraryPassage } from "./lib/home-models";
import type { Word } from "./components/types";
import ReadingPassage from "./components/ReadingPassage";
import { filterWordsFromContent } from "./lib/material-api";
import { useCustomAuth } from "./context/CustomAuthProvider";
import { useAppPreferences } from "./context/AppPreferencesProvider";

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function Home() {
  const { isAuthenticated, login } = useCustomAuth()
  const { copy } = useAppPreferences()
  const [passage, setPassage] = useState<LiteraryPassage | null>(null)
  const [practiceWords, setPracticeWords] = useState<Word[]>([])
  const [isPracticeOpen, setIsPracticeOpen] = useState(false)
  const [isPreparingPractice, setIsPreparingPractice] = useState(false)
  const visiblePracticeWords = practiceWords.filter((word) => {
    const memoryState = word.memory_badge || word.memory_status
    return memoryState !== "mastered" && (word.level ?? 0) < 5
  })

  useEffect(() => {
    fetchHomepagePassage()
      .then(setPassage)
      .catch((error) => {
        console.error("Failed to load homepage passage:", error)
      })
  }, [])

  async function handleStartPractice() {
    if (!passage || isPreparingPractice) {
      return
    }

    setIsPreparingPractice(true)
    try {
      const words = passage.practiceWords && passage.practiceWords.length > 0
        ? passage.practiceWords
        : isAuthenticated
          ? await filterWordsFromContent(passage.excerpt)
          : []
      const uniqueWords = words.filter((item, index, list) => {
        return list.findIndex((candidate) => candidate.word === item.word) === index
      })
      setPracticeWords(uniqueWords as Word[])
      setIsPracticeOpen(true)
    } catch (error) {
      console.error("Failed to prepare practice words:", error)
    } finally {
      setIsPreparingPractice(false)
    }
  }

  async function handleToggleSavePassage() {
    if (!passage) {
      return
    }

    if (!passage.isPersisted) {
      console.warn("Favorite is disabled for mock homepage passages.")
      return
    }

    if (!isAuthenticated) {
      login()
      return
    }

    try {
      if (passage.isFavorited) {
        await unfavoriteHomepagePassage(passage.id)
        setPassage((prev) => prev ? { ...prev, isFavorited: false } : prev)
      } else {
        await favoriteHomepagePassage(passage.id)
        setPassage((prev) => prev ? { ...prev, isFavorited: true } : prev)
      }
    } catch (error) {
      console.error("Failed to toggle passage favorite:", error)
    }
  }

  return (
    <main className={`theme-page ${uiSans.className}`}>
      <div className={`transition-opacity duration-200 ${isPracticeOpen ? "opacity-30" : "opacity-100"}`}>
        <Navbar check={false} />
        <AudioComponent str={"xxxx"} />
        <section className="relative overflow-hidden px-6 pb-20 pt-6">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[-8rem] top-10 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--glow-amber)" }} />
            <div className="absolute right-[-6rem] top-28 h-80 w-80 rounded-full blur-3xl" style={{ background: "var(--glow-teal)" }} />
            <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "var(--glow-rose)" }} />
          </div>

          <div className="relative mx-auto max-w-6xl">

            {passage && (
              <ReadingPassage
                excerpt={passage.excerpt}
                accent={passage.accent}
                author={passage.author}
                work={passage.work}
                year={passage.year}
                onPractice={handleStartPractice}
                onToggleSavePassage={handleToggleSavePassage}
                practiceLoading={isPreparingPractice}
                passageSaved={!!passage.isFavorited}
                canSavePassage={!!passage.isPersisted}
              />
            )}

          </div>
        </section>
      </div>

      {isPracticeOpen && (
        <div
          className="theme-overlay fixed inset-0 z-50 overflow-y-auto px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsPracticeOpen(false)}
        >
          <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center pb-12 pt-[12vh]">
            <div onClick={(event) => event.stopPropagation()}>
              {visiblePracticeWords.length > 0 ? (
                <PractiseComponent
                  list={visiblePracticeWords}
                  onClose={() => setIsPracticeOpen(false)}
                  mode="reading"
                />
              ) : (
                <div className="theme-panel w-[min(92vw,720px)] rounded-[28px] px-8 py-10 text-center">
                  <p className="text-lg font-semibold">{copy.home.noPracticeWordsLeft}</p>
                  <p className="theme-muted mt-3 text-sm">
                    {copy.home.noPracticeWordsDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
