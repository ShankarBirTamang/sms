import React, { useState } from "react";
import { ProvinceType } from "../../Services/addressServices";
import { icons } from "../../../components/Icon/icons";
import Icon from "../../../components/Icon/Icon";

interface ProvinceProps {
  provinces: ProvinceType[];
  selectedProvince: ProvinceType | null;
  onSelectProvince: (province: ProvinceType) => void;
  onAddProvince: (newProvince: ProvinceType) => void;
  onEditProvince: (updatedProvince: ProvinceType) => void;
  provinceFormInput: { province: string };
  setProvinceFormInput: React.Dispatch<
    React.SetStateAction<{ province: string }>
  >;
}

const Province = ({
  provinces,
  selectedProvince,
  onSelectProvince,
  onAddProvince,
  onEditProvince,
  provinceFormInput,
  setProvinceFormInput,
}: ProvinceProps) => {
  const [editingProvinceId, setEditingProvinceId] = useState<number | null>(
    null
  );
  const [editInput, setEditInput] = useState<string>("");

  const handleEditClick = (province: ProvinceType) => {
    setEditingProvinceId(province.id);
    setEditInput(province.name);
    console.log(`Editing ${province.name}`);
  };

  const handleSaveEdit = () => {
    if (editingProvinceId === null) return;
    const updatedProvince = {
      id: editingProvinceId,
      name: editInput,
      districts:
        provinces.find((province) => province.id === editingProvinceId)
          ?.districts || [],
    };
    onEditProvince(updatedProvince);
    setEditingProvinceId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleCancelEdit = () => {
    setEditingProvinceId(null); //Exit edit mode
    setEditInput(""); //reset the input field
  };

  const handleAddProvince = () => {
    const newProvince: ProvinceType = {
      id: provinces.length + 1,
      name: provinceFormInput.province,
      districts: [],
    };
    onAddProvince(newProvince);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <strong>Province</strong>
        </h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {provinces.map((province) => (
            <li
              key={province.id}
              className={`${
                selectedProvince?.id === province.id
                  ? "list-group-item active"
                  : "list-group-item"
              }`}
              onClick={() => onSelectProvince(province)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                {editingProvinceId === province.id ? (
                  // Render the input field and Save/Cancel buttons when editing
                  <div className="w-100 d-flex align-items-center">
                    <input
                      placeholder={province.name}
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
                  // Render the province name and Edit button normally
                  <>
                    <span className="province-name flex-grow-1">
                      <strong>{province.name}</strong>
                    </span>
                    <button
                      title="Edit Province"
                      type="button"
                      className="btn btn-light-info btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the select event
                        handleEditClick(province);
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
            placeholder="New Province"
            value={provinceFormInput.province}
            onChange={(e) => setProvinceFormInput({ province: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddProvince}
          className="btn btn-sm btn-light-info w-20 mb-2 d-flex"
        >
          <strong> Add More Province</strong>
        </button>
      </div>
    </div>
  );
};

export default Province;
