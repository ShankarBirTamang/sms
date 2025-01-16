import { useForm, FormProvider, Controller } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";

import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CertificateInterface,
  certificateSchema,
  paperSizes,
} from "../../services/certificateServices";
import { useEffect } from "react";

const AddCertificate = () => {
  const methods = useForm<CertificateInterface>({
    defaultValues: {
      name: "",
      paperSize: "A4",
      paperSizes: {
        A4: { height: 297, width: 210 },
      },
      backgroundImage: null,
      code: "",
      orientation: "portrait",
    },
    // resolver: zodResolver(certificateSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const selectedPaperSize = watch("paperSize"); //outputs A4, A5 etc

  //Height and Width to pass as the props to Code Editor to adjust it's size
  const iframeWidth =
    paperSizes[selectedPaperSize as keyof typeof paperSizes].width;
  const iframeHeight =
    paperSizes[selectedPaperSize as keyof typeof paperSizes].height;

  const orientation = watch("orientation");

  useEffect(() => {
    const { height, width } =
      paperSizes[selectedPaperSize as keyof typeof paperSizes];
    setValue("paperSizes", {
      [selectedPaperSize]: { height, width },
    });
    //Is equivalent to
    // setValue(`paperSizes.${selectedPaperSize}.height`, height);
    // setValue(`paperSizes.${selectedPaperSize}.width`, width);
  }, [selectedPaperSize, setValue]);

  const onSubmit = (data: CertificateInterface) => {
    console.log("Raw data to be submit", data);
    const formData = new FormData();
    for (const key in data) {
      if (key !== "backgroundImage") {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key as keyof CertificateInterface] as any);
        });
      } else {
        if (data.backgroundImage && data.backgroundImage[0]) {
          formData.append("backgroundImage", data.backgroundImage[0]);
        }
      }
    }

    //Logging
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };

  return (
    <FormProvider {...methods}>
      <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-header mb-6 d-flex">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-3 w-100">
                New Certificate Design
              </h1>
            </div>
            <div className="mb-4 col-md-6">
              <label htmlFor="name" className="required form-label">
                Certificate Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="string"
                    id="name"
                    placeholder="Eg: Employee, Primary Students, Bus Students, etc."
                    className="form-control form-control-solid"
                  ></input>
                )}
              />
              <span className="text-danger">{errors.name?.message}</span>
            </div>

            <div className="row col-md-6">
              <div className="col-md-3">
                <label htmlFor="name" className="required form-label">
                  Paper Size
                </label>
                <Controller
                  name="paperSize"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="paperSizes"
                      className="form-control form-control-solid"
                    >
                      {Object.entries(paperSizes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <span className="text-danger">{errors.paperSize?.message}</span>
              </div>
              <div className="mb-4 col-md-3">
                <label htmlFor="name" className="required form-label">
                  Height(mm)
                </label>
                <Controller
                  name={`paperSizes.${selectedPaperSize}.height`}
                  control={control}
                  render={({ field }) => (
                    <input
                      required
                      {...field}
                      disabled
                      type="number"
                      id="height"
                      placeholder="Height"
                      className="form-control form-control-solid"
                    ></input>
                  )}
                />
                <span className="text-danger">
                  {errors.paperSizes?.[selectedPaperSize]?.height?.message ??
                    ""}
                </span>
              </div>
              <div className="mb-4 col-md-3">
                <label htmlFor="name" className="required form-label">
                  Width(mm)
                </label>
                <Controller
                  name={`paperSizes.${selectedPaperSize}.width`}
                  control={control}
                  render={({ field }) => (
                    <input
                      required
                      disabled
                      {...field}
                      type="number"
                      id="width"
                      placeholder="Width"
                      className="form-control form-control-solid"
                    ></input>
                  )}
                />
                <span className="text-danger">
                  {errors.paperSizes?.[selectedPaperSize]?.width?.message ?? ""}
                </span>
              </div>
              <div className="mb-4 col-md-3">
                <label htmlFor="name" className="required form-label">
                  Orientation
                </label>
                <Controller
                  name="orientation"
                  render={({ field }) => (
                    <select
                      {...field}
                      id="landscape"
                      className="form-control form-control-solid"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="card-body pt-0">
            <div>
              <div
                className="align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                id="table_sessions"
                aria-describedby="table_sessions_info"
              >
                <div className="text-gray-600 fw-bold "></div>
              </div>
            </div>
            <div className="">
              <CodeEditor
                iframeHeight={iframeHeight}
                iframeWidth={iframeWidth}
                orientation={orientation}
                wantBackgroundImage={true}
              />
            </div>
            <div>
              <Signature />
            </div>
            <div className="text-center my-7">
              <button type="submit" className="btn btn-info">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddCertificate;
