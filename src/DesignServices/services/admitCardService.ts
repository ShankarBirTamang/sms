import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  signee?: string;
  signature?: string;
}

export interface AdmitCardInterface {
  name: string;
  code: string;
  signatures: SignatureInterface[];
}

export const admitCardSchema = z.object({
  name: z
    .string()
    .min(3, "Admit Card Name is required and must be minimum of 3 characters!"),
  code: z.string().optional(),
  signatures: z.array(
    z.object({
      signee: z.string().optional(),
      signature: z.string().optional(),
    })
  ),
});

export default apiRoute("/employees");
