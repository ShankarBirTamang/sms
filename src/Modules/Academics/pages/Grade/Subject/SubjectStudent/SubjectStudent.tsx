import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDocumentTitle from "../../../../../../hooks/useDocumentTitle";
import useGrade from "../../../../hooks/useGrade";
import { StudentInterface } from "../../../../../../Modules/Student/services/studentService";
import {
  GradeInterface,
  SectionInterface,
} from "../../../../services/gradeService";
import useDebounce from "../../../../../../hooks/useDebounce";
import Loading from "../../../../../../components/Loading/Loading";
import Icon from "../../../../../../components/Icon/Icon";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema for form validation
const subjectStudentSchema = z.object({
  subjects: z.record(
    z.object({
      subjectIds: z.array(z.number()).optional(),
    })
  ),
});

type FormData = z.infer<typeof subjectStudentSchema>;

const SubjectStudent = () => {
  useDocumentTitle("Assign Chooseable Subjects to Students of Grade");
  const navigate = useNavigate();
  const { gradeId } = useParams<{ gradeId: string }>();
  const { getSectionStudents, getGrade, assignSubjectToStudent } = useGrade({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [currentGrade, setCurrentGrade] = useState<GradeInterface | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionInterface | null>(
    null
  );

  // Fetch grade and section data
  const fetchGrade = useCallback(async () => {
    try {
      const grade = await getGrade(Number(gradeId));
      setCurrentGrade(grade);

      if (grade?.sections) {
        const firstSection = Object.values(grade.sections)?.[0]?.[0];
        setCurrentSection(firstSection || null);
      }
    } catch (error) {
      console.error("Error fetching grade:", error);
    }
  }, [gradeId, getGrade]);

  // Fetch students for the current section
  const fetchStudents = useCallback(async () => {
    if (currentSection) {
      setIsLoading(true);
      try {
        const students = await getSectionStudents(currentSection.id);
        setStudents(students);
      } catch (error) {
        console.log("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentSection, getSectionStudents]);

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchGrade();
      setIsLoading(false);
    };
    loadInitialData();
  }, [fetchGrade]);

  // Fetch students when the section changes
  useEffect(() => {
    if (currentSection) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [currentSection, fetchStudents]);

  // Sort and filter students
  const sortedStudents = useMemo(() => {
    return [...students].sort(
      (a, b) => (Number(a.roll_no) || 0) - (Number(b.roll_no) || 0)
    );
  }, [students]);

  const filteredStudents = useMemo(() => {
    return sortedStudents.filter((student) =>
      student.full_name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [sortedStudents, debouncedSearchTerm]);

  // Handle section change
  const handleSectionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSectionId = Number(e.target.value);
      const selectedSection = currentGrade?.sections
        ? Object.values(currentGrade.sections)
            .flat()
            .find((section) => section.id === selectedSectionId)
        : null;
      setCurrentSection(selectedSection || null);
    },
    [currentGrade]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // Form handling
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subjectStudentSchema),
    defaultValues: {
      subjects: students.reduce((acc, student) => {
        acc[student.id] = {
          subjectIds:
            student.subjects
              ?.map((subject) => subject.id)
              .filter((id): id is number => id !== undefined) ?? [],
        };
        return acc;
      }, {} as Record<string, { subjectIds: number[] }>),
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formattedData = Object.entries(data.subjects).map(
      ([id, { subjectIds }]) => ({
        studentId: Number(id),
        subjectIds: subjectIds ?? [],
      })
    );
    if (currentSection) {
      await assignSubjectToStudent({
        sectionId: Number(currentSection.id),
        data: formattedData,
      });
    }

    setIsSubmitting(false);
  };

  // Log form errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form Errors:", errors);
    }
  }, [errors]);

  useEffect(() => {
    if (students.length > 0) {
      const defaultValues = students.reduce((acc, student) => {
        acc[student.id] = {
          subjectIds:
            student.subjects
              ?.map((subject) => subject.id)
              .filter((id): id is number => id !== undefined) ?? [],
        };
        return acc;
      }, {} as Record<string, { subjectIds: number[] }>);

      reset({ subjects: defaultValues });
    } else {
      reset({ subjects: {} });
    }
  }, [students, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card mt-5">
        <div className="card-header pt-6">
          <div className="card-title">
            <h2>
              Students of {currentGrade?.name} {currentSection?.name}
            </h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end gap-2"
              data-kt-user-table-toolbar="base"
            >
              <div className="d-flex align-items-center gap-2">
                <label className="required fw-bold fs-6 mb-2">
                  Select Section
                </label>
                <select
                  className="form-control w-200px"
                  value={currentSection?.id || ""}
                  onChange={handleSectionChange}
                >
                  <option value="" hidden>
                    Select Section
                  </option>
                  {currentGrade?.sections &&
                    Object.entries(currentGrade.sections).map(
                      ([sectionGroup, sections], sci) => (
                        <React.Fragment key={`SG-${sci}`}>
                          {sections.map((section, si) => (
                            <option key={`SEC-${sci}-${si}`} value={section.id}>
                              {sectionGroup.split(",")[0].trim()}:{" "}
                              {section.name}
                            </option>
                          ))}
                        </React.Fragment>
                      )
                    )}
                </select>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center position-relative">
                  <Icon
                    name="searchDark"
                    className="svg-icon svg-icon-1 position-absolute ms-6"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control w-250px ps-14"
                    placeholder="Search Students"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isLoading && <Loading />}
          {!isLoading && filteredStudents.length === 0 && (
            <div className="alert alert-info">No Student Records Found</div>
          )}

          {!isLoading && filteredStudents.length > 0 && (
            <div className="row">
              <div className="col-12">
                <table className="table align-middle table-row-dashed fs-6 gy-1 table-hover">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="w-50px text-center">SN</th>
                      <th className="w-500px">Name</th>
                      <th className="">Chooseable Subjects</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 fw-bold">
                    {filteredStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                              {student.photo && (
                                <div className="symbol-label">
                                  <img
                                    src={student.photo}
                                    alt={student.full_name}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="d-flex flex-column">
                              {student.full_name}
                              <span>
                                {student.grade?.name} (
                                {student.section?.faculty.name !== "General"
                                  ? `: ${student.section?.faculty.name}`
                                  : ""}
                                {student.section?.name})
                                {student.roll_no &&
                                  ` | Roll No : ${student.roll_no}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {(currentSection?.subjects?.length ?? 0) <= 0 && (
                            <div className="alert alert-danger">
                              No Subjects Available
                            </div>
                          )}
                          {(currentSection?.subjects?.length ?? 0) > 0 && (
                            <div className="d-flex mt-3">
                              {currentSection?.subjects?.map(
                                (subject) =>
                                  subject.id !== undefined && (
                                    <Controller
                                      key={subject.id}
                                      name={`subjects.${student.id}.subjectIds`}
                                      control={control}
                                      render={({ field }) => {
                                        // Ensure field.value is an array
                                        const fieldValue = Array.isArray(
                                          field.value
                                        )
                                          ? field.value
                                          : [];

                                        return (
                                          <div className="form-check me-3">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`${student.first_name}-${student.id}-${subject.id}`}
                                              checked={fieldValue.includes(
                                                subject.id
                                              )}
                                              onChange={(e) => {
                                                const newValue = e.target
                                                  .checked
                                                  ? [...fieldValue, subject.id]
                                                  : fieldValue.filter(
                                                      (id) => id !== subject.id
                                                    );
                                                field.onChange(newValue);
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`${student.first_name}-${student.id}-${subject.id}`}
                                            >
                                              {subject.name}
                                            </label>
                                          </div>
                                        );
                                      }}
                                    />
                                  )
                              )}
                            </div>
                          )}
                          {errors.subjects?.[student.id]?.subjectIds
                            ?.message && (
                            <div className="text-danger">
                              {
                                errors.subjects?.[student.id]?.subjectIds
                                  ?.message
                              }
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <button
            className="btn btn-primary btn-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SubjectStudent;
