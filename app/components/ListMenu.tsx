import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const people = [
    { id: 0, name: 'Default' },
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
    { id: 3, name: 'Level 3' },
    { id: 4, name: 'Level 4' },
    { id: 5, name: 'Level 5' },
    { id: 99, name: 'Ignored' },
]

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function ListMenu({ onChange }: { onChange: (e: { id: number, name: string }) => void }) {
    const [selected, setSelected] = useState({ id: 1, name: 'Proficiency' })

    return (
        <Listbox value={selected} onChange={(e) => {
            onChange(e)
            setSelected(e)
        }}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <Listbox.Button className="h-10 relative w-full cursor-default rounded-xl bg-white/5 py-1.5 pl-3 pr-10 text-left text-sm text-white shadow-sm ring-1 ring-inset ring-white/10 transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/25">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-white/40" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-[#161616] py-1 text-sm shadow-lg ring-1 ring-white/10 focus:outline-none">
                                {people.map((person) => (
                                    <Listbox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-white/10 text-white' : 'text-white/75',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block')}>
                                                    {person.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-white/60',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
