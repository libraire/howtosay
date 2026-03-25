"use client"

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        credentials: 'include',
        ...init,
        headers: {
            'Accept': 'application/json',
            ...(init?.headers ?? {}),
        },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data && typeof data.message === 'string'
            ? data.message
            : `Request failed with status ${response.status}`
        throw new Error(message)
    }

    return data as T
}
