import { Controller, useFieldArray, useFormContext } from "react-hook-form";

interface SignatureInterface {
  signee?: string;
  signature?: string;
}

const Signature = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<{ signatures: SignatureInterface[] }>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "signatures",
  });

  return (
    <div className="col-md-12">
      <h3>Signers For Admit Card</h3>
      <table className="table table-responsive">
        <thead>
          <tr>
            <th>SN</th>
            <th>Signee</th>
            <th>Signee Title</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>{index + 1}</td>
              <td>
                <Controller
                  name={`signatures.${index}.signee`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="form-control form-control-solid mb-3 mb-lg-0"
                    />
                  )}
                />
                <span className="text-danger">
                  {errors.signatures?.[index]?.signee?.message}
                </span>
              </td>
              <td>
                <Controller
                  name={`signatures.${index}.signature`}
                  control={control}
                  render={({ field }) => (
                    <select
                      className="form-control form-control-solid"
                      {...field}
                    >
                      <option hidden>Select Associated Signature</option>
                      <option value="1">Principal</option>
                      <option value="2">Vice Principal</option>
                      <option value="3">Chief</option>
                    </select>
                  )}
                />
                <span className="text-danger">
                  {errors.signatures?.[index]?.signature?.message}
                </span>
              </td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            append({ signee: "", signature: "" });
          }}
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default Signature;
