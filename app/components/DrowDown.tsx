import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { StarIcon } from '@heroicons/react/20/solid'
import UserButton from "@/app/components/user-button"
import { signOut, signIn } from "next-auth/react"

import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

type MyFunctionType = () => void;

type Props = {
    showHelpSlide: MyFunctionType;
    expire: string
};

export default function MyDropDown({ showHelpSlide, expire }: Props) {

    const [myexpire, setExpire] = useState('')

    const { data: session, update } = useSession({
        required: false,
        onUnauthenticated() {
            redirect("/api/auth/signin")
        }
    })

    useEffect(() => {

        if (expire) {
            setExpire(expire.substring(0, 10))
        }

    }, [expire])


    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <StarIcon className="-ml-0.5 h-5 w-5 text-amber-400" aria-hidden="true" />
                    Pro
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">

                        {session && <UserButton expire={myexpire} user={session?.user?.email ?? ""} />}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/wordbook'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    Word Book
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/read'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    Read Mode
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/practise'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    Practise
                                </a>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="https://www.bytegush.com/about/feedback"
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    Feedback
                                </a>
                            )}
                        </Menu.Item>
                        {session && <Menu.Item>
                            {({ active }) => (
                                <a
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                        signOut({ redirect: false });
                                    }}
                                >
                                    Sign Out
                                </a>
                            )}
                        </Menu.Item>}

                        {!session && <Menu.Item>
                            {({ active }) => (
                                <a
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                        signIn();
                                    }}
                                >
                                    Sign In
                                </a>
                            )}
                        </Menu.Item>}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
