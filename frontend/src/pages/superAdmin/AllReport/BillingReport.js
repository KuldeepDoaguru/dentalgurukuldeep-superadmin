import React, { useState } from "react";
import styled from "styled-components";
import Sider from "../../../components/Sider";
import Header from "../../../components/Header";
import { IoMdArrowRoundBack } from "react-icons/io";
import BranchSelector from "../../../components/BranchSelector";
import { Nav } from "react-bootstrap";
import TreatBillReport from "./BillReport/TreatBillReport";
import LabReport from "./BillReport/LabReport";
import OpdReport from "./BillReport/OpdReport";

const BillingReport = () => {
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
                </div>
                <div className="container-fluid mt-3">
                  <button className="btn btn-success" onClick={goBack}>
                    <IoMdArrowRoundBack /> Back
                  </button>
                  <h3 className="text-center">Bill Report</h3>
                  <div className="container-fluid mt-5 navsect background">
                    <Nav
                      className="d-flex justify-content-between side-cont"
                      activeKey={selectedTab}
                      onSelect={(selectedKey) => setSelectedTab(selectedKey)}
                    >
                      <div className="d-flex flex-row">
                        <Nav.Item>
                          <Nav.Link eventKey="tab1" className="navlink shadow">
                            Treatment Bills
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab2"
                            className={`navlink shadow mx-2 `}
                          >
                            Lab Bills
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="tab3"
                            className={`navlink shadow`}
                          >
                            OPD Bills
                          </Nav.Link>
                        </Nav.Item>
                      </div>
                      <div>
                        {/* <p className="fw-bold">Total Lab - 09</p> */}
                      </div>
                    </Nav>
                    <div className="flex-grow-1 p-3 mainback">
                      {selectedTab === "tab1" && <TreatBillReport />}
                      {selectedTab === "tab2" && <LabReport />}
                      {selectedTab === "tab3" && <OpdReport />}
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

export default BillingReport;
const Container = styled.div`
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
`;
