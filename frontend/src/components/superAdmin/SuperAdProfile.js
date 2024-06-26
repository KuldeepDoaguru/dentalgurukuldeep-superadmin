import React from "react";
import styled from "styled-components";
import Header from "../Header";
import Sider from "../Sider";
import { useSelector } from "react-redux";

const SuperAdProfile = () => {
  const user = useSelector((state) => state.user);
  console.log(`User Name: ${user.name}, User ID: ${user.id}`);
  console.log("User State:", user);
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
                <div className="container mt-3">
                  <h2 className="text-center">Welcome to Dental Guru!</h2>
                  <h5 className="text-center">Super Admin Profile</h5>
                  {/* <hr /> */}
                  <div className="container mt-3 d-flex justify-content-center">
                    <div class="table-responsive rounded">
                      <table class="table table-bordered rounded shadow">
                        <thead className="table-head">
                          <tr>
                            <th>Super Admin ID</th>
                            <th className="table-small">Name</th>
                            <th className="table-small">Mobile</th>
                            <th className="table-small">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="table-row">
                            <td>{user.id}</td>
                            <td className="table-small">
                              {user.name.toUpperCase()}
                            </td>
                            <td className="table-small">
                              {user.employee_mobile}
                            </td>
                            <td className="table-small">{user.email}</td>
                          </tr>
                        </tbody>
                      </table>
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

export default SuperAdProfile;
const Container = styled.div`
  th,
  td {
    font-size: 1rem;
    padding: 1rem;
  }

  th {
    background-color: #004aad;
    color: white;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }
`;
