"use client";
import React from "react";
import { useState } from 'react'

export default function Component() {

    const [code, setCode] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [isValid, setIsValid] = useState(true);
    async function activate() {
        fetch("/hts/api/v1/activate?code=" + code, { method: 'POST', }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                setIsPro(true)
            } else {
                setIsValid(false)
            }
        })
    }

    return (
        !isPro && <div className="fixed top-0 left-0 right-0 bg-gray-900 h-screen z-50 flex items-center flex-col pt-40">

            <h1 className="text-4xl font-medium tracking-tight mb-4">Activate Pro</h1>
            {!isValid && <h1 className="text-xl font-medium tracking-tight mb-4 text-red-500">Invalid Activate Code</h1>}

            <div className="isolate rounded-md shadow-sm">
                <div className="bg-transparent relative rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label htmlFor="activate-code" className="block text-large font-large text-gray-100">
                        Activate Code
                    </label>
                    <input
                        type="text"
                        name="activate-code"
                        id="activate-code"
                        onChange={(e) => setCode(e.target.value)}
                        className="block bg-transparent  w-[300px] h-[30px] border-0 p-0 text-gray-100 placeholder:text-gray-400 focus:ring-0 text-large"
                    />
                </div>

                <button
                    type="button"
                    className="w-full mt-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-large font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    onClick={activate}
                >
                    Activate
                </button>

                <button
                    type="button"
                    className="w-full mt-4 block rounded-md bg-indigo-500 px-3 py-2 text-center text-large font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Purchase
                </button>
            </div>

        </div>
    )

}
