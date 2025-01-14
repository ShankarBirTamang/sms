import { z } from "zod";
import apiRoute from "../../../services/httpService";

export interface RoomHallsForm {
  name: string;
  number: number;
  description?: string;
}

export interface UpdateRoomHallsForm extends RoomHallsForm {
  id: number;
}

export const schema = z.object({
  name: z.string().min(1, { message: "Room/Hall Name is required" }),
  number: z.number().min(1, { message: "Room/Hall Number is required" }),
  description: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export default apiRoute("/general/institute/rooms");
