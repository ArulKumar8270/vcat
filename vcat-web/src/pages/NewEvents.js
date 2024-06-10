import React, { useState, useEffect, useCallback } from "react";
import { callApi } from "../libraries/Api";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import EventsCard from "../components/EventsCard";
import "../components/css/pagestyle.css";
import EventsCarousel from "../components/EventsCarousel";
import CAFirms from "../components/img/events/CA-Firms.png";
import IncomeTax from "../components/img/events/Income-Tax.png";
import UnderstandingEvents from "../components/img/events/Understanding.png";
import EventsDetails from "../components/EventsDetails";
// const JSONfn = require("json-fn");
import JSONfn from "json-fn";
import Events from "../modals/Events";
import { observer } from "mobx-react";
import Dimensions from "../modals/Dimensions";
import {
  getEventOrganizerNames,
  handleViewEventDetails,
} from "../libraries/eventHelpers";

const eventsBanner = [IncomeTax, CAFirms, UnderstandingEvents];

const NewEvents = () => {
  const [apiDataSize, setApiDataSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isViewMorePastEvents, setIsViewMorePastEvents] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allUpcomingEvents, setAllUpcomingEvents] = useState([]);
  const [mobileUpcomingEvents, setMobileUpcomingEvents] = useState([]);
  const [isUpcomingEvents, setIsUpcomingEvents] = useState(true);

  const [pastEvents, setPastEvents] = useState([]);
  const [allPastEvents, setAllPastEvents] = useState([]);
  const [mobilePastEvents, setMobilePastEvents] = useState([]);
  const [splicedPastEvents, setSplicedPastEvents] = useState([]);
  const [isPastEvents, setIsPastEvents] = useState(true);

  const [relatedEvents, setRelatedEvents] = useState([]);
  const [mobileRelatedEvents, setMobileRelatedEvents] = useState([]);

  const [isEventDetails, setIsEventDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState({});

  const [windowDimension, setWindowDimension] = useState({
    width: 1200,
    height: 800,
  });
  const [isMobile, setIsMobile] = useState(false);

  const history = useHistory();

  function handleViewMoreEvents() {
    // setCurrentPage(currentPage + 1);
    // setIsViewMorePastEvents(true);
    const splicedArr = splicedPastEvents.splice(0, 6);
    setSplicedPastEvents([...splicedPastEvents]);
    const concatPastEvents = pastEvents.concat([...splicedArr]);
    setPastEvents([...concatPastEvents]);
  }

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
    if (innerWidth >= 300 && innerWidth <= 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowDimension, isMobile]);

  // function handleViewEventDetails(
  //   id,
  //   name,
  //   image,
  //   from_date,
  //   venue,
  //   organizer_details,
  //   description,
  //   event_tags,
  //   upcomingEventsArr,
  //   isRegister = false,
  //   isEventDetailsPage = false,
  //   organizerNameFn,
  //   jsonfn,
  //   routerHistory,
  //   originalData,
  //   event_speakers,
  //   mobileDimension
  // ) {
  //   const obj = {};
  //   obj["id"] = id;
  //   obj["name"] = name;
  //   obj["image"] = image;
  //   obj["from_date"] = from_date;
  //   obj["venue"] = venue;
  //   obj["organizer_details"] = organizer_details;
  //   obj["description"] = description;
  //   obj["event_tags"] = event_tags;
  //   obj["event_speakers"] = event_speakers;
  //   // obj["getEventOrganizerNames"] = getEventOrganizerNames(organizer_details);

  //   if (isRegister) {
  //     if (isEventDetailsPage) {
  //       let parentArr = [];
  //       let childArr = [];
  //       let mainUpcomingEventsArr = [];

  //       if (mobileDimension) {
  //         if (upcomingEventsArr && upcomingEventsArr.length > 0) {
  //           for (const parentData of upcomingEventsArr) {
  //             if (id !== parentData.id) parentArr.push({ ...parentData });
  //           }
  //           mainUpcomingEventsArr = [...parentArr];
  //         } else {
  //           mainUpcomingEventsArr = [...upcomingEventsArr];
  //         }
  //       } else {
  //         if (originalData && originalData.length > 0) {
  //           for (const parentData of originalData) {
  //             for (const eventData of parentData) {
  //               if (id !== eventData.id) childArr.push({ ...eventData });
  //             }
  //             if (childArr.length !== 0) parentArr.push([...childArr]);
  //             childArr = [];
  //           }
  //           mainUpcomingEventsArr = [...parentArr];
  //         } else {
  //           mainUpcomingEventsArr = [...originalData];
  //         }
  //       }
  //       obj["otherEvents"] = mainUpcomingEventsArr;
  //       obj["originalOtherEvents"] = [...originalData];
  //     } else {
  //       let parentArr = [];
  //       let childArr = [];
  //       let mainUpcomingEventsArr = [];
  //       if (mobileDimension) {
  //         if (mobileUpcomingEvents && mobileUpcomingEvents.length > 0) {
  //           for (const parentData of mobileUpcomingEvents) {
  //             if (id !== parentData.id) parentArr.push({ ...parentData });
  //           }
  //           mainUpcomingEventsArr = [...parentArr];
  //         } else {
  //           mainUpcomingEventsArr = [...mobileUpcomingEvents];
  //         }
  //       } else {
  //         if (upcomingEventsArr && upcomingEventsArr.length > 0) {
  //           for (const parentData of upcomingEventsArr) {
  //             for (const eventData of parentData) {
  //               if (id !== eventData.id) childArr.push({ ...eventData });
  //             }
  //             parentArr.push([...childArr]);
  //             childArr = [];
  //           }
  //           mainUpcomingEventsArr = [...parentArr];
  //         } else {
  //           mainUpcomingEventsArr = [...upcomingEventsArr];
  //         }
  //       }

  //       obj["otherEvents"] = [...mainUpcomingEventsArr];
  //       obj["originalOtherEvents"] = [...upcomingEventsArr];
  //     }
  //   } else {
  //     if (isEventDetailsPage) {
  //       let parentArr = [];
  //       let childArr = [];
  //       let mainRelatedEventsArr = [];
  //       let objectIndex = -1;
  //       if (mobileDimension) {
  //         if (upcomingEventsArr && upcomingEventsArr.length > 0) {
  //           for (const parentData of upcomingEventsArr) {
  //             if (id === parentData.id) {
  //               objectIndex = upcomingEventsArr.indexOf(parentData);
  //             }
  //           }
  //           if (objectIndex !== -1) {
  //             for (const parentData of upcomingEventsArr) {
  //               if (id !== parentData.id) {
  //                 if (
  //                   parentData.event_tags &&
  //                   parentData.event_tags.length > 0
  //                 ) {
  //                   for (const eventTag of parentData.event_tags) {
  //                     if (
  //                       upcomingEventsArr[objectIndex].event_tags &&
  //                       upcomingEventsArr[objectIndex].event_tags.length > 0 &&
  //                       upcomingEventsArr[objectIndex].event_tags.includes(
  //                         eventTag
  //                       )
  //                     ) {
  //                       parentArr.push({ ...parentData });
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           } else {
  //             parentArr = [];
  //           }
  //           mainRelatedEventsArr = [...parentArr];
  //         } else {
  //           mainRelatedEventsArr = [...upcomingEventsArr];
  //         }
  //         obj["originalRelatedEvents"] = [...upcomingEventsArr];
  //         // ////////////////////////////////////
  //         // if (upcomingEventsArr && upcomingEventsArr.length > 0) {
  //         //   for (const parentData of upcomingEventsArr) {
  //         //     if (id !== parentData.id) parentArr.push({ ...parentData });
  //         //   }
  //         //   mainRelatedEventsArr = [...parentArr];
  //         // }
  //         // else {
  //         //   mainRelatedEventsArr = [...upcomingEventsArr];
  //         // }
  //       } else {
  //         if (originalData && originalData.length > 0) {
  //           for (const parentData of originalData) {
  //             for (const eventData of parentData) {
  //               if (id !== eventData.id) childArr.push({ ...eventData });
  //             }
  //             parentArr.push([...childArr]);
  //             childArr = [];
  //           }
  //           mainRelatedEventsArr = [...parentArr];
  //         } else {
  //           mainRelatedEventsArr = [...originalData];
  //         }
  //       }

  //       obj["relatedEvents"] = [...mainRelatedEventsArr];
  //       obj["originalRelatedEvents"] = [...originalData];
  //     } else {
  //       let parentArr = [];
  //       let childArr = [];
  //       let mainRelatedEventsArr = [];
  //       let objectIndex = -1;
  //       if (mobileDimension) {
  //         if (mobileRelatedEvents && mobileRelatedEvents.length > 0) {
  //           for (const parentData of mobileRelatedEvents) {
  //             if (id === parentData.id) {
  //               objectIndex = mobileRelatedEvents.indexOf(parentData);
  //             }
  //           }
  //           if (objectIndex !== -1) {
  //             for (const parentData of mobileRelatedEvents) {
  //               if (id !== parentData.id) {
  //                 if (
  //                   parentData.event_tags &&
  //                   parentData.event_tags.length > 0
  //                 ) {
  //                   for (const eventTag of parentData.event_tags) {
  //                     if (
  //                       mobileRelatedEvents[objectIndex].event_tags &&
  //                       mobileRelatedEvents[objectIndex].event_tags.length >
  //                         0 &&
  //                       mobileRelatedEvents[objectIndex].event_tags.includes(
  //                         eventTag
  //                       )
  //                     ) {
  //                       parentArr.push({ ...parentData });
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           } else {
  //             parentArr = [];
  //           }
  //           mainRelatedEventsArr = [...parentArr];
  //         } else {
  //           mainRelatedEventsArr = [...mobileRelatedEvents];
  //         }
  //         obj["originalRelatedEvents"] = [...mobileRelatedEvents];
  //       } else {
  //         if (relatedEvents && relatedEvents.length > 0) {
  //           for (const parentData of relatedEvents) {
  //             for (const eventData of parentData) {
  //               if (id === eventData.id)
  //                 objectIndex = parentData.indexOf(eventData);
  //             }

  //             if (objectIndex !== -1) {
  //               for (const eventData of parentData) {
  //                 if (id !== eventData.id) {
  //                   for (const eventTag of eventData.event_tags) {
  //                     if (
  //                       parentData[objectIndex].event_tags &&
  //                       parentData[objectIndex].event_tags.length > 0 &&
  //                       parentData[objectIndex].event_tags.includes(eventTag)
  //                     )
  //                       childArr.push({ ...eventData });
  //                   }
  //                 }
  //               }
  //             }
  //             if (childArr.length !== 0) parentArr.push([...childArr]);
  //             childArr = [];
  //           }
  //           mainRelatedEventsArr = [...parentArr];
  //         } else {
  //           mainRelatedEventsArr = [...relatedEvents];
  //         }
  //         obj["originalRelatedEvents"] = [...relatedEvents];
  //       }

  //       obj["relatedEvents"] = [...mainRelatedEventsArr];
  //       // obj["originalRelatedEvents"] = [...relatedEvents];
  //     }
  //   }

  //   // setEventDetails({ ...obj });
  //   if (isEventDetailsPage) {
  //     routerHistory.push({
  //       pathname: "/event_details",
  //       state: {
  //         ...obj,
  //         isRegister,
  //       },
  //     });
  //   } else {
  //     history.push({
  //       pathname: "/event_details",
  //       state: {
  //         ...obj,
  //         isRegister,
  //       },
  //     });
  //   }
  //   // setIsEventDetails(true);
  // }

  // function getEventOrganizerNames(arr) {
  //   let nameString = "";
  //   if (arr && arr.length > 0) {
  //     for (const [i, data] of arr.entries()) {
  //       const { speaker } = data;
  //       // const { name } = data;
  //       if (i === arr.length - 1) {
  //         nameString += speaker;
  //       } else {
  //         nameString += `${speaker}, `;
  //       }
  //     }
  //   } else {
  //     nameString = "-";
  //   }
  //   if (nameString.length > 31) {
  //     const slicedString = nameString.slice(18, nameString.length);
  //     const replacedString = nameString.replace(slicedString, "...");
  //     return replacedString;
  //   }
  //   return nameString;
  // }

  function renderEvents(uniqueKey, event, sliced) {
    return (
      <div
        key={uniqueKey}
        className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
      >
        <div className="card m-btm m-auto ">
          <img
            src={event.image || ""}
            className="card-img-top"
            alt="event_image"
            style={{ borderBottom: "0.8px solid #dddcdc" }}
          />
          <div className="card-body">
            <h5 className="card-title  textCap">
              {event.name == null || event.name === "" ? null : event.name}
            </h5>
            <p className="card-text mb-0">{sliced}...</p>
            <p className="card-button mt-1">
              <Button
                onClick={(e) => this.handleClick(e, event.id)}
                className="btn btn-primary"
                style={{ backgroundColor: "linear-gradient(#EE7A20, #EE4F4D)" }}
              >
                Learn more
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  function eventApi() {
    const functionUrl = "eventsPage";

    callApi(functionUrl, {}, "GET")
      .then((response) => {
        if (response.statuscode === 200) {
          const result = response.result;
          // const data = [];
          const pastEventsApi = result.past_events;
          const { upcoming_events: upcomingEventsApi } = result;
          // const upcomingpastEvents = result.upcoming_events;

          // const slicedData = result.eventsPage.data.slice(0, 3);
          // const upcomingpastEvents = slicedData;
          let upcomingEventsArr = [];
          let structuredUpcomingEventsArr = [];
          let structuredRelatedEventsArr = [];
          let pastEventsArr = [];
          let relatedEventsArr = [];

          if (pastEventsApi && pastEventsApi.length > 0) {
            let count = 0;
            let tempArr = [];
            // Past Events Api Data
            for (const [i, pastEventsData] of pastEventsApi.entries()) {
              // TODO: Need to remove the below
              if (!pastEventsData["image"])
                pastEventsData["image"] = eventsBanner[count];
              tempArr.push({ ...pastEventsData });
              if (count === eventsBanner.length - 1) count = 0;
              count++;

              if (
                pastEventsData.event_tags &&
                pastEventsData.event_tags.length > 0
              ) {
                relatedEventsArr.push({ ...pastEventsData });
              }
            }
            pastEventsArr = [...tempArr];
          }

          if (relatedEventsArr && relatedEventsArr.length > 0) {
            let count = 0;
            let relatedEventsCount = 0;
            let tempArr = [];
            let tempRelatedEventsArr = [];
            let countToPush = "";

            if (relatedEventsArr.length === 1) countToPush = 0;
            if (relatedEventsArr.length === 2) countToPush = 1;
            if (relatedEventsArr.length > 2) countToPush = 2;
            // Past Events Api Data
            for (const [i, relatedEventsData] of relatedEventsArr.entries()) {
              if (!relatedEventsData["image"])
                relatedEventsData["image"] = eventsBanner[count];
              tempArr.push({ ...relatedEventsData });
              if (count === eventsBanner.length - 1) count = 0;
              count++;

              // Upcoming events
              if (relatedEventsCount === countToPush) {
                tempRelatedEventsArr.push([...tempArr]);
                relatedEventsCount = 0;
                tempArr = [];
              } else {
                relatedEventsCount++;
              }
            }
            structuredRelatedEventsArr = [...tempRelatedEventsArr];
          }

          if (upcomingEventsApi && upcomingEventsApi.length > 0) {
            let count = 0;
            let upcomingEventCount = 0;
            let tempArr = [];
            let countToPush = "";

            if (upcomingEventsApi.length === 1) countToPush = 0;
            if (upcomingEventsApi.length === 2) countToPush = 1;
            if (upcomingEventsApi.length > 2) countToPush = 2;
            // Past Events Api Data
            for (const [i, upcomingEventsData] of upcomingEventsApi.entries()) {
              if (!upcomingEventsData["image"])
                upcomingEventsData["image"] = eventsBanner[count];
              tempArr.push({ ...upcomingEventsData });
              if (count === eventsBanner.length - 1) count = 0;
              count++;

              // Upcoming events
              if (upcomingEventCount === countToPush) {
                upcomingEventsArr.push([...tempArr]);
                upcomingEventCount = 0;
                tempArr = [];
              } else {
                upcomingEventCount++;
              }
            }
            structuredUpcomingEventsArr = [...upcomingEventsArr];
          }
          const splicedPastEventArr = pastEventsArr.splice(0, 6);
          setSplicedPastEvents([...pastEventsArr]);

          setAllUpcomingEvents(upcomingEventsApi);
          setMobileUpcomingEvents(upcomingEventsApi);
          setAllPastEvents([...pastEventsApi]);
          setMobilePastEvents([...pastEventsApi]);

          setUpcomingEvents(structuredUpcomingEventsArr);
          setRelatedEvents(structuredRelatedEventsArr);
          setMobileRelatedEvents([...pastEventsApi]);
          // setUpcomingEvents([...upcomingEventsResult]);
          setPastEvents([...splicedPastEventArr]);
          // setLastPage(result.eventsPage.last_page);

          setIsPastEvents(false);
          setIsUpcomingEvents(false);
        } else {
          setIsPastEvents(false);
          setIsUpcomingEvents(false);
        }
      })
      .catch((err) => {
        setIsPastEvents(false);
        setIsUpcomingEvents(false);
      });
  }

  useEffect(() => {
    handleWindowResize();
    eventApi();
    // Events.setEventFunctions(getEventOrganizerNames, handleViewEventDetails);

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (isViewMorePastEvents) {
      eventApi();
      setIsViewMorePastEvents(false);
    }
  }, [isViewMorePastEvents]);

  return (
    <div>
      <section
        className={`eventSection upev-bg eventheight mg-top`}
      // className={`eventSection upev-bg eventheight ${
      //   upcomingEvents && upcomingEvents.length === 0 ? "mg-top" : ""
      // }`}
      // style={{ marginBottom: "10rem" }}
      >
        <div style={{ position: "relative" }}>
          {isUpcomingEvents ? (
            <div
              className="spinner-border"
              role="status"
              style={{
                // position: "absolute",
                // right: "10rem",
                color: "#1c1777",
              }}
              id="upcomingEventsLoader"
            >
              {/* <span class="sr-only">Loading...</span> */}
            </div>
          ) : (
            // <section className="eventSection upev-bg eventheight mg-top">
            <div>
              <div>
                <h2 className="textCap">Upcoming Events</h2>
                {upcomingEvents && upcomingEvents.length > 0 ? (
                  windowDimension.width <= 767 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                        alignContent: "center",
                      }}
                    >
                      {mobileUpcomingEvents &&
                        mobileUpcomingEvents.length > 0 &&
                        mobileUpcomingEvents.map(
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
                            event_for,
                          }) => (
                            <EventsCard
                              eventImage={image}
                              eventHeading={name}
                              eventDate={from_date}
                              eventTime={from_date}
                              eventVenue={venue}
                              eventFor={event_for}
                              eventOrganizers={getEventOrganizerNames(
                                event_speakers
                              )}
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
                                upcomingEventsArr: mobileUpcomingEvents,
                                isRegister: true,
                                isEventDetailsPage: false,
                                organizerNameFn: () => null,
                                jsonfn: () => null,
                                routerHistory: null,
                                originalData: [],
                                event_speakers,
                                mobileDimension: isMobile,
                                mobileUpcomingEvents,
                                mobileRelatedEvents,
                                relatedEvents,
                                history,
                                event_for,
                              })}
                              profileImageArr={event_speakers}
                              // profileImageArr={hosted_by}
                              uniqueId={id}
                            />
                          )
                        )}
                    </div>
                  ) : (
                    <EventsCarousel
                      eventsData={upcomingEvents}
                      getEventOrganizerNames={getEventOrganizerNames}
                      handleViewEventDetails={handleViewEventDetails}
                      upcomingDataArr={upcomingEvents}
                      isEventDetailsPage={false}
                    />
                  )
                ) : (
                  <h3 id="noUpcomingEvents">No Upcoming Events</h3>
                )}
              </div>
            </div>
            // </section>
          )}
        </div>
        <div className="container-wrapper">
          <div className="row">
            <h2
              className="textCap"
              style={{
                marginTop: "6rem",
                // marginTop: Dimensions._windowWidth < 1000 ? "8rem" : "2rem",
              }}
            >
              Past Events
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
            >
              {isPastEvents ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{
                    // position: "absolute",
                    // right: "10rem",
                    color: "#1c1777",
                  }}
                >
                  {/* <span class="sr-only">Loading...</span> */}
                </div>
              ) : pastEvents && pastEvents.length > 0 ? (
                pastEvents.map(
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
                      eventOrganizers={getEventOrganizerNames(event_speakers)}
                      // eventOrganizers={getEventOrganizerNames(hosted_by)}
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
                        upcomingEventsArr: [],
                        isRegister: false,
                        isEventDetailsPage: false,
                        organizerNameFn: () => null,
                        jsonfn: () => null,
                        routerHistory: null,
                        originalData: [],
                        event_speakers,
                        mobileDimension: isMobile,
                        mobileUpcomingEvents,
                        mobileRelatedEvents,
                        relatedEvents,
                        history,
                        event_for,
                      })}
                      profileImageArr={event_speakers}
                      uniqueId={id}
                    />
                  )
                )
              ) : (
                <h5
                  style={{
                    marginTop: "10px",
                  }}
                >
                  No Past Events
                </h5>
              )}
            </div>
            <div className="container-wrapper">
              <div className="row">
                <div className="d-flex align-item-center justify-center mt-5">
                  <Button
                    className="btn btn-primary m-auto"
                    disabled={splicedPastEvents.length === 0}
                    name="1"
                    id="btn-view"
                    onClick={handleViewMoreEvents}
                  >
                    View More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default observer(NewEvents);

{
  /* {isEventDetails ? (
  <EventsDetails
    id={eventDetails.id}
    name={eventDetails.name}
    image={eventDetails.image}
    from_date={eventDetails.from_date}
    venue={eventDetails.venue}
    organizer_details={eventDetails.organizer_details}
    description={eventDetails.description}
  />
) : (
  <>
    
  </>
)} */
}

/*
  <div>
              <div>
                <h2 className="textCap">Upcoming Events</h2>
                {upcomingEvents && upcomingEvents.length > 0 ? (
                  <EventsCarousel
                    eventsData={upcomingEvents}
                    getEventOrganizerNames={getEventOrganizerNames}
                    handleViewEventDetails={handleViewEventDetails}
                    upcomingDataArr={upcomingEvents}
                    isEventDetailsPage={false}
                  />
                ) : (
                  <h3 id="noUpcomingEvents">No Upcoming Events</h3>
                )}
              </div>
            </div>
*/
