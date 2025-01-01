import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import TimeTableForm from "./TimeTableForm";
import useTimeTable from "../../../hooks/useTimeTable";
import { TimetableFormValues } from "../../../services/timeTableServic";

const EditTimeTable = () => {
  const { timeTableId } = useParams<{ timeTableId: string }>();
  const { getOneTimeTable, timeTable, updateTimeTable, isLoadingUpdate } =
    useTimeTable({});
  const [defaultValues, setDefaultValues] =
    useState<TimetableFormValues | null>(null);

  useEffect(() => {
    if (timeTableId) {
      getOneTimeTable(Number(timeTableId));
    }
  }, [timeTableId]);

  useEffect(() => {
    if (timeTable) {
      setDefaultValues({
        id: timeTable.id,
        name: timeTable.name,
        no_of_periods: timeTable.no_of_periods,
        periods: timeTable.periods.map((period: any) => ({
          ...period,
          days: Object.keys(period.days).reduce((acc: any, day: string) => {
            acc[day] = {
              id: period.days[day].id,
              day: period.days[day].day,
              start_time: period.days[day].start_time,
              end_time: period.days[day].end_time,
            };
            return acc;
          }, {}),
        })),
      });
    }
  }, [timeTable]);

  const handleEditSubmit = async (data: TimetableFormValues) => {
    console.log("Submitted Updated Data:", data);
    // await updateTimeTable(data);
    setDefaultValues(data); // Update the state with new default values
  };

  return (
    <div className="col-md-12">
      {defaultValues && (
        <TimeTableForm
          handleSubmittedForm={handleEditSubmit}
          mode="edit"
          defaultValues={defaultValues}
          isLoadingSaveOrUpdate={isLoadingUpdate}
        />
      )}
    </div>
  );
};

export default EditTimeTable;
