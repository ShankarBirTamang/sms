import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  daysOfWeek,
  TimetableFormValues,
} from "../../../services/timeTableServic";

const TimeTableForm = () => {
  const [numberOfPeriods, setNumberOfPeriods] = useState(1);
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState<boolean[]>([
    false,
  ]);
  const [startTimeValues, setStartTimeValues] = useState<string[][]>([
    Array(daysOfWeek.length).fill(""),
  ]);
  const [endTimeValues, setEndTimeValues] = useState<string[][]>([
    Array(daysOfWeek.length).fill(""),
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>();

  const initializePeriodTimes = (newNumber: number) => {
    setStartTimeValues((prev) => {
      const updated = [...prev];
      while (updated.length < newNumber) {
        updated.push(Array(daysOfWeek.length).fill(""));
      }
      return updated.slice(0, newNumber);
    });

    setEndTimeValues((prev) => {
      const updated = [...prev];
      while (updated.length < newNumber) {
        updated.push(Array(daysOfWeek.length).fill(""));
      }
      return updated.slice(0, newNumber);
    });

    setSameTimeForAllDays((prev) => {
      const updated = [...prev];
      while (updated.length < newNumber) {
        updated.push(false);
      }
      return updated.slice(0, newNumber);
    });
  };

  useEffect(() => {
    initializePeriodTimes(numberOfPeriods);
  }, [numberOfPeriods]);

  const handleNumberOfPeriodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(1, Number(e.target.value));
    setNumberOfPeriods(value);
    setValue("number_of_periods", value);
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number,
    dayIndex: number,
    action: "start" | "end"
  ) => {
    const value = e.target.value;

    if (action === "start") {
      setStartTimeValues((prev) => {
        const updated = [...prev];
        updated[periodIndex][dayIndex] = value;
        return updated;
      });
    } else {
      setEndTimeValues((prev) => {
        const updated = [...prev];
        updated[periodIndex][dayIndex] = value;
        return updated;
      });
    }

    if (sameTimeForAllDays[periodIndex]) {
      const syncedStartTime = startTimeValues[periodIndex][0] || value;
      const syncedEndTime = endTimeValues[periodIndex][0] || value;

      if (action === "start") {
        setStartTimeValues((prevStart) => {
          const updatedStart = [...prevStart];
          updatedStart[periodIndex] = Array(daysOfWeek.length).fill(
            syncedStartTime
          );
          return updatedStart;
        });
      }

      if (action === "end") {
        setEndTimeValues((prevEnd) => {
          const updatedEnd = [...prevEnd];
          updatedEnd[periodIndex] = Array(daysOfWeek.length).fill(
            syncedEndTime
          );
          return updatedEnd;
        });
      }

      daysOfWeek.forEach((_, dayIndex) => {
        if (action === "start") {
          setValue(
            `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.start_time`,
            syncedStartTime
          );
        } else {
          setValue(
            `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.end_time`,
            syncedEndTime
          );
        }
      });
    }

    const fieldName =
      `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.${action}_time` as keyof TimetableFormValues;
    setValue(fieldName, value);
  };
  //hh
  const handleCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number
  ) => {
    const isChecked = e.target.checked;

    // Always re-apply values if the checkbox is checked
    if (isChecked) {
      const syncedStartTime = startTimeValues[periodIndex][0] || "";
      const syncedEndTime = endTimeValues[periodIndex][0] || "";

      daysOfWeek.forEach((_, dayIndex) => {
        const startField = `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.start_time`;
        const endField = `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.end_time`;

        // Use setValue to update react-hook-form state
        setValue(startField, syncedStartTime);
        setValue(endField, syncedEndTime);
      });

      // Update local state for start and end times
      setStartTimeValues((prevStart) => {
        const updatedStart = [...prevStart];
        updatedStart[periodIndex] = Array(daysOfWeek.length).fill(
          syncedStartTime
        );
        return updatedStart;
      });

      setEndTimeValues((prevEnd) => {
        const updatedEnd = [...prevEnd];
        updatedEnd[periodIndex] = Array(daysOfWeek.length).fill(syncedEndTime);
        return updatedEnd;
      });
    }

    // Update the checkbox state
    setSameTimeForAllDays((prev) => {
      const updated = [...prev];
      updated[periodIndex] = isChecked;
      return updated;
    });
  };

  const handleClearInput = (field: string) => {
    setValue(field as keyof TimetableFormValues, "");
  };

  const handleDiscard = () => {
    reset();
    setNumberOfPeriods(1);
    setStartTimeValues([Array(daysOfWeek.length).fill("")]);
    setEndTimeValues([Array(daysOfWeek.length).fill("")]);
    setSameTimeForAllDays([false]);
    toast("Form discarded!");
  };

  const handleFormSubmit = (data: TimetableFormValues) => {
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
                                `periods.${periodIndex}.days.${day}.start_time as const`
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
                                `periods.${periodIndex}.days.${day}.end_time`
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

          <div className="row justify-content-end">
            <div className="col-md-4">
              <button type="submit" className="btn btn-success px-10 my-3">
                Submit
              </button>
            </div>
            <div className="col-md-4">
              <button
                type="button"
                className="btn btn-danger px-10 my-3"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TimeTableForm;
