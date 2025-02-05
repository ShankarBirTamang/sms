import { useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Loading from "../../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import Pagination from "../../../../components/Pagination/Pagination";
import useDebounce from "../../../../hooks/useDebounce";
import useAcademicSession from "../../hooks/useAcademicSession";
import useAcademicLevels from "../../hooks/useAcademicLevels";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import CustomSelect, {
  Option,
} from "../../../../components/CustomSelect/CustomSelect";
import {
  AcademicSessionInterface,
  UpdateAcademicSessionInterface,
} from "../../services/academicSessionService";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AcademicSession = () => {
  useDocumentTitle("Academic Sessions");
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
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const { academicLevels } = useAcademicLevels({});
  const [renderKey, setRenderKey] = useState("");

  const [selectedAcademicLevel, setSelectedAcademicLevel] =
    useState<Option | null>(null);

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    start_date: z.string(),
    start_date_np: z.string(),
    end_date: z.string(),
    end_date_np: z.string(),
    academic_level_id: z.number().refine(
      (id) => {
        return academicLevels.some((level) => level.id === id);
      },
      {
        message: "Invalid academic level ID",
      }
    ),
  });

  type FormData = z.infer<typeof schema>;

  const {
    academicSessions,
    isLoading,
    pagination,
    edgeLinks,
    saveAcademicSession,
    updateAcademicSession,
    changeAcademicSessionStatus,
  } = useAcademicSession({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const academicLevelOptions = academicLevels
    .filter((level) => level)
    .map((level) => ({
      value: level.id,
      label: level.name,
    }));

  const handleAcademicLevelChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("academic_level_id", selectedOption.value);
    }
  };

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
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (
    data: AcademicSessionInterface | UpdateAcademicSessionInterface
  ) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveAcademicSession(data);
        toast.success("Academic Session Added Successfully.");
      } else if (formMode === "edit") {
        if (currentSessionId) {
          await updateAcademicSession({ ...data, id: currentSessionId });
          toast.success("Academic Session Updated Successfully.");
        }
      }
    } catch (error) {
      console.error("Error saving session:", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (
    dates: { bsDate: string; adDate: string },
    field: "startDate" | "endDate"
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
    }
  };

  const handleEditClick = (session: UpdateAcademicSessionInterface) => {
    reset({
      name: session.name,
      academic_level_id: session.academic_level_id,
      start_date: session.start_date,
      start_date_np: session.start_date_np,
      end_date: session.end_date,
      end_date_np: session.end_date_np,
    });
    setValue("academic_level_id", session.academic_level_id);
    handleDateChange(
      {
        bsDate: session.start_date_np,
        adDate: session.start_date,
      },
      "startDate"
    );
    handleDateChange(
      {
        bsDate: session.end_date_np,
        adDate: session.end_date,
      },
      "endDate"
    );
    setFormMode("edit");
    const academicLevel = academicLevelOptions.find(
      (level) => level.value === session.academic_level_id
    );
    setSelectedAcademicLevel(academicLevel || null);
    setCurrentSessionId(session.id);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const resetForm = () => {
    reset({
      name: "",
      academic_level_id: undefined,
      start_date: "",
      start_date_np: "",
      end_date: "",
      end_date_np: "",
    });
    setSelectedAcademicLevel(null);
    setCurrentSessionId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const [processingSessionId, setProcessingSessionId] = useState<number | null>(
    null
  );
  const toggleSessionStatus = async (sessionId: number) => {
    try {
      setProcessingSessionId(sessionId);
      console.log(sessionId);
      await changeAcademicSessionStatus({ id: sessionId });
      toast.success("Academic Session Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating session status:", error);
    } finally {
      setProcessingSessionId(null);
    }
  };
  const navigate = useNavigate();

  const handleNavigate = (sessionId: number) => {
    navigate(`${sessionId}/show`);
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
                  Academic Sessions
                </h1>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex">
                  <div className="row">
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Level
                        </label>
                        <CustomSelect
                          key={renderKey}
                          options={academicLevelOptions}
                          onChange={handleAcademicLevelChange}
                          error={errors.academic_level_id?.message}
                          defaultValue={selectedAcademicLevel}
                          placeholder="Select Academic Level"
                        />
                        {errors.academic_level_id && (
                          <span className="text-danger">
                            {errors.academic_level_id.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Session Name
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          className={`form-control mb-3 mb-lg-0 ${
                            errors.name && "is-invalid"
                          }`}
                          placeholder="Ex: Academic Year 2078-79"
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
                        valueAD={startValueAD}
                        valueBS={startValueBS}
                      />
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
                        valueAD={endValueAD}
                        valueBS={endValueBS}
                      />
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
                  <span>Academic Sessions</span>
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
                        placeholder="Search Session"
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
                  {!isLoading && academicLevels.length === 0 && (
                    <div className="alert alert-info">
                      No Academic Sessions Found
                    </div>
                  )}
                  {!isLoading && (
                    <table className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer">
                      <thead>
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="w-30">SN.</th>
                          <th className="min-w-225px">Session Name</th>
                          <th className="">Level</th>
                          <th className="min-w-125px">Start Date</th>
                          <th className="min-w-125px">End Date</th>
                          <th className="">Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {academicSessions.map((session, index) => (
                          <tr key={index} className="odd">
                            <td>
                              {(currentPage - 1) * (itemsPerPage ?? 1) +
                                index +
                                1}
                            </td>
                            <td className="sorting_1">{session.name}</td>
                            <td>{session.academic_level}</td>
                            <td>
                              B.S.:{session.start_date_np} <br />
                              A.D.:{session.start_date}
                            </td>
                            <td>
                              B.S.:{session.end_date_np} <br />
                              A.D.:{session.end_date}
                            </td>
                            <td>
                              <ProcessingButton
                                isProcessing={
                                  processingSessionId === session.id
                                }
                                isActive={session.is_active ?? false}
                                onClick={() => toggleSessionStatus(session.id)}
                                hoverText={
                                  session.is_active ? "Deactivate" : "Activate"
                                }
                                activeText="Active"
                                inactiveText="Inactive"
                              />
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() => handleEditClick(session)}
                                  className="btn btn-light-info btn-icon btn-sm"
                                >
                                  <Icon name={"edit"} className={"svg-icon"} />
                                </button>
                                <button
                                  title="View Details"
                                  type="button"
                                  onClick={() => handleNavigate(session.id)}
                                  className="btn btn-sm btn-light-success btn-icon"
                                >
                                  <Icon name={"eye"} className={"svg-icon"} />
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

export default AcademicSession;
