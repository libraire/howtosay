
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import UserButton from "@/app/components/user-button"
import Link from 'next/link';
export default function Navbar() {

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
                }} />
                <UserButton />
            </div>
        </>
    )
}