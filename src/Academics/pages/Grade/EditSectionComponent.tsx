import React, { useCallback, useEffect, useState } from "react";
import useFaculty from "../../hooks/useFaculty";
import { UpdateAcademicSessionInterface } from "../../services/academicSessionService";

interface UpdateSectionData {
  id: number | null;
  name: string;
}

interface UpdateSections {
  [key: string]: UpdateSectionData[]; // Dynamic keys
}

interface UpdateGradeInterface {
  id: number;
  name: string;
  grade_group_id: number;
  short_name: string;
  is_active: number;
  has_faculties: number;
  section_type: "standard" | "custom";
  session: UpdateAcademicSessionInterface;
  sections: UpdateSections;
}

export interface EditSectionDataInterface {
  hasFaculties: boolean;
  sectionType: "standard" | "custom";
  facultySections:
    | { facultyId: number; sections: UpdateSectionData[] }[]
    | null;
  sections: UpdateSectionData[] | null;
}

interface EditSectionResponse {
  editData: UpdateGradeInterface;
  onSectionDataChange: (
    data: EditSectionDataInterface,
    isValid: boolean
  ) => void;
}

const EditSectionComponent = ({
  editData,
  onSectionDataChange,
}: EditSectionResponse) => {
  const { faculties } = useFaculty({});
  const [hasFaculties, setHasFaculties] = useState<boolean>(false);
  const [sectionType, setSectionType] = useState<"standard" | "custom">(
    editData.section_type
  );
  const [facultySections, setFacultySections] = useState<
    { facultyId: number; sections: UpdateSectionData[] }[]
  >(
    editData.has_faculties
      ? Object.entries(editData.sections).map(([facultyId, sections]) => ({
          facultyId: Number(facultyId),
          sections: sections.map((section) => ({
            id: section.id,
            name: section.name,
          })),
        }))
      : []
  );
  const [sections, setSections] = useState<UpdateSectionData[]>(() => {
    return editData.has_faculties
      ? []
      : Object.values(editData.sections).flat();
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log("Edit Section Component:", editData);
    if (editData.has_faculties === 1) {
      setHasFaculties(true);
    } else {
      setHasFaculties(false);
    }
    setSectionType(editData.section_type);
    const allSections: UpdateSectionData[] = Object.values(
      editData.sections || {}
    ).flat();
    setSections(allSections); // This should work without type errors

    if (editData.has_faculties) {
      setFacultySections(
        Object.entries(editData.sections).map(([key, sections]) => {
          // Split the key to get the faculty ID
          const parts = key.split(",").map((part) => part.trim());
          const facultyId = parts[1] ? Number(parts[1]) : 0; // Default to 0 or any valid number if null

          return {
            facultyId: facultyId, // Ensure this is always a number
            sections: sections.map((section) => ({
              id: section.id,
              name: section.name,
            })),
          };
        })
      );
    } else {
      setFacultySections([]);
    }

    console.log("Edit Data Sections:", editData.sections);
  }, [editData]);

  useEffect(() => {
    console.log("Faculty Sections:", facultySections);
    console.log("Sections:", sections);
    console.log("hasFaculties:", editData.has_faculties);
  }, [facultySections, sections, hasFaculties, editData]);

  const handleStandardSectionCheckbox = (
    section: UpdateSectionData,
    isChecked: boolean
  ) => {
    setSections((prev) =>
      isChecked
        ? [...prev, { id: null, name: section.name }]
        : prev.filter((item) => item.name !== section.name)
    );
  };

  const handleFacultyChange = (facultyId: number, checked: boolean) => {
    if (checked) {
      setFacultySections((prev) => [...prev, { facultyId, sections: [] }]);
    } else {
      setFacultySections((prev) =>
        prev.filter((item) => item.facultyId !== facultyId)
      );
    }
  };

  const handleSectionChange = (
    facultyId: number,
    section: UpdateSectionData,
    checked: boolean
  ) => {
    setFacultySections((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              sections: checked
                ? [...item.sections, section]
                : item.sections.filter((s) => s.name !== section.name),
            }
          : item
      )
    );
  };

  const handleFacultyCustomSection = (facultyId: number) => {
    setFacultySections((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              sections: [...item.sections, { id: null, name: "" }], // Create a valid UpdateSectionData object
            }
          : item
      )
    );
  };

  const removeFacultyCustomSection = (facultyId: number, index: number) => {
    setFacultySections((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              sections: item.sections.filter((_, i) => i !== index),
            }
          : item
      )
    );
  };

  const generalSections = ["A", "B", "C", "D", "E", "F", "G"];

  const handleHasFacultiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setHasFaculties(value);
    setFacultySections([]);
    setSections([]);
  };

  const handleSectionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as "standard" | "custom";
    setSectionType(value);
    setFacultySections([]);
    setSections([]);
  };

  const addCustomSection = () => {
    setSections([...sections, { id: null, name: "" }]);
  };

  const removeCustomSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleCustomSectionChange = (index: number, value: string) => {
    const newSections: UpdateSectionData[] = [...sections];
    newSections[index] = { id: null, name: value }; // Create a valid UpdateSectionData object
    setSections(newSections);
  };

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (hasFaculties && facultySections.length === 0) {
      newErrors.facultySections = "At least one faculty must be selected.";
    }
    if (!hasFaculties && sections.length === 0) {
      newErrors.sections = "At least one section must be added.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [hasFaculties, facultySections, sections]);

  useEffect(() => {
    const isValid = validate();

    const data: EditSectionDataInterface = {
      hasFaculties,
      sectionType,
      facultySections,
      sections,
    };
    onSectionDataChange(data, isValid);
  }, [
    hasFaculties,
    sectionType,
    facultySections,
    sections,
    onSectionDataChange,
    validate,
  ]);

  return (
    <>
      <div className="col-md-6 mb-3">
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            Grade's Section Name Type:
          </label>
          <div className="d-flex gap-3 mt-3">
            <div className="form-check">
              <input
                title="Standard"
                className="form-check-input"
                type="radio"
                value="standard"
                id="section_type_standard"
                name="section_type"
                checked={sectionType === "standard"}
                onChange={handleSectionTypeChange}
              />
              <label
                className="form-check-label"
                htmlFor="section_type_standard"
              >
                Standard A,B,C
              </label>
            </div>
            <div className="form-check">
              <input
                title="Custom"
                className="form-check-input"
                type="radio"
                value="custom"
                name="section_type"
                id="section_type_custom"
                checked={sectionType === "custom"}
                onChange={handleSectionTypeChange}
              />
              <label className="form-check-label" htmlFor="section_type_custom">
                Custom Names
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            Does Grade Have Streams?
          </label>
          <div className="d-flex gap-3 mt-3">
            <div className="form-check">
              <input
                title="Yes"
                className="form-check-input"
                type="radio"
                value="true"
                id="has_faculties_yes"
                name="has_faculties"
                checked={hasFaculties === true}
                onChange={handleHasFacultiesChange}
              />
              <label className="form-check-label" htmlFor="has_faculties_yes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                title="No"
                className="form-check-input"
                type="radio"
                value="false"
                id="has_faculties_no"
                name="has_faculties"
                checked={hasFaculties === false}
                onChange={handleHasFacultiesChange}
              />
              <label className="form-check-label" htmlFor="has_faculties_no">
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      {hasFaculties && (
        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Select Faculties
            </label>
            <div className="row flex-wrap">
              {faculties.map((faculty, index) => (
                <div className="col-md-12 mb-3" key={index}>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input sectionCheckbox"
                          type="checkbox"
                          value={faculty.id}
                          id={faculty.id.toString()}
                          onChange={(e) =>
                            handleFacultyChange(faculty.id, e.target.checked)
                          }
                          checked={facultySections.some(
                            (item) => item.facultyId === faculty.id
                          )}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={faculty.id.toString()}
                        >
                          {faculty.name} ({faculty.code})
                        </label>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        {sectionType === "standard" &&
                          generalSections.map((section, index) => (
                            <div className="col mb-3" key={index}>
                              <div className="form-check">
                                <input
                                  title={section}
                                  className="form-check-input sectionCheckbox"
                                  type="checkbox"
                                  checked={facultySections.some(
                                    (item) =>
                                      item.facultyId === faculty.id &&
                                      item.sections.some(
                                        (s) => s.name === section
                                      )
                                  )}
                                  onChange={(e) =>
                                    handleSectionChange(
                                      faculty.id,
                                      { id: null, name: section },
                                      e.target.checked
                                    )
                                  }
                                  disabled={
                                    !facultySections.some(
                                      (item) => item.facultyId === faculty.id
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`section-${index}`}
                                >
                                  {section}
                                </label>
                              </div>
                            </div>
                          ))}
                        {facultySections.some(
                          (item) => item.facultyId === faculty.id
                        ) &&
                          sectionType === "custom" && (
                            <div className="col-12">
                              <div className="row">
                                <div className="col-12 mb-3">
                                  <label className="required fw-bold fs-6 mb-2">
                                    Add Sections for {faculty.name}
                                  </label>
                                </div>
                                <div className="col-12">
                                  <div className="row">
                                    {facultySections.map(
                                      (facultySection) =>
                                        facultySection.facultyId ===
                                          faculty.id &&
                                        facultySection.sections.map(
                                          (section, index) => (
                                            <div
                                              className="col-md-6 mb-3"
                                              key={index}
                                            >
                                              <div className="d-flex">
                                                <input
                                                  type="text"
                                                  className="form-control form-control-sm"
                                                  style={{
                                                    height: 35,
                                                    borderRadius: "5px 0 0 5px",
                                                  }}
                                                  placeholder="Section name"
                                                  value={section.name}
                                                  onChange={(e) => {
                                                    const newSections =
                                                      facultySection.sections.map(
                                                        (s, i) =>
                                                          i === index
                                                            ? {
                                                                ...s,
                                                                name: e.target
                                                                  .value,
                                                              }
                                                            : s // Update the section name
                                                      );
                                                    setFacultySections((prev) =>
                                                      prev.map((item) =>
                                                        item.facultyId ===
                                                        facultySection.facultyId
                                                          ? {
                                                              ...item,
                                                              sections:
                                                                newSections,
                                                            }
                                                          : item
                                                      )
                                                    );
                                                  }}
                                                />
                                                <button
                                                  className="btn btn-danger d-flex justify-content-center align-items-center"
                                                  style={{
                                                    height: 35,
                                                    borderRadius: "0 5px 5px 0",
                                                  }}
                                                  type="button"
                                                  onClick={() =>
                                                    removeFacultyCustomSection(
                                                      facultySection.facultyId,
                                                      index
                                                    )
                                                  } // Pass facultyId and index
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          )
                                        )
                                    )}
                                    <div className="col-12">
                                      <button
                                        className="btn btn-sm btn-danger"
                                        type="button"
                                        onClick={() =>
                                          handleFacultyCustomSection(faculty.id)
                                        }
                                        disabled={
                                          !facultySections.some(
                                            (item) =>
                                              item.facultyId === faculty.id
                                          )
                                        }
                                      >
                                        Add Section
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <hr />
        </div>
      )}
      {!hasFaculties && sectionType === "standard" && (
        <div className="col-12">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Select Sections
            </label>
            <div className="row">
              {generalSections.map((section, index) => (
                <div className="col-1" key={index}>
                  <div className="form-check">
                    <input
                      title={section}
                      className="form-check-input sectionCheckbox"
                      type="checkbox"
                      value={section}
                      id={`section-${index}`}
                      checked={sections.some((sect) => sect.name === section)}
                      onChange={(e) =>
                        handleStandardSectionCheckbox(
                          { id: null, name: section },
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`section-${index}`}
                    >
                      {section}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!hasFaculties && sectionType === "custom" && (
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-3">
              <label className="required fw-bold fs-6 mb-2">
                Select Sections
              </label>
            </div>
            <div className="col-12">
              <div className="row">
                {sections.map((section, index) => (
                  <div className="col-md-4 mb-3" key={index}>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        style={{
                          height: 40,
                          borderRadius: "5px 0 0 5px",
                        }}
                        placeholder="Section name"
                        value={section.name}
                        onChange={(e) =>
                          handleCustomSectionChange(index, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-danger d-flex justify-content-center align-items-center"
                        style={{
                          height: 40,
                          borderRadius: "0 5px 5px 0",
                        }}
                        type="button"
                        onClick={() => removeCustomSection(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={addCustomSection}
                  >
                    Add Section
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {errors.facultySections && (
        <h5 className="text-danger">Note: {errors.facultySections}</h5>
      )}
      {errors.sections && (
        <h5 className="text-danger">Note: {errors.sections}</h5>
      )}
    </>
  );
};

export default EditSectionComponent;
