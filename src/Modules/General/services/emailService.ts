import apiRoute from "../../../services/httpService";

export interface EmailInterface {
  id: number;
  name: string;
  protocol: "SMTP" | "IMAP" | "POP3";
  encryption: "tls" | "ssl" | "none";
  host: string;
  port: string;
  username: string;
  password: string;
  email: string;
  default: boolean;
}

export interface CreateEmailInterface {
  name: string;
  protocol: "SMTP" | "IMAP" | "POP3";
  encryption: "tls" | "ssl" | "none";
  host: string;
  port: string;
  username: string;
  password: string;
  email: string;
}

export interface UpdateEmailInterface {
  id: number;
  name: string;
  protocol: "SMTP" | "IMAP" | "POP3";
  encryption: "tls" | "ssl" | "none";
  host: string;
  port: string;
  username: string;
  password: string;
  email: string;
}

export interface ChangeEmailStatusInterface {
  id: number;
}

export default apiRoute("/general/settings/emails");
