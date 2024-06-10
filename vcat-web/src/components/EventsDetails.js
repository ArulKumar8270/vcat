import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import EventsCard from "./EventsCard";
import TagsIcon from "../components/img/events_tags.png";
import "../components/css/pagestyle.css";
import { Button } from "react-bootstrap";
import {
  CheckEmail,
  CheckFullName,
  CheckMessage,
  CheckPhone,
  CheckUserName,
} from "../common/Validation";
import EventsCarousel from "./EventsCarousel";
import Dimensions from "../modals/Dimensions";
import { callApi } from "../libraries/Api";
// const JSONfn = require("json-fn");
import JSONfn from "json-fn";
import ProfileIcon from "./img/profile.png";
import Events from "../modals/Events";
import {
  getEventOrganizerNames,
  handleViewEventDetails,
} from "../libraries/eventHelpers";

const EventsDetails = (props) => {
  const { location } = props;

  const { state } = location;
  const {
    id,
    name,
    image,
    from_date,
    venue,
    organizer_details,
    description,
    getOrganizer,
    getEventDetails,
    relatedEvents,
    otherEvents,
    isRegister,
    originalOtherEvents,
    originalRelatedEvents,
    event_tags,
    event_speakers,
    event_for,
  } = state;
  const history = useHistory();

  console.log("state_EventsDetails", state);

  const [formName, setFormName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipNo, setMembershipNo] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [membershipNoError, setMembershipNoError] = useState("");
  const [membershipStatusError, setMembershipStatusError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [disableRegisterForm, setDisableRegisterForm] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [windowDimension, setWindowDimension] = useState({
    width: 1200,
    height: 800,
  });

  const handleWindowResize = useCallback(() => {
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

    const { innerWidth, innerHeight } = getWindowSize();
    setWindowDimension({
      ...windowDimension,
      width: innerWidth,
      height: innerHeight,
    });
    // if (innerWidth >= 300 && innerWidth <= 767) {
    //   setIsMobile(true);
    // } else {
    //   setIsMobile(false);
    // }
  }, []);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  async function checkName() {
    const result = await CheckFullName(formName);
    if (result === 1) {
      setNameError("Name cannot be empty");
      return false;
    }
    if (result === 2) {
      setNameError("Invalid name");
      return false;
    }
    setNameError("");
    return true;
  }

  async function checkEmail() {
    const result = await CheckEmail(email);
    if (result === 1) {
      setEmailError("Email cannot be empty");
      return false;
    }
    if (result === 2) {
      setEmailError("Invalid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  async function checkPhone() {
    const result = await CheckPhone(phone);
    if (result === 1) {
      setPhoneError("Phone cannot be empty");
      return false;
    }
    if (result === 2) {
      setPhoneError("Invalid phone");
      return false;
    }
    setPhoneError("");
    return true;
  }

  async function checkIcaiMembership() {
    if (!membershipNo) {
      setMembershipNoError("ICAI membership no cannot be empty");
      return false;
    }
    if (membershipNo.length < 5) {
      setMembershipNoError("Invalid ICAI membership no");
      return false;
    }
    setMembershipNoError("");
    return true;
  }

  async function checkVcatMembershipStatus() {
    if (!membershipStatus || membershipStatus === "select") {
      setMembershipStatusError("Invalid Membership status");
      return false;
    }
    setMembershipStatusError("");
    return true;
  }

  async function checkMessage() {
    if (!message) {
      setMessageError("Message cannot be empty");
      return false;
    }
    setMessageError("");
    return true;
  }

  async function validateForm() {
    const nameResult = await checkName();
    const emailResult = await checkEmail();
    const phoneResult = await checkPhone();
    // const icaiResult = await checkIcaiMembership();
    const statusResult = await checkVcatMembershipStatus();
    // const messageResult = await checkMessage();

    if (
      nameResult &&
      emailResult &&
      phoneResult &&
      // icaiResult &&
      // messageResult &&
      statusResult
    )
      return true;
    return false;
  }

  async function handleSubmit() {
    console.log("id", id);
    const validationResult = await validateForm();
    if (validationResult) {
      setIsSubmit(true);
      // api call
      const functionUrl = "registerEvents";
      const requestBody = {
        event_id: id,
        name: formName,
        email,
        mobile_number: phone,
        icai_membership_no: membershipNo || "",
        vcat_membership_status: membershipStatus,
        message: message || "",
      };

      callApi(functionUrl, requestBody)
        .then((response) => {
          console.log("response", response);
          if (response && response.status === "success") {
            setDisableRegisterForm(true);
            setIsSubmit(false);
            setFormName("");
            setEmail("");
            setPhone("");
            setMembershipNo("");
            setMembershipStatus("");
            setMessage("");
          } else {
            setIsSubmit(false);
          }
        })
        .catch((err) => {
          setIsSubmit(false);
          console.log("err", err);
        });
    }
  }

  function renderSpeakers(keyId, speakerName, speakerImage, speakerPosition) {
    return (
      <div
        key={keyId}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={speakerImage || ProfileIcon}
          alt="profile_icon"
          style={{ width: "120px", height: "120px", borderRadius: "50%" }}
        />
        <h3 style={{ marginTop: "20px", marginBottom: "-1px", color: "black" }}>
          {speakerName}
        </h3>
        <p style={{ fontSize: "0.8rem" }}>{speakerPosition}</p>
      </div>
    );
  }

  function renderRegistrationForm() {
    return (
      <div
        id="eventRegistrationForm"
        style={{
          minHeight: '45rem',
        }}
      >
        <h2 style={{ color: "#1C1777", marginTop: "1rem", fontSize: "1.5rem" }}>
          Event Registration form
        </h2>
        <form style={{ position: "relative" }}>
          <div
            className="form-padding mb-4 mt-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              Name
              <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span>
            </label>
            <input
              disabled={disableRegisterForm}
              className="form-control"
              label="Name"
              type="text"
              id="name"
              required
              value={formName}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
                // width: "25rem",
                // border: `1px solid #969595`,
              }}
              onChange={(e) => setFormName(e.target.value)}
              onFocus={(e) => setNameError("")}
            />
          </div>
          {nameError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {nameError}
            </p>
          )}
          <div
            className="form-padding mb-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              Email
              <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span>
            </label>
            <input
              disabled={disableRegisterForm}
              className="form-control"
              label="Email"
              type="text"
              id="email"
              required
              value={email}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
              }}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => setEmailError("")}
            />
          </div>
          {emailError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {emailError}
            </p>
          )}
          <div
            className="form-padding mb-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              Phone
              <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span>
            </label>
            <input
              disabled={disableRegisterForm}
              className="form-control"
              label="Phone"
              type="tel"
              id="phone"
              required
              value={phone}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
              }}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={(e) => setPhoneError("")}
            />
          </div>
          {phoneError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {phoneError}
            </p>
          )}
          <div
            className="form-padding mb-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              ICAI Membership NO
              {/* <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span> */}
            </label>
            <input
              disabled={disableRegisterForm}
              className="form-control"
              label="ICAI Membership NO"
              type="text"
              id="membership_no"
              required
              value={membershipNo}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
              }}
              onChange={(e) => setMembershipNo(e.target.value)}
              onFocus={(e) => setMembershipNoError("")}
            />
          </div>
          {membershipNoError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {membershipNoError}
            </p>
          )}
          <div
            className="form-padding mb-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              VCAT Membership Status
              <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span>
            </label>
            <select
              disabled={disableRegisterForm}
              className="form-control"
              label="VCAT Membership Status"
              id="membership_status"
              required
              value={membershipStatus}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
              }}
              onChange={(e) => setMembershipStatus(e.target.value)}
              onFocus={(e) => setMembershipStatusError("")}
            >
              <option value="select"> --- Select ---</option>
              <option value="non_member">Non Member</option>
              <option value="life_trustee">Life Trustee</option>
              <option value="life_member">Life Member</option>
            </select>
          </div>
          {membershipStatusError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {membershipStatusError}
            </p>
          )}
          <div
            className="form-padding mb-4 jc-sb dflex flex-row align-items-center"
            id="eventRegisterFormContainer"
          >
            <label
              htmlFor="message"
              style={{
                fontSize: windowDimension.width < 576 ? "0.7rem" : "1rem",
                width: "5rem",
              }}
            >
              Message / Query
              {/* <span
                className="asterik mt-0"
                style={{
                  fontSize: windowDimension.width < 576 ? "10px" : "15px",
                  // marginRight: windowDimension.width < 576 ? "0rem" : "3rem",
                }}
              >
                *
              </span> */}
            </label>
            <textarea
              disabled={disableRegisterForm}
              className="form-control"
              label="Message"
              id="message"
              value={message}
              style={{
                width: windowDimension.width < 576 ? "12rem" : "25rem",
                marginLeft: windowDimension.width < 576 ? "0rem" : "3rem",
              }}
              rows="4"
              onChange={(e) => setMessage(e.target.value)}
              onFocus={(e) => setMessageError("")}
            />
          </div>
          {messageError && (
            <p
              style={{
                color: "#d92550",
                fontSize: "0.7rem",
                position: "relative",
                top: "-20px",
                left: "270px",
                marginBottom: "-10px",
              }}
            >
              {messageError}
            </p>
          )}
          {disableRegisterForm ? (
            <h4
              id="eventRegisterFormContainer"
              className="eventRegisterationMessage"
            // style={{
            //   color: "black",
            //   position: "absolute",
            //   right: "10rem",
            //   bottom: "-50px",
            //   border: "1px solid green",
            //   padding: "10px",
            //   backgroundColor: "lightgreen",
            // }}
            >
              Thanks for registering with us
            </h4>
          ) : isSubmit ? (
            <div
              className="spinner-border text-primary"
              role="status"
              style={{
                position: "absolute",
                right: windowDimension.width < 576 ? "5rem" : "10rem",
                bottom: windowDimension.width < 576 ? "-20px" : "-30px",
              }}
            >
              {/* <span class="sr-only">Loading...</span> */}
            </div>
          ) : (
            <Button
              className="btn btn-primary m-auto"
              name="1"
              id="btn-view"
              onClick={handleSubmit}
              style={{
                position: "absolute",
                right: windowDimension.width < 576 ? "5rem" : "10rem",
                bottom: windowDimension.width < 576 ? "-20px" : "-30px",
              }}
            >
              Submit
            </Button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "6rem",
        // marginBottom:
        //   (otherEvents && otherEvents.length > 0) ||
        //   (relatedEvents && relatedEvents.length > 0)
        //     ? isRegister
        //       ? "97rem"
        //       : "50rem"
        //     : "60rem",
      }}
      id="eventDetailsMainContainer"
    >
      <section id="eventDetailsSection">
        <div id="eventDetailsHeader">
          <img src={image} id="eventDetailsImage" alt="event_banner" />
          <h2 id="eventDetailsTitle">{name}{event_for ? (event_for === "students" ? " - For Students" : " - For Chartered Accountants") : ""}</h2>
          <p id="eventDetailsDescription">{description}</p>
        </div>
        <div id="eventDetailsContainer">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Date :&nbsp;
            </p>
            <p style={{ fontWeight: "300", fontSize: "1.2rem" }}>
              {from_date
                ? moment(from_date).format("Do MMMM YYYY")
                : "To be decided"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Time :&nbsp;
            </p>
            <p style={{ fontWeight: "300", fontSize: "1.2rem" }}>
              {from_date ? moment(from_date).format("hh:mmA") : "To be decided"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Venue :&nbsp;
            </p>
            <p style={{ fontWeight: "300", fontSize: "1.2rem" }}>
              {venue || "To be decided"}
            </p>
          </div>
        </div>
        <div style={{ margin: "40px 0 0 50px" }}>
          <h3
            style={{ fontWeight: "bold", fontSize: "1.5rem", color: "black" }}
          >
            {event_speakers && event_speakers.length === 1
              ? "Speaker"
              : "Speakers"}
          </h3>
          <div id="eventSpeakerDetails">
            {event_speakers && event_speakers.length > 0 ? (
              event_speakers.map((speakerData, i) =>
                renderSpeakers(
                  i,
                  speakerData.speaker,
                  speakerData.image,
                  speakerData.position
                )
              )
            ) : (
              <p style={{ fontSize: "0.9rem" }}>No Speakers for this event</p>
            )}
            {/* {organizer_details &&
              organizer_details.length > 0 &&
              organizer_details.map(({ id, image, name }) =>
                renderSpeakers(id, name, image)
              )} */}
          </div>
        </div>
        {event_tags && event_tags.length > 0 && (
          <div id="eventTagsContainer">
            {event_tags.map((data) => (
              <div
                style={{
                  width: "8.2rem",
                  minHeight: "3rem",
                  backgroundColor: "#FBEEEE",
                  marginLeft: "50px",
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "2px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <img
                  src={TagsIcon}
                  alt="tags_icon"
                  style={{ width: "15px", height: "15px" }}
                />
                <p
                  style={{
                    color: "#F56681",
                    fontSize: "0.8rem",
                    marginLeft: "5px",
                  }}
                >
                  {data}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      {isRegister && renderRegistrationForm()}
      <div id="relatedEventsContainer">
        {isRegister ? (
          <>
            {otherEvents && otherEvents.length > 0 && (
              <>
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "black",
                    marginLeft: "50px",
                    // marginTop: "50px",
                  }}
                >
                  Other Events
                </h3>
                {windowDimension.width <= 767 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",
                      alignContent: "center",
                    }}
                  >
                    {otherEvents.map(
                      ({
                        id,
                        name,
                        image,
                        from_date,
                        venue,
                        hosted_by,
                        description,
                        event_tags,
                        event_speakers,
                        event_for
                      }) => (
                        <EventsCard
                          eventImage={image}
                          eventHeading={name}
                          eventDate={from_date}
                          eventTime={from_date}
                          eventVenue={venue}
                          eventFor={event_for}
                          eventOrganizers={() =>
                            getEventOrganizerNames(hosted_by)
                          }
                          eventButton="Register Now"
                          handleEventAction={() => handleViewEventDetails({
                            id,
                            name,
                            image,
                            from_date,
                            venue,
                            organizer_details: hosted_by,
                            description,
                            event_tags,
                            upcomingEventsArr: originalOtherEvents,
                            isRegister: true,
                            isEventDetailsPage: true,
                            organizerNameFn: getEventOrganizerNames,
                            jsonfn: JSONfn,
                            routerHistory: history,
                            originalData: originalOtherEvents,
                            event_speakers,
                            mobileDimension: windowDimension.width <= 767,
                            mobileUpcomingEvents: [],
                            mobileRelatedEvents: [],
                            relatedEvents: [],
                            history,
                            event_for,
                          })}
                          profileImageArr={hosted_by}
                          uniqueId={id}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    <EventsCarousel
                      eventsData={otherEvents}
                      // getEventOrganizerNames={JSONfn.parse(getOrganizer)}
                      // handleViewEventDetails={JSONfn.parse(getEventDetails)}
                      upcomingDataArr={otherEvents}
                      isEventDetailsPage={true}
                      originalData={originalOtherEvents}
                      isOtherEvents={true}
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {relatedEvents && relatedEvents.length > 0 && (
              <>
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "black",
                    marginLeft: "50px",
                    // marginTop: "50px",
                  }}
                >
                  Related Events
                </h3>
                {windowDimension.width <= 767 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",
                      alignContent: "center",
                    }}
                  >
                    {relatedEvents.map(
                      ({
                        id,
                        name,
                        image,
                        from_date,
                        venue,
                        hosted_by,
                        description,
                        event_tags,
                        event_speakers,
                        event_for
                      }) => (
                        <EventsCard
                          eventImage={image}
                          eventHeading={name}
                          eventDate={from_date}
                          eventTime={from_date}
                          eventVenue={venue}
                          eventFor={event_for}
                          eventOrganizers={() =>
                            getEventOrganizerNames(hosted_by)
                          }
                          eventButton="View More"
                          handleEventAction={() => handleViewEventDetails({
                            id,
                            name,
                            image,
                            from_date,
                            venue,
                            organizer_details: hosted_by,
                            description,
                            event_tags,
                            upcomingEventsArr: originalRelatedEvents,
                            isRegister: false,
                            isEventDetailsPage: true,
                            organizerNameFn: getEventOrganizerNames,
                            jsonfn: JSONfn,
                            routerHistory: history,
                            originalData: originalRelatedEvents,
                            event_speakers,
                            mobileDimension: windowDimension.width <= 767,
                            mobileUpcomingEvents: [],
                            mobileRelatedEvents: [],
                            relatedEvents: [],
                            history,
                            event_for,
                          })}
                          profileImageArr={hosted_by}
                          uniqueId={id}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    <EventsCarousel
                      eventsData={relatedEvents}
                      // getEventOrganizerNames={JSONfn.parse(getOrganizer)}
                      // handleViewEventDetails={JSONfn.parse(getEventDetails)}
                      upcomingDataArr={relatedEvents}
                      isEventDetailsPage={true}
                      originalData={originalRelatedEvents}
                      isOtherEvents={false}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsDetails;
