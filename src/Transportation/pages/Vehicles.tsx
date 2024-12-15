// Vehicles.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { icons } from "../../components/Icon/icons";
import { Vehicle, VehicleForm } from "../services/transportService";
import useDebounce from "../../hooks/useDebounce";
import useVehicle from "../hooks/useVehicle";
import toast from "react-hot-toast";

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
    setEditingVehicleId,
  } = useVehicle();
  // {
  // search: debouncedSearchTerm,
  // currentPage,
  // itemsPerPage,
  // }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && editingVehicleId !== null) {
      // Update existing vehicle
      console.log("Updating vehicle:", { ...form, id: editingVehicleId });
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === editingVehicleId
            ? { ...vehicle, ...form, capacity: Number(form.capacity) }
            : vehicle
        )
      );
      toast.success("Vehicle updated Succesfully!");
      setIsEditing(false);
      setEditingVehicleId(null);
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: vehicles.length + 1,
        name: form.name,
        type: form.type,
        number: form.number,
        capacity: Number(form.capacity),
      };
      toast.success("Vehicle added succesfully!");
      console.log("Adding new vehicle:", newVehicle);
      setVehicles([...vehicles, newVehicle]);
    }
    console.log("Form reset after submit:");
    clearForm();
  };
  const handleEdit = (vehicle: Vehicle) => {
    console.log("Editing vehicle:", vehicle);
    setForm({
      name: vehicle.name,
      type: vehicle.type,
      number: vehicle.number,
      capacity: vehicle.capacity.toString(),
      chassis: "",
      model: "",
      year: "",
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
                        name="type"
                        value={form.type}
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
                        name="number"
                        value={form.number}
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
                        name="capacity"
                        value={form.capacity}
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
                      name="chassis"
                      value={form.chassis}
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
                        name="model"
                        value={form.model}
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
                        type="number"
                        name="year"
                        value={form.year}
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
                    onClick={clearForm}
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
          <div className="card ">
            <div className="card-header border-0 px-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  Transport Vehicles
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
                        {vehicle.type}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.number}
                      </td>
                      <td className="text-center align-middle">
                        {vehicle.capacity}
                      </td>
                      <td className="text-center ">
                        <button
                          className="btn btn-link "
                          onClick={() => handleEdit(vehicle)}
                        >
                          {icons.edit}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
