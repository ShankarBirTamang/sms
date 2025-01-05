// CustomSelect.tsx
import Select from "react-select";

export interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (selectedOption: Option | null) => void;
  placeholder?: string;
  error?: string;
  isClearable?: boolean;
  className?: string;
  defaultValue?: Option | null;
  renderKey?: string;
}

const CustomSelect = ({
  options,
  onChange,
  placeholder = "Select...",
  error,
  isClearable = true,
  className,
  defaultValue,
  renderKey,
}: CustomSelectProps) => {
  return (
    <div className={`custom-select ${className}`}>
      <Select
        key={renderKey}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={isClearable}
        defaultValue={defaultValue}
      />
      {error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default CustomSelect;
