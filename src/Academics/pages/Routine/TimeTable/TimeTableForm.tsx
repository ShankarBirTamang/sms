import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import {
  daysOfWeek,
  TimetableFormValues,
  timeTableSchema,
} from "../../../services/timeTableServic";
import { zodResolver } from "@hookform/resolvers/zod";

interface TimeTableFormProps {
  defaultValues: TimetableFormValues;
  mode: "add" | "edit";
  handleSubmittedForm: (data: TimetableFormValues) => void;
  isLoadingSaveOrUpdate?: boolean;
}

const TimeTableForm = ({
  defaultValues,
  mode,
  handleSubmittedForm,
  isLoadingSaveOrUpdate,
}: TimeTableFormProps) => {
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
    getValues,
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>({
    defaultValues,
    resolver: zodResolver(timeTableSchema),
  });

  // Initialize state for new periods
  console.log("defaultValues:", defaultValues);
  useEffect(() => {
    if (defaultValues) {
      setNumberOfPeriods(defaultValues.no_of_periods || 1);

      setLocalStartTimeValues(
        defaultValues.periods.map((period) =>
          daysOfWeek.map((day) => period.days[day]?.start_time || "")
        )
      );

      setLocalEndTimeValues(
        defaultValues.periods.map((period) =>
          daysOfWeek.map((day) => period.days[day]?.end_time || "")
        )
      );

      setSameTimeForAllDays(defaultValues.periods.map(() => false)); // Reset checkboxes
    }
  }, [defaultValues]);

  // Sync React Hook Form with local state when localStartTimeValues or localEndTimeValues change
  useEffect(() => {
    localStartTimeValues.forEach((periodStartTimes, periodIndex) => {
      daysOfWeek.forEach((day, dayIndex) => {
        setValue(
          `periods.${periodIndex}.days.${day}.start_time`,
          periodStartTimes[dayIndex] as unknown as never
        );
      });
    });

    localEndTimeValues.forEach((periodEndTimes, periodIndex) => {
      daysOfWeek.forEach((day, dayIndex) => {
        setValue(
          `periods.${periodIndex}.days.${day}.end_time`,
          periodEndTimes[dayIndex] as unknown as never
        );
      });
    });
  }, [localStartTimeValues, localEndTimeValues, setValue]);

  useEffect(() => {
    setSameTimeForAllDays(
      (prev) =>
        prev.length < numberOfPeriods
          ? [...prev, ...Array(numberOfPeriods - prev.length).fill(false)]
          : prev.slice(0, numberOfPeriods) // Truncate if reducing
    );

    setLocalStartTimeValues(
      (prev) =>
        prev.length < numberOfPeriods
          ? [
              ...prev,
              ...Array(numberOfPeriods - prev.length).fill(
                Array(daysOfWeek.length).fill("")
              ),
            ]
          : prev.slice(0, numberOfPeriods) // Truncate if reducing
    );

    setLocalEndTimeValues(
      (prev) =>
        prev.length < numberOfPeriods
          ? [
              ...prev,
              ...Array(numberOfPeriods - prev.length).fill(
                Array(daysOfWeek.length).fill("")
              ),
            ]
          : prev.slice(0, numberOfPeriods) // Truncate if reducing
    );
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
        daysOfWeek.forEach((day) => {
          setValue(
            `periods.${periodIndex}.days.${day}.start_time`,
            syncedStartTime as unknown as never
          );
          setValue(
            `periods.${periodIndex}.days.${day}.end_time`,
            syncedEndTime as unknown as never
          );
        });
      }
    });
  }, [sameTimeForAllDays, setValue]);
  //[sameTimeForAllDays, localStartTimeValues, localEndTimeValues, setValue]

  const handleNumberOfPeriodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNumberOfPeriods = Number(e.target.value);

    if (newNumberOfPeriods > 0) {
      setNumberOfPeriods(newNumberOfPeriods);

      const currentPeriods = getValues("periods") || [];
      const updatedPeriods = [...currentPeriods];

      if (newNumberOfPeriods > currentPeriods.length) {
        // Add new periods
        for (let i = currentPeriods.length; i < newNumberOfPeriods; i++) {
          updatedPeriods.push({
            id: i + 1, // Root 'id' for the period
            period_name: "",
            days: daysOfWeek.reduce((acc, day, index) => {
              acc[day] = {
                id: index + 1, // Unique 'id' for the day
                day, // Include the 'day' name
                start_time: "",
                end_time: "",
              };
              return acc;
            }, {} as Record<string, { id: number; day: string; start_time: string; end_time: string }>),
          });
        }
      } else if (newNumberOfPeriods < currentPeriods.length) {
        // Remove extra periods
        updatedPeriods.splice(newNumberOfPeriods);
      }

      // Ensure all periods have correct IDs and structure
      const normalizedPeriods = updatedPeriods.map((period, periodIndex) => ({
        ...period,
        id: periodIndex + 1, // Reassign correct period IDs
        days: daysOfWeek.reduce((acc, day, index) => {
          acc[day] = {
            id: index + 1, // Ensure unique 'id' for each day
            day, // Day name
            start_time: period.days?.[day]?.start_time || "",
            end_time: period.days?.[day]?.end_time || "",
          };
          return acc;
        }, {} as Record<string, { id: number; day: string; start_time: string; end_time: string }>),
      }));

      setValue("periods", normalizedPeriods); // Update the form state
    }
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

  const handleFormSubmit = (
    data: TimetableFormValues
    // event: React.FormEvent
  ) => {
    // event.preventDefault();
    handleSubmittedForm(data);
  };

  const handleDiscard = () => {
    reset({
      id: 1, // Root ID for the timetable
      name: "",
      no_of_periods: 1,
      periods: [
        {
          id: 1, // Ensure the ID is set correctly for the period
          period_name: "",
          days: daysOfWeek.reduce((acc, day, index) => {
            acc[day] = {
              id: index + 1, // Unique ID for each day
              day, // Include the day name
              start_time: "",
              end_time: "",
            };
            return acc;
          }, {} as Record<string, { id: number; day: string; start_time: string; end_time: string }>),
        },
      ],
    });

    setNumberOfPeriods(1);
    setSameTimeForAllDays([false]); // Reset to a single period
    setLocalStartTimeValues([Array(daysOfWeek.length).fill("")]); // Reset to a single period
    setLocalEndTimeValues([Array(daysOfWeek.length).fill("")]); // Reset to a single period
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Time Table Name */}
      <div className="card px-12 py-8 my-6">
        <div className="card-title w-100">
          <h1>Time Table</h1>
        </div>
        <div className="d-flex justify-content-between">
          <div className="mb-7 col-md-8">
            <label htmlFor="name" className="required form-label">
              Time Table Name
            </label>
            <input
              id="name"
              {...register("name")}
              type="text"
              className="form-control form-control-solid"
              placeholder="Eg: Summer Season"
              required
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
          </div>
          <div className="mb-7 col-md-3">
            <label htmlFor="no_of_periods" className="required form-label">
              Number of Periods
            </label>
            <input
              id="no_of_periods"
              {...register("no_of_periods", { valueAsNumber: true })}
              type="number"
              className="form-control form-control-solid"
              min="1"
              value={numberOfPeriods}
              onChange={handleNumberOfPeriodsChange}
              required
            />
            {errors.no_of_periods && (
              <span className="text-danger">
                {errors.no_of_periods.message}
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
              Note: Leave the values Blank if there are no periods for that day.
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
                    {errors.periods?.[periodIndex]?.period_name && (
                      <span className="text-danger">
                        {errors.periods[periodIndex].period_name.message}
                      </span>
                    )}
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
                        <label className="form-label required">End Time</label>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "4px" }}
                        >
                          <input
                            type="time"
                            value={
                              localEndTimeValues[periodIndex]?.[dayIndex] || ""
                            }
                            className="form-control form-control-solid"
                            {...register(
                              `periods.${periodIndex}.days.${day}.end_time`
                            )}
                            onChange={(e) =>
                              handleTimeChange(e, periodIndex, dayIndex, "end")
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
            onClick={handleDiscard}
          >
            Discard
          </button>

          <button type="submit" className="btn btn-primary">
            {isLoadingSaveOrUpdate
              ? "Saving..."
              : mode === "add"
              ? "Save"
              : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TimeTableForm;
