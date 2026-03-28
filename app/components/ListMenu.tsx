import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useAppPreferences } from "@/app/context/AppPreferencesProvider"

type ListMenuItem = {
    id: number | null
    name: string
}

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function ListMenu({ onChange }: { onChange: (e: ListMenuItem) => void }) {
    const { copy } = useAppPreferences()
    const people = [
        { id: null, name: copy.listMenu.allWords },
        { id: 0, name: copy.listMenu.unfamiliar },
        { id: 1, name: copy.listMenu.familiarity1 },
        { id: 2, name: copy.listMenu.familiarity2 },
        { id: 3, name: copy.listMenu.familiarity3 },
        { id: 4, name: copy.listMenu.familiarity4 },
        { id: 5, name: copy.listMenu.familiarity5 },
        { id: 99, name: copy.listMenu.ignored },
    ]
    const [selected, setSelected] = useState<ListMenuItem>(people[0])

    return (
        <Listbox value={selected} onChange={(e) => {
            onChange(e)
            setSelected(e)
        }}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <Listbox.Button className="theme-button-secondary relative h-10 w-full cursor-default rounded-xl py-1.5 pl-3 pr-10 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--border-strong)]">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="theme-faint h-5 w-5" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="theme-menu absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-xl py-1 text-sm shadow-lg focus:outline-none">
                                {people.map((person) => (
                                    <Listbox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-[var(--button-secondary-hover)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
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
                                                            active ? 'text-[var(--text-primary)]' : 'theme-muted',
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
