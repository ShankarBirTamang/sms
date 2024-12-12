import React, { useState } from "react";
import { DistrictType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";

interface DistrictProps {
  districts: DistrictType[];
  selectedDistrict: DistrictType | null;
  onSelectDistrict: (district: DistrictType) => void;
  onAddDistrict: (newDistrict: DistrictType) => void;
  onEditDistrict: (updatedDistrict: DistrictType) => void;
  districtFormInput: { district: string };
  setDistrictFormInput: React.Dispatch<
    React.SetStateAction<{ district: string }>
  >;
}

const District = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  onAddDistrict,
  onEditDistrict,
  districtFormInput,
  setDistrictFormInput,
}: DistrictProps) => {
  const [editingDistrictId, setEditingDistrictId] = useState<number | null>(
    null
  );
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (district: DistrictType) => {
    setEditingDistrictId(district.id);
    setEditInput(district.name);
    console.log(`Editing ${district.name}`);
  };

  const handleSaveEdit = () => {
    if (editingDistrictId === null) return;
    const updatedDistrict = {
      id: editingDistrictId,
      name: editInput,
      cities:
        districts.find((district) => district.id === editingDistrictId)
          ?.cities || [],
    };
    onEditDistrict(updatedDistrict);
    setEditingDistrictId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleCancelEdit = () => {
    setEditingDistrictId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleAddDistrict = () => {
    const newDistrict: DistrictType = {
      id: districts.length + 1,
      name: districtFormInput.district,
      cities: [],
    };
    onAddDistrict(newDistrict);
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
        <h2 className="text-white">District</h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {districts.map((district) => (
            <li
              key={district.id}
              className={`${
                selectedDistrict?.id === district.id
                  ? "list-group-item active"
                  : "list-group-item"
              }`}
              onClick={() => onSelectDistrict(district)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {editingDistrictId === district.id ? (
                  // Render the input field and Save/Cancel buttons when editing
                  <div className="w-100 d-flex align-items-center">
                    <input
                      placeholder={district.name}
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
                  // Render the District name and Edit button normally
                  <>
                    <span className="District-name flex-grow-1">
                      <strong>{district.name}</strong>
                    </span>
                    <button
                      title="Edit District"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the select event
                        handleEditClick(district);
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
            placeholder="New District"
            value={districtFormInput.district}
            onChange={(e) => setDistrictFormInput({ district: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddDistrict}
          className="btn btn-sm btn-light-info w-20 mb-2 d-flex"
        >
          <strong> Add More District</strong>
        </button>
      </div>
    </div>
  );
};

export default District;
