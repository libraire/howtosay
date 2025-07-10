
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import Link from 'next/link';
import ActivateComponent from "./ ActivateComponent";
import { useEffect, useState } from "react";


export default function Navbar({ check = true }: { check?: boolean }) {

    const [isPro, setIsPro] = useState(true)
    const [expire, setExpire] = useState('')

    useEffect(() => {
        var getCookie =  function(name: string): string | undefined {
            const value = `; ${document.cookie}`;
            console.log(`get cookie ${document.cookie}`);
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return undefined;
        }

        const sessionValue = getCookie('bytegush_session');
        fetch("/hts/api/v1/license/ispro", {
            method: 'GET', headers: {
                'bytegush_session': sessionValue ?? ''
            }
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (check) {
                // TODO 
                // setIsPro(data.isPro)
                setIsPro(true)
            }
            setExpire(data.expire)
        })
    })

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
                <MyDropDown expire={expire} />
                {!isPro && <ActivateComponent />}
            </div>
        </>
    )
}