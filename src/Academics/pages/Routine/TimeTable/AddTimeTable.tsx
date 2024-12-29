import toast from "react-hot-toast";
import {
  daysOfWeek,
  TimetableFormValues,
} from "../../../services/timeTableServic";
import TimeTableForm from "./TimeTableForm";

const AddTimeTableForm = () => {
  const handleAddSubmit = (data: TimetableFormValues) => {
    toast.success("Time Table Added Successfully");
    console.log("Submitted Data:", data);
  };

  return (
    <div className="col-md-12">
      <TimeTableForm
        mode="add"
        handleSubmittedForm={handleAddSubmit}
        defaultValues={{
          id: 1, // Root ID for the timetable
          name: "",
          no_of_periods: 1,
          periods: [
            {
              id: 1, // Ensure the ID is set correctly for the first period
              period_name: "",
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
        }}
      />
    </div>
  );
};

export default AddTimeTableForm;
