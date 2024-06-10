/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { dashboard, HomeNotifications } from "../libraries/dashboard";
import User from "../modals/User";
import { observer } from "mobx-react";
import { GrArticle } from "react-icons/gr";
import AppConfig from "../modals/AppConfig";
import Modal from "react-bootstrap/Modal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import profile from "../components/img/profile.png";
import { Link } from "react-router-dom";
import Notifications from "../common/Notifications";
import { BsTrashFill, BsUpload } from "react-icons/bs";
import { uploadMedia } from "../common/uploadFile";
import {
  memberAutoPopulate,
  updateProfileDetails,
} from "../libraries/memberDashboard";
import {
  CheckEmail,
  CheckPhone,
  CheckUserName,
  CheckDob,
} from "../common/Validation";
import HeaderMenu from "../components/HeaderMenu";
import logo from "../components/img/logo.png";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";
import { Button } from "primereact/button";
import "./DashboardHeader.css";

class DashboardHeader extends React.Component {
  state = {
    userDetails: {},
    logout: "",
    count: 0,
    SettingStatus: false,
    ProfileName: "",
    image: "",
    cover_image: "",
    mobile_number: "",
    email: "",
    DOB: "",
    postActivityStatus: false,
    toggle: false,
    menu: false,
    onChangeSearch: false,
    active: "#0c0f12",
    closeSearch: false,
  };

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    const response = await dashboard();
    if (response && response.status === "success") {
      this.setState({
        userDetails: response.result.userDetails[0],
      });
    }
    await this.ProfileAutoPopulate();
    await this.DisplayNotifications();
  }

  // onHandleToggle() {
  //   this.setState({ toggle: !false });
  // }

  DisplayNotifications = async () => {
    const requestData = {
      user_id: User.user_id,
    };
    const response = await HomeNotifications(requestData);
    Notifications.setNotificationCount(response?.result.unreadedCount);
  };

  ProfileAutoPopulate = async () => {
    const id = User.user_id;
    const response = await memberAutoPopulate(id);
    if (response && response.status === "success") {
      const result = response.result.users;
      this.setState({
        status: this.state.SettingStatus,
        ProfileName: result?.name,
        mobile_number: result?.mobile_number,
        email: result?.email,
        image: result?.image,
        cover_image: result?.cover_pic,
        DOB: result?.dob,
      });
    }
  };
  callApiSearch = (e) => {
    const { value } = e.target;
    this.setState({ current_page: 1, search: value, onChangeSearch: true });
    Notifications.setSearchPost(value);
    this.props.setSearch(value);
  };

  PostActivity = () => {
    Notifications.setPostActivityStatus(true);
  };

  renderSearch = () => {
    const { closeSearch } = this.state;
    let searchActive = "active";
    if (closeSearch === false) {
      searchActive = "inactive";
    }

    return (
      <>
        {this.props.path === "/home" || this.props.path === "/notifications" ? (
          <div className={`search-wrapper ${searchActive} p-0 m-0`}>
            <div className="input-holder">
              <input
                type="text"
                className="search-input"
                placeholder="Type to search"
                value={Notifications.searchPost || this.state.search}
                onChange={this.callApiSearch}
              />
              <button
                className="search-icon"
                onClick={(e) => {
                  this.props.props.history.push("/home");
                  this.setState({ closeSearch: true });
                }}
              >
                <span></span>
              </button>
            </div>
            <button
              className="close pointer"
              type="btn"
              onClick={(e) => {
                Notifications.setSearchPost("");
                this.setState({ closeSearch: false });
              }}
            ></button>
          </div>
        ) : null}
      </>
    );
  };

  // onClick logout function
  onClickLogout = async () => {
    try {
      const q = await doc(db, "Status/" + User.StatusCommonId);
      if (q) {
        await updateDoc(q, {
          status: false,
          lastSeen: moment().format("YYYY-MM-DD  hh:mm:ss"),
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.localStorage.clear();
      window.sessionStorage.clear();
      User.setRefresh(true);
      AppConfig.clearStoredDate();
      User.clearStoredDate();
      Notifications.clearStoredDate();
      // window.history.push("/");
      window.location.href = window.location.origin;
    }
  };

  // Onsetting = () => {
  //   this.setState({
  //     SettingStatus: true,
  //   });
  // };

  renderInsertImage() {
    return (
      <>
        <Modal
          size="md"
          className="border-style rounded insert-post"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.SettingStatus}
        >
          <Modal.Header>
            <div className="form-head width100 dflex jc-sb align-center">
              <div className="width100 dflex align-center">
                <GrArticle
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    stroke: "#70b5f9",
                  }}
                  className="form-svg"
                />
                <h5
                  className="mt-1 ml-2 align-self-center"
                  style={{ color: "#fff" }}
                >
                  Update Profile Info
                </h5>
              </div>
              <button
                className="popup-button closeText"
                onClick={() => this.setState({ SettingStatus: false })}
              >
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form
              className="align-items-center event-form"
              onSubmit={this.SubmitProfileSettings}
            >
              <div className="input-row mb-3">
                <div className="form-padding mb-3">
                  <label>Name</label>
                  <input
                    tabIndex="1"
                    type="text"
                    className="form-control"
                    id="personName"
                    placeholder="Enter the Name"
                    value={this.state.ProfileName}
                    onChange={(e) =>
                      this.setState({ ProfileName: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex justify-content-start">
                  {this.state.ProfileNameError ? (
                    <span className="small-font-size text-danger">
                      {this.state.ProfileNameError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="input-row mb-3">
                <div className="mb-3">
                  <label className="selectIcon" htmlFor="toDate">
                    Date of Birth <IoIosArrowDropdownCircle />
                  </label>
                  <input
                    className="form-control"
                    id="toDate"
                    placeholder="Date & Time"
                    type="date"
                    value={this.state.DOB}
                    onChange={(e) => this.setState({ DOB: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-start">
                  {this.state.ToDateError ? (
                    <span className="small-font-size text-danger">
                      {this.state.ToDateError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mb-3">
                <div className="form-padding mb-3">
                  <label>Mobile Number</label>
                  <input
                    className="form-control"
                    label=""
                    placeholder="Mobile Number"
                    type="tel"
                    value={this.state.mobile_number}
                    onChange={(e) =>
                      this.setState({ mobile_number: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex justify-content-start">
                  {this.state.MobError ? (
                    <span className="small-font-size text-danger">
                      {this.state.MobError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mb-4">
                <div className="form-padding mb-3">
                  <label>Email</label>
                  <input
                    placeholder="example@gmail.com"
                    className="form-control"
                    type="email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-start">
                  {this.state.emailError ? (
                    <span className="small-font-size text-danger">
                      {this.state.emailError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="upload-section mb-4">
                <div className="form-floating mb-3 upload-doc-strip">
                  <div className="form-control upload-doc-strip mb-4">
                    <h4>Profile Updation</h4>
                  </div>
                </div>
                <div className="upload-doc-div mb-4">
                  <div className="mb-4">
                    <div className="form-padding mb-4 upload-agenda">
                      {this.state.image ? (
                        <div className="col-md-12">
                          {this.renderThumbnailImage()}
                        </div>
                      ) : (
                        <div>
                          <input
                            className="form-control bsUpload "
                            id="uploadImage"
                            placeholder="Select Profile Image"
                            type="file"
                            accept=".jpg, .png, .jpeg"
                            onChange={this.selectUploadImage}
                          />
                          <button
                            className="btn  small-font-size font-style py-2 my-2"
                            onClick={this.handleUploadImage}
                          >
                            <BsUpload />
                            <span className="mx-3">Upload Profile Image </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="upload-doc-div mb-4">
                  <div className="mb-4">
                    <div className="form-padding mb-4 upload-agenda">
                      {this.state.cover_image ? (
                        <div className="col-md-12">
                          {this.renderThumbnailCoverImage()}
                        </div>
                      ) : (
                        <div>
                          <input
                            className="form-control bsUpload "
                            id="uploadCoverImage"
                            placeholder="Select Profile Image"
                            type="file"
                            accept=".jpg, .png, .jpeg"
                            onChange={this.selectUploadCoverImage}
                          />
                          <button
                            className="btn  small-font-size font-style py-2 my-2"
                            onClick={this.handleUploadCoverImage}
                          >
                            <BsUpload />
                            <span className="mx-3">Upload Cover Image </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cta-section dflex jc-sb">
                <button
                  type="button"
                  className="btn  event-cta-trans font-style py-2 align-center my-2"
                  onClick={() => this.setState({ status: false })}
                >
                  Cancel
                </button>
                <button
                  type="submit "
                  className="btn event-cta btn dflex font-style align-center py-2 my-2"
                >
                  Save
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  validateProfileName = () => {
    const ProfileNameError = CheckUserName(this.state.ProfileName);
    if (ProfileNameError === 1) {
      this.setState({ ProfileNameError: "Field empty" });
      return false;
    } else return true;
  };

  validateToDateError = () => {
    const ToDateError = CheckDob(this.state.DOB);
    if (ToDateError === 1) {
      this.setState({ ToDateError: "Field empty" });
      return false;
    } else return true;
  };

  validateMobNum = () => {
    const MobError = CheckPhone(this.state.mobile_number);
    if (MobError === 1) {
      this.setState({ MobError: "Field empty" });
      return false;
    } else return true;
  };

  validateMail = () => {
    const emailError = CheckEmail(this.state.email);
    if (emailError === 1) {
      this.setState({ emailError: "Email empty" });
      return false;
    } else return true;
  };

  ValidateAll = () => {
    const ProfileNameError = this.validateProfileName();
    const mobile_number_error = this.validateMobNum();
    const Date_error = this.validateToDateError();
    const Email = this.validateMail();

    if (ProfileNameError && Date_error && mobile_number_error && Email) {
      return true;
    } else {
      return false;
    }
  };

  selectUploadImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    const mediaType = e.target.files[0].type;
    this.setState({ mediaType: mediaType });
    uploadMedia(image, this.callBackImage);
  };

  callBackImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState({
        image: response.result.url,
        mediaName: response.result.mediaName,
      });
    }
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const fileSelectorAgenda = document.getElementById("uploadImage");
    fileSelectorAgenda.click();
  };

  renderThumbnailImage = () => {
    return (
      <div
        className="d-flex my-3"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          height: "15rem",
          overflow: "auto",
        }}
      >
        <div className="col-md-10 ">
          <div className="thumbnail-image">
            {this.state.image ? (
              <img
                src={this.state.image}
                alt="project"
                style={{ width: "100%", height: "auto", borderRadius: "unset" }}
              />
            ) : null}
          </div>
        </div>
        <div className="col-md-2">
          <BsTrashFill
            className="theme-font-color big-font-size m-2 pointer"
            style={{ width: "1.5rem", height: "1.5rem" }}
            onClick={() => this.setState({ image: "" })}
          />
        </div>
      </div>
    );
  };

  selectUploadCoverImage = (e) => {
    e.preventDefault();
    const cover_image = e.target.files[0];
    const mediaType = e.target.files[0].type;
    this.setState({ mediaType: mediaType });
    uploadMedia(cover_image, this.callBackCoverImage);
  };

  callBackCoverImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState(
        {
          cover_image: response.result.url,
          mediaName: response.result.mediaName,
        },
        () => { }
      );
    }
  };

  handleUploadCoverImage = (e) => {
    e.preventDefault();
    const fileSelectorAgenda = document.getElementById("uploadCoverImage");
    fileSelectorAgenda.click();
  };

  renderThumbnailCoverImage = () => {
    return (
      <div
        className="d-flex my-3"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          height: "15rem",
          overflow: "auto",
        }}
      >
        <div className="col-md-10 ">
          <div className="thumbnail-image">
            {this.state.cover_image ? (
              <img
                src={this.state.cover_image}
                alt="project"
                style={{ width: "100%", height: "auto", borderRadius: "unset" }}
              />
            ) : null}
          </div>
        </div>
        <div className="col-md-2">
          <BsTrashFill
            className="theme-font-color big-font-size m-2 pointer"
            style={{ width: "1.5rem", height: "1.5rem" }}
            onClick={() => this.setState({ cover_image: "" })}
          />
        </div>
      </div>
    );
  };

  SubmitProfileSettings = async (e) => {
    e.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const user_id = User.user_id;
      const requestData = {
        name: this.state.ProfileName,
        mobile_number: this.state.mobile_number,
        image: this.state.image,
        cover_pic: this.state.cover_image,
        user_id: User.user_id,
        dob: this.state.DOB,
      };
      const response = await updateProfileDetails(requestData, user_id);
      if (response && response.status === "success") {
        this.setState({ SettingStatus: false });
      } else if (response.status === "error") {
        const { result } = response;
        let message = String(result);
        if (result[Object.keys(result)[0]]) {
          message = result[Object.keys(result)[0]];
        }
        AppConfig.setMessage(message);
      }
    }
  };

  render() {
    const { userDetails } = this.state;
    return (
      <div className="fixed-sidebar fixed-header mt-5 pos-rel">
        <div
          className="app-header  header-shadow"
          style={{ backgroundColor: "#fff", borderRadius: "0px" }}
        >
          <div className="app-header__mobile-menu p-0 m-0">
            <div>
              <Button
                type="button"
                className="hamburger hamburger--elastic mobile-toggle-nav bg-white border-0"
              >
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </Button>
            </div>
          </div>
          <div className="app-header__content wrapper pos-rel">
            <div className="app-header__logo mr-4">
              <img src={logo} alt="CompanyLogo" id="VCAT-Logo" />
              <div className="header__pane ml-auto"></div>
            </div>
            {this.renderSearch()}
            <div className="app-header-right">
              <div className="header-btn-lg pr-0">
                <div className="widget-content p-0" >
                  <div className="widget-content-wrapper">
                    <div className="app-header-right" id="non-mobile-view">
                      <HeaderMenu />
                    </div>
                    <div className="widget-content-right header-user-info ml-3">
                      <div className="btn-group user-button-grp  pos-rel">
                        <button
                          type="button"
                          className="btn-shadow user-button p-1 btn btn-sm p-0 btn"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <img
                            src={userDetails.image || profile}
                            alt="userImage"
                            className="profile"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                          />
                        </button>
                        <a data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          className="p-0 btn"
                        >
                          Me <i className="fa fa-angle-down ml-2 opacity-8"></i>
                        </a>
                        <div
                          tabIndex="-1"
                          role="menu"
                          aria-hidden="true"
                          style={{
                            transform: "translate(0, 50px) !important"
                          }}
                          className="dropdown-menu dropdown-menu-right cus-header-menu"
                        >
                          <ul className="list-style">
                            <div className="user-info pos-rel">
                              <div className="img">
                                <img
                                  src={userDetails.image || profile}
                                  alt="userImage"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div className="user-details">
                                <h6>
                                  {userDetails.name || "User Name"}
                                </h6>
                                <a>
                                  {userDetails.occupation || "Occupation"}
                                  &nbsp;
                                </a>
                              </div>
                            </div>
                            <li className="settings m-0 p-0 cus-header-menu-item">
                              <Link to="/home" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Home
                                </div>
                              </Link>
                            </li>
                            <li className="settings m-0 p-0 cus-header-menu-item">
                              <Link to="/notifications" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Notifications
                                </div>
                              </Link>
                            </li>
                            <li className="settings m-0 p-0 cus-header-menu-item">
                              <Link to="/messages" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Messages
                                </div>
                              </Link>
                            </li>
                            <li className="settings m-0 p-0 cus-header-menu-item">
                              <Link to="/dashboard" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Dashboard
                                </div>
                              </Link>
                            </li>
                            <li className="settings d-flex m-0 p-0">
                              <Link to="/profile" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  User Profile
                                </div>
                              </Link>
                            </li>
                            <li className="settings d-flex m-0 p-0">
                              <Link to="/post" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Post & Activity
                                </div>
                              </Link>
                            </li>
                            <li className="settings d-flex m-0 p-0">
                              <Link to="/change" className="col p-0 m-0">
                                <div className="p-0 m-0 ml-3">
                                  Change Password
                                </div>
                              </Link>
                            </li>
                            <li>
                              <button
                                className="settings d-flex m-0 p-0"
                                style={{ textAlign: "left", width: "100%" }}
                                onClickCapture={() =>
                                  this.setState({
                                    SettingStatus: true,
                                  })
                                }
                              >
                                <div className="col p-0 m-0">
                                  <div className="p-0 m-0 ml-3">
                                    Update Profile
                                  </div>
                                </div>
                              </button>
                            </li>
                          </ul>
                          <Button
                            className="logout settings mx-2 logout-but"
                            label="Log Out"
                            style={{
                              textAlign: "center",
                              width: "90%",
                              margin: "0 auto",
                            }}
                            onClickCapture={() => this.onClickLogout()}
                          // onClick={() => this.onClickLogout()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderInsertImage()}
      </div>
    );
  }
}

export default observer(DashboardHeader);
