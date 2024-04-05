interface Props {
  options: string[];
  placeholder: string;
  id: string;
  required?: boolean;
  className?: string;
}

export default function DropdownSelect(props: Props) {
  const required = props.required ? props.required : false;

  return (
    <div>
      <select id={props.id} className={`text-black ${props.className}`} required={required}>
        <option key={-1} value="" selected hidden>
          {props.placeholder}
        </option>
        {props.options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
