import React, { useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Loading from "../../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import Pagination from "../../../../components/Pagination/Pagination";
import useDebounce from "../../../../hooks/useDebounce";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";

import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import toast from "react-hot-toast";
import useSubjectType from "../../../hooks/useSubjectType";
import {
  SubjectTypeInterface,
  UpdateSubjectTypeInterface,
} from "../../../services/subjectTypeService";
import useHelpers from "../../../../hooks/useHelpers";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  marking_scheme: z.enum(["grade", "marks"]).default("marks"),
  is_marks_added: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

const SubjectType = () => {
  useDocumentTitle("Subject Types");
  const { capitalizeFirstLetter } = useHelpers();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [processingSubjectTypeId, setProcessingSubjectTypeId] = useState<
    number | null
  >(null);

  const [markingScheme, setMarkingScheme] = useState<"grade" | "marks">(
    "marks"
  );

  const [marksAdded, setMarksAdded] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const {
    subjectTypes,
    isLoading,
    pagination,
    edgeLinks,
    saveSubjectType,
    updateSubjectType,
    changeSubjectTypeStatus,
    setError,
  } = useSubjectType({
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
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleEditClick = (type: SubjectTypeInterface) => {
    reset({
      name: type.name,
      marking_scheme: type.marking_scheme,
      is_marks_added: type.is_marks_added,
    });
    setMarkingScheme(type.marking_scheme);
    if (type.is_marks_added) {
      setMarksAdded(true);
    } else {
      setMarksAdded(false);
    }
    setFormMode("edit");
    setCurrentSubjectTypeId(type.id ?? 0);
  };

  const onSubmit = (
    data: SubjectTypeInterface | UpdateSubjectTypeInterface
  ) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        saveSubjectType(data);
      } else if (formMode === "edit") {
        if (currentSubjectTypeId) {
          updateSubjectType({ ...data, id: currentSubjectTypeId });
        } else {
          setError("Error Updating Data");
        }
      }
    } catch (error) {
      // setError(error.toString();
      console.error("Error saving academic level:", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };
  const [currentSubjectTypeId, setCurrentSubjectTypeId] = useState<
    number | null
  >(null);
  const resetForm = () => {
    reset({
      name: "",
      marking_scheme: "marks",
      is_marks_added: false,
    });
    setFormMode("create");
    setCurrentSubjectTypeId(null);
    setError("");
  };

  const toggleSubjectTypeStatus = async (typeId: number) => {
    try {
      setProcessingSubjectTypeId(typeId);
      console.log(typeId);
      await changeSubjectTypeStatus({ id: typeId });
      toast.success("Subject Type Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating Subject Type status:", error);
    } finally {
      setProcessingSubjectTypeId(null);
    }
  };

  const handleMarkingSchemeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as "grade" | "marks";
    setMarkingScheme(value);
    setValue("marking_scheme", value);
  };

  const handleMarksAddedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setMarksAdded(value);
    setValue("is_marks_added", value);
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {formMode === "create" ? "Add New" : "Edit"} Subject Type
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              {isSubmitting}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        SubjectType Name
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control ${
                          errors.name && "is-invalid"
                        } form-control mb-3 mb-lg-0`}
                        placeholder="Ex: Educator"
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label
                        className="required fw-bold fs-6 mb-2"
                        htmlFor="grade"
                      >
                        Exam Marking Scheme
                      </label>
                      <div className="d-flex gap-5 mt-3">
                        <div className="form-check">
                          <input
                            title="Standard"
                            className="form-check-input"
                            type="radio"
                            value="grade"
                            id="grade"
                            name="marking_scheme"
                            checked={markingScheme === "grade"}
                            onChange={handleMarkingSchemeChange}
                          />
                          <label className="form-check-label" htmlFor="grade">
                            Grade i.e.: A+, A
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            title="Custom"
                            className="form-check-input"
                            type="radio"
                            value="marks"
                            name="marking_scheme"
                            id="marks"
                            checked={markingScheme === "marks"}
                            onChange={handleMarkingSchemeChange}
                          />
                          <label className="form-check-label" htmlFor="marks">
                            Marks
                          </label>
                        </div>
                      </div>
                      {errors.marking_scheme && (
                        <span className="text-danger">
                          {errors.marking_scheme.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label
                        className="required fw-bold fs-6 mb-2"
                        htmlFor="grade"
                      >
                        Marks added in Result?
                      </label>
                      <div className="d-flex gap-5 mt-3">
                        <div className="form-check">
                          <input
                            title="Yes"
                            className="form-check-input"
                            type="radio"
                            value="true"
                            id="yes"
                            name="marks_added"
                            checked={marksAdded === true}
                            onChange={handleMarksAddedChange}
                          />
                          <label className="form-check-label" htmlFor="yes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            title="No"
                            className="form-check-input"
                            type="radio"
                            value="false"
                            name="marks_added"
                            id="no"
                            checked={marksAdded === false}
                            onChange={handleMarksAddedChange}
                          />
                          <label className="form-check-label" htmlFor="no">
                            No
                          </label>
                        </div>
                      </div>
                      {errors.is_marks_added && (
                        <span className="text-danger">
                          {errors.is_marks_added.message}
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
                      disabled={isSubmitting} // Disable button while submitting
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
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>All Subject Types</span>
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
                        placeholder="Search Faculties"
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
              <div className="table">
                <div className="table-responsive">
                  {isLoading && <Loading />}
                  {!isLoading && subjectTypes.length === 0 && (
                    <div className="alert alert-info">
                      No Academic Levels Found
                    </div>
                  )}
                  {!isLoading && (
                    <table className="table table-striped table-sm">
                      <thead
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        <tr>
                          <th>S.N.</th>
                          <th>Name</th>
                          <th className="text-center">Marking Scheme</th>
                          <th className="text-center">Default</th>
                          <th className="text-center">Marks Added</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectTypes.map((type, index) => (
                          <tr key={index}>
                            <td>
                              {" "}
                              {(currentPage - 1) * (itemsPerPage ?? 1) +
                                index +
                                1}
                            </td>
                            <td>{type.name}</td>
                            <td className="text-center">
                              {capitalizeFirstLetter(type.marking_scheme)}
                            </td>
                            <td className="text-center">
                              <ProcessingButton
                                isProcessing={
                                  processingSubjectTypeId === type.id
                                }
                                isActive={type.is_active ?? false}
                                onClick={() =>
                                  toggleSubjectTypeStatus(type.id ?? 0)
                                }
                                hoverText={
                                  type.is_active ? "Deactive" : "Activate"
                                }
                                activeText="Active"
                                inactiveText="Inactive"
                              />
                            </td>
                            <td className="text-center">
                              {type.is_marks_added == true ? (
                                <span className="badge bg-success">Yes</span>
                              ) : (
                                <span className="badge bg-danger">No</span>
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                title="edit type"
                                type="button"
                                onClick={() => handleEditClick(type)}
                                className="btn btn-light-info btn-icon btn-sm"
                              >
                                <Icon name={"edit"} className={"svg-icon"} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="card-footer">
              <Pagination
                pagination={pagination}
                edgeLinks={edgeLinks}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubjectType;
