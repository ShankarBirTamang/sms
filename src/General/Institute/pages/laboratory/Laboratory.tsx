import { useForm } from "react-hook-form";
import Icon from "../../../../components/Icon/Icon";
import Loading from "../../../../components/Loading/Loading";
import useLaboratories from "../../hooks/useLaboratories";
import {
  FormData,
  LaboratoryForm,
  schema,
  UpdateLaboratoryForm,
} from "../../services/laboratoryService";
import useDebounce from "../../../../hooks/useDebounce";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Pagination from "../../../../components/Pagination/Pagination";
import toast from "react-hot-toast";

const Laboratory = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentLaboratoryId, setCurrentLaboratoryId] = useState<number | null>(
    null
  );
  const {
    isLoading,
    pagination,
    edgeLinks,
    laboratories,
    saveLaboratory,
    updateLaboratory,
    deleteLaboratory,
  } = useLaboratories({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleEditClick = async (laboratory: UpdateLaboratoryForm) => {
    reset({
      name: laboratory.name,
      description: laboratory.description,
    });
    setFormMode("edit");
    setCurrentLaboratoryId(laboratory.id);
  };

  const handleDeleteClick = (laboratory: UpdateLaboratoryForm) => {
    deleteLaboratory(laboratory.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLaboratorySubmit = async (
    data: LaboratoryForm | UpdateLaboratoryForm
  ) => {
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await saveLaboratory(data);
      } else if (formMode === "edit") {
        if (currentLaboratoryId) {
          await updateLaboratory({ id: currentLaboratoryId, ...data });
        } else {
          toast.error("Laboratory ID is required");
        }
      }
    } catch (error) {
      console.log("Error while submitting laboratory", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      description: "",
    });

    setFormMode("create");
    setCurrentLaboratoryId(null);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-3">
          <div className="card-header mb-6">
            <div className="card-title">
              <h1 className="d-flex align-items-center position-relative my-1">
                {formMode === "create"
                  ? "Add New Laboratory"
                  : "Edit Laboratory"}
              </h1>
            </div>
          </div>

          <div className="card-body pt-0">
            <form onSubmit={handleSubmit(handleLaboratorySubmit)}>
              <div className="row">
                <div className="col-12">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Laboratory Name
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Laboratory name is required",
                      })}
                      className={`form-control ${
                        errors.name && "is-invalid"
                      } form-control mb-3 mb-lg-0`}
                      placeholder="Eg: Seminar Hall"
                    />

                    <span className="text-danger">{errors.name?.message}</span>
                  </div>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Description</label>
                    <textarea
                      {...register("description")}
                      className="form-control form-control mb-3 mb-lg-0"
                      placeholder="Eg: Detailed Description"
                      rows={4}
                      style={{ height: "auto" }}
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
                    onClick={() => reset()}
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
        <div className="card mb-3">
          <div className="card-header mb-6">
            <div className="card-title w-100">
              <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                <span>Laboratories</span>
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
                      placeholder="Search Laboratory"
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
                {!isLoading && laboratories.length === 0 && (
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
                        <th>No. of Room</th>
                        <th>Description</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laboratories.map((laboratory, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {currentPage * (itemsPerPage ?? 0) +
                              index +
                              1 -
                              (itemsPerPage ?? 0)}
                          </td>
                          <td>{laboratory.name}</td>
                          <td>{laboratory.description}</td>
                          <td className="text-end">
                            <button
                              title="edit academic laboratory"
                              type="button"
                              onClick={() => handleEditClick(laboratory)}
                              className="btn btn-light-info btn-icon btn-sm"
                            >
                              <Icon name={"edit"} className={"svg-icon"} />
                            </button>
                          </td>
                          <td className="text-end">
                            <button
                              title="delete academic laboratory"
                              type="button"
                              onClick={() => handleDeleteClick(laboratory)}
                              className="btn btn-light-danger btn-icon btn-sm"
                            >
                              <Icon name={"delete"} className={"svg-icon"} />
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
  );
};

export default Laboratory;
