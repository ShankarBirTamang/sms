import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface TimeTableInterface {
  name: string;
  is_active?: boolean;
}

export interface TimetableFormValues {
  id: number; // Add this field for the root 'id'
  name: string;
  no_of_periods: number;
  periods: {
    id: number;
    period_name: string;
    days: {
      [day: string]: {
        id: number; // Include 'id' for each day
        day: string; // Include 'day' for each day
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
  id: z.number(), // Root 'id' for the timetable
  name: z.string().min(1, "Timetable name is required"),
  no_of_periods: z.number().min(1, "At least one period is required"),
  periods: z.array(
    z.object({
      id: z.number(), // Root 'id' for each period
      period_name: z.string().min(2, "Period name is required"),
      days: z.record(
        z.object({
          id: z.number(), // Unique 'id' for each day
          day: z.string().refine((day) => daysOfWeek.includes(day)), // Include 'day' for each day
          start_time: z.string(), // Add regex if needed for validation
          end_time: z.string(), // Add regex if needed for validation
        })
      ),
    })
  ),
});

export default apiRoute("/schedule/time-tables");
