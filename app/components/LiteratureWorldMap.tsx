"use client"

import { getAuthorCountryCode, type CountryHighlight } from "@/app/lib/literature-geo"

type Props = {
    highlights: CountryHighlight[]
    activeAuthor?: string | null
    className?: string
}

export default function LiteratureWorldMap({ highlights, activeAuthor, className = "" }: Props) {
    const activeCountry = activeAuthor ? getAuthorCountryCode(activeAuthor) : null
    const activeHighlight = activeCountry
        ? highlights.find((country) => country.code === activeCountry) ?? null
        : null

    return (
        <div className={`relative h-full w-full opacity-80 ${className}`}>
            <svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                <defs>
                    <filter id="country-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g fill="#2b2b2b" opacity="0.9">
                    <path d="M66 162l23-29 37-15 35 2 19-10 29 5 23-15 41-3 34 15 22 21 4 18-9 15 18 14 1 18-14 15-23 13-28 3-16 10-26-1-19 9-23-7-20 9-24-9-19 5-18-6-11-18 5-24 18-19-13-18z" />
                    <path d="M320 83l18-17 31-4 22 10-6 19-27 14-28-3z" />
                    <path d="M261 279l19 11 18 25 9 29-3 30-10 25 8 27-5 31-11 34-18 24-12-10 1-23-10-28 3-25-11-33 6-31 16-29z" />
                    <path d="M444 146l23-18 37-4 21 12 25-7 18 11-8 15-28 8-13 15-25 1-15 13-29-7 7-18-13-11z" />
                    <path d="M496 213l39 8 28 28 11 55-10 51-23 44-37 24-22-26-5-42 14-35-9-39 14-29z" />
                    <path d="M548 129l40-23 66-11 56 14 30-9 64 17 76 37 45 33-10 20-34 11-41-2-32 18-17 25-36 13-24-12-23 11-32-4-20 15-38-4-17-17-37 8-35-27-27 1-16-17 8-22-17-15z" />
                    <path d="M678 255l18 15 10 26-14 18-15-10-8-22z" />
                    <path d="M801 352l50 5 31 18 35 2 18 17-5 22-24 14-45 4-44-14-24-27z" />
                    <path d="M562 394l11 8-5 17-13 10-9-13 3-14z" />
                </g>

                <g fill="none" stroke="#545454" strokeWidth="0.72" opacity="0.5">
                    <path d="M66 162l23-29 37-15 35 2 19-10 29 5 23-15 41-3 34 15 22 21 4 18-9 15 18 14 1 18-14 15-23 13-28 3-16 10-26-1-19 9-23-7-20 9-24-9-19 5-18-6-11-18 5-24 18-19-13-18z" />
                    <path d="M320 83l18-17 31-4 22 10-6 19-27 14-28-3z" />
                    <path d="M261 279l19 11 18 25 9 29-3 30-10 25 8 27-5 31-11 34-18 24-12-10 1-23-10-28 3-25-11-33 6-31 16-29z" />
                    <path d="M444 146l23-18 37-4 21 12 25-7 18 11-8 15-28 8-13 15-25 1-15 13-29-7 7-18-13-11z" />
                    <path d="M496 213l39 8 28 28 11 55-10 51-23 44-37 24-22-26-5-42 14-35-9-39 14-29z" />
                    <path d="M548 129l40-23 66-11 56 14 30-9 64 17 76 37 45 33-10 20-34 11-41-2-32 18-17 25-36 13-24-12-23 11-32-4-20 15-38-4-17-17-37 8-35-27-27 1-16-17 8-22-17-15z" />
                    <path d="M678 255l18 15 10 26-14 18-15-10-8-22z" />
                    <path d="M801 352l50 5 31 18 35 2 18 17-5 22-24 14-45 4-44-14-24-27z" />
                    <path d="M562 394l11 8-5 17-13 10-9-13 3-14z" />
                </g>

                {activeHighlight && (() => {
                    const x = activeHighlight.x * 10
                    const y = activeHighlight.y * 5.2

                    return (
                        <g className="transition-all duration-300">
                            <circle
                                cx={x}
                                cy={y}
                                r={24}
                                fill={activeHighlight.color}
                                opacity={0.22}
                                filter="url(#country-glow)"
                                className="map-country-pulse"
                            />
                            <circle
                                cx={x}
                                cy={y}
                                r={7}
                                fill={activeHighlight.color}
                                opacity={1}
                            />
                            <text
                                x={x + 14}
                                y={y - 4}
                                fill="#f6f2e8"
                                fontSize="7"
                                letterSpacing="0.9"
                            >
                                {activeHighlight.name.toUpperCase()}
                            </text>
                        </g>
                    )
                })()}
            </svg>
        </div>
    )
}
