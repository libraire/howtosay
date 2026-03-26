import React, { useState } from "react";
import { Menu, Transition } from '@headlessui/react'
import SelectComponent from "./SelectComponent"
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ArrowsRightLeftIcon, BookmarkIcon, EyeSlashIcon, QuestionMarkCircleIcon, SpeakerWaveIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import AudioPlayer from './AudioPlayer';
import ReportDialog from './ReportDialog';
import { reportWordIssue } from '@/app/lib/practice-api';
import { ignoreWord as ignoreWordApi } from '@/app/lib/practice-api';

type Props = {
    selectLevel: ((lv: string) => void) | undefined;
    selectItems: any[];
    onClose: (() => void) | undefined;
    marked: boolean,
    word: string,
    displayWord?: string,
    source?: string,
    mark: () => void,
    unmark: () => void,
    random: () => void,
    next: () => void,
    playable: boolean,
    showIgnore: boolean
};
export default function ToolBoxComponent({ selectLevel, selectItems, marked, mark, unmark, onClose, word, displayWord, source, random, playable, showIgnore, next }: Props) {
    const audioWord = displayWord || word

    function ignoreWord(word: string) {
        ignoreWordApi(word, source || "wordbook", displayWord).then(() => {
            next()
        });
    }


    function report(content: string) {
        reportWordIssue(word, content).then(() => {
            next()
        });
    }

    const [isOpen, setIsOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const primaryActionClass = "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.08] px-2.5 text-[13px] font-semibold text-white/88 shadow-[0_1px_6px_rgba(0,0,0,0.16)] backdrop-blur transition hover:bg-white/[0.14]"
    const subtleActionClass = "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/72 shadow-[0_1px_6px_rgba(0,0,0,0.14)] backdrop-blur transition hover:bg-white/[0.12] hover:text-white"

    return (
        <>
            <div className="mx-2 mb-3 mt-2 w-full max-w-4xl px-2 py-1.5">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {selectLevel && (
                        <div className="shrink-0">
                            <SelectComponent
                                items={selectItems}
                                choose={selectLevel}
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                if (marked) {
                                    unmark()
                                    return
                                }

                                mark()
                            }}
                            className={primaryActionClass}
                            title={marked ? "Remove from saved words" : "Save word"}
                        >
                            <BookmarkIcon className={`h-4 w-4 ${marked ? "fill-white text-white" : ""}`} />
                            <span>{marked ? "Saved" : "Save"}</span>
                        </button>

                        {showIgnore && (
                            <button
                                type="button"
                                onClick={() => { ignoreWord(word) }}
                                className={primaryActionClass}
                                title="Ignore this word"
                            >
                                <EyeSlashIcon className='h-4 w-4' />
                                <span>Ignore</span>
                            </button>
                        )}

                        {playable && <AudioPlayer word={audioWord} showLabel={true} />}
                    </div>

                    <div className="flex items-center gap-1">
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className={primaryActionClass}>
                                <span>More</span>
                                <ChevronDownIcon className="h-4 w-4 text-white/60" />
                            </Menu.Button>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl border border-black/8 bg-white p-1.5 shadow-[0_16px_42px_rgba(0,0,0,0.18)] focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={random}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition ${active ? "bg-black/[0.06] text-black" : "text-black/80"}`}
                                            >
                                                <ArrowsRightLeftIcon className="h-4 w-4" />
                                                Shuffle
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                target="_blank"
                                                href={'https://youglish.com/pronounce/' + audioWord + '/english?'}
                                                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition ${active ? "bg-black/[0.06] text-black" : "text-black/80"}`}
                                            >
                                                <SpeakerWaveIcon className="h-4 w-4" />
                                                YouGlish
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsOpen(!isOpen)
                                                }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition ${active ? "bg-black/[0.06] text-black" : "text-black/80"}`}
                                            >
                                                <QuestionMarkCircleIcon className="h-4 w-4" />
                                                {isOpen ? "Hide help" : "Keyboard help"}
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={() => { setReportOpen(true) }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition ${active ? "bg-black/[0.06] text-black" : "text-black/80"}`}
                                            >
                                                <WrenchScrewdriverIcon className="h-4 w-4" />
                                                Report
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className={subtleActionClass}
                                title="Close practice"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[13px] text-white/78 backdrop-blur">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Keyboard</div>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { keycap: "1", label: "Hint" },
                                { keycap: "2", label: "Pronounce" },
                                { keycap: "Enter", label: "Reveal / Next" },
                                { keycap: "<-", label: "Prev" },
                                { keycap: "->", label: "Next" },
                            ].map((item) => (
                                <div key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[12px] font-medium text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                                    <span className="rounded-md border border-white/10 bg-black/[0.22] px-1.5 py-0.5 text-[11px] font-semibold text-white/76">
                                        {item.keycap}
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} report={report} />

        </>
    )
}
