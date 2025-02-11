import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface SignatureInterface {
  title?: string;
  signature_id?: number | string;
}

export interface GetSignatureInterface {
  id: number;
  title?: string;
  name?: string;
  signature?: string;
}

export interface PaperSizeInterface {
  height: number;
  width: number;
}

export interface CertificateInterface {
  name: string;
  html: string;
  size: string;
  height: number;
  width: number;
  background?: string;
  orientation: string;
  signers: SignatureInterface[];
}
export interface UpdateCertificateInterface extends CertificateInterface {
  id: number;
}
export interface GetCertificateInterface {
  id: number;
  name: string;
  html: string;
  size: string;
  height: number;
  width: number;
  orientation: string;
  background?: string;
  signers: GetSignatureInterface[];
}

interface Sizes {
  [key: string]: PaperSizeInterface;
}

export const sizes: Sizes = {
  A3: { height: 420, width: 297 },
  A4: { height: 297, width: 210 },
  A5: { height: 210, width: 148 },
  A6: { height: 148, width: 105 },
  A7: { height: 105, width: 74 },
  A8: { height: 74, width: 52 },
  A9: { height: 52, width: 37 },
  A10: { height: 37, width: 26 },
  IDCard: { height: 86, width: 54 },
  S4X6: { height: 152, width: 102 },
  S5X7: { height: 178, width: 127 },
  S8X10: { height: 254, width: 203 },
  Executive: { height: 267, width: 184 },
  Legal: { height: 356, width: 216 },
  Letter: { height: 279, width: 216 },
  Tabloid: { height: 432, width: 279 },
};

// Main schema
export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate Name is Required"),
  size: z.string().min(1, "Paper Size is Required"),
  height: z.number().positive("Height must be a positive number"),
  width: z.number().positive("Width must be a positive number"),
  background: z.string().min(1, "Background is required"), // Use the updated schema
  html: z.string().min(1, "Code is required"),
  orientation: z.string().min(1, "Orientation is required"),
  signers: z.array(
    z.object({
      title: z.string().optional(),
      signature_id: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

// Type for the form data
// export type CertificateInterface = z.infer<typeof certificateSchema>;

export default apiRoute("design-services/certificates");
