import React, { useCallback, useEffect, useState } from "react";
import useFaculty from "../../hooks/useFaculty";
import { SectionData } from "../../services/gradeService";

interface AddSectionInterface {
  onSectionDataChange: (data: SectionData, isValid: boolean) => void;
}

const SectionComponent = ({ onSectionDataChange }: AddSectionInterface) => {
  const { faculties } = useFaculty({});
  const [hasFaculties, setHasFaculties] = useState<boolean>(false);
  const [sectionType, setSectionType] = useState<"standard" | "custom">(
    "standard"
  );
  const [facultySections, setFacultySections] = useState<
    { facultyId: number; sections: string[] }[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [sections, setSections] = useState<string[]>([]);

  const handleStandardSectionCheckbox = (
    section: string,
    isChecked: boolean
  ) => {
    setSections((prev) =>
      isChecked ? [...prev, section] : prev.filter((item) => item !== section)
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
    section: string,
    checked: boolean
  ) => {
    setFacultySections((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              sections: checked
                ? [...item.sections, section]
                : item.sections.filter((s) => s !== section),
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
              sections: [...item.sections, ""],
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
    setSections([...sections, ""]);
  };

  const removeCustomSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleCustomSectionChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index] = value;
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

    const data: SectionData = {
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
      <div className="col-12">
        <br />
        <span className="text-danger">
          Note:Once a section is created, it cannot be removed or deleted.
          Please ensure this limitation is considered during the creation
          process.
          <br />
          एक पटक सेक्शन सिर्जना गरेपछि, यसलाई मेटाउन मिल्दैन। कृपया यसलाई
          सिर्जना गर्ने क्रममा ध्यानमा राख्नुहोस्।
        </span>
        <br />
        <br />
      </div>
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
          {/* {errors.section_type && (
            <span className="text-danger">{errors.section_type.message}</span>
          )} */}
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            Does Grade Have Streams/Faculties?
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
              {faculties
                .filter((faculty) => faculty.name !== "General")
                .map((faculty, index) => (
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
                                        item.sections.includes(section)
                                    )}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        faculty.id,
                                        section,
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
                                                      borderRadius:
                                                        "5px 0 0 5px",
                                                    }}
                                                    placeholder="Section name"
                                                    value={section}
                                                    onChange={(e) => {
                                                      const newSections =
                                                        facultySection.sections.map(
                                                          (s, i) =>
                                                            i === index
                                                              ? e.target.value
                                                              : s // Update the section name
                                                        );
                                                      setFacultySections(
                                                        (prev) =>
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
                                                      borderRadius:
                                                        "0 5px 5px 0",
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
                                            handleFacultyCustomSection(
                                              faculty.id
                                            )
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
                      onChange={(e) =>
                        handleStandardSectionCheckbox(section, e.target.checked)
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
                        value={section}
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

export default SectionComponent;
