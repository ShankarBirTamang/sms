import { useParams } from "react-router-dom";
import TimeTableForm from "./TimeTableForm";
import useTimeTable from "../../../hooks/useTimeTable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TimetableFormValues } from "../../../services/timeTableServic";

const EditTimeTable = () => {
  const { timeTableId } = useParams();
  const { getOneTimeTable, timeTable } = useTimeTable({});

  useEffect(() => {
    if (timeTableId) {
      getOneTimeTable(Number(timeTableId));
    }
  }, [timeTableId]);

  const handleEditSubmit = (data: TimetableFormValues) => {
    toast.success("Time Table Edited Successfully");
    console.log("Submitted Updated Data:", data);
  };

  return (
    <div className="col-md-12">
      {timeTable && (
        <TimeTableForm
          handleSubmittedForm={handleEditSubmit}
          mode="edit"
          defaultValues={{
            name: timeTable.name,
            no_of_periods: timeTable.no_of_periods,
            periods: timeTable.periods.map((period: any) => ({
              ...period,
              period_days: Object.keys(period.period_days).reduce(
                (acc: any, day: string) => {
                  acc[day] = {
                    start_time: period.period_days[day].start_time,
                    end_time: period.period_days[day].end_time,
                  };
                  return acc;
                },
                {}
              ),
            })),
          }}
        />
      )}
    </div>
  );
};

export default EditTimeTable;
