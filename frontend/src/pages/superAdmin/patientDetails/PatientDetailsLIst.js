import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import BranchSelector from "../../../components/BranchSelector";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";

const PatientDetailsLIst = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [patList, setPatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setkeyword] = useState("");
  const complaintsPerPage = 8; // Number of complaints per page
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page

  const getPatByBranch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getPatientDetailsByBranch/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(data);
      setPatList(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPatByBranch();
  }, [branch.name]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  console.log(patList);

  useEffect(() => {
    setCurrentPage(0);
  }, [keyword]);

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = patList.filter(
    (lab) =>
      lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
      lab.uhid.toLowerCase().includes(trimmedKeyword) ||
      lab.mobileno.includes(trimmedKeyword)
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

  const displayedAppointments = filterAppointDataByMonth();

  return (
    <>
      <Container>
        <Header />
        <div className="main">
          <div className="container-fluid">
            <div className="row flex-nowrap ">
              <div className="col-lg-1 col-md-1 col-1 p-0">
                <Sider />
              </div>
              <div className="col-lg-11 col-md-11 col-11 ps-0 mx-2">
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between">
                    <BranchSelector />
                  </div>
                </div>
                <div className="container-fluid mt-3">
                  <h2 className="text-center">Patient Details List</h2>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="w-50">
                      {/* <label>Patient Name :</label> */}
                      <input
                        type="text"
                        placeholder="Search Patient Name or UHID or mobile number"
                        className=""
                        value={keyword}
                        onChange={handleKeywordChange}
                      />
                    </div>
                    <div>
                      <h4>Total : {searchFilter.length}</h4>
                    </div>
                  </div>

                  {loading ? (
                    <Lottie
                      options={defaultOptions}
                      height={300}
                      width={400}
                      style={{ background: "transparent" }}
                    ></Lottie>
                  ) : (
                    <>
                      <div class="table-responsive">
                        <table class="table table-bordered">
                          <thead className="table-head">
                            <tr>
                              <th className="thead sticky">Patient UHID</th>
                              <th className="thead sticky">Name</th>
                              <th className="thead sticky">Mobile</th>
                              <th className="thead sticky">Gender</th>
                              <th className="thead sticky">Email</th>
                              <th className="thead sticky">Date of Birth</th>
                              {/* <th className="thead sticky">Marital Status</th> */}
                              <th className="thead sticky">Patient Type</th>
                              <th className="thead sticky">Address</th>
                              <th className="thead sticky">Adhaar Number</th>
                              <th
                                className="sticky"
                                style={{ minWidth: "10rem" }}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedAppointments.map((item) => (
                              <>
                                <tr className="table-row">
                                  <td className="thead">
                                    <Link
                                      className="fw-bold"
                                      to={`/patient-profile/${item.uhid}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "#004aad",
                                      }}
                                    >
                                      {item.uhid}
                                    </Link>
                                  </td>
                                  <td className="thead">{item.patient_name}</td>
                                  <td className="thead">{item.mobileno}</td>
                                  <td className="thead">{item.gender}</td>
                                  <td className="thead">{item.emailid}</td>
                                  <td className="thead">{item.dob}</td>
                                  {/* <td className="thead">{item.maritalstatus}</td> */}
                                  <td className="thead">{item.patient_type}</td>
                                  <td className="thead">{item.address}</td>
                                  <td className="thead">{item.adharno}</td>
                                  <td
                                    className=""
                                    style={{ minWidth: "10rem" }}
                                  >
                                    <div className="d-flex">
                                      <Link
                                        to={`/patient-profile/${item.uhid}`}
                                      >
                                        <button
                                          className="btn btn-warning text-white shadow"
                                          style={{
                                            backgroundColor: "#014cb1",
                                            borderColor: "#014cb1",
                                          }}
                                        >
                                          View Details
                                        </button>
                                      </Link>
                                    </div>
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
      </Container>
    </>
  );
};

export default PatientDetailsLIst;
const Container = styled.div`
  th {
    background-color: #004aad;
    color: white;
    text-align: center;
  }
  td {
    text-align: center;
  }

  .thead {
    min-width: 8rem;
  }

  /* .table-responsive {
    height: 30rem;
    overflow: auto;
  } */

  th {
    background-color: #004aad;
    color: white;
    position: sticky;
    white-space: nowrap;
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
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
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
    border: 1px solid #e6ecf1;
    color: #007bff;
    cursor: pointer;
    /* background-color: #004aad0a; */
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
  }

  .pagination li.active a {
    background-color: #004aad;
    color: white;
    border: 1px solid #004aad;
    border-radius: 5px;
  }

  .pagination li.disabled a {
    color: white;
    cursor: not-allowed;
    border-radius: 5px;
    background-color: #3a4e69;
    border: 1px solid #3a4e69;
  }

  .pagination li a:hover:not(.active) {
    background-color: #004aad;
    color: white;
    border-radius: 5px;
    border: 1px solid #004aad;
  }
`;
