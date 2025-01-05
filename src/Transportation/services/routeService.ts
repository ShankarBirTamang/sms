import apiRoute from "../../services/httpService";


export interface Checkpoint {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
}

export interface Route  {
  id: number;
  name: string;
  route_checkpoints: Checkpoint[];
}

export interface CreateRouteInterface {
  id: number;
  name: string;
  route_checkpoints: Checkpoint[];
}

export interface CreateCheckpointInterface{
  transport_route_id : number,
    id:number,
    location_name: string,
    latitude: number,
    longitude: number
}

export interface UpdateCheckpointInterface {
  id:number;
  location_name: string,
  latitude: number,
  longitude: number
}

export interface UpdateRouteInterface
{
    id: number;
    name:string;
}

export const checkpointRoutes = apiRoute("/transportation/route-checkpoints");

export default apiRoute("/transportation/routes");
