import { useState } from "react";
import addressDataJSON from "./addressData.json";

type City = {
  id: number;
  name: string;
  no_of_wards: number | null;
};
type District = {
  id: number;
  name: string;
  cities: City[];
};
type Province = {
  id: number;
  name: string;
  districts: District[];
};
type Country = {
  id: number;
  name: string;
  provinces: Province[];
};
type AddressData = {
  data: Country[];
};

const Address = () => {
  const addressData: AddressData = JSON.parse(JSON.stringify(addressDataJSON));
  const [data, setData] = useState<AddressData>(addressData);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [formInput, setFormInput] = useState({
    country: "",
    province: "",
    district: "",
    city: "",
  });

  const handleAddData = () => {
    // Avoid mutating the original state
    const updatedData = JSON.parse(JSON.stringify(data)) as AddressData;

    console.log("Initial Updated Data:", updatedData);

    if (formInput.country) {
      console.log("Adding new country:", formInput.country);
      const countryExists = updatedData.data.find(
        (country) => country.name === formInput.country
      );
      if (!countryExists) {
        updatedData.data.push({
          id: updatedData.data.length + 1,
          name: formInput.country,
          provinces: [],
        });
        console.log("New country added:", updatedData.data);
      } else {
        console.log("Country already exists!");
      }
    }
    // Add new province
    else if (formInput.province && selectedCountry) {
      console.log("Adding new province:", formInput.province);
      const selectedCountryIndex = updatedData.data.findIndex(
        (country) => country.id === selectedCountry.id
      );
      console.log("Selected Country Index:", selectedCountryIndex);
      const provinceExists = updatedData.data[
        selectedCountryIndex
      ].provinces.find((province) => province.name === formInput.province);
      if (!provinceExists) {
        updatedData.data[selectedCountryIndex].provinces.push({
          id: updatedData.data[selectedCountryIndex].provinces.length + 1,
          name: formInput.province,
          districts: [],
        });
        console.log(
          "New province added:",
          formInput.province
          // updatedData.data[selectedCountryIndex].provinces
        );
      } else {
        console.log("Province already exists!");
      }
    }
    // Add new district
    else if (formInput.district && selectedProvince) {
      console.log("Adding new district:", formInput.district);
      const selectedCountryIndex = updatedData.data.findIndex(
        (country) => country.id === selectedCountry?.id
      );
      const selectedProvinceIndex = updatedData.data[
        selectedCountryIndex
      ].provinces.findIndex((province) => province.id === selectedProvince.id);
      console.log("Selected Province Index:", selectedProvinceIndex);
      const districtExists = updatedData.data[selectedCountryIndex].provinces[
        selectedProvinceIndex
      ].districts.find((district) => district.name === formInput.district);
      if (!districtExists) {
        updatedData.data[selectedCountryIndex].provinces[
          selectedProvinceIndex
        ].districts.push({
          id:
            updatedData.data[selectedCountryIndex].provinces[
              selectedProvinceIndex
            ].districts.length + 1,
          name: formInput.district,
          cities: [],
        });
        console.log(
          "New district added:",
          formInput.district
          // updatedData.data[selectedCountryIndex].provinces[
          //   selectedProvinceIndex ].districts
        );
      } else {
        console.log("District already exists!");
      }
    }
    //Add new city
    else if (formInput.city && selectedDistrict) {
      console.log("Adding new city:", formInput.city);
      const selectedCountryIndex = updatedData.data.findIndex(
        (country) => country.id === selectedCountry?.id
      );
      const selectedProvinceIndex = updatedData.data[
        selectedCountryIndex
      ].provinces.findIndex((province) => province.id === selectedProvince?.id);
      const selectedDistrictIndex = updatedData.data[
        selectedCountryIndex
      ].provinces[selectedProvinceIndex].districts.findIndex(
        (district) => district.id === selectedDistrict.id
      );
      console.log("Selected District Index:", selectedDistrictIndex);
      const cityExists = updatedData.data[selectedCountryIndex].provinces[
        selectedProvinceIndex
      ].districts[selectedDistrictIndex].cities.find(
        (city) => city.name === formInput.city
      );
      if (!cityExists) {
        updatedData.data[selectedCountryIndex].provinces[
          selectedProvinceIndex
        ].districts[selectedDistrictIndex].cities.push({
          id:
            updatedData.data[selectedCountryIndex].provinces[
              selectedProvinceIndex
            ].districts[selectedDistrictIndex].cities.length + 1,
          name: formInput.city,
          no_of_wards: null,
        });
        console.log(
          "New city added:",
          updatedData.data[selectedCountryIndex].provinces[
            selectedProvinceIndex
          ].districts[selectedDistrictIndex].cities
        );
      } else {
        console.log("City already exists!");
      }
    }

    // Update state
    console.log("Final Updated Data before setState:", updatedData);
    setData({ ...updatedData });
    setFormInput({ country: "", province: "", district: "", city: "" });
  };

  return (
    <div>
      <>
        <h1 className="text-white">Address : </h1>
        {/* Country List */}
        <div className="row g-5 g-xl-8">
          <div className="col-xl-3 mb-xl-10">
            <div className="card card-flush">
              <div
                className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-center h-50px"
                style={{
                  backgroundImage:
                    "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
                }}
                data-theme="light"
              >
                {/* Card header content, like a title or icon */}
                <h2 className="text-white">Country</h2>
              </div>
              <div className="card-body">
                {/* Card content goes here */}
                <ul className="list-group">
                  {data.data.map((country) => (
                    <li
                      className={
                        selectedCountry?.id === country.id
                          ? "list-group-item active"
                          : "list-group-item"
                      }
                      key={country.id}
                      onClick={() => {
                        setSelectedCountry(country);
                        setSelectedProvince(null);
                        setSelectedDistrict(null);
                        console.log(country);
                      }}
                      style={{
                        cursor: "pointer",
                        fontWeight:
                          selectedCountry?.id === country.id
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {country.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                {/* Optional footer content */}
                <div className="input-group mb-5">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="New Country"
                    value={formInput.country}
                    onChange={(e) =>
                      setFormInput({ ...formInput, country: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddData} className="btn btn-primary">
                  Add More Country
                </button>
              </div>
            </div>
          </div>

          {/* Province List */}
          <div className="col-xl-3 mb-xl-10">
            <div className="card card-flush">
              <div
                className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-center h-50px"
                style={{
                  backgroundImage:
                    "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
                }}
                data-theme="light"
              >
                {/* Card header content, like a title or icon */}
                <h2 className="text-white">Province</h2>
              </div>
              <div className="card-body">
                {selectedCountry && (
                  <ul className="list-group">
                    {selectedCountry.provinces.map((province) => (
                      <li
                        className={
                          selectedProvince?.id === province.id
                            ? "list-group-item active"
                            : "list-group-item"
                        }
                        key={province.id}
                        onClick={() => {
                          setSelectedProvince(province);
                          setSelectedDistrict(null);
                          console.log(province);
                        }}
                        style={{
                          cursor: "pointer",
                          color:
                            selectedProvince?.id === province.id
                              ? "yellow"
                              : "black",
                          fontWeight:
                            selectedProvince?.id === province.id
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {province.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer">
                <div className="input-group mb-5">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="New Province"
                    value={formInput.province}
                    onChange={(e) =>
                      setFormInput({ ...formInput, province: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddData} className="btn btn-primary">
                  Add More Province
                </button>
              </div>
            </div>
          </div>

          {/* District List */}
          <div className="col-xl-3 mb-xl-10">
            <div className="card card-flush">
              <div
                className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-center h-50px"
                style={{
                  backgroundImage:
                    "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
                }}
                data-theme="light"
              >
                {/* Card header content, like a title or icon */}
                <h2 className="text-white">District</h2>
              </div>
              <div className="card-body">
                {selectedProvince && (
                  <ul className="list-group">
                    {selectedProvince.districts.map((district) => (
                      <li
                        className={
                          selectedDistrict?.id === district.id
                            ? "list-group-item active"
                            : "list-group-item"
                        }
                        key={district.id}
                        onClick={() => {
                          setSelectedDistrict(district);
                          setSelectedCity(null);
                          console.log(district);
                        }}
                        style={{
                          cursor: "pointer",
                          color:
                            selectedDistrict?.id === district.id
                              ? "yellow"
                              : "black",
                          fontWeight:
                            selectedDistrict?.id === district.id
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {district.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer">
                <div className="input-group mb-5">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="New District"
                    value={formInput.district}
                    onChange={(e) =>
                      setFormInput({ ...formInput, district: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddData} className="btn btn-primary">
                  Add More District
                </button>
              </div>
            </div>
          </div>

          {/* Cities List */}
          <div className="col-xl-3 mb-xl-10">
            <div className="card card-flush">
              <div
                className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-center h-50px"
                style={{
                  backgroundImage:
                    "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
                }}
                data-theme="light"
              >
                {/* Card header content, like a title or icon */}
                <h2 className="text-white">Cities</h2>
              </div>
              <div className="card-body">
                {selectedDistrict && (
                  <ul className="list-group">
                    {selectedDistrict.cities.map((city) => (
                      <li
                        className={
                          selectedCity?.id === city.id
                            ? "list-group-item active"
                            : "list-group-item"
                        }
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          console.log(city);
                        }}
                        style={{
                          cursor: "pointer",
                          color:
                            selectedCity?.id === city.id ? "yellow" : "black",
                          fontWeight:
                            selectedCity?.id === city.id ? "bold" : "normal",
                        }}
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer">
                <div className="input-group mb-5">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="New City"
                    value={formInput.city}
                    onChange={(e) =>
                      setFormInput({ ...formInput, city: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddData} className="btn btn-primary">
                  Add More City
                </button>
              </div>
            </div>
          </div>
        </div>
      </>

      {/* Display Data */}
      <div>
        <h2>Data Structure</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Address;
