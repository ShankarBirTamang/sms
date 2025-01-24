import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  title?: string;
  signature_id?: number | string;
}
export interface IdCardInterface {
  name: string;
  html: string;
  id_card_type_id: string;
  background: FileList | File | null;
  // primaryColor: string;
  signers: SignatureInterface[];
}

export interface GetSignatureInterface {
  id: number;
  title?: string;
  name?: string;
  signature?: string;
}

export interface GetIdCardInterface {
  name: string;
  html: string;
  id_card_type: {
    name: string;
  };
  background: string;
  // primaryColor: string;
  signers: GetSignatureInterface[];
}

const backgroundSchema = z
  .instanceof(FileList) // Ensure it's a FileList
  .refine((files) => files.length > 0, "Background image is required") // Ensure at least one file is selected
  .refine(
    (files) => files[0].size <= 5 * 1024 * 1024, // 5MB limit
    "File size must be less than 5MB"
  )
  .refine(
    (files) => ["image/jpeg", "image/png", "image/jpg"].includes(files[0].type), // Allowed file types
    "Only .jpg, .jpeg, and .png files are allowed"
  );

export const IdCardSchema = z.object({
  name: z.string().min(1, "Id Card name is required!"),
  html: z.string().optional(),
  id_card_type_id: z.union([
    z.string().min(1, "Id Card Type is required"),
    z.number().min(1, "Id Card Type is required"),
  ]),
  // primaryColor: z.string(),
  background: backgroundSchema,
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.string().optional(),
    })
  ),
});

export interface IdCardTypeInterface {
  id: number;
  name: string;
}

export default apiRoute("/design-services/id-cards");
