import { useEffect, useState } from "react";
import { CanceledError } from "../../services/apiClient";
import {
    ApiResponseInterface,
    PaginationAndSearch,
} from "../../Interface/Interface";
import routeService,{ checkpointRoutes,Checkpoint,CreateCheckpointInterface,UpdateCheckpointInterface,CreateRouteInterface,UpdateRouteInterface, Route } from "../services/routeService";
import { PaginationProps } from "../../components/Pagination/Pagination";
import toast from "react-hot-toast";

const useTransportRoute = (
    {
        search = "",
        currentPage = 1,
        itemsPerPage = null,
      }: PaginationAndSearch
) => {  
    const [routes, setRoutes] = useState<Route[]>([]);
      const [newRouteName, setNewRouteName] = useState("");
      const [checkpointName, setCheckpointName] = useState("");
      const [currentRouteId, setCurrentRouteId] = useState<number | null>(null);
      const [checkpointForm, setCheckpointForm] = useState<Checkpoint>({
        id: 0,
        location_name: "",
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
   
     // For Pagination
      const [pagination, setPagination] =useState<PaginationProps["pagination"]>(null);
      const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
      //end for Pagination
        
  

        const [error, setError] = useState<string | null>(null);
        const [isLoading, setLoading] = useState(false);
      
        useEffect(() => {
            setLoading(true);
            const params: Record<string, string | number | null> = {
                per_page: itemsPerPage,
                search: search,
            };
            if (itemsPerPage !== null) {
                params.page = currentPage;
            }
        
            const { request, cancel } =
            routeService.getAll<
                ApiResponseInterface<CreateRouteInterface>
                >(params);
        
            request
                .then((result) => {
                    setRoutes(result.data.data);
                    setPagination(result.data.meta);
                    setEdgeLinks(result.data.links);
                setLoading(false);
                })
                .catch((err) => {
                if (err instanceof CanceledError) return;
                setError(err.message);              
                setLoading(false);
                });
        
            return () => cancel();
            }, [search, currentPage, itemsPerPage]);

            
            //Add Routes functions
            const addRoutes = async ({
              id,name,route_checkpoints
               }: CreateRouteInterface) => {
                 const params = {
                  id,name,route_checkpoints
                };
             
                 try {
                   const result =
                     await routeService.create<CreateRouteInterface>(params);
                     console.log("Added successfully!");
                     toast.success(`${name} : Added Successfully!`);

                   // Update state only after successful creation
                   setRoutes((prevRoutes)=>[...prevRoutes, result.data.data]);
                   
                 } catch (err) {
                   if (err instanceof Error) {
                     setError(err.message);
                   } else {
                     setError("An unknown error occurred.");
                   }
                 }
               };
      //Add Checkpoint Functions          
      const addCheckpoint = async ({
            transport_route_id ,id, location_name,latitude,longitude
          }: CreateCheckpointInterface) => {
            const params = {
              transport_route_id,id, location_name,latitude,longitude
            };
        
            try {
              const result =
                await checkpointRoutes.create<CreateCheckpointInterface>(params);
                console.log("New Checkpoint Added successfully");
                toast.success("Added successfully!");
            setRoutes((prevRoutes) =>
              prevRoutes.map((route) =>
                route.id === currentRouteId
            ? {
              ...route,
              route_checkpoints: [...(route.route_checkpoints || []), result.data.data],
            }
            : route
          )
        );        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

      //updateFunction
      const updateRoutes = async ({
      id,name
    }: UpdateRouteInterface) => {
      const params = {
        id,name
      };
      const originalRoutes = [...routes];
  
      try {
        console.log("Original Routes:", originalRoutes);
  
        const result =
          await routeService.update<UpdateRouteInterface>(params);
          setRoutes(
            routes.map((route) =>
            route.id === result.data.data.id ? result.data.data : route
          )
        );           
        console.log(`${name} : Updated Successfully!  `);
        toast.success(`${name} : Updated Successfully!`);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };
    
    //Update Checkpoint Function
    const updateCheckPoint = async ({
      id,location_name,latitude,longitude
        }: UpdateCheckpointInterface) => {
          const params = {
            id,location_name,latitude,longitude
          };
          const originalRoutes = [...routes];
      
          try {
            console.log("Original Routes:", originalRoutes);
            const result =
              await checkpointRoutes.update<UpdateCheckpointInterface>(params);
              
              setRoutes((prevRoutes)=>
                prevRoutes.map(
                  (route)=>
                    route.id === currentRouteId        
                    ?{
                      ...route,
                      route_checkpoints: route.route_checkpoints.map(
                        (checkpoint) =>
                        checkpoint.id === result.data.data.id ? result.data.data : checkpoint
                      )         
                    }:route 
                )
            );           
            console.log(`${location_name} : Checkpoint Updated Successfully!  `);
            toast.success("Edited successfully!");
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred.");
            }
          }
        };
        //Update Checkpoint Function Ends


        //Delete Checkpoint Function



  return {
    routes,setRoutes,editingRoute,setEditingRoute,
    newRouteName,setNewRouteName, currentRouteId,setCurrentRouteId,
    checkpointName,setCheckpointForm,checkpointForm,setCheckpointName,
    handleReset,editingCheckpoint,setEditingCheckpoint,
    handleCancelEdit,pagination, edgeLinks,error, isLoading,
    addRoutes,updateRoutes,addCheckpoint,updateCheckPoint,
}
}

export default useTransportRoute;
