import apiRoute from "../../services/httpService";


//interfaces
export interface CityType {
    id: number;
    name: string;
    no_of_wards: number | null;
  }
  export interface DistrictType {
    id: number;
    name: string;
    cities: CityType[];
  }
  export interface ProvinceType {
    id: number;
    name: string;
    districts: DistrictType[];
  }
  export interface CountryType {
    id: number;
    name: string;
    provinces: ProvinceType[];
  }
 export interface AddressData {
    data: CountryType[];
  };
export interface CreateAddressInterface {
    name:string;
}
export interface CreateProvinceInterface{
  country_id: number;
  name : string;
}
export interface CreateDistrictInterface {
  province_id: number;
  name:string;
}
export interface CreateCityInterface {
  district_id: number;
  name:string;
  total_wards:number;
}

export interface UpdateCityInterface{
  id:number;
  name:string;
  total_wards:number;
}
export interface UpdateAddressInterface extends CreateAddressInterface{
    id: number;
};

// Export API Routes for different resources

// Route for Countries
export const countriesRoute = apiRoute("/general/addresses/countries");

// Route for Provinces
export const provincesRoute = apiRoute("/general/addresses/provinces");

// Route for Districts
export const districtsRoute = apiRoute("/general/addresses/districts");

// Route for Cities
export const citiesRoute = apiRoute("/general/addresses/cities");

