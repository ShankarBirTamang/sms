import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface TimeTableInterface {
  name: string;
  is_active?: boolean;
}

export interface TimetableFormValues {
  name: string;
  no_of_periods: number;
  periods: {
    id: number;
    period_name: string;
    period_days: {
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
  "Saturday",
];

export const timeTableSchema = z.object({
  name: z.string().min(1, "Timetable name is required"),
  no_of_periods: z.number().min(1, "At least one period is required"),
  periods: z.array(
    z.object({
      id: z.number(),
      period_name: z.string().min(2, "Period name is required"),
      period_days: z.record(
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

export default apiRoute("/schedule/time-tables");
