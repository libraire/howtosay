"use client"

import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"
import Link from "next/link"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import UserInfo from "@/app/components/UserInfo"
import { getLevelOptions } from "@/app/lib/level-options"

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function AuthButton() {
    const { user, isLoading, login, logout, setUserLevel } = useCustomAuth()
    const { copy, locale } = useAppPreferences()

    if (isLoading) {
        return (
            <div className="theme-button-secondary inline-flex h-10 w-[132px] items-center justify-center rounded-full px-4 text-sm font-medium sm:w-[168px]">
                {copy.auth.loading}
            </div>
        )
    }

    if (!user) {
        return (
            <button
                onClick={() => login()}
                className="theme-button-primary inline-flex h-10 w-[88px] items-center justify-center rounded-full px-0 text-sm font-medium transition"
            >
                {copy.auth.signIn}
            </button>
        )
    }

    const expire = user.expire ? user.expire.substring(0, 10) : ''
    const level = String(user.level ?? 0)
    const displayName = user.email.split("@")[0] || user.email

    return (
        <Menu as="div" className="relative inline-block max-w-[124px] text-left sm:max-w-[148px]">
            <div>
                <Menu.Button className="theme-button-secondary inline-flex h-10 max-w-full items-center justify-center rounded-full px-2 text-sm font-medium transition">
                    <span className="max-w-[86px] truncate sm:max-w-[108px]">{displayName}</span>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="theme-menu-solid absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-2xl focus:outline-none">
                    <div className="py-1">
                        <div
                            className="flex items-center gap-3 border-b px-4 py-2 text-sm"
                            style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
                        >
                            <label htmlFor="level-select" className="shrink-0 text-sm">
                                {copy.auth.level}
                            </label>
                            <select
                                id="level-select"
                                className="theme-input block min-w-0 flex-1 rounded-md py-1.5 text-sm shadow-sm focus:outline-none"
                                value={level}
                                onChange={(e) => setUserLevel(e.target.value).catch((error) => console.error(error))}
                            >
                                {getLevelOptions(locale).map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/level-assessment"
                                    className={classNames(
                                        active ? 'bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]' : 'text-[color:var(--text-secondary)]',
                                        'flex items-center gap-2 border-b px-4 py-2 text-sm'
                                    )}
                                    style={{ borderColor: "var(--border-soft)" }}
                                >
                                    <ClipboardDocumentCheckIcon className="h-5 w-5 theme-faint" />
                                    {copy.auth.assessYourLevel}
                                </Link>
                            )}
                        </Menu.Item>

                        <UserInfo expire={expire} user={user.email} />

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => logout()}
                                    className={classNames(
                                        active ? 'bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]' : 'text-[color:var(--text-secondary)]',
                                        'block w-full text-left px-4 py-2 text-sm'
                                    )}
                                >
                                    {copy.auth.signOut}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
