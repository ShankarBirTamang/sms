import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface AdmitCardInterface {
  name: string;
  html: string;
  background: string;
  size: string; //value of select page size can be id which is string or number
  cards_per_page: number | string; //value of select no of admit card can be id which is string or number
  signers: { title?: string; signature_id?: string | number }[]; //value of select signature id can be id which is string or number
}

export interface GetAdmitCardInterface {
  id: number;
  name: string;
  html: string;
  size: string; //value of select page size can be id which is string or number
  cards_per_page: number | string; //value of select no of admit card can be id which is string or number
  background: string;
  signers: { id: number; title?: string; name?: string; signature?: string }[];
}

export interface UpdateAdmitCardInterface extends AdmitCardInterface {
  id: number;
}

export const admitCardSchema = z.object({
  name: z
    .string()
    .min(3, "Admit Card Name is required and must be minimum of 3 characters!"),
  size: z.string().min(1, "Page Size is required!"),
  cards_per_page: z.union([
    z.string().min(1, "No. of Admit Card/Page is required!"),
    z.number().min(1, "No. of Admit Card/Page is required!"),
  ]),
  background: z.string().min(1, "Background is required!"),
  html: z.string().min(1, "Html is required!"),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

export default apiRoute("/design-services/admit-cards");
