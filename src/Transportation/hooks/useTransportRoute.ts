import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { CanceledError } from "../../services/apiClient";
import {
    ApiResponseInterface,
    PaginationAndSearch,
} from "../../Interface/Interface";
import transportService,{ Checkpoint, Route } from "../services/routeService";

import React from 'react'

const useTransportRoute = (
    // {
    //     search = "",
    //     currentPage = 1,
    //     itemsPerPage = null,
    //   }: PaginationAndSearch
) => {  
    const [routes, setRoutes] = useState<Route[]>([
        {
          id: 1,
          name: "Route 1",
          checkpoints: [
            { id: 1, name: "DefaultCheckpoints", latitude: 0, longitude: 0 },
          ],
        },
      ]);
      const [newRouteName, setNewRouteName] = useState("");
      const [checkpointName, setCheckpointName] = useState("");
      const [currentRouteId, setCurrentRouteId] = useState<number | null>(null);
      const [checkpointForm, setCheckpointForm] = useState({
        id: 0,
        name: "",
        latitude: 0,
        longitude: 0,
      });
      const [editingCheckpoint, setEditingCheckpoint] = useState<boolean>(false);
      const [editingRoute, setEditingRoute] = useState<{
        id: number;
        name: string;
      } | null>(null);
    
      const handleReset = () => {
        setNewRouteName("");
        setCheckpointName("");
      };
       // Cancels the checkform editing
    const handleCancelEdit = () => {
        setNewRouteName("");
        setCheckpointName("");
        setCurrentRouteId(null);
        setEditingRoute(null);
    };
      // Open the form to edit a route name
      const handleEditRoute = (route: Route) => {
        setEditingRoute({ id: route.id, name: route.name });
      };

        
  

        // const [error, setError] = useState<string | null>(null);
        // const [isLoading, setLoading] = useState(false);
      
        // useEffect(() => {
        //     setLoading(true);
        //     const params: Record<string, string | number | null> = {
        //         per_page: itemsPerPage,
        //         search: search,
        //     };
        //     if (itemsPerPage !== null) {
        //         params.page = currentPage;
        //     }
        
        //     const { request, cancel } =
        //     transportService.getAll<
        //         ApiResponseInterface<Vehicle>
        //         >(params);
        
        //     request
        //         .then((result) => {
        //             setVehicles(result.data.data);
        //         setLoading(false);
        //         })
        //         .catch((err) => {
        //         if (err instanceof CanceledError) return;
        //         setError(err.message);
        //         setLoading(false);
        //         });
        
        //     return () => cancel();
        //     }, [search, currentPage, itemsPerPage]);

  return {
    routes,setRoutes,editingRoute,setEditingRoute,
    newRouteName,setNewRouteName, currentRouteId,setCurrentRouteId,
    checkpointName,setCheckpointForm,checkpointForm,setCheckpointName,
    handleReset,handleEditRoute,editingCheckpoint,setEditingCheckpoint,
    handleCancelEdit
}
}

export default useTransportRoute;
