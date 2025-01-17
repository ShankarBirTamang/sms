import { useForm, FormProvider, Controller } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";
import { IdCardInterface, IdCardSchema } from "../../services/idCardService";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";

const AddIdCard = () => {
  const methods = useForm<IdCardInterface>({
    defaultValues: {
      name: "",
      code: "",
      cardHolder: "",
      cardType: "",
      backgroundImage: null,
      primaryColor: "",
      signatures: [{ signee: "", signature: "" }],
    },
    resolver: zodResolver(IdCardSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: IdCardInterface) => {
    console.log("Submitted Form Data:", data);
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
            <div className="mb-4 col-md-5">
              <label htmlFor="name" className="required form-label">
                Id Card Name
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
              <label htmlFor="cardHolder" className="required form-label">
                Select Card Holder
              </label>
              <Controller
                name="cardHolder"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="cardHolder"
                    className="form-select form-select-solid"
                  >
                    <option value="" hidden>
                      Select Holder
                    </option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                )}
              />
              <span className="text-danger">{errors.cardHolder?.message}</span>
            </div>
            <div className="mb-4 col-md-3">
              <label htmlFor="cardType" className="required form-label">
                Select Card Type
              </label>
              <Controller
                name="cardType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="cardType"
                    className="form-select form-select-solid"
                  >
                    <option value="" hidden>
                      Select Card Type
                    </option>
                    <option value="general">General</option>
                    <option value="transport">Transport</option>
                  </select>
                )}
              />
              <span className="text-danger">{errors.cardType?.message}</span>
            </div>
            <div className="mb-4 col-md-3">
              <label htmlFor="primaryColor" className="required form-label">
                Primary Color
              </label>
              <Controller
                name="primaryColor"
                control={control}
                render={({ field }) => (
                  <input
                    type="color"
                    {...field}
                    id="primaryColor"
                    className="form-control form-control-solid"
                  ></input>
                )}
              />
              <span className="text-danger">
                {errors.primaryColor?.message}
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
                iframeHeight={86}
                iframeWidth={54}
                orientation="portrait"
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

export default AddIdCard;
