import { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Loading from "../../../components/Loading/Loading";
import DatePicker from "../../../components/DatePicker/DatePicker";
import useAcademicSession from "../../../Academics/hooks/useAcademicSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface AddExamProps {
  onSave: () => void;
}

const AddExam = ({ onSave }: AddExamProps) => {
  const [hasSymbol, setHasSymbol] = useState<boolean>(true);
  const [hasRegistration, setHasRegistration] = useState<boolean>(true);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [admitCardDesign, setAdmitCardDesign] = useState<string | null>(
    "general"
  );
  const [markSheetDesign, setMarkSheetDesign] =
    useState<string>("gradedFormatWithPR");
  const [selectedSessionId, setSelectedSessionId] = useState<number>();
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState("");
  const [startValueAD, setStartValueAD] = useState("");
  const [startValueBS, setStartValueBS] = useState("");

  const [endValueAD, setEndValueAD] = useState("");
  const [endValueBS, setEndValueBS] = useState("");

  const [resultValueAD, setResultValueAD] = useState("");
  const [resultValueBS, setResultValueBS] = useState("");

  const { academicSessions } = useAcademicSession({});
  const academicSessionOptions = academicSessions
    .filter((session) => session.is_active)
    .map((session) => ({
      value: session.id,
      label: session.name,
    }));

  const schema = z.object({
    name: z.string().min(1, { message: "Exam name is required" }),
    useSymbol: z.boolean().default(true),
    useRegistration: z.boolean().default(true),
    isMerge: z.boolean().default(false),
    start_date: z.string({ message: "Start Date Field is required." }),
    start_date_np: z.string(),
    end_date: z.string({ message: "End Date Field is required." }),
    end_date_np: z.string(),
    result_date: z.string({ message: "Result Date Field is required." }),
    result_date_np: z.string(),
    admit_card_design: z.string().nullable().default("general"),
    mark_sheet_design: z.string().default("gradedFormatWithPR"),
    academic_session_id: z.number().refine(
      (id) => {
        return academicSessions.some((session) => session.id === id);
      },
      { message: "Invalid academic session Id" }
    ),
    grades: z
      .array(z.object({ id: z.number() }))
      .min(1, { message: "At least one grade must be selected." }),
  });

  type ExamFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ExamFormData>({ resolver: zodResolver(schema) });

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate" | "resultDate"
  ) => {
    if (field === "startDate") {
      setValue("start_date", dates.adDate);
      setValue("start_date_np", dates.bsDate);
      setStartValueAD(dates.adDate);
      setStartValueBS(dates.bsDate);
    } else if (field === "endDate") {
      setValue("end_date", dates.adDate);
      setValue("end_date_np", dates.bsDate);
      setEndValueAD(dates.adDate);
      setEndValueBS(dates.bsDate);
    } else if (field === "resultDate") {
      setValue("result_date", dates.adDate);
      setValue("result_date_np", dates.bsDate);
      setResultValueAD(dates.adDate);
      setResultValueBS(dates.bsDate);
    }
  };

  //checkbox change event
  const handleHasSymbolData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setHasSymbol(value);
    setValue("useSymbol", value);
  };
  const handleHasRegistrationData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setHasRegistration(value);
    setValue("useRegistration", value);
  };
  const handleIsMergedData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setIsMerged(value);
    setValue("isMerge", value);
  };
  const handleGradeSelection = (gradeId: number) => {
    if (selectedGrades.includes(gradeId)) {
      setSelectedGrades(selectedGrades.filter((id) => id !== gradeId)); // Deselect
    } else {
      setSelectedGrades([...selectedGrades, gradeId]); // Select
    }
  };

  const handleAdmitCardDesignChange = (value: string | null) => {
    setAdmitCardDesign(value);
    setValue("admit_card_design", value);
  };
  const handleMarkSheetDesignChange = (value: string) => {
    setMarkSheetDesign(value);
    setValue("mark_sheet_design", value);
  };

  useEffect(() => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
    console.log(
      academicSessions.map(
        (session) => session.academic_level_id === selectedSessionId
      )
    );
    console.log("Form errors: ", errors);
  }, [academicSessions, errors]);

  const handleAcademicSessionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_session_id", selectedOption.value);
      setSelectedSessionId(selectedOption.value);
    }
  };

  //console debug

  const resetForm = () => {
    reset({
      name: "",
      useSymbol: false,
      useRegistration: false,
      isMerge: false,
      academic_session_id: undefined,
      start_date: "",
      start_date_np: "",
      end_date: "",
      end_date_np: "",
      result_date: "",
      result_date_np: "",
      admit_card_design: "general",
    });
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const onSubmit: SubmitHandler<ExamFormData> = (data) => {
    const formData = {
      ...data,
      grades: selectedGrades.map((id) => ({ id })), // Convert selected grades to the required format
    };
    console.log("Submitted data: ", formData);
    resetForm();
  };

  return (
    <div className="add-exam">
      {isLoading && <Loading />}
      {!isLoading && (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="row ">
            <div className="col-6 ">
              <label className="required fw-bold fs-6 mb-2">
                Examination Name
              </label>

              <div className="col-10 ">
                <input
                  {...register("name")}
                  className="form-control form-control-solid required "
                  type="text"
                />
                {errors.name && (
                  <div className="text-danger">{errors.name.message}</div>
                )}
              </div>
            </div>

            <div className="col-md-3">
              <label className="required fw-bold fs-6 mb-2">
                Use Symbol No
              </label>
              <div className="fv-row mb-7">
                <div className="d-flex mt-3 gap-10">
                  <div className="form-check">
                    <input
                      title="Yes"
                      className="form-check-input"
                      type="radio"
                      value="true"
                      id="useSymbol_yes"
                      name="useSymbol"
                      checked={hasSymbol === true}
                      onChange={handleHasSymbolData}
                    />
                    <label className="form-check-label" htmlFor="useSymbol_yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      title="No"
                      className="form-check-input"
                      type="radio"
                      value="false"
                      name="useSymbol"
                      id="useSymbol_no"
                      checked={hasSymbol === false}
                      onChange={handleHasSymbolData}
                    />
                    <label className="form-check-label" htmlFor="useSymbol_no">
                      No
                    </label>
                  </div>
                </div>
              </div>
              {errors.useSymbol && (
                <div className="text-danger">{errors.useSymbol.message}</div>
              )}
            </div>
            <div className="col-md-3">
              <label className="required fw-bold fs-6 mb-2">
                Use Registration No
              </label>
              <div className="fv-row mb-7">
                <div className="d-flex mt-3 gap-10">
                  <div className="form-check">
                    <input
                      title="Yes"
                      className="form-check-input"
                      type="radio"
                      value="true"
                      id="useRegistration_yes"
                      name="useRegistration"
                      checked={hasRegistration === true}
                      onChange={handleHasRegistrationData}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="useRegistration_yes"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      title="No"
                      className="form-check-input"
                      type="radio"
                      value="false"
                      name="useRegistration"
                      id="useRegistration_no"
                      checked={hasRegistration === false}
                      onChange={handleHasRegistrationData}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="useRegistration_no"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>
              {errors.useRegistration && (
                <div className="text-danger">
                  {errors.useRegistration.message}
                </div>
              )}
            </div>

            <div className="col-12">
              <hr />
            </div>

            <div className="col-12 mb-7">
              <DatePicker
                key={renderKey}
                onDateChange={(date) => handleDateChange(date, "startDate")}
                title="Start Date"
                errorAD={errors.start_date ? errors.start_date.message : ""}
                errorBS={
                  errors.start_date_np ? errors.start_date_np.message : ""
                }
                valueAD={startValueAD}
                valueBS={startValueBS}
              />
              {errors.start_date && <p>{errors.start_date.message}</p>}
            </div>

            <div className="col-12 mb-7">
              <DatePicker
                key={renderKey}
                onDateChange={(date) => handleDateChange(date, "endDate")}
                title="End Date"
                errorAD={errors.end_date ? errors.end_date.message : ""}
                errorBS={errors.end_date_np ? errors.end_date_np.message : ""}
                valueAD={endValueAD}
                valueBS={endValueBS}
              />
            </div>

            <div className="col-12 mb-5">
              <DatePicker
                key={renderKey}
                onDateChange={(date) => handleDateChange(date, "resultDate")}
                title="Result Date"
                errorAD={errors.result_date ? errors.result_date.message : ""}
                errorBS={
                  errors.result_date_np ? errors.result_date_np.message : ""
                }
                valueAD={resultValueAD}
                valueBS={resultValueBS}
              />
            </div>

            <div className="col-12">
              <hr />
            </div>

            <div className="col-md-6">
              <label className=" fw-bold fs-6 mb-2 required">
                Admit Card Design
              </label>
              <select
                className="form-control w-full "
                title="Admit Card Design "
                id="admitCardDesign"
                value={admitCardDesign ?? 0}
                onChange={(e) =>
                  handleAdmitCardDesignChange(
                    e.target.value === "general" ? "general" : e.target.value
                  )
                }
              >
                <option value="general">General</option>
                <option value="employee">Employee</option>
                <option value="summerSeason">Summer Season</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className=" fw-bold fs-6 mb-2 required">
                Mark Sheet Design
              </label>
              <select
                className="form-control w-full "
                title="Mark Sheet Design "
                id="markSheetDesign"
                value={markSheetDesign}
                onChange={(e) =>
                  handleMarkSheetDesignChange(
                    e.target.value === "gradedFormatWithPR"
                      ? "gradedFormatWithPR"
                      : e.target.value
                  )
                }
              >
                <option value="gradedFormatWithPR">
                  Graded Format with PR
                </option>
              </select>
            </div>

            <div className="col mt-15 ">
              <label className=" col-md-12 text-center fw-bold fs-6  ">
                <h1>PARTICIPATING GRADES</h1>
              </label>
              <label className=" col-md-12 text-center fs-6 mb-2 text-danger">
                (Select Only the Grades that are participating on this Exam.)
              </label>
            </div>
          </div>

          <div className="col-12">
            <hr />
          </div>

          <div className="col-md-6">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Select Academic Session
              </label>
              <CustomSelect
                key={renderKey}
                options={academicSessionOptions}
                onChange={handleAcademicSessionChange}
                error={errors.academic_session_id?.message}
                placeholder="Select Academic Level"
              />
            </div>
          </div>

          {selectedSessionId && (
            <>
              <div className="col-12">
                <label className="required fw-bold fs-6 mb-2">
                  Select Participating Grades
                </label>
                {academicSessions
                  .filter((session) => session.is_active)
                  .filter((session) => session.id === selectedSessionId)
                  .map((session) => (
                    <div key={session.id} className="mb-3">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input selectAll"
                              type="checkbox"
                              id={`selectAll-${session.id}`}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                document
                                  .querySelectorAll<HTMLInputElement>(
                                    `.gradeCheckbox-${session.id}`
                                  )
                                  .forEach(
                                    (checkbox) => (checkbox.checked = isChecked)
                                  );
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`selectAll-${session.id}`}
                            >
                              Select All for {session.name}
                            </label>
                          </div>
                        </div>
                        {session.grades?.map((grade) => (
                          <div key={grade.id} className="col-3">
                            <div className="form-check">
                              <input
                                className={`form-check-input gradeCheckbox-${session.id}`}
                                type="checkbox"
                                id={`grade-${grade.id}`}
                                name="grades[]"
                                value={grade.id}
                                checked={selectedGrades.includes(grade.id)}
                                onChange={() => handleGradeSelection(grade.id)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`grade-${grade.id}`}
                              >
                                {grade.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="col-12">
                <hr />
              </div>

              <div className="col-md-6">
                <label className="required fw-bold fs-6 mb-2">
                  Is the result merged with another Exam?
                </label>
                <div className="fv-row mb-7">
                  <div className="d-flex mt-3 gap-10">
                    <div className="form-check">
                      <input
                        title="Yes"
                        className="form-check-input"
                        type="radio"
                        value="true"
                        id="isMerged_yes"
                        name="isMerged"
                        checked={isMerged === true}
                        onChange={handleIsMergedData}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isMerged_yes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        title="No"
                        className="form-check-input"
                        type="radio"
                        value="false"
                        name="isMerged"
                        id="isMerged_no"
                        checked={isMerged === false}
                        onChange={handleIsMergedData}
                      />
                      <label className="form-check-label" htmlFor="isMerged_no">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                {errors.isMerge && (
                  <div className="text-danger">{errors.isMerge.message}</div>
                )}
              </div>
            </>
          )}
          <div className="text-center pt-15">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={onSave}
            >
              Discard
            </button>
            <button title="submit" type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default AddExam;
