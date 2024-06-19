import { StarIcon } from '@heroicons/react/20/solid'
import React, { useState } from "react";

type Props = {
    word: string,
};
export default function StartComponent({ word }: Props) {

    const [currentLevel, setCurrentLevel] = useState(0);

    function updateLevel(word: string, level: number) {
        fetch("/hts/api/v1/level?word=" + word + "&level=" + level, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                setCurrentLevel(level)
            }
        });
    }

    return (
        <>
            <div className='flex'>
                Familiarity:
                {[1, 2, 3, 4, 5].map((item, index) => (
                    <div className={`${currentLevel == item ? 'bg-amber-300 text-gray-100' : ''} h-[24px] w-[24px] rounded-full text-gray-900 bg-gray-100 hover:text-gray-100 hover:bg-amber-300 relative cursor-pointer text-center mx-1`} onClick={() => { 
                        updateLevel(word, item)
                    }}> {item} </div>
                ))}

            </div>
            <div>
                Good Job! Press &lt;Enter&gt; to continue.
            </div>
        </>
    )
}