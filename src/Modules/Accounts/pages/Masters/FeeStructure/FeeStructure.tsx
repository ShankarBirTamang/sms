import React, { useState } from "react";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import toast from "react-hot-toast";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import useFeeStructure from "../../../hooks/useFeeStructure";
import Pagination from "../../../../../components/Pagination/Pagination";
import useItem from "../../../hooks/useItem";
import { StructureInterface } from "../../../services/feeStructureService";
import AddFeeStructure from "./AddFeeStructure";
import DrawerModal from "../../../../../components/DrawerModal/DrawerModal";

import { formatMoneyToNepali } from "../../../../../helpers/formatMoney";
import useGrade from "../../../../Academics/hooks/useGrade";

const FeeStructure = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [addFeeStructureDrawer, setAddFeeStructureDrawer] = useState(true);
  const [editFeeStructureDrawer, setEditFeeStructureDrawer] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState<StructureInterface>();

  const { feeStructures, fetchFeeStructures, pagination, edgeLinks } =
    useFeeStructure({
      search: debouncedSearchTerm,
      currentPage,
      itemsPerPage,
    });

  const { grades, isLoading } = useGrade({});

  const { allItems } = useItem({});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const structures: StructureInterface[] = grades.map((grade) => {
    const feeStructure = feeStructures.find((fs) => fs.grade?.id === grade.id);

    return {
      grade,
      structureDetails:
        feeStructure?.fee_structure_details.map((detail) => ({
          item: detail.item,
          amount: detail.amount || 0, // Ensure amount is explicitly 0 if it is falsy
        })) || [],
    };
  });

  const toggleAddFeeStructureDrawer = () => {
    setAddFeeStructureDrawer(!addFeeStructureDrawer);

    if (addFeeStructureDrawer) {
      fetchFeeStructures();
    }
  };

  const toggleEditFeeStructureDrawer = () => {
    setEditFeeStructureDrawer(!editFeeStructureDrawer);
    if (editFeeStructureDrawer) {
      fetchFeeStructures();
    }
  };

  //   console.log(structures);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h2>All Grades Fee Structure</h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  title="Add Grade"
                  //   onClick={toggleAddGradeDrawer}
                >
                  <Icon name="add" className="svg-icon" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isLoading && <Loading />}
          {!isLoading && structures.length === 0 && (
            <div className="alert alert-info">No Grades Found</div>
          )}

          {!isLoading && structures.length > 0 && (
            <table className="table align-middle table-row-dashed fs-6 gy-1">
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="w-50px">SN</th>
                  <th className="w-155px">Grade Name</th>
                  <th className="w-200px">Sections</th>
                  <th className="min-w-125px text-center">Fee Structure</th>

                  <th className="text-end min-w-100px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-bold">
                {structures.map((struct, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="">
                      {struct.grade.name} ({struct.grade.short_name})
                    </td>
                    <td>
                      <div className="w-200px">
                        {Object.entries(struct.grade.sections).map(
                          ([sectionGroup, sections], sci) => (
                            <div key={`SEC-${sci}`} className="mb-1">
                              <strong>
                                {sectionGroup.split(",")[0].trim()}:
                              </strong>
                              <div className="d-flex flex-wrap gap-3">
                                {sections.map((section, si) => (
                                  <span
                                    key={`${sectionGroup}-${si}`}
                                    className="badge badge-primary badge-lg p-2 px-4 mb-1"
                                  >
                                    {section.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-3 flex-wrap">
                        {struct.structureDetails.length > 0 &&
                          struct.structureDetails.map((item, ind) => (
                            <span
                              key={ind}
                              className="badge badge-md badge-info"
                            >
                              {item.item.name}({struct.grade.short_name}):
                              {formatMoneyToNepali(item.amount)} /-
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="text-end">
                      <button
                        className="btn btn-light-danger btn-sm"
                        type="button"
                        onClick={() => {
                          toggleAddFeeStructureDrawer();
                          setSelectedGrade(struct);
                        }}
                      >
                        {struct.structureDetails.length > 0 ? "Update" : "Add"}{" "}
                        for {struct.grade.short_name}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="card-footer">
          <Pagination
            pagination={pagination}
            edgeLinks={edgeLinks}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {selectedGrade && (
        <DrawerModal
          isOpen={addFeeStructureDrawer}
          onClose={toggleAddFeeStructureDrawer}
          position="right"
          width="600px"
          title={`Set Fee Structure for ${selectedGrade.grade.name}`}
        >
          <AddFeeStructure
            onAdd={toggleAddFeeStructureDrawer}
            items={allItems}
            feeStructure={selectedGrade}
          />
        </DrawerModal>
      )}
    </>
  );
};

export default FeeStructure;
