import { GradeInterface } from "../../../services/gradeService";
import { SubjectInterface } from "../../../services/subjectService";
import { z } from "zod";

const SubjectSchema = z.object({
  rank: z.string(), // Ensure rank is a non-empty string
  name: z.string(), // Ensure name is a non-empty string
});

const UpdateRankPropsSchema = z.object({
  subjects: z.array(SubjectSchema).nonempty("At least one subject is required"), // Ensure subjects is a non-empty array
});

interface UpdateRankProps {
  subjects: SubjectInterface[];
  onSave?: () => void;
}

const UpdateRank = ({ subjects }: UpdateRankProps) => {
  console.log(subjects);

  return (
    <form>
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
              {subjects.map((subject, s) => (
                <tr key={s}>
                  <td className="p-0">
                    <input
                      type="text"
                      className="form-control form-control-solid mb-3 mb-lg-0 w-100px marks-field h-35px"
                      value={subject.rank}
                      placeholder="Rank"
                    />
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
