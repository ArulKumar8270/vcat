import React from "react";
import moment from "moment";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { MultiSelect } from "react-multi-select-component";
import Modal from "react-bootstrap/Modal";

// CSS  imports //
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "../../components/img/logo.png";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import {
  CheckDob,
  CheckMessage,
  CheckUserName,
  DropDownCheck,
  CheckMeetingNumber,
  CheckYear,
  CheckContinuousCode,
} from "../../common/Validation";
import User from "../../modals/User";

import { uploadFile } from "../../common/uploadFile";
import { uploadAgenda } from "../../common/uploadAgenda";
// Api file imports //
import {
  mom,
  momAutoPopulate,
  updateMom,
  wingsDropdown,
} from "../../libraries/momDashboard";
import Notifications from "../../common/Notifications";
import { getUsersDropdown } from "../../libraries/dashboard";
import { getUniqueArray } from "../../common/Common";
import { Calendar } from "primereact/calendar";

class MomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      eventName: "",
      personName: "",
      ToDate: "",
      MeetingNumber: "",
      meetingTypeError: "",
      eventTypeError: "",
      city: "",
      description: "",
      on_site: "",
      virtual: "",
      venue: "",
      topic: "",
      selectWing: [],
      selectMember: [],
      selectHost: "",
      selectEventId: "",
      meetingType: "",
      eventType: "",
      continuous: "",
      date_time: "",
      MembersPresent: [],
      Invocation: "",
      WelcomeAddress: "",
      year: "",
      SelectedEvent: [],
      SelectedWing: [],
      SelectedMember: [],
      SelectBot: [],
      BotId: "",
      LeaveOfAbsence: [],
      SelectedBot: [],
      type1: false,
      type2: false,
      // new
      wingOption: [],
      memberOption: [],
    };
    this.onMeetingTypeChange = this.onMeetingTypeChange.bind(this);
    this.onEventTypeChange = this.onEventTypeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    await this.setWingsDropdown();
    await this.setMemberDropdown();
  }

  async componentDidUpdate(prevProps) {
    const id = this.props.editMOM;
    const { wingOption, memberOption } = this.state;
    if (this.props.status !== prevProps.status && this.props.status && id) {
      this.setState({ status: this.props.status });
      const response = await momAutoPopulate(id);
      if (response && response.status === "success") {
        let result = response.result.moms;

        let WingResult = response.result.moms.members;
        let selectedMembers = [];
        if (WingResult && Object.keys(WingResult).length > 0) {
          const users = JSON.parse(WingResult);
          if (Array.isArray(users) && users.length > 0)
            selectedMembers = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
        }
        let WingsList = response.result.moms.wings;
        let selectedWings = [];
        if (WingsList && Object.keys(WingsList).length > 0) {
          const userWings = JSON.parse(WingsList);
          if (Array.isArray(userWings) && userWings.length > 0)
            selectedWings = wingOption?.filter(({ value: wing_id }) => userWings?.includes(wing_id));
        }

        let members_present = response.result.moms.members_present;
        let members_present_list = [];
        if (members_present && Object.keys(members_present).length > 0) {
          const users = JSON.parse(members_present);
          if (Array.isArray(users) && users.length > 0)
            members_present_list = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
        }

        // let leave_of_absence = response.result.moms.leave_of_absence;
        // let leave_of_absence_list = [];
        // if (leave_of_absence && Object.keys(leave_of_absence).length > 0) {
        //   const users = JSON.parse(leave_of_absence);
        //   if (Array.isArray(users) && users.length > 0)
        //   leave_of_absence_list = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
        // }

        let co_opted_bot = response.result.moms.co_opted_bot;
        let co_opted_bot_list = [];
        if (co_opted_bot && Object.keys(co_opted_bot).length > 0) {
          const users = JSON.parse(co_opted_bot);
          if (Array.isArray(users) && users.length > 0)
            co_opted_bot_list = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
        }
        this.setState({
          MemberNo: result?.icai_membership_no,
          year: result?.year,
          continuous: result?.continuous,
          MeetingNumber: result?.meeting_number,
          city: result?.city,
          ToDate: moment(result?.date_time).format("yyyy-MM-DDTHH:mm"),
          meetingType: result?.meeting_type,
          eventType: result?.event_type,
          venue: result?.venue,
          selectMember: selectedMembers,
          MembersPresent: members_present_list,
          selectWing: selectedWings,
          SelectBot: co_opted_bot_list,
          LeaveOfAbsence: [],
          Invocation: result?.invocation,
          WelcomeAddress: result?.welcome_address,
          description: result?.content,
          id,
        });
      }
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

  getMembersPresentDropdown = () => {
    const { memberOption, selectWing, selectMember } = this.state;
    const memberDropdownOption = [];
    if (Array.isArray(selectWing) && selectWing.length > 0) {
      selectWing.forEach(({ members }) => {
        if (Array.isArray(members) && members.length > 0) {
          memberOption?.filter(({ value: user_id }) => members?.includes(user_id)).forEach((mem) => {
            if (!memberDropdownOption.includes(mem)) memberDropdownOption.push(mem);
          });
        }
      });
    }
    if (Array.isArray(selectMember) && selectMember.length > 0) {
      selectMember?.forEach((member) => {
        if (!memberDropdownOption?.includes(member))
          memberDropdownOption?.push(member);
      });
    }
    return getUniqueArray(memberDropdownOption);
  }

  getMembersCoOptDropdown = () => {
    const { memberOption, selectWing, selectMember } = this.state;
    let memberDropdownOption = [...memberOption];
    if (Array.isArray(selectWing) && selectWing.length > 0) {
      selectWing?.forEach(({ members }) => {
        if (Array.isArray(members) && members.length > 0) {
          memberDropdownOption = memberDropdownOption?.filter(({ value: user_id }) => !members?.includes(user_id));
        }
      });
    }
    if (Array.isArray(selectMember) && selectMember.length > 0) {
      selectMember?.forEach((member) => {
        memberDropdownOption = memberDropdownOption?.filter((option) => option.value !== member.value);
      });
    }
    return getUniqueArray(memberDropdownOption);
  }

  handleClick = () => {
    this.setState({
      status: true,
      editMOM: "",
    });
  };

  handleChange = (value) => {
    this.setState({
      description: value,
    });
  };

  onMeetingTypeChange({ target: { value: meetingType } }) {
    this.setState({
      meetingType,
      meetingTypeError: ''
    });
  }

  onEventTypeChange({ target: { value: eventType } }) {
    this.setState({
      eventType,
      eventTypeError: ''
    });
  }

  onSelectMemberPresent = (e) => {
    this.setState({
      MembersPresent: e,
    });
  };
  onSelectBot = (e) => {
    this.setState({
      SelectBot: e,
    });
  };

  onSelectMember = (e) => {
    this.setState({
      selectMember: e,
    });
  };

  onSelectLeaveOfAbsence = (e) => {
    this.setState({
      LeaveOfAbsence: e,
    });
  };

  handleClose = () => {
    this.setState(
      {
        date_time: new Date(),
        eventName: "",
        personName: "",
        ToDate: "",
        MeetingNumber: "",
        city: "",
        description: "",
        meetingTypeError: "",
        eventTypeError: "",
        on_site: "",
        virtual: "",
        venue: "",
        topic: "",
        selectWing: [],
        selectMember: "",
        selectHost: "",
        selectEventId: "",
        meetingType: "",
        eventType: "",
        continuous: "",
        MembersPresent: [],
        Invocation: "",
        WelcomeAddress: "",
        year: "",
        SelectedEvent: [],
        SelectedWing: [],
        SelectedMember: [],
        SelectBot: "",
        BotId: "",
        LeaveOfAbsence: [],
        SelectedBot: [],
        InvocationError: "",
        yearError: "",
        continuousError: "",
        WelcomeAddressError: "",
        ToDateError: "",
        MeetingNumberError: "",
        cityError: "",
        descriptionError: "",
        venueError: "",
        SelectWingError: "",
        SelectMemberError: "",
        SelectEventError: "",
        LeaveOfAbsenceError: "",
        SelectBotError: "",
        topicError: "",
        fromDateError: "",
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
  checkEventType() {
    if (!this.state.eventType)
      this.setState({ eventTypeError: "Please select Event type" });
    return !!this.state.eventType;
  }
  validateTopic = () => {
    const topicError = CheckUserName(this.state.topic);
    if (topicError === 1) {
      this.setState({ topicError: "Field empty" });
      return false;
    } else return true;
  };

  validateYear = () => {
    const yearError = CheckYear(this.state.year);
    if (yearError === 1) {
      this.setState({ yearError: "Field empty" });
      return false;
    }
    return true;
  };

  validateContinuous = () => {
    const continuousError = CheckContinuousCode(this.state.continuous);
    if (continuousError === 1) {
      this.setState({ continuousError: "Field empty" });
      return false;
    }
    return true;
  };

  validateWelcomeAddress = () => {
    const WelcomeAddressError = CheckMessage(this.state.WelcomeAddress);
    if (WelcomeAddressError === 1) {
      this.setState({ WelcomeAddressError: "Field empty" });
      return false;
    }
    return true;
  };

  validateInvocation = () => {
    const InvocationError = !(this.state?.Invocation && typeof this.state?.Invocation === "string" && this.state?.Invocation?.length > 0);
    if (InvocationError) {
      this.setState({ InvocationError: "Field empty" });
      return false;
    }
    return true;
  };

  validateToDateError = () => {
    const ToDateError = CheckDob(this.state.ToDate);
    if (ToDateError === 1) {
      this.setState({ ToDateError: "Field empty" });
      return false;
    } else if (ToDateError === 2) {
      this.setState({ ToDateError: "Invalid date" });
      AppConfig.setMessage("Invalid date");
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

  validateSelectBotError = () => {
    const SelectBotError = DropDownCheck(this.state.SelectBot);
    if (SelectBotError === 1) {
      this.setState({ SelectBotError: "Field empty" });
      return false;
    } else return true;
  };

  validateLeaveOfAbsenceError = () => {
    const LeaveOfAbsenceError = DropDownCheck(this.state.LeaveOfAbsence);
    if (LeaveOfAbsenceError === 1) {
      this.setState({ LeaveOfAbsenceError: "Field empty" });
      return false;
    } else return true;
  };
  // Empty input validation
  ValidateAll = () => {
    const meetingTypeInput = this.checkMeetingType();
    const eventTypeInput = this.checkEventType();
    const ToDateInput = this.validateToDateError();
    // const fromDateInput = this.validateFromDataError();
    const MeetingNumberInput = this.validateMeetingNumber();
    const CityInput = this.validateCity();
    const venueInput = this.validateVenue();
    const ContinuousInput = this.validateContinuous();
    const YearInput = this.validateYear();
    // const WelcomeAddressInput = this.validateWelcomeAddress();
    const InvocationInput = this.validateInvocation();
    // const SelectBotInput = this.validateSelectBotError();
    // const LeaveOfAbsenceInput = this.validateLeaveOfAbsenceError();

    const result =
      meetingTypeInput &&
      eventTypeInput &&
      ToDateInput &&
      MeetingNumberInput &&
      // WelcomeAddressInput &&
      InvocationInput &&
      CityInput &&
      venueInput &&
      YearInput &&
      ContinuousInput;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  handleSelectWing = (e) => {
    this.setState({ selectWing: e });
  };
  // Handle file select

  // Select file
  selectUploadAgendaFile = (e) => {
    e.preventDefault();
    const agenda = e.target.files[0];
    uploadAgenda(agenda, this.callBackEventAgenda);
  };

  callBackEventAgenda = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ agenda: response.result.event_agenda });
    }
  };

  handleUploadAgendaFile = (e) => {
    e.preventDefault();
    const fileSelectorAgenda = document.getElementById("uploadAgendaFile");
    fileSelectorAgenda.click();
  };
  handleUploadImage = (e) => {
    e.preventDefault();
    const fileSelector = document.getElementById("eventImage");
    fileSelector.click();
  };

  // Select file selectUploadImage

  selectUploadImage = (e) => {
    e.preventDefault();
    const event_image = e.target.files[0];
    uploadFile(event_image, this.callBackEventImage);
  };

  callBackEventImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ eventImage: response.result.event_image });
    }
  };
  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props?.saveAccess) {
      const editMom = this.props.editMOM;
      if (this.props.password) {
        this.setState({ password: this.props.password });
      }
      const { selectWing, selectMember } = this.state;
      const selectedWings = [];
      for (let i in selectWing) {
        selectedWings.push(selectWing[i]["value"]);
      }
      const selectedMembers = [];
      for (let i in selectMember) {
        selectedMembers.push(selectMember[i]["value"]);
      }

      const MembersPresent = [];
      for (let i in selectMember) {
        MembersPresent.push(selectMember[i]["value"]);
      }
      const SelectBot = [];
      for (let i in selectMember) {
        SelectBot.push(selectMember[i]["value"]);
      }

      const LeaveOfAbsence = [];
      for (let i in selectMember) {
        LeaveOfAbsence.push(selectMember[i]["value"]);
      }

      const { user_id } = User;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const requestData = {
          year: this.state.year,
          continuous: this.state.continuous,
          meeting_number: this.state.MeetingNumber,
          city: this.state.city,
          // date_time: this.state.ToDate,
          date_time: this.state.ToDate ? moment(this.state.ToDate).format("YYYY-MM-DDTHH:mm") : null,
          meeting_type: this.state.meetingType,
          event_type: this.state.eventType,
          venue: this.state.venue,
          wings: selectedWings,
          members: selectedMembers,
          members_present: MembersPresent,
          co_opted_bot: SelectBot || [],
          // leave_of_absence: LeaveOfAbsence || [],
          leave_of_absence: [],
          invocation: this.state.Invocation,
          welcome_address: this.state.WelcomeAddress,
          content: this.state.description,
          events: "",
          user_id,
          status: true,
        };
        if (editMom) {
          requestData["user_id"] = User.user_id;
          const response = await updateMom(requestData, editMom);
          if (response && response.status === "success") {
            this.handleClose();
            AppConfig.setMessage("Mom updated successfully", false);
            Notifications.setmomformStatus(true);
          } else if (response.status === "error") {
            AppConfig.setMessage(response?.result);
          }
        } else {
          const response = await mom(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage(" Mom created successfully", false);
            Notifications.setmomformStatus(true);
            this.setState({ successVar: true });
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

  render = () => {
    const { wingOption } = this.state;
    let validationErrorToDate = "validationErrorDates";
    if (this.state.ToDateError) {
      validationErrorToDate = "validationErrorDate";
    }
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
                <h3 className="ml-2"> MOM </h3>
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
                <div className="row mb-2 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label htmlFor="year" className="dflex align-center">
                        Year <span className="asterik">*</span>
                      </label>
                      <input
                        className={`form-control ${this.state.yearError ? "validationError" : ""
                          }`}
                        id="year"
                        label="Year"
                        placeholder={
                          this.state.yearError
                            ? this.state.yearError
                            : "e.g(2021-2022)"
                        }
                        type="year"
                        value={this.state.year}
                        onFocus={() => this.setState({ yearError: '' })}
                        onChange={({ target: { value: year } }) =>
                          this.setState({ year })
                        }
                        onKeyPress={(e) => {
                          if (e.key === "-") {
                            if ((this.state.year || "").length !== 4)
                              e.preventDefault();
                            if (Number(this.state.year || "") === 0)
                              e.preventDefault();
                            if ((this.state.year || "").includes("-"))
                              e.preventDefault();
                          } else if (isNaN(e.key) || e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                        maxLength="9"
                        tabIndex={1}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Continuous Meeting <span className="asterik">*</span>
                      </label>
                      <input
                        className={`form-control ${this.state.continuousError ? "validationError" : ""
                          }`}
                        id="continuous"
                        label="Continuous Meeting "
                        placeholder={
                          this.state.continuousError
                            ? this.state.continuousError
                            : "e.g(202)"
                        }
                        type="tel"
                        value={this.state.continuous}
                        onFocus={() => this.setState({ continuousError: '' })}
                        onChange={({ target: { value: continuous } }) =>
                          this.setState({ continuous })
                        }
                        onKeyPress={(e) => {
                          if (isNaN(e.key) || e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                        maxLength="3"
                        tabIndex={2}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Meeting Number <span className="asterik">*</span>
                      </label>
                      <input
                        className={`form-control ${this.state.MeetingNumberError ? "validationError" : ""
                          }`}
                        id="meetingNumber"
                        label="Meeting Number"
                        placeholder={
                          this.state.MeetingNumberError
                            ? this.state.MeetingNumberError
                            : "e.g(202120)"
                        }
                        type="tel"
                        onFocus={() => this.setState({ MeetingNumberError: '' })}
                        value={this.state.MeetingNumber}
                        onChange={({ target: { value: MeetingNumber } }) =>
                          this.setState({ MeetingNumber })
                        }
                        onKeyPress={(e) => {
                          if (isNaN(e.key) || e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                        maxLength="6"
                        tabIndex={3}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        City <span className="asterik">*</span>
                      </label>
                      <input
                        className={`form-control ${this.state.cityError ? "validationError" : ""
                          }`}
                        id="city"
                        label="City"
                        placeholder={
                          this.state.cityError ? this.state.cityError : "City"
                        }
                        type="text"
                        value={this.state.city}
                        onFocus={() => this.setState({ cityError: '' })}
                        onChange={({ target: { value: city } }) =>
                          this.setState({ city })
                        }
                        tabIndex={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2 jc-sb">
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="toDate"
                      >
                        Date<span className="asterik">*</span>
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.ToDateError ? "validationError " + String(validationErrorToDate) : ""}`}
                        placeholder={this.state?.ToDateError || "dd-mm-yyyy --:-- --"}
                        className="w-100"
                        value={this.state?.ToDate ? new Date(this.state?.ToDate) : null}
                        onChange={({ value }) => this.setState({ ToDate: value })}
                        onFocus={() => this.setState({ ToDateError: "" })}
                        appendTo="self"
                        showTime
                        hourFormat="12"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        tabIndex={5}
                      />
                      {/* <input
                        className={`form-control ${this.state.ToDateError
                          ? "validationError " + String(validationErrorToDate)
                          : ""
                          }`}
                        id="toDate"
                        // onBlur="if(this.value==''){this.type='text'}"
                        placeholder={
                          this.state.ToDateError ? this.state.ToDateError : "dd"
                        }
                        type="datetime-local"
                        // onFocus="(this.type='date')"
                        value={this.state.ToDate}
                        onFocus={() => this.setState({ ToDateError: '' })}
                        onChange={({ target: { value: ToDate } }) =>
                          this.setState({ ToDate })
                        }
                        tabIndex={5}
                      /> */}
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
                            name="Meeting Type"
                            value="on_site"
                            id="on_site"
                            checked={this.state.meetingType === "on_site"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onMeetingTypeChange}
                          // tabIndex={6}
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
                            name="Meeting Type"
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
                            name="Meeting Type"
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
                      <div className="d-flex justify-content-start">
                      </div>
                    </div>
                    <div className="radio-section event-type">
                      <label
                        htmlFor="floatingInput"
                        className="radio-head dflex align-center"
                      >
                        Select Event Type <span className="asterik">*</span>
                      </label>
                      <div className="form-padding radio-input  ">
                        <div className="internal">
                          <input
                            type="radio"
                            name="Event Type"
                            value="internal"
                            id="internal"
                            checked={this.state.eventType === "internal"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onEventTypeChange}
                          />
                          <label htmlFor="floatingInput3">
                            <span
                              style={
                                this.state.eventTypeError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              Internal
                            </span>
                          </label>
                        </div>
                        <div className="virtual">
                          <input
                            type="radio"
                            name="Event Type"
                            id="external"
                            value="external"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.eventType === "external"}
                            onChange={this.onEventTypeChange}
                          />
                          <label htmlFor="floatingInput4">
                            <span
                              style={
                                this.state.eventTypeError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              External
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-start">
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center">
                      Venue <span className="asterik">*</span>
                    </label>
                    <input
                      className={`form-control ${this.state.venueError ? "validationError" : ""}`}
                      id="venue"
                      placeholder={this.state.venueError || "Enter Location/ Meeting Link"}
                      type="text"
                      value={this.state.venue}
                      onFocus={() => this.setState({ venueError: '' })}
                      onChange={({ target: { value: venue } }) =>
                        this.setState({ venue })
                      }
                    />
                  </div>
                </div>
                <div className="upload-section mb-3">
                  <div className="form-floating mb-2 upload-doc-strip">
                    <div className="form-control upload-doc-strip mb-4">
                      <h5>
                        Add Member
                        <IoAddCircleOutline />
                      </h5>
                    </div>
                  </div>
                  <div className="upload-doc-div">
                    <div className="mb-2">
                      <div className="form-floating select mb-3">
                        <label className="selectIcon jc-fs"> Wings </label>
                        <MultiSelect
                          aria-label="Default select example"
                          labelledBy="Select the Wing"
                          value={this.state.selectWing}
                          onChange={this.handleSelectWing}
                          options={wingOption}
                        />
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
                        <label className="selectIcon jc-fs">
                          Members
                        </label>
                        <MultiSelect
                          aria-label="Default select example"
                          labelledBy="Select the Members"
                          value={this.state.selectMember}
                          onChange={this.onSelectMember}
                          // options={memberOption}
                          options={this.getMembersDropdown()}
                        />
                      </div>

                      <div className="d-flex justify-content-start">
                        {this.state.selectMemberError ? (
                          <span className="small-font-size text-danger">
                            {this.state.selectMemberError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="upload-section mb-3">
                  <div className="form-floating mb-2 upload-doc-strip">
                    <div className="form-control upload-doc-strip mb-4">
                      <h5>
                        Add Member
                        <IoAddCircleOutline />
                      </h5>
                    </div>
                  </div>
                  <div className="upload-doc-div jc-fs">
                    <div className="mb-2">
                      <label>Members Present</label>
                      <div className="form-floating mb-4 select">
                        <label className="selectIcon"></label>
                        <MultiSelect
                          aria-label="Default select example"
                          placeholder="Select the Members Present"
                          value={this.state.MembersPresent}
                          onChange={this.onSelectMemberPresent}
                          // options={memberOption}
                          options={this.getMembersPresentDropdown()}
                        />
                      </div>
                      <div className="d-flex justify-content-start">
                        {this.state.MembersPresentError ? (
                          <span className="small-font-size text-danger">
                            {this.state.MembersPresentError}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-2">
                      <label>Co-opted Bot</label>
                      <div className="form-floating mb-4 select">
                        <label className="selectIcon"> </label>
                        <MultiSelect
                          aria-label="Default select example"
                          placeholder={this.state.SelectBotError}
                          value={this.state.SelectBot}
                          onChange={this.onSelectBot}
                          // options={memberOption}
                          options={this.getMembersCoOptDropdown()}
                        />
                      </div>
                    </div>
                    {/* <div className="mb-2">
                      <label>Leave of Absence</label>
                      <div className="form-floating mb-4 select">
                        <label className="selectIcon"></label>
                        <MultiSelect
                          aria-label="Default select example"
                          placeholder={this.state.LeaveOfAbsenceError}
                          value={this.state.LeaveOfAbsence}
                          onChange={this.onSelectLeaveOfAbsence}
                          options={memberOption}
                        />
                      </div>
                    </div> */}
                    <div className="mb-2">
                      <div className="form-padding mb-3">
                        <label className="dflex align-center">
                          Invocation <span className="asterik">*</span>
                        </label>
                        <input
                          className={`form-control ${this.state.InvocationError ? "validationError" : ""}`}
                          id="Invocation"
                          placeholder={this.state.InvocationError || "Enter the Details"}
                          type="text"
                          value={this.state.Invocation}
                          onFocus={() => this.setState({ InvocationError: '' })}
                          onChange={({ target: { value: Invocation } }) =>
                            this.setState({ Invocation })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="form-padding mb-3">
                        <label className="dflex align-center">
                          Welcome address by the President
                        </label>
                        <ReactQuill
                          value={this.state.WelcomeAddress || ""}
                          onChange={(WelcomeAddress) =>
                            this.setState({ WelcomeAddress })
                          }
                          modules={this.modules}
                          formats={this.formats}
                          id="WelcomeAddress"
                          placeholder="Enter the Details"
                        />
                        {/* <textarea
                          className="form-control text-box mb-3"
                          id="WelcomeAddress"
                          placeholder="Enter the Details"
                          type="textarea"
                          style={{ height: "100px" }}
                          value={this.state.WelcomeAddress}
                          onChange={(e) =>
                            this.setState({ WelcomeAddress: e.target.value })
                          }
                        /> */}
                      </div>
                    </div>
                    <div className="mb-2">
                      <label>Meeting Brief</label>
                      <ReactQuill
                        value={this.state.description}
                        onChange={description => this.setState({ description })}
                        modules={this.modules}
                        formats={this.formats}
                        placeholder="Comments"
                      />
                    </div>
                  </div>
                </div>
                {this.props?.saveAccess ?
                  <div className="cta-section">
                    <button
                      type="button"
                      className="btn  event-cta-trans"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn  event-cta">
                      {this.props.editMOM ? "Update MOM " : "Create MOM"}
                    </button>
                  </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  };
}

export default MomForm;
