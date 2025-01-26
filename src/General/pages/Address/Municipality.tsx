import React, { useState } from "react";
import { MunicipalityType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";
import Icon from "../../../components/Icon/Icon";

interface MunicipalityProps {
  municipalities: MunicipalityType[];
  selectedMunicipality: MunicipalityType | null;
  onSelectMunicipality: (municipality: MunicipalityType) => void;
  onAddMunicipality: (
    newMunicipality: MunicipalityType,
    no_of_wards: number
  ) => void;
  onEditMunicipality: (updatedMunicipality: MunicipalityType) => void;
  municipalityFormInput: { municipality: string };
  setMunicipalityFormInput: React.Dispatch<
    React.SetStateAction<{ municipality: string }>
  >;
}

const Municipality = ({
  municipalities,
  selectedMunicipality,
  onSelectMunicipality,
  onAddMunicipality,
  onEditMunicipality,
  municipalityFormInput,
  setMunicipalityFormInput,
}: MunicipalityProps) => {
  const [editingMunicipalityId, setEditingMunicipalityId] = useState<
    number | null
  >(null);
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (municipality: MunicipalityType) => {
    setEditingMunicipalityId(municipality.id);
    setEditInput(municipality.name);
    console.log(`Editing ${municipality.name}`);
  };

  const handleSaveEdit = () => {
    if (editingMunicipalityId === null) return;
    const updatedMunicipality = {
      id: editingMunicipalityId,
      name: editInput,
      no_of_wards:
        municipalities.find(
          (municipality) => municipality.id === editingMunicipalityId
        )?.no_of_wards || 0,
    };
    onEditMunicipality(updatedMunicipality);
    setEditingMunicipalityId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleCancelEdit = () => {
    setEditingMunicipalityId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleAddMunicipality = () => {
    const newMunicipality: MunicipalityType = {
      id: municipalities.length + 1,
      name: municipalityFormInput.municipality,
      no_of_wards: 0,
    };
    onAddMunicipality(newMunicipality, newMunicipality.no_of_wards ?? 0);
    setMunicipalityFormInput({ municipality: "" });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <strong>Municipality</strong>
        </h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {municipalities.map((municipality) => (
            <li
              key={municipality.id}
              className={`${
                selectedMunicipality?.id === municipality.id
                  ? "list-group-item active"
                  : "list-group-item"
              }`}
              onClick={() => onSelectMunicipality(municipality)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {editingMunicipalityId === municipality.id ? (
                  // Render the input field and Save/Cancel buttons when editing
                  <div className="w-100 d-flex align-items-center">
                    <input
                      placeholder={municipality.name}
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
                  // Render the Municipality name and Edit button normally
                  <>
                    <span className="Municipality-name flex-grow-1">
                      <strong>{municipality.name}</strong>
                    </span>
                    <button
                      title="Edit Municipality"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the select event
                        handleEditClick(municipality);
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
            placeholder="New Municipality"
            value={municipalityFormInput.municipality}
            onChange={(e) =>
              setMunicipalityFormInput({ municipality: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAddMunicipality}
          className="btn btn-sm btn-light-info w-20 mb-2 d-flex"
        >
          <strong> Add More Municipality</strong>
        </button>
      </div>
    </div>
  );
};

export default Municipality;
