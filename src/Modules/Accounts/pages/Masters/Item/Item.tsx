import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
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

type BillingCycle = "Monthly" | "Quarterly" | "Yearly" | "One-time";

const Item = () => {
  useDocumentTitle("Item");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isMandatory, setIsMandatory] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const billingCycleOptions: BillingCycle[] = [
    "Monthly",
    "Quarterly",
    "Yearly",
    "One-time",
  ];

  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  const [renderKey, setRenderKey] = useState("");

  const [selectedItem, setSelectedItem] = useState<Option | null>(null);

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional().nullable(),
    billing_cycle: z.enum(["Monthly", "Quarterly", "Yearly", "One-time"]),
    is_mandatory: z.boolean().default(false),
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

  const {
    items,
    isLoading,
    pagination,
    edgeLinks,
    saveItem,
    updateItem,
    changeItemStatus,
  } = useItem({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const { allItemGroups } = useItemGroup({});
  const { allAccountGroups } = useAccountGroup({});

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
    const value = event.target.value as BillingCycle;
    setBillingCycle(value);
    setValue("billing_cycle", value);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
    // reset({
    //   name: item.name,
    //   item_group_id: item.item_group?.id,
    //   description: item.description,
    //   billing_cycle: item.billing_cycle,
    // });
    // setValue("item_group_id", item.parent?.id);
    // const isPrimaryGroup = item.parent?.id == null;
    // setValue("isPrimary", isPrimaryGroup);
    // setIsPrimary(isPrimaryGroup);

    // setFormMode("edit");
    // const itemG = itemOptions.find((level) => level.value === item.parent?.id);
    // setSelectedItem(itemG || null);
    // setCurrentItemId(item.id ?? 0);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const resetForm = () => {
    reset({
      name: "",
      item_group_id: undefined,
      account_group_id: undefined,
      billing_cycle: undefined,
      description: "",
      is_mandatory: false,
    });
    setSelectedItem(null);
    setCurrentItemId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const [processingItemId, setProcessingItemId] = useState<number | null>(null);
  const toggleItemStatus = async (itemId: number) => {
    try {
      setProcessingItemId(itemId);
      console.log(itemId);
      await changeItemStatus({ id: itemId });
      toast.success("Academic Item Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating item status:", error);
    } finally {
      setProcessingItemId(null);
    }
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
                    <label className=" fw-bold fs-6 mb-2">Billing Cycle</label>
                    <div className="d-flex gap-3">
                      {billingCycleOptions.map((option) => (
                        <div className="form-check" key={option}>
                          <input
                            type="radio"
                            className="form-check-input sectionCheckbox"
                            id={option}
                            name="billing-cycle"
                            value={option}
                            checked={billingCycle === option}
                            onChange={handleBillingCycleChange}
                          />
                          <label className="form-check-label" htmlFor={option}>
                            {option}
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
                        defaultValue={selectedItem}
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
                        defaultValue={selectedItem}
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
                        <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                          <th className="min-w-225px">Name</th>
                          <th className="text-center">Is Primary</th>
                          <th className="">Under Group</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 fw-bold">
                        {items.map((item, index) => (
                          <tr key={index} className="odd">
                            <td className="">{item.name} </td>
                            <td className="text-center">
                              {item.parent ? "N" : "Y"}
                            </td>
                            <td>{item.parent?.name}</td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                {!item.is_default && (
                                  <button
                                    title="edit academic level"
                                    type="button"
                                    onClick={() => handleEditClick(item)}
                                    className="btn btn-light-info btn-icon btn-sm"
                                  >
                                    <Icon
                                      name={"edit"}
                                      className={"svg-icon"}
                                    />
                                  </button>
                                )}
                                {item.is_default && (
                                  <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-light-danger btn-sm"
                                    disabled
                                  >
                                    Default
                                  </button>
                                )}
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
