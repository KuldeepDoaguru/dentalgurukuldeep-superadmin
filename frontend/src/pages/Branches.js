import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { Link } from "react-router-dom";
import BranchSelector from "../components/BranchSelector";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "../animation/loading-effect.json";

const Branches = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ notice: "" });
  const [branchHeadImg, setBranchHeadImg] = useState(null);
  const [branchFootImg, setBranchFootImg] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const [branchList, setBranchList] = useState([]);
  const [headError, setHeadError] = useState("");
  const [footError, setFootError] = useState("");
  const [upData, setUpData] = useState({
    name: selectedItem.branch_name,
    address: selectedItem.branch_address,
    contact: selectedItem.branch_contact,
  });

  // Create references for file input fields
  const branchHeadImgRef = useRef(null);
  const branchFootImgRef = useRef(null);
  useEffect(() => {
    setUpData({
      name: selectedItem.branch_name,
      address: selectedItem.branch_address,
      contact: selectedItem.branch_contact,
    });
  }, [selectedItem]);

  console.log(selectedItem.branch_name);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "contact") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setUpData((prevEmpData) => ({
          ...prevEmpData,
          [name]: value,
        }));
      }
    } else {
      setUpData({
        ...upData,
        [name]: value,
      });
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const openUpdatePopup = (id, item) => {
    setSelectedItem(item);
    console.log(item);
    setShowPopup(true);
  };

  console.log(selectedItem);

  console.log(upData, branchHeadImg);
  // console.log(branchFootImg.file);

  const updateBranchDetails = async (e, id) => {
    console.log(id);
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in upData) {
        formData.append(key, upData[key]);
      }

      formData.append("head_img", branchHeadImg?.file);
      formData.append("foot_img", branchFootImg?.file);

      console.log(upData, branchHeadImg, branchFootImg);

      const response = await axios.put(
        `https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/updateBranchDetails/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(response);
      setBranchHeadImg(null);
      setBranchFootImg(null);
      getBranchList();
      setShowPopup(false);
      cogoToast.success("branch details updated successfully");
      setUpData({
        name: "",
        address: "",
        contact: "",
      });
      // Clear the file input fields
      if (branchHeadImgRef.current) branchHeadImgRef.current.value = "";
      if (branchFootImgRef.current) branchFootImgRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const closeUpdatePopup = () => {
    setShowPopup(false);
  };

  const getBranchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://dentalgurusuperadmin.doaguru.com/api/v1/super-admin/getBranch"
      );
      setLoading(false);
      console.log(response.data);
      setBranchList(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchList();
  }, []);

  console.log(branchList);

  const handleBranchHeadPicture = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          if (
            (image.width === 5900 && image.height === 1844) ||
            (image.width === 1920 && image.height === 601)
          ) {
            setBranchHeadImg({
              file: selectedFile,
              imageUrl: reader.result,
            });
            setHeadError("");
          } else {
            setHeadError(
              "Invalid image resolution. Please select an image with resolution 5900×1844 or 1920×601."
            );
            branchHeadImgRef.current.value = ""; // Reset the input field
          }
        };
      };
    }
  };

  console.log(branchHeadImg);

  const handleBranchFootPicture = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          if (
            (image.width === 5900 && image.height === 1844) ||
            (image.width === 1920 && image.height === 601)
          ) {
            branchFootImg({
              file: selectedFile,
              imageUrl: reader.result,
            });
            setFootError("");
          } else {
            setFootError(
              "Invalid image resolution. Please select an image with resolution 5900×1844 or 1920×601."
            );
            branchFootImgRef.current.value = ""; // Reset the input field
          }
        };
      };
    }
  };

  console.log(branchFootImg);

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
                <div className="row d-flex justify-content-between mx-3">
                  <div className="col-12 col-md-12 mt-4">
                    <div className="d-flex justify-content-between">
                      {/* <BranchSelector /> */}
                    </div>

                    {/* pop-up for creating notice */}
                    <div
                      className={`popup-container${showPopup ? " active" : ""}`}
                    >
                      <div className="popup">
                        <h2>Update Branch Details</h2>
                        <form
                          className="d-flex flex-column"
                          onSubmit={(e) =>
                            updateBranchDetails(e, selectedItem.branch_id)
                          }
                        >
                          <div className="mb-3">
                            <label for="exampleInputEmail1" class="form-label">
                              Branch Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              class="form-control"
                              placeholder={selectedItem.branch_name}
                              value={upData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label for="exampleInputEmail1" class="form-label">
                              Branch Address
                            </label>
                            <input
                              placeholder={selectedItem.branch_address}
                              class="form-control"
                              name="address"
                              value={upData.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label for="exampleInputEmail1" class="form-label">
                              Branch Contact
                            </label>
                            <small className="mx-1">
                              (Add contact without country code)
                            </small>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={selectedItem.branch_contact}
                              name="contact"
                              value={upData.contact}
                              maxLength={10}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="d-flex">
                            <div>
                              <label
                                for="exampleFormControlInput1"
                                class="form-label"
                              >
                                Upload Header Picture{" "}
                              </label>
                              <small className="fw-bold mx-1">
                                (Please select an image with resolution
                                5900×1844 or 1920×601)
                              </small>
                              <input
                                type="file"
                                class="p-1 w-100 rounded"
                                placeholder="available stock"
                                accept=".pdf, .jpg, .jpeg, .png"
                                name="branchHeadImg"
                                ref={branchHeadImgRef} // Attach ref to file input
                                onChange={handleBranchHeadPicture}
                              />

                              {headError && (
                                <p style={{ color: "red" }}>{headError}</p>
                              )}
                            </div>
                            <div className="mx-2">
                              {branchHeadImg && (
                                <img
                                  src={branchHeadImg.imageUrl}
                                  alt="Header"
                                  className="imgData"
                                />
                              )}
                            </div>
                          </div>
                          <hr />
                          <div className="d-flex">
                            <div>
                              <label
                                for="exampleFormControlInput1"
                                class="form-label"
                              >
                                Upload Footer Picture
                              </label>
                              <small className="fw-bold mx-1">
                                (Please select an image with resolution
                                5900×1844 or 1920×601)
                              </small>
                              <input
                                type="file"
                                class="p-1 w-100 rounded"
                                placeholder="available stock"
                                accept=".pdf, .jpg, .jpeg, .png"
                                name="branchFootImg"
                                onChange={handleBranchFootPicture}
                                ref={branchFootImgRef} // Attach ref to file input
                              />
                              {footError && (
                                <p style={{ color: "red" }}>{footError}</p>
                              )}
                            </div>
                            <div className="mx-2">
                              {branchFootImg && (
                                <img
                                  src={branchFootImg.imageUrl}
                                  alt="Footer"
                                  className="imgData"
                                />
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-evenly">
                            <button
                              type="submit"
                              className="btn btn-success mt-2"
                            >
                              update
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger mt-2"
                              onClick={closeUpdatePopup}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* popup for updating notice */}

                    <h2 className="text-center"> Branch List </h2>
                    <div className="container-fluid mt-3">
                      {loading ? (
                        <>
                          <div className="d-flex justify-content-center w-100">
                            <Lottie
                              options={defaultOptions}
                              height={300}
                              width={400}
                              style={{ background: "transparent" }}
                            ></Lottie>
                          </div>
                        </>
                      ) : (
                        <>
                          <div class="table-responsive rounded">
                            <table class="table table-bordered rounded shadow">
                              <thead className="table-head">
                                <tr>
                                  <th
                                    className="table-sno"
                                    style={{ width: "10%" }}
                                  >
                                    Branch ID
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "20%" }}
                                  >
                                    Branch Name
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "20%" }}
                                  >
                                    Branch Address
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "10%" }}
                                  >
                                    Contact Number
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "10%" }}
                                  >
                                    Header Image
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "10%" }}
                                  >
                                    Footer Image
                                  </th>
                                  <th
                                    className="table-small"
                                    style={{ width: "10%" }}
                                  >
                                    Edit
                                  </th>
                                  {/* <th
                                className="table-small"
                                style={{ width: "10%" }}
                              >
                                Delete
                              </th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {branchList?.map((item) => (
                                  <tr
                                    className="table-row"
                                    key={item.branch_id}
                                  >
                                    <td
                                      className="table-sno"
                                      style={{ width: "10%" }}
                                    >
                                      {item.branch_id}
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "20%" }}
                                    >
                                      {item.branch_name}
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "20%" }}
                                    >
                                      {item.branch_address}
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "10%" }}
                                    >
                                      {item.branch_contact}
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "10%" }}
                                    >
                                      <div className="smallImg">
                                        <img src={item.head_img} alt="header" />
                                      </div>
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "10%" }}
                                    >
                                      <div className="smallImg">
                                        <img src={item.foot_img} alt="footer" />
                                      </div>
                                    </td>
                                    <td
                                      className="table-small"
                                      style={{ width: "10%" }}
                                    >
                                      <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                          openUpdatePopup(item.branch_id, item)
                                        }
                                      >
                                        Edit Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
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

export default Branches;
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

  .select-style {
    border: none;
    background-color: #22a6b3;
    font-weight: bold;
    color: white;
  }

  th {
    background-color: #004aad;
    color: white;
  }

  .imgData {
    height: 10rem;
    width: auto;
  }

  .smallImg {
    img {
      height: 6rem;
      width: auto;
    }
  }
`;
