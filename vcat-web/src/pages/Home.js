// import React from "react";
// // import { Footer, Header } from '../components'
// import { callApi } from "../libraries/Api";
// import { Link } from "react-router-dom";
// import about2 from "../components/img/about2.png";
// import EventRegister from "../components/EventRegister";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Modal from "react-bootstrap/Modal";
// import ModalBody from "react-bootstrap/ModalBody";
// import profile from "../components/img/profile.png";
// import about from "../components/img/about.png";
// import event from "../components/img/event.png";
// import w1 from "../components/img/wings/w1.png";

// class Home extends React.Component {
//   state = {
//     bannerData: [],
//     pageInfo: [],

//     aboutTitle: "",
//     aboutInfo: "",
//     aboutLink: "",
//     eventsData: [],
//     wingsData: [],
//     status: false,
//     UpcomingEventsData: [],
//     eventTitle: "",
//     UpcomingEventsTitle: " ",
//     Current_page: 1,
//     LastPage: 0,
//     isDisabled: false,
//     value: 0,
//     newData: [],
//     userModal: false,
//     eventRegister: false,
//     selectedEventData: {},
//     selectedEventTitle: {},
//     event_id: [],
//     Wingusers: [],
//     selectedEventImage: {},
//   };

//   eventApi = () => {
//     const functionUrl = "pages";
//     const requestBody = {
//       page: "events",
//       currentPage: this.state.Current_page,
//       size: 3,
//     };

//     callApi(functionUrl, requestBody).then((response) => {
//       if (response.statuscode === 200) {
//         const result = response.result;
//         let data = this.state.eventsData;
//         const resultData = result.eventsPage.data;
//         if (resultData.length > 0) {
//           for (let i in resultData) {
//             data.push(resultData[i]);
//           }
//         }
//         this.setState({
//           eventsData: data,
//           UpcomingEventsData: result.upcoming_events,
//           bannerData: result.bannerData[0],
//           eventTitle: "EVENT",
//           UpcomingEventsTitle: " Upcoming Events",
//           LastPage: result.eventsPage.last_page,
//         });
//       }
//     });
//   };
//   handleClick = (e, event_id) => {
//     if (e !== "") {
//       const { eventsData } = this.state;
//       const event = eventsData;

//       let selectedEventData = {};
//       let selectedEventTitle = {};
//       let selectedEventImage = {};
//       for (let i in event) {
//         if (event[i].id === event_id) {
//           selectedEventData = event[i];
//           // selectedEventName = event[i];
//           selectedEventTitle = event[i].name;
//           selectedEventImage = event[i];
//           break;
//         }
//       }
//       this.setState({
//         selectedEventData: selectedEventData,
//         selectedEventTitle: selectedEventTitle.description,
//         selectedEventImage: selectedEventImage,
//       });
//     }

//     this.setState({
//       userModal: true,
//     });
//   };

//   handleClose = (e) => {
//     this.setState({ userModal: false });
//   };

//   handleSelect = (e) => {
//     this.setState({ Current_page: this.state.Current_page + 1 }, () => {
//       this.eventApi();
//     });
//   };

//   componentDidMount() {
//     const functionUrl = "pages";
//     const requestBody = {
//       page: "home",
//     };
//     callApi(functionUrl, requestBody).then((response) => {
//       if (response.statuscode === 200) {
//         const result = response.result;
//         const pageInfo = result.pageInfo;
//         let aboutTitle = "",
//           aboutInfo = "";
//         for (let i in pageInfo) {
//           if (pageInfo[i]["page"].match(/aboutus/g)) {
//             aboutTitle = pageInfo[i]["title"];
//             aboutInfo = pageInfo[i]["content"];
//           }
//         }

//         this.setState({
//           bannerData: result.bannerData,
//           pageInfo: result.pageInfo,
//           eventsData: result.upcoming_events,
//           aboutTitle,
//           aboutInfo,
//           aboutLink: "/about",
//         });
//       }
//     });

//     const wingUrl = "pages";
//     const wingBody = {
//       page: "wings",
//     };
//     callApi(wingUrl, wingBody).then((response) => {
//       if (response.statuscode === 200) {
//         const result = response.result;

//         this.setState({
//           wingsData: result.wings,
//         });
//       }
//     });
//     const eventsUrl = "pages";
//     const eventsBody = {
//       page: "home",
//     };
//     callApi(eventsUrl, eventsBody).then((response) => {
//       if (response.statuscode === 200) {
//         const result = response.result;

