import { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Loading from "../../../../components/Loading/Loading";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useExam from "../../hooks/useExam";
import { CreateExamInterface } from "../../services/examSessionService";
import useAcademicSession from "../../../Academics/hooks/useAcademicSession";
import useAdmitCard from "../../../../DesignServices/hooks/useAdmitCard";
import useMarksheet from "../../../../DesignServices/hooks/useMarksheet";
import useMarksScheme from "../../hooks/useMarksScheme";
import toast from "react-hot-toast";

interface AddExamProps {
  onSave: () => void;
}

const AddExam = ({ onSave }: AddExamProps) => {
  const [hasSymbol, setHasSymbol] = useState<boolean>(false);
  const [hasRegistration, setHasRegistration] = useState<boolean>(false);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number>();
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [selectedMarksSchemes, setSelectedMarksSchemes] = useState<number[]>(
    []
  );

  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState("");
  const [startValueAD, setStartValueAD] = useState("");
  const [startValueBS, setStartValueBS] = useState("");

  const [endValueAD, setEndValueAD] = useState("");
  const [endValueBS, setEndValueBS] = useState("");

  const [resultValueAD, setResultValueAD] = useState("");
  const [resultValueBS, setResultValueBS] = useState("");

  const { academicSessions } = useAcademicSession({});
  const { createExam, examinations } = useExam({});
  const { admitCardList } = useAdmitCard({});
  const { marksheetList } = useMarksheet({});
  const { marksSchemes } = useMarksScheme({});
  const academicSessionOptions = academicSessions
    .filter((session) => session.is_active)
    .map((session) => ({
      value: session.id,
      label: session.name,
    }));

  const theoryMarksSchemes = marksSchemes.filter(
    (scheme) => scheme.group === "Theory"
  );
  const practicalMarksScheme = marksSchemes.filter(
    (scheme) => scheme.group === "Practical"
  );

  const schema = z.object({
    name: z.string().min(1, { message: "Exam name is required" }),
    has_symbol_no: z.boolean().default(false),
    has_registration_no: z.boolean().default(false),
    is_merged: z.boolean().default(false),
    start_date: z.string({ message: "Start Date Field is required." }),
    start_date_np: z.string(),
    end_date: z.string({ message: "End Date Field is required." }),
    end_date_np: z.string(),
    result_date: z.string({ message: "Result Date Field is required." }),
    result_date_np: z.string(),
    admit_card_id: z.number(),
    marksheet_id: z.number(),
    academic_session_id: z.number().refine(
      (id) => {
        return academicSessions.some((session) => session.id === id);
      },
      { message: "Invalid academic session Id" }
    ),
    marks_schemes: z
      .array(z.number())
      .min(1, { message: "At least one grade must be selected." }),
    grades: z
      .array(z.number())
      .min(1, { message: "At least one grade must be selected." }),
    merged_exams: z.array(z.number()).optional(),
  });

  type ExamFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
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
    setValue("has_symbol_no", value);
  };
  const handleHasRegistrationData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setHasRegistration(value);
    setValue("has_registration_no", value);
  };
  const handleIsMergedData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setIsMerged(value);
    setValue("is_merged", value);
  };

  const handleMarksSchemesSelection = (marksSchemeId: number) => {
    const updatedMarksSchemes = selectedMarksSchemes.includes(marksSchemeId)
      ? selectedMarksSchemes.filter((id) => id !== marksSchemeId)
      : [...selectedMarksSchemes, marksSchemeId];
    setSelectedMarksSchemes(updatedMarksSchemes);
    setValue("marks_schemes", updatedMarksSchemes);
  };
  const handleGradeSelection = (gradeId: number) => {
    const updatedGrades = selectedGrades.includes(gradeId)
      ? selectedGrades.filter((id) => id !== gradeId)
      : [...selectedGrades, gradeId];

    setSelectedGrades(updatedGrades);
    setValue("grades", updatedGrades);
  };
  const handleExamSelection = (examId: number) => {
    const updatedExams = selectedExams.includes(examId)
      ? selectedExams.filter((id) => id !== examId)
      : [...selectedExams, examId];

    setSelectedExams(updatedExams);
    setValue("merged_exams", updatedExams);
  };

  const handleSelectAll = (sessionId: number, isChecked: boolean) => {
    const sessionGrades =
      academicSessions
        .find((session: { id: number }) => session.id === sessionId)
        ?.grades?.map((grade) => grade.id) || [];

    if (isChecked) {
      // Add all grades for the session to the selectedGrades state
      setSelectedGrades((prevSelectedGrades) =>
        Array.from(new Set([...prevSelectedGrades, ...sessionGrades]))
      );
    } else {
      // Remove all grades for the session from the selectedGrades state
      setSelectedGrades((prevSelectedGrades) =>
        prevSelectedGrades.filter((gradeId) => !sessionGrades.includes(gradeId))
      );
    }
  };

  //For the checked value in Select All checkbox
  const isAllGradesSelected = (sessionId: number) => {
    const sessionGrades =
      academicSessions
        .find((session) => session.id === sessionId)
        ?.grades?.map((grade) => grade.id) || [];

    return sessionGrades.every((gradeId) => selectedGrades.includes(gradeId));
  };

  useEffect(() => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [academicSessions, errors, selectedSessionId]);

  const handleAcademicSessionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_session_id", selectedOption.value);
      setValue("grades", []);
      setSelectedGrades([]);
      setSelectedSessionId(selectedOption.value);
    }
  };

  //console debug

  const resetForm = () => {
    reset({
      name: "",
      has_registration_no: false,
      has_symbol_no: false,
      is_merged: false,
      academic_session_id: undefined,
      start_date: "",
      start_date_np: "",
      end_date: "",
      end_date_np: "",
      result_date: "",
      result_date_np: "",
      admit_card_id: undefined,
      marksheet_id: undefined,
    });
    setSelectedGrades([]);
    setSelectedExams([]);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  useEffect(() => {
    setValue("grades", selectedGrades);
    setValue("merged_exams", selectedExams);
  }, [selectedGrades, setValue, selectedExams, getValues]);

  const onSubmit: SubmitHandler<ExamFormData> = async (data: ExamFormData) => {
    setisSubmitting(true);
    try {
      const examData: CreateExamInterface = {
        name: data.name,
        start_date: data.start_date,
        start_date_np: data.start_date_np,
        end_date: data.end_date,
        end_date_np: data.end_date_np,
        result_date: data.result_date,
        result_date_np: data.result_date_np,
        has_symbol_no: data.has_symbol_no,
        has_registration_no: data.has_registration_no,
        academic_session_id: data.academic_session_id,
        marks_schemes: data.marks_schemes,
        grades: data.grades,
        is_merged: data.is_merged,
        merged_exams: data.merged_exams,
        admit_card_id: data.admit_card_id,
        marksheet_id: data.marksheet_id,
      };
      await createExam(examData);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setisSubmitting(false);
      onSave();
      // resetForm();
    }
  };

  return (
    <div className="add-exam col-12 col-md-12">
      {isLoading && <Loading />}
      {!isLoading && (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="row ">
            <div className="col-12 col-md-6">
              <label className="required fw-bold fs-6 mb-2">
                Examination Name
              </label>
              <div className="col-12">
                <input
                  {...register("name")}
                  className={`form-control required ${
                    errors.name && "is-invalid"
                  }`}
                  type="text"
                />
                {errors.name && (
                  <div className="text-danger">{errors.name.message}</div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-3">
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
              {errors.has_symbol_no && (
                <div className="text-danger">
                  {errors.has_symbol_no.message}
                </div>
              )}
            </div>
            <div className="col-12 col-md-3">
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
              {errors.has_registration_no && (
                <div className="text-danger">
                  {errors.has_registration_no.message}
                </div>
              )}
            </div>

            <div className="col-12">
              <hr />
            </div>

            <div className="col-6 mb-7">
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
              {errors.start_date && (
                <div className="text-danger">{errors.start_date.message}</div>
              )}
            </div>

            <div className="col-6 mb-7">
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

            <div className="col-6 mb-5">
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
              <label className="fw-bold fs-6 mb-2 required">
                Admit Card Design
              </label>
              <select
                className={`form-control required ${
                  errors.admit_card_id && "is-invalid"
                }`}
                title="Admit Card Design"
                id="admit_card_design"
                {...register("admit_card_id", {
                  valueAsNumber: true,
                })}
              >
                <option value="" hidden>
                  Select Admit card Design
                </option>
                {admitCardList.map((card, c) => (
                  <option key={c} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold fs-6 mb-2 required">
                Mark Sheet Design
              </label>
              <select
                className={`form-control required ${
                  errors.marksheet_id && "is-invalid"
                }`}
                title="Mark Sheet Design "
                id="markSheetDesign"
                {...register("marksheet_id", {
                  valueAsNumber: true,
                })}
              >
                <option value="" hidden>
                  Select Marksheet card Design
                </option>
                {marksheetList.map((sheet, m) => (
                  <option key={m} value={sheet.id}>
                    {sheet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-15 ">
              <div className="row justify-content-center">
                <label className=" col-md-12 text-center fw-bold fs-6  ">
                  <h1>Exam Marking Scheme</h1>
                </label>
                <label className=" col-md-12 text-center fs-6 mb-2 text-danger">
                  (Marks Assignable for Subjects.)
                </label>
                <hr />
                {marksSchemes.length <= 0 && (
                  <div className="col-12">
                    <Loading />
                  </div>
                )}
                {marksSchemes.length > 0 && (
                  <>
                    <div className="col-md-4">
                      <h4>Theory Group</h4>
                      <ul className="list-group">
                        {theoryMarksSchemes?.map((scheme) => (
                          <li
                            key={scheme.id}
                            className="list-group-item border-0"
                          >
                            <div className="form-check">
                              <input
                                className={`form-check-input marks-schemeCheckbox-${scheme.id}`}
                                type="checkbox"
                                id={`marks-scheme-${scheme.id}`}
                                value={scheme.id}
                                checked={selectedMarksSchemes.includes(
                                  scheme.id
                                )}
                                onChange={() =>
                                  handleMarksSchemesSelection(scheme.id)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`marks-scheme-${scheme.id}`}
                              >
                                {scheme.name} ({scheme.short_name})
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h4>Practical Group</h4>
                      <ul className="list-group">
                        {practicalMarksScheme?.map((scheme) => (
                          <li
                            key={scheme.id}
                            className="list-group-item border-0"
                          >
                            <div className="form-check">
                              <input
                                className={`form-check-input marks-schemeCheckbox-${scheme.id}`}
                                type="checkbox"
                                id={`marks-scheme-${scheme.id}`}
                                value={scheme.id}
                                checked={selectedMarksSchemes.includes(
                                  scheme.id
                                )}
                                onChange={() =>
                                  handleMarksSchemesSelection(scheme.id)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`marks-scheme-${scheme.id}`}
                              >
                                {scheme.name} ({scheme.short_name})
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-12 mt-15 ">
              <div className="row">
                <label className=" col-md-12 text-center fw-bold fs-6  ">
                  <h1>PARTICIPATING GRADES</h1>
                </label>
                <label className=" col-md-12 text-center fs-6 mb-2 text-danger">
                  (Select Only the Grades that are participating on this Exam.)
                </label>
              </div>
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
                defaultValue={
                  academicSessionOptions.find(
                    (option) => option.value === selectedSessionId
                  ) || null
                }
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
                              checked={isAllGradesSelected(session.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleSelectAll(session.id, isChecked);
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
                {errors.grades && (
                  <div className="text-danger">{errors.grades.message}</div>
                )}
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
                        checked={isMerged}
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
                {errors.is_merged && (
                  <div className="text-danger">{errors.is_merged.message}</div>
                )}
              </div>
            </>
          )}

          {isMerged && (
            <>
              <div className="col-12">
                <label className=" fw-bold fs-6 mb-2">
                  Select Examination to be Merged
                </label>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="row">
                      {examinations.map((exam) => (
                        <div key={exam.id} className="col-12 mb-3">
                          <div className="form-check ">
                            <input
                              className={`form-check-input gradeCheckbox-${exam.id}`}
                              type="checkbox"
                              id={`exam-${exam.id}`}
                              name="examinations[]"
                              value={exam.id}
                              checked={selectedExams.includes(exam.id)}
                              onChange={() => handleExamSelection(exam.id)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`exam-${exam.id}`}
                            >
                              {exam.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
