import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  name?: string;
  signature?: string;
}

export interface AdmitCardInterface {
  name: string;
  html: string;
  signers: SignatureInterface[];
}

export const admitCardSchema = z.object({
  name: z
    .string()
    .min(3, "Admit Card Name is required and must be minimum of 3 characters!"),
  html: z.string().optional(),
  signers: z.array(
    z.object({
      name: z.string().optional(),
      signature: z.string().optional(),
    })
  ),
});

export default apiRoute("/design-services/admit-cards");
