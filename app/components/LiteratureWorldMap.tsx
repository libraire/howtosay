"use client"

import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import { getAuthorCountryCode, type CountryHighlight } from "@/app/lib/literature-geo"

type Props = {
    highlights: CountryHighlight[]
    activeAuthor?: string | null
    activeAuthorCountryCode?: string | null
    className?: string
}

export default function LiteratureWorldMap({ highlights, activeAuthor, activeAuthorCountryCode, className = "" }: Props) {
    const { theme } = useAppPreferences()
    const activeCountry = activeAuthor ? getAuthorCountryCode(activeAuthor, activeAuthorCountryCode) : null
    const activeHighlight = activeCountry
        ? highlights.find((country) => country.code === activeCountry) ?? null
        : null
    const mapFill = theme === "dark" ? "#2b2b2b" : "rgba(114, 90, 63, 0.14)"
    const mapStroke = theme === "dark" ? "#545454" : "rgba(114, 90, 63, 0.24)"
    const labelFill = theme === "dark" ? "#f6f2e8" : "rgba(32, 25, 18, 0.72)"

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

                <g fill={mapFill} opacity="0.9">
                    <path d="M71 172l17-28 34-22 29-7 22 8 25-12 38-5 30-17 44 4 33 21 23 10 10 20-7 17 11 17-3 18-16 12-20 5-16 14-27 8-14 17-18 6-15 12-18-6-11-14-13 3-17 12-21-11-21 5-19-9-16 6-14-5-10-16 2-22 16-20-9-18z" />
                    <path d="M321 84l20-19 30-5 24 9-4 17-20 16-31 4-20-8z" />
                    <path d="M258 286l18 8 17 18 13 23 7 26-3 26-11 25 5 21 2 24-8 30-18 31-18 22-12-9-1-21 5-22-7-23-11-28 2-27-9-30 5-27 14-29z" />
                    <path d="M444 146l23-18 37-4 21 12 25-7 18 11-8 15-28 8-13 15-25 1-15 13-29-7 7-18-13-11z" />
                    <path d="M494 229l40 9 29 29 12 56-11 51-24 46-36 26-23-27-6-44 15-36-9-40 13-30z" />
                    <path d="M548 129l40-23 66-11 56 14 30-9 64 17 76 37 45 33-10 20-34 11-41-2-32 18-17 25-36 13-24-12-23 11-32-4-20 15-38-4-17-17-37 8-35-27-27 1-16-17 8-22-17-15z" />
                    <path d="M678 255l18 15 10 26-14 18-15-10-8-22z" />
                    <path d="M801 352l50 5 31 18 35 2 18 17-5 22-24 14-45 4-44-14-24-27z" />
                    <path d="M561 412l11 8-5 17-13 10-9-13 3-14z" />
                </g>

                <g fill="none" stroke={mapStroke} strokeWidth="0.72" opacity="0.5">
                    <path d="M71 172l17-28 34-22 29-7 22 8 25-12 38-5 30-17 44 4 33 21 23 10 10 20-7 17 11 17-3 18-16 12-20 5-16 14-27 8-14 17-18 6-15 12-18-6-11-14-13 3-17 12-21-11-21 5-19-9-16 6-14-5-10-16 2-22 16-20-9-18z" />
                    <path d="M321 84l20-19 30-5 24 9-4 17-20 16-31 4-20-8z" />
                    <path d="M258 286l18 8 17 18 13 23 7 26-3 26-11 25 5 21 2 24-8 30-18 31-18 22-12-9-1-21 5-22-7-23-11-28 2-27-9-30 5-27 14-29z" />
                    <path d="M444 146l23-18 37-4 21 12 25-7 18 11-8 15-28 8-13 15-25 1-15 13-29-7 7-18-13-11z" />
                    <path d="M494 229l40 9 29 29 12 56-11 51-24 46-36 26-23-27-6-44 15-36-9-40 13-30z" />
                    <path d="M548 129l40-23 66-11 56 14 30-9 64 17 76 37 45 33-10 20-34 11-41-2-32 18-17 25-36 13-24-12-23 11-32-4-20 15-38-4-17-17-37 8-35-27-27 1-16-17 8-22-17-15z" />
                    <path d="M678 255l18 15 10 26-14 18-15-10-8-22z" />
                    <path d="M801 352l50 5 31 18 35 2 18 17-5 22-24 14-45 4-44-14-24-27z" />
                    <path d="M561 412l11 8-5 17-13 10-9-13 3-14z" />
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
                                fill={labelFill}
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
