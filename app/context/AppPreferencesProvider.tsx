"use client"

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { dictionaries, type Dictionary, type Locale, type Theme } from "@/app/lib/copy"

type AppPreferencesContextValue = {
    locale: Locale
    setLocale: (locale: Locale) => void
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
    copy: Dictionary
}

const THEME_STORAGE_KEY = "howtosay-theme"
const LOCALE_STORAGE_KEY = "howtosay-locale"

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null)

function resolveInitialLocale() {
    if (typeof window === "undefined") {
        return "en" as Locale
    }

    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (storedLocale === "en" || storedLocale === "zh") {
        return storedLocale
    }

    return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"
}

function resolveInitialTheme() {
    if (typeof window === "undefined") {
        return "dark" as Theme
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme
    }

    return "dark"
}

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("en")
    const [theme, setTheme] = useState<Theme>("dark")
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setLocale(resolveInitialLocale())
        setTheme(resolveInitialTheme())
        setIsReady(true)
    }, [])

    useEffect(() => {
        if (!isReady) {
            return
        }

        document.documentElement.dataset.theme = theme
        document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
        document.documentElement.style.colorScheme = theme
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    }, [isReady, locale, theme])

    const value = useMemo<AppPreferencesContextValue>(() => ({
        locale,
        setLocale,
        theme,
        setTheme,
        toggleTheme: () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark"),
        copy: dictionaries[locale],
    }), [locale, theme])

    return (
        <AppPreferencesContext.Provider value={value}>
            {children}
        </AppPreferencesContext.Provider>
    )
}

export function useAppPreferences() {
    const context = useContext(AppPreferencesContext)

    if (!context) {
        throw new Error("useAppPreferences must be used within AppPreferencesProvider")
    }

    return context
}
