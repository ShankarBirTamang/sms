import { useForm, FormProvider, Controller, get, set } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";
import {
  MarksheetInterface,
  marksheetSchema,
  GetMarksheetInterface,
  UpdateMarksheetInterface,
} from "../../services/marksheetService";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import useMarksheet from "../../hooks/useMarksheet";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AddMarksheet = () => {
  const [code, setCode] = useState("");
  const {
    isLoadingSubmit,
    saveMarksheet,
    getOneMarksheet,
    marksheet,
    updateMarksheet,
  } = useMarksheet({});
  const methods = useForm<MarksheetInterface>({
    defaultValues: {
      name: "",
      html: "",
      background: "",
      signers: [{ title: "", signature_id: "" }],
    },
    resolver: zodResolver(marksheetSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;

  //For Edit Mode
  const params = useParams();
  const { marksheetId } = params;
  const isEditMode = !!marksheetId;
  console.log("isEditMode", isEditMode);
  useEffect(() => {
    if (marksheetId) {
      getOneMarksheet(Number(marksheetId));
    }
  }, [marksheetId]);

  //GetOneMarksheet is a function that fetches the admit card data from the server and above marksheet is it's response
  useEffect(() => {
    if (isEditMode && marksheet) {
      reset({
        name: marksheet.name,
        background: marksheet.background,
        html: marksheet.html,
        signers: marksheet.signers.map((signer: any) => ({
          title: signer.title,
          signature_id: signer.id,
        })),
      });
      setCode(marksheet.html);
    }
  }, [marksheet, isEditMode, reset]);

  const onSubmit = async (
    data: MarksheetInterface | UpdateMarksheetInterface
  ) => {
    console.log("raw submitted data", data);

    try {
      if (isEditMode) {
        const updatedData = {
          ...data,
          id: Number(marksheetId),
        };
        await updateMarksheet(updatedData);
      } else {
        await saveMarksheet(data);
        // reset({
        //   name: "",
        //   html: "",
        //   background:'',
        //   signers: [{ title: "", signature_id: "" }],
        // });
        setCode("<h1>Hello World</h1>");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="col-md-12 container-fluid"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card">
          <div className="row card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-3 w-100">
                {isEditMode ? "Edit Marksheet" : "Create New Marksheet"}
              </h1>
            </div>
            <div className="mb-4 col-md-5">
              <label htmlFor="name" className="required form-label">
                Marksheet Name
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
                iframeHeight={297}
                iframeWidth={210}
                orientation="portrait"
                wantBackground={true}
                scale={0.7}
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
                {isLoadingSubmit
                  ? "........"
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddMarksheet;
