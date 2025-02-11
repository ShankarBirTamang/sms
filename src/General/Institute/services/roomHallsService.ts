import { z } from "zod";
import apiRoute from "../../../services/httpService";

export interface RoomHallsForm {
  name: string;
  description?: string;
}

export interface UpdateRoomHallsForm extends RoomHallsForm {
  id: number;
}

export const schema = z.object({
  name: z.string().min(1, { message: "Room/Hall Name is required" }),
  description: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export default apiRoute("/general/institute/rooms");
