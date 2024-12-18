import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { icons } from "../../components/Icon/icons";
import { Checkpoint, Route } from "../services/routeService";
import useTransportRoute from "../hooks/useTransportRoute";
import toast from "react-hot-toast";

const TransportRoutes = () => {
  const {
    routes,
    setRoutes,
    editingRoute,
    setEditingRoute,
    newRouteName,
    setNewRouteName,
    currentRouteId,
    setCurrentRouteId,
    checkpointName,
    setCheckpointForm,
    checkpointForm,
    setCheckpointName,
    handleReset,
    handleEditRoute,
    editingCheckpoint,
    setEditingCheckpoint,
    handleCancelEdit,
  } = useTransportRoute();

  // Save the edited route name
  const handleSaveRouteName = () => {
    if (editingRoute) {
      const updatedRoutes = routes.map((route) =>
        route.id === editingRoute.id
          ? { ...route, name: editingRoute.name }
          : route
      );
      setRoutes(updatedRoutes);
      setEditingRoute(null);
      console.log("Edited route :", editingRoute.name);
      console.log("Current status of routes: ", routes);
      toast.success("Updated Successfully");
    }
  };

  //Handle Adding a New Route
  const handleAddRoute = () => {
    if (newRouteName.trim() !== "") {
      const newRoute: Route = {
        id: routes.length + 1,
        name: newRouteName,
        checkpoints: [],
      };
      setRoutes([...routes, newRoute]);
      setNewRouteName("");
      console.log(`new route Added: ${newRoute.name}`);
      toast.success("Added Successfully !");
    }
  };

  // Populate the form to edit an existing checkpoint
  const handleEditCheckpointForm = (
    routeId: number,
    checkpoint: Checkpoint
  ) => {
    setCurrentRouteId(routeId);
    setCheckpointForm({
      id: checkpoint.id,
      name: checkpoint.name,
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
    });
    setEditingCheckpoint(true);
  };
  // Open the form to add a checkpoint for a route
  const handleOpenCheckpointForm = (routeId: number) => {
    setCurrentRouteId(routeId);
    setCheckpointForm({ id: 0, name: "", latitude: 0, longitude: 0 });
    setEditingCheckpoint(false);
    console.log("Adding Checkpoint ");
  };
  // Handle saving the checkpoint (add or edit)
  const handleSaveCheckpoint = () => {
    const updatedRoutes = routes.map((route) => {
      if (route.id === currentRouteId) {
        const updatedCheckpoints = editingCheckpoint
          ? route.checkpoints.map((cp) =>
              cp.id === checkpointForm.id ? { ...checkpointForm } : cp
            )
          : [
              ...route.checkpoints,
              {
                id: route.checkpoints.length + 1,
                name: checkpointForm.name || "New Checkpoint",
                latitude: checkpointForm.latitude,
                longitude: checkpointForm.longitude,
              },
            ];
        console.log("Checkpoints status: ", updatedCheckpoints);
        return { ...route, checkpoints: updatedCheckpoints };
      }
      return route;
    });
    if (editingCheckpoint) {
      toast.success("Edited successfully!");
    } else {
      toast.success("Added successfully!");
    }
    setRoutes(updatedRoutes);
    setCurrentRouteId(null);
    setCheckpointForm({ id: 0, name: "", latitude: 0, longitude: 0 });
  };

  //Delete checkpoints
  const handleDeleteCheckpoint = (routeId: number, checkpointId: number) => {
    const updatedRoutes = routes.map((route) => {
      if (route.id === routeId) {
        return {
          ...route,
          checkpoints: route.checkpoints.filter(
            (checkpoint) => checkpoint.id !== checkpointId
          ),
        };
      }
      console.log("After Delete: ", route.checkpoints);
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
                      value={checkpointForm.name}
                      onChange={(e) =>
                        setCheckpointForm({
                          ...checkpointForm,
                          name: e.target.value,
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
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative my-1">
                  Transport Routes
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
                        {route.checkpoints.map((cp) => (
                          <div key={cp.id} className="d-flex gap-2 my-2 ">
                            {cp.name} ({cp.latitude}, {cp.longitude})
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportRoutes;
