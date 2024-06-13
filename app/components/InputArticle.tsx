import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function InputArticle({ open, onClose, id, title, content }: { open: boolean, onClose: () => void, id: string | undefined, title: string, content: string }) {
    const [message, setMessage] = useState(content);
    const [t, setTitle] = useState(title);
    const cancelButtonRef = useRef(null)

    function updateArticle(id: string, title: string, content: string) {
        fetch("/hts/api/v1/material", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, title: title, content: content }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {

        });
    }

    function addArticle(title: string, content: string) {
        fetch("/hts/api/v1/material", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title, content: content }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                console.log("done")
            }
        });
    }

    useEffect(() => {
        setTitle(title)
        setMessage(content)
    }, [title, content])

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
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div className="text-center">
                                        <Dialog.Title as="h3" className="mb-3 text-base font-semibold leading-6 text-gray-900">
                                            Add a new article
                                        </Dialog.Title>

                                        <textarea
                                            rows={1}
                                            name="title"
                                            id="title"
                                            className="block w-full resize-none border-2 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2 mb-2"
                                            placeholder="Title"
                                            defaultValue={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            value={t}
                                        />

                                        <textarea
                                            rows={7}
                                            name="comment"
                                            id="comment"
                                            className="block w-full resize-none border-2 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                            placeholder="Paste content here..."
                                            defaultValue={content}
                                            onChange={(e) => setMessage(e.target.value)}
                                            value={message}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                        onClick={() => {
                                            if (id != null) {
                                                updateArticle(id, t, message)
                                            } else {
                                                addArticle(t, message)
                                            }
                                            onClose()
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                        onClick={() => onClose()}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
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
