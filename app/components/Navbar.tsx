
import styles from "@/app/components/ComponentStyle.module.css";
import MyDropDown from "@/app/components/DrowDown";
import UserButton from "@/app/components/user-button"
import Link from 'next/link';
export default function Navbar() {

    return (
        <>
            <div className={styles.headContainer}>
                <Link href={'/'} >
                    <div className={styles.title}>
                        {" "}
                        <span className={styles.displayNarrow}>💡 </span>How To Say
                    </div>
                </Link>
                <div className="flex-1 "> </div>
                <MyDropDown showHelpSlide={() => {
                    // setIsOpen(true)
                }} />
                <UserButton />
            </div>
        </>
    )
}