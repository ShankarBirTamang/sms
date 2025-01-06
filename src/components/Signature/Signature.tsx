import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface SignatureInterface {
  signee?: string;
  title?: string;
}

const Signature = () => {
  const [signatures, setSignatures] = useState<SignatureInterface[]>([]);

  const { control } = useFormContext<SignatureInterface[]>();

  const handleAddButton = () => {
    setSignatures((prev) => [...prev, { signee: "", title: "" }]);
  };
  console.log("signatures", signatures);

  const handleRemove = (index: number) => {};
  return (
    <div className="col-md-12">
      <table className="table table-responsive">
        <thead>
          <tr>
            <th>SN</th>
            <th>Signee</th>
            <th>Signee Title</th>
            <th className="text-center">Action</th>
            <th className="text-center">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddButton}
              >
                Add +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {signatures.map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Controller
                  name={`${index}.signee`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="form-control form-control-solid mb-3 mb-lg-0"
                    />
                  )}
                />
              </td>
              <td>
                <Controller
                  name={`${index}.title`}
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
              </td>
              <td className=" text-center">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Signature;
