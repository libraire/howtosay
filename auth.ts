
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email";
import type { Adapter } from 'next-auth/adapters';
import { SupabaseAdapter } from "@auth/supabase-adapter"


export const handler = NextAuth({

    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // EmailProvider({
        //   server: process.env.EMAIL_SERVER,
        //   from: process.env.EMAIL_FROM
        // }),
      ],
      // adapter: SupabaseAdapter({
      //   url: process.env.SUPABASE_URL as string,
      //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      // }) as Adapter,
    
})

export const { handlers, auth, signIn, signOut } = handler