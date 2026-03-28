import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";

export default function Pagination({ nextPage, total, pages, currentPage }: { nextPage: (p:number, offset: number) => void, total: number, pages: number[], currentPage: number }) {
    const { copy } = useAppPreferences()
    const pageSize = 20
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, total)

    return (
        <div className="theme-card flex w-full items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="theme-button-secondary relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                >
                    {copy.pagination.previous}
                </a>
                <a
                    href="#"
                    className="theme-button-secondary relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                >
                    {copy.pagination.next}
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="theme-muted text-sm">
                        {copy.pagination.range
                            .replace("{start}", String(start))
                            .replace("{end}", String(end))
                            .replace("{total}", String(total))}
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                        <button
                            type="button"
                            onClick={() => { nextPage(0,-1) }}
                            className="theme-button-secondary relative inline-flex items-center rounded-l-xl px-2 py-2 transition focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">{copy.pagination.previous}</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {pages.map((pageNumber) => (
                            <button
                                type="button"
                                key={pageNumber}
                                onClick={() => { nextPage(pageNumber,0) }}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition ${pageNumber === currentPage ? 'theme-button-primary focus:z-20' : 'theme-button-secondary focus:z-20 focus:outline-offset-0'}`}
                            >
                                {pageNumber == -1 ? '...' : pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => { nextPage(0,1) }}
                            className="theme-button-secondary relative inline-flex items-center rounded-r-xl px-2 py-2 transition focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">{copy.pagination.next}</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
