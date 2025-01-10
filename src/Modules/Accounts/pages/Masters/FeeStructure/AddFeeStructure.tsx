import React, { useEffect, useState } from "react";
import { UpdateGradeInterface } from "../../../../../Academics/services/gradeService";
import { ItemInterface } from "../../../services/itemService";
import Loading from "../../../../../components/Loading/Loading";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import useFeeStructure from "../../../hooks/useFeeStructure";
import { StructureInterface } from "../../../services/feeStructureService";

interface AddFeeStructureProps {
  onAdd: () => void;
  feeStructure: StructureInterface;
  items: ItemInterface[];
}

const feeStructureSchema = z.object({
  fee_structure_details: z.record(
    z.object({
      amount: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d+$/, "Amount must contain only numbers"),
    })
  ),
});
type FormData = z.infer<typeof feeStructureSchema>;

const AddFeeStructure = ({
  onAdd,
  feeStructure,
  items,
}: AddFeeStructureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { saveFeeStructure } = useFeeStructure({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      fee_structure_details: items.reduce((acc, item) => {
        const matchingDetail = feeStructure.structureDetails?.find(
          (detail) => detail.item.id === item.id
        );
        acc[item.id ?? 0] = { amount: matchingDetail?.amount.toString() ?? "" };
        return acc;
      }, {} as Record<string, { amount: string }>),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log(data);

    const formattedData = Object.entries(data.fee_structure_details).map(
      ([id, { amount }]) => ({
        item_id: Number(id),
        amount: amount,
      })
    );
    await saveFeeStructure({
      grade_id: feeStructure.grade.id,
      fee_structure_details: formattedData,
    });
    onAdd();
    setIsSubmitting(false);
  };

  //   useEffect(() => {
  //     console.log(errors);
  //   }, [errors]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table align-middle table-row-dashed fs-6 gy-1">
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                <th className="w-20px">S.N.</th>
                <th className="w-200px">Name</th>
                <th className="w-100px">Fee Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-bold">
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="d-flex flex-column">
                        <span className="text-gray-800 text-hover-primary mb-1">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Controller
                      name={`fee_structure_details.${item.id}.amount`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          className={`form-control custom-form-control ${
                            errors.fee_structure_details?.[item.id ?? 0]?.amount
                              ? "is-invalid"
                              : ""
                          }`}
                          {...field}
                          placeholder="Amount"
                        />
                      )}
                    />
                    {errors.fee_structure_details?.[item.id ?? 0]?.amount && (
                      <div className="invalid-feedback">
                        {
                          errors.fee_structure_details?.[item.id ?? 0]?.amount
                            ?.message
                        }
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center pt-15">
            <button
              type="button"
              className="btn btn-danger me-3"
              //   onClick={handleAutoAssign}
              disabled={isSubmitting}
            >
              Auto Assign
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddFeeStructure;
