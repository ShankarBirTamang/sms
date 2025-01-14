import { useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import Loading from "../../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import Pagination from "../../../../components/Pagination/Pagination";
import useDebounce from "../../../../hooks/useDebounce";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import useFaculty from "../../../hooks/useFaculty";
import {
  FacultyInterface,
  UpdateFacultyInterface,
} from "../../../services/facultyService";
import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  description: z.string(),
});

type FormData = z.infer<typeof schema>;

const Faculty = () => {
  useDocumentTitle("Faculties");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    faculties,
    isLoading,
    pagination,
    edgeLinks,
    saveFaculty,
    updateFaculty,
    setError,
    changeFacultyStatus,
  } = useFaculty({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  // header functions
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

  const handleEditClick = (faculty: UpdateFacultyInterface) => {
    reset({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description ?? "",
    });
    setFormMode("edit");
    setCurrentFacultyId(faculty.id);
  };

  const onSubmit = (data: FacultyInterface | UpdateFacultyInterface) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        saveFaculty(data);
      } else if (formMode === "edit") {
        if (currentFacultyId) {
          updateFaculty({ ...data, id: currentFacultyId });
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
  const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
  const resetForm = () => {
    reset({
      name: "",
      code: "",
      description: "",
    });
    setFormMode("create");
    setCurrentFacultyId(null);
    setError("");
  };

  // Add Academic Level Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [processingFacultyId, setProcessingFacultyId] = useState<number | null>(
    null
  );
  const toggleFacultyStatus = async (facultyId: number) => {
    try {
      setProcessingFacultyId(facultyId);
      console.log(facultyId);
      await changeFacultyStatus({ id: facultyId });
      toast.success("Faculty Default set Successfully.");
    } catch (error) {
      console.error("Error updating Faculty status:", error);
    } finally {
      setProcessingFacultyId(null);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {formMode === "create" ? "Add New" : "Edit"} Faculty
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
                        Faculty Name
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
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">Code</label>
                      <input
                        type="text"
                        {...register("code")}
                        className={`form-control ${
                          errors.code && "is-invalid"
                        } form-control mb-3 mb-lg-0`}
                        placeholder="Ex: Educator"
                      />
                      {errors.code && (
                        <span className="text-danger">
                          {errors.code.message}
                        </span>
                      )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Description</label>
                      <textarea
                        {...register("description")}
                        className="form-control form-control mb-3 mb-lg-0"
                        placeholder="Ex: Detailed description"
                        rows={4} // Adjust the rows to fit your design
                      ></textarea>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
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
                  <span>Faculties</span>
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
                  {!isLoading && faculties.length === 0 && (
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
                          <th className="text-center">SN</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th className="text-center">Default</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faculties.map((faculty, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {(currentPage - 1) * (itemsPerPage ?? 1) +
                                index +
                                1}
                            </td>
                            <td>
                              {faculty.name} ({faculty.code})
                            </td>
                            <td>{faculty.description}</td>
                            <td>
                              <ProcessingButton
                                isProcessing={
                                  processingFacultyId === faculty.id
                                }
                                isActive={faculty.is_default ?? false}
                                onClick={() => toggleFacultyStatus(faculty.id)}
                                hoverText={
                                  faculty.is_default ? "Default" : "Set Default"
                                }
                                activeText="Default"
                                inactiveText="Set Default"
                              />
                            </td>
                            <td className="text-end">
                              <button
                                title="edit faculty"
                                type="button"
                                onClick={() => handleEditClick(faculty)}
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

export default Faculty;
