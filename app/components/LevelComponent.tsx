import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from "react";

export default function LevelComponent({ updateLevel, pages, currentLevel }: { updateLevel: (p: number) => void, pages: number[], currentLevel: number }) {

    return (
        <div>
            {pages.map((pageNumber) => (
                <a
                    key={pageNumber}
                    onClick={() => { updateLevel(pageNumber) }}
                    className={`h-3 hover:bg-indigo-500 hover:text-indigo-500 relative  inline-flex cursor-pointer items-center px-2  text-sm ${pageNumber <= currentLevel ? 'border-l border-white bg-indigo-600 text-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'hover:bg-indigo-600 hover:text-indigo-600 text-white ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0'}`}
                >
                    {'-'}
                </a>
            ))}

        </div>
    )
}
