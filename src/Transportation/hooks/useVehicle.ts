import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { CanceledError } from "../../services/apiClient";
import {
    ApiResponseInterface,
    PaginationAndSearch,
} from "../../Interface/Interface";

import transportService , { Vehicle, VehicleForm } from "../services/transportService";

const useVehicle = (
    // {
    //     search = "",
    //     currentPage = 1,
    //     itemsPerPage = null,
    //   }: PaginationAndSearch
    ) => {
        const [vehicles, setVehicles] = useState<Vehicle[]>([
            { id: 1, name: "BUS 1", type: "BUS 1", number: "BUS 1", capacity: 1 },
            { id: 2, name: "BUS 2", type: "BUS 2", number: "BUS 2", capacity: 2 },
            { id: 3, name: "BUS 3", type: "BUS 3", number: "BUS 3", capacity: 3 },
            { id: 4, name: "BUS 4", type: "BUS 4", number: "BUS 4", capacity: 4 },
            { id: 5, name: "BUS 5", type: "BUS 5", number: "BUS 5", capacity: 5 },
          ]);
        
          const [form, setForm] = useState<VehicleForm>({
            name: "",
            type: "",
            number: "",
            capacity: "",
            chassis: "",
            model: "",
            year: "",
          });
          const [isEditing, setIsEditing] = useState(false);
          const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
        
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setForm({ ...form, [name]: value });
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

            const clearForm = () => {
                setForm({
                name: "",
                type: "",
                number: "",
                capacity: "",
                chassis: "",
                model: "",
                year: "",
              });
            }

    return {
        vehicles, setVehicles,isEditing, setIsEditing,editingVehicleId, setEditingVehicleId
        ,handleChange , form , setForm , clearForm,
    }
};
export default useVehicle;