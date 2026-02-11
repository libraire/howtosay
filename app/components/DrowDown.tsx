import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { BookmarkSquareIcon, AcademicCapIcon, FireIcon, PhotoIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import UserInfo from "@/app/components/UserInfo"
import { useSession } from "next-auth/react"

const selectItems = [
    { value: '21', label: 'Oxford3000' },
    { value: '16', label: 'Scene' },
    { value: '15', label: 'IELT' },
    { value: '14', label: 'TOEFL' },
    { value: '13', label: 'SAT' },
    { value: '12', label: '12th' },
    { value: '11', label: '11th' },
    { value: '10', label: '10th' },
    { value: '9', label: '9th' },
    { value: '8', label: '8th' },
    { value: '7', label: '7th' },
    { value: '6', label: '6th' },
    { value: '5', label: '5th' },
    { value: '4', label: '4th' },
    { value: '3', label: '3th' },
    { value: '2', label: '2th' },
    { value: '1', label: '1th' },
    { value: '0', label: 'Kindergarten' },
]

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function MyDropDown({ expire }: { expire: string }) {

    const [myexpire, setExpire] = useState('')
    const [level, setLevel] = useState<string>('0');

    const { data: session, update } = useSession({
        required: false,
        onUnauthenticated() {
            // redirect("/api/auth/signin")
        }
    })

    useEffect(() => {
        if (session?.user) {
            fetch("/hts/api/user").then(res => res.json()).then(data => {
                if (data.level !== undefined) {
                    setLevel(String(data.level));
                }
            }).catch(e => console.error(e));
        }
    }, [session]);

    const handleLevelChange = (newLevel: string) => {
        setLevel(newLevel);
        fetch("/hts/api/v1/user/level", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level: newLevel })
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    console.log("Level updated");
                }
            });
    }



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

                        {session && <UserInfo expire={myexpire} user={session?.user?.email ?? ""} />}

                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            <label htmlFor="level-select" className="block text-xs font-medium text-gray-500 mb-1">
                                Your Level
                            </label>
                            <select
                                id="level-select"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                value={level}
                                onChange={(e) => handleLevelChange(e.target.value)}
                            >
                                {selectItems.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                                    href='/wordbook'
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    <BookmarkSquareIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Word Book
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
                                    <AcademicCapIcon className='-ml-0.5 mr-1 h-5 w-5 text-gray-600 inline' /> Custom Practise
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
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
