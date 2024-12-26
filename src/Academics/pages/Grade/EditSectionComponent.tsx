import { useCallback, useEffect, useState } from "react";
import useFaculty from "../../hooks/useFaculty";
import Loading from "../../../components/Loading/Loading";
import {
  EditSectionData,
  EditSectionDataInterface,
  UpdateGradeInterface,
} from "../../services/gradeService";

enum SectionType {
  STANDARD = "standard",
  CUSTOM = "custom",
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
  const [sectionType, setSectionType] = useState<SectionType>(
    editData.section_type
  );
  const [facultySections, setFacultySections] = useState<
    { facultyId: number; sections: EditSectionData[] }[]
  >([]);
  const [sections, setSections] = useState<EditSectionData[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const generalSections = ["A", "B", "C", "D", "E", "F", "G"];

  useEffect(() => {
    setSectionType(editData.section_type);
    if (editData.has_faculties) {
      setFacultySections(
        Object.entries(editData.sections).map(([key, sections]) => {
          const facultyId = Number(key.split(",")[1]) || 0;
          return {
            facultyId,
            isNew: false,
            sections: sections.map(({ id, name }) => ({
              id,
              name,
              isNew: false,
            })),
          };
        })
      );
      setHasFaculties(true);
    } else {
      const allSections: EditSectionData[] = Object.values(
        editData.sections || {}
      )
        .flat()
        .map((section) => ({ ...section, isNew: false }));

      setSections(allSections);
    }
  }, [editData]);

  const handleFacultyChange = useCallback(
    (facultyId: number, checked: boolean) => {
      setFacultySections((prev) =>
        checked
          ? [...prev, { facultyId, sections: [] }]
          : prev.filter((item) => item.facultyId !== facultyId)
      );
    },
    []
  );

  const handleSectionChange = useCallback(
    (facultyId: number, section: EditSectionData, checked: boolean) => {
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
    },
    []
  );

  const handleCustomSectionChange = useCallback(
    (index: number, value: string) => {
      setSections((prev) =>
        prev.map((section, i) =>
          i === index ? { ...section, name: value } : section
        )
      );
    },
    []
  );

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (hasFaculties && facultySections.length === 0)
      newErrors.facultySections = "At least one faculty must be selected.";
    if (!hasFaculties && sections.length === 0)
      newErrors.sections = "At least one section must be added.";
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

  const handleStandardSectionCheckbox = (
    section: { id: number; name: string; isNew: boolean },
    isChecked: boolean
  ) => {
    setSections((prev) =>
      isChecked
        ? [...prev, { ...section, id: section.id ?? 0 }]
        : prev.filter((item) => item.name !== section.name)
    );
  };

  const removeFacultyCustomSection = (facultyId: number, index: number) => {
    setFacultySections((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? { ...item, sections: item.sections.filter((_, i) => i !== index) }
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
              sections: [...item.sections, { id: 0, name: "", isNew: true }],
            }
          : item
      )
    );
  };

  const addCustomSection = () => {
    setSections([...sections, { id: 0, name: "", isNew: true }]);
  };

  const removeCustomSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
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
                    value={SectionType.STANDARD}
                    id="section_type_standard"
                    name="section_type"
                    checked={sectionType === SectionType.STANDARD}
                    onChange={() => setSectionType(SectionType.STANDARD)}
                    disabled={editData.section_type === SectionType.CUSTOM}
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
                    value={SectionType.CUSTOM}
                    id="section_type_custom"
                    name="section_type"
                    checked={sectionType === SectionType.CUSTOM}
                    onChange={() => setSectionType(SectionType.CUSTOM)}
                    disabled={editData.section_type === SectionType.CUSTOM}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="section_type_custom"
                  >
                    Custom Names
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Does Grade Have Streams/ Faculties?
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
                    disabled
                    checked={hasFaculties}
                    onChange={() => setHasFaculties(true)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="has_faculties_yes"
                  >
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
                    disabled
                    checked={!hasFaculties}
                    onChange={() => setHasFaculties(false)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="has_faculties_no"
                  >
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
                    .map((faculty) => (
                      <div className="col-md-12 mb-3" key={faculty.id}>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-check">
                              <input
                                className="form-check-input sectionCheckbox"
                                type="checkbox"
                                value={faculty.id}
                                id={faculty.id.toString()}
                                onChange={(e) =>
                                  handleFacultyChange(
                                    faculty.id,
                                    e.target.checked
                                  )
                                }
                                checked={facultySections.some(
                                  (item) =>
                                    item.facultyId === faculty.id && item
                                )}
                                disabled={facultySections.some(
                                  (item) =>
                                    item.facultyId === faculty.id &&
                                    item.sections.some(
                                      (section) => !section.isNew
                                    )
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
                              {sectionType === SectionType.STANDARD &&
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
                                            {
                                              id: 0,
                                              name: section,
                                              isNew: true,
                                            },
                                            e.target.checked
                                          )
                                        }
                                        disabled={facultySections.some(
                                          (item) =>
                                            item.facultyId === faculty.id &&
                                            item.sections.some(
                                              (s) =>
                                                s.name === section && !s.isNew
                                            )
                                        )}
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
                                sectionType === SectionType.CUSTOM && (
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
                                                        value={section.name}
                                                        onChange={(e) => {
                                                          const newSections =
                                                            facultySection.sections.map(
                                                              (s, i) =>
                                                                i === index
                                                                  ? {
                                                                      ...s,
                                                                      name: e
                                                                        .target
                                                                        .value,
                                                                    }
                                                                  : s
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
                                                      {section.isNew && (
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
                                                          }
                                                        >
                                                          Delete
                                                        </button>
                                                      )}
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
                                                    item.facultyId ===
                                                    faculty.id
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
          {!hasFaculties && sectionType === SectionType.STANDARD && (
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
                          disabled={sections.some(
                            (sect) =>
                              sect.name === section && sect.isNew === false
                          )} // Disable only if the section is not new
                          id={`section-${index}`}
                          checked={sections.some(
                            (sect) => sect.name === section
                          )}
                          onChange={(e) =>
                            handleStandardSectionCheckbox(
                              { id: 0, name: section, isNew: true }, // This can be adjusted based on your logic for new sections
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
          {!hasFaculties && sectionType === SectionType.CUSTOM && (
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
                            style={{ height: 40, borderRadius: "5px 0 0 5px" }}
                            placeholder="Section name"
                            value={section.name}
                            onChange={(e) =>
                              handleCustomSectionChange(index, e.target.value)
                            }
                          />
                          {section.isNew && (
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
                          )}
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
      )}
    </>
  );
};

export default EditSectionComponent;
