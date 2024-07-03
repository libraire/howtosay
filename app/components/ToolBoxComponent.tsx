import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import React, { useState } from "react";
import SelectComponent from "./SelectComponent"
import styles from "./ComponentStyle.module.css";
import Link from 'next/link';
import { QuestionMarkCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import AudioPlayer from './AudioPlayer';

type Props = {
    selectLevel: ((lv: string) => void) | undefined;
    selectItems: any[];
    onClose: (() => void) | undefined;
    marked: boolean,
    word: string,
    mark: () => void,
    unmark: () => void,
    random: () => void,
    next: () => void,
    playable: boolean,
    showIgnore: boolean
};
export default function ToolBoxComponent({ selectLevel,selectItems, marked, mark, unmark, onClose, word, random, playable, showIgnore, next }: Props) {

    function ignoreWord(word: string) {
        fetch("/hts/api/v1/ignore", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: word }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                next()
            }
        });
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex bg-white mx-2 p-2  px-2 rounded-[30px] mb-4 mt-2 items-center">
                {selectLevel && <SelectComponent
                    items={selectItems}
                    choose={selectLevel}
                />}

                <button onClick={() => {
                    random()
                }} className={styles.star_button}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path d="M19.5576 4L20.4551 4.97574C20.8561 5.41165 21.0566 5.62961 20.9861 5.81481C20.9155 6 20.632 6 20.0649 6C18.7956 6 17.2771 5.79493 16.1111 6.4733C15.3903 6.89272 14.8883 7.62517 14.0392 9M3 18H4.58082C6.50873 18 7.47269 18 8.2862 17.5267C9.00708 17.1073 9.50904 16.3748 10.3582 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.5576 20L20.4551 19.0243C20.8561 18.5883 21.0566 18.3704 20.9861 18.1852C20.9155 18 20.632 18 20.0649 18C18.7956 18 17.2771 18.2051 16.1111 17.5267C15.2976 17.0534 14.7629 16.1815 13.6935 14.4376L10.7038 9.5624C9.63441 7.81853 9.0997 6.9466 8.2862 6.4733C7.47269 6 6.50873 6 4.58082 6H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

                {showIgnore && <button className={styles.star_button} onClick={() => { ignoreWord(word) }}>
                    <EyeSlashIcon className='w-6 h-6'></EyeSlashIcon>
                </button>}


                {playable && <AudioPlayer word={word}></AudioPlayer>}

                <div className="border-l border-gray-900 "> | </div>

                {isOpen &&
                    <button className={styles.star_button}>
                        <Link target="_blank" href={'https://youglish.com/pronounce/' + word + '/english?'} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M12 20.5C13.8097 20.5 15.5451 20.3212 17.1534 19.9934C19.1623 19.5839 20.1668 19.3791 21.0834 18.2006C22 17.0221 22 15.6693 22 12.9635V11.0365C22 8.33073 22 6.97787 21.0834 5.79937C20.1668 4.62088 19.1623 4.41613 17.1534 4.00662C15.5451 3.67877 13.8097 3.5 12 3.5C10.1903 3.5 8.45489 3.67877 6.84656 4.00662C4.83766 4.41613 3.83321 4.62088 2.9166 5.79937C2 6.97787 2 8.33073 2 11.0365V12.9635C2 15.6693 2 17.0221 2.9166 18.2006C3.83321 19.3791 4.83766 19.5839 6.84656 19.9934C8.45489 20.3212 10.1903 20.5 12 20.5Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M15.9621 12.3129C15.8137 12.9187 15.0241 13.3538 13.4449 14.2241C11.7272 15.1705 10.8684 15.6438 10.1728 15.4615C9.9372 15.3997 9.7202 15.2911 9.53799 15.1438C9 14.7089 9 13.8059 9 12C9 10.1941 9 9.29112 9.53799 8.85618C9.7202 8.70886 9.9372 8.60029 10.1728 8.53854C10.8684 8.35621 11.7272 8.82945 13.4449 9.77593C15.0241 10.6462 15.8137 11.0813 15.9621 11.6871C16.0126 11.8933 16.0126 12.1067 15.9621 12.3129Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </button>
                }

                {isOpen &&
                    ["Hint", "Pronounce", "Reveal", "Next", "Prev"].map((lv, index) => {
                        return (
                            <div className="flex text-gray-800 text-s px-1 items-center	" key={lv}>
                                {index < 2 && <div className="h-[26px] w-[56px] text-gray-950 rounded-[4px] bg-white border-gray-950 border-[1px] mr-1 text-[16px] text-center" aria-hidden="true" > Num {index + 1}  </div>}
                                {index == 2 && <div className="h-[26px] w-[52px] text-gray-950 rounded-[4px] bg-white border-gray-950 border-[1px] mr-1 text-[16px] text-center" aria-hidden="true" > {'Enter'}  </div>}
                                {index == 3 && <div className="h-[26px] w-[30px] text-gray-950 rounded-[4px] bg-white border-gray-950 border-[1px] mr-1 text-[16px] text-center" aria-hidden="true" > {'->'}  </div>}
                                {index == 4 && <div className="h-[26px] w-[30px] text-gray-950 rounded-[4px] bg-white border-gray-950 border-[1px] mr-1 text-[16px] text-center" aria-hidden="true" > {'<-'}  </div>}
                                {lv}
                            </div>
                        );
                    })
                }


                <button onClick={() => {
                    setIsOpen(!isOpen)
                }} className={styles.star_button}>

                    {!isOpen && <QuestionMarkCircleIcon className="h-[24px] w-[24px]" />}
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