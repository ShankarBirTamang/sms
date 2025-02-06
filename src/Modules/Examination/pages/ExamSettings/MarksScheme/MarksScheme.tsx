import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import useMarksScheme from "../../../hooks/useMarksScheme";
import {
  CreateMarksSchemeInterface,
  UpdateMarksSchemeInterface,
} from "../../../services/marksSchemeService";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  short_name: z.string().min(1, "Short Name is required."),
  group: z.enum(["Theory", "Practical"], {
    errorMap: () => ({
      message: "Group is Required.",
    }),
  }),
});

type FormData = z.infer<typeof schema>;

const MarksScheme = () => {
  useDocumentTitle("Marks Schemes");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const {
    marksSchemes,
    isLoading,
    pagination,
    edgeLinks,
    saveMarksScheme,
    updateMarksScheme,
    setError,
  } = useMarksScheme({
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEditClick = (marksScheme: UpdateMarksSchemeInterface) => {
    reset({
      name: marksScheme.name,
      short_name: marksScheme.short_name,
      group: marksScheme.group,
    });
    setFormMode("edit");
    setCurrentMarksSchemeId(marksScheme.id);
  };

  const onSubmit = async (
    data: CreateMarksSchemeInterface | UpdateMarksSchemeInterface
  ) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveMarksScheme(data);
      } else if (formMode === "edit") {
        if (currentMarksSchemeId) {
          await updateMarksScheme({ ...data, id: currentMarksSchemeId });
        } else {
          setError("Error Updating Data");
        }
      }
    } catch (error) {
      console.error("Error saving academic marksScheme:", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };
  const [currentMarksSchemeId, setCurrentMarksSchemeId] = useState<
    number | null
  >(null);
  const resetForm = () => {
    reset({
      name: "",
      short_name: "",
      group: undefined,
    });
    setFormMode("create");
    setCurrentMarksSchemeId(null);
    setError("");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {formMode === "create"
                    ? "Add New MarksScheme"
                    : "Edit MarksScheme"}
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        MarksScheme Name
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control ${
                          errors.name && "is-invalid"
                        } form-control mb-3 mb-lg-0`}
                        placeholder="Ex: Theory"
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2 required">
                        Short Name
                      </label>
                      <input
                        type="text"
                        {...register("short_name")}
                        className={`form-control ${
                          errors.short_name && "is-invalid"
                        } form-control mb-3 mb-lg-0`}
                        placeholder="Ex: Theory"
                      />
                      {errors.short_name && (
                        <span className="text-danger">
                          {errors.short_name.message}
                        </span>
                      )}
                    </div>{" "}
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2 required">
                        Marks Group (Theory/Practical)
                      </label>
                      <select
                        className={`form-control ${
                          errors.group && "is-invalid"
                        }`}
                        title="Mark Sheet Design "
                        id="markSheetDesign"
                        {...register("group")}
                        defaultValue={""}
                      >
                        <option value="" hidden>
                          Select Marks Group
                        </option>
                        <option value="Theory">Theory</option>
                        <option value="Practical">Practical</option>
                      </select>
                      {errors.group && (
                        <span className="text-danger">
                          {errors.group.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12 pt-15 text-center">
                    <button
                      title="reset"
                      type="reset"
                      onClick={resetForm}
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
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>Marks Schemes</span>
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
                        placeholder="Search Marks Schemes"
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
                  {!isLoading && marksSchemes.length === 0 && (
                    <div className="alert alert-info">
                      No Marks Schemes Found
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
                          <th>Group</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksSchemes.map((marksScheme, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {(currentPage - 1) * (itemsPerPage ?? 1) +
                                index +
                                1}
                            </td>
                            <td>{marksScheme.name}</td>
                            <td>{marksScheme.group}</td>
                            <td className="text-end">
                              <button
                                title="edit academic marksScheme"
                                type="button"
                                onClick={() => handleEditClick(marksScheme)}
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
            {}
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

export default MarksScheme;