//         this.setState({
//           eventsData: result.upcoming_events,
//         });
//       }
//     });
//   }

//   render() {
//     return (
//       <div>
//         {this.HeroBanner()}
//         {this.HomeAbout()}
//         <div className="bg-both">
//           {this.HomeWings()}
//           {this.HomeEvents()}
//         </div>
//       </div>
//     );
//   }

//   HeroBanner = () => {
//     const { bannerData } = this.state;
//     // const truncate = (input) =>
//     // input?.length > 400 ? `${input.substring(0, 310)}...` : input;
//     return (
//       <div>
//         <section className="hero">
//           <div id="herosection">
//             <div
//               id="myCarousel"
//               className="carousel slide home-banner"
//               data-bs-ride="carousel"
//               data-bs-interval="3000"
//             >
//               <div className="carousel-indicators">
//                 <button
//                   type="button"
//                   data-bs-target="#myCarousel"
//                   data-bs-slide-to="0"
//                   className="active"
//                   aria-current="true"
//                   aria-label="Slide 1"
//                 ></button>
//                 <button
//                   type="button"
//                   data-bs-target="#myCarousel"
//                   data-bs-slide-to="1"
//                   aria-label="Slide 2"
//                 ></button>
//                 <button
//                   type="button"
//                   data-bs-target="#myCarousel"
//                   data-bs-slide-to="2"
//                   aria-label="Slide 3"
//                 ></button>
//               </div>
//               <div className="carousel-inner banner">
//                 {bannerData.length > 0 &&
//                   bannerData.map((banner, i) => {
//                     return (
//                       <div
//                         key={i}
//                         className={`carousel-item  one ${
//                           i === 0 ? "active" : ""
//                         }`}
//                         style={{ backgroundImage: "url(" + banner.image + ")" }}
//                       >
//                         <div className="container-wrapper">
//                           <div className="container overlay boxShadow">
//                             <div className="carl-caption text-start">
//                               <h1>
//                                 {banner.title === null || banner.title === ""
//                                   ? "Banner Title"
//                                   : banner.title}
//                               </h1>
//                               <p
//                                 dangerouslySetInnerHTML={{
//                                   __html:
//                                     banner.content === null ||
//                                     banner.content === ""
//                                       ? "No Content"
//                                       : banner.content,
//                                 }}
//                               ></p>
//                               <p>
//                                 <Link
//                                   className="btn btn-lg btn-primary boxShadow"
//                                   to="/about"
//                                 >
//                                   Learn More
//                                 </Link>
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   };

//   HomeAbout = () => {
//     const { aboutTitle, aboutInfo } = this.state;
//     return (
//       <div className="HomeAbout">
//         <section className="aboutSection upev-bg about-pad">
//           <div className="container-fluid container-wrapper">
//             <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 ">
//               <div className="aboutSection__content boxShadow">
//                 <h2>
//                   {aboutTitle === null || aboutTitle === ""
//                     ? "About Title"
//                     : aboutTitle}
//                 </h2>
//                 <p
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       aboutInfo === null || aboutInfo === ""
//                         ? "No Content"
//                         : aboutInfo,
//                   }}
//                 ></p>
//                 <Link to="/about" className="btn btn-lg btn-primary">
//                   Learn More
//                 </Link>
//               </div>
//             </div>
//             <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 bg-aboutline">
//               <img
//                 src={about2 === null || about2 === "" ? about : about2}
//                 alt="aboutImage"
//                 width="100%"
//                 style={{ width: "70%" }}
//               />
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   };
//   HomeWings = () => {
//     const { wingsData } = this.state;
//     return (
//       <div className="HomeWings">
//         <section className="wingsSection">
//           <div className="container-wrapper">
//             <div className="row">
//               <h2>Wings</h2>
//               <div className="container-wrapper wingsSection__content">
//                 <div className="row ">
//                   {wingsData.map((wing, i) => {
//                     return (
//                       <div
//                         key={i}
//                         className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
//                       >
//                         <div className="card boxShadow">
//                           <img
//                             src={
//                               wing.image === null || wing.image === ""
//                                 ? w1
//                                 : wing.image
//                             }
//                             alt="wingImage"
//                             width="80px"
//                           />
//                           <h3>
//                             {wing.title === null || wing.title === ""
//                               ? "No Title"
//                               : wing.title}
//                           </h3>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   };

