import { useState } from "react";

const Documents = () => {
  const [addDocumentsDrawer, setAddDocumentsDrawer] = useState(false);

  const toggleAddDocumentsDrawer = () => {
    setAddDocumentsDrawer(!addDocumentsDrawer);
  };

  return (
    <>
      <div className="card card-flush mt-xl-0 mb-6 mb-xl-9 ">
        <div className="card-header mt-6 ">
          <div className="card-title flex-column">
            <h2 className="mb-1">All Documents</h2>
            <div className="fs-6 fw-semibold text-muted"></div>
          </div>
          <div className="card-toolbar d-flex gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleAddDocumentsDrawer}
            >
              Add Documents
            </button>
          </div>
        </div>

        <div className="div card-body d-flex flex-column">
          <table className="table align-middle table-row-dashed fs-6">
            <thead>
              <tr>
                <th className="w-200p x">Title</th>
                <th>Descriptions</th>
                <th className="text-end">Images</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};

export default Documents;
