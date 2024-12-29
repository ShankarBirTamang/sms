import toast from "react-hot-toast";
import {
  daysOfWeek,
  TimetableFormValues,
} from "../../../services/timeTableServic";
import TimeTableForm from "./TimeTableForm";

const AddTimeTableForm = () => {
  const handleAddSubmit = (data: TimetableFormValues) => {
    toast.success('Time Table Added Successfully');
    console.log("Submitted Data:", data);
  };


  return (
    <div className="col-md-12">
      <TimeTableForm
        mode="add"
        handleSubmittedForm={handleAddSubmit}
        
        defaultValues={{
          name: "",
          no_of_periods: 1,
          periods: [
            {
              id: 0,
              period_name: "",
              period_days: daysOfWeek.reduce((acc, day) => {
                acc[day] = { start_time: "", end_time: "" };
                return acc;
              }, {} as TimetableFormValues["periods"][0]["period_days"]),
            },
          ],
        }}
      />
    </div>
  );
};

export default AddTimeTableForm;
