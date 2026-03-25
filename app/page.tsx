"use client"

import { useEffect, useState } from "react"
import { Manrope } from "next/font/google"
import AudioComponent from "./components/AudioComponent";
import ModalDialog from "./components/ModalDialog";
import Navbar from "./components/Navbar";
import PractiseComponent from "./components/PractiseComponent";
import { fetchHomepagePassages } from "./lib/home-api";
import type { LiteraryPassage } from "./lib/home-models";
import type { Word } from "./components/types";
import ReadingPassage from "./components/ReadingPassage";
import { filterWordsFromContent } from "./lib/material-api";

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function Home() {
  const [passages, setPassages] = useState<LiteraryPassage[]>([])
  const [practiceWords, setPracticeWords] = useState<Word[]>([])
  const [isPracticeOpen, setIsPracticeOpen] = useState(false)
  const [isPreparingPractice, setIsPreparingPractice] = useState(false)
  const [isSaveNoticeOpen, setIsSaveNoticeOpen] = useState(false)
  const passage = passages[0]

  useEffect(() => {
    fetchHomepagePassages()
      .then(setPassages)
      .catch((error) => {
        console.error("Failed to load homepage passages:", error)
      })
  }, [])

  async function handleStartPractice() {
    if (!passage || isPreparingPractice) {
      return
    }

    setIsPreparingPractice(true)
    try {
      const words = await filterWordsFromContent(passage.excerpt)
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

  return (
    <main className={`min-h-screen bg-[#101010] ${uiSans.className}`}>
      <div className={`transition-opacity duration-200 ${isPracticeOpen ? "opacity-30" : "opacity-100"}`}>
        <Navbar check={false} />
        <AudioComponent str={"xxxx"} />
        <section className="relative overflow-hidden px-6 pb-20 pt-6">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[-8rem] top-10 h-72 w-72 rounded-full bg-[#8a6740]/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-28 h-80 w-80 rounded-full bg-[#2f4858]/30 blur-3xl" />
            <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#5f4b8b]/10 blur-3xl" />
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
                onSavePassage={() => setIsSaveNoticeOpen(true)}
                practiceLoading={isPreparingPractice}
              />
            )}

          </div>
        </section>
      </div>

      {isPracticeOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/92 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsPracticeOpen(false)}
        >
          <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center pb-12 pt-[12vh]">
            <div onClick={(event) => event.stopPropagation()}>
              <PractiseComponent
                list={practiceWords}
                onClose={() => setIsPracticeOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <ModalDialog
        open={isSaveNoticeOpen}
        onClose={() => setIsSaveNoticeOpen(false)}
        title="Passage Save Coming Soon"
        content="Article and passage bookmarking will be added after the corresponding collection API is ready."
        confirm="Close"
      />
    </main>
  );
}
