import { useEffect, useState } from "react";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";

import "./DatePicker";

export interface DateInterface {
  bsDate: string;
  adDate: string;
}

interface DatePickerProps {
  onDateChange: (dates: DateInterface) => void;
  title?: string;
}

const DatePicker = ({ onDateChange, title = "Date" }: DatePickerProps) => {
  const [adDate, setAdDate] = useState<string>(""); // Ensure initial state is defined
  const [bsDate, setBsDate] = useState<string>("");
  const [renderKey, setRenderKey] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      ._2xcMq {
        width: 300px;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDate = ({ bsDate, adDate }: DateInterface) => {
    setAdDate(adDate);
    setBsDate(bsDate);
    onDateChange({ bsDate, adDate });
  };

  const handleEnglishDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const convertedBsDate = adToBs(value);
    setAdDate(value);
    setBsDate(convertedBsDate);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
    onDateChange({ bsDate: convertedBsDate, adDate: value });
  };

  return (
    <div className="row">
      <div className="col-6">
        <label className="required fw-bold fs-6 mb-2">{title} (BS)</label>
        <Calendar
          key={renderKey}
          className="form-control form-control-solid mb-3 mb-lg-0"
          language="en"
          onChange={handleDate}
          defaultDate={bsDate}
        />
      </div>
      <div className="col-6">
        <label className="required fw-bold fs-6 mb-2">{title} (AD)</label>
        <input
          title="english date"
          type="date"
          name="english-date"
          value={adDate}
          onChange={handleEnglishDateChange}
          className="form-control form-control-solid mb-3 mb-lg-0"
        />
      </div>
    </div>
  );
};

export default DatePicker;
