import React, { useState } from "react";
import { CountryType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";

interface CountryProps {
  countries: CountryType[];
  selectedCountry: CountryType | null;
  onSelectCountry: (country: CountryType) => void;
  onAddCountry: (newCountry: CountryType) => void;
  onEditCountry: (updatedCountry: CountryType) => void;
  countryFormInput: { country: string };
  setCountryFormInput: React.Dispatch<
    React.SetStateAction<{ country: string }>
  >;
}

const Country = ({
  countries,
  selectedCountry,
  onSelectCountry,
  onAddCountry,
  onEditCountry,
  countryFormInput,
  setCountryFormInput,
}: CountryProps) => {
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null); // Tracks which country is being edited
  const [editInput, setEditInput] = useState<string>(""); // Tracks the value being edited

  const handleEditClick = (country: CountryType) => {
    setEditingCountryId(country.id); // Set the country being edited
    setEditInput(country.name); // Pre-fill the input with the current name
  };

  const handleSaveEdit = () => {
    if (editingCountryId === null) return;

    const updatedCountry = {
      id: editingCountryId,
      name: editInput,
      provinces:
        countries.find((country) => country.id === editingCountryId)
          ?.provinces || [], // Preserve existing provinces or default to an empty array
    };

    onEditCountry(updatedCountry); // Call the parent callback with the updated country
    setEditingCountryId(null); // Exit edit mode
    setEditInput(""); // Reset the input field
  };

  const handleCancelEdit = () => {
    setEditingCountryId(null); // Exit edit mode without saving
    setEditInput(""); // Reset the input field
  };

  const handleAddCountry = () => {
    const newCountry: CountryType = {
      id: countries.length + 1, // Generate a new ID
      name: countryFormInput.country,
      provinces: [], // Initialize provinces as an empty array
    };

    onAddCountry(newCountry); // Call the parent callback to add the new country
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
        <h2 className="text-white">Country</h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {countries.map((country) => (
            <li
              key={country.id}
              className={`${
                selectedCountry?.id === country.id
                  ? "list-group-item active"
                  : "list-group-item"
              }`}
              onClick={() => onSelectCountry(country)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {editingCountryId === country.id ? (
                  // Render the input field and Save/Cancel buttons when editing
                  <div className="w-100 d-flex align-items-center">
                    <input
                      placeholder={country.name}
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
                  // Render the country name and Edit button normally
                  <>
                    <span className="country-name flex-grow-1">
                      <strong>{country.name}</strong>
                    </span>
                    <button
                      title="Edit country"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the select event
                        handleEditClick(country);
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
            placeholder="New Country"
            value={countryFormInput.country}
            onChange={(e) => setCountryFormInput({ country: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddCountry}
          className="btn btn-sm btn-light-info w-20 mb-2 d-flex"
        >
          <strong> Add More Country</strong>
        </button>
      </div>
    </div>
  );
};

export default Country;
