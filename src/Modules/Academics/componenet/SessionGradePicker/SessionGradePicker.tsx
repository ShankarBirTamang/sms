import React, { useEffect, useState } from "react";
import useAcademicLevels from "../../hooks/useAcademicLevels";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface SessionGradePickerProps {
  onChange: (selectedValues: {
    level: number | null;
    session: number | null;
    grade: number | null;
    section: number | null;
  }) => void;
  colSize?: number;
  errors?:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          academicLevelId?: number;
          academicSessionId?: number;
          gradeId?: number;
          sectionId?: number;
        }>
      >
    | undefined;
  value?: {
    level?: number | null;
    session?: number | null;
    grade?: number | null;
    section?: number | null;
  };
}

const SessionGradePicker = ({
  onChange,
  colSize = 3,
  errors,
  value,
}: SessionGradePickerProps) => {
  const { academicLevels } = useAcademicLevels({});

  const [selectedLevel, setSelectedLevel] = useState<number | null>(
    value?.level || null
  );
  const [selectedSession, setSelectedSession] = useState<number | null>(
    value?.session || null
  );
  const [selectedGrade, setSelectedGrade] = useState<number | null>(
    value?.grade || null
  );
  const [selectedSection, setSelectedSection] = useState<number | null>(
    value?.section || null
  );

  useEffect(() => {
    onChange({
      level: selectedLevel,
      session: selectedSession,
      grade: selectedGrade,
      section: selectedSection,
    });
  }, [
    academicLevels,
    selectedLevel,
    selectedSession,
    selectedGrade,
    selectedSection,
    onChange,
  ]);

  useEffect(() => {
    if (value) {
      setSelectedLevel(value.level ?? null);
      setSelectedSession(value.session ?? null);
      setSelectedGrade(value.grade ?? null);
      setSelectedSection(value.section ?? null);
    }
  }, [value]);

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(event.target.value, 10);
    setSelectedLevel(levelId);
    setSelectedSession(null);
    setSelectedGrade(null);
    setSelectedSection(null);
  };

  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionId = parseInt(event.target.value, 10);
    setSelectedSession(sessionId);
    setSelectedGrade(null);
    setSelectedSection(null);
  };

  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const gradeId = parseInt(event.target.value, 10);
    setSelectedGrade(gradeId);
    setSelectedSection(null);
  };

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = parseInt(event.target.value, 10);
    setSelectedSection(sectionId);
  };

  const filteredAcademicSessions = selectedLevel
    ? academicLevels.find((level) => level.id === selectedLevel)
        ?.active_academic_session || []
    : [];

  const filteredGrades = selectedSession
    ? filteredAcademicSessions.find((session) => session.id === selectedSession)
        ?.grades || []
    : [];

  const filteredSections = selectedGrade
    ? filteredGrades.find((grade) => grade.id === selectedGrade)?.sections || {}
    : {};

  const combinedSections =
    Object.entries(filteredSections).flatMap(([facultyKey, sections]) =>
      sections.map((section) => ({
        id: section.id,
        name: `${facultyKey.split(",")[0]} : ${section.name}`,
      }))
    ) || [];

  useEffect(() => {
    console.log("sess", errors);
  }, [errors]);

  return (
    <>
      <div className="row">
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label
              className="required fw-bold fs-6 mb-2"
              htmlFor="academicLevel"
            >
              Select Academic Level
            </label>
            <select
              id="academicLevel"
              className={`form-control ${
                errors?.academicLevelId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedLevel || ""}
              onChange={handleLevelChange}
            >
              <option value="" disabled hidden>
                Select Academic Level
              </option>
              {academicLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
            {errors?.academicLevelId && (
              <span className="text-danger">
                {errors.academicLevelId.message}
              </span>
            )}
          </div>
        </div>
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label
              className="required fw-bold fs-6 mb-2"
              htmlFor="academicSession"
            >
              Select Academic Session
            </label>
            <select
              id="academicSession"
              className={`form-control ${
                errors?.academicSessionId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedSession || ""}
              onChange={handleSessionChange}
            >
              <option value="" disabled hidden>
                {selectedLevel
                  ? "Select Session"
                  : "Select Academic Level First"}
              </option>
              {filteredAcademicSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
            {errors?.academicSessionId && (
              <span className="text-danger">
                {errors.academicSessionId.message}
              </span>
            )}
          </div>
        </div>
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2" htmlFor="grade">
              Select Grade
            </label>
            <select
              id="grade"
              className={`form-control ${
                errors?.gradeId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedGrade || ""}
              onChange={handleGradeChange}
            >
              <option value="" disabled hidden>
                {selectedSession
                  ? "Select Grade"
                  : "Select Academic Session First"}
              </option>
              {filteredGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
            {errors?.gradeId && (
              <span className="text-danger">{errors.gradeId.message}</span>
            )}
          </div>
        </div>
        <div className={`col-md-${colSize}`}>
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2" htmlFor="section">
              Select Section
            </label>
            <select
              id="section"
              className={`form-control ${
                errors?.sectionId && "is-invalid"
              } form-control mb-3 mb-lg-0`}
              value={selectedSection || ""}
              onChange={handleSectionChange}
            >
              <option value="" disabled hidden>
                {selectedGrade ? "Select Section" : "Select Grade First"}
              </option>
              {combinedSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {errors?.sectionId && (
              <span className="text-danger">{errors.sectionId.message}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionGradePicker;
