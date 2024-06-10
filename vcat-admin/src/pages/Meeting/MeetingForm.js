// Imports order //

// Plugins //
import React from "react";
import moment from "moment";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";

// CSS  imports //
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "../../components/img/logo.png";
import { MultiSelect } from "react-multi-select-component";
// Common file imports //
import AppConfig from "../../modals/AppConfig";
import {
  CheckDob,
  CheckMessage,
  CheckUserName,
  DropDownCheck,
  CheckMeetingNumber,
} from "../../common/Validation";
import User from "../../modals/User";

// Api file imports //
import { eventFormDropdown } from "../../libraries/event";
import {
  createMinutes,
  meeting,
  meetingAutoPopulate,
  updateMeeting,
} from "../../libraries/meetingDashboard";
import { wingsDropdown } from "../../libraries/momDashboard";
import { getUsersDropdown } from "../../libraries/dashboard";
import { getUniqueArray } from "../../common/Common";
import { Calendar } from "primereact/calendar";

// Components imports //

class MeetingForm extends React.Component {
  constructor() {
    super();
    this.onMeetingTypeChange = this.onMeetingTypeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    status: false,
    eventName: "",
    personName: "",
    fromDate: "",
    toDate: "",
    MeetingNumber: "",
    city: "",
    description: "",
    on_site: "",
    virtual: "",
    venue: "",
    topic: "",
    selectWing: [],
    selectMember: [],
    selectHost: [],
    selectPastEvent: [],
    selectEventId: "",
    meetingType: "",
    eventType: "",
    continuous: "",
    date_time: "",
    MembersPresent: "",
    meetingTypeError: "",
    Invocation: "",
    WelcomeAddress: "",
    meetingTitle: "",
    WingList: [],
    UserList: [],
    SelectedEvent: [],
    SelectedWing: [],
    SelectedMember: [],
    SelectBot: "",
    BotId: "",
    SelectedBot: [],
    rowId: "",
    type1: false,
    type2: false,
    // new
    wingOption: [],
    memberOption: [],
  };

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    const rowId = this.props.editMeetingId;
    const response = await eventFormDropdown();
    const WingList = [];
    const UserList = [];
    if (response && response.status === "success") {
      const { result } = response;
      const { users_dropdown } = result;
      const { wings_dropdown } = result;

      for (let i in wings_dropdown) {
        WingList.push({
          value: wings_dropdown[i].id,
          label: wings_dropdown[i].title,
        });
      }
      for (let i in users_dropdown) {
        UserList.push({
          value: users_dropdown[i].id,
          label: users_dropdown[i].name,
        });
      }
    }
    // call API
    this.setState({
      UserList,
      WingList,
      rowId,
    });
    await this.setWingsDropdown();
    await this.setMemberDropdown();
  }

  async componentDidUpdate(prevProps) {
    const id = this.props.editMeetingId;
    const { wingOption, memberOption } = this.state;
    if (this.props.status !== prevProps.status && this.props.status && id) {
      this.setState({ status: this.props.status });
      const response = await meetingAutoPopulate(id);
      if (response && response.status === "success") {
        const { result: responseResult } = response;
        if (responseResult) {
          const { meetings: result } = responseResult;
          if (result) {

            let WingResult = response.result.meetings.members;
            let selectedMembers = [];
            if (WingResult && Object.keys(WingResult).length > 0) {
              const users = JSON.parse(WingResult);
              if (Array.isArray(users) && users.length > 0)
                selectedMembers = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
            }

            let WingsList = response.result.meetings.wings;
            let selectedWings = [];
            if (WingsList && Object.keys(WingsList).length > 0) {
              const users = JSON.parse(WingsList);
              if (Array.isArray(users) && users.length > 0)
                selectedWings = wingOption?.filter(({ value: user_id }) => users?.includes(user_id));
            }

            let hosted_by = response.result.meetings.hosted_by;
            let hostedByList = [];
            if (hosted_by && Object.keys(hosted_by).length > 0) {
              const users = JSON.parse(hosted_by);
              if (Array.isArray(users) && users.length > 0)
                hostedByList = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
            }

            const htmlString = String(result.description);
            const descriptions = htmlString.replace(/<[^>]+>|&nbsp;/g, "");
            this.setState({
              meetingTitle: result?.title,
              selectHost: hostedByList,
              MeetingNumber: result?.meeting_number,
              city: result?.city,
              toDate: moment(result?.to_date).format("YYYY-MM-DDTHH:mm"),
              fromDate: moment(result?.from_date).format("YYYY-MM-DDTHH:mm"),
              meetingType: result?.meeting_type,
              venue: result?.venue,
              selectMember: selectedMembers,
              selectWing: selectedWings,
              WelcomeAddress: result?.welcome_address,
              id: result?.user_id,
              description: descriptions,
            });
          }
        }
      }
    }
    if (this.props.createMinutes && this.props.editMeetingId) {
      await this.CreateMinutes();
    }
  }

  setWingsDropdown = async () => {
    const response = await wingsDropdown();
    const { status, result: wingOption } = response;
    if (status === "success" && wingOption) {
      this.setState({ wingOption: Array.isArray(wingOption) ? wingOption : [] });
    }
  }

  setMemberDropdown = async () => {
    const response = await getUsersDropdown();
    const { status, result: memberOption } = response;
    if (status === "success" && memberOption) {
      this.setState({ memberOption: Array.isArray(memberOption) ? memberOption : [] });
    }
  }

  getMembersDropdown = () => {
    const { memberOption, selectWing } = this.state;
    let memberDropdownOption = [...memberOption];
    if (Array.isArray(selectWing) && selectWing.length > 0) {
      selectWing.forEach(({ members }) => {
        if (Array.isArray(members) && members.length > 0) {
          memberDropdownOption = memberDropdownOption?.filter(({ value: user_id }) => !members?.includes(user_id));
        }
      });
    }
    return getUniqueArray(memberDropdownOption);
  }

  CreateMinutes = async () => {
    const id = this.props?.editMeetingId;
    const { user_id } = User;
    const response = await createMinutes({
      id,
      user_id,
    });
    if (response) {
      const { status, result } = response;
      if (result) {
        if (status === 'success') {
          AppConfig.setMessage("Minutes created successfully", false);
          window.location.pathname = "mom";
          return true;
        } else {
          AppConfig.setMessage(result, false);
        }
      }
    }
    if (this.props?.afterSubmit)
      this.props?.afterSubmit();
  };

  handleClick = (e) => {
    this.setState({
      status: true,
      editMOM: "",
    });
  };

  handleChange = (WelcomeAddress) => {
    this.setState({ WelcomeAddress });
  };

  onMeetingTypeChange(e) {
    this.setState({
      meetingType: e.target.value,
      meetingTypeError: "",
    });
  }

  onSelectWing = (e) => {
    this.setState({
      selectWing: e,
    });
  };

  onSelectMember = (e) => {
    this.setState({ selectMember: e });
  };

  onSelectHost = (e) => {
    this.setState({ selectHost: e });
  };

  handleClose = () => {
    this.setState(
      {
        date_time: new Date(),
        eventName: "",
        personName: "",
        fromDate: "",
        toDate: "",
        MeetingNumber: "",
        city: "",
        description: "",
        on_site: "",
        virtual: "",
        venue: "",
        topic: "",
        selectWing: [],
        selectMember: [],
        selectHost: [],
        selectPastEvent: [],
        selectEventId: "",
        meetingType: "",
        eventType: "",
        continuous: "",
        MembersPresent: "",
        Invocation: "",
        WelcomeAddress: "",
        year: "",
        SelectedEvent: [],
        SelectedWing: [],
        SelectedMember: [],
        SelectBot: "",
        BotId: "",
        SelectedBot: [],

        topicError: "",
        WelcomeAddressError: "",
        ToDateError: "",
        MeetingNumberError: "",
        cityError: "",
        descriptionError: "",
        venueError: "",
        SelectWingError: "",
        SelectMemberError: "",
        SelectEventError: "",
        // 
        meetingTitleError: "",
        fromDateError: "",
        meetingTypeError: "",

        meetingTitle: "",
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  checkMeetingType() {
    if (!this.state.meetingType)
      this.setState({ meetingTypeError: "Please select Meeting type" });
    return !!this.state.meetingType;
  }

  validateTopic = () => {
    const topicError = CheckUserName(this.state.topic);
    if (topicError === 1) {
      this.setState({ topicError: "Field empty" });
      return false;
    } else return true;
  };

  validateWelcomeAddress = () => {
    const WelcomeAddressError = CheckMessage(this.state.WelcomeAddress);
    if (WelcomeAddressError === 1) {
      this.setState({ WelcomeAddressError: "Field empty" });
      return false;
    } else return true;
  };

  validateInvocation = () => {
    const meetingTitleError = CheckUserName(this.state.meetingTitle);
    if (meetingTitleError === 1) {
      this.setState({ meetingTitleError: "Field empty" });
      return false;
    } else return true;
  };

  validateToDateError = () => {
    const ToDateError = CheckDob(this.state.toDate);
    if (ToDateError === 1) {
      this.setState({ ToDateError: "Field empty" });
      return false;
    } else if (ToDateError === 2) {
      this.setState({ ToDateError: "Invalid date" });
      return false;
    } else return true;
  };
  validateFromDateError = () => {
    const fromDateError = CheckDob(this.state.fromDate);
    if (fromDateError === 1) {
      this.setState({ fromDateError: "Field empty" });
      return false;
    } else if (fromDateError === 2) {
      this.setState({ fromDateError: "Invalid date" });
      return false;
    } else return true;
  };

  validateMeetingNumber = () => {
    const MeetingNumberError = CheckMeetingNumber(this.state.MeetingNumber);
    if (MeetingNumberError === 1) {
      this.setState({ MeetingNumberError: "Field empty" });
      return false;
    } else return true;
  };

  validateCity = () => {
    const cityError = CheckUserName(this.state.city);
    if (cityError === 1) {
      this.setState({ cityError: "Field empty" });
      return false;
    } else return true;
  };

  validateDescription = () => {
    const descriptionError = CheckMessage(this.state.description);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  validateVenue = () => {
    const venueError = CheckMessage(this.state.venue);
    if (venueError === 1) {
      this.setState({ venueError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectWing = () => {
    const SelectWingError = DropDownCheck(this.state.selectWing);
    if (SelectWingError === 1) {
      this.setState({ SelectWingError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectMember = () => {
    const SelectMemberError = DropDownCheck(this.state.selectMember);
    if (SelectMemberError === 1) {
      this.setState({ SelectMemberError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectEvent = () => {
    const SelectEventError = DropDownCheck(this.state.selectHost);
    if (SelectEventError === 1) {
      this.setState({ SelectEventError: "Field empty" });
      return false;
    } else return true;
  };

  // Empty input validation
  ValidateAll = () => {
    const meetingTypeInput = this.checkMeetingType();
    const ToDateInput = this.validateToDateError();
    const MeetingNumberInput = this.validateMeetingNumber();
    const CityInput = this.validateCity();
    const MeetingTitle = this.validateInvocation();
    const venueInput = this.validateVenue();
    const HostedBy = this.validateSelectEvent();
    const FromDateInput = this.validateFromDateError();
    const MeetingDescriptionInput = this.validateDescription();

    const result =
      meetingTypeInput &&
      //  type2 &&
      FromDateInput &&
      ToDateInput &&
      HostedBy &&
      MeetingNumberInput &&
      MeetingTitle &&
      CityInput &&
      venueInput &&
      MeetingDescriptionInput;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props.saveAccess) {
      const editMeetingId = this.props.editMeetingId;
      if (this.props.password) {
        this.setState({ password: this.props.password });
      }
      const { selectWing, selectMember, selectHost } = this.state;
      const selectedWings = [];
      for (let i in selectWing) {
        selectedWings.push(selectWing[i]["value"]);
      }
      const selectedMembers = [];
      for (let i in selectMember) {
        selectedMembers.push(selectMember[i]["value"]);
      }

      const hostedBy = [];
      for (let i in selectHost) {
        hostedBy.push(selectHost[i]["value"]);
      }
      const id = User.user_id;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const requestData = {
          title: this.state.meetingTitle,
          hosted_by: hostedBy,
          from_date: moment(this.state.fromDate).format("YYYY-MM-DDTHH:mm"),
          to_date: moment(this.state.toDate).format("YYYY-MM-DDTHH:mm"),
          meeting_number: this.state.MeetingNumber,
          city: this.state.city,
          description: this.state.description,
          meeting_type: this.state.meetingType,
          venue: this.state.venue,
          wings: selectedWings,
          members: selectedMembers,
          // description: this.state.WelcomeAddress,
          members_present: null,
          co_opted_bot: null,
          leave_of_absence: null,
          invocation: null,
          welcome_address: this.state.WelcomeAddress,
          user_id: id,
          status: 0,
        };
        if (editMeetingId) {
          requestData["user_id"] = User.user_id;
          const response = await updateMeeting(requestData, editMeetingId);
          if (response && response.status === "success") {
            this.handleClose();
            AppConfig.setMessage("Meeting updated successfully", false);
          } else if (response.status === "error") {
            AppConfig.setMessage(response.result);
          }
        } else {
          const response = await meeting(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage("Meeting created successfully", false);
            this.handleClose();
          } else if (response.status === "error") {
            const { result } = response;
            let message = String(result);
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
          }
        }
        if (this.props.afterSubmit) await this.props.afterSubmit();
      }
    }
  };
  renderUserModal = () => {
    let validationErrorDate = "validationErrorDates";
    // let content = "";
    if (this.state.ToDateError) {
      validationErrorDate = "validationErrorDate";
      // content = this.state.ToDateError;
    }
    const fromMinDate = new Date();
    fromMinDate.setDate(fromMinDate.getDate() - 7);
    console.log("this.state.SelectEventError ", this.state.SelectEventError);
    const { wingOption, memberOption } = this.state;
    return (
      <div>
        <Modal
          size="md"
          className="border-style rounded"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.status}
        >
          <Modal.Header>
            <div className="form-head width100 dflex jc-sb align-center">
              <div className="width100 dflex align-center">
                <img src={logo} alt="logo" />
                <h3 className="ml-2"> Meeting </h3>
              </div>
              <button
                className="popup-button closeText dflex"
                onClick={this.handleClose}
              >
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </button>
            </div>
          </Modal.Header>
          <div className="p-3">
            <Modal.Body>
              <form
                className="align-items-center event-form"
                onSubmit={this.onSubmitCreate}
              >
                <div className="row jc-sb mb-2">
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label
                        htmlFor="meetingTitle"
                        className="dflex align-center"
                      >
                        Meeting Title <span className="asterik">*</span>
                      </label>
                      {this.state.meetingTitleError ? (
                        <input
                          className="form-control validationError"
                          id="meetingTitle"
                          label="Year"
                          placeholder={this.state.meetingTitleError}
                          type="text"
                          value={this.state.meetingTitle}
                          onFocus={() =>
                            this.setState({ meetingTitleError: "" })
                          }
                          onChange={(e) =>
                            this.setState({
                              meetingTitle: e.target.value,
                              meetingTitleError: "",
                            })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="meetingTitle"
                          label="Year"
                          placeholder="Meeting Title"
                          type="text"
                          onFocus={() =>
                            this.setState({ meetingTitleError: "" })
                          }
                          value={this.state.meetingTitle}
                          onChange={(e) =>
                            this.setState({
                              meetingTitle: e.target.value,
                              meetingTitleError: "",
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding select">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="selectHost"
                      >
                        Hosted by <span className="asterik">*</span>
                      </label>
                      <MultiSelect
                        aria-label="Default select example"
                        labelledBy={this.state.SelectEventError || "Select the Host"}
                        placeholder={this.state.SelectEventError || "Select the Host"}
                        type="drop"
                        id="selectHost"
                        className={this.state.SelectEventError ? "validationError" : null}
                        options={memberOption}
                        onMenuToggle={() =>
                          this.setState({ SelectEventError: "" })
                        }
                        onChange={this.onSelectHost}
                        value={this.state.selectHost}
                      />
                    </div>
                  </div>
                </div>
                <div className="row jc-sb mb-2">
                  <div className="input-row mb-3">
                    <div>
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="fromDate"
                      >
                        From <span className="asterik">*</span>
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.fromDateError ? "validationError " + validationErrorDate : ""}`}
                        placeholder={this.state?.fromDateError || "dd-mm-yyyy --:-- --"}
                        className="w-100"
                        value={this.state?.fromDate ? new Date(this.state?.fromDate) : null}
                        onChange={({ value }) => this.setState({ fromDate: value, fromDateError: "" })}
                        onFocus={() => this.setState({ fromDateError: "" })}
                        // minDate={fromMinDate}
                        maxDate={this.state?.toDate ? new Date(this.state?.toDate) : null}
                        appendTo="self"
                        showTime
                        hourFormat="12"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div>
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="toDate"
                      >
                        To <span className="asterik">*</span>
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.ToDateError ? "validationError " + validationErrorDate : ""}`}
                        placeholder={this.state?.ToDateError || "dd-mm-yyyy --:-- --"}
                        className="w-100"
                        value={this.state?.toDate ? new Date(this.state?.toDate) : null}
                        onChange={({ value }) => this.setState({ toDate: value, ToDateError: "" })}
                        onFocus={() => this.setState({ ToDateError: "" })}
                        // minDate={this.state?.fromDate ? new Date(this.state?.fromDate) : fromMinDate}
                        minDate={this.state?.fromDate ? new Date(this.state?.fromDate) : null}
                        appendTo="self"
                        showTime
                        hourFormat="12"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="dflex align-center">
                        Meeting Number <span className="asterik">*</span>
                      </label>
                      <input
                        className={`form-control ${this.state.MeetingNumberError ? "validationError" : ""}`}
                        id="meetingNumber"
                        label="Meeting Number"
                        placeholder={this.state.MeetingNumberError || "e.g(202120)"}
                        type="tel"
                        value={this.state.MeetingNumber}
                        onFocus={() => this.setState({ MeetingNumberError: "" })}
                        onChange={({ target: { value: MeetingNumber } }) =>
                          this.setState({ MeetingNumber })
                        }
                        onKeyPress={(e) => {
                          if (isNaN(e.key) || e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                        maxLength="6"
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="align-center dflex">
                        City <span className="asterik">*</span>
                      </label>
                      {this.state.cityError ? (
                        <input
                          className="form-control validationError"
                          id="city"
                          label="City"
                          onFocus={() => this.setState({ cityError: "" })}
                          placeholder={this.state.cityError}
                          type="text"
                          value={this.state.city}
                          onChange={(e) =>
                            this.setState({ city: e.target.value })
                          }
                          maxLength="32"
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="city"
                          label="City"
                          placeholder="City"
                          type="text"
                          onFocus={() => this.setState({ cityError: "" })}
                          value={this.state.city}
                          onChange={(e) =>
                            this.setState({ city: e.target.value })
                          }
                          maxLength="32"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-2 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="dflex align-center">
                        Meeting Description <span className="asterik">*</span>
                      </label>
                      {this.state.descriptionError ? (
                        <textarea
                          className="form-control text-box mb-3 validationError"
                          id="eventDescription"
                          label="Meeting Description"
                          placeholder="Meeting Description"
                          type="textarea"
                          onFocus={() =>
                            this.setState({ descriptionError: "" })
                          }
                          style={{ height: "100px" }}
                          value={this.state.description}
                          onChange={(e) =>
                            this.setState({ description: e.target.value })
                          }
                        />
                      ) : (
                        <textarea
                          className="form-control text-box mb-3"
                          id="eventDescription"
                          label="Meeting Description"
                          placeholder="Meeting Description"
                          type="textarea"
                          onFocus={() =>
                            this.setState({ descriptionError: "" })
                          }
                          style={{ height: "100px" }}
                          value={this.state.description}
                          onChange={(e) =>
                            this.setState({ description: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row radio-section-main mb-3">
                    <div className="radio-section">
                      <label
                        htmlFor="floatingInput"
                        className="radio-head dflex align-center"
                      >
                        Select Meeting Type <span className="asterik">*</span>
                      </label>
                      <div className="form-padding radio-input mb-3 ">
                        <div className="physical">
                          <input
                            type="radio"
                            value="on_site"
                            id="on_site"
                            checked={this.state.meetingType === "on_site"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onMeetingTypeChange}
                          />
                          <label htmlFor="floatingInput1">
                            <span
                              style={
                                this.state.meetingTypeError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              On Site
                            </span>
                          </label>
                        </div>
                        <div className="virtual">
                          <input
                            type="radio"
                            id="virtual"
                            value="virtual"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.meetingType === "virtual"}
                            onChange={this.onMeetingTypeChange}
                          />
                          <label htmlFor="floatingInput2">
                            <span
                              style={
                                this.state.meetingTypeError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              Virtual
                            </span>
                          </label>
                        </div>
                        <div className="physical">
                          <input
                            type="radio"
                            value="hybrid"
                            id="hybrid"
                            checked={this.state.meetingType === "hybrid"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onMeetingTypeChange}
                          />
                          <label htmlFor="floatingInput1" className="mb-0">
                            <span
                              style={
                                this.state.meetingTypeError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              Hybrid
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start">
                      {/* {this.state.selectEventTypeErrorInput ? (<span className='small-font-size text-danger'> {this.state.selectEventTypeErrorInput}</span>) : ''} */}
                    </div>
                  </div>
                </div>

                <div className="row mb-2 width100">
                  <div className="mb-2 width100">
                    <div className="form-padding">
                      <label className="align-center dflex">
                        Venue <span className="asterik">*</span>
                      </label>
                      {this.state.venueError ? (
                        <input
                          className="form-control validationError"
                          id="venue"
                          placeholder={this.state.venueError}
                          onFocus={() => this.setState({ venueError: "" })}
                          type="text"
                          value={this.state.venue}
                          onChange={(e) =>
                            this.setState({ venue: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="venue"
                          placeholder="Enter Location/ Meeting Link"
                          onFocus={() => this.setState({ venueError: "" })}
                          type="text"
                          value={this.state.venue}
                          onChange={(e) =>
                            this.setState({ venue: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row upload-section mb-3">
                  <div className="width100">
                    <div className="form-floating mb-2 p-1 upload-doc-strip">
                      <div
                        className="upload-doc-strip mr-1"
                        style={{ textAlign: "right" }}
                      >
                        <h6>Add Member</h6>
                      </div>
                    </div>
                    <div className="upload-doc-div">
                      <div className="mb-2">
                        <div className="form-floating select mb-3">
                          <label className="selectIcon jc-fs"> Wings </label>
                          {this.state.selectWingError ? (
                            <MultiSelect
                              aria-label="Default select example"
                              labelledBy={this.state.selectWingError}
                              type="drop"
                              className="validationError"
                              placeholder={this.state.selectWingError}
                              value={this.state.selectWing}
                              onChange={this.onSelectWing}
                              // closeMenuOnSelect={true}
                              // components={animatedComponents}
                              // isMulti
                              options={wingOption}
                            />
                          ) : (
                            <MultiSelect
                              aria-label="Default select example"
                              labelledBy="Select the Wing"
                              type="drop"
                              value={this.state.selectWing}
                              onChange={this.onSelectWing}
                              options={wingOption}
                            />
                          )}
                        </div>

                        <div className="d-flex justify-content-start">
                          {this.state.selectWingError ? (
                            <span className="small-font-size text-danger">
                              {this.state.selectWingError}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="form-floating mb-3 select">
                          <label className="selectIcon jc-fs"> Members</label>
                          {this.state.selectMemberError ? (
                            <MultiSelect
                              aria-label="Default select example"
                              labelledBy={this.state.selectMemberError}
                              className="validationError"
                              placeholder={this.state.selectMemberError}
                              value={this.state.selectMember}
                              onChange={this.onSelectMember}
                              options={this.getMembersDropdown()}
                            />
                          ) : (
                            <MultiSelect
                              aria-label="Default select example"
                              labelledBy="Select the Members"
                              value={this.state.selectMember}
                              onChange={this.onSelectMember}
                              options={this.getMembersDropdown()}
                            />
                          )}
                        </div>
                      </div>
                      <div className="mb-5">
                        <label>Meeting Agenda </label>
                        <ReactQuill
                          value={this.state.WelcomeAddress}
                          onChange={this.handleChange}
                          modules={this.modules}
                          formats={this.formats}
                          placeholder="Comments"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {this.props.saveAccess ? <div className="cta-section">
                  <button
                    type="button"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta">
                    {this.props.editMeetingId
                      ? "Update meeting"
                      : "Create meeting"}
                  </button>
                </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  };

  render() {
    return <>{this.renderUserModal()}</>;
  }
}

export default MeetingForm;
