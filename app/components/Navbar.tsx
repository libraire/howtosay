"use client";

import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import AuthButton from "@/app/components/AuthButton";
import Link from 'next/link';
import ActivateComponent from "./ ActivateComponent";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";


export default function Navbar({ check = true }: { check?: boolean }) {
    const { user } = useCustomAuth()
    const isPro = check ? !!user?.isPro : true

    return (
        <>
            <div className={styles.headContainer}>

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


                <div className="flex-1 "> </div>
                <div className="flex items-center gap-2">
                    <AuthButton />
                    <MyDropDown />
                </div>
                {!isPro && <ActivateComponent />}
            </div>
        </>
    )
}