//   HomeEvents = () => {
//     const { eventsData } = this.state;
//     return (
//       <div className="events">
//         {eventsData.length > 0 ? (
//           <section className="eventSection">
//             <div className="container-fluid container-wrapper">
//               <div className="row">
//                 <h2>Upcoming Events</h2>
//                 <div className="container">
//                   <div className="row">
//                     <div
//                       id="myCarousel"
//                       className="carousel slide"
//                       data-bs-ride="carousel"
//                     >
//                       <div className="carousel-inner">
//                         {eventsData.map((event, i) => {
//                           return (
//                             <div
//                               key={i}
//                               className={`carousel-item evntCarousel boxShadow ${
//                                 i === 0 ? "active" : ""
//                               }`}
//                             >
//                               <div className="container-fluid">
//                                 <div className="carl-caption text-start">
//                                   <div
//                                     className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 "
//                                     style={{ margin: "auto" }}
//                                   >
//                                     <div className="eventSection__content mr-4">
//                                       <div className=" tcap eventSection__contentbody">
//                                         <h2>
//                                           {event.name === null ||
//                                           event.name === ""
//                                             ? "Event name"
//                                             : event.name}
//                                         </h2>
//                                         <br />
//                                         <p>
//                                           {event.description === null ||
//                                           event.description === ""
//                                             ? "Event description"
//                                             : event.description}{" "}
//                                           <span className="displayonlyLargeScreen">
//                                             {" "}
//                                             {event.eventsSlideInfoSpan}
//                                           </span>
//                                         </p>
//                                         <div className="eS-subcontent">
//                                           <img
//                                             src={
//                                               event.user.image === null ||
//                                               event.user.image === ""
//                                                 ? profile
//                                                 : event.user.image
//                                             }
//                                             alt="userImage"
//                                           />
//                                           <div className="eS-subcontent__persondetails mt-2">
//                                             <h3>
//                                               {event.user.name === null ||
//                                               event.user.name === ""
//                                                 ? "User Name"
//                                                 : event.user.name}
//                                             </h3>
//                                             <p>
//                                               {event.user.occupation === null ||
//                                               event.user.occupation === ""
//                                                 ? "User occupation"
//                                                 : event.user.occupation}
//                                             </p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                       <button
//                                         className="btn btn-lg btn-primary"
//                                         onClick={() =>
//                                           this.setState({
//                                             status: true,
//                                             selectedEventData: event,
//                                           })
//                                         }
//                                       >
//                                         Register Now
//                                       </button>
//                                     </div>
//                                   </div>
//                                   <div
//                                     className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
//                                     style={{ margin: "auto" }}
//                                   >
//                                     <div
//                                       className="event_bg-img mt-2"
//                                       style={{
//                                         backgroundImage:
//                                           "url(" + event.image + ")",
//                                         height: "30rem",
//                                         backgroundSize: "cover",
//                                       }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ) : null}
//         {this.renderEventRegister()}
//       </div>
//     );
//   };

//   renderEventRegister = () => {
//     // const { selectedEventImage, selectedEventTitle, selectedEventData } = this.state;
//     return (
//       <div>
//         {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
//         {/* {Object.keys(selectedUser).length > 0 ? */}
//         <Modal
//           show={this.state.status}
//           className="event-page-popup eventRegister"
//         >
//           <Modal.Header>
//             <button
//               className="popup-button closeText  register-form"
//               onClick={() => this.setState({ status: false })}
//             >
//               Close
//               <span>
//                 <AiOutlineCloseCircle />
//               </span>
//             </button>
//           </Modal.Header>
//           <ModalBody>
//             <div className="event-info ">{this.renderEventRegForm()}</div>
//           </ModalBody>
//         </Modal>
//         {/* :
//                     null
//                 } */}
//       </div>
//     );
//   };

//   renderEventRegForm() {
//     const { selectedEventData } = this.state;
//     return (
//       <div id="herosection">
//         <div className="container-wrapper">
//           <div className="event-popup-info row">
//             <div className="col-6 left">
//               <div className="register-form-image">
//                 <img
//                   src={
//                     selectedEventData.image === null ||
//                     selectedEventData.image === ""
//                       ? event
//                       : selectedEventData.image
//                   }
//                   alt="event"
//                 />
//               </div>
//               <div className="userMessage event-reg-text">
//                 <p
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       selectedEventData.description === null ||
//                       selectedEventData.description === ""
//                         ? "Event Description"
//                         : selectedEventData.description,
//                   }}
//                 ></p>
//               </div>
//             </div>
//             <div className="col-6">
//               <EventRegister
//                 name={selectedEventData.name}
//                 status={this.state.status}
//                 closeModel={() => this.setState({ status: false })}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Home;

