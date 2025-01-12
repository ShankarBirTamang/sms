import React, { useState, useEffect } from "react";
import { formatMoneyToNepali } from "../../helpers/formatMoney";

interface NepaliCurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const NepaliCurrencyInput: React.FC<NepaliCurrencyInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [rawValue, setRawValue] = useState<number>(value || 0);
  const [displayValue, setDisplayValue] = useState<string>(
    formatMoneyToNepali(value || 0)
  );

  // Update internal state when the `value` prop changes
  useEffect(() => {
    setRawValue(value || 0);
    setDisplayValue(formatMoneyToNepali(value || 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Extract numeric value from the input (remove non-numeric characters)
    const numericValue = parseFloat(inputValue.replace(/[^0-9.]/g, "")) || 0;
    setRawValue(numericValue); // Update raw value
    setDisplayValue(inputValue); // Allow raw input while typing
    onChange(numericValue); // Notify parent of the change
  };

  const handleBlur = () => {
    // Format the display value when the input loses focus
    setDisplayValue(formatMoneyToNepali(rawValue));
  };

  return (
    <div className="input-group">
      <span className="input-group-text">रु</span>
      <input
        type="text"
        className="form-control"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </div>
  );
};

export default NepaliCurrencyInput;
