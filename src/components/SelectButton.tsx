import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

export interface Option {
    id: number;
    name: string;
}

interface SelectButtonProps {
    label: string;
    selected: Option | null;
    setSelected: (option: Option | null) => void;
    options: Option[];
}

const SelectButton: React.FC<SelectButtonProps> = ({ label, selected, setSelected, options }) => {
    return (
        <div className="flex flex-col relative w-full">
            <label className="font-semibold mb-2 text-gray-700 text-sm">{label}</label>
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                    {/* Button */}
                    <Listbox.Button
                        className="w-full flex justify-between items-center px-4 py-2.5 
                       border border-gray-300 rounded-xl shadow-sm bg-white 
                       text-gray-700 text-sm font-medium 
                       hover:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:outline-none
                       transition-all"
                    >
                        <span>{selected?.name || "Hamısı"}</span>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </Listbox.Button>

                    {/* Dropdown */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute z-10 mt-2 w-full bg-white border border-gray-200 
                         rounded-xl shadow-lg focus:outline-none max-h-64 overflow-auto"
                        >
                            {/* Static "All" option */}
                            <Listbox.Option
                                key={0}
                                value={null}
                                className={({ active }) =>
                                    `cursor-pointer select-none py-2 px-4 text-sm rounded-lg
                  ${active ? "bg-purple-100 text-purple-900" : "text-gray-700"}`
                                }
                            >
                                {({ selected: isSelected }) => (
                                    <div className="flex items-center justify-between">
                                        <span>Hamısı</span>
                                        {isSelected && <CheckIcon className="h-4 w-4 text-purple-600" />}
                                    </div>
                                )}
                            </Listbox.Option>

                            {/* Dynamic options */}
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.id}
                                    value={option}
                                    className={({ active, selected: isSelected }) =>
                                        `cursor-pointer select-none py-2 px-4 text-sm rounded-lg
                    ${active ? "bg-purple-100 text-purple-900" : "text-gray-700"} 
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

// interface MultiSelectDropdownProps {
//     label: string
//     options: Option[]
//     selected: Option[]
//     setSelected: (options: Option[]) => void
// }

// export function MultiSelectButton({ label, selected, setSelected, options, }: MultiSelectDropdownProps) {


//     return (
//         <div className="flex flex-col relative w-full">
//             <label className="font-semibold mb-2 text-gray-700 text-sm">{label}</label>
//             <Listbox multiple value={selected} onChange={setSelected}>
//                 <div className="relative">
//                     <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none">
//                         {selected.length > 0
//                             ? selected.map(s => s.name).join(", ")
//                             : "Select options"}
//                     </Listbox.Button>

//                     <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
//                         {options.map(option => (
//                             <Listbox.Option
//                                 key={option.id}
//                                 value={option}
//                                 className={({ active }) =>
//                                     `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-purple-100 text-purple-900" : "text-gray-900"
//                                     }`
//                                 }
//                             >
//                                 {({ selected }) => (
//                                     <>
//                                         <span
//                                             className={`block truncate ${selected ? "font-medium" : "font-normal"
//                                                 }`}
//                                         >
//                                             {option.name}
//                                         </span>
//                                         {selected && (
//                                             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
//                                                 <CheckIcon className="h-4 w-4 text-purple-600" />
//                                             </span>
//                                         )}
//                                     </>
//                                 )}
//                             </Listbox.Option>
//                         ))}
//                     </Listbox.Options>
//                 </div>
//             </Listbox>


//         </div>
//     )
// }