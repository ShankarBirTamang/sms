import { useForm, FormProvider, Controller } from "react-hook-form";
import Signature from "../../../components/Signature/Signature";
import {
  AdmitCardInterface,
  admitCardSchema,
} from "../../services/admitCardService";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import { zodResolver } from "@hookform/resolvers/zod";

const AddAdmitCard = () => {
  const methods = useForm<AdmitCardInterface>({
    defaultValues: {
      name: "",
      code: "",
      signatures: [{ signee: "", signature: "" }],
    },
    resolver: zodResolver(admitCardSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: AdmitCardInterface) => {
    console.log("Submitted Form Data:", data);
  };
  return (
    <FormProvider {...methods}>
      <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-3 w-100">
                New Admit Card Design
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
              <CodeEditor />
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

export default AddAdmitCard;
