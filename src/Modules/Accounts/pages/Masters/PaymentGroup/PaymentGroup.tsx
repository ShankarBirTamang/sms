import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import usePaymentGroup from "../../../hooks/usePaymentGroup";
import {
  PaymentGroupInterface,
  UpdatePaymentGroupInterface,
} from "../../../services/paymentGroupService";
import CustomSelect, {
  Option,
} from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

const PaymentGroup = () => {
  useDocumentTitle("Payment Group");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isPrimary, setIsPrimary] = useState(false);

  const [currentPaymentGroupId, setCurrentPaymentGroupId] = useState<
    number | null
  >(null);

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    paymentGroups,
    isLoading,
    pagination,
    edgeLinks,
    savePaymentGroup,
    updatePaymentGroup,
  } = usePaymentGroup({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await savePaymentGroup(data);
      } else if (formMode === "edit") {
        if (currentPaymentGroupId) {
          await updatePaymentGroup({
            ...data,
            id: currentPaymentGroupId,
          } as UpdatePaymentGroupInterface);
        }
      }
    } catch (error) {
      console.error("Error saving paymentGroup:", error);
      setIsSubmitting(false);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (paymentGroup: PaymentGroupInterface) => {
    reset({
      name: paymentGroup.name,
    });
    setFormMode("edit");
    setCurrentPaymentGroupId(paymentGroup.id ?? 0);
  };

  const resetForm = () => {
    reset({
      name: "",
    });
    setCurrentPaymentGroupId(null);
    setFormMode("create");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative">
                  {formMode === "create" ? "Add New " : "Edit "}
                  Payment Group
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Payment Group Name
                      </label>

                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.name && "is-invalid"
                        }`}
                        placeholder="Ex: VAT 13%"
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-12 pt-15 text-center">
                    <button
                      title="reset"
                      type="reset"
                      className="btn btn-light me-3"
                    >
                      Reset
                    </button>
                    <button
                      title="submit"
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : formMode === "create"
                        ? "Submit"
                        : "Update"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>Payment Groups</span>
                  <div className="d-flex gap-2">
                    <div className="d-flex align-items-center position-relative h-100">
                      <Icon
                        name="searchDark"
                        className="svg-icon svg-icon-1 position-absolute ms-6"
                      />

                      <input
                        type="text"
                        id="data_search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control w-250px ps-14"
                        placeholder="Search PaymentGroup"
                      />
                    </div>

                    <select
                      className="form-control w-50px"
                      title="Items per Page"
                      id="itemsPerPage"
                      value={itemsPerPage ?? "all"}
                      onChange={(e) =>
                        handleItemsPerPageChange(
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="all">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="">
                <div className="">
                  {isLoading && <Loading />}
                  {!isLoading && paymentGroups.length === 0 && (
                    <div className="alert alert-info">
                      No Payment Groups Found
                    </div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_paymentGroups"
                      aria-describedby="table_paymentGroups_info"
                    >
                      <thead>
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="min-w-225px">Name</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {paymentGroups.map((paymentGroup, index) => (
                          <tr key={index} className="odd">
                            <td className="">{paymentGroup.name} </td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() => handleEditClick(paymentGroup)}
                                  className="btn btn-light-info btn-icon btn-sm"
                                >
                                  <Icon name={"edit"} className={"svg-icon"} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer">
              {pagination && (
                <Pagination
                  pagination={pagination}
                  edgeLinks={edgeLinks}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentGroup;
