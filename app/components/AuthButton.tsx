"use client"

import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import Link from "next/link"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import UserInfo from "@/app/components/UserInfo"
import { levelOptions } from "@/app/lib/level-options"

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function AuthButton() {
    const { user, isLoading, login, logout, setUserLevel } = useCustomAuth()

    if (isLoading) {
        // Loading state
        return (
            <div className="inline-flex h-10 w-[132px] items-center justify-center rounded-full border border-black/10 bg-black/[0.03] px-4 text-sm font-medium text-black/45 sm:w-[168px]">
                Loading...
            </div>
        )
    }

    if (!user) {
        // Not logged in - show Sign In button
        return (
            <button
                onClick={() => login()}
                className="inline-flex h-10 w-[72px] items-center justify-center rounded-full bg-black px-0 text-sm font-medium text-white transition hover:bg-black/88"
            >
                Sign In
            </button>
        )
    }

    const expire = user.expire ? user.expire.substring(0, 10) : ''
    const level = String(user.level ?? 0)
    const displayName = user.email.split("@")[0] || user.email

    // Logged in - show email with dropdown for Sign Out
    return (
        <Menu as="div" className="relative inline-block max-w-[124px] text-left sm:max-w-[148px]">
            <div>
                <Menu.Button className="inline-flex h-10 max-w-full items-center justify-center rounded-full border border-black/10 bg-black/[0.03] px-2 text-sm font-medium text-black/78 transition hover:bg-black/[0.06]">
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        

                        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-2 text-sm text-gray-700">
                            <label htmlFor="level-select" className="shrink-0 text-sm text-gray-700">
                                Level
                            </label>
                            <select
                                id="level-select"
                                className="block min-w-0 flex-1 rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                value={level}
                                onChange={(e) => setUserLevel(e.target.value).catch((error) => console.error(error))}
                            >
                                {levelOptions.map((item) => (
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
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'flex items-center gap-2 border-b border-gray-100 px-4 py-2 text-sm'
                                    )}
                                >
                                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-500" />
                                    Assess your level
                                </Link>
                            )}
                        </Menu.Item>

                        <UserInfo expire={expire} user={user.email} />
                        
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => logout()}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block w-full text-left px-4 py-2 text-sm'
                                    )}
                                >
                                    Sign Out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
