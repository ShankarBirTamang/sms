import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  daysOfWeek,
  TimetableFormValues,
} from "../../../services/timeTableServic";

const TimeTableForm = () => {
  const [numberOfPeriods, setNumberOfPeriods] = useState(1);
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState<boolean[]>([]);
  const [localStartTimeValues, setLocalStartTimeValues] = useState<string[][]>(
    []
  );
  const [localEndTimeValues, setLocalEndTimeValues] = useState<string[][]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>();

  // Initialize state for new periods
  useEffect(() => {
    setSameTimeForAllDays((prev) => [
      ...prev,
      ...Array(numberOfPeriods - prev.length).fill(false),
    ]);
    setLocalStartTimeValues((prev) => [
      ...prev,
      ...Array(numberOfPeriods - prev.length).fill(
        Array(daysOfWeek.length).fill("")
      ),
    ]);
    setLocalEndTimeValues((prev) => [
      ...prev,
      ...Array(numberOfPeriods - prev.length).fill(
        Array(daysOfWeek.length).fill("")
      ),
    ]);
  }, [numberOfPeriods]);

  // Sync start and end time when checkbox is checked
  useEffect(() => {
    sameTimeForAllDays.forEach((isChecked, periodIndex) => {
      if (isChecked) {
        // Sync both start time and end time across all days for the specific period
        const syncedStartTime = localStartTimeValues[periodIndex]?.[0] || "";
        const syncedEndTime = localEndTimeValues[periodIndex]?.[0] || "";

        setLocalStartTimeValues((prev) => {
          const updated = [...prev];
          updated[periodIndex] = Array(daysOfWeek.length).fill(syncedStartTime);
          return updated;
        });

        setLocalEndTimeValues((prev) => {
          const updated = [...prev];
          updated[periodIndex] = Array(daysOfWeek.length).fill(syncedEndTime);
          return updated;
        });

        // Ensure the start time and end time in form are updated
        daysOfWeek.forEach((day, dayIndex) => {
          setValue(
            `periods.${periodIndex}.days.${day}.start_time`,
            syncedStartTime
          );
          setValue(
            `periods.${periodIndex}.days.${day}.end_time`,
            syncedEndTime
          );
        });
      }
    });
  }, [sameTimeForAllDays, localStartTimeValues, localEndTimeValues, setValue]);

  const handleNumberOfPeriodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
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
      setLocalStartTimeValues((prev) => {
        const updated = [...prev];
        updated[periodIndex][dayIndex] = value;
        return updated;
      });
    } else {
      setLocalEndTimeValues((prev) => {
        const updated = [...prev];
        updated[periodIndex][dayIndex] = value;
        return updated;
      });
    }

    const fieldName = `periods.${periodIndex}.days.${daysOfWeek[dayIndex]}.${action}_time`;
    setValue(fieldName as keyof TimetableFormValues, value);
  };

  const handleCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    periodIndex: number
  ) => {
    const isChecked = e.target.checked;
    setSameTimeForAllDays((prev) => {
      const updated = [...prev];
      updated[periodIndex] = isChecked;
      return updated;
    });
  };

  const handleClearInput = (fieldPath: string) => {
    const match = fieldPath.match(
      /periods\.(\d+)\.days\.(\w+)\.(start_time|end_time)/
    );
    if (match) {
      const [, periodIndex, day, action] = match;
      const periodIdx = parseInt(periodIndex, 10);
      const dayIndex = daysOfWeek.indexOf(day);

      if (dayIndex !== -1) {
        if (action === "start_time") {
          setLocalStartTimeValues((prev) => {
            const updated = [...prev];
            updated[periodIdx][dayIndex] = "";
            return updated;
          });
        } else if (action === "end_time") {
          setLocalEndTimeValues((prev) => {
            const updated = [...prev];
            updated[periodIdx][dayIndex] = "";
            return updated;
          });
        }

        setValue(fieldPath as keyof TimetableFormValues, "");
      }
    }
  };

  const handleFormSubmit = (data: TimetableFormValues) => {
    console.log("Form submitted with data:", data);
    toast.success("Form successfully submitted!");
  };

  return (
    <div className="col-md-12">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Time Table Name */}
        <div className="card px-12 py-8 my-6">
          <div className="card-title w-100">
            <h1>Time Table</h1>
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

        {/* Periods Table */}
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
                  {daysOfWeek.map((day, index) => (
                    <th key={index}>{day}</th>
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
                              value={
                                localStartTimeValues[periodIndex]?.[dayIndex] ||
                                ""
                              }
                              className="form-control form-control-solid"
                              {...register(
                                `periods.${periodIndex}.days.${day}.start_time`
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
                              value={
                                localEndTimeValues[periodIndex]?.[dayIndex] ||
                                ""
                              }
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
              onClick={() => reset()}
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
