import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import SessionGradePicker from "../../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";
import useGrade from "../../../../../Academics/hooks/useGrade";
import Loading from "../../../../../components/Loading/Loading";
import useFeeStructure from "../../../hooks/useFeeStructure";
import { FeeStructureInterface } from "../../../services/feeStructureService";
import { formatMoneyToNepali } from "../../../../../helpers/formatMoney";
import usePaymentGroup from "../../../hooks/usePaymentGroup";
import useDiscountGroup from "../../../hooks/useDiscountGroup";
import { useAccount } from "../../../hooks/useAccount";
import { StudentAccountInterface } from "../../../services/accountService";
import NepaliCurrencyInput from "../../../../../components/NepaliCurrencyInput/NepaliCurrencyInput";

const StudentAccount = () => {
  // const { getSectionStudents } = useGrade({});

  const [students, setStudents] = useState<StudentAccountInterface[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructureInterface>();
  const [defaultPaymentGroup, setDefaultPaymentGroup] = useState();
  const [defaultDiscountGroup, setDefaultDiscountGroup] = useState();

  const { singleFeeStructure } = useFeeStructure({});
  const { paymentGroups } = usePaymentGroup({});
  const { discountGroups } = useDiscountGroup({});

  const { saveStudentAccount, getStudentAccount } = useAccount({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        // const students = await getSectionStudents(selectedValues.section);
        const feeStructure = await singleFeeStructure(selectedValues.grade);
        const students = await getStudentAccount(
          selectedValues.grade,
          selectedValues.section
        );

        console.log(
          "students at line 50 in StudentAccount/StudentAccount.tsx:",
          students
        );
        setStudents(students ?? []);
        setFeeStructure(feeStructure);
        setIsLoading(false);
        console.log(feeStructure);
      }
    },
    [getStudentAccount, singleFeeStructure]
  );

  const nonMandatoryFees = feeStructure?.fee_structure_details
    .filter((detail) => detail.item.is_mandatory === false)
    .map((detail) => detail);

  const StudentAccountSchema = z.object({
    formStudents: z.record(
      z.object({
        payment_group_id: z.string(),
        discount_group_id: z.string().nullable().optional(),
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
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(StudentAccountSchema),
  });

  useEffect(() => {
    if (students.length > 0) {
      const defaultValues = students.reduce((acc, student) => {
        acc[student.id] = {
          payment_group_id:
            student.payment_groups?.[0]?.id?.toString() ?? undefined,
          discount_group_id:
            student.discount_groups?.[0]?.id?.toString() ?? undefined,
          non_mandatory_fee_ids:
            student.nonMandatoryFees
              ?.map((fee) => fee.id)
              .filter((id): id is number => id !== undefined) || [], // Update this if needed
          previous_year_balance: student.account?.previous_year_balance || 0,
          previous_year_balance_type:
            student.account?.previous_year_balance_type || "C",
          opening_balance: student.account?.opening_balance || 0,
          opening_balance_type: student.account?.opening_balance_type || "C",
        };
        return acc;
      }, {} as Record<string, FormDataRecordReturnProps>);

      console.log("UseEffectDefault", defaultValues);
      reset({ formStudents: defaultValues });
    }
    console.log("UseEffect", students);
  }, [students, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formattedData = Object.entries(data.formStudents).map(
      ([
        id,
        {
          payment_group_id,
          discount_group_id,
          non_mandatory_fee_ids,
          previous_year_balance,
          previous_year_balance_type,
          opening_balance,
          opening_balance_type,
        },
      ]) => ({
        id: Number(id),
        payment_group_id: Number(payment_group_id),
        discount_group_id: Number(discount_group_id),
        non_mandatory_fee_ids: non_mandatory_fee_ids || [],
        previous_year_balance,
        previous_year_balance_type,
        opening_balance,
        opening_balance_type,
      })
    );
    await saveStudentAccount({
      type: "Student",
      studentAccountData: formattedData,
    });
    // console.log(data);
    setIsSubmitting(false);
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
                          key={`MFF-${detail.id}-default`}
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
                          <option
                            key={`GRP-${group.id}-default`}
                            value={group.id}
                          >
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        className={`form-control form-select w-200px`}
                        onChange={handleDefaultDiscountGroupChange}
                      >
                        <option value="">None</option>
                        {discountGroups.map((group) => (
                          <option
                            key={`DG-${group.id}-default`}
                            value={group.id}
                          >
                            {group.name}
                          </option>
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

                      <th className="w-200px text-center">
                        Prev. Year Balance
                      </th>
                      <th className="w-200px text-center">Opening Balance</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {students.map((student, index) => (
                      <React.Fragment key={student.id}>
                        <tr className="dd">
                          <td rowSpan={2}>{index + 1}</td>
                          <td rowSpan={2} className="">
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
                                      <option
                                        key={`PG-${group.id}-${student.id}`}
                                        value={group.id}
                                      >
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
                                      None
                                    </option>
                                    {discountGroups.map((group) => (
                                      <option
                                        key={`DG-${group.id}-${student.id}`}
                                        value={group.id}
                                      >
                                        {group.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              />
                            </div>
                          </td>

                          <td>
                            <div className="input-group">
                              <span
                                className="input-group-text"
                                style={{
                                  width: "20%",
                                }}
                              >
                                Rs.
                              </span>
                              <Controller
                                name={`formStudents.${student.id}.previous_year_balance`}
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <>
                                      <input
                                        {...field}
                                        type="number"
                                        step={`.01`}
                                        className={`form-control ${
                                          errors.formStudents?.[student.id]
                                            ?.previous_year_balance
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        placeholder="Pr. Yr. Bal."
                                        style={{
                                          width: "60%",
                                        }}
                                        value={field.value || 0}
                                        onChange={(e) => {
                                          const value =
                                            parseFloat(e.target.value) || 0;
                                          field.onChange(value);
                                        }}
                                      />
                                    </>
                                  );
                                }}
                              />
                              <Controller
                                name={`formStudents.${student.id}.previous_year_balance_type`}
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <>
                                      <select
                                        {...field}
                                        className={`form-control form-select text-center no-dropdown`}
                                        value={field.value || `C`}
                                        style={{
                                          width: "20%",
                                        }}
                                      >
                                        <option value="D">Dr</option>
                                        <option value="C">Cr</option>
                                      </select>
                                    </>
                                  );
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="input-group">
                              <span
                                className="input-group-text"
                                style={{
                                  width: "20%",
                                }}
                              >
                                Rs.
                              </span>
                              <Controller
                                name={`formStudents.${student.id}.opening_balance`}
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <>
                                      <input
                                        {...field}
                                        type="number"
                                        step={`.01`}
                                        className={`form-control ${
                                          errors.formStudents?.[student.id]
                                            ?.opening_balance
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        placeholder="Pr. Yr. Bal."
                                        style={{
                                          width: "60%",
                                        }}
                                        value={field.value || 0}
                                        onChange={(e) => {
                                          const value =
                                            parseFloat(e.target.value) || 0;
                                          field.onChange(value);
                                        }}
                                      />
                                    </>
                                  );
                                }}
                              />
                              <Controller
                                name={`formStudents.${student.id}.opening_balance_type`}
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <>
                                      <select
                                        {...field}
                                        className={`form-control form-select w-30px text-center no-dropdown`}
                                        value={field.value || `C`}
                                        style={{
                                          width: "20%",
                                        }}
                                      >
                                        <option value="D">Dr</option>
                                        <option value="C">Cr</option>
                                      </select>
                                    </>
                                  );
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <span className="">
                              Check non mandatory Fees For Associated Student:{" "}
                              <strong>{student.full_name}</strong>
                            </span>
                            <div className="d-flex flex-wrap gap-3 mb-3 mt-3">
                              {nonMandatoryFees?.map((fee) => (
                                <div
                                  className="form-check"
                                  key={`Non-m-${fee.id}-${student.id}`}
                                >
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
                                            checked={value.includes(
                                              fee.id ?? 0
                                            )}
                                            onChange={(e) => {
                                              const updatedFees = e.target
                                                .checked
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
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          {feeStructure && students.length > 0 && (
            <div className="card-footer text-end">
              <button
                title="submit"
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default StudentAccount;
