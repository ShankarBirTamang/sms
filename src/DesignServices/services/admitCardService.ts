import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface AdmitCard {
  name: string;
  signers?: {
    signee: string;
    signature: string;
  }[];
}

export const admitCardSchema = z.object({
  name: z.string().min(1, "Admit Card Name is required"),
  signers: z.object({
    signee: z.string(),
  }),
});

export default apiRoute("/designs/admit-card");
