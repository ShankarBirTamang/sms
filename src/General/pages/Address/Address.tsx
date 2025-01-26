import { useState } from "react";
import Country from "./Country";
import Province from "./Province";
import {
  MunicipalityType,
  DistrictType,
  ProvinceType,
  CountryType,
} from "../../Services/addressServices";
import useDebounce from "../../../hooks/useDebounce";
import useAddress from "../../hooks/useAddress";
import District from "./District";
import Municipality from "./Municipality";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

const Address = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  useDocumentTitle("Address Setup");
  const {
    countries,
    provinces,
    districts,
    municipalities,
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    selectedMunicipality,

    addCountry,
    addProvince,
    addDistrict,
    addMunicipality,
    handleEditMunicipality,
    handleEditDistrict,
    handleEditProvince,
    handleEditCountry,
    handleSelectCountry,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectMunicipality,
  } = useAddress({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const [countryFormInput, setCountryFormInput] = useState<{ country: string }>(
    { country: "" }
  );
  const [provinceFormInput, setProvinceFormInput] = useState<{
    province: string;
  }>({ province: "" });
  const [districtFormInput, setDistrictFormInput] = useState<{
    district: string;
  }>({ district: "" });
  const [municipalityFormInput, setMunicipalityFormInput] = useState<{
    municipality: string;
  }>({ municipality: "" });

  const handleAddCountry = (countryName: CountryType) => {
    const countryExists = countries.find(
      (country) => country.name === countryName.name
    );
    if (!countryExists) {
      const newCountry = {
        name: countryName.name,
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
    const provinceExists = provinces.find(
      (province) => province.name === provinceName.name
    );
    if (!provinceExists) {
      const newProvince = {
        country_id: selectedCountry?.id ?? -1,
        name: provinceName.name,
      };
      addProvince(newProvince);
      setProvinceFormInput({ province: "" });
      console.log("New Province Added(Address.tsx): ", newProvince.name);
    } else {
      alert(`${provinceName.name} already exists`);
    }
  };

  const handleAddDistrict = (districtName: DistrictType) => {
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
  const handleAddMunicipality = (
    municipalityName: MunicipalityType,
    no_of_wards: number
  ) => {
    const municipalityExists = municipalities.find(
      (municipality) => municipality.name === municipalityName.name
    );
    if (!municipalityExists) {
      const newMunicipality = {
        district_id: selectedDistrict?.id ?? -1,
        name: municipalityName.name,
        total_wards: no_of_wards,
      };
      addMunicipality(newMunicipality);
      setMunicipalityFormInput({ municipality: "" });
      console.log("New Municipality Added: ", newMunicipality.name);
    } else {
      alert(`${municipalityName.name} already exists`);
      setMunicipalityFormInput({ municipality: "" });
    }
  };

  return (
    <div>
      <>
        <div className="row">
          <div className="col-xl-3 mb-xl-10">
            {}
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
            {}
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
            {}
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
            {}
            <Municipality
              municipalities={municipalities}
              selectedMunicipality={selectedMunicipality}
              onSelectMunicipality={handleSelectMunicipality}
              onAddMunicipality={handleAddMunicipality}
              municipalityFormInput={municipalityFormInput}
              setMunicipalityFormInput={setMunicipalityFormInput}
              onEditMunicipality={handleEditMunicipality}
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default Address;
