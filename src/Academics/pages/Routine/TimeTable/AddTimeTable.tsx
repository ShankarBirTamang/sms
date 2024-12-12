import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import {
  daysOfWeek,
  TimetableFormValues,
  timeTableSchema,
} from "../../../services/timeTableServic";

const TimeTableForm = () => {
  const [numberOfPeriods, setNumberOfPeriods] = useState(1);
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState(false);
  const [startTimeValues, setStartTimeValues] = useState(
    Array(numberOfPeriods)
      .fill("")
      .map(() => Array(daysOfWeek.length).fill(""))
  );
  const [endTimeValues, setEndTimeValues] = useState(
    Array(numberOfPeriods)
      .fill("")
      .map(() => Array(daysOfWeek.length).fill(""))
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TimetableFormValues>({ resolver: zodResolver(timeTableSchema) });

  // Update start and end times when number of periods change
  useEffect(() => {
    setStartTimeValues(
      Array(numberOfPeriods)
        .fill("")
        .map(() => Array(daysOfWeek.length).fill(""))
    );
    setEndTimeValues(
      Array(numberOfPeriods)
        .fill("")
        .map(() => Array(daysOfWeek.length).fill(""))
    );
  }, [numberOfPeriods]);

  const handleNumberOfPeriodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfPeriods(Number(e.target.value));
    setValue("number_of_periods", Number(e.target.value));
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number,
    dayIndex: number,
    action: "start" | "end"
  ) => {
    const value = e.target.value;
    const fieldName =
      `periods.${periodIndex}.days.${dayIndex}.${action}_time` as keyof TimetableFormValues;
    setValue(fieldName, value); // Directly update form state
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameTimeForAllDays(isChecked);

    if (isChecked) {
      const firstStartField = startTimeValues[0][0];
      const firstEndField = endTimeValues[0][0];

      const syncedStartTime = Array(numberOfPeriods).fill(firstStartField);
      const syncedEndTime = Array(numberOfPeriods).fill(firstEndField);

      setStartTimeValues(syncedStartTime);
      setEndTimeValues(syncedEndTime);
    }
  };

  const handleClearInput = (field: string) => {
    // Type narrow the field
  };

  const handleDiscard = () => {
    // Logic to reset or clear the form
    toast("Form discarded!");
    // Optionally, reset the form state using reset() from react-hook-form
  };

  const handleFormSubmit = (data: TimetableFormValues) => {
    // Handle form submission logic
    console.log("Form submitted with data:", data);
    toast.success("Form successfully submitted!");
  };

  return (
    <div className="col-md-12">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="">
        <div className="card px-12 py-8 my-6">
          <div className="card-title w-100">
            <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
              <span>Time Table</span>
            </h1>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mb-7 col-md-8">
              <label htmlFor="timetable_name" className="required form-label">
                Time Table Name
              </label>
              <input
                id="timetable_name"
                {...register("timetable_name")}
                type="text"
                className="form-control form-control-solid"
                placeholder="Eg: Summer Season"
                required
              />
              {errors.timetable_name && (
                <span className="text-danger">
                  {errors.timetable_name.message}
                </span>
              )}
            </div>
            <div className="mb-7 col-md-3">
              <label
                htmlFor="number_of_periods"
                className="required form-label"
              >
                Number of Periods
              </label>
              <input
                id="number_of_periods"
                {...register("number_of_periods")}
                type="number"
                className="form-control form-control-solid"
                min="1"
                value={numberOfPeriods}
                onChange={handleNumberOfPeriodsChange}
                required
              />
              {errors.number_of_periods && (
                <span className="text-danger">
                  {errors.number_of_periods.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card px-12 py-8 my-6">
          <div className="table-responsive mb-7">
            <div className="mb-7">
              <h1>Academic Time Table Details</h1>
              <h2 className="text-danger">
                Note: Leave the values Blank if there are no periods for that
                day.
              </h2>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr
                  className="fw-bold border border-2"
                  style={{ backgroundColor: "rgba(0, 0, 255, 0.2)" }}
                >
                  <th className="mx-auto">Period\Day</th>
                  {daysOfWeek.map((days, index) => (
                    <th key={index}>{days}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(numberOfPeriods)].map((_, periodIndex) => (
                  <tr key={periodIndex}>
                    <td>
                      <p className="required">Period Name</p>
                      <input
                        type="text"
                        {...register(`periods.${periodIndex}.period_name`)}
                        value={`Period ${periodIndex + 1}`}
                        className="form-control form-control-solid"
                        required
                      />
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input
                          type="checkbox"
                          className="form-check-input w-30px h-20px"
                          id="timeTable_periods_0_all_same"
                          checked={sameTimeForAllDays}
                          onChange={handleCheckBoxChange}
                        />
                        <span className="form-check-label fs-6">
                          Assign same time to all days
                        </span>
                      </label>
                    </td>
                    {daysOfWeek.map((day, dayIndex) => (
                      <td key={dayIndex}>
                        <div className="mb-3">
                          <label className="form-label required">
                            Start Time
                          </label>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "4px" }}
                          >
                            <input
                              type="time"
                              className="form-control form-control-solid"
                              {...register(
                                `periods.${periodIndex}.days.${dayIndex}.start_time`
                              )}
                              value={startTimeValues[periodIndex][dayIndex]}
                              onChange={(e) =>
                                handleTimeChange(
                                  e,
                                  periodIndex,
                                  dayIndex,
                                  "start"
                                )
                              }
                              disabled={sameTimeForAllDays}
                            />
                            <button
                              type="button"
                              className="btn btn-light-danger btn-sm btn-icon"
                              onClick={() =>
                                handleClearInput(
                                  `periods.${periodIndex}.days.${dayIndex}.start_time`
                                )
                              }
                            >
                              &#x2716;
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label required">
                            End Time
                          </label>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "4px" }}
                          >
                            <input
                              type="time"
                              className="form-control form-control-solid"
                              {...register(
                                `periods.${periodIndex}.days.${dayIndex}.end_time`
                              )}
                              value={endTimeValues[periodIndex][dayIndex]}
                              onChange={(e) =>
                                handleTimeChange(
                                  e,
                                  periodIndex,
                                  dayIndex,
                                  "end"
                                )
                              }
                              disabled={sameTimeForAllDays}
                            />
                            <button
                              type="button"
                              className="btn btn-light-danger btn-sm btn-icon"
                              onClick={() =>
                                handleClearInput(
                                  `periods.${periodIndex}.days.${dayIndex}.end_time`
                                )
                              }
                            >
                              &#x2716;
                            </button>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center gap-8">
            <button
              type="button"
              className="btn btn-light"
              onClick={handleDiscard}
            >
              Discard
            </button>

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TimeTableForm;
