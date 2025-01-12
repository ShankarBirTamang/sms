import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import toast from "react-hot-toast";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import useTaxCategory from "../../../hooks/useTaxCategory";
import {
  TaxCategoryInterface,
  CreateTaxCategoryInterface,
  UpdateTaxCategoryInterface,
} from "../../../services/taxCategoryService";
import CustomSelect, {
  Option,
} from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

const TaxCategory = () => {
  useDocumentTitle("Tax Category");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isPrimary, setIsPrimary] = useState(false);

  const [currentTaxCategoryId, setCurrentTaxCategoryId] = useState<
    number | null
  >(null);

  const [renderKey, setRenderKey] = useState("");

  const [selectedTaxCategory, setSelectedTaxCategory] = useState<Option | null>(
    null
  );

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(["Goods", "Service"]),
    zero_tax_type: z
      .enum(["Exempt", "Zero Rated", "Tax Paid"])
      .nullable()
      .optional(),
    rate_local: z.number(),
    rate_imp_exp: z.number().optional().default(0),
    tax_on_mrp: z.boolean().optional().default(false),
    calculated_tax_on: z.number().optional(),
    tax_on_mrp_mode: z.enum(["Inclusive"]).nullable().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    taxCategorys,
    allTaxCategorys,
    isLoading,
    pagination,
    edgeLinks,
    saveTaxCategory,
    updateTaxCategory,
  } = useTaxCategory({
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

  const watchedType = watch("type");
  const onSubmit = async (data: FormData) => {
    console.log(
      "data at line 118 in TaxCategory/TaxCategory.tsx:",
      JSON.stringify(data)
    );

    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveTaxCategory(data as CreateTaxCategoryInterface);
      } else if (formMode === "edit") {
        if (currentTaxCategoryId) {
          await updateTaxCategory({
            ...data,
            id: currentTaxCategoryId,
          } as UpdateTaxCategoryInterface);
        }
      }
    } catch (error) {
      console.error("Error saving taxCategory:", error);
      setIsSubmitting(false);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (taxCategory: TaxCategoryInterface) => {
    console.log(
      "taxCategory at line 125 in TaxCategory/TaxCategory.tsx:",
      taxCategory
    );

    reset({
      name: taxCategory.name,
      type: taxCategory.type,
      zero_tax_type: taxCategory.zero_tax_type,
      rate_local: taxCategory.rate_local,
      rate_imp_exp: taxCategory.rate_imp_exp,
      tax_on_mrp: taxCategory.tax_on_mrp,
      calculated_tax_on: taxCategory.calculated_tax_on ?? undefined,
      tax_on_mrp_mode: taxCategory.tax_on_mrp_mode,
    });
    setFormMode("edit");

    setCurrentTaxCategoryId(taxCategory.id);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const resetForm = () => {
    reset({
      name: "",
    });
    setSelectedTaxCategory(null);
    setCurrentTaxCategoryId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative">
                  {formMode === "create" ? "Add New " : "Edit "}
                  Tax Category
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-8">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Tax Category Name
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
                  <div className="col-4">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Tax Type
                      </label>
                      <Controller
                        name={`type`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`form-control form-select ${
                              errors.type ? "is-invalid" : ""
                            }`}
                            value={field.value || ""}
                          >
                            <option value="" hidden>
                              Select Tax Type
                            </option>
                            <option value="Goods">Goods</option>
                            <option value="Service">Service</option>
                          </select>
                        )}
                      />
                      {errors.type && (
                        <span className="text-danger">
                          {errors.type.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {watchedType === "Service" && (
                    <div className="col-4">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Service Tax
                        </label>

                        <div className="input-group">
                          <input
                            type="number"
                            step={"0.01"}
                            {...register("rate_local", {
                              valueAsNumber: true,
                            })}
                            className={`form-control mb-3 mb-lg-0 ${
                              errors.rate_local && "is-invalid"
                            }`}
                            placeholder="Ex: 13"
                          />
                          <span className="input-group-text">%</span>
                        </div>
                        {errors.rate_local && (
                          <span className="text-danger">
                            {errors.rate_local.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {watchedType === "Goods" && (
                    <>
                      <div className="col-6">
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Rate of Tax (Local)
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              step={"0.01"}
                              {...register("rate_local", {
                                valueAsNumber: true,
                              })}
                              className={`form-control mb-3 mb-lg-0 ${
                                errors.rate_local && "is-invalid"
                              }`}
                              placeholder="Ex: 13"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                          {errors.rate_local && (
                            <span className="text-danger">
                              {errors.rate_local.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Rate of Tax (EXp./Imp.)
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              step={"0.01"}
                              {...register("rate_imp_exp", {
                                valueAsNumber: true,
                              })}
                              className={`form-control mb-3 mb-lg-0 ${
                                errors.rate_imp_exp && "is-invalid"
                              }`}
                              placeholder="Ex: 13"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                          {errors.rate_imp_exp && (
                            <span className="text-danger">
                              {errors.rate_imp_exp.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Zero Tax Type
                          </label>
                          <Controller
                            name={`zero_tax_type`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`form-control form-select ${
                                  errors.zero_tax_type ? "is-invalid" : ""
                                }`}
                                value={field.value || ""}
                              >
                                <option value="" hidden>
                                  Select Zero Tax Type
                                </option>
                                <option value="Exempt">Exempt</option>
                                <option value="Zero Rated">Zero Rated</option>
                                <option value="Tax Paid">Tax Paid</option>
                              </select>
                            )}
                          />
                          {errors.zero_tax_type && (
                            <span className="text-danger">
                              {errors.zero_tax_type.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

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
                  <span> Tax Categories</span>
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
                        placeholder="Search TaxCategory"
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
                  {!isLoading && taxCategorys.length === 0 && (
                    <div className="alert alert-info">
                      No Tax Categorys Found
                    </div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_taxCategorys"
                      aria-describedby="table_taxCategorys_info"
                    >
                      <thead>
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="min-w-225px">Name</th>
                          <th className="text-center">Tax Type</th>
                          <th className="">Rate</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {taxCategorys.map((taxCategory, index) => (
                          <tr key={index} className="odd">
                            <td className="">{taxCategory.name} </td>
                            <td className="text-center">{taxCategory.type}</td>
                            <td>{taxCategory.rate_local}%</td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() => handleEditClick(taxCategory)}
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

export default TaxCategory;
