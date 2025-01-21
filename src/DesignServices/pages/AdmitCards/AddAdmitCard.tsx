import { useForm, FormProvider, Controller, get, set } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";
import {
  AdmitCardInterface,
  admitCardSchema,
  GetAdmitCardInterface,
  UpdateAdmitCardInterface,
} from "../../services/admitCardService";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import useAdmitCard from "../../hooks/useAdmitCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AddAdmitCard = () => {
  const [code, setCode] = useState("");
  const {
    isLoadingSubmit,
    saveAdmitCard,
    getOneAdmitCard,
    admitCard,
    updateAdmitCard,
  } = useAdmitCard({});
  const methods = useForm<AdmitCardInterface | GetAdmitCardInterface>({
    defaultValues: {
      name: "",
      html: "",
      signers: [{ title: "", signature_id: undefined }],
    },
    resolver: zodResolver(admitCardSchema),
  });

  const params = useParams();
  const { admitCardId } = params;
  const isEditMode = !!admitCardId;
  console.log("isEditMode", isEditMode);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    if (admitCardId) {
      getOneAdmitCard(Number(admitCardId));
    }
  }, [admitCardId]);

  //GetOneAdmitCard is a function that fetches the admit card data from the server and above admitCard is it's response
  useEffect(() => {
    if (isEditMode && admitCard) {
      reset({
        name: admitCard.name,
        signers: admitCard.signers.map((signer: any) => ({
          title: signer.title,
          signature_id: signer.id,
        })),
      });
      setCode(admitCard.html);
    }
  }, [admitCard, isEditMode, reset]);

  const onSubmit = (data: AdmitCardInterface | UpdateAdmitCardInterface) => {
    if (isEditMode) {
      const updatedData = {
        ...data,
        id: Number(admitCardId),
        background: admitCard?.background || "",
      };
      console.log("raw submitted data", updatedData);
      updateAdmitCard(updatedData as UpdateAdmitCardInterface);
    } else {
      saveAdmitCard(data as AdmitCardInterface);
      reset({
        name: "",
        html: "",
        signers: [{ title: "", signature_id: undefined }],
      });
      setCode("<h1>Hello World</h1>");
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-3 w-100">
                {isEditMode ? "Edit Admit Card" : "Create New Admit Card"}
              </h1>
            </div>
            <div className="mb-4 col-md-4">
              <label htmlFor="name" className="required form-label">
                Admit Card Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    required
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
                iframeHeight={86}
                iframeWidth={86}
                orientation="landscape"
                wantBackground={false}
                scale={1.1}
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
                {isEditMode ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddAdmitCard;
