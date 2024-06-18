import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";
import moment from "moment";

const TreatBillReport = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
  const branch = useSelector((state) => state.branch);
  console.log(`User Name: ${branch.name}`);
  const [listBills, setListBills] = useState([]);
  const { refreshTable } = useSelector((state) => state.user);
  const [fromDate, setFromDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [toDate, setToDate] = useState("");

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

  const filterBillDataByMonth = listBills?.filter((item) => {
    return (
      item.bill_date.split(" ")[0].slice(3, 8) === formattedDate.slice(3, 8)
    );
  });

  console.log(filterBillDataByMonth);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const downloadBillingData = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/downloadBillingReportByTime/${branch.name}`,
        { fromDate: fromDate, toDate: toDate },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);

      if (Array.isArray(data)) {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, worksheet, `Billing Report`);
        writeFile(workbook, `${fromDate} - ${toDate}-billing-report.xlsx`);
        console.log(data);
      } else {
        console.error("data is not an array");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBillDetailsList();
  }, [branch.name, refreshTable]);

  console.log(fromDate, toDate);
  const formateFromDate = moment(fromDate).format("DD-MM-YYYY");
  const formateToDate = moment(toDate).format("DD-MM-YYYY");

  return (
    <>
      <Container>
        <div className="container-fluid">
          <div class=" mt-4">
            <div className="d-flex justify-content-between mb-2">
              <form onSubmit={downloadBillingData}>
                <div className="d-flex justify-content-between">
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
                  <button className="btn btn-warning mx-2" type="submit">
                    Download Report
                  </button>
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
                          <th className="table-sno sticky">Bill ID</th>
                          <th className="sticky">Bill Date</th>
                          <th className="table-small sticky">Patient UHID</th>
                          <th className="table-small sticky">Patient Name</th>
                          <th className="table-small sticky">Patient Mobile</th>
                          <th className="table-small sticky">Total Amount</th>
                          <th className="sticky">Paid Amount</th>
                          <th className="sticky">Payment Status</th>
                          <th className="sticky">Payment Date & Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fromDate !== "" && toDate !== ""
                          ? listBills
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
                              .map((item) => (
                                <>
                                  <tr className="table-row">
                                    <td className="table-sno">
                                      {item.bill_id}
                                    </td>
                                    <td className="table-small">
                                      {item.bill_date?.split("T")[0]}
                                    </td>
                                    <td className="table-small">{item.uhid}</td>
                                    <td className="table-small">
                                      {item.patient_name}
                                    </td>
                                    <td>{item.patient_mobile}</td>
                                    <td className="table-small">
                                      {item.total_amount}
                                    </td>
                                    <td className="table-small">
                                      {item.paid_amount}
                                    </td>
                                    <td>
                                      {item.payment_status === "paid"
                                        ? "Paid"
                                        : "Pending"}
                                    </td>
                                    <td>{item.payment_date_time}</td>
                                  </tr>
                                </>
                              ))
                          : filterBillDataByMonth
                              ?.filter((item) => {
                                const billDate = item.bill_date?.split("T")[0];
                                if (fromDate && toDate) {
                                  return (
                                    billDate >= fromDate && billDate <= toDate
                                  );
                                } else {
                                  return true;
                                }
                              })
                              .map((item) => (
                                <>
                                  <tr className="table-row">
                                    <td className="table-sno">
                                      {item.bill_id}
                                    </td>
                                    <td className="table-small">
                                      {item.bill_date?.split("T")[0]}
                                    </td>
                                    <td className="table-small">{item.uhid}</td>
                                    <td className="table-small">
                                      {item.patient_name}
                                    </td>
                                    <td>{item.patient_mobile}</td>
                                    <td className="table-small">
                                      {item.total_amount}
                                    </td>
                                    <td className="table-small">
                                      {item.paid_amount}
                                    </td>
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
    height: 30rem;
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
`;
