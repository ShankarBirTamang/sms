import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import usePaymentType from "../../../hooks/usePaymentType";
import {
  PaymentTypeInterface,
  UpdatePaymentTypeInterface,
} from "../../../services/paymentTypeService";
import CustomSelect, {
  Option,
} from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

const PaymentType = () => {
  useDocumentTitle("Payment Type");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isPrimary, setIsPrimary] = useState(false);

  const [currentPaymentTypeId, setCurrentPaymentTypeId] = useState<
    number | null
  >(null);

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    paymentTypes,
    isLoading,
    pagination,
    edgeLinks,
    savePaymentType,
    updatePaymentType,
  } = usePaymentType({
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
        await savePaymentType(data);
      } else if (formMode === "edit") {
        if (currentPaymentTypeId) {
          await updatePaymentType({
            ...data,
            id: currentPaymentTypeId,
          } as UpdatePaymentTypeInterface);
        }
      }
    } catch (error) {
      console.error("Error saving paymentType:", error);
      setIsSubmitting(false);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (paymentType: PaymentTypeInterface) => {
    reset({
      name: paymentType.name,
    });
    setFormMode("edit");
    setCurrentPaymentTypeId(paymentType.id ?? 0);
  };

  const resetForm = () => {
    reset({
      name: "",
    });
    setCurrentPaymentTypeId(null);
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
                  Payment Type
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Payment Type Name
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
                  <span>Payment Types</span>
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
                        placeholder="Search PaymentType"
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
                  {!isLoading && paymentTypes.length === 0 && (
                    <div className="alert alert-info">
                      No Payment Types Found
                    </div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_paymentTypes"
                      aria-describedby="table_paymentTypes_info"
                    >
                      <thead>
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="min-w-225px">Name</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {paymentTypes.map((paymentType, index) => (
                          <tr key={index} className="odd">
                            <td className="">{paymentType.name} </td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() => handleEditClick(paymentType)}
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

export default PaymentType;
