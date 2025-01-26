import React, { useEffect, useState } from "react";
import useAddress from "../../General/hooks/useAddress";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { number } from "zod";

interface AddressSelectorProps {
  onChange: (selectedValues: {
    country: number | null;
    province: number | null;
    district: number | null;
    municipality: number | null;
    ward: number | null;
  }) => void;
  colSize?: number;
  errors?:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          countryId?: number;
          provinceId?: number;
          districtId?: number;
          municipalityId?: number;
          ward: number;
        }>
      >
    | undefined;
  value?: {
    country?: number | null;
    province?: number | null;
    district?: number | null;
    municipality?: number | null;
    ward?: number | null;
  };
}

const AddressSelector = ({
  onChange,
  colSize = 3,
  errors,
}: AddressSelectorProps) => {
  const { countries } = useAddress({});

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);

  const [wards, setWards] = useState<number | null>(null);

  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  useEffect(() => {
    console.log("inside", errors);
  }, [errors]);

  useEffect(() => {
    onChange({
      country: selectedCountry,
      province: selectedProvince,
      district: selectedDistrict,
      municipality: selectedMunicipality,
      ward: selectedWard,
    });
  }, [
    countries,
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    selectedMunicipality,
    selectedWard,
    onChange,
  ]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(event.target.value, 10);
    setSelectedCountry(countryId);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
  };

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = parseInt(event.target.value, 10);
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = parseInt(event.target.value, 10);
    setSelectedDistrict(districtId);
    setSelectedMunicipality(null);
  };

  const handleMunicipalityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const municipalityId = parseInt(event.target.value, 10);
    setSelectedMunicipality(municipalityId);

    const selectedMunicipality = filteredMunicipalities.find(
      (mun) => mun.id === municipalityId
    );

    // If the municipality is found, set the wards
    if (selectedMunicipality) {
      console.log("selectedMunicipality", selectedMunicipality.total_wards);
      setSelectedWard(null);
      setWards(selectedMunicipality.total_wards);
    }
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const ward = parseInt(event.target.value, 10);
    setSelectedWard(ward);
  };

  const filteredProvinces = selectedCountry
    ? countries.find((country) => country.id === selectedCountry)?.provinces ||
      []
    : [];

  const filteredDistricts = selectedProvince
    ? filteredProvinces.find((province) => province.id === selectedProvince)
        ?.districts || []
    : [];

  const filteredMunicipalities = selectedDistrict
    ? filteredDistricts.find((district) => district.id === selectedDistrict)
        ?.municipalities || []
    : [];

  return (
    <>
      <div className="row">
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2" htmlFor="Country">
              Country
            </label>
            <select
              id="Country"
              className={`form-control ${
                errors?.countryId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedCountry || ""}
              onChange={handleCountryChange}
            >
              <option value="" disabled hidden>
                Select Country
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors?.countryId && (
              <span className="text-danger">{errors.countryId.message}</span>
            )}
          </div>
        </div>
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2" htmlFor="Province">
              Province
            </label>
            <select
              id="Province"
              className={`form-control ${
                errors?.provinceId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedProvince || ""}
              onChange={handleProvinceChange}
            >
              <option value="" disabled hidden>
                {selectedCountry ? "Select Province" : "Select Country First"}
              </option>
              {filteredProvinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2" htmlFor="district">
              District
            </label>
            <select
              id="district"
              className={`form-control ${
                errors?.districtId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedDistrict || ""}
              onChange={handleDistrictChange}
            >
              <option value="" disabled hidden>
                {selectedProvince ? "Select District" : "Select Province First"}
              </option>
              {filteredDistricts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`col-md-${colSize - 2}`}>
          <div className="fv-row mb-7">
            <label
              className="required fw-bold fs-6 mb-2"
              htmlFor="municipality"
            >
              Local Gov.
            </label>
            <select
              id="municipality"
              className={`form-control ${
                errors?.municipalityId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedMunicipality || ""}
              onChange={handleMunicipalityChange}
            >
              <option value="" disabled hidden>
                {selectedDistrict
                  ? "Select Municipality"
                  : "Select District First"}
              </option>
              {filteredMunicipalities.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`col-md-2`}>
          <div className="fv-row mb-7">
            <label
              className="required fw-bold fs-6 mb-2"
              htmlFor="municipality"
            >
              Ward
            </label>
            <select
              id="municipality"
              className={`form-control ${
                errors?.ward && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedWard || ""}
              onChange={handleWardChange}
            >
              <option value="" disabled hidden>
                {selectedMunicipality ? "Select Ward" : "Select Mun First"}
              </option>

              {selectedMunicipality &&
                Array.from({ length: wards ?? 0 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressSelector;
