import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import axiosInstance from "../../../axiosConfig";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const baseUrl = import.meta.env.VITE_API_URL;

interface SignatureInterface {
  name?: string;
  signature?: string;
}

interface GetSignatureInterface {
  id: string;
  name?: string;
  signature?: string;
}

const Signature = () => {
  const [signatureList, setSignatureList] = useState<GetSignatureInterface[]>(
    []
  );
  const {
    control,
    formState: { errors },
  } = useFormContext<{ signers: SignatureInterface[] }>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "signers",
  });

  useEffect(() => {
    getAllSignatures();
  }, []);

  const getAllSignatures = async () => {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/design-services/signatures`
      );
      setSignatureList(response.data.data);
    } catch (error) {
      toast("Error fetching Signature List");
      console.log("Error fetching Signature List", error);
    } finally {
    }
  };
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
                  name={`signers.${index}.name`}
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
                  {errors.signers?.[index]?.name?.message}
                </span>
              </td>
              <td>
                <Controller
                  name={`signers.${index}.signature`}
                  control={control}
                  render={({ field }) => (
                    <select
                      className="form-control form-control-solid"
                      {...field}
                    >
                      <option value="" hidden>
                        Select Associated Signature
                      </option>
                      {signatureList.map((signature) => (
                        <option key={signature.id} value={signature.id}>
                          {signature.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <span className="text-danger">
                  {errors.signers?.[index]?.signature?.message}
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
            append({ name: "", signature: "" });
          }}
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default Signature;
