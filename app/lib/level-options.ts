import type { Locale } from "./copy"

type LevelLabelMap = Record<Locale, Record<string, string>>

const levelLabelMap: LevelLabelMap = {
    en: {
        "21": "Oxford3000",
        "16": "Scene",
        "15": "IELTS",
        "14": "TOEFL",
        "13": "SAT",
        "12": "12th",
        "11": "11th",
        "10": "10th",
        "9": "9th",
        "8": "8th",
        "7": "7th",
        "6": "6th",
        "5": "5th",
        "4": "4th",
        "3": "3rd",
        "2": "2nd",
        "1": "1st",
        "0": "Kindergarten",
    },
    zh: {
        "21": "Oxford3000",
        "16": "场景词汇",
        "15": "雅思",
        "14": "托福",
        "13": "SAT",
        "12": "12 年级",
        "11": "11 年级",
        "10": "10 年级",
        "9": "9 年级",
        "8": "8 年级",
        "7": "7 年级",
        "6": "6 年级",
        "5": "5 年级",
        "4": "4 年级",
        "3": "3 年级",
        "2": "2 年级",
        "1": "1 年级",
        "0": "学前",
    },
    ja: {
        "21": "Oxford3000",
        "16": "シーン語彙",
        "15": "IELTS",
        "14": "TOEFL",
        "13": "SAT",
        "12": "12年生",
        "11": "11年生",
        "10": "10年生",
        "9": "9年生",
        "8": "8年生",
        "7": "7年生",
        "6": "6年生",
        "5": "5年生",
        "4": "4年生",
        "3": "3年生",
        "2": "2年生",
        "1": "1年生",
        "0": "就学前",
    },
    ko: {
        "21": "Oxford3000",
        "16": "장면 어휘",
        "15": "IELTS",
        "14": "TOEFL",
        "13": "SAT",
        "12": "12학년",
        "11": "11학년",
        "10": "10학년",
        "9": "9학년",
        "8": "8학년",
        "7": "7학년",
        "6": "6학년",
        "5": "5학년",
        "4": "4학년",
        "3": "3학년",
        "2": "2학년",
        "1": "1학년",
        "0": "유치원",
    },
}

export function getLevelOptions(locale: Locale = "en") {
    const labels = levelLabelMap[locale]
    return Object.entries(labels)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([value, label]) => ({ value, label }))
}

export const levelOptions = getLevelOptions("en")

export function getLevelLabel(level: string | number, locale: Locale = "en") {
    return levelLabelMap[locale][String(level)] ?? String(level)
}
