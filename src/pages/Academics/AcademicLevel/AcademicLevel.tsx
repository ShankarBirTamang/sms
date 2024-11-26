import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icon";
import axiosInstance from "../../../../axiosConfig";
import Loading from "../../../components/Loading/Loading";

interface AcademicLevel {
  id: number;
  name: string;
  description: string;
}

interface ApiResponse {
  data: AcademicLevel[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const AcademicLevelComponent = () => {
  const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
  const [pagination, setPagination] = useState<ApiResponse["meta"] | null>(
    null
  );
  const [edgeLinks, setEdgeLinks] = useState<ApiResponse["links"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchAcademicLevels = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse>(
        `academics/academic-levels?per_page=10&page=${page}`
      );
      setAcademicLevels(response.data.data);
      setPagination(response.data.meta);
      setEdgeLinks(response.data.links);
    } catch (err) {
      console.error("Error fetching academic levels:", err);
      setError("Failed to fetch academic levels. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicLevels(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  //   Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formMode === "create") {
        // Create logic
        const response = await axiosInstance.post(
          "academics/academic-levels",
          formData
        );
        setAcademicLevels((prev) => [...prev, response.data]); // Append new level
      } else if (formMode === "edit" && currentLevelId) {
        // Edit logic
        const response = await axiosInstance.put(
          `academics/academic-levels/${currentLevelId}`,
          formData
        );
        setAcademicLevels((prev) =>
          prev.map((level) =>
            level.id === currentLevelId ? response.data : level
          )
        );
      }
      resetForm();
    } catch (err) {
      console.error("Error saving academic level:", err);
      setError("Failed to save academic level. Please try again later.");
    }
  };

  //   Reset form to initial state
  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setFormMode("create");
    setCurrentLevelId(null);
    setError("");
  };

  // Handle edit button click
  const handleEditClick = (level: AcademicLevel) => {
    setFormData({ name: level.name, description: level.description });
    setFormMode("edit");
    setCurrentLevelId(level.id);
  };
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {formMode === "create" ? "Add New Level" : "Edit Level"}
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Level Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control form-control mb-3 mb-lg-0"
                        placeholder="Ex: Educator"
                      />
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-control form-control mb-3 mb-lg-0"
                        placeholder="Ex: Detailed description"
                      />
                    </div>
                  </div>
                  <div className="col-12 pt-15 text-center">
                    <button
                      title="reset"
                      type="reset"
                      className="btn btn-light me-3"
                      onClick={resetForm}
                    >
                      Reset
                    </button>
                    <button
                      title="submit"
                      type="submit"
                      className="btn btn-primary"
                    >
                      {formMode === "create" ? "Submit" : "Update"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  Academic Levels
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              {loading && <Loading />}
              {!loading && (
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th className="text-center">SN</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicLevels.map((level) => (
                      <tr key={level.id}>
                        <td className="text-center">{level.id}</td>
                        <td>{level.name}</td>
                        <td>{level.description}</td>
                        <td className="text-end">
                          <button
                            title="edit academic level"
                            type="button"
                            // onClick={() =>}
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

            {/* Pagination */}
            <div className="card-footer">
              {pagination && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {/* Previous Page */}
                    {edgeLinks && (
                      <li
                        className={`page-item ${
                          !edgeLinks.first ? "disabled" : ""
                        }`}
                      >
                        <button
                          title="page-link"
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          disabled={!edgeLinks.first}
                        >
                          First Page
                        </button>
                      </li>
                    )}

                    {/* Page Numbers */}
                    {pagination.links.map((link, index) =>
                      link.url ? (
                        <li
                          key={index}
                          className={`page-item ${link.active ? "active" : ""}`}
                        >
                          <button
                            title="page-link"
                            className="page-link"
                            onClick={() => handlePageChange(Number(link.label))}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        </li>
                      ) : null
                    )}

                    {edgeLinks && (
                      <li
                        className={`page-item ${
                          !edgeLinks.last ? "disabled" : ""
                        }`}
                      >
                        <button
                          title="page-link"
                          className="page-link"
                          onClick={() => handlePageChange(pagination.last_page)}
                          disabled={!edgeLinks.last}
                        >
                          Last Page
                        </button>
                      </li>
                    )}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicLevelComponent;
