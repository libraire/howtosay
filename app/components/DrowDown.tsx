import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FireIcon, PhotoIcon, PuzzlePieceIcon, BoltIcon, Bars3Icon, InformationCircleIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function MyDropDown() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    aria-label="Open tools menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-white shadow-sm transition hover:scale-[1.03] hover:bg-black/90 hover:shadow-md"
                >
                    <Bars3Icon className="h-6 w-6 stroke-[2.4] text-white" aria-hidden="true" />
                </button>
            </div>
        )
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    aria-label="Open tools menu"
                    className="inline-flex h-11 w-11 items-center justify-center  text-white shadow-sm transition hover:scale-[1.03] hover:bg-black/90 hover:shadow-md"
                >
                    <Bars3Icon className="h-6 w-6 stroke-[2.4] text-white" aria-hidden="true" />
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

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/daily'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    <BoltIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Daily Guess
                                </a>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/image'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    <PhotoIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Image Mode
                                </a>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/grade'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    <FireIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Grading exercise
                                </a>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="https://chromewebstore.google.com/detail/how-to-say/okpmmopmkbaicfojimaafnloaacggnfp?hl=zh-CN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm border-t border-gray-100'
                                    )}
                                >
                                    <PuzzlePieceIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Chrome Extension
                                </a>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href='/about'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    <InformationCircleIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> About
                                </a>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
