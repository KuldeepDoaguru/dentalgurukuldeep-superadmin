import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";

const LabBills = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const branch = useSelector((state) => state.branch);
  console.log(user);
  console.log(branch);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setkeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getAppointList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getLabData/${branch.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        setAppointmentList(response.data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

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

  useEffect(() => {
    setCurrentPage(0);
  }, []);

  console.log(appointmentList);

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = appointmentList.filter(
    (lab) =>
      lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
      lab.patient_uhid.toLowerCase().includes(trimmedKeyword)
  );

  const billPerPage = 10;

  const totalPages = Math.ceil(searchFilter.length / billPerPage);

  const filterAppointDataByMonth = () => {
    const startIndex = currentPage * billPerPage;
    const endIndex = startIndex + billPerPage;
    return searchFilter?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedAppointments = filterAppointDataByMonth();

  console.log(displayedAppointments);

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between">
          <div className="w-50">
            <input
              type="text"
              placeholder="Search Patient Name or UHID"
              className=""
              value={keyword}
              onChange={handleKeywordChange}
            />
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
            {displayedAppointments?.length > 0 ? (
              <>
                <div class="table-responsive rounded mt-4">
                  <table class="table table-bordered rounded shadow">
                    <thead className="table-head">
                      <tr>
                        <th className="table-sno">Test ID</th>
                        <th>Test Date</th>
                        <th>Test Name</th>
                        <th className="table-small">Patient UHID</th>
                        {/* <th className="table-small">Treatment Package ID</th> */}
                        <th className="table-small">Patient Name</th>
                        {/* <th className="table-small">Total Amount</th> */}
                        <th>Paid Amount</th>
                        <th>Payment Status</th>
                        <th>Test Status</th>
                        <th>Payment Date</th>
                        {/* <th>Pending Amount</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAppointments?.map((item) => (
                        <>
                          <tr className="table-row">
                            <td className="table-sno">{item.testid}</td>
                            <td className="table-small">
                              {item.authenticate_date?.split("T")[0]}
                            </td>
                            <td>{item.test}</td>
                            <td className="table-small">
                              <Link
                                className="fw-bold"
                                to={`/patient-profile/${item.patient_uhid}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#004aad",
                                }}
                              >
                                {item.patient_uhid}
                              </Link>
                            </td>
                            {/* <td className="table-small">{item.tpid}</td> */}
                            <td className="table-small">{item.patient_name}</td>
                            {/* <td className="table-small">{item.cost}</td> */}
                            <td className="table-small">{item.payment}</td>
                            <td>{item.payment_status}</td>
                            <td>{item.test === null ? "Pending" : "Done"}</td>
                            <td>
                              {item?.created_date
                                ? moment(
                                    item?.created_date,
                                    "YYYY-MM-DDTHH:mm"
                                  ).format("DD/MM/YYYY")
                                : "--"}
                            </td>

                            {/* <td>{item.payment !== null ? 0 : item.payment}</td> */}
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
            ) : (
              <>
                <h1>No Bill Found</h1>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default LabBills;
const Container = styled.div``;

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
