import { useEffect, useState } from "react";
import addressDataJSON from "./addressData.json";
import Country from "./Country";
import Province from "./Province";
import {
  CityType,
  DistrictType,
  ProvinceType,
  CountryType,
  AddressData,
  CreateAddressInterface,
  UpdateAddressInterface,
} from "../../Services/addressServices";
import useDebounce from "../../../hooks/useDebounce";
import useAddress from "../../hooks/useAddress";
import District from "./District";
import City from "./City";

// Main Address Component
const Address = () => {
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use debounce with 300ms delay

  const {
    countries,
    provinces,
    districts,
    cities,
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    selectedCity,
    setCountries,
    setProvinces,
    setDistricts,
    setCities,
    addCountry,
    addProvince,
    addDistrict,
    addCity,
    handleEditCity,
    handleEditDistrict,
    handleEditProvince,
    handleEditCountry,
    handleSelectCountry,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectCity,
    updateCountry,
  } = useAddress({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  // // header functions
  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handleItemsPerPageChange = (value: number | null) => {
  //   setItemsPerPage(value);
  //   setCurrentPage(1);
  // };

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  //   setCurrentPage(1); // Reset to the first page on new search
  // };

  const addressData: AddressData = JSON.parse(JSON.stringify(addressDataJSON));
  const [data, setData] = useState<AddressData>(addressData);

  {
    //   useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstance.get('/general/addresses/countries?per_page=&search='); // Replace '/endpoint' with your API route
    //             setData(response.data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);
    // const addressData:AddressData = JSON.stringify(data,null,2);
  }

  //required state
  // const [countries, setCountries] = useState<CountryType[]>(
  //   addressDataJSON.data
  // );

  //Form Input state
  const [countryFormInput, setCountryFormInput] = useState<{ country: string }>(
    { country: "" }
  );
  const [provinceFormInput, setProvinceFormInput] = useState<{
    province: string;
  }>({ province: "" });
  const [districtFormInput, setDistrictFormInput] = useState<{
    district: string;
  }>({ district: "" });
  const [cityFormInput, setCityFormInput] = useState<{
    city: string;
  }>({ city: "" });

  const [formInput, setFormInput] = useState<{
    country: string;
    province: string;
    district: string;
    city: string;
  }>({
    country: "",
    province: "",
    district: "",
    city: "",
  });

  //handleAdd Functions
  const handleAddCountry = (countryName: CountryType) => {
    //checking whether the country already exists
    const countryExists = countries.find(
      (country) => country.name === countryName.name
    );
    if (!countryExists) {
      const newCountry = {
        // id: countries.length + 1,
        name: countryName.name,
        // provinces: [],
      };
      setCountryFormInput({
        country: "",
      });
      addCountry(newCountry);
      console.log("New Country Added: ", newCountry.name);
    } else {
      alert(`${countryName.name} already exists`);
      setCountryFormInput({
        country: "",
      });
    }
  };
  const handleAddProvince = (provinceName: ProvinceType) => {
    //checking whether the province already exists
    const provinceExists = provinces.find(
      (province) => province.name === provinceName.name
    );
    if (!provinceExists) {
      const newProvince = {
        country_id: selectedCountry?.id ?? -1,
        name: provinceName.name,
        // districts: [],
      };
      addProvince(newProvince);
      setProvinceFormInput({ province: "" });
      console.log("New Province Added(Address.tsx): ", newProvince.name);
    } else {
      alert(`${provinceName.name} already exists`);
    }
  };

  const handleAddDistrict = (districtName: DistrictType) => {
    //checking whether the district already exists
    const districtExists = districts.find(
      (district) => district.name === districtName.name
    );
    if (!districtExists) {
      const newDistrict = {
        province_id: selectedProvince?.id ?? -1,
        name: districtName.name,
      };
      addDistrict(newDistrict);
      setDistrictFormInput({ district: "" });
      console.log("New District Added: ", newDistrict);
    } else {
      alert(`${districtName.name} already exists`);
      setDistrictFormInput({ district: "" });
    }
  };
  const handleAddCity = (cityName: CityType, no_of_wards: number) => {
    //checking whether the district already exists
    const cityExists = cities.find((city) => city.name === cityName.name);
    if (!cityExists) {
      const newCity = {
        district_id: selectedDistrict?.id ?? -1,
        name: cityName.name,
        total_wards: no_of_wards,
      };
      addCity(newCity);
      setCityFormInput({ city: "" });
      console.log("New City Added: ", newCity.name);
    } else {
      alert(`${cityName.name} already exists`);
      setCityFormInput({ city: "" });
    }
  };

  return (
    <div>
      <>
        <h1 className="text-white">Address : </h1>
        <div className="row">
          <div className="col-xl-3 mb-xl-10">
            {/* Country List */}
            <Country
              countries={countries}
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
              onAddCountry={handleAddCountry}
              countryFormInput={countryFormInput}
              setCountryFormInput={setCountryFormInput}
              onEditCountry={handleEditCountry}
            ></Country>
          </div>

          <div className="col-xl-3 mb-xl-10">
            {/* Province List */}
            <Province
              provinces={provinces}
              selectedProvince={selectedProvince}
              onSelectProvince={handleSelectProvince}
              onAddProvince={handleAddProvince}
              provinceFormInput={provinceFormInput}
              setProvinceFormInput={setProvinceFormInput}
              onEditProvince={handleEditProvince}
            />
          </div>

          <div className="col-xl-3 mb-xl-10">
            {/* District List */}
            <District
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={handleSelectDistrict}
              onAddDistrict={handleAddDistrict}
              districtFormInput={districtFormInput}
              setDistrictFormInput={setDistrictFormInput}
              onEditDistrict={handleEditDistrict}
            />
          </div>

          <div className="col-xl-3 mb-xl-10">
            {/* Cities List */}
            <City
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              onAddCity={handleAddCity}
              cityFormInput={cityFormInput}
              setCityFormInput={setCityFormInput}
              onEditCity={handleEditCity}
            />
          </div>
        </div>
      </>

      {/* Display Data */}
      <div>
        <h2>Data Structure</h2>
        <pre>{JSON.stringify(countries, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Address;
