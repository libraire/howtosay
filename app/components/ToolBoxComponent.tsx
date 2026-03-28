import { useState } from "react";
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

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

export default function ToolBoxComponent({ selectLevel, selectItems, marked, mark, unmark, onClose, word, displayWord, source, random, playable, showIgnore, next }: Props) {
    const audioWord = displayWord || word

    function ignoreWord(wordValue: string) {
        ignoreWordApi(wordValue, source || "wordbook", displayWord).then(() => {
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
    const primaryActionClass = "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[13px] font-semibold shadow-[0_1px_6px_rgba(0,0,0,0.08)] transition";
    const subtleActionClass = "inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-[0_1px_6px_rgba(0,0,0,0.08)] transition";

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
                            className={classNames(primaryActionClass, "theme-button-secondary")}
                            title={marked ? "Remove from saved words" : "Save word"}
                        >
                            <BookmarkIcon className={classNames("h-4 w-4", marked ? "fill-current" : "")} />
                            <span>{marked ? "Saved" : "Save"}</span>
                        </button>

                        {showIgnore && (
                            <button
                                type="button"
                                onClick={() => { ignoreWord(word) }}
                                className={classNames(primaryActionClass, "theme-button-secondary")}
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
                            <Menu.Button className={classNames(primaryActionClass, "theme-button-secondary")}>
                                <span>More</span>
                                <ChevronDownIcon className="h-4 w-4 theme-faint" />
                            </Menu.Button>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="theme-menu absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl p-1.5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={random}
                                                className={classNames(
                                                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition",
                                                    active ? "bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)]"
                                                )}
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
                                                className={classNames(
                                                    "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition",
                                                    active ? "bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)]"
                                                )}
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
                                                className={classNames(
                                                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition",
                                                    active ? "bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)]"
                                                )}
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
                                                className={classNames(
                                                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition",
                                                    active ? "bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)]"
                                                )}
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
                                className={classNames(subtleActionClass, "theme-button-secondary")}
                                title="Close practice"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="theme-card mt-2 rounded-2xl px-3 py-2.5 text-[13px]">
                        <div className="theme-faint mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]">Keyboard</div>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { keycap: "1", label: "Hint" },
                                { keycap: "2", label: "Pronounce" },
                                { keycap: "Enter", label: "Reveal / Next" },
                                { keycap: "<-", label: "Prev" },
                                { keycap: "->", label: "Next" },
                            ].map((item) => (
                                <div key={item.label} className="theme-button-secondary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium">
                                    <span className="rounded-md border px-1.5 py-0.5 text-[11px] font-semibold" style={{ borderColor: "var(--border-soft)", background: "var(--surface-strong)", color: "var(--text-secondary)" }}>
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
