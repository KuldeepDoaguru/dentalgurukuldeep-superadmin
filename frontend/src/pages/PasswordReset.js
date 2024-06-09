import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";
import { MdDangerous } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const goBack = () => {
    window.history.go(-1);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/sendOtp",
        {
          email,
        }
      );
      setLoading(false);
      console.log(response);
      setShowOtp(false);
      setShowVerify(true);
      setShowReset(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        cogoToast.error(error.response.data.message || "Something went wrong");
      } else {
        setLoading(false);
        // If there's no response data, show a generic error message
        cogoToast.error("Something went wrong");
      }
    }
  };

  const verifyOtpAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/verifyOtp",
        {
          email,
          otp,
        }
      );
      setLoading(false);
      console.log(response);
      setShowOtp(false);
      setShowVerify(false);
      setShowReset(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
      cogoToast.error("Wrong OTP!");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        "https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/resetPassword",
        {
          email,
          password: newPassword,
        }
      );

      setLoading(false);
      console.log(response);
      cogoToast.success("password update successfully");
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <div className="text-black cardstyle shadow">
          <div className="card-body p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 col-12 order-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <button className="btn btn-success" onClick={goBack}>
                      <IoMdArrowRoundBack /> Back
                    </button>
                  </div>
                </div>
                <p className="text-center h4 fw-bold mb-5 mx-1 mt-4">
                  Password Reset
                </p>
                {showOtp && (
                  <form className="mx-1 sendOtp" onSubmit={sendOtp}>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="email"
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? "Send OTP..." : "Send OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {/* **************************************** */}
                {showVerify && (
                  <form className="mx-1 verify-otp" onSubmit={verifyOtpAdmin}>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="email"
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      {" "}
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          OTP
                        </label>
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="form-control"
                          placeholder="otp"
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? "Verify OTP...." : "Verify OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {/* ************************************************ */}
                {showReset && (
                  <form className="mx-1 reset" onSubmit={changePassword}>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          New Password
                        </label>
                        <div className="input-container">
                          <input
                            type={`${showPass ? "text" : "password"}`}
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            placeholder="password"
                          />
                          <div className="eye-icon">
                            {showPass ? (
                              <IoEye onClick={() => setShowPass(false)} />
                            ) : (
                              <IoEyeOffOutline
                                onClick={() => setShowPass(true)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label" for="form3Example3c">
                          Confirm Password
                        </label>
                        <div className="input-container">
                          <input
                            type={`${showPassConfirm ? "text" : "password"}`}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                            placeholder="confirm password"
                          />
                          <div className="eye-icon">
                            {showPassConfirm ? (
                              <IoEye
                                onClick={() => setShowPassConfirm(false)}
                              />
                            ) : (
                              <IoEyeOffOutline
                                onClick={() => setShowPassConfirm(true)}
                              />
                            )}
                          </div>
                        </div>
                        {newPassword !== confirmPassword ? (
                          <span className="text-danger">
                            Password and confirm password does not match
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      {newPassword === confirmPassword ? (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                        >
                          {loading ? "Reset Password..." : "Reset Password"}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled
                        >
                          Reset Password
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
              <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1">
                <img
                  src="https://res.cloudinary.com/dq5upuxm8/image/upload/v1708075638/dental%20guru/Login-page_1_cwadmt.png"
                  className="img-fluid img-fr"
                  alt="Sample"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PasswordReset;
const Container = styled.div`
  .cardstyle {
    border-radius: 25px;
    height: 100%;
    width: 80%;
    margin-top: 2rem;
    margin-bottom: 2rem;
    background-color: #d7f3f0 !important;
  }

  a {
    text-decoration: none;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
  }

  .popup-container.active {
    display: flex;
    background-color: #00000075;
    z-index: 1;
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .img-fr {
    height: 100%;
    width: auto;
  }

  .input-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .eye-icon {
    position: absolute;
    right: 10px; /* Adjust the value to your preference */
    cursor: pointer;
  }
`;
