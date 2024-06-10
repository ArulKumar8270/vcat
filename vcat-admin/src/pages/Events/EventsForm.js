import React, { useState, useRef } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsTrashFill } from "react-icons/bs";
import { GrDocumentText, GrDocumentPdf } from "react-icons/gr";
import { BsUpload } from "react-icons/bs";
import moment from "moment";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import { MultiSelect } from "react-multi-select-component";

// CSS  imports //
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "../../components/img/logo.png";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import {
  CheckDob,
  CheckUserName,
  DropDownCheck,
  CheckMeetingNumber,
} from "../../common/Validation";
import { uploadFile } from "../../common/uploadFile";
import { uploadAgenda } from "../../common/uploadAgenda";
import User from "../../modals/User";

// Api file imports //
import {
  event,
  EventAutoPopulate,
  EventUpdate,
  eventFormDropdown,
} from "../../libraries/event";
import Notifications from "../../common/Notifications";
import { Chips } from 'primereact/chips';
import { Checkbox } from 'primereact/checkbox';
import { Button } from "primereact/button";
import { MdDelete, MdEdit } from "react-icons/md";
import { uploadMedia } from "../../common/uploadFile";
import ConfirmModal from "../../components/ConfirmModal";
import { wingsDropdown } from "../../libraries/momDashboard";
import { getUsersDropdown } from "../../libraries/dashboard";
import { getUniqueArray } from "../../common/Common";
import { Calendar } from "primereact/calendar";

