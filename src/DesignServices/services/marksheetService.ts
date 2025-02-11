import { z } from "zod";
import apiRoute from "../../services/httpService";

interface SignatureInterface {
  signature_id?: number | string;
  title?: string;
}
export interface MarksheetInterface {
  name: string;
  html: string;
  background?: string;
  signers: SignatureInterface[];
}

export interface GetMarksheetInterface {
  id: number;
  name: string;
  html: string;
  background?: string;
  signers: { id: number; title?: string; name?: string; signature?: string }[];
}

export interface UpdateMarksheetInterface extends MarksheetInterface {
  id: number;
}

export const marksheetSchema = z.object({
  name: z
    .string()
    .min(3, "Marksheet name is required and must be minimum of 3 characters!"),
  background: z.string().min(1, "Background is required!"),
  html: z.string().min(1, "Html is required!"),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

export default apiRoute("/design-services/marksheets");
