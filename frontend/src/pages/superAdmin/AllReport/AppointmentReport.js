import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sider from "../../../components/Sider";
import Header from "../../../components/Header";
import { IoMdArrowRoundBack } from "react-icons/io";
import BranchSelector from "../../../components/BranchSelector";
import { useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";
import cogoToast from "cogo-toast";

const AppointmentReport = () => {
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(false);

  console.log(toDate - fromDate);

  const differenceError = () => {
    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();
    const differenceInMilliseconds = to - from;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    if (differenceInDays >= 30) {
      setError(true);
      cogoToast.error(
        "The difference between the dates should be less than 30 days"
      );
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    differenceError();
  }, [toDate, fromDate]);

  const getAppointList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getAppointmentData/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(response);
      setAppointmentList(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointList();
  }, [branch.name]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const todayDate = new Date();

  // Get year, month, and date
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to adjust month, padStart ensures 2 digits
  const date = String(todayDate.getDate()).padStart(2, "0"); // Ensuring 2 digits

  // Format as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${date}`;

  console.log(formattedDate.slice(0, 7));

  const filterAppointDataByMonth = appointmentList?.filter((item) => {
    return (
      item.appointment_dateTime.split("T")[0].slice(0, 7) ===
      formattedDate.slice(0, 7)
    );
  });

  console.log(filterAppointDataByMonth);

  const goBack = () => {
    window.history.go(-1);
  };

  const downloadAppointmentData = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/downloadAppointReportByTime/${branch.name}`,
        { fromDate: fromDate, toDate: toDate },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);
      // setSelectedEarn(data);
      if (Array.isArray(data)) {
        // Create a new workbook
        const workbook = utils.book_new();

        // Convert the report data to worksheet format
        const worksheet = utils.json_to_sheet(data);

        utils.book_append_sheet(workbook, worksheet, `Appointment Report`);
        writeFile(workbook, `${fromDate} - ${toDate}-appointment-report.xlsx`);
        console.log(data);
      } else {
        console.error("data is not an array");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(fromDate, "-To-", toDate);
  return (
    <>
      <Container>
        <Header />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-1 p-0">
                <Sider />
              </div>
              <div className="col-lg-11 col-11 ps-0">
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  <div className="container-fluid">
                    <button className="btn btn-success" onClick={goBack}>
                      <IoMdArrowRoundBack /> Back
                    </button>
                    <div className="row mt-3">
                      {/* <div className="col-1"></div> */}

                      <div className="col-12">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                          <div class="container d-flex justify-content-center">
                            <h2 className="">Appointment Reports</h2>
                          </div>
                        </nav>
                      </div>
                      <div className="container">
                        <div class="mt-4">
                          <div className="d-flex justify-content-between mb-2">
                            <form onSubmit={downloadAppointmentData}>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <input
                                    type="date"
                                    name=""
                                    id=""
                                    required
                                    className="p-2 rounded"
                                    onChange={(e) =>
                                      setFromDate(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mx-2">To</div>
                                <div>
                                  <input
                                    type="date"
                                    name=""
                                    id=""
                                    required
                                    className="p-2 rounded"
                                    onChange={(e) => setToDate(e.target.value)}
                                  />
                                </div>
                                <div className="d-flex flex-column">
                                  {filterAppointDataByMonth.length > 0 ? (
                                    <button
                                      className="btn btn-warning mx-2"
                                      type="submit"
                                      disabled={error}
                                    >
                                      Download Report
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-warning mx-2"
                                      type="button"
                                      disabled
                                    >
                                      Download Report
                                    </button>
                                  )}

                                  {error && (
                                    <>
                                      <small className="text-danger">
                                        The difference between the dates should
                                        be less than 30 days
                                      </small>
                                    </>
                                  )}
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className="container-fluid mt-3">
                            {loading ? (
                              <Lottie
                                options={defaultOptions}
                                height={300}
                                width={400}
                                style={{ background: "transparent" }}
                              ></Lottie>
                            ) : (
                              <>
                                <div class="table-responsive rounded">
                                  <table class="table table-bordered rounded shadow">
                                    <thead className="table-head">
                                      <tr>
                                        <th className="table-sno sticky">
                                          Appointment ID
                                        </th>
                                        <th className="sticky">Patient UHID</th>

                                        <th className="table-small sticky">
                                          Patient Name
                                        </th>
                                        <th className="table-small sticky">
                                          Contact Number
                                        </th>
                                        <th className="table-small sticky">
                                          Assigned Doctor
                                        </th>

                                        <th className="table-small sticky">
                                          Appointed by
                                        </th>
                                        <th className="table-small sticky">
                                          Updated by
                                        </th>
                                        <th className="table-small sticky">
                                          Appointment Date & Time
                                        </th>
                                        <th className="table-small sticky">
                                          Appointment Status
                                        </th>
                                        <th className="sticky">
                                          Cancel Reason
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filterAppointDataByMonth
                                        ?.filter((item) => {
                                          const billDate =
                                            item.appointment_dateTime?.split(
                                              "T"
                                            )[0];
                                          if (fromDate && toDate) {
                                            return (
                                              billDate >= fromDate &&
                                              billDate <= toDate
                                            );
                                          } else {
                                            return true;
                                          }
                                        })
                                        .map((item) => (
                                          <>
                                            <tr className="table-row">
                                              <td className="table-sno">
                                                {item.appoint_id}
                                              </td>
                                              <td className="table-small">
                                                {item.uhid}
                                              </td>
                                              <td>{item.patient_name}</td>
                                              <td className="table-small">
                                                {item.mobileno}
                                              </td>
                                              <td className="table-small">
                                                {item.assigned_doctor_name}
                                              </td>

                                              <td className="table-small">
                                                {item.appointment_created_by}
                                              </td>
                                              <td className="table-small">
                                                {item.updated_by
                                                  ? item.updated_by
                                                  : "-"}
                                              </td>
                                              <td className="table-small">
                                                {
                                                  item.appointment_dateTime?.split(
                                                    "T"
                                                  )[0]
                                                }{" "}
                                                {
                                                  item.appointment_dateTime?.split(
                                                    "T"
                                                  )[1]
                                                }
                                              </td>
                                              <td>{item.appointment_status}</td>
                                              <td>{item.cancel_reason}</td>
                                            </tr>
                                          </>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AppointmentReport;
const Container = styled.div`
  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .table-responsive {
    height: 30rem;
  }

  th {
    background-color: #004aad;
    color: white;
  }
  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
  }
`;
