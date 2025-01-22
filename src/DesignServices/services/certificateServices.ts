import { z } from "zod";
import apiRoute from "../../services/httpService";

export interface PaperSizeInterface {
  height: number;
  width: number;
}

export interface CertificateInterface {
  name: string;
  paperSize: string;
  paperSizes: {
    [paperSize: string]: PaperSizeInterface;
  };
  backgroundImage: File | null;
  code: string;
  orientation: string;
}

interface PaperSizes {
  A3: PaperSizeInterface;
  A4: PaperSizeInterface;
  A5: PaperSizeInterface;
  A6: PaperSizeInterface;
  A7: PaperSizeInterface;
  A8: PaperSizeInterface;
  A9: PaperSizeInterface;
  A10: PaperSizeInterface;
  IDCard: PaperSizeInterface;
  S4X6: PaperSizeInterface;
  S5X7: PaperSizeInterface;
  S8X10: PaperSizeInterface;
  Executive: PaperSizeInterface;
  Legal: PaperSizeInterface;
  Letter: PaperSizeInterface;
  Tabloid: PaperSizeInterface;
}

export const paperSizes: PaperSizes = {
  A3: { height: 420, width: 297 },
  A4: { height: 297, width: 210 },
  A5: { height: 210, width: 148 },
  A6: { height: 148, width: 105 },
  A7: { height: 105, width: 74 },
  A8: { height: 74, width: 52 },
  A9: { height: 52, width: 37 },
  A10: { height: 37, width: 26 },
  IDCard: { height: 85.6, width: 53.98 },
  S4X6: { height: 152, width: 102 },
  S5X7: { height: 178, width: 127 },
  S8X10: { height: 254, width: 203 },
  Executive: { height: 267, width: 184 },
  Legal: { height: 356, width: 216 },
  Letter: { height: 279, width: 216 },
  Tabloid: { height: 432, width: 279 },
};

export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate Name is Required"),
  paperSize: z.string().min(1, "Paper Size is Required"),
  paperSizes: z.record(
    z.string(),
    z.object({
      height: z.number().positive("Height must be a positive number"),
      width: z.number().positive("Width must be a positive number"),
    })
  ),
  backgroundImage: z.instanceof(File).nullable(), // Add validation for File | null
  code: z.string().min(1, "Code is required"),
  orientation: z.string().min(1, "Orientation is required"),
});

export default apiRoute("/employees");
