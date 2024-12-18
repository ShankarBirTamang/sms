import apiRoute from "../../services/httpService";


export interface Vehicle  {
  id: number;
  name: string;
  description:string;
  vehicle_type: string;
  vehicle_condition:string;
  max_capacity:number;
  chassis_number:string;
  model_number:string;
  year_made:string;
  vehicle_number:string;
  note:string;
};

export interface VehicleForm {
  name: string;
  vehicle_type: string;
  vehicle_number:string;
  max_capacity:number;
  chassis_number:string;
  model_number:string;
  year_made:string;
};


export interface CreateVehicleInterface extends Vehicle {

  name: string;
  vehicle_type: string;
  vehicle_number:string;
  max_capacity:number;
}

export interface UpdateVehicleInterface{
    name:string;
    description:string;
  vehicle_type: string;
  vehicle_condition:string;
  max_capacity:number;
  chassis_number:string;
  model_number:string;
  year_made:string;
  vehicle_number:string;
  note:string;
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicLevelInterface[];
// }
export default apiRoute("/transportation/vehicles");
