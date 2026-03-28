"use client";
import React from "react";
import { useState } from 'react'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider";
import { verifyLicense } from "@/app/lib/practice-api";
import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import { formatCopy } from "@/app/lib/copy";

type Props = {
    open: boolean
    onClose?: () => void
}

export default function Component({ open, onClose }: Props) {

    const [license, setLicense] = useState('');
    const [reason, setReason] = useState('');
    const [isValid, setIsValid] = useState(true);
    const { refreshAuth } = useCustomAuth()
    const { copy } = useAppPreferences()

    async function activate() {
        verifyLicense(license).then((data) => {
            if (data.status == 'ok') {
                refreshAuth().catch((error) => console.error(error))
                onClose?.()
            } else {
                setIsValid(false)
                setReason(data.reason ?? '')
            }
        })
    }

    if (!open) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 px-6 py-10 backdrop-blur-sm"
            onClick={() => onClose?.()}
        >
            <div className="mx-auto flex min-h-full max-w-xl items-start justify-center pt-24">
                <div
                    className="w-full bg-gray-900 px-8 py-8 text-white"
                    onClick={(event) => event.stopPropagation()}
                >
            <h1 className="text-4xl font-medium tracking-tight mb-4">{copy.activation.title}</h1>
            {!isValid && <h1 className="text-xl font-medium tracking-tight mb-4 text-red-500">{formatCopy(copy.activation.invalidLicense, { reason })}</h1>}

            <div className="isolate rounded-md shadow-sm">
                <div className="bg-transparent relative rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label htmlFor="activate-code" className="block text-large font-large text-gray-100">
                        {copy.activation.license}
                    </label>
                    <input
                        type="text"
                        name="activate-code"
                        id="activate-code"
                        onChange={(e) => setLicense(e.target.value)}
                        className="block bg-transparent  w-[300px] h-[30px] border-0 p-0 text-gray-100 placeholder:text-gray-400 focus:ring-0 text-large"
                        placeholder={copy.activation.placeholder}
                    />
                </div>

                <button
                    type="button"
                    className="w-full mt-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-large font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    onClick={activate}
                >
                    {copy.activation.activate}
                </button>

                <a
                    href="https://panlover3.gumroad.com/l/wgexm"
                    type="button"
                    className="w-full mt-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-large font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    {copy.activation.buyLicense}
                </a>
            </div>
                </div>
            </div>
        </div>
    )

}
