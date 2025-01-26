import React, { useState } from "react";
import { CountryType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";
import Icon from "../../../components/Icon/Icon";

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
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (country: CountryType) => {
    setEditingCountryId(country.id);
    setEditInput(country.name);
  };

  const handleSaveEdit = () => {
    if (editingCountryId === null) return;

    const updatedCountry = {
      id: editingCountryId,
      name: editInput,
      provinces:
        countries.find((country) => country.id === editingCountryId)
          ?.provinces || [],
    };

    onEditCountry(updatedCountry);
    setEditingCountryId(null);
    setEditInput("");
  };

  const handleCancelEdit = () => {
    setEditingCountryId(null);
    setEditInput("");
  };

  const handleAddCountry = () => {
    const newCountry: CountryType = {
      id: countries.length + 1,
      name: countryFormInput.country,
      provinces: [],
    };

    onAddCountry(newCountry);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <strong>Country</strong>
        </h2>
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
                  <>
                    <span className="country-name flex-grow-1">
                      <strong>{country.name}</strong>
                    </span>
                    <button
                      title="Edit country"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(country);
                      }}
                    >
                      <Icon name="edit" className="scg-icon-1" />
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
