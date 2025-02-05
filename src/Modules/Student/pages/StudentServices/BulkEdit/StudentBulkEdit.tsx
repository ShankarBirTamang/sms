import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StudentInterface } from "../../../services/studentService";
import "./bulkEdit.css";
import DatePicker from "../../../../../components/DatePicker/DatePicker";
import useGrade from "../../../../Academics/hooks/useGrade";
import SessionGradePicker from "../../../../Academics/componenet/SessionGradePicker/SessionGradePicker";

const StudentBulkEdit: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; // scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listeners on component unmount
    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const { getSectionStudents } = useGrade({});
  const [students, setStudents] = useState<StudentInterface[]>([]);

  const handleSessionSelectChange = useCallback(
    async (selectedValues: {
      level: number | null;
      session: number | null;
      grade: number | null;
      section: number | null;
    }) => {
      if (selectedValues.grade && !selectedValues.section) {
        setStudents([]);
      }

      if (selectedValues.section && selectedValues.grade) {
        const newStudents = await getSectionStudents(selectedValues.section);
        setStudents(newStudents);
      }
    },
    [getSectionStudents]
  );
  const guardianSchema = z.object({
    id: z.number(),
    name: z.string(),
    relation: z.string(),
    contact: z.string().nullable(),
    email: z.string().email(),
    address: z.string(),
    occupation: z.string(),
    education: z.string(),
  });
  const studentBulkEditSchema = z.object({
    students: z.record(
      z.object({
        rollNo: z
          .string()
          .min(1, "Roll No is required")
          .max(10, "Roll No must be at most 10 characters")
          .regex(/^\d+$/, "Roll No must contain only numbers"),
        iemis: z.string(),
        full_name: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        middle_name: z.string().nullable(),
        nickname: z.string().nullable(),
        dob_en: z.string(),
        dob_np: z.string(),
        contact: z.string(),
        address: z.string(),
        email: z.string().email(),
        gender: z.string(),
        blood_group: z.string().nullable(),
        nationality: z.string(),
        mother_tongue: z.string(),
        religion: z.string(),
        ethnicity: z.string(),
        is_active: z.number(),
        father: guardianSchema,
        mother: guardianSchema,
      })
    ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(studentBulkEditSchema),
    defaultValues: {
      students: students.reduce((acc, student) => {
        acc[student.id] = {
          rollNo: student.roll_no?.toString() ?? "",
          iemis: student.iemis ?? "",
          full_name: student.full_name ?? "",
          first_name: student.first_name ?? "",
          last_name: student.last_name ?? "",
          middle_name: student.middle_name ?? null,
          nickname: student.nickname ?? null,
          dob_en: student.dob_en ?? "",
          dob_np: student.dob_np ?? "",
          contact: student.contact ?? "",
          address: student.current_address?.full_address ?? "",
          email: student.email ?? "",
          gender: student.gender ?? "",
          blood_group: student.blood_group ?? null,
          nationality: student.nationality ?? "",
          mother_tongue: student.mother_tongue ?? "",
          religion: student.religion ?? "",
          ethnicity: student.ethnicity ?? "",
          is_active: student.is_active ?? 1, // Default to 1 (active) if undefined
          father: student.guardians?.find(
            (guardian) => guardian.relation.toLowerCase() === "father"
          ) ?? {
            id: 0,
            name: "",
            relation: "Father",
            contact: null,
            email: "",
            address: "",
            occupation: "",
            education: "",
          },
          mother: student.guardians?.find(
            (guardian) => guardian.relation.toLowerCase() === "mother"
          ) ?? {
            id: 0,
            name: "",
            relation: "Father",
            contact: null,
            email: "",
            address: "",
            occupation: "",
            education: "",
          },
        };
        return acc;
      }, {} as Record<string, any>),
    },
  });

  type FormData = z.infer<typeof studentBulkEditSchema>;

  return (
    <>
      <div className="card mb-5">
        <div className="card-header">
          <h2 className="card-title">Import Students Data</h2>
        </div>
        <div className="card-body pt-6">
          <div className="row">
            <SessionGradePicker
              onChange={handleSessionSelectChange}
              colSize={3}
            />
          </div>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-header pt-6">
          <div className="card-title w-100 justify-content-between">
            <h2>Student List</h2>
            <div className="d-flex align-items-end gap-5"></div>
          </div>
          <hr />
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-12 text-center">
              <div className="students">
                <div
                  id="#table_student"
                  className="table-container"
                  ref={sliderRef}
                >
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th className="headcol col-roll">Roll</th>
                        <th className="headcol col-first-name first-col">
                          First Name
                        </th>
                        <th className="headcol col-middle-name middle-col">
                          Middle Name
                        </th>
                        <th className="headcol col-last-name last-col">
                          Last Name
                        </th>
                        <th className="col-iemis">IEMIS</th>
                        <th className="col-gender">Gender</th>
                        <th className="col-ethnicity">Ethnicity</th>
                        <th className="col-dob">Date of Birth</th>
                        <th className="col-address">Address</th>
                        <th className="col-contact">Contact</th>
                        <th className="col-blood-group">Blood Group</th>
                        <th className="col-nationality">Nationality</th>
                        <th className="col-mother-tongue">Mother Tongue</th>
                        <th className="col-religion">Religion</th>
                        <th className="col-contact">Contact</th>
                        <th className="col-father-name">Father's Name</th>
                        <th className="col-father-contact">Father's Contact</th>
                        <th className="col-mother-name">Mother's Name</th>
                        <th className="col-mother-contact">Mother's Contact</th>
                        <th className="col-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.id}>
                          <td className="headcol col-roll">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.rollNo`)}
                              defaultValue={student.roll_no}
                            />
                          </td>
                          <td className="headcol col-first-name first-col">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.first_name`)}
                              defaultValue={student.first_name}
                            />
                          </td>
                          <td className="headcol col-middle-name middle-col">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.middle_name`
                              )}
                              defaultValue={student.middle_name ?? ""}
                            />
                          </td>
                          <td className="headcol col-last-name last-col">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.last_name`)}
                              defaultValue={student.last_name}
                            />
                          </td>
                          <td className="col-iemis">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.iemis`)}
                              defaultValue={student.iemis ?? ""}
                            />
                          </td>
                          <td className="col-gender">
                            <select
                              className={`form-control ${
                                errors.students?.[student.id]?.gender
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...register(`students.${student.id}.gender`)}
                              defaultValue={student.gender || ""}
                            >
                              <option value="" hidden>
                                Gender
                              </option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Others">Others</option>
                            </select>
                          </td>
                          <td className="col-ethnicity">
                            <select
                              className="form-control"
                              {...register(`students.${student.id}.ethnicity`)}
                              defaultValue={student.ethnicity || ""}
                            >
                              <option value="" hidden>
                                Ethnicity
                              </option>
                              <option value="Others">Others</option>
                              <option value="Dalit">Dalit</option>
                              <option value="Janajati">Janajati</option>
                            </select>
                          </td>
                          <td className="col-dob">
                            <DatePicker
                              noLabel={true}
                              onDateChange={() => console.log("dd")}
                              valueAD={student.dob_en ?? undefined}
                            />
                            {/* <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.dob_en`)}
                              defaultValue={student.dob_en ?? undefined}
                            /> */}
                          </td>
                          <td className="col-address">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.address`)}
                              defaultValue={student.address ?? undefined}
                            />
                          </td>
                          <td className="col-contact">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.contact`)}
                              defaultValue={student.contact ?? undefined}
                            />
                          </td>
                          <td className="col-blood-group">
                            <select
                              className="form-control"
                              {...register(
                                `students.${student.id}.blood_group`
                              )}
                              defaultValue={student.blood_group || ""}
                            >
                              <option value="" hidden>
                                Blood
                              </option>
                              <option value="A+">A+</option>
                              <option value="B+">B+</option>
                              <option value="O+">O+</option>
                              <option value="AB+">AB+</option>
                              <option value="A-">A-</option>
                              <option value="B-">B-</option>
                              <option value="O-">O-</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </td>
                          <td className="col-nationality">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.nationality`
                              )}
                              defaultValue={student.nationality ?? undefined}
                            />
                          </td>
                          <td className="col-mother-tongue">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.mother_tongue`
                              )}
                              defaultValue={student.mother_tongue ?? undefined}
                            />
                          </td>
                          <td className="col-religion">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.religion`)}
                              defaultValue={student.religion ?? undefined}
                            />
                          </td>
                          <td className="col-contact">
                            <input
                              type="text"
                              className="form-control"
                              {...register(`students.${student.id}.contact`)}
                              defaultValue={student.contact ?? undefined}
                            />
                          </td>
                          <td className="col-father-name">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.father.name`
                              )}
                              defaultValue={
                                student.guardians?.find(
                                  (guardian) =>
                                    guardian.relation.toLowerCase() === "father"
                                )?.name || ""
                              }
                            />
                          </td>
                          <td className="col-father-contact">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.father.contact`
                              )}
                              defaultValue={
                                student.guardians?.find(
                                  (guardian) =>
                                    guardian.relation.toLowerCase() === "father"
                                )?.contact || ""
                              }
                            />
                          </td>
                          <td className="col-mother-name">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.mother.name`
                              )}
                              defaultValue={
                                student.guardians?.find(
                                  (guardian) =>
                                    guardian.relation.toLowerCase() === "mother"
                                )?.name || ""
                              }
                            />
                          </td>
                          <td className="col-mother-contact">
                            <input
                              type="text"
                              className="form-control"
                              {...register(
                                `students.${student.id}.mother.contact`
                              )}
                              defaultValue={
                                student.guardians?.find(
                                  (guardian) =>
                                    guardian.relation.toLowerCase() === "mother"
                                )?.contact || ""
                              }
                            />
                          </td>
                          <td className="col-actions">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentBulkEdit;
