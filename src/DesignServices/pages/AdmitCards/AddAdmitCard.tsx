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
  const methods = useForm<AdmitCardInterface>({
    defaultValues: {
      name: "",
      html: "",
      size: "",
      cards_per_page: "",
      signers: [{ title: "", signature_id: "" }],
    },
    resolver: zodResolver(admitCardSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;

  //For Edit Mode
  const params = useParams();
  const { admitCardId } = params;
  const isEditMode = !!admitCardId;
  console.log("isEditMode", isEditMode);
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
        size: admitCard.size,
        background: admitCard.background,
        cards_per_page: admitCard.cards_per_page,
        signers: admitCard.signers.map((signer: any) => ({
          title: signer.title,
          signature_id: signer.id,
        })),
      });
      setCode(admitCard.html);
    }
  }, [admitCard, isEditMode, reset]);

  const onSubmit = async (
    data: AdmitCardInterface | UpdateAdmitCardInterface
  ) => {
    console.log("raw submitted data", data);

    try {
      if (isEditMode) {
        const updatedData = {
          ...data,
          id: Number(admitCardId),
        };
        await updateAdmitCard(updatedData);
      } else {
        await saveAdmitCard(data);
        // reset({
        //   name: "",
        //   html: "",
        //   size: "",
        //   background:'',
        //   cards_per_page: "",
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
                {isEditMode ? "Edit Admit Card" : "Create New Admit Card"}
              </h1>
            </div>
            <div className="mb-4 col-md-5">
              <label htmlFor="name" className="required form-label">
                Admit Card Name
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
            <div className="mb-4 col-md-3">
              <label htmlFor="size" className="required form-label">
                Size of Page
              </label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="size"
                    className="form-select form-select-solid"
                  >
                    <option value="" hidden>
                      Select Paper Size
                    </option>
                    <option value="A4">A4</option>
                  </select>
                )}
              />
              <span className="text-danger">{errors.size?.message}</span>
            </div>
            <div className="mb-4 col-md-3">
              <label htmlFor="size" className="required form-label">
                No of Admit Card per Page
              </label>
              <Controller
                name="cards_per_page"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="cards_per_page"
                    className="form-select form-select-solid"
                  >
                    <option value="" hidden>
                      Select No. of Admit Card Per Page
                    </option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                  </select>
                )}
              />
              <span className="text-danger">
                {errors.cards_per_page?.message}
              </span>
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

export default AddAdmitCard;
