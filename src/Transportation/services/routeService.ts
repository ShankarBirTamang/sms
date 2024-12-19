import apiRoute from "../../services/httpService";


export interface Checkpoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: number;
  name: string;
  checkpoints: Checkpoint[];
}

export interface CreateRouteInterface {
    id: number;
    name: string;
  checkpoints: Checkpoint[];
}

export interface UpdateRouteInterface
  extends CreateRouteInterface {
    id: number;
}

// export interface AcademicLevelsResponse {
//   data: UpdateAcademicLevelInterface[];
// }
export default apiRoute("/academics/academic-levels");
