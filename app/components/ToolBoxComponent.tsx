import { ChevronRightIcon, ChevronLeftIcon, EllipsisVerticalIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import React, { useState } from "react";
import SelectComponent from "./SelectComponent"
import styles from "./ComponentStyle.module.css";
import Link from 'next/link';
import { PlayCircleIcon } from '@heroicons/react/24/outline'

type Props = {
    selectLevel: ((lv: string) => void) | undefined;
    onClose: (() => void) | undefined;
    marked: boolean,
    word: string,
    mark: () => void,
    unmark: () => void,
};
export default function ToolBoxComponent({ selectLevel, marked, mark, unmark, onClose, word }: Props) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex bg-white	mx-2 p-2  px-2 rounded-[24px] mb-4">
                {selectLevel && <SelectComponent
                    choose={selectLevel}
                />}


                <button onClick={() => {

                }} className={styles.star_button}>
                    <Link target="_blank" href={'https://youglish.com/pronounce/' + word + '/english?'} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                    </Link>
                </button>


                {!marked && <button onClick={() => { mark() }} className={styles.star_button}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </button>}

                {marked && <button onClick={() => { unmark() }} className={styles.star_button_marked}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 inline">
                        <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
                    </svg>

                </button>}

                <div className="border-l border-gray-300 mr-2 ml-2"> </div>

                {isOpen && <div className='text-gray-800 text-lg px-1 mt-[1px]'>Shortcuts: </div>}
                {isOpen &&
                    ["Hint", "Pronounce", "Reveal", "Next"].map((lv, index) => {
                        return (
                            <div className="flex text-gray-800 text-s px-1 items-center	" key={lv}>
                                <div className="h-[26px] w-[26px] text-gray-950 rounded-[4px] bg-white border-gray-950 border-[1px] mr-1 text-[16px] text-center" aria-hidden="true" > {index + 1}  </div>
                                {lv}
                            </div>
                        );
                    })
                }

                <button onClick={() => {
                    setIsOpen(!isOpen)
                }} className={styles.star_button}>

                    {!isOpen && <EllipsisHorizontalIcon />}
                    {isOpen && <ChevronLeftIcon />}
                </button>

                {onClose && <button onClick={onClose} className={styles.star_button}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 inline">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>

                </button>}

            </div>

        </>
    )
}