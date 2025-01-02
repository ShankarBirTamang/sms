import React, { useState } from "react";
import {
  daysOfWeek,
  TimetableFormValues,
} from "../../../services/timeTableServic";
import TimeTableForm from "./TimeTableForm";
import useTimeTable from "../../../hooks/useTimeTable";

const AddTimeTableForm = () => {
  const { saveTimeTable, isLoadingSave } = useTimeTable({});
  const [defaultValues, setDefaultValues] = useState<TimetableFormValues>({
    id: 1, // Root ID for the timetable
    name: "",
    no_of_periods: 1,
    periods: [
      {
        id: 1, // Ensure the ID is set correctly for the first period
        period_name: "Period 1",
        days: daysOfWeek.reduce((acc, day, index) => {
          acc[day] = {
            id: index + 1, // Unique ID for each day
            day, // Include the day name
            start_time: "",
            end_time: "",
          };
          return acc;
        }, {} as TimetableFormValues["periods"][0]["days"]),
      },
    ],
  });

  const handleAddSubmit = async (data: TimetableFormValues) => {
    console.log("Submitted Data:", data);
    const result = await saveTimeTable(data);
    if (result) {
      // Optionally reset the form or update the state with new default values
      setDefaultValues(data);
      console.log("result", result);
    }
  };

  return (
    <div className="col-md-12">
      <TimeTableForm
        mode="add"
        isLoadingSaveOrUpdate={isLoadingSave}
        handleSubmittedForm={handleAddSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default AddTimeTableForm;
