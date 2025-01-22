export interface UploadPhotoInterface {
  id: number;
  image: string;
  for: string;
}

export interface UploadPhotoResponse {
  data: {
    message: string;
    photo: string;
  };
}
