// Vehicles.tsx
import { useState, FormEvent } from "react";
import { icons } from "../../components/Icon/icons";
import { Vehicle } from "../services/transportService";
import useDebounce from "../../hooks/useDebounce";
import useVehicle from "../hooks/useVehicle";
import Icon from "../../components/Icon/Icon";
import Pagination from "../../components/Pagination/Pagination";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay

  const {
    isEditing,
    editingVehicleId,
    handleChange,
    setVehicles,
    vehicles,
    form,
    clearForm,
    setForm,
    setIsEditing,
    addVehicle,
    updateVehicle,
    setEditingVehicleId,
    handleReset,
    pagination,
    edgeLinks,
  } = useVehicle({
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
  //header funtions end

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && editingVehicleId !== null) {
      // Update existing vehicle
      console.log("Updating vehicle:", { ...form, id: editingVehicleId });
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === editingVehicleId
            ? { ...vehicle, ...form, year_made: form.year_made }
            : vehicle
        )
      );
      const updatedVehicles = {
        id: editingVehicleId,
        name: form.name,
        description: "",
        vehicle_type: form.vehicle_type,
        vehicle_condition: "",
        max_capacity: form.max_capacity,
        chassis_number: form.chassis_number,
        model_number: form.model_number,
        year_made: form.year_made,
        vehicle_number: form.vehicle_number,
        note: "",
      };
      updateVehicle(updatedVehicles);
      setIsEditing(false);
      setEditingVehicleId(null);
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: vehicles.length + 1,
        name: form.name,
        description: "",
        vehicle_type: form.vehicle_type,
        vehicle_condition: "",
        max_capacity: form.max_capacity,
        chassis_number: form.chassis_number,
        model_number: form.model_number,
        year_made: form.year_made,
        vehicle_number: form.vehicle_number,
        note: "",
      };

      addVehicle(newVehicle);
      console.log("Adding new vehicle:", newVehicle);
    }
    console.log("Form reset after submit!");
    clearForm();
  };

  //Handling edit click
  const handleEditClick = (vehicle: Vehicle) => {
    console.log("Editing vehicle:", vehicle);
    setForm({
      name: vehicle.name,
      vehicle_type: vehicle.vehicle_type,
      vehicle_number: vehicle.vehicle_number,
      max_capacity: vehicle.max_capacity,
      chassis_number: vehicle.chassis_number,
      model_number: vehicle.model_number,
      year_made: vehicle.year_made,
    });

    setIsEditing(true);
    setEditingVehicleId(vehicle.id);
  };
  const headers = [
    { title: "SN" },
    { title: "Name" },
    { title: "Vehicle Type" },
    { title: "Vehicle Number" },
    { title: "Max Capacity" },
    { title: "Action" },
  ];

  return (
    <div>
      <div className="row">
        {/* Add New Transport Vehicle Form */}
        <div className="col-xl-4 col-md-4  mb-xl-10">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  {isEditing
                    ? "Update Transport Vehicle"
                    : "Add New Transport Vehicle"}
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <div className="row">
                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg : Bus 1, Car 1"
                        required
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        name="vehicle_type"
                        value={form.vehicle_type}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg: Bus, Car"
                        required
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        name="vehicle_number"
                        value={form.vehicle_number}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg: Ko 2 Pa 0202"
                        required
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        name="max_capacity"
                        value={form.max_capacity}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg: 40"
                        required
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="fv-row mb-7">
                    <label className=" fw-bold fs-6 mb-2">Chassis Number</label>
                    <input
                      type="text"
                      name="chassis_number"
                      value={form.chassis_number}
                      className="form-control form-control-solid mb-3 mb-lg-0 "
                      placeholder="Eg: 40"
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className=" fw-bold fs-6 mb-2">Model Number</label>
                      <input
                        type="text"
                        name="model_number"
                        value={form.model_number}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg: 40"
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="fv-row mb-7">
                      <label className=" fw-bold fs-6 mb-2">Year Made</label>
                      <input
                        type="text"
                        name="year_made"
                        value={form.year_made}
                        className="form-control form-control-solid mb-3 mb-lg-0 "
                        placeholder="Eg: 2000"
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Transport Vehicles Table */}
        <div className="col-xl-8 col-md-8  mb-xl-10">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>Transport Vehicles</span>
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
                        placeholder="Search Vehicles"
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
              <table className="table table-striped">
                <thead>
                  <tr className="table">
                    {headers.map((header) => (
                      <th
                        key={header.title}
                        className="text-center font-weight-bold"
                        scope="col"
                      >
                        <strong>{header.title}</strong>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr key={vehicle.id}>
                      <td scope="row" className="text-center align-middle">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.name}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.vehicle_type}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.vehicle_number}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.max_capacity}
                      </td>
                      <td className="text-center ">
                        <button
                          className="btn btn-link "
                          onClick={() => handleEditClick(vehicle)}
                        >
                          {icons.edit}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
};

export default Vehicles;
