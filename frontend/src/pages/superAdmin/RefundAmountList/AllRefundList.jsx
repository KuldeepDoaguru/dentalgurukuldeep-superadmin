import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Dropdown, Nav } from "react-bootstrap";
import RefundedAmountReport from "../AllReport/RefundedAmountReport";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import BranchSelector from "../../../components/BranchSelector";
import { IoMdArrowRoundBack } from "react-icons/io";
import OpdRefundAmount from "./OpdRefundAmount";

const AllRefundList = () => {
  const initialTab = localStorage.getItem("selectedTab") || "tab1";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const goBack = () => {
    window.history.go(-1);
  };

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
              <div className="col-lg-11 col-md-11 col-11 ps-0 mx-3">
                <div className="container-fluid mt-3">
                  <div className="d-flex justify-content-between mx-2">
                    <BranchSelector />
                  </div>
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                </div>

                <div className="container-fluid mt-3">
                  <h3 className="text-center">Refunded Amount Reports</h3>
                  <div className="container-fluid mt-5 navsect background">
                    <Nav
                      className="d-flex justify-content-between side-cont"
                      activeKey={selectedTab}
                      onSelect={(selectedKey) => setSelectedTab(selectedKey)}
                    >
                      <div className="d-flex flex-row">
                        <Nav.Item>
                          <Nav.Link eventKey="tab1" className="navlink shadow">
                            Security Amount Refund
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab2"
                            className={`navlink shadow mx-2 `}
                          >
                            OPD Amount Refund
                          </Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                          <Nav.Link
                            eventKey="tab3"
                            className={`navlink shadow`}
                          >
                            OPD Bills
                          </Nav.Link>
                        </Nav.Item> */}
                      </div>
                      <div>
                        {/* <p className="fw-bold">Total Lab - 09</p> */}
                      </div>
                    </Nav>
                    <div className="flex-grow-1 mainback">
                      {selectedTab === "tab1" && <RefundedAmountReport />}
                      {selectedTab === "tab2" && <OpdRefundAmount />}
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

export default AllRefundList;
const Container = styled.div`
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
  }

  .popup {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .navlink.active {
    background-color: #004aad !important;
    border-radius: 1rem;
    color: white !important;
  }

  .navlink {
    background-color: #ffff !important;
    color: black;
    border-radius: 1rem;
  }

  th {
    background-color: #004aad;
    color: white;
    white-space: nowrap;
  }

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    ul {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      li {
        list-style: none;
      }
    }
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
    /* @media (min-width: 1280px) and (max-width: 2000px){
              width: 18%;
            }
            @media (min-width: 1024px) and (max-width: 1279px){
              width: 30%;
            }
            @media (min-width: 768px) and (max-width: 1023px){
              width: 38%;
            } */
  }

  input:focus {
    border-color: #007bff; /* Change border color on focus */
  }
`;
