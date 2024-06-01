import React, { useEffect, useState } from "react";
import BranchSelector from "../../components/BranchSelector";
import Sider from "../../components/Sider";
import Header from "../../components/Header";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import cogoToast from "cogo-toast";
import ReactPaginate from "react-paginate";
import Lottie from "react-lottie";
import animationData from "../../animation/loading-effect.json";

const StaffLeave = () => {
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [leaveData, setLeaveData] = useState([]);
  const [afterAction, setAfterAction] = useState(false);
  const [loading, setLoading] = useState(false);
  // const loading
  const [keyword, setkeyword] = useState("");
  const complaintsPerPage = 10; // Number of complaints per page
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page

  const getLeaveList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getLeaveList/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setLeaveData(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(leaveData);

  useEffect(() => {
    getLeaveList();
  }, []);

  useEffect(() => {
    getLeaveList();
  }, [branch.name]);

  const handleLeaveApprove = async (id) => {
    try {
      const response = await axios.put(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/approveLeave/${id}`,
        {
          status: "Approved",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.success("Leave Approved");
      setAfterAction(true);
      getLeaveList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveReject = async (id) => {
    try {
      const response = await axios.put(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/rejectLeave/${id}`,
        {
          status: "Rejected",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      cogoToast.error("Leave Rejected");
      // setAfterAction(true);
      getLeaveList();
      // setInterval(() => {
      //   getLeaveList();
      // }, 2000);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const searchFilter = leaveData.filter((lab) =>
    lab.employee_name.toLowerCase().includes(keyword.toLowerCase())
  );

  const totalPages = Math.ceil(searchFilter.length / complaintsPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const displayedAppointments = filterAppointDataByMonth();

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
                <div className="container mt-3">
                  <div className="container-fluid">
                    <h3>Employee Leave Management</h3>
                    {/* <label>Employee Name :</label> */}
                    <input
                      type="text"
                      placeholder="search employee name"
                      className="mx-3 p-1 rounded"
                      value={keyword}
                      onChange={(e) => setkeyword(e.target.value.toLowerCase())}
                    />

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
                          <table class="table table-bordered rounded shadow mt-2">
                            <thead className="table-head">
                              <tr>
                                <th className="table-sno sticky">
                                  Employee ID
                                </th>
                                <th className="sticky">Branch</th>
                                <th className="table-small sticky">
                                  Employee Name
                                </th>
                                <th className="table-small sticky">
                                  Leave Dates
                                </th>
                                <th className="table-small sticky">
                                  Leave Reason
                                </th>
                                <th className="table-small sticky">
                                  Applied Date
                                </th>
                                <th className="table-small sticky">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayedAppointments.map((item) => (
                                <>
                                  <tr className="table-row">
                                    <td className="table-sno">
                                      {item.employee_ID}
                                    </td>
                                    <td className="table-small">
                                      {item.branch_name}
                                    </td>
                                    <td className="table-small">
                                      {item.employee_name}
                                    </td>
                                    <td className="table-small">
                                      {item.leave_dates}
                                    </td>
                                    <td>{item.leave_reason}</td>
                                    <td>{item.created_at.split("T")[0]}</td>
                                    <td>
                                      {item.leave_status !== "pending" ||
                                      item.leave_status === null ? (
                                        <button
                                          className={`btn ${
                                            item.leave_status === "Approved"
                                              ? "btn-warning"
                                              : "btn-danger"
                                          }`}
                                        >
                                          {item.leave_status
                                            ? item.leave_status.toUpperCase()
                                            : "Unknown"}
                                        </button>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="d-flex">
                                            <button
                                              className="btn btn-success"
                                              onClick={() =>
                                                handleLeaveApprove(item.id)
                                              }
                                            >
                                              Approve
                                            </button>
                                            <button
                                              className="btn btn-danger ms-2"
                                              onClick={() =>
                                                handleLeaveReject(item.id)
                                              }
                                            >
                                              Reject
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <PaginationContainer>
                          <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                          />
                        </PaginationContainer>
                      </>
                    )}
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

export default StaffLeave;
const Container = styled.div`
  .table-responsive {
    height: 30rem;
    overflow: auto;
  }

  th {
    background-color: #004aad;
    color: white;
    position: sticky;
  }

  .sticky {
    position: sticky;
    top: 0;
    background-color: #004aad;
    color: white;
    z-index: 1;
  }

  input::placeholder {
    color: #aaa;
    opacity: 1; /* Ensure placeholder is visible */
    font-size: 1.2rem;
    transition: color 0.3s ease;
  }

  input:focus::placeholder {
    color: transparent; /* Hide placeholder on focus */
  }

  input {
    /* width: 100%; */
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    @media (min-width: 1280px) and (max-width: 2000px) {
      width: 18%;
    }
    @media (min-width: 1024px) and (max-width: 1279px) {
      width: 30%;
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 38%;
    }
  }

  input:focus {
    border-color: #007bff; /* Change border color on focus */
  }
`;

const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    display: block;
    padding: 8px 16px;
    border: 1px solid black;
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
  }

  .pagination li.active a {
    background-color: #007bff;
    color: white;
    border: 1px solid #007bff;
  }

  .pagination li.disabled a {
    color: #ddd;
    cursor: not-allowed;
  }

  .pagination li a:hover:not(.active) {
    background-color: #ddd;
  }
`;
