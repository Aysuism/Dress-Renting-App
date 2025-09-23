import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import type { Option } from "../tools/types";

interface SelectButtonProps {
    selected: Option | null;
    setSelected: (option: Option | null) => void;
    options: Option[];
}

const SelectButton: React.FC<SelectButtonProps> = ({ selected, setSelected, options }) => {

    return (
        <div className="flex flex-col relative w-full">
            <Listbox value={selected} onChange={(v: any) => setSelected(v.id === 0 ? null : v)}>
                <div className="relative">
                    {/* Button */}
                    <Listbox.Button className="w-full flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white cursor-pointer text-gray-700 text-sm font-medium">
                         <span>{selected ? selected.name : options[0].name}</span>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </Listbox.Button>

                    {/* Dropdown */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg focus:outline-none max-h-64 overflow-auto">

                            {/* Hamısı option */}
                            <Listbox.Option
                                key={0}
                                value={{ id: 0, name: "Hamısı" }}
                                className={({ active}) =>
                                    `cursor-pointer select-none py-2 px-4 text-sm
                                    ${active ? "bg-[#dbdbdb] text-black" : "text-gray-700"} 
                                    ${!selected ? "font-semibold" : "font-normal"}`
                                }
                            >
                                {() => (
                                    <div className="flex items-center justify-between">
                                        <span>Hamısı</span>
                                        {!selected && <CheckIcon className="h-4 w-4 text-purple-600" />}
                                    </div>
                                )}
                            </Listbox.Option>

                            {/* Other options */}
                            {options.slice(1).map((option) => (
                                <Listbox.Option
                                    key={option.id}
                                    value={option}
                                    className={({ active, selected: isSelected }) =>
                                        `cursor-pointer select-none py-2 px-4 text-sm
                                        ${active ? "bg-[#dbdbdb] text-black" : "text-gray-700"} 
                                        ${isSelected ? "font-semibold" : "font-normal"}`
                                    }
                                >
                                    {({ selected: isSelected }) => (
                                        <div className="flex items-center justify-between">
                                            <span>{option.name}</span>
                                            {isSelected && <CheckIcon className="h-4 w-4 text-purple-600" />}
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>

        </div>
    );
};

export default SelectButton;

interface MultiSelectDropdownProps {
    options: Option[]
    selected: Option[]
    setSelected: (options: Option[]) => void
}

export function MultiSelectButton({ selected, setSelected, options, }: MultiSelectDropdownProps) {


    return (
        <div className="flex flex-col relative w-full z-1">
            <Listbox multiple value={selected} onChange={setSelected}>
                <div className="relative">
                    <Listbox.Button className="w-full flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white cursor-pointer text-gray-700 text-sm font-medium">
                        <span>{selected.length>0 ? selected.map(s=>s.name).join(",") : options[0].name}</span>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {options.slice(1).map(option => (
                            <Listbox.Option
                                key={option.id}
                                value={option}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                }`}
                                        >
                                            {option.name}
                                        </span>
                                        {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                                                <CheckIcon className="h-4 w-4 text-purple-600" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>


        </div>
    )
}