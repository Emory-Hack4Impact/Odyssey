interface Props {
    options: string[]
    placeholder: string
}

export default function DropdownSelect({ options, placeholder }: Props) {
    return (
        <div>
            <select className="text-black">
                <option key={-1} value="" selected hidden>{placeholder}</option>
                {options.map((option, index) => {
                    return <option key={index} value={option}>{option}</option>;
                })}
            </select>
        </div>
    );
}