import moment from "moment";
import React from "react";
import Button from "react-bootstrap/Button";
import "./css/pagestyle.css";
import ProfileIcon from "./img/profile.png";

const EventsCard = ({
  eventImage, // <String>
  eventHeading, // <String>
  eventDate, // <Date>
  eventTime, // <Time Date/String>
  eventVenue, // <String>
  eventOrganizers, // <String>
  eventButton, // <String>
  handleEventAction, // <Function>
  profileImageArr,
  uniqueId,
  eventFor
}) => {

  function renderProfileAvatar(arr) {
    let personCount = 0;
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (i > 1) {
          personCount++;
        }
      }
    }
    return (
      arr &&
      arr.length > 0 &&
      arr.map((data, i) => (
        <div key={data.id}>
          {i > 1 ? (
            i === 2 ? (
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF1F1",
                  position: "relative",
                }}
              >
                <p
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "0.5rem",
                    color: "black",
                  }}
                >
                  +{personCount}
                </p>
              </div>
            ) : null
          ) : (
            <img
              src={data.image ? data.image : ProfileIcon}
              alt="Profile"
              style={{
                width: "30px",
                height: "30px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
        </div>
      ))
    );
  }
  return (
    <div id="eventsCardContainer" key={uniqueId}>
      <div id="eventsBannerContainer">
        <img src={eventImage} id="eventsBanner" alt="events_banner" />
      </div>
      <div id="eventsContentContainer">
        <div id="eventsContentSubContainer">
          <h3
            style={{
              color: "#000000",
              fontWeight: "700",
              lineHeight: "25px",
              margin: "0 15px 0 15px",
              height: "5.5rem",
            }}
          >
            {eventHeading}{eventFor ? (eventFor === "students" ? " - For Students" : " - For Chartered Accountants") : ""}
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: "2rem",
            }}
          >
            <div id="eventsContent" style={{ margin: "0 15px 0 15px" }}>
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  color: "#000000",
                }}
              >
                Date:&nbsp;
              </p>
              <p style={{ fontSize: "0.7rem", color: "#000000" }}>
                {eventDate
                  ? moment(eventDate).format("Do MMMM YYYY")
                  : "To be decided"}
              </p>
            </div>
            <div id="eventsContent" style={{ margin: "0 15px 0 15px" }}>
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  color: "#000000",
                }}
              >
                Time:&nbsp;
              </p>
              <p style={{ fontSize: "0.7rem", color: "#000000" }}>
                {eventTime ? moment(eventTime).format("hh:mmA") : "-"}
              </p>
            </div>
          </div>
          <div id="eventsContent" style={{ margin: "-7px 15px 0 15px" }}>
            <p
              style={{
                fontWeight: "600",
                fontSize: "0.8rem",
                color: "#000000",
              }}
            >
              Venue:&nbsp;
            </p>
            <p style={{ fontSize: "0.7rem", color: "#000000" }}>
              {eventVenue ? eventVenue : "To be decided"}
            </p>
          </div>
          <div id="eventOrganizer">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "0 10px 0 0",
                padding: "10px 0 0 10px",
              }}
            >
              {renderProfileAvatar(profileImageArr)}
            </div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "#000000",
                position: "relative",
                top:
                  profileImageArr && profileImageArr.length === 0
                    ? "5px"
                    : "0px",
              }}
            >
              {profileImageArr && profileImageArr.length === 0
                ? `By `
                : `By - `}
            </p>
            <p
              style={{
                fontSize: "0.7rem",
                color: "#000000",
                position: "relative",
                top:
                  profileImageArr && profileImageArr.length === 0
                    ? "5px"
                    : "0px",
              }}
            >
              {eventOrganizers}
            </p>
          </div>
        </div>
        <div id="eventBtn">
          <Button
            className="btn btn-primary m-auto"
            // disabled={lastPage && lastPage > currentPage ? false : true}
            name="1"
            id="btn-view"
            onClick={handleEventAction}
          >
            {eventButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
