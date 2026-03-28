import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
    FireIcon,
    PhotoIcon,
    PuzzlePieceIcon,
    BoltIcon,
    Bars3Icon,
    BookmarkIcon,
    InformationCircleIcon,
    MoonIcon,
    RectangleStackIcon,
    SunIcon,
} from '@heroicons/react/24/outline'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function MyDropDown() {
    const [mounted, setMounted] = useState(false)
    const { copy, locale, setLocale, theme, toggleTheme } = useAppPreferences()
    const menuItems = [
        { href: '/literature/saved', label: copy.menu.savedLiterature, icon: BookmarkIcon },
        { href: '/cards', label: copy.menu.cardsPreview, icon: RectangleStackIcon, badge: copy.menu.previewTag },
        { href: '/daily', label: copy.menu.dailyGuess, icon: BoltIcon },
        { href: '/image', label: copy.menu.imageMode, icon: PhotoIcon },
        { href: '/grade', label: copy.menu.gradingExercise, icon: FireIcon },
        {
            href: 'https://chromewebstore.google.com/detail/how-to-say/okpmmopmkbaicfojimaafnloaacggnfp?hl=zh-CN',
            label: copy.menu.chromeExtension,
            icon: PuzzlePieceIcon,
            external: true,
            divider: true,
        },
        { href: '/about', label: copy.menu.about, icon: InformationCircleIcon },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    aria-label={copy.menu.openToolsMenu}
                    className="theme-button-secondary inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition hover:scale-[1.03] hover:shadow-md"
                >
                    <Bars3Icon className="h-6 w-6 stroke-[2.4]" aria-hidden="true" />
                </button>
            </div>
        )
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    aria-label={copy.menu.openToolsMenu}
                    className="theme-button-secondary inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition hover:scale-[1.03] hover:shadow-md"
                >
                    <Bars3Icon className="h-6 w-6 stroke-[2.4]" aria-hidden="true" />
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
                <Menu.Items className="theme-menu-solid absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-2xl p-1.5 focus:outline-none">
                    <div className="py-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <Menu.Item key={item.href}>
                                    {({ active }) => (
                                        <a
                                            href={item.href}
                                            target={item.external ? "_blank" : undefined}
                                            rel={item.external ? "noopener noreferrer" : undefined}
                                            className={classNames(
                                                active ? 'bg-[var(--button-secondary-hover)] text-[color:var(--text-primary)]' : 'text-[color:var(--text-secondary)]',
                                                item.divider ? 'mt-1 border-t' : '',
                                                'block rounded-xl px-4 py-2 text-sm transition'
                                            )}
                                            style={item.divider ? { borderColor: "var(--border-soft)" } : undefined}
                                        >
                                            <Icon className='-ml-0.5 mr-1 inline h-5 w-5 theme-faint' />
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
                                                    style={{
                                                        background: "var(--button-secondary-bg)",
                                                        color: "var(--accent)",
                                                        border: "1px solid var(--border-soft)",
                                                    }}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </a>
                                    )}
                                </Menu.Item>
                            )
                        })}

                        <div className="mx-3 mt-2 border-t pt-3" style={{ borderColor: "var(--border-soft)" }}>
                            <div className="px-1 text-[11px] font-semibold uppercase tracking-[0.24em] theme-faint">
                                {copy.menu.appearance}
                            </div>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="theme-button-secondary mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition"
                            >
                                <span>{theme === "dark" ? copy.menu.lightMode : copy.menu.darkMode}</span>
                                {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="px-3 pb-3 pt-3">
                            <div className="px-1 text-[11px] font-semibold uppercase tracking-[0.24em] theme-faint">
                                {copy.menu.language}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLocale("en")}
                                    className={classNames(
                                        'rounded-xl px-3 py-2 text-sm transition',
                                        locale === "en" ? 'theme-button-primary' : 'theme-button-secondary'
                                    )}
                                >
                                    {copy.menu.english}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLocale("zh")}
                                    className={classNames(
                                        'rounded-xl px-3 py-2 text-sm transition',
                                        locale === "zh" ? 'theme-button-primary' : 'theme-button-secondary'
                                    )}
                                >
                                    {copy.menu.chinese}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLocale("ja")}
                                    className={classNames(
                                        'rounded-xl px-3 py-2 text-sm transition',
                                        locale === "ja" ? 'theme-button-primary' : 'theme-button-secondary'
                                    )}
                                >
                                    {copy.menu.japanese}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLocale("ko")}
                                    className={classNames(
                                        'rounded-xl px-3 py-2 text-sm transition',
                                        locale === "ko" ? 'theme-button-primary' : 'theme-button-secondary'
                                    )}
                                >
                                    {copy.menu.korean}
                                </button>
                            </div>
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
