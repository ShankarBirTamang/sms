import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { icons } from "../../components/Icon/icons";
import { Checkpoint, Route } from "../services/routeService";
import useTransportRoute from "../hooks/useTransportRoute";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import Pagination from "../../components/Pagination/Pagination";
import Icon from "../../components/Icon/Icon";

const TransportRoutes = () => {
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay

  const {
    routes,
    setRoutes,
    editingRoute,
    setEditingRoute,
    newRouteName,
    setNewRouteName,
    currentRouteId,
    setCurrentRouteId,

    setCheckpointForm,
    checkpointForm,

    pagination,
    edgeLinks,

    addCheckpoint,
    updateCheckPoint,
    addRoutes,
    updateRoutes,
    editingCheckpoint,
    setEditingCheckpoint,
    handleCancelEdit,
  } = useTransportRoute({
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

  // Save the edited route name
  const handleSaveRouteName = () => {
    if (editingRoute) {
      const updatedRoutes = routes.map((route) =>
        route.id === editingRoute.id
          ? { ...route, name: editingRoute.name }
          : route
      );
      updateRoutes(editingRoute);
      setRoutes(updatedRoutes);
      setEditingRoute(null);
      console.log("Edited route :", editingRoute.name);
      console.log("Current status of routes: ", routes);
    }
  };

  //Handle Adding a New Route
  const handleAddRoute = () => {
    if (newRouteName.trim() !== "") {
      const newRoute: Route = {
        id: routes.length + 1,
        name: newRouteName,
        route_checkpoints: [],
      };
      addRoutes(newRoute);
      setRoutes([...routes, newRoute]);
      setNewRouteName("");
      console.log(`new route Added: ${newRoute.name}`);
      toast.success("Added Successfully !");
    }
  };

  // Open the form to edit a route name
  const handleEditRoute = (route: Route) => {
    const updatedRoute = { id: route.id, name: route.name };

    setEditingRoute(updatedRoute);
  };

  // Populate the form to edit an existing checkpoint
  const handleEditCheckpointForm = (
    routeId: number,
    checkpoint: Checkpoint
  ) => {
    setCurrentRouteId(routeId);
    setCheckpointForm({
      id: checkpoint.id,
      location_name: checkpoint.location_name,
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
    });
    setEditingCheckpoint(true);
  };

  // Open the form to add a checkpoint for a route
  const handleOpenCheckpointForm = (routeId: number) => {
    setCurrentRouteId(routeId);
    setCheckpointForm({ id: 0, location_name: "", latitude: 0, longitude: 0 });
    setEditingCheckpoint(false);
    console.log("Adding Checkpoint ");
  };

  // Handle saving the checkpoint (add or edit)
  const handleSaveCheckpoint = () => {
    const updatedRoutes = routes.map((route) => {
      if (route.id === currentRouteId) {
        const updatedCheckpoints = editingCheckpoint
          ? route.route_checkpoints.map((cp) =>
              cp.id === checkpointForm.id ? { ...checkpointForm } : cp
            )
          : [
              ...route.route_checkpoints,
              {
                id: route.route_checkpoints.length + 1,
                location_name: checkpointForm.location_name || "New Checkpoint",
                latitude: checkpointForm.latitude,
                longitude: checkpointForm.longitude,
              },
            ];
        console.log("Checkpoints status: ", updatedCheckpoints);
        return { ...route, route_checkpoints: updatedCheckpoints };
      }
      return route;
    });
    //API integration for checkpoint(Add /Edit)
    if (editingCheckpoint) {
      const updatedCheckpoint = {
        id: checkpointForm.id,
        location_name: checkpointForm.location_name,
        latitude: checkpointForm.latitude,
        longitude: checkpointForm.longitude,
      };
      updateCheckPoint(updatedCheckpoint);
    } else {
      const newId =
        Math.max(
          ...updatedRoutes.map((route) => route.route_checkpoints.length)
        ) + 1;
      const newCheckpoint = {
        transport_route_id: currentRouteId ?? 0,
        id: newId,
        location_name: checkpointForm.location_name,
        latitude: checkpointForm.latitude,
        longitude: checkpointForm.longitude,
      };
      addCheckpoint(newCheckpoint);
    }
    // setRoutes(updatedRoutes);
    setCurrentRouteId(null);
    setCheckpointForm({ id: 0, location_name: "", latitude: 0, longitude: 0 });
  };

  //Delete checkpoints
  const handleDeleteCheckpoint = (routeId: number, checkpointId: number) => {
    const updatedRoutes = routes.map((route) => {
      if (route.id === routeId) {
        return {
          ...route,
          checkpoints: route.route_checkpoints.filter(
            (checkpoint) => checkpoint.id !== checkpointId
          ),
        };
      }
      console.log("After Delete: ", route.route_checkpoints);
      return route;
    });
    setRoutes(updatedRoutes);
  };

  return (
    <div>
      <div className="row">
        {/* Add Transport Route Form */}
        <div className="col-xl-4 col-md-4  mb-xl-10">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center my-3">
                  {editingRoute
                    ? "Edit Transport Route"
                    : currentRouteId
                    ? editingCheckpoint
                      ? `Edit Checkpoint of ${
                          routes.find((r) => r.id === currentRouteId)?.name
                        }`
                      : `Add Checkpoint of ${
                          routes.find((r) => r.id === currentRouteId)?.name
                        }`
                    : "Add Transport Route"}
                </h1>
              </div>
              <div className="card-body pt-0 pb-4">
                {editingRoute ? (
                  <>
                    <Form.Label className="required">
                      <strong>Route Name</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editingRoute.name}
                      onChange={(e) =>
                        setEditingRoute({
                          ...editingRoute,
                          name: e.target.value,
                        })
                      }
                    />
                    <div className="d-flex gap-3 mt-3">
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <Button variant="primary" onClick={handleSaveRouteName}>
                        Save
                      </Button>
                    </div>
                  </>
                ) : currentRouteId ? (
                  <>
                    <Form.Label className="required">
                      <strong>Checkpoint Name</strong>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={checkpointForm.location_name}
                      onChange={(e) =>
                        setCheckpointForm({
                          ...checkpointForm,
                          location_name: e.target.value,
                        })
                      }
                    />
                    <div className="row my-5">
                      <div className="col-xl-6 col-md-6  mb-xl-10">
                        <Form.Label className="required">
                          <strong>Latitude</strong>
                        </Form.Label>
                        <Form.Control
                          required
                          type="number"
                          value={checkpointForm.latitude}
                          onChange={(e) =>
                            setCheckpointForm({
                              ...checkpointForm,
                              latitude: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-xl-6 col-md-6  mb-xl-10">
                        <Form.Label className="required">
                          <strong>Longitude</strong>
                        </Form.Label>
                        <Form.Control
                          required
                          type="number"
                          value={checkpointForm.longitude}
                          onChange={(e) =>
                            setCheckpointForm({
                              ...checkpointForm,
                              longitude: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="d-flex gap-3 mt-5">
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <Button variant="primary" onClick={handleSaveCheckpoint}>
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Label className="required ">
                      <strong>Route Name</strong>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Eg: Route 1"
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                    />
                    <div className="mt-5">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleAddRoute}
                      >
                        Add Route
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transport Routes Table */}
        <div className="col-xl-8 col-md-8  mb-xl-10">
          <div className="card mb-3">
            <div className="card-header border-0 px-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>Transport Routes</span>
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
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>
                      <strong>SN</strong>
                    </th>
                    <th>
                      <strong>Name</strong>
                    </th>
                    <th>
                      <strong>Route Checkpoints</strong>
                    </th>
                    <th>
                      <strong>Actions</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route, index) => (
                    <tr key={route.id}>
                      <td>{index + 1}</td>
                      <td>{route.name}</td>
                      <td>
                        {route.route_checkpoints.map((cp) => (
                          <div key={cp.id} className="d-flex gap-2 my-2 ">
                            {cp.location_name} ({cp.latitude}, {cp.longitude})
                            <Button
                              variant="success"
                              className="ms-2"
                              style={{ fontSize: "10px", padding: "2px 8px" }}
                              onClick={() =>
                                handleEditCheckpointForm(route.id, cp)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              style={{ fontSize: "10px", padding: "2px 8px" }}
                              onClick={() =>
                                handleDeleteCheckpoint(route.id, cp.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="primary"
                          className="mt-2"
                          style={{ fontSize: "10px", padding: "2px 8px" }}
                          onClick={() => handleOpenCheckpointForm(route.id)}
                        >
                          Add Checkpoint
                        </Button>
                      </td>
                      <td>
                        <Button
                          style={{ fontSize: "10px", padding: "4px 8px" }}
                          variant="warning"
                          onClick={() => handleEditRoute(route)}
                        >
                          {icons.edit}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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

export default TransportRoutes;
