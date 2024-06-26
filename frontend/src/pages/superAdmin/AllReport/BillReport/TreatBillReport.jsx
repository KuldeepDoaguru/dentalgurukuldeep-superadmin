import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";
import moment from "moment";
import cogoToast from "cogo-toast";

const TreatBillReport = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  const [keyword, setkeyword] = useState("");
  console.log(`User Name: ${branch.name}`);
  const [listBills, setListBills] = useState([]);
  const [doctor, setDoctor] = useState("");
  const { refreshTable } = useSelector((state) => state.user);
  const [fromDate, setFromDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(false);

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

  const getBillDetailsList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getBillsByBranch/${branch.name}`,
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

  const goBack = () => {
    window.history.go(-1);
  };

  const todayDate = new Date();

  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to adjust month, padStart ensures 2 digits
  const date = String(todayDate.getDate()).padStart(2, "0"); // Ensuring 2 digits

  const formattedDate = `${date}-${month}-${year}`;

  console.log(formattedDate.slice(0, 7));
  console.log(listBills);

  const handleKeywordChange = (e) => {
    setkeyword(e.target.value);
  };

  const filterBillDataByMonth = listBills?.filter((item) => {
    return (
      item.bill_date.split(" ")[0].slice(3, 8) === formattedDate.slice(3, 8)
    );
  });

  console.log(filterBillDataByMonth);

  const uniqueDoctor = [
    ...new Set(listBills?.map((item) => item.assigned_doctor_name)),
  ];

  console.log(uniqueDoctor);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // const downloadBillingData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(
  //       `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/downloadBillingReportByTime/${branch.name}`,
  //       { fromDate: fromDate, toDate: toDate },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       }
  //     );
  //     console.log(data);

  //     if (Array.isArray(data)) {
  //       const workbook = utils.book_new();
  //       const worksheet = utils.json_to_sheet(data);
  //       utils.book_append_sheet(workbook, worksheet, `Billing Report`);
  //       writeFile(workbook, `${fromDate} - ${toDate}-billing-report.xlsx`);
  //       console.log(data);
  //     } else {
  //       console.error("data is not an array");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const exportToExcel = (e) => {
    e.preventDefault();
    const csvRows = [];
    const table = document.querySelector(".table");

    if (!table) {
      console.error("Table element not found");
      return;
    }

    table.querySelectorAll("tr").forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td, th").forEach((cell) => {
        rowData.push(cell.innerText);
      });
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "treatment-bills-report.csv";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    getBillDetailsList();
  }, [branch.name, refreshTable]);

  console.log(fromDate, toDate);
  const formateFromDate = moment(fromDate).format("DD-MM-YYYY");
  const formateToDate = moment(toDate).format("DD-MM-YYYY");

  const trimmedKeyword = keyword.trim().toLowerCase();
  console.log(trimmedKeyword);

  const searchFilter = listBills.filter((lab) => {
    const billDate = lab.bill_date?.split(" ")[0];
    if (doctor && fromDate && toDate) {
      return (
        lab.assigned_doctor_name === doctor &&
        billDate >= formateFromDate &&
        billDate <= formateToDate
      );
    } else if (doctor) {
      return lab.assigned_doctor_name === doctor;
    } else if (fromDate && toDate) {
      return billDate >= formateFromDate && billDate <= formateToDate;
    } else {
      return true;
    }
  });

  const totalBillAmount = searchFilter.reduce((total, item) => {
    return total + item.total_amount;
  }, 0);

  return (
    <>
      <Container>
        <div className="container-fluid">
          <div class=" mt-4">
            <div className="row">
              <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                <div className="d-flex justify-content-between mb-2">
                  <form onSubmit={exportToExcel}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <input
                          type="date"
                          name=""
                          id=""
                          className="p-2 rounded"
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="mx-2">To</div>
                      <div>
                        <input
                          type="date"
                          name=""
                          id=""
                          className="p-2 rounded"
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="d-flex flex-column">
                        {filterBillDataByMonth.length > 0 ? (
                          <button
                            className="btn btn-warning mx-2 text-white shadow"
                            style={{
                              backgroundColor: "#014cb1",
                              borderColor: "#014cb1",
                            }}
                            type="submit"
                            disabled={error}
                          >
                            Download Report
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning mx-2 text-white shadow"
                            style={{
                              backgroundColor: "#014cb1",
                              borderColor: "#014cb1",
                            }}
                            type="button"
                            disabled
                          >
                            Download Report
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
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
              <h4>Total Amount : {totalBillAmount}/-</h4>
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
                          <th className="table-sno sticky">Bill ID</th>
                          <th className="sticky">Bill Date</th>
                          <th className="table-small sticky">Patient UHID</th>
                          <th className="table-small sticky">Patient Name</th>
                          <th className="table-small sticky">Patient Mobile</th>
                          <th className="table-small sticky">
                            Assigned Doctor
                          </th>
                          <th className="table-small sticky">Total Amount</th>
                          <th className="sticky">Paid Amount</th>
                          <th className="sticky">Pay by Security Amount</th>
                          <th className="sticky">Payment Status</th>
                          <th className="sticky">Payment Date & Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchFilter
                          ?.filter((item) => {
                            const billDate = item.bill_date?.split(" ")[0];
                            if (fromDate && toDate) {
                              return (
                                billDate >= formateFromDate &&
                                billDate <= formateToDate
                              );
                            } else {
                              return true;
                            }
                          })
                          .filter((item) => {
                            if (doctor) {
                              return item.assigned_doctor_name === doctor;
                            } else {
                              return true;
                            }
                          })
                          .map((item) => (
                            <>
                              <tr className="table-row">
                                <td className="table-sno">{item.bill_id}</td>
                                <td className="table-small">
                                  {item.bill_date?.split("T")[0]}
                                </td>
                                <td className="table-small">
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
                                <td className="table-small">
                                  {item.patient_name}
                                </td>
                                <td>{item.patient_mobile}</td>
                                <td>{item.assigned_doctor_name}</td>
                                <td className="table-small">
                                  {item.total_amount}
                                </td>
                                <td className="table-small">
                                  {item.paid_amount}
                                </td>
                                <td>{item.pay_by_sec_amt}</td>
                                <td>
                                  {item.payment_status === "paid"
                                    ? "Paid"
                                    : "Pending"}
                                </td>
                                <td>{item.payment_date_time}</td>
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
      </Container>
    </>
  );
};

export default TreatBillReport;
const Container = styled.div`
  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .table-responsive {
    max-height: 30rem;
  }

  th {
    background-color: #004aad;
    color: white;
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }
  .sticky {
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
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
