import { useEffect, useState } from "react";

import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import { useAccount } from "../../../hooks/useAccount";
import Pagination from "../../../../../components/Pagination/Pagination";
import Loading from "../../../../../components/Loading/Loading";
import Icon from "../../../../../components/Icon/Icon";
import { formatMoneyToNepali } from "../../../../../helpers/formatMoney";

const Account = () => {
  useDocumentTitle("All Accounts");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { accounts, pagination, edgeLinks, isLoading } = useAccount({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | null) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };
  return (
    <>
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h2>All Accounts</h2>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center position-relative">
                  <Icon
                    name="searchDark"
                    className="svg-icon svg-icon-1 position-absolute ms-6"
                  />

                  <input
                    type="text"
                    id="data_search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control w-250px ps-14"
                    placeholder="Search Accounts"
                  />
                </div>

                <select
                  className="form-control w-50px "
                  title="Items per Page"
                  id="itemsPerPage"
                  value={itemsPerPage ?? "all"}
                  onChange={(e) =>
                    handleItemsPerPageChange(
                      e.target.value === "all" ? null : parseInt(e.target.value)
                    )
                  }
                >
                  <option value="all">All</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  title="Add Account"
                  // onClick={toggleAddAccountDrawer}
                >
                  <Icon name="add" className="svg-icon" />
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {isLoading && <Loading />}
          {!isLoading && accounts.length === 0 && (
            <div className="alert alert-info">No Accounts Found</div>
          )}

          {!isLoading && accounts.length > 0 && (
            <table className="table align-middle table-row-dashed fs-6 gy-1">
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  <th className="">SN</th>
                  <th className="min-w-125px">Account Name</th>
                  <th className="max-w-200px">Parent Acc. Group</th>
                  <th className="min-w-125px text-end">Op. Bal. (DR)</th>
                  <th className="min-w-125px text-end">Op. Bal. (CR)</th>

                  <th className="text-end min-w-100px">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 fw-bold">
                {accounts.map((account, index) => (
                  <tr key={index}>
                    <td>
                      {(currentPage - 1) * (itemsPerPage ?? 1) + index + 1}
                    </td>
                    <td className="">
                      {account.name} <br />
                      {account.accountable?.base && (
                        <span className="badge badge-light-info badge-sm">
                          {account.accountable?.base}
                        </span>
                      )}
                    </td>
                    <td>
                      {account.account_group?.name}
                      {account.account_group?.parent &&
                        ` (${account.account_group?.parent.name})`}
                    </td>
                    <td className="text-end">
                      {account.opening_balance_type === "D"
                        ? formatMoneyToNepali(account.opening_balance)
                        : formatMoneyToNepali(0)}
                    </td>
                    <td className="text-end">
                      {account.opening_balance_type === "C"
                        ? formatMoneyToNepali(account.opening_balance)
                        : formatMoneyToNepali(0)}
                    </td>

                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-light-success btn-sm"
                        title="Edit"
                        // onClick={() => handleEditClick(account)}
                      >
                        Edit
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
    </>
  );
};

export default Account;
