import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../../../../animation/loading-effect.json";
import { FaLessThanEqual } from "react-icons/fa6";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="intro">{label}</p>
        <p className="label">{`${payload[0].value}`}</p>
        <p className="desc"></p>
      </div>
    );
  }

  return null;
};

const EarnTMAdmin = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const branch = useSelector((state) => state.branch);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAppointList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getTreatSuggest/${branch.name}`,
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
        setLoading(FaLessThanEqual);
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

  const getDate = new Date();
  const year = getDate.getFullYear();
  const month = String(getDate.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate(); // Last day of the current month
  const formattedDate = `${year}-${month}`;

  const filterForPayStatus = appointmentList?.filter((item) => {
    return item.payment_status === "paid";
  });

  // Group appointments by date and count appointments for each day
  const dailyAppointments = filterForPayStatus?.reduce((acc, appointment) => {
    if (appointment.bill_date) {
      // Ensure payment_date_time is not null or undefined
      const date = appointment.bill_date.split("T")[0];
      acc[date] = acc[date] ? acc[date] + 1 : 1;
    }
    return acc;
  }, {});

  let totalAmountPerDay = {}; // Object to store total amount for each day

  filterForPayStatus.forEach((item) => {
    if (item.bill_date) {
      // Ensure payment_date_time is not null or undefined
      const date = item.bill_date.split("T")[0];
      totalAmountPerDay[date] =
        (totalAmountPerDay[date] || 0) +
        parseFloat(item.paid_amount) +
        parseFloat(item.pay_by_sec_amt);
    }
  });

  console.log(totalAmountPerDay);

  // Create an array containing data for all days of the month
  const data = Array.from({ length: lastDay }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    const date = `${formattedDate}-${day}`;
    return {
      date,
      patients: dailyAppointments[date] || 0,
      Amount: totalAmountPerDay[date] || 0,
    };
  });

  // console.log(data);

  return (
    <>
      <Container>
        <div className="container-fluid mt-4" id="main">
          {loading ? (
            <Lottie options={defaultOptions} height={300} width={400}></Lottie>
          ) : (
            <>
              <BarChart
                width={400}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 0,
                    transform: "translate(-10,0)",
                    dy: 5,
                    fill: "#666",
                    fontWeight: "bold",
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="patients"
                  fill="#40407a"
                  yAxisId="left"
                  name="Patients"
                />
                <Bar
                  dataKey="Amount"
                  fill="#c23616"
                  yAxisId="right"
                  name="Amount"
                />
              </BarChart>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default EarnTMAdmin;
const Container = styled.div`
  #main {
    background-color: #82ccdd;
    width: 100%;
    border-radius: 5px;
    padding: 2rem;
    box-shadow: 0px 2px 18px #bdbaba;
    display: flex;
    justify-content: center;
  }
`;
