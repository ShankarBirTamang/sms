import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import useItem from "../../../hooks/useItem";
import {
  ItemInterface,
  CreateItemInterface,
  UpdateItemInterface,
} from "../../../services/itemService";
import CustomSelect, {
  Option,
} from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";
import useItemGroup from "../../../hooks/useItemGroup";
import useAccountGroup from "../../../hooks/useAccountGroup";
import usePaymentGroup from "../../../hooks/usePaymentGroup";

const Item = () => {
  useDocumentTitle("Item");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isMandatory, setIsMandatory] = useState(true);
  const [selectedItemGroup, setSelectedItemGroup] = useState<Option>();
  const [selectedAccountGroup, setSelectedAccountGroup] = useState<Option>();

  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  const [renderKey, setRenderKey] = useState("");

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional().nullable(),
    payment_group_id: z.number(),
    is_mandatory: z.boolean().default(true),
    item_group_id: z.number().refine(
      (id) => {
        return itemGroupOptions.some((group) => group.value === id);
      },
      {
        message: "Invalid Item",
      }
    ),

    account_group_id: z.number().refine(
      (id) => {
        return accountGroupOptions.some((group) => group.value === id);
      },
      {
        message: "Invalid Account Group",
      }
    ),
  });

  type FormData = z.infer<typeof schema>;

  const { items, isLoading, pagination, edgeLinks, saveItem, updateItem } =
    useItem({
      search: debouncedSearchTerm,
      currentPage,
      itemsPerPage,
    });

  const { allItemGroups } = useItemGroup({});
  const { allAccountGroups } = useAccountGroup({});
  const { paymentGroups } = usePaymentGroup({});

  const itemGroupOptions = allItemGroups.map((group) => ({
    value: group.id ?? 0,
    label: group.parent ? `${group.name} (${group.parent.name})` : group.name,
  }));

  const accountGroupOptions = allAccountGroups.map((group) => ({
    value: group.id ?? 0,
    label: group.parent ? `${group.name} (${group.parent.name})` : group.name,
  }));

  const handleItemGroupChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("item_group_id", selectedOption.value);
    }
  };

  const handleAccountGroupChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("account_group_id", selectedOption.value);
    }
  };

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

  const handleIsMandatoryCheck = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "true";
    setIsMandatory(value);
    setValue("is_mandatory", value);
  };

  const handleBillingCycleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setValue("payment_group_id", Number(value));
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const paymentGroupId = watch("payment_group_id");

  const onSubmit = async (data: FormData) => {
    console.log("data at line 118 in Item/Item.tsx:", data);

    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveItem(data as CreateItemInterface);
      } else if (formMode === "edit") {
        if (currentItemId) {
          await updateItem({
            ...data,
            id: currentItemId,
          } as UpdateItemInterface);
        }
      }
    } catch (error) {
      console.error("Error saving item:", error);
      setIsSubmitting(false);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: ItemInterface) => {
    console.log("item at line 147 in Item/Item.tsx:", item);
    reset({
      name: item.name,
      description: item.description,
      item_group_id: item.item_group?.id,
      account_group_id: item.account_group?.id,
      is_mandatory: item.is_mandatory,
      payment_group_id: item.payment_group?.id,
    });
    setValue("item_group_id", item.item_group?.id ?? 0);
    setValue("account_group_id", item.account_group?.id ?? 0);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
    setValue("is_mandatory", item.is_mandatory);
    setValue("payment_group_id", item.payment_group?.id ?? 0);

    setIsMandatory(item.is_mandatory);

    setFormMode("edit");
    const selectedItemGroup = item.item_group
      ? { value: item.item_group.id ?? 0, label: item.item_group.name }
      : { value: 0, label: "" };

    setSelectedItemGroup(selectedItemGroup);
    const selectedAccountGroup = item.account_group
      ? { value: item.account_group.id ?? 0, label: item.account_group.name }
      : { value: 0, label: "" };
    setSelectedAccountGroup(selectedAccountGroup);
    setCurrentItemId(item.id ?? 0);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const resetForm = () => {
    reset({
      name: "",
      item_group_id: undefined,
      account_group_id: undefined,
      payment_group_id: undefined,
      description: "",
      is_mandatory: false,
    });
    setSelectedItemGroup(undefined);
    setSelectedAccountGroup(undefined);
    setCurrentItemId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative">
                  {formMode === "create" ? "Add New " : "Edit "}
                  Fee/Collectable
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Fee / Collectable Title
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.name && "is-invalid"
                        }`}
                        placeholder="Ex: "
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12 mb-7">
                    <label className=" fw-bold fs-6 mb-3">Billing Cycle</label>
                    <div className="d-flex flex-wrap gap-3">
                      {paymentGroups.length <= 0 && <Loading height={20} />}
                      {paymentGroups.map((option) => (
                        <div className="form-check" key={option.id}>
                          <input
                            type="radio"
                            className="form-check-input sectionCheckbox"
                            id={`Type-${option.id}`}
                            name="billing-cycle"
                            value={option.id}
                            onChange={handleBillingCycleChange}
                            checked={paymentGroupId === option.id}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`Type-${option.id}`}
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 mb-7">
                    <label className=" fw-bold fs-6 mb-2">
                      Is Fee/Collectable Mandatory
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          title="Primary Group"
                          className="form-check-input sectionCheckbox"
                          type="radio"
                          id="is_mandatory_true"
                          value="true"
                          onChange={handleIsMandatoryCheck}
                          checked={isMandatory === true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_mandatory_true"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          title="Primary Group"
                          className="form-check-input sectionCheckbox"
                          type="radio"
                          id="is_mandatory_false"
                          value="false"
                          onChange={handleIsMandatoryCheck}
                          checked={isMandatory === false}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_mandatory_false"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Associated Fee/Collectable Group
                      </label>
                      <CustomSelect
                        key={renderKey}
                        options={itemGroupOptions}
                        onChange={handleItemGroupChange}
                        error={errors.item_group_id?.message}
                        defaultValue={selectedItemGroup}
                        placeholder="Select Item"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Associated Account Group
                      </label>
                      <CustomSelect
                        key={renderKey}
                        options={accountGroupOptions}
                        onChange={handleAccountGroupChange}
                        error={errors.account_group_id?.message}
                        defaultValue={selectedAccountGroup}
                        placeholder="Select Account Group"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className=" fw-bold fs-6 mb-2">Description</label>
                      <textarea
                        {...register("description")}
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.description && "is-invalid"
                        }`}
                        defaultValue={""}
                      ></textarea>

                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12 pt-15 text-center">
                    <button
                      title="reset"
                      type="reset"
                      className="btn btn-light me-3"
                      onClick={resetForm}
                    >
                      Reset
                    </button>
                    <button
                      title="submit"
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : formMode === "create"
                        ? "Submit"
                        : "Update"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span> All Fees/Collectables</span>
                  <div className="d-flex gap-2">
                    <div className="d-flex align-items-center position-relative h-100">
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
                        placeholder="Search Item"
                      />
                    </div>

                    <select
                      className="form-control w-50px"
                      title="Items per Page"
                      id="itemsPerPage"
                      value={itemsPerPage ?? "all"}
                      onChange={(e) =>
                        handleItemsPerPageChange(
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="all">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </h1>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="">
                <div className="">
                  {isLoading && <Loading />}
                  {!isLoading && items.length === 0 && (
                    <div className="alert alert-info">No Items Found</div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_items"
                      aria-describedby="table_items_info"
                    >
                      <thead>
                        <tr className="text-center text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="min-w-225px">Name</th>
                          <th className="">Item Group</th>
                          <th className="">Account Group</th>
                          <th className="text-center">Billing Cycle</th>
                          <th className="text-center">Is Mandatory</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold text-center">
                        {items.map((item, index) => (
                          <tr key={index} className="odd">
                            <td className="text-start">{item.name} </td>
                            <td className="text-start">
                              {item.item_group?.name}
                            </td>
                            <td className="text-start">
                              {item.account_group?.name}
                            </td>
                            <td className="">{item.payment_group?.name}</td>
                            <td className="text-center">
                              <span
                                className={`badge badge-${
                                  item.is_mandatory ? "success" : "danger"
                                }`}
                              >
                                {item.is_mandatory ? "Yes" : "No"}
                              </span>
                            </td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                <button
                                  title="edit academic level"
                                  type="button"
                                  onClick={() => handleEditClick(item)}
                                  className="btn btn-light-info btn-icon btn-sm"
                                >
                                  <Icon name={"edit"} className={"svg-icon"} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer">
              {pagination && (
                <Pagination
                  pagination={pagination}
                  edgeLinks={edgeLinks}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
