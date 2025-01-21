import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface AdmitCardInterface {
  name: string;
  html: string;
  signers: { title?: string; signature_id?: number }[];
}

export interface GetAdmitCardInterface {
  id: number;
  name: string;
  html: string;
  background: string;
  signers: { title?: string; name?: string; id?: number; signature?: number }[];
}

export interface UpdateAdmitCardInterface extends AdmitCardInterface {
  id: number;
}

export const admitCardSchema = z.object({
  name: z
    .string()
    .min(3, "Admit Card Name is required and must be minimum of 3 characters!"),
  html: z.string().optional(),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.number().optional(),
    })
  ),
});

export default apiRoute("/design-services/admit-cards");
