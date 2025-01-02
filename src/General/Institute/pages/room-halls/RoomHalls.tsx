import { set, useForm } from "react-hook-form";
import Icon from "../../../../components/Icon/Icon";
import Loading from "../../../../components/Loading/Loading";
import useRoomHalls from "../../hooks/useRoomHalls";
import {
  FormData,
  RoomHallsForm,
  schema,
  UpdateRoomHallsForm,
} from "../../services/roomHallsService";
import useDebounce from "../../../../hooks/useDebounce";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Pagination from "../../../../components/Pagination/Pagination";
import toast from "react-hot-toast";

const RoomHalls = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentRoomHallId, setCurrentRoomHallId] = useState<number | null>(
    null
  );
  const {
    isLoading,
    pagination,
    edgeLinks,
    roomHalls,
    saveRoomHall,
    updateRoomHall,
    deleteRoomHall,
  } = useRoomHalls({
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

  const handleEditClick = async (roomHall: UpdateRoomHallsForm) => {
    reset({
      name: roomHall.name,
      number: roomHall.number,
      description: roomHall.description,
    });
    setFormMode("edit");
    setCurrentRoomHallId(roomHall.id);
  };

  const handleDeleteClick = (roomHall: UpdateRoomHallsForm) => {
    deleteRoomHall(roomHall.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoomHallSubmit = async (
    data: RoomHallsForm | UpdateRoomHallsForm
  ) => {
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await saveRoomHall(data);
      } else if (formMode === "edit") {
        if (currentRoomHallId) {
          await updateRoomHall({ id: currentRoomHallId, ...data });
        } else {
          toast.error("Room/Hall ID is required");
        }
      }
    } catch (error) {
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      number: 0,
      description: "",
    });

    setFormMode("create");
    setCurrentRoomHallId(null);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-3">
          <div className="card-header mb-6">
            <div className="card-title">
              <h1 className="d-flex align-items-center position-relative my-1">
                {formMode === "create" ? "Add New Room/Hall" : "Edit Room/Hall"}
              </h1>
            </div>
          </div>

          <div className="card-body pt-0">
            <form onSubmit={handleSubmit(handleRoomHallSubmit)}>
              <div className="row">
                <div className="col-12">
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Room/Hall Name
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Room/Hall name is required",
                      })}
                      className={`form-control ${
                        errors.name && "is-invalid"
                      } form-control mb-3 mb-lg-0`}
                      placeholder="Eg: Seminar Hall"
                    />

                    <span className="text-danger">{errors.name?.message}</span>
                  </div>
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      Room/Hall Number
                    </label>
                    <input
                      type="text"
                      {...register("number", {
                        required: "Room/Hall number is required",
                        valueAsNumber: true,
                      })}
                      className={`form-control ${
                        errors.name && "is-invalid"
                      } form-control mb-3 mb-lg-0`}
                      placeholder="Eg: 101"
                    />

                    <span className="text-danger">
                      {errors.number?.message}
                    </span>
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
                <span>Room/Halls</span>
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
                      placeholder="Search Room/Hall"
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
                {!isLoading && roomHalls.length === 0 && (
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
                      {roomHalls.map((roomHall, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {currentPage * (itemsPerPage ?? 0) +
                              index +
                              1 -
                              (itemsPerPage ?? 0)}
                          </td>
                          <td>{roomHall.name}</td>
                          <td>{roomHall.number}</td>
                          <td>{roomHall.description}</td>
                          <td className="text-end">
                            <button
                              title="edit academic roomHall"
                              type="button"
                              onClick={() => handleEditClick(roomHall)}
                              className="btn btn-light-info btn-icon btn-sm"
                            >
                              <Icon name={"edit"} className={"svg-icon"} />
                            </button>
                          </td>
                          <td className="text-end">
                            <button
                              title="delete academic roomHall"
                              type="button"
                              onClick={() => handleDeleteClick(roomHall)}
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

export default RoomHalls;
