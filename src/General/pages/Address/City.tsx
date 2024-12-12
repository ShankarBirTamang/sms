import React, { useState } from "react";
import { CityType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";

interface CityProps {
  cities: CityType[];
  selectedCity: CityType | null;
  onSelectCity: (city: CityType) => void;
  onAddCity: (newCity: CityType, no_of_wards: number) => void;
  onEditCity: (updatedCity: CityType) => void;
  cityFormInput: { city: string };
  setCityFormInput: React.Dispatch<React.SetStateAction<{ city: string }>>;
}

const City = ({
  cities,
  selectedCity,
  onSelectCity,
  onAddCity,
  onEditCity,
  cityFormInput,
  setCityFormInput,
}: CityProps) => {
  const [editingCityId, setEditingCityId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (city: CityType) => {
    setEditingCityId(city.id);
    setEditInput(city.name);
    console.log(`Editing ${city.name}`);
  };

  const handleSaveEdit = () => {
    if (editingCityId === null) return;
    const updatedCity = {
      id: editingCityId,
      name: editInput,
      no_of_wards:
        cities.find((city) => city.id === editingCityId)?.no_of_wards || 0,
    };
    onEditCity(updatedCity);
    setEditingCityId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleCancelEdit = () => {
    setEditingCityId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleAddCity = () => {
    const newCity: CityType = {
      id: cities.length + 1,
      name: cityFormInput.city,
      no_of_wards: 0,
    };
    onAddCity(newCity, newCity.no_of_wards ?? 0);
    setCityFormInput({ city: "" });
  };

  return (
    <div className="card card-flush">
      <div
        className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-center h-50px"
        style={{
          backgroundImage:
            "url('https://publichighschool.edu.np/main/media/svg/shapes/top-green.png')",
        }}
        data-theme="light"
      >
        <h2 className="text-white">City</h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {cities.map((city) => (
            <li
              key={city.id}
              className={`${
                selectedCity?.id === city.id
                  ? "list-group-item active"
                  : "list-group-item"
              }`}
              onClick={() => onSelectCity(city)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {editingCityId === city.id ? (
                  // Render the input field and Save/Cancel buttons when editing
                  <div className="w-100 d-flex align-items-center">
                    <input
                      placeholder={city.name}
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="form-control form-control-sm me-2"
                    />
                    <button
                      title="Save changes"
                      type="button"
                      className="btn btn-light-success btn-sm me-1"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      title="Cancel edit"
                      type="button"
                      className="btn btn-light-danger btn-sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Render the City name and Edit button normally
                  <>
                    <span className="City-name flex-grow-1">
                      <strong>{city.name}</strong>
                    </span>
                    <button
                      title="Edit City"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the select event
                        handleEditClick(city);
                      }}
                    >
                      {icons.edit}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <div className="input-group mb-5">
          <input
            className="form-control"
            type="text"
            placeholder="New City"
            value={cityFormInput.city}
            onChange={(e) => setCityFormInput({ city: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddCity}
          className="btn btn-sm btn-light-info w-20 mb-2 d-flex"
        >
          <strong> Add More City</strong>
        </button>
      </div>
    </div>
  );
};

export default City;
