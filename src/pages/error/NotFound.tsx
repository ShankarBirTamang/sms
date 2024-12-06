import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.message}>Page Not Found</h2>
      <p>
        Sorry, the page you are looking for does not exist. You can always go
        back to the{" "}
        <Link to="/" style={styles.link}>
          homepage
        </Link>
        .
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    color: "#333",
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: 0,
  },
  message: {
    fontSize: "2rem",
    margin: "20px 0",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default NotFound;
