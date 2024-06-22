
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import Link from 'next/link';
import ActivateComponent from "./ ActivateComponent";
import { useEffect, useState } from "react";

export default function Navbar({ check = true }: { check?: boolean }) {

    const [isPro, setIsPro] = useState(true)
    const [expire, setExpire] = useState('')

    useEffect(() => {
        fetch("/hts/api/v1/ispro", { method: 'GET', }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (check) {
                setIsPro(data.isPro)
            }
            setExpire(data.expire)
        })
    })

    return (
        <>
            <div className={styles.headContainer}>

                <div className="flex flex-col">

                    <Link href={'/'} >
                        <div className={styles.title}>
                            <span>💡 </span>How To Say
                        </div>
                    </Link>

                    <div className="ml-2 text-gray-400 text-[13px]">
                        Guess the word from its definition
                    </div>
                </div>


                <div className="flex-1 "> </div>
                <MyDropDown showHelpSlide={() => {
                    // setIsOpen(true)
                }} expire={expire} />

                {!isPro && <ActivateComponent />}
            </div>
        </>
    )
}