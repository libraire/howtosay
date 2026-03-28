import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

export default function InputModal({ open,onClose, importWords }: { open: boolean, onClose: () => void, importWords: (e: string) => void }) {
    const { copy } = useAppPreferences()
    const [message, setMessage] = useState('');
    const cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="theme-overlay fixed inset-0 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="theme-panel relative transform overflow-hidden rounded-3xl px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div className="text-center">
                                        <Dialog.Title as="h3" className="mb-3 text-base font-semibold leading-6">
                                            {copy.inputModal.title}
                                        </Dialog.Title>
                                        <textarea
                                            rows={7}
                                            name="comment"
                                            id="comment"
                                            className="theme-input block w-full resize-none rounded-2xl py-2 text-sm leading-6 focus:ring-0"
                                            placeholder={copy.inputModal.placeholder}
                                            onChange={(e) => setMessage(e.target.value)}
                                            value={message}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        className="theme-button-primary inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-2"
                                        onClick={() => {
                                            importWords(message)
                                            setMessage("")
                                            onClose()
                                        }}
                                    >
                                        {copy.inputModal.confirm}
                                    </button>
                                    <button
                                        type="button"
                                        className="theme-button-secondary mt-3 inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-1 sm:mt-0"
                                        onClick={() => {
                                            setMessage("")
                                            onClose()
                                        }}
                                        ref={cancelButtonRef}
                                    >
                                        {copy.inputModal.cancel}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
