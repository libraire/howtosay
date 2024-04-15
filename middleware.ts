import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt";


function signToken(payload: Record<string, unknown>) {
  var encoded = btoa(JSON.stringify(payload))
  // var actual = JSON.parse(atob(encoded))
  return encoded
}


export async function middleware(request: NextRequest) {

  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }); 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('user', signToken(session as Record<string, unknown>))

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  return response
}