import React from "react";
import { callApi } from "../libraries/Api";
import { Link } from "react-router-dom";
import about2 from "../components/img/about2.png";
import EventRegister from "../components/EventRegister";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import about from "../components/img/about.png";
import event from "../components/img/event.png";
import vcatbanner from "../components/img/vcatbanner.jpg";
import wingss from "../components/img/wingss.png";
// import "../components/css/main.css";
import "../components/css/pagestyle.css";

class Home extends React.Component {
  state = {
    bannerData: [],
    pageInfo: [],

    aboutTitle: "",
    aboutInfo: "",
    aboutLink: "",
    eventsData: [],
    wingsData: [],
    status: false,
    UpcomingEventsData: [],
    eventTitle: "",
    UpcomingEventsTitle: " ",
    Current_page: 1,
    LastPage: 0,
    isDisabled: false,
    value: 0,
    newData: [],
    userModal: false,
    eventRegister: false,
    selectedEventData: {},
    selectedEventTitle: {},
    event_id: [],
    Wingusers: [],
    selectedEventImage: {},
    windowDimension: {
      width: 1200,
      height: 800,
    },
  };

  eventApi = () => {
    const functionUrl = "pages";
    const requestBody = {
      page: "events",
      currentPage: this.state.Current_page,
      size: 3,
    };

    callApi(functionUrl, requestBody).then((response) => {
      if (response.statuscode === 200) {
        const result = response.result;
        let data = this.state.eventsData;
        const resultData = result.eventsPage.data;
        if (resultData.length > 0) {
          for (let i in resultData) {
            data.push(resultData[i]);
          }
        }
        this.setState({
          eventsData: data,
          UpcomingEventsData: result.upcoming_events,
          bannerData: result.bannerData[0],
          eventTitle: "EVENT",
          UpcomingEventsTitle: " Upcoming Events",
          LastPage: result.eventsPage.last_page,
        });
      }
    });
  };
  handleClick = (e, event_id) => {
    if (e !== "") {
      const { eventsData } = this.state;
      const event = eventsData;

      let selectedEventData = {};
      let selectedEventTitle = {};
      let selectedEventImage = {};
      for (let i in event) {
        if (event[i].id === event_id) {
          selectedEventData = event[i];
          // selectedEventName = event[i];
          selectedEventTitle = event[i].name;
          selectedEventImage = event[i];
          break;
        }
      }
      this.setState({
        selectedEventData: selectedEventData,
        selectedEventTitle: selectedEventTitle.description,
        selectedEventImage: selectedEventImage,
      });
    }

    this.setState({
      userModal: true,
    });
  };

  handleClose = (e) => {
    this.setState({ userModal: false });
  };

  handleSelect = (e) => {
    this.setState({ Current_page: this.state.Current_page + 1 }, () => {
      this.eventApi();
    });
  };

  componentDidMount() {
    this.handleWindowResize();

    const functionUrl = "pages";
    const requestBody = {
      page: "home",
    };
    callApi(functionUrl, requestBody).then((response) => {
      if (response.statuscode === 200) {
        const result = response.result;
        const pageInfo = result.pageInfo;
        let aboutTitle = "",
          aboutInfo = "";
        for (let i in pageInfo) {
          if (pageInfo[i]["page"].match(/aboutus/g)) {
            aboutTitle = pageInfo[i]["title"];
            aboutInfo = pageInfo[i]["content"];
          }
        }

        this.setState({
          bannerData: result.bannerData,
          pageInfo: result.pageInfo,
          eventsData: result.upcoming_events,
          aboutTitle,
          aboutInfo,
          aboutLink: "/about",
        });
      }
    });

    const wingUrl = "pages";
    const wingBody = {
      page: "wings",
    };
    callApi(wingUrl, wingBody).then((response) => {
      if (response.statuscode === 200) {
        const result = response.result;

        this.setState({
          wingsData: result.wings,
        });
      }
    });
    const eventsUrl = "pages";
    const eventsBody = {
      page: "home",
    };
    callApi(eventsUrl, eventsBody).then((response) => {
      if (response.statuscode === 200) {
        const result = response.result;

        this.setState({
          eventsData: result.upcoming_events,
        });
      }
    });

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

    const { innerWidth, innerHeight } = getWindowSize();
    this.setState({
      windowDimension: {
        ...this.state.windowDimension,
        width: innerWidth,
        height: innerHeight,
      },
    });
  };

