"use client"

import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { LoaderCircle } from "lucide-react"
import { fetchLiteraryPassageDetail, fetchLiteratureTimeline } from "@/app/lib/literature-api"
import type { LiteraryPassageDetail, LiteraryTimelineItem, LiteraryTimelinePage } from "@/app/lib/literature-models"

type Props = {
    initialData: LiteraryTimelinePage
    scrollContainerRef: RefObject<HTMLDivElement | null>
    onActiveAuthorChange?: (author: string | null) => void
    onActiveAuthorCountryCodeChange?: (countryCode: string | null) => void
    onItemsChange?: (items: LiteraryTimelineItem[]) => void
}

function yearLabel(year: number | null): string {
    return year ? String(year) : "未知年代"
}

export default function LiteratureTimeline({
    initialData,
    scrollContainerRef,
    onActiveAuthorChange,
    onActiveAuthorCountryCodeChange,
    onItemsChange,
}: Props) {
    const [items, setItems] = useState<LiteraryTimelineItem[]>(initialData.data)
    const [page, setPage] = useState(initialData.current_page)
    const [lastPage, setLastPage] = useState(initialData.last_page)
    const [total, setTotal] = useState(initialData.total)
    const [authorFilter, setAuthorFilter] = useState("")
    const [workFilter, setWorkFilter] = useState("")
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [selectedPassage, setSelectedPassage] = useState<LiteraryPassageDetail | null>(null)
    const [hoveredAuthor, setHoveredAuthor] = useState<string | null>(null)
    const [listError, setListError] = useState("")
    const [detailError, setDetailError] = useState("")
    const [loadingList, setLoadingList] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    const hasMore = page < lastPage

    const activeLabel = useMemo(() => {
        if (workFilter) {
            return `《${workFilter}》`
        }

        if (authorFilter) {
            return authorFilter
        }

        return "全部文学内容"
    }, [authorFilter, workFilter])

    useEffect(() => {
        onItemsChange?.(items)
    }, [items, onItemsChange])

    useEffect(() => {
        onActiveAuthorChange?.(hoveredAuthor)
    }, [hoveredAuthor, onActiveAuthorChange])

    useEffect(() => {
        const hoveredItem = items.find((item) => item.author_name === hoveredAuthor) ?? null
        onActiveAuthorCountryCodeChange?.(hoveredItem?.author_country_code ?? null)
    }, [hoveredAuthor, items, onActiveAuthorCountryCodeChange])

    useEffect(() => {
        if (!selectedId) {
            setSelectedPassage(null)
            return
        }

        const currentId = selectedId
        let cancelled = false

        async function loadDetail() {
            setLoadingDetail(true)
            setDetailError("")

            try {
                const passage = await fetchLiteraryPassageDetail(currentId)
                if (!cancelled) {
                    setSelectedPassage(passage)
                }
            } catch (error) {
                if (!cancelled) {
                    setSelectedPassage(null)
                    setDetailError("内容加载失败，请稍后重试。")
                }
            } finally {
                if (!cancelled) {
                    setLoadingDetail(false)
                }
            }
        }

        loadDetail()

        return () => {
            cancelled = true
        }
    }, [selectedId])

    async function loadTimeline(nextPage = 1, append = false, preferredSelectedId?: number | null) {
        setLoadingList(true)
        setListError("")

        try {
            const data = await fetchLiteratureTimeline({
                page: nextPage,
                perPage: 12,
                authorName: authorFilter || undefined,
                workTitle: workFilter || undefined,
            })

            setItems((currentItems) => append ? [...currentItems, ...data.data] : data.data)
            setPage(data.current_page)
            setLastPage(data.last_page)
            setTotal(data.total)

            if (!append) {
                const matchedItem = preferredSelectedId
                    ? data.data.find((item) => item.id === preferredSelectedId)
                    : null

                setSelectedId(matchedItem?.id ?? null)
            }
        } catch (error) {
            setListError("时间线加载失败，请稍后重试。")
        } finally {
            setLoadingList(false)
        }
    }

    useEffect(() => {
        if (authorFilter || workFilter) {
            loadTimeline(1, false, selectedId)
            return
        }

        setItems(initialData.data)
        setPage(initialData.current_page)
        setLastPage(initialData.last_page)
        setTotal(initialData.total)
        setSelectedId(null)
        setListError("")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorFilter, workFilter])

    function showAll() {
        setAuthorFilter("")
        setWorkFilter("")
    }

    useEffect(() => {
        if (!hasMore || loadingList || !loadMoreRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry?.isIntersecting && !loadingList) {
                    loadTimeline(page + 1, true)
                }
            },
            {
                root: scrollContainerRef.current,
                rootMargin: "160px 0px",
            }
        )

        observer.observe(loadMoreRef.current)

        return () => {
            observer.disconnect()
        }
    }, [hasMore, loadingList, page, scrollContainerRef])

    return (
        <div className="mx-auto max-w-4xl">
            {(authorFilter || workFilter) && (
                <div className="theme-faint relative z-10 mb-8 text-sm">
                    <span>{activeLabel}</span>
                    <button
                        onClick={showAll}
                        className="theme-muted ml-4 transition hover:text-[color:var(--text-primary)]"
                    >
                        查看全部
                    </button>
                </div>
            )}

            <section className="relative z-10">
                <div className="relative">
                    <div className="absolute left-6 top-0 h-full w-px md:left-1/2 md:-ml-px" style={{ background: "var(--border-soft)" }} />

                    <div className="space-y-10">
                        {items.map((item, index) => {
                            const isRight = index % 2 === 1

                            return (
                                <article
                                    key={item.id}
                                    className="relative grid gap-2 md:grid-cols-2 md:gap-12"
                                >
                                    <div className={`hidden md:block ${isRight ? "" : "order-2"}`} />
                                    <div className={`relative ml-14 px-4 py-3 backdrop-blur-[1px] md:ml-0 ${isRight ? "md:order-2 md:pl-10" : "md:pr-10 text-left md:text-right"}`}>
                                        <div className="theme-faint text-xs tracking-[0.25em]">
                                            {yearLabel(item.work_year)}
                                        </div>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedId(item.id)
                                                }}
                                                className={`text-lg transition ${
                                                    selectedId === item.id
                                                        ? "text-[color:var(--accent)]"
                                                        : "text-[color:var(--text-primary)] hover:text-[color:var(--accent)]"
                                                }`}
                                            >
                                                {item.work_title}
                                            </button>
                                        </div>
                                        <div className="theme-muted mt-1 text-sm">
                                            <span
                                                onMouseEnter={() => setHoveredAuthor(item.author_name)}
                                                onMouseLeave={() => setHoveredAuthor(null)}
                                                className="transition hover:text-[color:var(--text-primary)]"
                                            >
                                                {item.author_name}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>

                {listError && <p className="mt-6 text-sm text-red-300">{listError}</p>}

                {hasMore && (
                    <div ref={loadMoreRef} className="mt-10 h-10">
                        {loadingList && (
                            <div className="theme-faint flex items-center gap-2 text-sm">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>加载中...</span>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {selectedId && (
                <div
                    className="theme-overlay fixed inset-0 z-50 px-6 py-10 backdrop-blur-sm"
                    onClick={() => setSelectedId(null)}
                >
                    <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center">
                        <div
                            className="scrollbar-hidden theme-panel w-full max-h-[80vh] overflow-y-auto rounded-[32px] px-8 py-8"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {loadingDetail && (
                                <div className="theme-faint flex items-center gap-2 text-sm">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>正在加载内容</span>
                                </div>
                            )}

                            {!loadingDetail && detailError && (
                                <p className="text-sm text-red-300">{detailError}</p>
                            )}

                            {!loadingDetail && !detailError && selectedPassage && (
                                <div>
                                    <div className="theme-faint text-xs tracking-[0.25em]">
                                        {yearLabel(selectedPassage.work_year)}
                                    </div>
                                    <h2 className="mt-3 text-2xl">{selectedPassage.work_title}</h2>
                                    <p className="theme-muted mt-1 text-sm">{selectedPassage.author_name}</p>
                                    <div className="theme-muted mt-8 whitespace-pre-wrap text-[15px] leading-8">
                                        {selectedPassage.excerpt}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
