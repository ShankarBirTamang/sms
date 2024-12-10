import { useEffect, useState } from "react";
import { z } from "zod";
import {
  UpdateRankData,
  UpdateRankDataProps,
  UpdateRankProps,
} from "../../../services/subjectService";
import useSubject from "../../../hooks/useSubject";
import Loading from "../../../../components/Loading/Loading";

const updateDataSchema = z.object({
  subjectId: z.number(),
  name: z.string(),
  rank: z.string().min(1, "Rank is required"),
});

const UpdateRank = ({ grade_id, onSave }: UpdateRankProps) => {
  const { subjects, updateSubjectRank, isLoading } = useSubject({ grade_id });
  const [updateData, setUpdateData] = useState<UpdateRankDataProps[]>([]);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const newUpdateData = subjects
      .filter((subject) => subject.id != null)
      .map((subject) => ({
        subjectId: subject.id as number,
        name: subject.name,
        rank: subject.rank ? String(subject.rank) : "",
      }));

    setUpdateData(newUpdateData);
  }, [subjects]);
  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    ); // or return null
  }

  const handleSetUpdateData = ({
    subjectId,
    rank,
  }: {
    subjectId: number;
    rank: string;
  }) => {
    setUpdateData((prevUpdateData) => {
      const existingEntryIndex = prevUpdateData.findIndex(
        (data) => data.subjectId === subjectId
      );

      if (existingEntryIndex !== -1) {
        const existingEntry = prevUpdateData[existingEntryIndex];
        return prevUpdateData.map((data, index) =>
          index === existingEntryIndex ? { ...existingEntry, rank } : data
        );
      } else {
        const subject = subjects.find((sub) => sub.id === subjectId);
        if (subject) {
          return [...prevUpdateData, { subjectId, name: subject.name, rank }];
        }
        return prevUpdateData;
      }
    });
  };

  const saveData = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: number]: string } = {};

    updateData.forEach((data) => {
      const result = updateDataSchema.safeParse(data);
      if (!result.success) {
        validationErrors[data.subjectId] = result.error.errors[0].message;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const updateRankData: UpdateRankData = {
        subjects: updateData,
      };

      await updateSubjectRank(updateRankData);
      onSave();
      setErrors({});
    }
  };

  return (
    <form onSubmit={saveData}>
      <div className="row">
        <div className="col-12">
          <table className="table align-middle table-row-dashed w-100">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {updateData.map((subject) => (
                <tr key={subject.subjectId}>
                  <td className="p-0">
                    <input
                      type="number"
                      className={`form-control mb-3 mb-lg-0 w-100px marks-field h-35px ${
                        errors[subject.subjectId] && "is-invalid"
                      }`}
                      value={subject.rank}
                      placeholder="Rank"
                      onChange={(e) =>
                        handleSetUpdateData({
                          subjectId: subject.subjectId,
                          rank: e.target.value,
                        })
                      }
                    />
                    {}
                  </td>
                  <td>{subject.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <hr />
          <div className="d-flex gap-3">
            <button type="button" className="btn btn-secondary">
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateRank;
