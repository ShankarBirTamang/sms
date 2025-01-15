import React from "react";
import Icon from "../../../../components/Icon/Icon";
import { formatMoneyToNepali } from "../../../../helpers/formatMoney";
import DatePicker from "../../../../components/DatePicker/DatePicker";

const Voucher = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h2>Add Voucher</h2>
              </div>
              <div className="card-toolbar">
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <div className="d-flex align-items-center gap-2">
                    <DatePicker
                      noLabel={true}
                      onDateChange={() => console.log("change")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body pt-3">
              <table className="table align-middle table-row-dashed fs-6 gy-1">
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th className="text-center w-30px">SN</th>
                    <th className="w-60px text-center">D/C</th>
                    <th className="min-w-125px">Account Name</th>
                    <th className="w-150px text-end">Debit (Dr.)</th>
                    <th className="w-150px text-end">Credit (Cr.)</th>
                    <th className="text-end min-w-100px">Short Narration</th>
                    <th className="text-end w-15px">Act.</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-bold">
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">
                      <select
                        className={`form-control form-select text-center no-dropdown`}
                      >
                        <option value="D">Dr</option>
                        <option value="C">Cr</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control text-end no-arrows"
                        step={0.01}
                        placeholder=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step={0.01}
                        className="form-control text-end no-arrows"
                        placeholder=""
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                      />
                    </td>
                    <td className="text-end">
                      <button
                        title="show"
                        type="button"
                        className="btn btn-light-primary btn-sm btn-icon"
                      >
                        <Icon name="eye" className="svg-icon" />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot className="fw-bolder bg-secondary">
                  <tr>
                    <td colSpan={4} className="text-end">
                      Total
                    </td>
                    <td className="text-end pe-5">
                      {formatMoneyToNepali(10000)}
                    </td>
                    <td className="text-end pe-5">
                      {formatMoneyToNepali(10000)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h2>Statement of Account for Fiscal Year 2081/82</h2>
              </div>
            </div>
            <div className="card-body pt-3">
              <table className="table align-middle table-row-dashed table-striped fs-6 gy-1">
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th className="text-center w-30px">SN</th>
                    <th className="text-center w-110px">Date</th>
                    <th className="min-w-125px">Account Name</th>
                    <th className="w-100px text-end">Debit (Dr.)</th>
                    <th className="w-100px text-end">Credit (Cr.)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-bold">
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">2081-02-01</td>
                    <td>Fee for Month of Baisakh</td>
                    <td className="text-end">{formatMoneyToNepali(10000)}</td>
                    <td className="text-end">-</td>
                  </tr>
                  <tr>
                    <td className="text-center">2</td>
                    <td className="text-center">2081-02-25</td>
                    <td>Payment</td>
                    <td className="text-end">-</td>
                    <td className="text-end">{formatMoneyToNepali(10000)}</td>
                  </tr>
                </tbody>
                <tfoot className="fw-bolder bg-secondary">
                  <tr>
                    <td colSpan={3} className="text-end">
                      Total
                    </td>
                    <td className="text-end">{formatMoneyToNepali(10000)}</td>
                    <td className="text-end">{formatMoneyToNepali(10000)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Voucher;
