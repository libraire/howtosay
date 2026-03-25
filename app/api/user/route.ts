import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST
    if (!apiHost) {
        return NextResponse.json({ message: 'NEXT_PUBLIC_API_HOST is not configured' }, { status: 500 })
    }

    const cookieHeader = (await cookies()).toString()
    const response = await fetch(`${apiHost}/hts/api/v1/user`, {
        headers: {
            cookie: cookieHeader,
            accept: 'application/json',
        },
        cache: 'no-store',
    })

    if (!response.ok) {
        return NextResponse.json({ user: null }, { status: response.status })
    }

    return NextResponse.json(await response.json())
}
