import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useFiscalYear from "../../../hooks/useFiscalYear";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import {
  FiscalYearInterface,
  UpdateFiscalYearInterface,
} from "../../../services/fiscalYearService";
import ProcessingButton from "../../../../../components/ProcessingButton/ProcessingButton";
import useDebounce from "../../../../../hooks/useDebounce";
import DatePicker from "../../../../../components/DatePicker/DatePicker";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

export const FiscalYear = () => {
  useDocumentTitle("Fiscal Years");
  const [renderKey, setRenderKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [startValueAD, setStartValueAD] = useState("");
  const [startValueBS, setStartValueBS] = useState("");

  const [endValueAD, setEndValueAD] = useState("");
  const [endValueBS, setEndValueBS] = useState("");

  const [isActive, setIsActive] = useState(false);
  const [allowEntry, setAllowEntry] = useState(false);

  const [currentFiscalYearId, setCurrentFiscalYearId] = useState<number | null>(
    null
  );
  const [processingFiscalYearId, setProcessingFiscalYearId] = useState<
    number | null
  >(null);

  const {
    fiscalYears,
    isLoading,
    pagination,
    edgeLinks,
    saveFiscalYear,
    updateFiscalYear,
    changeFiscalYearStatus,
  } = useFiscalYear({
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

  const handleEditClick = (fiscalYear: UpdateFiscalYearInterface) => {
    reset({
      name: fiscalYear.name,
      rank: fiscalYear.rank,
      start_date_en: fiscalYear.start_date_en,
      start_date_np: fiscalYear.start_date_np,
      end_date_en: fiscalYear.end_date_en,
      end_date_np: fiscalYear.end_date_np,
      is_active: fiscalYear.is_active,
      allow_entry: fiscalYear.allow_entry,
    });
    handleDateChange(
      {
        bsDate: fiscalYear.start_date_np,
        adDate: fiscalYear.start_date_en,
      },
      "startDate"
    );
    handleDateChange(
      {
        bsDate: fiscalYear.end_date_np,
        adDate: fiscalYear.end_date_en,
      },
      "endDate"
    );
    setFormMode("edit");

    setIsActive(fiscalYear.is_active);
    setAllowEntry(fiscalYear.allow_entry);

    setCurrentFiscalYearId(fiscalYear.id);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const FiscalYearSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    rank: z.number().min(1, { message: "Rank / Position is required" }),
    start_date_en: z.string(),
    start_date_np: z.string(),
    end_date_en: z.string(),
    end_date_np: z.string(),
    is_active: z.boolean(),
    allow_entry: z.boolean(),
    id: z.number().optional(),
  });
  type FormData = z.infer<typeof FiscalYearSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(FiscalYearSchema) });
  useEffect(() => {
    let rank = 1;
    if (fiscalYears && fiscalYears.length > 0) {
      const maxRank = Math.max(...fiscalYears.map((fy) => fy.rank ?? 0));
      rank = maxRank + 1;
    }
    setValue("rank", rank);
    setValue("is_active", false);
    setValue("allow_entry", false);
  }, [fiscalYears, setValue]);

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
  ) => {
    if (field === "startDate") {
      setValue("start_date_en", dates.adDate);
      setValue("start_date_np", dates.bsDate);
      setStartValueAD(dates.adDate);
      setStartValueBS(dates.bsDate);
    } else if (field === "endDate") {
      setValue("end_date_en", dates.adDate);
      setValue("end_date_np", dates.bsDate);
      setEndValueAD(dates.adDate);
      setEndValueBS(dates.bsDate);
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      start_date_en: "",
      start_date_np: "",
      end_date_en: "",
      end_date_np: "",
    });
    setCurrentFiscalYearId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const onSubmit = async (
    data: FiscalYearInterface | UpdateFiscalYearInterface
  ) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveFiscalYear(data);
      } else if (formMode === "edit") {
        if (currentFiscalYearId) {
          await updateFiscalYear({ ...data, id: currentFiscalYearId });
        }
      }
    } catch (error) {
      console.error("Error saving fiscalYear:", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const toggleFiscalYearStatus = async (fiscalYearId: number) => {
    try {
      setProcessingFiscalYearId(fiscalYearId);
      await changeFiscalYearStatus({ id: fiscalYearId });
    } catch (error) {
      console.error("Error updating fiscalYear status:", error);
    } finally {
      setProcessingFiscalYearId(null);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true";
    setIsActive(value);
    setValue("is_active", value);
  };

  const handleAllowEntryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setAllowEntry(value);
    setValue("allow_entry", value);
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
                  Fiscal Years
                </h1>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex">
                  <div className="row">
                    <div className="col-3">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Index
                        </label>
                        <input
                          type="number"
                          {...register("rank", { valueAsNumber: true })}
                          className={`form-control mb-3 mb-lg-0 ${
                            errors.rank && "is-invalid"
                          }`}
                          placeholder="Ex:  1"
                        />
                        {errors.rank && (
                          <span className="text-danger">
                            {errors.rank.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-9">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Fiscal Year Name
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          className={`form-control mb-3 mb-lg-0 ${
                            errors.name && "is-invalid"
                          }`}
                          placeholder="Ex:  Fiscal Year 2081/82"
                        />
                        {errors.name && (
                          <span className="text-danger">
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12 mb-7">
                      <DatePicker
                        key={renderKey}
                        onDateChange={(date: {
                          bsDate: string;
                          adDate: string;
                        }) => handleDateChange(date, "startDate")}
                        title="Start Date"
                        errorAD={
                          errors.start_date_en
                            ? errors.start_date_en.message
                            : ""
                        }
                        errorBS={
                          errors.start_date_np
                            ? errors.start_date_np.message
                            : ""
                        }
                        valueAD={startValueAD}
                        valueBS={startValueBS}
                      />
                    </div>
                    <div className="col-12 mb-7">
                      <DatePicker
                        key={renderKey}
                        onDateChange={(date: {
                          bsDate: string;
                          adDate: string;
                        }) => handleDateChange(date, "endDate")}
                        title="End Date"
                        errorAD={
                          errors.end_date_en ? errors.end_date_en.message : ""
                        }
                        errorBS={
                          errors.end_date_np ? errors.end_date_np.message : ""
                        }
                        valueAD={endValueAD}
                        valueBS={endValueBS}
                      />
                    </div>
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Is Fiscal year Currently Active ?
                        </label>
                        <div className="d-flex gap-3 mb-5">
                          <div className="form-check">
                            <input
                              title="Active"
                              className="form-check-input sectionCheckbox"
                              type="radio"
                              id="is_active_true"
                              value="true"
                              onChange={handleStatusChange}
                              checked={isActive === true}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_true"
                            >
                              Active
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              title="Active"
                              className="form-check-input sectionCheckbox"
                              type="radio"
                              id="is_active_false"
                              value="false"
                              onChange={handleStatusChange}
                              checked={isActive === false}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_false"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>

                        <span className="text-info">
                          Select Active if the fiscal year is currently active.{" "}
                          <br />
                          हाल चालु आर्थिक वर्ष भएमा "Active" चयन गर्नुहोस्।
                        </span>
                        <br />
                        <span className="text-danger">
                          If marked as active, any other active fiscal year will
                          be automatically deactivated. <br />
                          यदि "Active" चिन्हित गरिएको छ भने, अन्य कुनै पनि
                          Active आर्थिक वर्ष स्वतः निष्क्रिय हुनेछ।
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Allow Accounting Entry ?
                        </label>
                        <div className="d-flex gap-3 mb-5">
                          <div className="form-check">
                            <input
                              title="Allow"
                              className="form-check-input sectionCheckbox"
                              type="radio"
                              id="allow"
                              value="true"
                              onChange={handleAllowEntryChange}
                              checked={allowEntry === true}
                            />
                            <label className="form-check-label" htmlFor="allow">
                              Allow
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              title="Dont Allow"
                              className="form-check-input sectionCheckbox"
                              type="radio"
                              id="dontallow"
                              value="false"
                              onChange={handleAllowEntryChange}
                              checked={allowEntry === false}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="dontallow"
                            >
                              Dont Allow
                            </label>
                          </div>
                        </div>

                        <span className="text-info">
                          Mark the "Allow" option to allow voucher entry in a
                          fiscal year that is not active. <br /> गैर-सक्रिय
                          आर्थिक वर्षमा भाउचर प्रविष्टि अनुमति दिनका लागि
                          "Allow" चयन गर्नुहोस्।
                        </span>
                      </div>
                    </div>
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
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span> Fiscal Years</span>
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
                        placeholder="Search Fiscal Year"
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
                  {!isLoading && fiscalYears.length === 0 && (
                    <div className="alert alert-info">
                      No Fiscal Years Found
                    </div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_fiscalYears"
                      aria-describedby="table_fiscalYears_info"
                    >
                      <thead>
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="w-25px">S.N.</th>
                          <th className="min-w-155px">Fiscal Year Name</th>
                          <th className="text-center">Start Date</th>
                          <th className="text-center">End Date</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Entry Allowed</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {fiscalYears.map((fiscalYear, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {(currentPage - 1) * (itemsPerPage ?? 1) +
                                index +
                                1}
                            </td>
                            <td>{fiscalYear.name}</td>
                            <td className="text-center">
                              B.S.:{fiscalYear.start_date_np} <br />
                              A.D.:{fiscalYear.start_date_en}
                            </td>
                            <td className="text-center">
                              B.S.:{fiscalYear.end_date_np} <br />
                              A.D.:{fiscalYear.end_date_en}
                            </td>
                            <td className="text-center">
                              <ProcessingButton
                                isProcessing={
                                  processingFiscalYearId === fiscalYear.id
                                }
                                isActive={fiscalYear.is_active ?? false}
                                onClick={() =>
                                  toggleFiscalYearStatus(fiscalYear.id ?? 0)
                                }
                                hoverText={
                                  fiscalYear.is_active
                                    ? "Deactivate"
                                    : "Activate"
                                }
                                activeText="Active"
                                inactiveText="Inactive"
                              />
                            </td>
                            <td className="text-center">
                              <ProcessingButton
                                isProcessing={
                                  processingFiscalYearId === fiscalYear.id
                                }
                                isActive={fiscalYear.allow_entry ?? false}
                                onClick={() =>
                                  toggleFiscalYearStatus(fiscalYear.id ?? 0)
                                }
                                hoverText={
                                  fiscalYear.is_active ? "Disallow" : "Allow"
                                }
                                activeText="Allowed"
                                inactiveText="Not Allowed"
                              />
                            </td>
                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() =>
                                    handleEditClick(
                                      fiscalYear as UpdateFiscalYearInterface
                                    )
                                  }
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