const DEFAULT_EVENT_IMAGE_URL = "https://vcat.co.in/staging/vcat-api/public/storage/document/1647946626.png"
class EventsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      personName: "",
      FromDate: "",
      ToDate: "",
      MeetingNumber: "",
      city: "",
      description: "",
      physical: "",
      virtual: "",
      venue: "",
      eventTag: [],
      topic: "",
      selectWing: [],
      selectMember: [],
      selectAgenda: "",
      // selectHost: [],
      meetingType: "",
      eventType: "",
      WingList: [],
      UserList: [],
      eventImage: DEFAULT_EVENT_IMAGE_URL,
      SelectedWing: [],
      SelectedMember: [],
      SelectedHost: [],
      agenda: "",
      // hostname: [],
      hostname: "",
      type1: false,
      type2: false,
      speakers: [],
      yetToBeDecided: false,
      eventFor: null,
      eventForError: "",
      meetingTypeError: "",
      // new
      wingOption: [],
      memberOption: [],
    };
    this.onMeetingTypeChange = this.onMeetingTypeChange.bind(this);
    this.onEventTypeChange = this.onEventTypeChange.bind(this);
    this.onEventForChange = this.onEventForChange.bind(this);
  }

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    Notifications.setDocTypeError(0);
    Notifications.setDocType("");
    Notifications.setMediaSizeImg("");
    Notifications.setMediaSizeDoc("");
    const response = await eventFormDropdown();
    const WingList = [];
    const UserList = [];
    const HostList = [];
    if (response && response.status === "success") {
      const result = response.result;
      const users_dropdown = result.users_dropdown;
      const wings_dropdown = result.wings_dropdown;
      const hostedByDropdown = result.hostedby_dropdown;
      for (let i in users_dropdown) {
        let UserId = {
          value: users_dropdown[i].id,
          label: users_dropdown[i].name,
        };
        UserList.push(UserId);
      }
      for (let i in wings_dropdown) {
        let WingId = {
          value: wings_dropdown[i].id,
          label: wings_dropdown[i].title,
        };
        WingList.push(WingId);
      }

      for (let i in hostedByDropdown) {
        let HostId = {
          value: hostedByDropdown[i].id,
          label: hostedByDropdown[i].name,
        };
        HostList.push(HostId);
      }
    }
    // call API
    this.setState({
      UserList,
      WingList,
      HostList,
    });
    await this.setWingsDropdown();
    await this.setMemberDropdown();
  }

  async componentDidUpdate(prevProps) {
    const id = this.props.editEventId;
    if (this.props.status !== prevProps.status && id && this.props.status) {
      this.setState({ status: this.props.status });
      if (id) {
        const response = await EventAutoPopulate(id);
        if (response) {
          const { status, result } = response;
          if (status === 'success' && result) {
            const { events } = result;
            if (events) {
              const { memberOption: UserList, wingOption: WingList } = this.state;
              const selectMember = [];
              const selectWing = [];
              // const hostname = [];
              if (UserList) {
                const eventMembers = events?.members && typeof events?.members === "string" && events?.members?.includes("[") && events?.members?.includes("]") ? JSON.parse(events?.members) : [];
                // const hostMembers = events?.hosted_by && typeof events?.hosted_by === "string" && events?.hosted_by?.includes("[") && events?.hosted_by?.includes("]") ? JSON.parse(events?.hosted_by) : [];
                UserList?.forEach((member) => {
                  if (eventMembers && Array.isArray(eventMembers) && eventMembers.length > 0)
                    if (eventMembers?.includes(member?.value))
                      selectMember.push(member);
                  // if (hostMembers && Array.isArray(hostMembers) && hostMembers.length > 0)
                  //   if (hostMembers?.includes(member?.value))
                  //     hostname.push(member);
                });
              }
              if (WingList) {
                const wingMembers = events?.wings && typeof events?.wings === "string" && events?.wings?.includes("[") && events?.wings?.includes("]") ? JSON.parse(events?.wings) : [];
                WingList?.forEach((member) => {
                  if (wingMembers && Array.isArray(wingMembers) && wingMembers.length > 0)
                    if (wingMembers?.includes(member?.value))
                      selectWing.push(member);
                });
              }
              this.setState({
                eventName: events?.name,
                // hostname,
                hostname: events?.hosted_by,
                MeetingNumber: events?.code,
                description: events?.description,
                meetingType: events?.meeting_type,
                eventType: events?.event_type,
                agenda: events?.agenda,
                eventImage: events?.image || DEFAULT_EVENT_IMAGE_URL,
                topic: events?.topic,
                venue: events?.venue,
                eventTag: events?.event_tags ? JSON.parse(events?.event_tags) : [],
                city: events?.city,
                selectWing,
                selectMember,
                FromDate: events?.from_date ? moment(events?.from_date).format("yyyy-MM-DDTHH:mm") : events?.from_date,
                ToDate: events?.to_date ? moment(events?.to_date).format("yyyy-MM-DDTHH:mm") : events?.to_date,
                speakers: [],
                yetToBeDecided: String(events?.yet_to_be_decided) === "1",
                eventFor: events?.event_for,
              });
            }
          }
        }
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

  onMeetingTypeChange({ target: { value: meetingType } }) {
    this.setState({
      meetingType,
      meetingTypeError: ""
    });
  }

  onEventTypeChange({ target: { value: eventType } }) {
    this.setState({
      eventType,
      eventTypeError: "",
    });
  }

  onEventForChange({ target: { value: eventFor } }) {
    this.setState({
      eventFor,
      eventForError: "",
    });
  }

  onSelectWing = (e) => {
    this.setState({
      selectWing: e,
    });
  };

  onSelectMember = (e) => {
    this.setState({
      selectMember: e,
    });
  };

  renderThumbnailImage = () => {
    return this.state.eventImage ? (
      <div className="col-md-12">
        <div
          className="d-flex my-3"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <>
            <div className="col-md-3">
              <div className="thumbnail-image">
                <img
                  src={this.state.eventImage}
                  alt="project"
                  style={{
                    width: "50px",
                    height: "auto",
                    borderRadius: "unset",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <BsTrashFill
                className="theme-font-color big-font-size m-2 pointer"
                onClick={() => this.setState({ eventImage: "" })}
              />
            </div>
          </>
        </div>
      </div>
    ) : null;
  };

  renderFileType() {
    const { agenda } = this.state;
    return agenda.split(".").pop() === "pdf" ? (
      <div className="col-md-10 ">
        <div className="thumbnail-image">
          <GrDocumentPdf
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        </div>
      </div>
    ) : (
      <div className="col-md-10 ">
        <div className="thumbnail-image">
          <GrDocumentText
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        </div>
      </div>
    );
  }

  renderThumbnailFile = () => {
    return this.state.agenda ? (
      <div className="col-md-12">
        <div
          className="d-flex my-3"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <>
            <div className="col-md-3 ">
              <div>
                <div className="col-md-12">
                  <div className="thumbnail-image">
                    {this.renderFileType()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <BsTrashFill
                className="theme-font-color big-font-size m-2 pointer"
                onClick={() => this.setState({ agenda: "" })}
              />
            </div>
          </>
        </div>
      </div>
    ) : null;
  };

  handleClose = () => {
    Notifications.setDocType("");
    Notifications.setDocTypeError(0);
    Notifications.setMediaSizeImg("");
    Notifications.setMediaSizeDoc("");
    this.setState(
      {
        personName: "",
        FromDate: "",
        ToDate: "",
        eventName: "",
        // selectHost: [],
        MeetingNumber: "",
        city: "",
        description: "",
        meetingType: "",
        meetingTypeError: "",
        eventType: "",
        eventTypeError: "",
        eventFor: null,
        eventForError: "",
        venue: "",
        eventTag: [],
        topic: "",
        // hostname: [],
        hostname: "",
        selectWing: [],
        selectMember: [],
        agenda: "",
        eventImage: DEFAULT_EVENT_IMAGE_URL,
        eventNameError: "",
        hostnameError: "",
        FromDateError: "",
        ToDateError: "",
        MeetingNumberError: "",
        cityError: "",
        descriptionError: "",
        venueError: "",
        eventTagError: "",
        SelectWingError: "",
        SelectMemberError: "",
        imageError: "",
        speakers: [],

        yetToBeDecided: false,
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  validateTopic = () => {
    const topicError = CheckUserName(this.state.topic);
    if (topicError === 1) {
      this.setState({ topicError: "Field empty" });
      return false;
    } else return true;
  };

  validateEventName = () => {
    const eventNameError = CheckUserName(this.state.eventName);
    if (eventNameError === 1) {
      this.setState({ eventNameError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectHost = () => {
    // const hostnameError = DropDownCheck(this.state.hostname);
    // if (hostnameError === 1) {
    //   this.setState({ hostnameError: "Field empty" });
    //   return false;
    // } else return true;
    const check = this.state.hostname?.length === 0;
    let hostnameError = "Field empty";
    if (!check) hostnameError = "";
    this.setState({ hostnameError });
    return !check;
  };

  validateFromDateError = () => {
    const FromDateError = CheckDob(this.state.FromDate);
    if (FromDateError === 1) {
      this.setState({ FromDateError: "Field empty" });
      return false;
    } else return true;
  };

  validateToDateError = () => {
    const ToDateError = CheckDob(this.state.ToDate);
    if (ToDateError === 1) {
      this.setState({ ToDateError: "Field empty" });
      return false;
    } else return true;
  };

  validateMeetingNumber = () => {
    const MeetingNumberError = CheckMeetingNumber(this.state.MeetingNumber);
    if (MeetingNumberError === 1) {
      this.setState({ MeetingNumberError: "Field empty" });
      return false;
    }
    return true;
  };

  validateCity = () => {
    const cityError = CheckUserName(this.state.city);
    if (cityError === 1) {
      this.setState({ cityError: "Field empty" });
      return false;
    } else return true;
  };

  validateDescription = () => {
    const descriptionError = CheckUserName(this.state.description);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  validateImage = () => {
    const imageError = CheckUserName(this.state.eventImage);
    if (imageError === 1) {
      this.setState({ imageError: "Image required" });
      return false;
    } else return true;
  };

  validateVenue = () => {
    const venueError = CheckUserName(this.state.venue);
    if (venueError === 1) {
      this.setState({ venueError: "Field empty" });
      return false;
    } else return true;
  };

  validateEventTag = () => {
    const eventTagError = this.state?.eventTag && Array.isArray(this.state?.eventTag) && this.state?.eventTag.length > 0 ? null : 1;
    if (eventTagError === 1) {
      this.setState({ eventTagError: "Field empty" });
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

  // Empty input validation
  ValidateAll = () => {
    if (this.state?.yetToBeDecided) {
      const result = this.validateEventName();
      if (!result)
        AppConfig.showValidationError();
      return result;
    }
    const meetingTypeInput = this.checkMeetingType();
    const eventTypeInput = this.checkEventType();
    const eventNameInput = this.validateEventName();
    const selectHostInput = this.validateSelectHost();
    const FromDateInput = this.validateFromDateError();
    const ToDateInput = this.validateToDateError();
    const MeetingNumberInput = this.validateMeetingNumber();
    const CityInput = this.validateCity();
    const descriptionInput = this.validateDescription();
    const venueInput = this.validateVenue();
    // const imgInput = this.validateImage();
    const eventTagInput = this.validateEventTag();
    const eventForInput = this.checkEventFor();

    const result =
      meetingTypeInput &&
      eventTypeInput &&
      eventNameInput &&
      FromDateInput &&
      ToDateInput &&
      MeetingNumberInput &&
      descriptionInput &&
      CityInput &&
      venueInput &&
      selectHostInput &&
      eventTagInput &&
      eventForInput;
    if (!result)
      AppConfig.showValidationError();
    return result;
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

  checkEventFor() {
    if (!this.state.eventFor)
      this.setState({ eventForError: "Please select Event for" });
    return !!this.state.eventFor;
  }

  // on submit sign in function
  onSubmitCreate = async (e) => {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }

    // const id = User.user_id;
    const editId = this.props.editEventId;
    e.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const {
        selectWing,
        selectMember,
        // selectHost, 
        hostname
      } = this.state;
      const selectedWings = [];
      for (let i in selectWing) {
        selectedWings.push(selectWing[i]["value"]);
      }
      const selectedMembers = [];
      for (let i in selectMember) {
        selectedMembers.push(selectMember[i]["value"]);
      }
      // const selectedHosts = [];
      // for (let i in hostname) {
      //   selectedHosts.push(hostname[i]["value"]);
      // }
      const requestData = {
        name: this.state.eventName,
        hosted_by: hostname,
        from_date: this.state?.FromDate ? moment(this.state?.FromDate).format("YYYY-MM-DDTHH:mm") : null,
        to_date: this.state?.ToDate ? moment(this.state?.ToDate).format("YYYY-MM-DDTHH:mm") : null,
        code: this.state?.MeetingNumber ? this.state?.MeetingNumber : null,
        city: this.state?.city ? this.state?.city : null,
        description: this.state?.description ? this.state?.description : null,
        meeting_type: this.state?.meetingType ? this.state?.meetingType : null,
        venue: this.state?.venue ? this.state?.venue : null,
        event_tags: this.state?.eventTag ? this.state?.eventTag : null,
        wings: selectedWings,
        members: selectedMembers,
        event_type: this.state?.eventType ? this.state?.eventType : null,
        filePath: this.state?.agenda ? this.state?.agenda : null,
        topic: this.state?.topic ? this.state?.topic : null,
        image: (this.state.eventImage !== undefined && this.state.eventImage !== null && this.state.eventImage.length > 0) ? this.state.eventImage : DEFAULT_EVENT_IMAGE_URL,
        user_id: User.user_id,
        agenda: this.state?.agenda ? this.state?.agenda : null,
        speakers: this.state.speakers ? JSON.stringify(this.state.speakers) : "[]",
        yet_to_be_decided: !!this.state.yetToBeDecided,
        event_for: this.state?.eventFor ? this.state?.eventFor : null,
      };
      if (editId) {
        requestData["user_id"] = User.user_id;
        const id = this.props.editEventId;
        const response = await EventUpdate(requestData, id);
        if (response && response.status === "success") {
          this.handleClose();
          AppConfig.setMessage("Event updated successfully", false);
        } else if (response.status === "error") {
          this.handleClose();
          AppConfig.setMessage(response?.result);
        }
      } else {
        const response = await event(requestData);
        if (response && response.status === "success") {
          this.handleClose();
          User.setRefresh(true);
          AppConfig.setMessage("Event Created successfully", false);
        } else if (response.status === "error" || response.status === "0") {
          let message = "";
          if ("result" in response) {
            message = response.result.error[0];
          } else {
            message = Object.keys(response.error)[0];
          }
          AppConfig.setMessage(message);
        }
      }
      if (this.props?.afterSubmit)
        await this.props.afterSubmit();
    }
    return false;
  };

  selectUploadAgendaFile = (e) => {
    e.preventDefault();
    const agenda = e.target.files[0];
    const mediaSize = e.target.files[0].size;
    Notifications.setMediaSizeDoc(mediaSize);
    uploadAgenda(agenda, this.callBackEventAgenda);
  };

  callBackEventAgenda = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ agenda: response.result.url });
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

  selectUploadImage = (e) => {
    e.preventDefault();
    const event_image = e.target.files[0];
    const mediaSize = e.target.files[0].size;
    Notifications.setMediaSizeImg(mediaSize);
    uploadFile(event_image, this.callBackEventImage);
  };

  callBackEventImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ eventImage: response.result.url });
    }
  };

  render() {
    const { wingOption } = this.state;
    let requiredMark = <span className="asterik">*</span>;
    if (this.state?.yetToBeDecided)
      requiredMark = null;
    const fromMinDate = new Date();
    fromMinDate.setDate(fromMinDate.getDate() - 7);
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
                {this.props.editEventId ? (
                  <h3> Update Event</h3>
                ) : (
                  <h3> Create Event</h3>
                )}
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
                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Event Name <span className="asterik">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${this.state.eventNameError ? 'validationError' : ''}`}
                        id="eventName"
                        placeholder={this.state.eventNameError || "Enter the Event Name"}
                        value={this.state.eventName}
                        onChange={(e) =>
                          this.setState({
                            eventName: e.target.value,
                            eventNameError: "",
                          })
                        }
                        onFocus={() => {
                          this.setState({ eventNameError: "" });
                        }}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3 d-flex align-items-center">
                    <div className="field-checkbox d-flex align-items-center mt-1">
                      <Checkbox
                        inputId="binary"
                        checked={this.state?.yetToBeDecided}
                        onChange={(e) => this.setState({
                          yetToBeDecided: e.checked,
                          eventNameError: "",
                          hostnameError: "",
                          FromDateError: "",
                          ToDateError: "",
                          MeetingNumberError: "",
                          cityError: "",
                          descriptionError: "",
                          venueError: "",
                          eventTagError: "",
                          SelectWingError: "",
                          SelectMemberError: "",
                          imageError: "",
                          meetingTypeError: "",
                          eventTypeError: "",
                          eventForError: "",
                        })} />
                      <label htmlFor="binary" className="ml-2">Yet to be decided</label>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="input-row mb-3 w-100">
                    <div className="form-padding select mb-3">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="hostName"
                      >
                        Hosted by {requiredMark}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${this.state.hostnameError ? 'validationError' : ''}`}
                        id="hostname"
                        placeholder={this.state.hostnameError || "Enter Hosted by"}
                        value={this.state.hostname}
                        onChange={(e) =>
                          this.setState({
                            hostname: e.target.value,
                            hostnameError: "",
                          })
                        }
                        onFocus={() => {
                          this.setState({ hostnameError: "" });
                        }}
                      />
                      {/* {this.state.hostnameError ? (
                        <MultiSelect
                          aria-label="Default select example"
                          labelledBy={this.state.hostnameError}
                          className="validationError"
                          placeholder={this.state.hostnameError}
                          value={this.state.hostname}
                          onMenuToggle={() => this.setState({ hostnameError: "" })}
                          onChange={(e) => this.setState({ hostname: e })}
                          options={memberOption}
                        />
                      ) : (
                        <MultiSelect
                          aria-label="Default select example"
                          labelledBy="Select the Members"
                          value={this.state.hostname}
                          onMenuToggle={() => this.setState({ hostnameError: "" })}
                          onChange={(e) => this.setState({ hostname: e })}
                          options={memberOption}
                        />
                      )} */}
                    </div>
                  </div>
                </div>
                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="fromDate"
                      >
                        From {requiredMark}
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.FromDateError ? "validationError" : ""}`}
                        placeholder={this.state?.FromDateError || "dd-mm-yyyy --:-- --"}
                        className="w-100"
                        value={this.state?.FromDate ? new Date(this.state?.FromDate) : null}
                        onChange={({ value }) => this.setState({ FromDate: value, FromDateError: "" })}
                        onFocus={() => this.setState({ FromDateError: "" })}
                        // minDate={fromMinDate}
                        maxDate={this.state?.ToDate ? new Date(this.state?.ToDate) : null}
                        appendTo="self"
                        showTime
                        hourFormat="12"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                      {/* {this.state.FromDateError ? (
                        <input
                          className="form-control validationError"
                          id="fromDate"
                          label="From"
                          placeholder="Date & Time"
                          type="datetime-local"
                          onFocus={() => {
                            this.setState({ FromDateError: "" });
                          }}
                          value={this.state.FromDate}
                          onChange={(e) =>
                            this.setState({ FromDate: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="fromDate"
                          label="From"
                          placeholder="Date & Time"
                          type="datetime-local"
                          value={this.state.FromDate}
                          onFocus={() => {
                            this.setState({ FromDateError: "" });
                          }}
                          onChange={(e) =>
                            this.setState({ FromDate: e.target.value })
                          }
                        />
                      )} */}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="toDate"
                      >
                        To {requiredMark}
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.ToDateError ? "validationError " : ""}`}
                        placeholder={this.state?.ToDateError || "dd-mm-yyyy --:-- --"}
                        className="w-100"
                        value={this.state?.ToDate ? new Date(this.state?.ToDate) : null}
                        onChange={({ value }) => this.setState({ ToDate: value, ToDateError: "" })}
                        onFocus={() => this.setState({ ToDateError: "" })}
                        // minDate={this.state?.FromDate ? new Date(this.state?.FromDate) : fromMinDate}
                        minDate={this.state?.FromDate ? new Date(this.state?.FromDate) : null}
                        appendTo="self"
                        showTime
                        hourFormat="12"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                      {/* {this.state.ToDateError ? (
                        <input
                          className="form-control validationError"
                          id="toDate"
                          // onblur="if(this.value==''){this.type='text'}"
                          placeholder="Date & Time"
                          type="datetime-local"
                          value={this.state.ToDate}
                          onFocus={() => {
                            this.setState({ ToDateError: "" });
                          }}
                          onChange={(e) =>
                            this.setState({ ToDate: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="toDate"
                          // onblur="if(this.value==''){this.type='text'}"
                          placeholder="Date & Time"
                          type="datetime-local"
                          value={this.state.ToDate}
                          onFocus={() => {
                            this.setState({ ToDateError: "" });
                          }}
                          onChange={(e) =>
                            this.setState({ ToDate: e.target.value })
                          }
                        />
                      )} */}
                    </div>
                  </div>
                </div>
                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="dflex align-center">
                        Meeting Number {requiredMark}
                      </label>
                      {this.state.MeetingNumberError ? (
                        <input
                          className="form-control validationError"
                          id="meetingNumber"
                          label="Meeting Number"
                          placeholder={this.state.MeetingNumberError}
                          type="tel"
                          onFocus={() => {
                            this.setState({ MeetingNumberError: "" });
                          }}
                          value={this.state.MeetingNumber}
                          onChange={(e) =>
                            this.setState({ MeetingNumber: e.target.value })
                          }
                          maxLength="9"
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="meetingNumber"
                          label="Meeting Number"
                          placeholder="e.g(202120)"
                          type="tel"
                          onFocus={() => {
                            this.setState({ MeetingNumberError: "" });
                          }}
                          value={this.state.MeetingNumber}
                          onChange={(e) =>
                            this.setState({ MeetingNumber: e.target.value })
                          }
                          maxLength="9"
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="align-center dflex">
                        City {requiredMark}
                      </label>
                      {this.state.cityError ? (
                        <input
                          className="form-control validationError"
                          id="city"
                          label="City"
                          placeholder={this.state.cityError}
                          type="text"
                          onFocus={() => {
                            this.setState({ cityError: "" });
                          }}
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
                          onFocus={() => {
                            this.setState({ cityError: "" });
                          }}
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

                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>
                        Event Description {requiredMark}
                      </label>
                      {this.state.descriptionError ? (
                        <textarea
                          className="form-control text-box mb-3 validationError"
                          id="eventDescription"
                          label="Event Description"
                          placeholder="Event Description"
                          type="textarea"
                          style={{ height: "100px" }}
                          onFocus={() => {
                            this.setState({ descriptionError: "" });
                          }}
                          value={this.state.description}
                          onChange={(e) =>
                            this.setState({ description: e.target.value })
                          }
                        />
                      ) : (
                        <textarea
                          className="form-control text-box mb-3"
                          id="eventDescription"
                          label="Event Description"
                          placeholder="Event Description"
                          type="textarea"
                          onFocus={() => {
                            this.setState({ descriptionError: "" });
                          }}
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
                    <div>
                      <div className="radio-section">
                        <label
                          htmlFor="floatingInput"
                          className="radio-head dflex align-center"
                        >
                          Select Meeting Type {requiredMark}
                        </label>
                        <div className="form-padding radio-input mb-3 dflex row">
                          <div>
                            <input
                              type="radio"
                              value="on_site"
                              name="meetingType"
                              id="onsite"
                              checked={this.state.meetingType === "on_site"}
                              style={{ margin: "0px 10px" }}
                              onChange={this.onMeetingTypeChange}
                            />
                            <label htmlFor="on_site">
                              <span
                                style={
                                  this.state.meetingTypeError
                                    ? { color: "#d92550" }
                                    : null
                                }
                              >
                                On Site
                              </span>
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="virtual"
                              value="virtual"
                              name="meetingType"
                              style={{ margin: "0px 10px" }}
                              checked={this.state.meetingType === "virtual"}
                              onChange={this.onMeetingTypeChange}
                            />
                            <label htmlFor="virtual">
                              <span
                                style={
                                  this.state.meetingTypeError
                                    ? { color: "#d92550" }
                                    : null
                                }
                              >
                                Virtual
                              </span>
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              value="hybrid"
                              id="hybrid"
                              name="meetingType"
                              checked={this.state.meetingType === "hybrid"}
                              style={{ margin: "0px 10px" }}
                              onChange={this.onMeetingTypeChange}
                            />
                            <label htmlFor="hybrid" className="mb-0">
                              <span
                                style={
                                  this.state.meetingTypeError
                                    ? { color: "#d92550" }
                                    : null
                                }
                              >
                                Hybrid
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="radio-section">
                        <label
                          htmlFor="floatingInput4"
                          className="radio-head dflex align-center"
                        >
                          Select Event Type {requiredMark}
                        </label>
                        <div className="form-padding radio-input mb-3 row">
                          <div>
                            <input
                              type="radio"
                              id="internal"
                              value="internal"
                              name="eventType"
                              style={{ margin: "0px 10px" }}
                              checked={this.state.eventType === "internal"}
                              onChange={this.onEventTypeChange}
                            />
                            <label htmlFor="internal">
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
                          <div >
                            <input
                              type="radio"
                              value="external"
                              id="external"
                              name="eventType"
                              checked={this.state.eventType === "external"}
                              style={{ margin: "0px 10px" }}
                              onChange={this.onEventTypeChange}
                            />
                            <label htmlFor="external">
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
                    </div>
                  </div>
                </div>

                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding ">
                      <label className="align-center dflex">
                        Venue {requiredMark}
                      </label>
                      {this.state.venueError ? (
                        <input
                          className="form-control validationError"
                          id="venue"
                          placeholder={this.state.venueError}
                          type="text"
                          value={this.state.venue}
                          onFocus={() => {
                            this.setState({ venueError: "" });
                          }}
                          onChange={(e) =>
                            this.setState({ venue: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="venue"
                          placeholder="Enter Location/ Meeting Link"
                          type="text"
                          onFocus={() => {
                            this.setState({ venueError: "" });
                          }}
                          value={this.state.venue}
                          onChange={(e) =>
                            this.setState({ venue: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding">
                      <label className="align-center dflex">Topic</label>
                      {this.state.topicError ? (
                        <input
                          className="form-control validationError"
                          id="topic"
                          label="Topic"
                          placeholder={this.state.topicError}
                          type="text"
                          onFocus={() => {
                            this.setState({ topicError: "" });
                          }}
                          value={this.state.topic}
                          onChange={(e) =>
                            this.setState({ topic: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="topic"
                          label="Topic"
                          placeholder="Topic"
                          type="text"
                          onFocus={() => {
                            this.setState({ topicError: "" });
                          }}
                          value={this.state.topic}
                          onChange={(e) =>
                            this.setState({ topic: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="row jc-sb mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding ">
                      <label className="align-center dflex">
                        Event Tags {requiredMark}
                      </label>
                      <Chips
                        className={`w-100 rounded-3 ${this.state.eventTagError ? "validationError" : ""}`}
                        value={this.state.eventTag}
                        onChange={({ value: eventTag }) => this.setState({ eventTag })}
                        separator=","
                        placeholder={this.state.eventTagError || "Type and press enter to add more"}
                        onFocus={() => {
                          this.setState({ eventTagError: "" });
                        }}
                      />
                    </div>
                  </div>

                  <div className="input-row radio-section-main mb-3">
                    <div className="radio-section">
                      <label
                        htmlFor="floatingInput4"
                        className="radio-head dflex align-center"
                      >
                        Select Event For {requiredMark}
                      </label>
                      <div className="form-padding radio-input mb-3 row">
                        <div className="virtual">
                          <input
                            type="radio"
                            id="chartered_accountants"
                            value="chartered_accountants"
                            name="eventFor"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.eventFor === "chartered_accountants"}
                            onChange={this.onEventForChange}
                          />
                          <label htmlFor="chartered_accountants">
                            <span
                              style={
                                this.state.eventForError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              Chartered Accountants
                            </span>
                          </label>
                        </div>
                        <div className="physical">
                          <input
                            type="radio"
                            value="students"
                            id="students"
                            name="eventFor"
                            checked={this.state.eventFor === "students"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onEventForChange}
                          />
                          <label htmlFor="students">
                            <span
                              style={
                                this.state.eventForError
                                  ? { color: "#d92550" }
                                  : {}
                              }
                            >
                              Students
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.props?.editEventId !== undefined && this.props?.editEventId !== null && this.props?.editEventId ? null :
                  <div className="upload-section mb-3">
                    <div className="form-floating mb-3 upload-doc-strip">
                      <div className="form-control upload-doc-strip mb-4">
                        <h5>
                          Add Speaker
                          <IoAddCircleOutline />
                        </h5>
                      </div>
                    </div>
                    <EventSpeakerForm speakers={this.state.speakers} setSpeakers={(speakers) => this.setState({ speakers })} />
                  </div>}

                <div className="upload-section mb-3">
                  <div className="form-floating mb-3 upload-doc-strip">
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
                        {this.state.selectWingError ? (
                          <MultiSelect
                            aria-label="Default select example"
                            labelledBy={this.state.selectWingError}
                            type="drop"
                            className="validationError"
                            placeholder={this.state.selectWingError}
                            value={this.state.selectWing}
                            onChange={this.onSelectWing}
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
                        <label className="selectIcon jc-fs"> Members </label>
                        {this.state.selectMemberError ? (
                          <MultiSelect
                            aria-label="Default select example"
                            labelledBy={this.state.selectMemberError}
                            // type="drop"
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
                            // type="drop"
                            value={this.state.selectMember}
                            onChange={this.onSelectMember}
                            options={this.getMembersDropdown()}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  {this.state.imageError ? (
                    <div
                      className="form-padding mb-4 upload-agenda validationError"
                      onFocus={() => {
                        this.setState({ imageError: "" });
                      }}
                    >
                      <div

                        onFocus={() => {
                          this.setState({ imageError: "" });
                        }}
                      >
                        <button
                          className="btn  small-font-size font-style"
                          onClick={this.handleUploadImage}
                          onFocus={() => {
                            this.setState({ imageError: "" });
                          }}
                        >
                          <span
                            className="mx-3 red-text"
                            style={{ color: "red" }}
                          >
                            Image required
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="form-padding mb-4 upload-agenda ">
                      {this.state.eventImage ? (
                        <div className="col-md-12">
                          {this.renderThumbnailImage()}
                        </div>
                      ) : (
                        <div>
                          <input
                            className="form-control bsUpload "
                            id="eventImage"
                            label="Date"
                            placeholder=""
                            type="file"
                            onFocus={() => {
                              this.setState({ imageError: "" });
                            }}
                            onChange={this.selectUploadImage}
                          />
                          <button
                            className="btn  small-font-size font-style"
                            onClick={this.handleUploadImage}
                          >
                            <BsUpload />
                            <span className="mx-3">Upload Event Image </span>
                          </button>
                          <p
                            className="small-font-size my-0"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Image resolution should be less than 5mb
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="form-padding mb-4 upload-agenda">
                    {this.state.agenda ? (
                      <div>
                        <div className="col-md-12">
                          {this.renderThumbnailFile()}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          className="form-control bsUpload "
                          id="uploadAgendaFile"
                          type="file"
                          value={this.state.selectAgenda}
                          onChange={this.selectUploadAgendaFile}
                        />
                        <button
                          className="btn  small-font-size font-style"
                          onClick={this.handleUploadAgendaFile}
                        >
                          <BsUpload />
                          <span className="mx-3">Upload Agenda </span>
                        </button>
                        <div className="col-md-12">
                          <div className="thumbnail-image">
                            <p
                              className="mb-0 mt-1 small-font-size"
                              style={{ fontSize: "0.8rem" }}
                            >
                              The file must be a file of type: doc, docx, pdf
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                    {this.props.editEventId ? "Update Event" : "Create Event"}
                  </button>
                </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}

const EventSpeakerForm = ({
  speakers = [],
  setSpeakers,
}) => {
  const emptySpeakerModel = () => {
    return {
      id: null,
      speaker: "",
      position: "",
      image: null,
    }
  };
  const fileUploadRef = useRef();
  const [speakerModel, setSpeakerModel] = useState(emptySpeakerModel());
  const [formErrorModel, setFormErrorModel] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteSpeakerId, setDeleteSpeakerId] = useState(null);

  const newSpeaker = () => {
    setSpeakerModel({ ...emptySpeakerModel() });
    setShowForm(true);
  };
  const deleteEventSpeaker = (id) => {
    const _speakers = [];
    speakers?.forEach((speakerDetails) => {
      if (String(speakerDetails?.id) !== String(id))
        _speakers.push(speakerDetails);
    });
    // setSpeakers(speakers.filter(({ id: deleteSpeakerId }) => deleteSpeakerId !== id));
    setSpeakers(_speakers);
  };
  const deleteSpeaker = () => {
    deleteEventSpeaker(deleteSpeakerId);
    setDeleteSpeakerId(null);
    setShowConfirmModal(false);
  };

  const editSpeaker = (selectedSpeaker) => {
    const speaker = {
      ...emptySpeakerModel(),
      id: selectedSpeaker.id,
      speaker: selectedSpeaker.speaker,
      position: selectedSpeaker.position,
      image: selectedSpeaker.image,
    };
    setSpeakerModel(speaker);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSpeakerModel({ ...emptySpeakerModel() });
  };

  const updateEventSpeaker = (formModel, id) => {
    const _speakers = [];
    speakers.forEach((_speaker) => {
      if (id === _speaker?.id)
        _speakers.push(speakerModel);
      else
        _speakers.push(_speaker);
    });
    setSpeakers(_speakers);
    setSpeakerModel(emptySpeakerModel());
  };

  const saveEventSpeaker = (formModel) => {
    const _speakers = [];
    let id = 0;
    speakers.forEach((_speaker) => {
      if (id <= _speaker?.id) {
        id = _speaker?.id + 1;
      }
      _speakers.push(_speaker);
    });
    _speakers.push({ ...formModel, id });
    setSpeakers(_speakers);
    setSpeakerModel(emptySpeakerModel());
  };

  const saveSpeaker = (e) => {
    e.preventDefault();
    if (speakerModel.speaker && speakerModel.position) {
      if (speakerModel?.id !== undefined && speakerModel?.id !== null) {
        updateEventSpeaker(speakerModel, speakerModel.id);
      } else {
        saveEventSpeaker(speakerModel);
      }
      closeForm();
    } else {
      AppConfig.showValidationError();
      setFormErrorModel({
        ...formErrorModel,
        speaker: speakerModel.speaker ? false : "Field empty",
        position: speakerModel.position ? false : "Field empty",
      });
    }
  }

  const callback = async (response) => {
    if (response) {
      const { status, result } = response;
      if (status === "success" && result) {
        const { url } = result;
        if (url) {
          setSpeakerModel({ ...speakerModel, image: url })
        }
      }
    }
  }

  const uploadProfile = async (files, preventDefault) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      await uploadMedia(file, callback);
    }
  }

  return (
    <div>
      {showForm ? <>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="col-12 input-row mb-3">
            <div className="form-padding mb-3">
              <label className="dflex align-center">
                Speaker Name <span className="asterik">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${formErrorModel.speaker ? "validationError" : ""}`}
                id="speakerName"
                placeholder={formErrorModel?.speaker || "Enter the Speaker Name"}
                value={speakerModel.speaker}
                onChange={({ target: { value } }) =>
                  setSpeakerModel({ ...speakerModel, speaker: value })
                }
                onFocus={() =>
                  setFormErrorModel({ ...formErrorModel, speaker: false })
                }
              />
            </div>
          </div>
          <div className="col-12 input-row mb-3">
            <div className="form-padding mb-3">
              <label className="dflex align-center">
                Speaker Position <span className="asterik">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${formErrorModel?.position ? "validationError" : ""}`}
                id="speakerName"
                placeholder={formErrorModel?.position || "Enter the Speaker Name"}
                value={speakerModel.position}
                onChange={({ target: { value } }) =>
                  setSpeakerModel({ ...speakerModel, position: value })
                }
                onFocus={() =>
                  setFormErrorModel({ ...formErrorModel, position: false })
                }
              />
            </div>
          </div>
          {speakerModel?.image ? (
            <div className="col-12 primary-color text-white">
              <div
                className="d-flex my-3"
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <>
                  <div className="col-md-3">
                    <div className="thumbnail-image">
                      <img
                        src={speakerModel?.image}
                        alt="Profile"
                        style={{
                          width: "50px",
                          height: "auto",
                          borderRadius: "unset",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <BsTrashFill
                      className="theme-font-color big-font-size m-2 pointer"
                      onClick={() => setSpeakerModel({ ...speakerModel, image: null })}
                    />
                  </div>
                </>
              </div>
            </div>
          ) : (
            <div className="col-12">
              <input
                className="form-control bsUpload d-none"
                id="speakerProfile"
                ref={fileUploadRef}
                type="file"
                multiple={false}
                accept="image/*"
                onChange={async ({ target: { files }, preventDefault }) => await uploadProfile(files, preventDefault)}
                onFocus={() =>
                  setFormErrorModel({ ...formErrorModel, image: false })
                }
              />
              <Button
                type="button"
                className="btn w-100 small-font-size font-style"
                onClick={(e) => {
                  fileUploadRef?.current?.click();
                  return false;
                }}
              >
                <div className="d-flex flex-column">
                  <div className="d-flex mb-2">
                    <BsUpload />
                    <span className="mx-3">Upload Profile Image </span>
                  </div>
                  <div className="d-flex">
                    <p
                      className="small-font-size my-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Image resolution should be less than 5mb
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          )}
          <div className="d-flex col-12 justify-content-between mt-3">
            <button
              type="button"
              className="btn  event-cta-trans"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button type="submit" className="btn  event-cta" onClick={saveSpeaker}>
              {speakerModel?.id !== null ? "Update Speaker Details" : "Add Speaker"}
            </button>
          </div>
        </div>
        <hr />
      </> : null}
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="col-auto d-flex align-items-center font-bold h5" >
            Speakers
          </div>
          <div className="d-flex" >
            {!showForm ?
              <div className="col d-flex align-items-center justify-content-center">
                <Button label="Add" className="rounded-pill" onClick={() => newSpeaker()} />
              </div>
              : null}
          </div>
        </div>
        <hr />
        <div className="d-flex flex-column">
          {speakers && speakers.length > 0 ? speakers.map(({ id: speakerId, speaker, image, position }) => {
            return <div className="d-flex justify-content-between row-hover px-3 py-1">
              <div className="col-auto d-flex align-items-center">
                {`${speaker} ${position}`}
              </div>
              <div className="d-flex" >
                {!showForm ? <>
                  <div className="col d-flex align-items-center justify-content-center">
                    <MdEdit
                      size={40}
                      color="white"
                      onClick={() => editSpeaker({ id: speakerId, speaker, image, position })}
                      style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                    />
                  </div>
                  <div className="col d-flex align-items-center justify-content-center">
                    <MdDelete
                      size={40}
                      color="white"
                      onClick={() => {
                        setDeleteSpeakerId(speakerId);
                        setShowConfirmModal(true);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                    />
                  </div>
                </> : null}
              </div>
            </div>
          }) : <div>Speakers not added</div>}
        </div>
      </div>
      <ConfirmModal
        delete={true}
        visible={showConfirmModal}
        heading="Delete Speaker"
        title="Are you sure you want to delete the Speaker?"
        confirm={() => deleteSpeaker()}
        handleClose={() => {
          setDeleteSpeakerId(null);
          setShowConfirmModal(false);
        }}
      />
    </div>
  );
}
export default EventsForm;
