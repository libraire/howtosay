"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, getCurrentUser, logoutUser, updateUserLevel } from '@/app/lib/api'

interface CustomAuthContextType {
    user: AuthUser | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (redirectUrl?: string) => void
    logout: () => void
    refreshAuth: () => Promise<void>
    setUserLevel: (level: string) => Promise<void>
}

const CustomAuthContext = createContext<CustomAuthContextType | undefined>(undefined)

export function CustomAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check authentication status
    const checkAuth = async () => {
        try {
            setUser(await getCurrentUser())
        } catch (error) {
            console.error('Auth check failed:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Refresh auth state
    const refreshAuth = async () => {
        setIsLoading(true)
        await checkAuth()
    }

    // Login - redirect to backend login page
    const login = (redirectUrl?: string) => {
        const currentUrl = redirectUrl || (typeof window !== 'undefined' ? window.location.href : '')
        const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'https://app.bytegush.com'
        const loginUrl = `${apiHost}/auth/login?redirect_url=${encodeURIComponent(currentUrl)}`
        window.location.href = loginUrl
    }

    // Logout
    const logout = async () => {
        try {
            await logoutUser()
            setUser(null)
            localStorage.setItem('auth_changed', Date.now().toString())
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const setUserLevel = async (level: string) => {
        await updateUserLevel(level)
        setUser((prev) => prev ? { ...prev, level: Number(level) } : prev)
    }

    // Check auth on mount and when returning from login
    useEffect(() => {
        checkAuth()

        // Listen for storage events (for cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_changed') {
                checkAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    // Check for redirect from login
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const loginSuccess = urlParams.get('login_success')

        if (loginSuccess === 'true') {
            // Remove query param and refresh auth
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
            checkAuth()

            // Notify other tabs
            localStorage.setItem('auth_changed', Date.now().toString())
        }
    }, [])

    const value: CustomAuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAuth,
        setUserLevel,
    }

    return (
        <CustomAuthContext.Provider value={value}>
            {children}
        </CustomAuthContext.Provider>
    )
}

export function useCustomAuth() {
    const context = useContext(CustomAuthContext)
    if (context === undefined) {
        throw new Error('useCustomAuth must be used within CustomAuthProvider')
    }
    return context
}
