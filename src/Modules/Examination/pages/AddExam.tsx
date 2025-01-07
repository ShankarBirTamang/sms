import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Loading from "../../../components/Loading/Loading";
import DatePicker from "../../../components/DatePicker/DatePicker";
import useAcademicSession from "../../../Academics/hooks/useAcademicSession";

interface AddExamProps {
  onSave: () => void;
}
interface ExamFormFields {
  name: string;
  useSymbol: boolean;
  useRegistration: boolean;
  start_date: string;
  start_date_np: string;
  end_date: string;
  end_date_np: string;
  result_date: string;
  result_date_np: string;
  academic_session_id: number;
}

const AddGrade = ({ onSave }: AddExamProps) => {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ExamFormFields>();
  const onSubmit: SubmitHandler<ExamFormFields> = (data) => {
    console.log(data);
  };

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

  useEffect(() => {
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  }, [academicSessions]);

  const handleAcademicSessionChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_session_id", selectedOption.value);
    }
  };

  return (
    <div className="add-grade">
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
                  {...register("name", { required: true })}
                  className="form-control form-control-solid required "
                  type="text"
                />
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
                      className="form-check-input gradeCheckbox"
                      type="radio"
                      value="yes"
                      id="has_symbol_yes"
                      {...register("useSymbol")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="has_symbol_yes"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input gradeCheckbox"
                      type="radio"
                      value="no"
                      id="has_symbol_no"
                      {...register("useSymbol")}
                    />
                    <label className="form-check-label" htmlFor="has_symbol_no">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <label className="required fw-bold fs-6 mb-2">
                Use Registration No
              </label>
              <div className="fv-row mb-7">
                <div className="d-flex mt-3 gap-10">
                  <div className="form-check">
                    <input
                      className="form-check-input gradeCheckbox"
                      type="radio"
                      value="yes"
                      id="has_symbol_yes"
                      {...register("useRegistration")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="has_symbol_yes"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input gradeCheckbox"
                      type="radio"
                      value="no"
                      id="has_registration_no"
                      {...register("useRegistration")}
                    />
                    <label className="form-check-label" htmlFor="has_symbol_no">
                      No
                    </label>
                  </div>
                </div>
              </div>
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
              <CustomSelect
                key={renderKey}
                options={academicSessionOptions}
                onChange={handleAcademicSessionChange}
                error={errors.academic_session_id?.message}
                placeholder="Select Academic Level"
              />
            </div>
            <div className="col-md-6">
              <label className=" fw-bold fs-6 mb-2 required">
                Mark Sheet Design
              </label>
              <CustomSelect
                key={renderKey}
                options={academicSessionOptions}
                onChange={handleAcademicSessionChange}
                error={errors.academic_session_id?.message}
                placeholder="Select Academic Level"
              />
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
export default AddGrade;
