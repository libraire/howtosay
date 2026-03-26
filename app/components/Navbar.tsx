"use client";

import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import AuthButton from "@/app/components/AuthButton";
import Link from 'next/link';
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/literature", label: "LITERATURE" },
    { href: "/wordbook", label: "WORD BOOK" },
    { href: "/review", label: "REVIEW" },
    { href: "/pricing", label: "PRICING" },
]

export default function Navbar({ check = true }: { check?: boolean }) {
    const pathname = usePathname()

    void check

    return (
        <header className="sticky top-0 z-40 border-b border-black/5 bg-white/92 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
            <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
                <div className="flex min-w-0 shrink-0 flex-col md:min-w-[280px]">
                    <div className="flex min-w-0 flex-col">
                        <Link href="/" className="w-fit">
                            <div className={styles.title} style={{ width: 'fit-content' }}>
                                <span>💡 </span>How To Say
                            </div>
                        </Link>

                        <div className="ml-2 text-[11px] tracking-[0.14em] text-black/38">
                            语言的边界就是世界的边界
                        </div>
                    </div>
                </div>

                <div className="hidden flex-1 justify-center md:flex">
                    <nav className="-translate-x-6 flex items-center gap-7 transition-transform">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative pb-1 text-[12px] font-semibold tracking-[0.24em] transition ${
                                        isActive ? "text-black/72" : "text-black/42 hover:text-black/78"
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute inset-x-0 -bottom-1.5 h-px origin-center bg-[#b58a58] transition-transform duration-200 ${
                                            isActive ? "scale-x-100" : "scale-x-0"
                                        }`}
                                    />
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-0.5 md:min-w-[280px] md:justify-end">
                    <AuthButton />
                    <MyDropDown />
                </div>
            </div>
        </header>
    )
}
