import Signature from "../../../components/Signature/signature";
import { useForm, FormProvider } from "react-hook-form";

interface SignatureInterface {
  signee?: string;
  title?: string;
}

const AddAdmitCard = () => {
  const methods = useForm<SignatureInterface[]>({
    defaultValues: [{ signee: "", title: "" }],
  });

  const onSubmit = (data: SignatureInterface[]) => {
    console.log("Submitted Form Data:", data);
  };
  return (
    <FormProvider {...methods}>
      <form className="col-md-12" onSubmit={methods.handleSubmit(onSubmit)}>
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
              <input
                type="string"
                id="name"
                placeholder="Eg: Employee, Primary Students, Bus Students, etc."
                className="form-control form-control-solid"
              ></input>
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
            <div>
              <Signature />
            </div>
            <button type="submit" className="btn btn-info">
              Submit
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddAdmitCard;