  render() {
    const { windowDimension } = this.state;
    return (
      <div>
        {windowDimension.width <= 767 // 575
          ? this.mobileHeroBanner()
          : this.HeroBanner()}
        {this.HomeAbout()}
        <div className="bg-both">
          {this.HomeWings()}
          {this.HomeEvents()}
        </div>
      </div>
    );
  }

  mobileHeroBanner = () => (
    <div className="mobileHeroBannerContainer">
      <section>
        <div>
          <img
            className="mobileHeroBanner"
            src="https://vcat.co.in/staging/vcat-api/public/storage/document/1657515075.png"
            alt="Mobile_Hero_Banner"
          />
        </div>
        {/* <div className="mobileHeroBanner" /> */}
      </section>
    </div>
  );

  HeroBanner = () => {
    const { bannerData } = this.state;
    // const truncate = (input) =>
    // input?.length > 400 ? `${input.substring(0, 310)}...` : input;
    return (
      <div>
        <section className="hero">
          <div id="herosection">
            <div
              id="myCarousel"
              className="carousel slide home-banner"
              data-bs-ride="carousel"
              data-bs-pause={false}
              data-bs-interval="3000"
            >
              {/* <div className="carousel-indicators">
                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div> */}
              <div className="carousel-inner banner">
                {bannerData.length > 0 &&
                  bannerData.map((banner, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          className={`carousel-item  one ${
                            i === 0 ? "active" : ""
                          }`}
                          style={{
                            backgroundImage: "url(" + banner.image + ")",
                          }}
                          id="homeImageBanner"
                        >
                          <div className="container-wrapper">
                            {banner.title === "" ||
                            banner.title === null ? null : (
                              <div className="container overlay boxShadow">
                                <div className="carl-caption text-start">
                                  <h1>
                                    {banner.title === null ||
                                    banner.title === ""
                                      ? null
                                      : banner.title}
                                  </h1>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        banner.content === null ||
                                        banner.content === ""
                                          ? null
                                          : banner.content,
                                    }}
                                  ></p>
                                  {banner.content === "" ||
                                  banner.content === null ? null : (
                                    <p>
                                      <Link
                                        className="btn btn-lg btn-primary boxShadow"
                                        to="/about"
                                      >
                                        {banner.title === ""
                                          ? null
                                          : "Learn More"}
                                      </Link>
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <a
                          className="carousel-control-prev carouselIndicatorBackground"
                          href="#myCarousel"
                          role="button"
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon carousalIcon"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Previous</span>
                        </a>
                        <a
                          className="carousel-control-next carouselIndicatorBackground"
                          href="#myCarousel"
                          role="button"
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon carousalIcon"
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

  HomeAbout = () => {
    const { aboutTitle, aboutInfo } = this.state;
    return (
      <div className="HomeAbout">
        <section className="aboutSection upev-bg about-pad">
          <div className="container-fluid container-wrapper">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 ">
              <div className="aboutSection__content boxShadow" id="about">
                <h2>
                  {aboutTitle === null || aboutTitle === ""
                    ? "About Title"
                    : aboutTitle}
                </h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      aboutInfo === null || aboutInfo === "" ? null : aboutInfo,
                  }}
                ></p>
                <Link to="/about" className="btn btn-lg btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 bg-aboutline">
              <img
                src={about2 === null || about2 === "" ? about : about2}
                alt="aboutImage"
                width="100%"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </section>
      </div>
    );
  };
  HomeWings = () => {
    // const {  aboutInfo } = this.state;
    return (
      <div className="HomeAbout">
        <section className="aboutSection upev-bg about-pad">
          <div className="container-fluid container-wrapper">
            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 bg-aboutline">
              <img
                src={about2 === null || about2 === "" ? wingss : wingss}
                alt="aboutImage"
                width="100%"
                style={{ width: "500px", height: "500px", borderRadius: "50%" }}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 ">
              <div className="aboutSection__content boxShadow" id="wings">
                <h2>Wings</h2>
                <p
                // dangerouslySetInnerHTML={{ __html: aboutInfo === null || aboutInfo === "" ? null : aboutInfo }}
                >
                  To provide focus, momentum and scale up the extent of
                  activities being carried out by the trust, various wings were
                  formed with each wing spearheaded by a "Chairperson" and ably
                  supported by various members. Over the years, many wings were
                  formed to carry out or support the objectives of the trust
                </p>
                <Link to="/wing" className="btn btn-lg btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  HomeEvents = () => {
    const { eventsData } = this.state;
    return (
      <div className="events">
        {eventsData.length > 0 ? (
          <section className="eventSection">
            <div className="container-fluid container-wrapper">
              <div className="row">
                <h2>Upcoming Events</h2>
                <div className="container">
                  <div className="row">
                    <div
                      id="myCarousel"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {eventsData.map((event, i) => {
                          return (
                            <div
                              key={i}
                              className={`carousel-item evntCarousel boxShadow ${
                                i === 0 ? "active" : ""
                              }`}
                            >
                              <div className="container-fluid">
                                <div className="carl-caption text-start">
                                  <div
                                    className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 "
                                    style={{ margin: "auto" }}
                                  >
                                    <div className="eventSection__content mr-4">
                                      <div className=" tcap eventSection__contentbody">
                                        <h2 className="mb-1">
                                          {event.name === null ||
                                          event.name === ""
                                            ? null
                                            : event.name}
                                        </h2>
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              event.description === null ||
                                              event.description === ""
                                                ? null
                                                : event.description,
                                          }}
                                        ></p>
                                        <div className="eS-subcontent">
                                          {/* <img src={event.user.image === null || event.user.image === ""? profile :event.user.image} alt="userImage" /> */}
                                          {/* <div className="eS-subcontent__persondetails mt-2 dflex">
                                                                                        <p>Speaker :</p><h3>{event.hosted_by === null || event.hosted_by === "" ? "To be decided" : event.hosted_by}</h3>
                                                                                    </div> */}
                                        </div>
                                        {/* } */}
                                      </div>
                                      <button
                                        className="btn btn-lg btn-primary"
                                        onClick={() =>
                                          this.setState({
                                            status: true,
                                            selectedEventData: event,
                                          })
                                        }
                                      >
                                        Register Now
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                                    style={{ margin: "auto" }}
                                  >
                                    {event.image === null ||
                                    event.image === "" ? (
                                      <div
                                        className="event_bg-img mt-2"
                                        style={{
                                          backgroundImage:
                                            "url(" + vcatbanner + ")",
                                          height: "28rem",
                                          backgroundSize: "cover",
                                        }}
                                      ></div>
                                    ) : (
                                      <div
                                        className="event_bg-img mt-2"
                                        style={{
                                          backgroundImage:
                                            "url(" + event.image + ")",
                                          height: "28rem",
                                          backgroundSize: "cover",
                                        }}
                                      ></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {this.renderEventRegister()}
      </div>
    );
  };

  renderEventRegister = () => {
    // const { selectedEventImage, selectedEventTitle, selectedEventData } = this.state;
    return (
      <div>
        {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
        {/* {Object.keys(selectedUser).length > 0 ? */}
        <Modal
          show={this.state.status}
          className="event-page-popup eventRegister"
        >
          <Modal.Header>
            <button
              className="popup-button closeText  register-form"
              onClick={() => this.setState({ status: false })}
            >
              Close
              <span>
                <AiOutlineCloseCircle />
              </span>
            </button>
          </Modal.Header>
          <ModalBody>
            <div className="event-info ">{this.renderEventRegForm()}</div>
          </ModalBody>
        </Modal>
        {/* :
                    null
                } */}
      </div>
    );
  };

  renderEventRegForm() {
    const { selectedEventData } = this.state;
    return (
      <div id="herosection">
        <div className="container-wrapper">
          <div className="event-popup-info row">
            <div className="col-6 left">
              <div className="register-form-image">
                <img
                  src={
                    selectedEventData.image === null ||
                    selectedEventData.image === ""
                      ? event
                      : selectedEventData.image
                  }
                  alt="event"
                />
              </div>
              <div className="userMessage event-reg-text">
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedEventData.description === null ||
                      selectedEventData.description === ""
                        ? null
                        : selectedEventData.description,
                  }}
                ></p>
              </div>
            </div>
            <div className="col-6">
              <EventRegister
                name={selectedEventData.name}
                status={this.state.status}
                closeModel={() => this.setState({ status: false })}
                eventData={selectedEventData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
