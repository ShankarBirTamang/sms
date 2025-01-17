import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  signee?: string;
  signature?: string;
}

export interface IdCardInterface {
  name: string;
  code: string;
  cardHolder: string;
  cardType: string;
  backgroundImage: FileList | null;
  primaryColor: string;
  signatures: SignatureInterface[];
}

export const IdCardSchema = z.object({
  name: z.string().min(1, "Id Card name is required!"),
  code: z.string().optional(),
  cardHolder: z.string().min(1, "Cardholder is required!"),
  cardType: z.string().min(1, "Card Type is required!"),
  primaryColor: z.string(),
  backgroundImage: z.instanceof(FileList),
  signatures: z.array(
    z.object({
      signee: z.string().optional(),
      signature: z.string().optional(),
    })
  ),
});

export default apiRoute("/employees");
