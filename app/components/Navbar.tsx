"use client";

import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import AuthButton from "@/app/components/AuthButton";
import Link from 'next/link';


export default function Navbar({ check = true }: { check?: boolean }) {
    return (
        <>
            <div className={styles.headContainer}>
                <div className="flex items-start gap-8">
                    <div className="flex flex-col">
                        <Link href={'/'} >
                            <div className={styles.title} style={{ width: 'fit-content' }}>
                                <span>💡 </span>How To Say
                            </div>
                        </Link>

                        <div className="ml-2 text-gray-400 text-[13px]">
                            语言的边界就是世界的边界
                        </div>
                    </div>

                    <div className="hidden items-center gap-6 pt-4 md:flex">
                        <Link
                            href="/literature"
                            className="text-sm font-medium tracking-[0.18em] text-gray-300 transition hover:text-black"
                        >
                            LITERATURE
                        </Link>
                        <Link
                            href="/wordbook"
                            className="text-sm font-medium tracking-[0.18em] text-gray-300 transition hover:text-black"
                        >
                            WORD BOOK
                        </Link>
                        <Link
                            href="/review"
                            className="text-sm font-medium tracking-[0.18em] text-gray-300 transition hover:text-black"
                        >
                            REVIEW
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm font-medium tracking-[0.18em] text-gray-300 transition hover:text-black"
                        >
                            PRICING
                        </Link>
                    </div>
                </div>

                <div className="flex-1 "> </div>
                <div className="flex items-center gap-2">
                    <AuthButton />
                    <MyDropDown />
                </div>
            </div>
        </>
    )
}
