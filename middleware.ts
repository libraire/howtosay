import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }); 
  // const requestHeaders = new Headers(request.headers)
  // requestHeaders.set('user', signToken(session as Record<string, unknown>))
  const response = NextResponse.next()
  return response
}