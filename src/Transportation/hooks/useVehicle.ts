import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { CanceledError } from "../../services/apiClient";
import {
    ApiResponseInterface,
    PaginationAndSearch,
} from "../../Interface/Interface";

import transportService , { Vehicle, VehicleForm,CreateVehicleInterface,UpdateVehicleInterface } from "../services/transportService";
import toast from "react-hot-toast";
import { PaginationProps } from "../../components/Pagination/Pagination";

const useVehicle = (
    {
        search = "",
        currentPage = 1,
        itemsPerPage = null,
      }: PaginationAndSearch
    ) => {
          const [vehicles, setVehicles] = useState<Vehicle[]>([]);
        
          const [form, setForm] = useState<VehicleForm>({
            name: "",
            vehicle_type : "",
            vehicle_number: "",
            max_capacity:0,
            chassis_number:"",
            model_number:"",
            year_made:"",
          });
          const [isEditing, setIsEditing] = useState(false);
          const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
          

          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setForm({ ...form, [name]: value });
          };

        const [error, setError] = useState<string | null>(null);
        const [isLoading, setLoading] = useState(false);
        
            // For Pagination
        const [pagination, setPagination] =useState<PaginationProps["pagination"]>(null);
        const [edgeLinks, setEdgeLinks] = useState<PaginationProps["edgeLinks"]>();
            //end for Pagination
      
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
            transportService.getAll<
                ApiResponseInterface<CreateVehicleInterface>
                >(params);
        
            request
                .then((result) => {
                    setVehicles(result.data.data);
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

            //Add vehicles functions
            const addVehicle = async ({
              id,name,description,vehicle_type,vehicle_condition,max_capacity,chassis_number,model_number,year_made,vehicle_number,note
               }: CreateVehicleInterface) => {
                 const params = {
                  id,name,description,vehicle_type,vehicle_condition,max_capacity,chassis_number,model_number,year_made,vehicle_number,note
                };
             
                 try {
                   const result =
                     await transportService.create<CreateVehicleInterface>(params);
                     console.log("Added successfully!");
                     toast.success("Vehicle added succesfully!");

                   // Update state only after successful creation
                   setVehicles((prevVehicles)=>[...prevVehicles, result.data.data]);
                   
                 } catch (err) {
                   if (err instanceof Error) {
                     setError(err.message);
                   } else {
                     setError("An unknown error occurred.");
                   }
                 }
               };
              

            //updateFunction
                const updateVehicle = async ({
                  id,name,description,vehicle_type,vehicle_condition,max_capacity,chassis_number,model_number,year_made,vehicle_number,note
                }: UpdateVehicleInterface) => {
                  const params = {
                    id,name,description,vehicle_type,vehicle_condition,max_capacity,chassis_number,model_number,year_made,vehicle_number,note
                  };
                  const originalAddress = [...vehicles];
              
                  try {
                    console.log("Original Address:", originalAddress);
              
                    const result =
                      await transportService.update<UpdateVehicleInterface>(params);
                      setVehicles(
                        vehicles.map((vehicle) =>
                        vehicle.id === result.data.data.id ? result.data.data : vehicle
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

            const clearForm = () => {
                setForm({
                  name: "",
                  vehicle_type : "",
                  vehicle_number: "",
                  max_capacity:0,
                  chassis_number:"",
                  model_number:"",
                  year_made:"",
              });
            }
            const handleReset = () => {
              clearForm();
              setIsEditing(false);
            }

    return {
        vehicles, setVehicles,isEditing, setIsEditing,editingVehicleId, setEditingVehicleId
        ,handleChange , form , setForm , clearForm , addVehicle ,pagination,edgeLinks,handleReset,
        updateVehicle
    }
};
export default useVehicle;