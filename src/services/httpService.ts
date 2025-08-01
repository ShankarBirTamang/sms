import apiClient from "./apiClient";

interface Entity {
  id: number;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>(params?: Record<string, string | number | null>) {
    const controller = new AbortController();
    const request = apiClient.get<T>(this.endpoint, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  getOne<T>(id: number) {
    const controller = new AbortController();
    const request = apiClient.get<T>(`${this.endpoint}/${id}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    const request = apiClient.delete(this.endpoint + id);
    return request;
  }

  create<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update<T extends Entity>(entity: T) {
    return apiClient.put(this.endpoint + "/" + entity.id, entity);
  }

  item<T extends Entity>(entity: T) {
    return apiClient.get(this.endpoint + "/" + entity.id);
  }

  changeStatus<T extends Entity>(entity: T) {
    return apiClient.post(
      this.endpoint + "/" + entity.id + "/change-status",
      entity
    );
  }
}
const apiRoute = (endpoint: string) => new HttpService(endpoint);

export default apiRoute;
