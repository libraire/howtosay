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
            <div className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300">
                Loading...
            </div>
        )
    }

    if (!user) {
        // Not logged in - show Sign In button
        return (
            <button
                onClick={() => login()}
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                Sign In
            </button>
        )
    }

    const expire = user.expire ? user.expire.substring(0, 10) : ''
    const level = String(user.level ?? 0)

    // Logged in - show email with dropdown for Sign Out
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <span className="max-w-[200px] truncate">{user.email}</span>
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                        <UserInfo expire={expire} user={user.email} />

                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            <label htmlFor="level-select" className="block text-xs font-medium text-gray-500 mb-1">
                                Your Level
                            </label>
                            <select
                                id="level-select"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
