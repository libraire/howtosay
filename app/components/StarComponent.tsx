import React, { useEffect, useState } from "react";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";
import { updateWordLevel } from "@/app/lib/practice-api";
import LevelComponent from "./LevelComponent";

type Props = {
    word: string,
    currentLevel?: number,
};
export default function StartComponent({ word, currentLevel = 0 }: Props) {
    const { copy } = useAppPreferences()

    const [selectedLevel, setSelectedLevel] = useState(currentLevel);

    useEffect(() => {
        setSelectedLevel(currentLevel)
    }, [currentLevel, word])

    function updateLevel(word: string, level: number) {
        updateWordLevel(word, level, "familiarity-stars").then(() => {
            setSelectedLevel(level)
        });
    }

    return (
        <>
            <div className='flex items-center gap-3'>
                <span className="text-sm text-white/70">{copy.starRating.familiarity}</span>
                <LevelComponent
                    updateLevel={(level) => {
                        updateLevel(word, level)
                    }}
                    currentLevel={selectedLevel}
                    pages={[1, 2, 3, 4, 5]}
                />
            </div>
            <div className="text-sm text-white/60">
                {copy.starRating.successHint}
            </div>
        </>
    )
}
