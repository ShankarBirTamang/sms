import React, { useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import useEmail from "../../hooks/useEmail";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import Loading from "../../../../components/Loading/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  CreateEmailInterface,
  EmailInterface,
  UpdateEmailInterface,
} from "../../services/emailService";
import Icon from "../../../../components/Icon/Icon";
import ProcessingButton from "../../../../components/ProcessingButton/ProcessingButton";
import toast from "react-hot-toast";
import Pagination from "../../../../components/Pagination/Pagination";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  protocol: z.enum(["SMTP", "IMAP", "POP3"], {
    errorMap: () => ({
      message: "Protocol must be either SMTP, IMAP, or POP3.",
    }),
  }),
  encryption: z
    .enum(["tls", "ssl", "none"], {
      errorMap: () => ({
        message: "Encryption must be either TLS, SSL, or none.",
      }),
    })
    .default("none"),
  host: z.string().min(1, { message: "Host is required." }),
  port: z
    .string()
    .min(1, { message: "Port is required." })
    .regex(/^\d+$/, "Port must contain only numbers"),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  email: z.string().min(1, { message: "Email is required." }),
});

type FormData = z.infer<typeof schema>;

const Email = () => {
  useDocumentTitle("Emails");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [selectedEmail, setSelectedEmail] = useState<EmailInterface>();
  const [processingEmailId, setProcessingEmailId] = useState<number | null>(
    null
  );

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

  const toggleEmailStatus = async (emailId: number) => {
    try {
      setProcessingEmailId(emailId);
      console.log(emailId);
      await changeEmailStatus({ id: emailId });
      toast.success("Academic Email Status Changed Successfully.");
    } catch (error) {
      console.error("Error updating session status:", error);
    } finally {
      setProcessingEmailId(null);
    }
  };

  const {
    emails,
    isLoading,
    pagination,
    edgeLinks,
    saveEmail,
    updateEmail,
    changeEmailStatus,
  } = useEmail({
    search: debouncedSearchTerm,
    currentPage,
    itemsPerPage,
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const resetForm = () => {
    reset({
      name: "",
      protocol: undefined,
      encryption: "none",
      host: "",
      port: "",
      username: "",
      password: "",
      email: "",
    });
    setFormMode("create");
  };

  const handleEditClick = (email: EmailInterface) => {
    reset({
      name: email.name,
      protocol: email.protocol,
      encryption: email.encryption,
      host: email.host,
      port: email.port,
      username: email.username,
      password: email.password,
      email: email.email,
    });
    setFormMode("edit");
    setSelectedEmail(email || null);
  };

  const onSubmit = async (
    data: CreateEmailInterface | UpdateEmailInterface
  ) => {
    try {
      setIsSubmitting(true);
      if (formMode === "create") {
        await saveEmail(data);
        toast.success("Email Added Successfully.");
      } else if (formMode === "edit") {
        if (selectedEmail) {
          await updateEmail({ ...data, id: selectedEmail.id });
          toast.success("Email Updated Successfully.");
        }
      }
    } catch (error) {
      console.error("Error saving session:", error);
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <div className="card-header mb-6">
                <div className="card-title">
                  <h1 className="d-flex align-items-center position-relative">
                    {formMode === "create" ? "Add New " : "Edit "}
                    Email Config
                  </h1>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Protocol <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.protocol && "is-invalid"
                        }`}
                        {...register("protocol")}
                        defaultValue={""}
                      >
                        <option value={""} hidden>
                          Select Protocol
                        </option>
                        <option value="SMTP">SMTP</option>
                        <option value="IMAP">IMAP</option>
                        <option value="POP3">POP3</option>
                      </select>
                      {errors.protocol && (
                        <span className="text-danger">
                          {errors.protocol.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Encryption <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.encryption && "is-invalid"
                        }`}
                        {...register("encryption")}
                        defaultValue={"none"}
                      >
                        <option value="" hidden>
                          Select Enc.
                        </option>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                      {errors.encryption && (
                        <span className="text-danger">
                          {errors.encryption.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="mb-3">
                      <label className="form-label">
                        Host <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.host && "is-invalid"
                        }`}
                        {...register("host")}
                      />
                      {errors.host && (
                        <span className="text-danger">
                          {errors.host.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Port <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.port && "is-invalid"
                        }`}
                        {...register("port")}
                      />
                      {errors.port && (
                        <span className="text-danger">
                          {errors.port.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        From Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.name && "is-invalid"
                        }`}
                        {...register("name")}
                      />
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        From Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.email && "is-invalid"
                        }`}
                        {...register("email")}
                      />
                      {errors.email && (
                        <span className="text-danger">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.username && "is-invalid"
                        }`}
                        {...register("username")}
                      />
                      {errors.username && (
                        <span className="text-danger">
                          {errors.username.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control mb-3 mb-lg-0 ${
                          errors.password && "is-invalid"
                        }`}
                        {...register("password")}
                      />
                      {errors.password && (
                        <span className="text-danger">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex gap-2">
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
            </div>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header mb-6">
              <div className="card-title w-100">
                <h1 className="d-flex justify-content-between align-items-center position-relative my-1 w-100">
                  <span>All Email Configs</span>
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
                        placeholder="Search Email Config"
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
            <div className="card-body">
              {isLoading && <Loading />}
              {!isLoading && emails.length <= 0 && (
                <div className="alert alert-info">No Email Configs Found</div>
              )}
              {!isLoading && emails.length > 0 && (
                <table className="table align-middle table-row-dashed fs-6 gy-1">
                  <thead>
                    <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                      <th className="w-30px">S.N.</th>
                      <th>Mailing Name / Email</th>
                      <th>Host Info:</th>
                      <th>Default</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email, index) => (
                      <tr key={index}>
                        <td>
                          {(currentPage - 1) * (itemsPerPage ?? 1) + index + 1}
                        </td>
                        <td>
                          Name: <strong>{email.name}</strong> <br />
                          Email: <strong>{email.email}</strong>
                        </td>
                        <td>
                          Username: <strong>{email.username}</strong> <br />
                          Host: <strong>{email.host}</strong> Port:
                          <strong>{email.port}</strong> <br />
                          Protocol: <strong>{email.protocol}</strong>
                        </td>
                        <td>
                          <ProcessingButton
                            isProcessing={processingEmailId === email.id}
                            isActive={email.default ?? false}
                            onClick={() => toggleEmailStatus(email.id)}
                            hoverText={
                              email.default ? "Default" : "Set Default"
                            }
                            activeText="Default"
                            inactiveText="Set Default"
                          />
                        </td>
                        <td className="text-end">
                          <button
                            title="edit academic level"
                            type="button"
                            onClick={() => handleEditClick(email)}
                            className="btn btn-light-info btn-icon btn-sm"
                          >
                            <Icon name={"edit"} className={"svg-icon"} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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

export default Email;
