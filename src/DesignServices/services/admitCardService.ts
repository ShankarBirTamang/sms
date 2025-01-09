import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  signee?: string;
  title?: string;
}

export interface AdmitCardInterface {
  name: string;
  code: string;
  signatures: SignatureInterface[];
}

export const admitCardSchema = z.object({
  name: z.string().min(1, "Admit Card Name is required"),
  signers: z.object({
    signee: z.string(),
    signature: z.string(),
  }),
});

export default apiRoute("/employees");
