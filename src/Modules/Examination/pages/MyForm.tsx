import React, { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddExamProps {
  onSave: () => void;
}

// Define the schema using zod
const schema = z.object({
  useSymbol: z
    .boolean({ message: "Has Symbol No. Field is required." })
    .default(true),
});

// Define the TypeScript type from the schema
type FormData = z.infer<typeof schema>;

const MyForm = ({ onSave }: AddExamProps) => {
  const [hasSymbol, setHasSymbol] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Submitted Data:", data);
  };

  const handleCheckBoxData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setHasSymbol(value);
    setValue("useSymbol", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2" htmlFor="grade">
            Marks added in Result?
          </label>
          <div className="d-flex gap-5 mt-3">
            <div className="form-check">
              <input
                title="Yes"
                className="form-check-input"
                type="radio"
                value="true"
                id="yes"
                name="marks_added"
                checked={hasSymbol === true}
                onChange={handleCheckBoxData}
              />
              <label className="form-check-label" htmlFor="yes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                title="No"
                className="form-check-input"
                type="radio"
                value="false"
                name="marks_added"
                id="no"
                checked={hasSymbol === false}
                onChange={handleCheckBoxData}
              />
              <label className="form-check-label" htmlFor="no">
                No
              </label>
            </div>
          </div>
          {errors.useSymbol && (
            <span className="text-danger">{errors.useSymbol.message}</span>
          )}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
