import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAddress from "../../General/hooks/useAddress";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface AddressSelectorProps {
  onChange: (selectedValues: {
    country: number | null;
    province: number | null;
    district: number | null;
    municipality: number | null;
    ward: string | null;
  }) => void;
  colSize?: number;
  errors?: Merge<
    FieldError,
    FieldErrorsImpl<{
      countryId?: number;
      provinceId?: number;
      districtId?: number;
      municipalityId?: number;
      ward: string;
    }>
  >;
  value?: {
    country?: number | null;
    province?: number | null;
    district?: number | null;
    municipality?: number | null;
    ward?: string | null;
  };
  idPrefix?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  onChange,
  colSize = 3,
  errors,
  value,
  idPrefix = "default",
}) => {
  const { countries } = useAddress({});

  const [selectedCountry, setSelectedCountry] = useState<number | null>(
    value?.country ?? null
  );
  const [selectedProvince, setSelectedProvince] = useState<number | null>(
    value?.province ?? null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(
    value?.district ?? null
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(value?.municipality ?? null);
  const [selectedWard, setSelectedWard] = useState<string | null>(
    value?.ward ?? null
  );

  const filteredProvinces = useMemo(() => {
    return selectedCountry
      ? countries.find((country) => country.id === selectedCountry)
          ?.provinces || []
      : [];
  }, [selectedCountry, countries]);

  const filteredDistricts = useMemo(() => {
    return selectedProvince
      ? filteredProvinces.find((province) => province.id === selectedProvince)
          ?.districts || []
      : [];
  }, [selectedProvince, filteredProvinces]);

  const filteredMunicipalities = useMemo(() => {
    return selectedDistrict
      ? filteredDistricts.find((district) => district.id === selectedDistrict)
          ?.municipalities || []
      : [];
  }, [selectedDistrict, filteredDistricts]);

  const wards = useMemo(() => {
    return selectedMunicipality
      ? filteredMunicipalities.find((mun) => mun.id === selectedMunicipality)
          ?.total_wards || 0
      : 0;
  }, [selectedMunicipality, filteredMunicipalities]);

  const handleCountryChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const countryId = parseInt(event.target.value, 10);
      setSelectedCountry(countryId);
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedMunicipality(null);
      setSelectedWard(null);
    },
    []
  );

  const handleProvinceChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const provinceId = parseInt(event.target.value, 10);
      setSelectedProvince(provinceId);
      setSelectedDistrict(null);
      setSelectedMunicipality(null);
      setSelectedWard(null);
    },
    []
  );

  const handleDistrictChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const districtId = parseInt(event.target.value, 10);
      setSelectedDistrict(districtId);
      setSelectedMunicipality(null);
      setSelectedWard(null);
    },
    []
  );

  const handleMunicipalityChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const municipalityId = parseInt(event.target.value, 10);
      setSelectedMunicipality(municipalityId);
      setSelectedWard(null);
    },
    []
  );

  const handleWardChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const ward = event.target.value;
      setSelectedWard(ward);
    },
    []
  );

  useEffect(() => {
    onChange({
      country: selectedCountry,
      province: selectedProvince,
      district: selectedDistrict,
      municipality: selectedMunicipality,
      ward: selectedWard,
    });
  }, [
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    selectedMunicipality,
    selectedWard,
    onChange,
  ]);

  return (
    <div className="row">
      <div className={`col-md-${colSize}`}>
        <div className="fv-row mb-7">
          <label
            className="required fw-bold fs-6 mb-2"
            htmlFor={`${idPrefix}_country`}
          >
            Country
          </label>
          <select
            id={`${idPrefix}_country`}
            className={`form-control ${
              errors?.countryId && "is-invalid"
            } form-control mb-3 mb-lg-0`}
            value={selectedCountry ?? ""}
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
          <label
            className="required fw-bold fs-6 mb-2"
            htmlFor={`${idPrefix}_province`}
          >
            Province
          </label>
          <select
            id={`${idPrefix}_province`}
            className={`form-control ${
              errors?.provinceId && "is-invalid"
            } form-control mb-3 mb-lg-0`}
            value={selectedProvince ?? ""}
            onChange={handleProvinceChange}
            disabled={!selectedCountry}
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
          <label
            className="required fw-bold fs-6 mb-2"
            htmlFor={`${idPrefix}_district`}
          >
            District
          </label>
          <select
            id={`${idPrefix}_district`}
            className={`form-control ${
              errors?.districtId && "is-invalid"
            } form-control mb-3 mb-lg-0`}
            value={selectedDistrict ?? ""}
            onChange={handleDistrictChange}
            disabled={!selectedProvince}
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
            htmlFor={`${idPrefix}_mun`}
          >
            Local Gov.
          </label>
          <select
            id={`${idPrefix}_mun`}
            className={`form-control ${
              errors?.municipalityId && "is-invalid"
            } form-control mb-3 mb-lg-0`}
            value={selectedMunicipality ?? ""}
            onChange={handleMunicipalityChange}
            disabled={!selectedDistrict}
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
            htmlFor={`${idPrefix}_ward`}
          >
            Ward
          </label>
          <select
            id={`${idPrefix}_ward`}
            className={`form-control ${
              errors?.ward && "is-invalid"
            } form-control mb-3 mb-lg-0`}
            value={selectedWard ?? ""}
            onChange={handleWardChange}
            disabled={!selectedMunicipality}
          >
            <option value="" disabled hidden>
              {selectedMunicipality ? "Select Ward" : "Select Mun First"}
            </option>
            {Array.from({ length: wards }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
