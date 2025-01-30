import { useForm, FormProvider, Controller } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";
import {
  IdCardInterface,
  IdCardSchema,
  UpdateIdCardInterface,
} from "../../services/idCardService";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import useIdCard from "../../hooks/useIdCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AddIdCard = () => {
  const [code, setCode] = useState("");
  const {
    idCardTypes,
    saveIdCard,
    isLoadingSubmit,
    idCard,
    getOneIdCard,
    updateIdCard,
  } = useIdCard({});

  const methods = useForm<IdCardInterface>({
    defaultValues: {
      name: "",
      html: "",
      id_card_type_id: "",
      background: null,
      color: "#000000",
      signers: [{ title: "", signature_id: "" }],
    },
    resolver: zodResolver(IdCardSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  //For Edit Mode
  const params = useParams();
  const { idCardId } = params;
  const isEditMode = !!idCardId;
  console.log("isEditMode", isEditMode);

  useEffect(() => {
    if (idCardId) {
      getOneIdCard(Number(idCardId));
    }
  }, [idCardId]);

  //GetOneAdmitCard is a function that fetches the admit card data from the server and above idCard is it's response
  useEffect(() => {
    if (isEditMode && idCard) {
      reset({
        name: idCard.name,
        id_card_type_id: idCard.id_card_type.id,
        html: idCard.html, // Ensure the html field is set
        background: idCard.background,
        signers: idCard.signers.map((signer: any) => ({
          title: signer.title,
          signature_id: signer.id,
        })),
      });
      setCode(idCard.html);
    }
  }, [idCard, isEditMode, reset]);

  const onSubmit = async (data: IdCardInterface | UpdateIdCardInterface) => {
    console.log("raw submitted data", data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("html", data.html || "");
    formData.append("color", data.color);
    formData.append("id_card_type_id", data.id_card_type_id?.toString() || "");
    formData.append("signers", JSON.stringify(data.signers));
    if (data.background instanceof FileList && data.background[0]) {
      formData.append("background", data.background[0]);
    } else if (isEditMode && idCard?.background) {
      formData.append("background", idCard.background);
    }

    try {
      if (isEditMode) {
        formData.append("id", idCardId!);
        await updateIdCard(formData);
      } else {
        await saveIdCard(formData);
        // reset({
        //   name: "",
        //   html: "",
        //   id_card_type_id: "",
        //   background: null,
        // color: "#000000",
        //   signers: [{ title: "", signature_id: "" }],
        // });
        // setCode("<h1>Hello World</h1>");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-3 w-100">
                New Id Card Design
              </h1>
            </div>
            <div className="mb-4 col-md-6">
              <label htmlFor="name" className="required form-label">
                Id Card Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? ""}
                    type="string"
                    id="name"
                    placeholder="Eg: Employee, Primary Students, Bus Students, etc."
                    className="form-control form-control-solid"
                  ></input>
                )}
              />
              <span className="text-danger">{errors.name?.message}</span>
            </div>
            <div className="mb-4 col-md-4">
              <label htmlFor="cardType" className="required form-label">
                Select Card Type
              </label>
              <Controller
                name="id_card_type_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="id_card_type"
                    className="form-select form-select-solid"
                    value={field.value ?? ""}
                  >
                    <option value="" hidden>
                      Select Card Type
                    </option>
                    {idCardTypes.map((idCardType, index) => (
                      <option key={idCardType.id} value={idCardType.id}>
                        {idCardType.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              <span className="text-danger">
                {errors.id_card_type_id?.message}
              </span>
            </div>
            <div className="mb-4 col-md-3">
              <label htmlFor="color" className="required form-label">
                Primary Color
              </label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <input
                    type="color"
                    {...field}
                    id="color"
                    className="form-control form-control-solid"
                  ></input>
                )}
              />
              <span className="text-danger">{errors.color?.message}</span>
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
                iframeWidth={54}
                orientation="portrait"
                wantBackground={true}
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
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddIdCard;
