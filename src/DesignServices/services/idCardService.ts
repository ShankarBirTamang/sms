import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  title?: string;
  signature_id?: number | string;
}
export interface IdCardInterface {
  name: string;
  html: string;
  id_card_type_id: string | number;
  background: string;
  color: string;
  signers: SignatureInterface[];
}

export interface GetSignatureInterface {
  id: number;
  title?: string;
  name?: string;
  signature?: string;
}

export interface GetIdCardInterface {
  id: number;
  name: string;
  html: string;
  id_card_type: {
    id: number;
    name: string;
  };
  background: string;
  color: string;
  signers: GetSignatureInterface[];
}

export interface UpdateIdCardInterface extends IdCardInterface {
  id: number;
}

export const IdCardSchema = z.object({
  name: z.string().min(1, "Id Card name is required!"),
  html: z.string().min(1, "Html code is required!"),
  background: z.string().min(1, "Background is required"),
  id_card_type_id: z.union([
    z.string().min(1, "Id Card Type is required"),
    z.number().min(1, "Id Card Type is required"),
  ]),
  color: z.string(),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

export interface IdCardTypeInterface {
  id: number;
  name: string;
}

export default apiRoute("design-services/id-cards");
