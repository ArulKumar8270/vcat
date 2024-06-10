import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Dimensions from "../modals/Dimensions";
import EventsCard from "./EventsCard";
// const JSONfn = require("json-fn");
import JSONfn from "json-fn";
import Events from "../modals/Events";
import {
  getEventOrganizerNames as getOrganizerNames,
  handleViewEventDetails as getEventDetailsFunc,
} from "../libraries/eventHelpers";

const EventsCarousel = ({
  eventsData,
  getEventOrganizerNames,
  handleViewEventDetails,
  upcomingDataArr,
  isEventDetailsPage,
  originalData,
  isOtherEvents = true,
}) => {
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [indicatorStatus, setIndicatorStatus] = useState({
    0: true,
    1: false,
    2: false,
  });

  return (
    <div>
      <section
        className="hero"
        style={{
          marginBottom: Dimensions._windowWidth <= 510 ? "-7rem" : "-14rem",
        }}
      >
        <div>
          <div
            id="myCarousel"
            className="carousel slide eventCarousel"
            data-bs-ride="carousel"
            data-bs-pause={false}
            data-bs-interval="3000"
          >
            <div className="carousel-indicators">
              {eventsData &&
                eventsData.length > 0 &&
                eventsData.map((data, index) => {
                  if (data && data.length === 0) return null;
                  return (
                    <button
                      type="button"
                      data-bs-target="#myCarousel"
                      data-bs-slide-to={`${index}`}
                      className={
                        !isLoaded
                          ? indicatorStatus[index]
                            ? "active"
                            : ""
                          : "active"
                      }
                      // className={`${
                      //   index === eventsData.indexOf(data) && "active"
                      // }`}
                      aria-current={`${index === eventsData.indexOf(data) && "true"
                        }`}
                      aria-label={`Slide ${index}`}
                    />
                  );
                })}
            </div>
            <div className="carousel-inner banner">
              {eventsData &&
                eventsData.length > 0 &&
                eventsData.map((eventData, i) => {
                  return (
                    <>
                      <div
                        key={i}
                        className={`carousel-item  one ${i === 0 ? "active" : ""
                          }`}
                        style={{ height: "auto" }}
                      >
                        <div id="eventCarouselItemContainer">
                          {eventData &&
                            eventData.length > 0 &&
                            eventData.map((subData, subIndex) => {
                              return (
                                <EventsCard
                                  eventImage={subData.image}
                                  eventHeading={subData.name}
                                  eventDate={subData.from_date}
                                  eventTime={subData.from_date}
                                  eventVenue={subData.venue}
                                  eventFor={subData.event_for}
                                  eventOrganizers={getOrganizerNames(
                                    subData.event_speakers
                                  )}
                                  // eventOrganizers={getEventOrganizerNames(
                                  //   subData.hosted_by
                                  // )}
                                  eventButton={
                                    isOtherEvents ? "Register Now" : "Read More"
                                  }
                                  // handleEventAction={() => console.log(handleViewEventDetails, typeof handleViewEventDetails)}
                                  handleEventAction={() => getEventDetailsFunc({
                                    id: subData.id,
                                    name: subData.name,
                                    image: subData.image,
                                    from_date: subData.from_date,
                                    venue: subData.venue,
                                    organizer_details: subData.hosted_by,
                                    description: subData.description,
                                    event_tags: subData.event_tags,
                                    upcomingEventsArr: upcomingDataArr,
                                    isRegister: isOtherEvents ? true : false,
                                    isEventDetailsPage: isEventDetailsPage,
                                    organizerNameFn: getOrganizerNames,
                                    jsonfn: JSONfn,
                                    routerHistory: history,
                                    originalData,
                                    event_speakers: subData.event_speakers,
                                    mobileDimension: false,
                                    mobileUpcomingEvents: [],
                                    mobileRelatedEvents: eventsData,
                                    relatedEvents: eventsData,
                                    history,
                                    event_for: subData.event_for,
                                  })}
                                  // handleEventAction={() =>
                                  //   handleViewEventDetails(
                                  //     subData.id,
                                  //     subData.name,
                                  //     subData.image,
                                  //     subData.from_date,
                                  //     subData.venue,
                                  //     subData.hosted_by,
                                  //     subData.description,
                                  //     subData.event_tags,
                                  //     upcomingDataArr,
                                  //     isOtherEvents ? true : false,
                                  //     isEventDetailsPage,
                                  //     getEventOrganizerNames,
                                  //     JSONfn,
                                  //     history,
                                  //     originalData
                                  //   )
                                  // }
                                  profileImageArr={subData.event_speakers}
                                  // profileImageArr={subData.hosted_by}
                                  uniqueId={subData.id}
                                />
                              );
                            })}
                        </div>
                      </div>
                      <a
                        className="carousel-control-prev eventCarouselIndicatorBackground"
                        href="#myCarousel"
                        role="button"
                        data-bs-slide="prev"
                        id="prevIcon"
                      >
                        <span
                          className="carousel-control-prev-icon eventCarouselIcon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Previous</span>
                      </a>
                      <a
                        className="carousel-control-next eventCarouselIndicatorBackground"
                        href="#myCarousel"
                        role="button"
                        data-bs-slide="next"
                        id="nextIcon"
                      >
                        <span
                          className="carousel-control-next-icon eventCarouselIcon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Next</span>
                      </a>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsCarousel;
