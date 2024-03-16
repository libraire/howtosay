"use client";

import { Button } from "./ui/button"
import { redirect } from "next/navigation"
import { signOut } from "next-auth/react"


export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        redirect("/api/auth/signin?callbackUrl=/")
      }}
    >
      <Button className="bg-black ml-2 mr-2" {...props}>Sign In</Button>
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
      <Button onClick={()=>{
        signOut({ redirect: false });
      }} variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
  )
}
