import { useParams } from "react-router-dom";
import TimeTableForm from "./TimeTableForm";
import useTimeTable from "../../../hooks/useTimeTable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TimetableFormValues } from "../../../services/timeTableServic";

const EditTimeTable = () => {
  const { timeTableId } = useParams();
  const { getOneTimeTable, timeTable } = useTimeTable({});

  console.log("Time Table Edit:", timeTable);
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
            id: timeTable.id,
            name: timeTable.name,
            no_of_periods: timeTable.no_of_periods,
            periods: timeTable.periods.map((period: any) => ({
              ...period,
              days: Object.keys(period.period_days).reduce(
                (acc: any, day: string) => {
                  acc[day] = {
                    id: period.period_days[day].id,
                    day: period.period_days[day].day,
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
