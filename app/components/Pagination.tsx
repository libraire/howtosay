import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect,useState} from "react";

export default function Pagination({ nextPage, total, pages, currentPage }: { nextPage: (p:number, offset: number) => void, total: number, pages: number[], currentPage: number }) {
    const pageSize = 20
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, total)

    return (
        <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 hover:bg-white/10"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 hover:bg-white/10"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-white/60">
                        <span className="font-medium text-white">{start}</span> to <span className="font-medium text-white">{end}</span> of{' '}
                        <span className="font-medium text-white">{total}</span> words
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                        <button
                            type="button"
                            onClick={() => { nextPage(0,-1) }}
                            className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-white/40 ring-1 ring-inset ring-white/10 transition hover:bg-white/8 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {pages.map((pageNumber) => (
                            <button
                                type="button"
                                key={pageNumber}
                                onClick={() => { nextPage(pageNumber,0) }}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition ${pageNumber === currentPage ? 'bg-white text-black focus:z-20' : 'text-white/75 ring-1 ring-inset ring-white/10 hover:bg-white/8 focus:z-20 focus:outline-offset-0'}`}
                            >
                                {pageNumber == -1 ? '...' : pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => { nextPage(0,1) }}
                            className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-white/40 ring-1 ring-inset ring-white/10 transition hover:bg-white/8 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
