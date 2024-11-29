import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_URL;
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axiosInstance.get("/validate-token");
        if (response.status === 200) {
          setIsAuthenticated(true);
          navigate("/");
        }
      } catch (error) {
        console.error("Token validation failed", error);
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, [navigate]);
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading indicator while validating
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email: email,
        password: password,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        window.location.href = "/";
      }
    } catch (err) {
      setError("Invalid email or Password");
      console.log("Login Error : ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="d-flex flex-column flex-column-fluid flex-lg-row">
          <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
            <div className="d-flex flex-center flex-lg-start flex-column">
              <a href="../../demo9/dist/index.html" className="mb-7">
                <img alt="Logo" src="assets/media/logos/custom-3.svg" />
              </a>
              <h2 className="text-white fw-normal m-0">
                Branding tools designed for your business
              </h2>
            </div>
          </div>

          <div className="d-flex flex-center w-lg-50 p-10">
            <div className="card rounded-3 w-md-550px">
              <div className="card-body p-10 p-lg-20">
                <form className="form w-100" onSubmit={handleSubmit}>
                  <div className="text-center mb-11">
                    <h1 className="text-dark fw-bolder mb-3">Sign In</h1>
                    <div className="text-gray-500 fw-semibold fs-6">
                      Your Social Campaigns
                    </div>
                  </div>

                  <div className="row g-3 mb-9">
                    <div className="col-md-6">
                      <a
                        href="#"
                        className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
                      >
                        <img
                          alt="Logo"
                          src="assets/media/svg/brand-logos/google-icon.svg"
                          className="h-15px me-3"
                        />
                        Sign in with Google
                      </a>
                    </div>

                    <div className="col-md-6">
                      <a
                        href="#"
                        className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
                      >
                        <img
                          alt="Logo"
                          src="assets/media/svg/brand-logos/apple-black.svg"
                          className="theme-light-show h-15px me-3"
                        />
                        <img
                          alt="Logo"
                          src="assets/media/svg/brand-logos/apple-black-dark.svg"
                          className="theme-dark-show h-15px me-3"
                        />
                        Sign in with Apple
                      </a>
                    </div>
                  </div>

                  <div className="separator separator-content my-14">
                    <span className="w-125px text-gray-500 fw-semibold fs-7">
                      Or with email
                    </span>
                  </div>

                  {/* Email Input */}
                  <div className="fv-row mb-8">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control bg-transparent"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="fv-row mb-3">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control bg-transparent"
                    />
                  </div>

                  {/* Error message */}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                    <div></div>
                    <a
                      href="../../demo9/dist/authentication/layouts/creative/reset-password.html"
                      className="link-primary"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="d-grid mb-10">
                    <button
                      type="submit"
                      id="kt_sign_in_submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      <span className="indicator-label">
                        {loading ? "Please wait..." : "Sign In"}
                      </span>
                      {loading && (
                        <span className="indicator-progress">
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="text-gray-500 text-center fw-semibold fs-6">
                    Not a Member yet?
                    <a href="#" className="link-primary">
                      Sign up
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
