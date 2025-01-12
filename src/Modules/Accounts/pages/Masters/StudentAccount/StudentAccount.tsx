import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import SessionGradePicker from "../../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";
import useGrade from "../../../../../Academics/hooks/useGrade";
import { StudentInterface } from "../../../../Student/services/studentService";
import Loading from "../../../../../components/Loading/Loading";
import useFeeStructure from "../../../hooks/useFeeStructure";
import { FeeStructureInterface } from "../../../services/feeStructureService";
import { formatMoneyToNepali } from "../../../../../helpers/formatMoney";
import usePaymentGroup from "../../../hooks/usePaymentGroup";
import useDiscountGroup from "../../../hooks/useDiscountGroup";

const StudentAccount = () => {
  const { getSectionStudents } = useGrade({});

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructureInterface>();
  const [defaultPaymentGroup, setDefaultPaymentGroup] = useState();
  const [defaultDiscountGroup, setDefaultDiscountGroup] = useState();

  const { singleFeeStructure } = useFeeStructure({});
  const { paymentGroups } = usePaymentGroup({});
  const { discountGroups } = useDiscountGroup({});

  const [isLoading, setIsLoading] = useState(false);
  const handleSelectedValuesChange = useCallback(
    async (selectedValues: {
      level: number | null;
      session: number | null;
      grade: number | null;
      section: number | null;
    }) => {
      console.log(selectedValues);

      if (selectedValues.grade && !selectedValues.section) {
        setStudents([]);
        setFeeStructure(undefined);
      }

      if (selectedValues.section && selectedValues.grade) {
        setIsLoading(true);
        const students = await getSectionStudents(selectedValues.section);
        const feeStructure = await singleFeeStructure(selectedValues.grade);
        setStudents(students);
        setFeeStructure(feeStructure);
        setIsLoading(false);
        console.log(feeStructure);
      }
    },
    [getSectionStudents, singleFeeStructure]
  );

  const nonMandatoryFees = feeStructure?.fee_structure_details
    .filter((detail) => detail.item.is_mandatory === false)
    .map((detail) => detail);

  const StudentAccountSchema = z.object({
    formStudents: z.record(
      z.object({
        payment_group_id: z.string(),
        discount_group_id: z.string(),
        non_mandatory_fee_ids: z.array(z.number()).optional(),
        previous_year_balance: z.number().default(0),
        previous_year_balance_type: z.enum(["D", "C"]).default("C"),
        opening_balance: z.number().default(0),
        opening_balance_type: z.enum(["D", "C"]).default("C"),
      })
    ),
  });
  type FormData = z.infer<typeof StudentAccountSchema>;

  interface FormDataRecordReturnProps {
    payment_group_id: string | undefined;
    discount_group_id: string | undefined;
    non_mandatory_fee_ids: number[];
    previous_year_balance: number;
    previous_year_balance_type: "D" | "C";
    opening_balance: number;
    opening_balance_type: "D" | "C";
  }
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(StudentAccountSchema),
    defaultValues: {
      formStudents: students.reduce((acc, student) => {
        acc[student.id] = {
          payment_group_id: "",
          discount_group_id: "",
          non_mandatory_fee_ids: [],
          previous_year_balance: 0,
          previous_year_balance_type: "C",
          opening_balance: 0,
          opening_balance_type: "C",
        };
        return acc;
      }, {} as Record<string, FormDataRecordReturnProps>),
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleDefaultPaymentGroupChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPaymentGroupId = event.target.value;

    students.forEach((student) => {
      setValue(
        `formStudents.${student.id}.payment_group_id`,
        selectedPaymentGroupId
      );
    });
  };

  const handleDefaultDiscountGroupChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDiscountGroupId = event.target.value;

    students.forEach((student) => {
      setValue(
        `formStudents.${student.id}.discount_group_id`,
        selectedDiscountGroupId
      );
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h2>Student Accounts Setup</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <SessionGradePicker
                onChange={handleSelectedValuesChange}
                colSize={3}
              />
            </div>
            {isLoading && <Loading />}
            {!feeStructure && !isLoading && students.length > 0 && (
              <div className=" mt-5 d-flex justify-content-center gap-3 fs-3">
                <span className="badge badge-danger badge-lg">
                  No Fee Structure has been Setup for this Grade
                </span>
                <a
                  href="/accounts/masters/fee-structures"
                  target="_blank"
                  className="badge badge-primary badge-lg text-hover-gray-100"
                >
                  Setup Fee Structure
                </a>
              </div>
            )}
            {feeStructure && !isLoading && students.length > 0 && (
              <>
                <hr />
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <strong className="">
                      Mandatory Fees for {feeStructure?.grade?.name}
                    </strong>
                    {feeStructure?.fee_structure_details
                      .filter((detail) => detail.item.is_mandatory === true)
                      .map((detail) => (
                        <span
                          className="badge badge-lg badge-info"
                          key={detail.id}
                        >
                          {detail.item.name}:
                          {formatMoneyToNepali(detail.amount)} /-
                        </span>
                      ))}
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    <strong className="">Set Default for All</strong>
                    <div>
                      <select
                        className={`form-control form-select w-200px`}
                        onChange={handleDefaultPaymentGroupChange}
                      >
                        <option value="" hidden>
                          Select Payment Group
                        </option>
                        {paymentGroups.map((group) => (
                          <option value={group.id}>{group.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        className={`form-control form-select w-200px`}
                        onChange={handleDefaultDiscountGroupChange}
                      >
                        <option value="" hidden>
                          Select Discount Group
                        </option>
                        {discountGroups.map((group) => (
                          <option value={group.id}>{group.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <hr />

                <table
                  className="table align-middle table-row-dashed fs-6 gy-1 table-hover"
                  id="table_sessions"
                >
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="w-20px">S.N.</th>
                      <th className="w-250px">Name</th>
                      <th className="w-200px text-center">Payment Group</th>
                      <th className="w-200px text-center">Discount Group</th>
                      <th className="text-center">
                        Check Non Mandatory Fees Applicable to the Student
                      </th>
                      <th className="w-200px text-center">
                        Prev. Year Balance
                      </th>
                      <th className="w-200px text-center">Opening Balance</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td className="">
                          <strong>{student.full_name}</strong>
                          <br />
                          <small>
                            {student.grade?.name} (
                            {student.section?.faculty.name}:
                            {student.section?.name})
                          </small>
                        </td>
                        <td>
                          <div>
                            <Controller
                              name={`formStudents.${student.id}.payment_group_id`}
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`form-control form-select ${
                                    errors.formStudents?.[student.id]
                                      ?.payment_group_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  value={field.value || ""}
                                >
                                  <option value="" hidden>
                                    Select Payment Group
                                  </option>
                                  {paymentGroups.map((group) => (
                                    <option value={group.id}>
                                      {group.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <Controller
                              name={`formStudents.${student.id}.discount_group_id`}
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`form-control form-select ${
                                    errors.formStudents?.[student.id]
                                      ?.discount_group_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  value={field.value || ""}
                                >
                                  <option value="" hidden>
                                    Select Discount Group
                                  </option>
                                  {discountGroups.map((group) => (
                                    <option value={group.id}>
                                      {group.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-3 justify-content-center">
                            {nonMandatoryFees?.map((fee) => (
                              <div className="form-check" key={fee.id}>
                                <Controller
                                  name={`formStudents.${student.id}.non_mandatory_fee_ids`}
                                  control={control}
                                  render={({ field }) => {
                                    const value = Array.isArray(field.value)
                                      ? field.value
                                      : [];
                                    return (
                                      <>
                                        <input
                                          type="checkbox"
                                          id={`student-${student.id}-fee-${fee.id}`}
                                          checked={value.includes(fee.id ?? 0)}
                                          onChange={(e) => {
                                            const updatedFees = e.target.checked
                                              ? [...value, fee.id]
                                              : value.filter(
                                                  (id) => id !== fee.id
                                                );
                                            field.onChange(updatedFees);
                                          }}
                                          className="form-check-input"
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`student-${student.id}-fee-${fee.id}`}
                                        >
                                          {fee.item.name}
                                        </label>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="input-group mb-5">
                            <span className="input-group-text">Rs.</span>
                            <Controller
                              name={`formStudents.${student.id}.previous_year_balance`}
                              control={control}
                              render={({ field }) => {
                                console.log("Field Value:", field);
                                return (
                                  <>
                                    <input
                                      {...field}
                                      type="text"
                                      className={`form-control ${
                                        errors.formStudents?.[student.id]
                                          ?.previous_year_balance
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      placeholder="Pr. Yr. Bal."
                                      style={{
                                        width: "100px",
                                      }}
                                    />
                                  </>
                                );
                              }}
                            />
                            <select
                              className={`form-control form-select w-30px text-center no-dropdown`}
                              value={`C`}
                            >
                              <option value="D">Dr</option>
                              <option value="C">Cr</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="input-group mb-5">
                            <span className="input-group-text">Rs.</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Opening Bal."
                              aria-label="Username"
                              style={{
                                width: "100px",
                              }}
                            />
                            <select
                              className={`form-control form-select w-30px text-center no-dropdown`}
                              value={`C`}
                            >
                              <option value="D">Dr</option>
                              <option value="C">Cr</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          {feeStructure && students.length > 0 && (
            <div className="card-footer text-end">
              <button className="btn btn-primary">Submit</button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default StudentAccount;
