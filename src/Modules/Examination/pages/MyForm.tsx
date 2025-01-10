import React, { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAcademicSession from "../../../Academics/hooks/useAcademicSession";

interface AddExamProps {
  onSave: () => void;
}

const MyForm = ({ onSave }: AddExamProps) => {
  const { academicSessions } = useAcademicSession({});
  const academicSessionOptions = academicSessions
    .filter((session) => session.is_active)
    .map((session) => ({
      value: session.id,
      label: session.name,
    }));

  const [hasSymbol, setHasSymbol] = useState<boolean>(true);

  // Define the schema using zod
  const schema = z.object({
    academic_session_id: z.number().refine(
      (id) => {
        return academicSessions.some((session) => session.id === id);
      },
      { message: "Invalid academic session Id" }
    ),
  });

  // Define the TypeScript type from the schema
  type FormData = z.infer<typeof schema>;

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <div>
          <div>
            <label>Academic Session *</label>
            <select
              value={academicSession}
              onChange={handleAcademicSessionChange}
            >
              <option value="Academic Year 2081">Academic Year 2081</option>
              <option value="Academic Session 2081-82 [+2]">
                Academic Session 2081-82 [+2]
              </option>
            </select>
          </div>

          <div>
            <label>Select Participating Grades *</label>
            <div>
              <label>
                <input type="checkbox" /> Select All
              </label>
              {grades.map((grade, index) => (
                <label key={index}>
                  <input type="checkbox" /> {grade}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Is the result merged with another Exam?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="merge"
                  value="yes"
                  checked={isMerged === true}
                  onChange={() => setIsMerged(true)}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="merge"
                  value="no"
                  checked={isMerged === false}
                  onChange={() => setIsMerged(false)}
                />{" "}
                No
              </label>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" onClick={() => alert("Form submitted!")}>
        Submit
      </button>
    </form>
  );
};

export default MyForm;
