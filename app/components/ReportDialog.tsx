import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

export default function InputModal({ open,onClose, report }: { open: boolean, onClose: () => void, report: (e: string) => void }) {
    const [message, setMessage] = useState('');
    const cancelButtonRef = useRef(null)
    const { copy } = useAppPreferences()

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
                            <Dialog.Panel className="theme-panel relative transform overflow-hidden rounded-[28px] px-4 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div className="text-center">
                                        <Dialog.Title as="h3" className="mb-3 text-base font-semibold leading-6">
                                            {copy.reportDialog.title}
                                        </Dialog.Title>
                                        <textarea
                                            rows={7}
                                            name="comment"
                                            id="comment"
                                            className="theme-input block w-full resize-none rounded-2xl py-2 text-sm focus:outline-none sm:leading-6 p-2"
                                            placeholder={copy.reportDialog.placeholder}
                                            defaultValue={''}
                                            onChange={(e) => setMessage(e.target.value)}
                                            value={message}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        className="theme-button-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-2"
                                        onClick={() => {
                                            report(message)
                                            onClose()
                                        }}
                                    >
                                        {copy.reportDialog.submit}
                                    </button>
                                    <button
                                        type="button"
                                        className="theme-button-secondary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:col-start-1 sm:mt-0"
                                        onClick={() => onClose()}
                                        ref={cancelButtonRef}
                                    >
                                        {copy.reportDialog.cancel}
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
