import React, { useState } from "react";
import { formatMoneyToNepali2 } from "../../helpers/formatMoney";

const CurrencyInput: React.FC = () => {
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9.]/g, "");

    if (input.length === 0) {
      setAmount("");
      return;
    }

    const parts = input.split(".");
    const dollars = parts[0];
    const cents = parts[1] || "";

    const formattedDollars = formatMoneyToNepali2(parseInt(dollars));
    const formattedValue = cents
      ? `${formattedDollars}.${cents.slice(0, 2)}`
      : input.endsWith(".")
      ? `${formattedDollars}.`
      : formattedDollars;

    setAmount(formattedValue);
  };

  return (
    <input
      type="text"
      value={amount ? "Rs" + amount : ""}
      onChange={handleAmountChange}
      placeholder="Enter amount"
      className="form-control text-end"
    />
  );
};

export default CurrencyInput;
