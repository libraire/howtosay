"use client"

import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

type Props = {
    expire: string,
    user: string
};

export default function UserInfo({ expire, user }: Props) {
    const { copy } = useAppPreferences()

    void user

    return (
        <div className="border-b" style={{ borderColor: "var(--border-soft)" }}>
            <div className="ml-2 mt-4 flex items-center gap-2 px-2 pb-4">
                <div className="flex flex-col space-y-3" style={{ color: "var(--text-primary)" }}>
                    {expire && <div className="theme-muted text-sm leading-none">
                        {copy.auth.expireAt}: {expire}
                    </div>}
                </div>

            </div>
        </div>
    )
}
