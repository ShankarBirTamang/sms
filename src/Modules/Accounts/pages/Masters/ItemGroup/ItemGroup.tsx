import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import useDebounce from "../../../../../hooks/useDebounce";
import useItemGroup from "../../../hooks/useItemGroup";
import {
  ItemGroupInterface,
  CreateItemGroupInterface,
  UpdateItemGroupInterface,
} from "../../../services/itemGroupService";
import CustomSelect, {
  Option,
} from "../../../../../components/CustomSelect/CustomSelect";
import Icon from "../../../../../components/Icon/Icon";
import Loading from "../../../../../components/Loading/Loading";
import Pagination from "../../../../../components/Pagination/Pagination";

const ItemGroup = () => {
  useDocumentTitle("Item Group");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isPrimary, setIsPrimary] = useState(false);

  const [currentItemGroupId, setCurrentItemGroupId] = useState<number | null>(
    null
  );

  const [renderKey, setRenderKey] = useState("");

  const [selectedItemGroup, setSelectedItemGroup] = useState<Option | null>(
    null
  );

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    alias: z.string().optional().nullable(),
    isPrimary: z.boolean().optional(),
    item_group_id: z
      .number()
      .refine(
        (id) => {
          return itemGroups.some((group) => group.id === id);
        },
        {
          message: "Invalid academic level ID",
        }
      )
      .optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    itemGroups,
    allItemGroups,
    isLoading,
    pagination,
    edgeLinks,
    saveItemGroup,
    updateItemGroup,
    changeItemGroupStatus,
  } = useItemGroup({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });

  const itemGroupOptions = allItemGroups.map((group) => ({
    value: group.id ?? 0,
    label: group.parent ? `${group.name} (${group.parent.name})` : group.name,
  }));

  const filteredOptions =
    formMode === "edit"
      ? itemGroupOptions.filter((option) => option.value !== currentItemGroupId)
      : itemGroupOptions;

  const handleItemGroupChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setValue("item_group_id", selectedOption.value);
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

  const handlePrimaryGroupCheck = () => {
    const value = !isPrimary;
    setIsPrimary(value);
    setValue("isPrimary", value);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    console.log("data at line 118 in ItemGroup/ItemGroup.tsx:", data);

    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveItemGroup(data as CreateItemGroupInterface);
      } else if (formMode === "edit") {
        if (currentItemGroupId) {
          await updateItemGroup({
            ...data,
            id: currentItemGroupId,
          } as UpdateItemGroupInterface);
        }
      }
    } catch (error) {
      console.error("Error saving itemGroup:", error);
      setIsSubmitting(false);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (itemGroup: ItemGroupInterface) => {
    reset({
      name: itemGroup.name,
      item_group_id: itemGroup.parent?.id,
      alias: itemGroup.alias,
    });
    setValue("item_group_id", itemGroup.parent?.id);
    const isPrimaryGroup = itemGroup.parent?.id == null;
    setValue("isPrimary", isPrimaryGroup);
    setIsPrimary(isPrimaryGroup);

    setFormMode("edit");
    const itemG = itemGroupOptions.find(
      (level) => level.value === itemGroup.parent?.id
    );
    setSelectedItemGroup(itemG || null);
    setCurrentItemGroupId(itemGroup.id ?? 0);
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const resetForm = () => {
    reset({
      name: "",
      item_group_id: undefined,
      alias: "",
    });
    setSelectedItemGroup(null);
    setCurrentItemGroupId(null);
    setFormMode("create");
    setRenderKey(Math.floor((Math.random() + 1) * 10).toString());
  };

  const [processingItemGroupId, setProcessingItemGroupId] = useState<
    number | null
  >(null);
  const toggleItemGroupStatus = async (itemGroupId: number) => {
    try {
      setProcessingItemGroupId(itemGroupId);
      console.log(itemGroupId);
      await changeItemGroupStatus({ id: itemGroupId });
      toast.success("Academic ItemGroup Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating itemGroup status:", error);
    } finally {
      setProcessingItemGroupId(null);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header mb-6">
              <div className="card-title">
                <h1 className="d-flex align-items-center position-relative">
                  {formMode === "create" ? "Add New " : "Edit "}
                  Item Groups
                </h1>
              </div>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2">
                        Item Group Name
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
                  <div className="col-12">
                    <div className="fv-row mb-7">
                      <label className=" fw-bold fs-6 mb-2">Alias</label>
                      <input
                        type="text"
                        {...register("alias")}
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.alias && "is-invalid"
                        }`}
                        defaultValue={""}
                        placeholder="Ex: Academic Year 2078-79"
                      />
                      {errors.alias && (
                        <span className="text-danger">
                          {errors.alias.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12 mb-7">
                    <div className="form-check">
                      <input
                        title="Primary Group"
                        className="form-check-input sectionCheckbox"
                        type="checkbox"
                        id="is_active_true"
                        value="true"
                        onChange={handlePrimaryGroupCheck}
                        checked={isPrimary === true}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is_active_true"
                      >
                        Primary Item Group
                      </label>
                    </div>
                  </div>
                  {!isPrimary && (
                    <div className="col-12">
                      <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">
                          Parent Item Group
                        </label>
                        <CustomSelect
                          key={renderKey}
                          options={filteredOptions}
                          onChange={handleItemGroupChange}
                          error={errors.item_group_id?.message}
                          defaultValue={selectedItemGroup}
                          placeholder="Select Parent Item Group"
                        />
                      </div>
                    </div>
                  )}
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
                  <span> Item Groups</span>
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
                        placeholder="Search ItemGroup"
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
                  {!isLoading && itemGroups.length === 0 && (
                    <div className="alert alert-info">No Item Groups Found</div>
                  )}
                  {!isLoading && (
                    <table
                      className="table align-middle table-row-dashed fs-6 gy-1 dataTable no-footer"
                      id="table_itemGroups"
                      aria-describedby="table_itemGroups_info"
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
                        {itemGroups.map((itemGroup, index) => (
                          <tr key={index} className="odd">
                            <td className="">{itemGroup.name} </td>
                            <td className="text-center">
                              {itemGroup.parent ? "N" : "Y"}
                            </td>
                            <td>{itemGroup.parent?.name}</td>

                            <td className="text-end">
                              <div className="d-flex flex-end gap-2">
                                {!itemGroup.is_default && (
                                  <button
                                    title="edit academic level"
                                    type="button"
                                    onClick={() => handleEditClick(itemGroup)}
                                    className="btn btn-light-info btn-icon btn-sm"
                                  >
                                    <Icon
                                      name={"edit"}
                                      className={"svg-icon"}
                                    />
                                  </button>
                                )}
                                {itemGroup.is_default && (
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

export default ItemGroup;
