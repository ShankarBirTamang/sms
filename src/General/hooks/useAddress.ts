import { useEffect, useState } from "react";
import {
  countriesRoute,
  provincesRoute,
  districtsRoute,
  municipalitiesRoute,
} from "../Services/addressServices";
import {
  MunicipalityType,
  DistrictType,
  ProvinceType,
  CountryType,
  CreateProvinceInterface,
  CreateDistrictInterface,
  CreateAddressInterface,
  CreateMunicipalityInterface,
  UpdateAddressInterface,
  UpdateMunicipalityInterface,
} from "../Services/addressServices";
import { CanceledError } from "../../services/apiClient";
import {
  ApiResponseInterface,
  PaginationAndSearch,
} from "../../Interface/Interface";

const useAddress = ({
  search = "",
  currentPage = 1,
  itemsPerPage = null,
}: PaginationAndSearch) => {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [municipalities, setCities] = useState<MunicipalityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  // On select state
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const [selectedProvince, setSelectedProvince] = useState<ProvinceType | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictType | null>(
    null
  );
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<MunicipalityType | null>(null);

  // handleSelect Functions
  const handleSelectCountry = (country: CountryType) => {
    setSelectedCountry(country);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setProvinces(country.provinces);
    setDistricts([]);
    setCities([]);
    console.log(country);
  };
  const handleSelectProvince = (province: ProvinceType) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setDistricts(province.districts);
    setCities([]);
    console.log(province);
  };
  const handleSelectDistrict = (district: DistrictType) => {
    setSelectedDistrict(district);
    setSelectedMunicipality(null);
    setCities(district.municipalities);
    console.log(district);
  };
  const handleSelectMunicipality = (municipality: MunicipalityType) => {
    setSelectedMunicipality(municipality);
    console.log(municipality);
  };

  //handle Edit Functions
  const handleEditCountry = (updatedCountry: CountryType) => {
    //checking whether the updatedcountry already exists
    const countryExists = countries.find(
      (country) => country.name === updatedCountry.name
    );
    if (countryExists) {
      alert(`${updatedCountry.name} already exists`);
    } else {
      const newCountryName = {
        id: updatedCountry.id,
        name: updatedCountry.name,
      };
      updateCountry(newCountryName);
    }
  };

  const handleEditProvince = (updatedProvince: ProvinceType) => {
    //checking whether the updatedProvince already exists
    const provinceExists = provinces.find(
      (province) => province.name === updatedProvince.name
    );
    if (provinceExists) {
      alert(`${updatedProvince.name} already exists`);
    } else {
      const newProvinceName = {
        id: updatedProvince.id,
        name: updatedProvince.name,
      };
      updateProvince(newProvinceName);
    }
  };

  const handleEditDistrict = (updatedDistrict: DistrictType) => {
    //checking whether the updatedDistrict already exists
    const districtExists = districts.find(
      (district) => district.name === updatedDistrict.name
    );
    if (districtExists) {
      alert(`${updatedDistrict.name} already exists`);
    } else {
      const newDistrictName = {
        id: updatedDistrict.id,
        name: updatedDistrict.name,
      };
      updateDistrict(newDistrictName);
    }
  };

  const handleEditMunicipality = (updatedMunicipality: MunicipalityType) => {
    //checking whether the updatedDistrict already exists
    const municipalityExists = municipalities.find(
      (municipality) => municipality.name === updatedMunicipality.name
    );
    if (municipalityExists) {
      alert(`${updatedMunicipality.name} already exists`);
    } else {
      const newMunicipalityName = {
        id: updatedMunicipality.id,
        name: updatedMunicipality.name,
        total_wards: updatedMunicipality.total_wards ?? 0,
      };
      updateMunicipality(newMunicipalityName);
    }
  };

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
      countriesRoute.getAll<ApiResponseInterface<CountryType>>(params);

    request
      .then((result) => {
        setCountries(result.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, [search, currentPage, itemsPerPage]);

  const addCountry = async ({ name }: CreateAddressInterface) => {
    const params = {
      name,
    };

    try {
      const result = await countriesRoute.create<CreateAddressInterface>(
        params
      );
      // Update state only after successful creation
      setCountries([...countries, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };
  const addProvince = async ({ country_id, name }: CreateProvinceInterface) => {
    const params = {
      country_id,
      name,
    };

    try {
      const result = await provincesRoute.create<CreateProvinceInterface>(
        params
      );
      console.log("New Province Added successfully");

      // Update the state of the selectedCountry's provinces only after successful creation
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: [...(country.provinces || []), result.data.data],
              }
            : country
        )
      );
      setProvinces((prevProvinces) => [...prevProvinces, result.data.data]);
      // setSelectedDistrict(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const addDistrict = async ({
    province_id,
    name,
  }: CreateDistrictInterface) => {
    const params = {
      province_id,
      name,
    };

    try {
      const result = await districtsRoute.create<CreateDistrictInterface>(
        params
      );
      console.log("New District Added successfully");

      // Update the state of the selectedCountry and selectedProvince's districts
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: country.provinces.map((province) =>
                  province.id === selectedProvince?.id
                    ? {
                        ...province,
                        districts: [
                          ...(province.districts || []), // Ensure districts is not undefined
                          result.data.data,
                        ],
                      }
                    : province
                ),
              }
            : country
        )
      );
      //Update provinces
      setProvinces((prevProvinces) =>
        prevProvinces.map((province) =>
          province.id === selectedProvince?.id
            ? {
                ...province,
                districts: [
                  ...(province.districts || []), // Ensure districts is not undefined
                  result.data.data,
                ],
              }
            : province
        )
      );
      //Update districts state
      setDistricts((prevDistricts) => [...prevDistricts, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const addMunicipality = async ({
    district_id,
    name,
    total_wards,
  }: CreateMunicipalityInterface) => {
    const params = {
      district_id,
      name,
      total_wards,
    };

    try {
      const result =
        await municipalitiesRoute.create<CreateMunicipalityInterface>(params);
      console.log("New Municipality Added successfully");

      // Update the state of the selectedCountry ,selectedProvince , selectedDistrict's municipalities
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: country.provinces.map((province) =>
                  province.id === selectedProvince?.id
                    ? {
                        ...province,
                        districts: province.districts.map((district) =>
                          district.id === selectedDistrict?.id
                            ? {
                                ...district,
                                municipalities: [
                                  ...(district.municipalities || []), // Ensure districts is not undefined
                                  result.data.data,
                                ],
                              }
                            : district
                        ),
                      }
                    : province
                ),
              }
            : country
        )
      );
      //Update Provinces state
      setProvinces((prevProvinces) =>
        prevProvinces.map((province) =>
          province.id === selectedProvince?.id
            ? {
                ...province,
                districts: province.districts.map((district) =>
                  district.id === selectedDistrict?.id
                    ? {
                        ...district,
                        municipalities: [
                          ...(district.municipalities || []),
                          result.data.data, // Add the new municipality
                        ],
                      }
                    : district
                ),
              }
            : province
        )
      );
      //Update districts states
      setDistricts((prevDistricts) =>
        prevDistricts.map((district) =>
          district.id === selectedDistrict?.id
            ? {
                ...district,
                municipalities: [
                  ...(district.municipalities || []),
                  result.data.data, // Add the new municipality
                ],
              }
            : district
        )
      );
      //Updata municipalities states
      setCities((prevCities) => [...prevCities, result.data.data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  //updateFunction
  const updateCountry = async ({ id, name }: UpdateAddressInterface) => {
    const params = {
      id,
      name,
    };
    const originalAddress = [...countries];

    try {
      console.log("Original Address:", originalAddress);

      const result = await countriesRoute.update<UpdateAddressInterface>(
        params
      );
      setCountries(
        countries.map((country) =>
          country.id === result.data.data.id ? result.data.data : country
        )
      );

      console.log(`${name} : Updated Successfully!  `);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateProvince = async ({ id, name }: UpdateAddressInterface) => {
    const params = {
      id,
      name,
    };
    const originalAddress = [...provinces];

    try {
      console.log("Original Address:", originalAddress);

      const result = await provincesRoute.update<UpdateAddressInterface>(
        params
      );
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: country.provinces.map((province) =>
                  province.id === result.data.data.id
                    ? result.data.data
                    : province
                ),
              }
            : country
        )
      );
      setProvinces((prevProvinces) =>
        prevProvinces.map((province) =>
          province.id === result.data.data.id ? result.data.data : province
        )
      );

      console.log(`${name} : Province Updated Successfully!  `);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateDistrict = async ({ id, name }: UpdateAddressInterface) => {
    const params = {
      id,
      name,
    };
    const originalAddress = [...districts];

    try {
      console.log("Original Address:", originalAddress);

      const result = await districtsRoute.update<UpdateAddressInterface>(
        params
      );
      //update countries
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: country.provinces.map((province) =>
                  province.id === selectedProvince?.id
                    ? {
                        ...province,
                        districts: province.districts.map((district) =>
                          district.id === result.data.data.id
                            ? result.data.data
                            : district
                        ),
                      }
                    : province
                ),
              }
            : country
        )
      );
      //update provinces
      setProvinces((prevProvinces) =>
        prevProvinces.map((province) =>
          province.id === selectedProvince?.id
            ? {
                ...province,
                districts: province.districts.map((district) =>
                  district.id === result.data.data.id
                    ? result.data.data
                    : district
                ),
              }
            : province
        )
      );
      // update districts
      setDistricts((prevDistricts) =>
        prevDistricts.map((district) =>
          district.id === result.data.data.id ? result.data.data : district
        )
      );

      console.log(`${name} : District Updated Successfully!  `);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const updateMunicipality = async ({
    id,
    name,
    total_wards,
  }: UpdateMunicipalityInterface) => {
    const params = {
      id,
      name,
      total_wards,
    };
    const originalAddress = [...municipalities];

    try {
      console.log("Original Address:", originalAddress);
      const result =
        await municipalitiesRoute.update<UpdateMunicipalityInterface>(params);
      //update countries state
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id === selectedCountry?.id
            ? {
                ...country,
                provinces: country.provinces.map((province) =>
                  province.id === selectedProvince?.id
                    ? {
                        ...province,
                        districts: province.districts.map((district) =>
                          district.id === selectedDistrict?.id
                            ? {
                                ...district,
                                municipalities: district.municipalities.map(
                                  (municipality) =>
                                    municipality.id === result.data.data.id
                                      ? result.data.data
                                      : municipality
                                ),
                              }
                            : district
                        ),
                      }
                    : province
                ),
              }
            : country
        )
      );
      //update provinces state
      setProvinces((prevProvinces) =>
        prevProvinces.map((province) =>
          province.id === selectedProvince?.id
            ? {
                ...province,
                districts: province.districts.map((district) =>
                  district.id === selectedDistrict?.id
                    ? {
                        ...district,
                        municipalities: district.municipalities.map(
                          (municipality) =>
                            municipality.id === result.data.data.id
                              ? result.data.data
                              : municipality
                        ),
                      }
                    : district
                ),
              }
            : province
        )
      );
      // update districts state
      setDistricts((prevDistricts) =>
        prevDistricts.map((district) =>
          district.id === selectedDistrict?.id
            ? {
                ...district,
                municipalities: district.municipalities.map((municipality) =>
                  municipality.id === result.data.data.id
                    ? result.data.data
                    : municipality
                ),
              }
            : district
        )
      );
      // update municipalities state
      setCities((prevCities) =>
        prevCities.map((municipality) =>
          municipality.id === result.data.data.id
            ? result.data.data
            : municipality
        )
      );
      console.log(`${name} : Municipality Updated Successfully!  `);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return {
    countries,
    provinces,
    districts,
    municipalities,
    handleSelectCountry,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectMunicipality,
    handleEditMunicipality,
    handleEditDistrict,
    handleEditProvince,
    handleEditCountry,
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    selectedMunicipality,
    error,
    isLoading,
    setCountries,
    setProvinces,
    setDistricts,
    setCities,
    setError,
    currentPage,
    addCountry,
    addProvince,
    addDistrict,
    addMunicipality,
    updateCountry,
  };
};

export default useAddress;
