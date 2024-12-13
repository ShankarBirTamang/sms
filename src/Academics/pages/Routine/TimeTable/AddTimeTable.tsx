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
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState<boolean[]>([]);
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
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>();

  useEffect(() => {
    const updatedStartTimeValues = Array(numberOfPeriods)
      .fill("")
      .map(() => Array(daysOfWeek.length).fill(""));
    setStartTimeValues(updatedStartTimeValues);

    const updatedEndTimeValues = Array(numberOfPeriods)
      .fill("")
      .map(() => Array(daysOfWeek.length).fill(""));
    setEndTimeValues(updatedEndTimeValues);

    setSameTimeForAllDays(Array(numberOfPeriods).fill(false));
  }, [numberOfPeriods]);

  useEffect(() => {
    sameTimeForAllDays.forEach((isChecked, periodIndex) => {
      if (isChecked) {
        const firstStartField = startTimeValues[periodIndex][0] || "";
        const firstEndField = endTimeValues[periodIndex][0] || "";

        const syncedStartTime = Array(daysOfWeek.length).fill(firstStartField);
        const syncedEndTime = Array(daysOfWeek.length).fill(firstEndField);

        // Update start time values only if they are different
        if (
          JSON.stringify(startTimeValues[periodIndex]) !==
          JSON.stringify(syncedStartTime)
        ) {
          const updatedStartTimeValues = [...startTimeValues];
          updatedStartTimeValues[periodIndex] = syncedStartTime;
          setStartTimeValues(updatedStartTimeValues);
        }

        // Update end time values only if they are different
        if (
          JSON.stringify(endTimeValues[periodIndex]) !==
          JSON.stringify(syncedEndTime)
        ) {
          const updatedEndTimeValues = [...endTimeValues];
          updatedEndTimeValues[periodIndex] = syncedEndTime;
          setEndTimeValues(updatedEndTimeValues);
        }

        // Update form values
        daysOfWeek.forEach((day, dayIndex) => {
          setValue(
            `periods.${periodIndex}.days.${day}.start_time`,
            syncedStartTime[dayIndex]
          );
          setValue(
            `periods.${periodIndex}.days.${day}.end_time`,
            syncedEndTime[dayIndex]
          );
        });
      }
    });
  }, [sameTimeForAllDays, startTimeValues, endTimeValues, setValue]);

  const handleNumberOfPeriodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    setNumberOfPeriods(value);
    setValue("number_of_periods", value);

    setSameTimeForAllDays((prev) => {
      if (value > prev.length) {
        return [...prev, ...Array(value - prev.length).fill(false)];
      } else {
        return prev.slice(0, value);
      }
    });

    // Update start and end time values to match the new number of periods
    setStartTimeValues((prev) => {
      const updatedStartTimeValues = Array(value)
        .fill("")
        .map((_, index) => prev[index] || Array(daysOfWeek.length).fill(""));
      return updatedStartTimeValues;
    });

    setEndTimeValues((prev) => {
      const updatedEndTimeValues = Array(value)
        .fill("")
        .map((_, index) => prev[index] || Array(daysOfWeek.length).fill(""));
      return updatedEndTimeValues;
    });
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number,
    dayIndex: number,
    action: "start" | "end"
  ) => {
    const value = e.target.value;

    if (action === "start") {
      const updatedStartTimeValues = [...startTimeValues];
      updatedStartTimeValues[periodIndex][dayIndex] = value;
      setStartTimeValues(updatedStartTimeValues);
    } else {
      const updatedEndTimeValues = [...endTimeValues];
      updatedEndTimeValues[periodIndex][dayIndex] = value;
      setEndTimeValues(updatedEndTimeValues);
    }

    const fieldName =
      `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.${action}_time` as keyof TimetableFormValues;
    setValue(fieldName, value);
  };

  const handleCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number
  ) => {
    const isChecked = e.target.checked;
    const updatedSameTimeForAllDays = [...sameTimeForAllDays];
    updatedSameTimeForAllDays[periodIndex] = isChecked;
    setSameTimeForAllDays(updatedSameTimeForAllDays);
  };

  const handleClearInput = (field: string) => {
    setValue(field as keyof TimetableFormValues, "");
  };

  const handleDiscard = () => {
    reset();
    setNumberOfPeriods(1);
    setStartTimeValues([]);
    setEndTimeValues([]);
    setSameTimeForAllDays([false]); // Reset to initial state
    toast("Form discarded!");
  };

  const handleFormSubmit = (data: TimetableFormValues) => {
    // if (!data.timetable_name) {
    //   toast.error("Please enter a timetable name!");
    //   return;
    // }
    console.log("Form submitted with data:", data);
    toast.success("Form successfully submitted!");
  };

  return (
    <div className="col-md-12">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                        placeholder={`Period ${periodIndex + 1}`}
                        className="form-control form-control-solid"
                        required
                      />
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input
                          type="checkbox"
                          className="form-check-input w-30px h-20px"
                          checked={sameTimeForAllDays[periodIndex]}
                          onChange={(e) => handleCheckBoxChange(e, periodIndex)}
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
                                `periods.${periodIndex}.days.${day}.start_time` as const
                              )}
                              onChange={(e) =>
                                handleTimeChange(
                                  e,
                                  periodIndex,
                                  dayIndex,
                                  "start"
                                )
                              }
                            />
                            <button
                              type="button"
                              className="btn btn-light-danger btn-sm btn-icon"
                              onClick={() =>
                                handleClearInput(
                                  `periods.${periodIndex}.days.${day}.start_time`
                                )
                              }
                            >
                              &#x2716;
                            </button>
                          </div>
                          {errors?.periods?.[periodIndex]?.days?.[day]
                            ?.start_time && (
                            <span className="text-danger">
                              {
                                errors?.periods?.[periodIndex]?.days?.[day]
                                  ?.start_time.message
                              }
                            </span>
                          )}
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
                                `periods.${periodIndex}.days.${day}.end_time` as const
                              )}
                              onChange={(e) =>
                                handleTimeChange(
                                  e,
                                  periodIndex,
                                  dayIndex,
                                  "end"
                                )
                              }
                            />
                            <button
                              type="button"
                              className="btn btn-light-danger btn-sm btn-icon"
                              onClick={() =>
                                handleClearInput(
                                  `periods.${periodIndex}.days.${day}.end_time`
                                )
                              }
                            >
                              &#x2716;
                            </button>
                          </div>
                          {errors?.periods?.[periodIndex]?.days?.[day]
                            ?.end_time && (
                            <span className="text-danger">
                              {
                                errors?.periods?.[periodIndex]?.days?.[day]
                                  ?.end_time.message
                              }
                            </span>
                          )}
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
