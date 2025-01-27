import { useForm, FormProvider, Controller } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";

import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CertificateInterface,
  certificateSchema,
  sizes,
} from "../../services/certificateServices";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCertificate from "../../hooks/useCertificate";

const AddCertificate = () => {
  const [code, setCode] = useState("");
  const {
    certificate,
    isLoadingSubmit,
    saveCertificate,
    getOneCertificate,
    updateCertificate,
  } = useCertificate({});
  const methods = useForm<CertificateInterface>({
    defaultValues: {
      name: "",
      size: "A4",
      height: 297,
      width: 210,
      background: null,
      html: "",
      orientation: "portrait",
      signers: [{ title: "", signature_id: "" }],
    },
    // resolver: zodResolver(certificateSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = methods;

  //For Edit Mode
  const params = useParams();
  const { certificateId } = params;
  const isEditMode = !!certificateId;
  console.log("isEditMode", isEditMode);

  useEffect(() => {
    if (certificateId) {
      getOneCertificate(Number(certificateId));
    }
  }, [certificateId]);

  const selectedPaperSize = watch("size"); //outputs A4, A5 etc
  const orientation = watch("orientation");

  //Height and Width to pass as the props to Code Editor to adjust it's size
  const iframeWidth = sizes[selectedPaperSize as keyof typeof sizes].width;
  const iframeHeight = sizes[selectedPaperSize as keyof typeof sizes].height;

  //Doesn't need to be here
  useEffect(() => {
    const { height, width } = sizes[selectedPaperSize as keyof typeof sizes];
    setValue("height", height);
    setValue("width", width);
    //another method to set value
    // setValue(`sizes.${selectedPaperSize}.height`, height);
    // setValue(`sizes.${selectedPaperSize}.width`, width);
  }, [selectedPaperSize, setValue]);

  const onSubmit = async (data: CertificateInterface) => {
    console.log("Raw data to be submit", data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("size", data.size);
    formData.append("html", data.html || "");
    formData.append("height", data.height.toString());
    formData.append("width", data.width.toString());
    formData.append("orientation", data.orientation);
    formData.append("signers", JSON.stringify(data.signers));
    if (data.background instanceof FileList && data.background[0]) {
      formData.append("background", data.background[0]);
    } else if (isEditMode && certificate?.background) {
      formData.append("background", certificate.background);
    }

    try {
      if (isEditMode) {
        formData.append("id", certificateId!);
        await updateCertificate(formData);
      } else {
        await saveCertificate(formData);
        reset({
          name: "",
          size: "A4",
          height: 297,
          width: 210,
          background: null,
          html: "",
          orientation: "portrait",
          signers: [{ title: "", signature_id: "" }],
        });
        setCode("<h1>Hello World</h1>");
      }
    } catch (error) {
      console.log("Error while saving certificate", error);
    }
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
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="sizes"
                      className="form-control form-control-solid"
                    >
                      {Object.entries(sizes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <span className="text-danger">{errors.size?.message}</span>
              </div>
              <div className="mb-4 col-md-3">
                <label htmlFor="name" className="required form-label">
                  Height(mm)
                </label>
                <Controller
                  name="height"
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
                  {errors.height?.message ?? ""}
                </span>
              </div>
              <div className="mb-4 col-md-3">
                <label htmlFor="name" className="required form-label">
                  Width(mm)
                </label>
                <Controller
                  name="width"
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
                  {errors.width?.message ?? ""}
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
                      className="form-select form-select-solid"
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
                wantBackground={true}
                scale={0.8}
                code={code}
              />
            </div>
            <div>
              <Signature />
            </div>
            <div className="text-center my-7">
              <button
                type="submit"
                className="btn btn-info"
                disabled={isLoadingSubmit}
              >
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
