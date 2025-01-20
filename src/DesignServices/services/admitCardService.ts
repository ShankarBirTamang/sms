import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  title?: string;
  signature_id?: string;
}

export interface GetSignatureInterface {
  title?: string;
  name?: string;
  id?: string;
  signature?: string;
}

export interface AdmitCardInterface {
  name: string;
  html: string;
  signers: SignatureInterface[];
}

export interface GetAdmitCardInterface {
  id: number;
  name: string;
  html: string;
  background: string;
  signers: GetSignatureInterface[];
}

export const admitCardSchema = z.object({
  name: z
    .string()
    .min(3, "Admit Card Name is required and must be minimum of 3 characters!"),
  html: z.string().optional(),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.string().optional(),
    })
  ),
});

export default apiRoute("/design-services/admit-cards");
