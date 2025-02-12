import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useAcademicSession from "../../../../Academics/hooks/useAcademicSession";
import useExam from "../../hooks/useExam";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateExamInterface } from "../../services/examSessionService";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import Loading from "../../../../components/Loading/Loading";

interface EditExamProps {
  examId: number | null;
  onSave: (examId: number) => void;
}

const EditExam = ({ examId, onSave }: EditExamProps) => {
  const [hasSymbol, setHasSymbol] = useState<boolean>(true);
  const [hasRegistration, setHasRegistration] = useState<boolean>(true);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [admitCardDesign, setAdmitCardDesign] = useState<string>("general");
  const [markSheetDesign, setMarkSheetDesign] =
    useState<string>("gradedFormatWithPR");
  const [selectedSessionId, setSelectedSessionId] = useState<number>();
  const [selectedExams, setSelectedExams] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState("");
  const [startValueAD, setStartValueAD] = useState("");
  const [startValueBS, setStartValueBS] = useState("");

  const [endValueAD, setEndValueAD] = useState("");
  const [endValueBS, setEndValueBS] = useState("");

  const [resultValueAD, setResultValueAD] = useState("");
  const [resultValueBS, setResultValueBS] = useState("");

  const { academicSessions } = useAcademicSession({});
  const { examinations, isEditing, selectedGrades, setSelectedGrades } =
    useExam({});
  const academicSessionOptions = academicSessions
    .filter((session) => session.is_active)
    .map((session) => ({
      value: session.id,
      label: session.name,
    }));

  const schema = z.object({
    name: z.string().min(1, { message: "Exam name is required" }),
    has_symbol_no: z.boolean().default(true),
    has_registration_no: z.boolean().default(true),
    is_merged: z.boolean().default(false),
    start_date: z.string({ message: "Start Date Field is required." }),
    start_date_np: z.string(),
    end_date: z.string({ message: "End Date Field is required." }),
    end_date_np: z.string(),
    result_date: z.string({ message: "Result Date Field is required." }),
    result_date_np: z.string(),
    admit_card_id: z.number().default(1),
    marksheet_id: z.number().default(1),
    academic_session_id: z.number().refine(
      (id) => {
        return academicSessions.some((session) => session.id === id);
      },
      { message: "Invalid academic session Id" }
    ),
    grades: z
      .array(z.number())
      .min(1, { message: "At least one grade must be selected." }),
    merged_exams: z
      .array(z.number())
      .min(1, { message: "At least one exam must be selected." }),
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

  const handleCancel = (e: FormEvent) => {
    e.preventDefault();
    onSave(examId ?? 0); // Close the drawer after saving
  };

  const handleAdmitCardDesignChange = (value: string) => {
    setAdmitCardDesign(value);
    const numericValue =
      value === "general"
        ? 1
        : value === "employee"
        ? 2
        : value === "summerSeason"
        ? 3
        : 1;
    setValue("admit_card_id", numericValue);
  };

  const handleMarkSheetDesignChange = (value: string) => {
    setMarkSheetDesign(value);
    const nValue = value === "gradedFormatWithPR" ? 1 : 1;
    setValue("marksheet_id", nValue);
  };

  const handleSelectAll = (sessionId: number, isChecked: boolean) => {
    const sessionGrades =
      academicSessions
        .find((session: { id: number }) => session.id === sessionId)
        ?.grades?.map((grade) => grade.id) || [];

    if (isChecked) {
      setSelectedGrades((prevSelectedGrades) =>
        Array.from(new Set([...prevSelectedGrades, ...sessionGrades]))
      );
    } else {
      setSelectedGrades((prevSelectedGrades) =>
        prevSelectedGrades.filter((gradeId) => !sessionGrades.includes(gradeId))
      );
    }
  };

  const isAllGradesSelected = (sessionId: number) => {
    const sessionGrades =
      academicSessions
        .find((session) => session.id === sessionId)
        ?.grades?.map((grade) => grade.id) || [];

    return sessionGrades.every((gradeId) => selectedGrades.includes(gradeId));
  };

  useEffect(() => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [academicSessions]);

  const handleAcademicSessionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_session_id", selectedOption.value);
      setSelectedSessionId(selectedOption.value);
    }
  };
  useEffect(() => {
    // Find the exam based on the provided examId
    const selectedExam = examinations.find((exam) => exam.id === examId);

    // If the exam exists and has grades, update selectedGrades
    if (selectedExam?.exam_grades) {
      setSelectedGrades(
        selectedExam?.exam_grades?.map((grade) => grade.grade_id)
      );
      if (selectedExam?.session_level) {
        setSelectedSessionId(selectedExam?.session_level?.session_id);
      }
    }

    console.log(`selectedGrades updated for examId: ${examId}`);
  }, [examId, examinations]); // Include both examId and examinations in the dependency array

  // Logging selectedGrades separately when it updates
  useEffect(() => {
    console.log(`selectedGrades:`, selectedGrades);
  }, [selectedGrades]);

  useEffect(() => {
    setValue("grades", selectedGrades);
    setValue("merged_exams", selectedExams);
  }, [selectedGrades, setValue, selectedExams]);

  const onSubmit: SubmitHandler<ExamFormData> = async (data: ExamFormData) => {
    console.log("Edited data: ", data);
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
        grades: data.grades,
        is_merged: data.is_merged,
        merged_exams: data.merged_exams,
        admit_card_id: data.admit_card_id,
        marksheet_id: data.marksheet_id,
      };
    } catch (error) {
      console.log("Error saving exam data: ", error);
    } finally {
      onSave(examId ?? 0);
    }
  };

  return (
    <div className="edit-exam col-12 col-md-12">
      {isLoading && <Loading />}
      {!isLoading && (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="row ">
            {examinations
              .filter((exam) => exam.id === examId)
              .map((exam) => (
                <div key={exam.id}>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <label className="required fw-bold fs-6 mb-2">
                        Examination Name
                      </label>
                      <div className="col-12">
                        <input
                          {...register("name")}
                          className="form-control form-control-solid required"
                          type="text"
                          value={exam.name}
                        />
                        {errors.name && (
                          <div className="text-danger">
                            {errors.name.message}
                          </div>
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
                              checked={exam.has_symbol_no === true}
                              onChange={handleHasSymbolData}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="useSymbol_yes"
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
                              name="useSymbol"
                              id="useSymbol_no"
                              checked={exam.has_symbol_no === false}
                              onChange={handleHasSymbolData}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="useSymbol_no"
                            >
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
                              checked={exam.has_registration_no === true}
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
                              checked={exam.has_registration_no === false}
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
                    <div className="col-12 mb-7">
                      <DatePicker
                        key={renderKey}
                        onDateChange={(date) =>
                          handleDateChange(date, "startDate")
                        }
                        title="Start Date"
                        errorAD={
                          errors.start_date ? errors.start_date.message : ""
                        }
                        errorBS={
                          errors.start_date_np
                            ? errors.start_date_np.message
                            : ""
                        }
                        valueAD={exam.start_date}
                        valueBS={exam.start_date_np}
                      />
                      {errors.start_date && <p>{errors.start_date.message}</p>}
                    </div>
                    <div className="col-12 mb-7">
                      <DatePicker
                        key={renderKey}
                        onDateChange={(date) =>
                          handleDateChange(date, "endDate")
                        }
                        title="End Date"
                        errorAD={errors.end_date ? errors.end_date.message : ""}
                        errorBS={
                          errors.end_date_np ? errors.end_date_np.message : ""
                        }
                        valueAD={exam.end_date}
                        valueBS={exam.end_date_np}
                      />
                    </div>
                    <div className="col-12 mb-5">
                      <DatePicker
                        key={renderKey}
                        onDateChange={(date) =>
                          handleDateChange(date, "resultDate")
                        }
                        title="Result Date"
                        errorAD={
                          errors.result_date ? errors.result_date.message : ""
                        }
                        errorBS={
                          errors.result_date_np
                            ? errors.result_date_np.message
                            : ""
                        }
                        valueAD={exam.result_date}
                        valueBS={exam.result_date_np}
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
                        className="form-control w-full"
                        title="Admit Card Design"
                        id="admit_card_design"
                        value={exam.exam_attributes.admit_card.name}
                        onChange={(e) => {
                          handleAdmitCardDesignChange(
                            e.target.value === "general"
                              ? "general"
                              : e.target.value
                          );
                        }}
                      >
                        <option value="general">General</option>
                        <option value="employee">Employee</option>
                        <option value="summerSeason">Summer Season</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold fs-6 mb-2 required">
                        Mark Sheet Design
                      </label>
                      <select
                        className="form-control w-full "
                        title="Mark Sheet Design "
                        id="markSheetDesign"
                        value={exam.exam_attributes.mark_sheet.name}
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
                        (Select Only the Grades that are participating on this
                        Exam.)
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
                        placeholder={exam.session_level.session_name}
                        defaultValue={academicSessionOptions.find(
                          (option) =>
                            option.label === exam.session_level.session_name
                        )}
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
                                        checked={selectedGrades.includes(
                                          grade.id
                                        )}
                                        onChange={() =>
                                          handleGradeSelection(grade.id)
                                        }
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
                              <label
                                className="form-check-label"
                                htmlFor="isMerged_no"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        {errors.is_merged && (
                          <div className="text-danger">
                            {errors.is_merged.message}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>

          {isMerged && (
            <>
              <div className="col-12">
                <label className=" fw-bold fs-6 mb-2">
                  Select Examination to be Merged
                </label>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                      {examinations.map((exam) => (
                        <div key={exam.id} className="mb-3">
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
              onClick={handleCancel}
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

export default EditExam;
