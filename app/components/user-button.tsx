"use client"

import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { SignIn, SignOut } from "./auth-components"
import { useEffect } from "react";

type Props = {
    expire: string,
    user: string
};

export default function UserButton({ expire, user }: Props) {

    return (
        <div className="flex gap-2 items-center ml-2  mt-4 px-2">
            <div className="flex flex-col space-y-3 text-gray-900 ">
                <div className="text-s leading-none text-muted-foreground">
                    {user}
                </div>

                <div className="text-sm leading-none text-muted-foreground pb-4 border-b border-gray-200">
                    Expire at: {expire}
                </div>
            </div>

        </div>
    )
}
