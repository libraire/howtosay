"use client";

import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import AuthButton from "@/app/components/AuthButton";
import QuickWordSearch from "@/app/components/QuickWordSearch";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";

export default function Navbar({ check = true }: { check?: boolean }) {
    const pathname = usePathname()
    const { copy } = useAppPreferences()

    void check

    const navItems = [
        { href: "/literature", label: copy.nav.literature },
        { href: "/vocabulary", label: copy.nav.vocabulary },
        { href: "/review", label: copy.nav.progress },
        { href: "/pricing", label: copy.nav.pricing },
    ]

    return (
        <header
            className="sticky top-0 z-40 w-full self-stretch border-b shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            style={{
                borderColor: "var(--header-border)",
                background: "var(--header-bg)",
            }}
        >
            <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
                <div className="flex min-w-0 shrink-0 flex-col md:min-w-[280px]">
                    <div className="flex min-w-0 flex-col">
                        <Link href="/" className="w-fit">
                            <div className={styles.title} style={{ width: 'fit-content' }}>
                                <span>💡 </span>{copy.nav.title}
                            </div>
                        </Link>

                        <div className="ml-2 text-[11px] tracking-[0.14em] theme-faint">
                            {copy.nav.tagline}
                        </div>
                    </div>
                </div>

                <div className="hidden flex-1 justify-center md:flex">
                    <nav className="-translate-x-4 flex items-center gap-5 transition-transform">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative inline-flex w-[112px] justify-center pb-1 text-center text-[12px] font-semibold tracking-[0.24em] transition ${
                                        isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-faint)] hover:text-[color:var(--text-secondary)]"
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute inset-x-0 -bottom-1.5 h-px origin-center transition-transform duration-200 ${
                                            isActive ? "scale-x-100" : "scale-x-0"
                                        }`}
                                        style={{ backgroundColor: "var(--accent)" }}
                                    />
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2 md:min-w-[280px] md:justify-end">
                    <QuickWordSearch />
                    <AuthButton />
                    <MyDropDown />
                </div>
            </div>
        </header>
    )
}
