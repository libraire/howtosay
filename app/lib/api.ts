"use client"

export interface AuthUser {
    name?: string
    email: string
    isPro?: boolean
    expire?: string
    level?: number
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        credentials: 'include',
        ...init,
        headers: {
            'Accept': 'application/json',
            ...(init?.headers ?? {}),
        },
    })

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const data = await fetchJson<Record<string, unknown>>('/hts/api/v1/user', {
        method: 'GET',
    })

    if (!data?.email) {
        return null
    }

    return {
        name: typeof data.name === 'string' ? data.name : undefined,
        email: String(data.email),
        isPro: Boolean(data.isPro ?? data.is_pro),
        expire: typeof data.expire === 'string' ? data.expire : undefined,
        level: typeof data.level === 'number' ? data.level : undefined,
    }
}

export async function logoutUser(): Promise<void> {
    await fetchJson('/hts/api/v1/auth/logout', {
        method: 'POST',
    })
}

export async function updateUserLevel(level: string): Promise<void> {
    await fetchJson('/hts/api/v1/user/level', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level }),
    })
}
