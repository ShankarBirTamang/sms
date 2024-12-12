import { z } from "zod";

export interface TimeTableInterface {
  name: string;
  is_active?: boolean;
}

export interface UpdateTimeTableInterface extends TimeTableInterface {
  id: number;
}

export interface TimetableFormValues {
  timetable_name: string;
  number_of_periods: number;
  sameTimeForAllDays: boolean;
  periods: {
    period_name: string;
    days: {
      [day: string]: {
        start_time: string;
        end_time: string;
      };
    };
  }[];
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const timeTableSchema = z.object({
  timetable_name: z.string().min(1, "Timetable name is required"),
  number_of_periods: z.number().min(1, "At least one period is required"),
  sameTimeForAllDays: z.boolean(),
  periods: z.array(
    z.object({
      period_name: z.string(),
      days: z.record(
        z.object({
          start_time: z.string(),
          // .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format"),
          end_time: z.string(),
          // .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format"),
        })
      ),
    })
  ),
});
