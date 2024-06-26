import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../../animation/loading-effect.json";

const TreatBills = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [loading, setLoading] = useState(false);
  const [listBills, setListBills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [popupVisible, setPopupVisible] = useState(false);
  const [placehold, setPlacehold] = useState([]);
  const [keyword, setkeyword] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(10);
  const complaintsPerPage = 8; // Number of complaints per page
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page
  const [upData, setUpData] = useState({
    bill_date: "",
    uhid: "",
    branch_name: branch.name,
    patient_name: "",
    patient_mobile: "",
    patient_email: "",
    treatment: "",
    treatment_status: "",
    drugs_quantity: "",
    total_amount: "",
    paid_amount: "",
    payment_status: "",
    payment_date_time: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpData({ ...upData, [name]: value });
  };

  const openUpdatePopup = (id) => {
    setSelectedItem(id);
    setShowPopup(true);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const closeUpdatePopup = () => {
    setShowPopup(false);
  };

  const getBillDetailsList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getTreatSuggest/${branch.name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      console.log(data);
      setListBills(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(listBills);

  const deleteBillData = async (id) => {
    try {
      const response = await axios.delete(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/deleteBills/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      cogoToast.success("Appointment Deleted Successfully");
      getBillDetailsList();
    } catch (error) {
      console.log(error);
    }
  };

  const getBillDetailsByBid = async () => {
    try {
      const { data } = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getBillBYBillId/${selectedItem}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPlacehold(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBillDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/updateBillDetailsByBillId/${selectedItem}`,
        upData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      getBillDetailsList();
      cogoToast.success("bill details updated successfully");
      closeUpdatePopup();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBillDetailsList();
  }, [branch.name]);

  useEffect(() => {
    getBillDetailsByBid();
  }, [selectedItem]);

  console.log(listBills);
  console.log(keyword);
  console.log(selectedItem);
  console.log(placehold);

  console.log(upData);

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

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const uniqueDoctor = [
    ...new Set(listBills?.map((item) => item.assigned_doctor_name)),
  ];

  console.log(uniqueDoctor);

  const searchFilter = listBills.filter((lab) => {
    if (doctor && trimmedKeyword) {
      return (
        lab.assigned_doctor_name === doctor &&
        (lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
          lab.uhid.toLowerCase().includes(trimmedKeyword))
      );
    } else if (doctor) {
      return lab.assigned_doctor_name === doctor;
    } else if (trimmedKeyword) {
      return (
        lab.patient_name.toLowerCase().includes(trimmedKeyword) ||
        lab.uhid.toLowerCase().includes(trimmedKeyword)
      );
    } else {
      return true; // Show all data when no filters are applied
    }
  });

  console.log(searchFilter);

  const totalBillAmount = searchFilter.reduce((total, item) => {
    return total + item.total_amount;
  }, 0);

  console.log(totalBillAmount);

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
  console.log(displayedAppointments);
  return (
    <>
      <Container>
        <div className="">
          <div className="row">
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
              <div className="">
                {/* <label>Patient Name :</label> */}
                <input
                  type="text"
                  placeholder="Search Patient Name or Contact Number or UHID"
                  className=""
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
              <div className="d-flex justify-content-end align-items-center mt-3">
                <div>
                  <button
                    className="btn btn-info text-white"
                    style={{
                      backgroundColor: "#014cb1",
                      borderColor: "#014cb1",
                    }}
                  >
                    Filter by Doctor
                  </button>
                </div>

                <div className="mx-2">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  >
                    <option value="">Select-</option>
                    {uniqueDoctor?.map((item) => (
                      <>
                        <option value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4>Total Received Amount :- {totalBillAmount}/-</h4>
          </div>

          <div>
            {/* <button
                        className="btn btn-success"
                        // onClick={() => openAddEmployeePopup()}
                      >
                        Add Employee
                      </button> */}
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
                        <th className="table-sno">Bill ID</th>
                        <th>Bill Date</th>
                        <th className="table-small">Patient UHID</th>
                        <th className="table-small">Treatment Package ID</th>
                        <th className="table-small">Patient Name</th>
                        <th className="table-small">Patient Mobile</th>
                        <th className="table-small">Patient Email</th>
                        <th>Assigned Doctor</th>
                        <th className="table-small">Total Amount</th>
                        <th>Paid Amount</th>
                        <th>Paid by Security Amount</th>
                        <th>Payment Status</th>
                        <th>Payment Date</th>
                        <th>Pending Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAppointments?.map((item) => (
                        <>
                          <tr className="">
                            <td>{item.bill_id}</td>
                            <td>{item.bill_date?.split("T")[0]}</td>
                            <td>
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
                            <td>{item.tp_id}</td>
                            <td>{item.patient_name}</td>
                            <td>{item.patient_mobile}</td>
                            <td>{item.patient_email}</td>
                            <td>{item.assigned_doctor_name}</td>
                            <td>{item.total_amount}</td>
                            <td>{item.paid_amount}</td>
                            <td>{item.pay_by_sec_amt}</td>
                            <td>{item.payment_status}</td>
                            <td>{item?.payment_date_time}</td>
                            <td>
                              <td>
                                {item.paid_amount + item.pay_by_sec_amt >=
                                item.total_amount
                                  ? 0
                                  : item.total_amount -
                                    (item.paid_amount + item.pay_by_sec_amt)}
                              </td>
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
                {/* <div className="pagination">
                          <ul>
                            <li>
                              <button
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="btn btn-danger"
                              >
                                Previous
                              </button>
                            </li>
                            {renderPaginationButtons()}
                            <li>
                              <button
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="btn btn-info"
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </div> */}
              </>
            ) : (
              <>
                <h1>No Bill Found</h1>
              </>
            )}
          </>
        )}

        {/* ********************************************************************************************* */}
        {/* pop-up for creating notice */}
        <div className={`popup-container${showPopup ? " active" : ""}`}>
          <div className="popup">
            <h2 className="text-center">Update Branch Details</h2>
            <hr />
            <form className="d-flex flex-column" onSubmit={updateBillDetails}>
              <div className="container">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Bill Date
                      </label>
                      <input
                        type="date"
                        class="form-control"
                        placeholder="branch name"
                        value={upData.bill_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Patient UHID
                      </label>
                      <input
                        placeholder={placehold[0]?.uhid}
                        class="form-control"
                        name="uhid"
                        value={upData.uhid}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.patient_name}
                        name="patient_name"
                        value={upData.patient_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Patient Mobile
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.patient_mobile}
                        name="patient_mobile"
                        value={upData.patient_mobile}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Patient Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.patient_email}
                        name="patient_email"
                        value={upData.patient_email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Treatment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.treatment}
                        name="treatment"
                        value={upData.treatment}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Treatment Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.treatment_status}
                        name="treatment_status"
                        value={upData.treatment_status}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Drugs with Quantity
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.drugs_quantity}
                        name="drugs_quantity"
                        value={upData.drugs_quantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Total Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.total_amount}
                        name="total_amount"
                        value={upData.total_amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Paid Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.paid_amount}
                        name="paid_amount"
                        value={upData.paid_amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Payment Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.payment_status}
                        name="payment_status"
                        value={upData.payment_status}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Pending Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.pending_amount}
                        name="pending_amount"
                        value={upData.pending_amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Payment Date & Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placehold[0]?.payment_date_time}
                        name="payment_date_time"
                        value={upData.payment_date_time}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="container d-flex justify-content-start">
                <button type="submit" className="btn btn-success mt-2">
                  update
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 mx-2"
                  onClick={closeUpdatePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* popup for updating notice */}
        {/* ******************************************************************************************** */}
      </Container>
    </>
  );
};

export default TreatBills;
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

  th,
  td {
    white-space: nowrap !important;
  }
`;
