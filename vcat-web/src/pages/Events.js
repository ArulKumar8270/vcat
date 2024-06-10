// import React, { Component } from "react";
// import { callApi } from "../libraries/Api";
// import Button from "react-bootstrap/Button";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Modal from "react-bootstrap/Modal";
// import ModalBody from "react-bootstrap/ModalBody";
// import * as moment from "moment";
// import EventRegister from "../components/EventRegister";
// import profile from "../components/img/profile.png";
// import event from "../components/img/event.png";
// import { Link } from "react-router-dom";

// class Events extends Component {
//   state = {
//     eventsData: [],
//     UpcomingEventsData: [],
//     bannerData: [],
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
//     selectedEventHost: {},
//     event_id: [],
//     Wingusers: [],
//     selectedEventImage: {},
//     status: false,
//   };
//   componentDidMount() {
//     this.eventApi();
//     // call API
//   }

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
//       let selectedEventHost = {};
//       for (let i in event) {
//         // console.log("event[i].id ===>", event[i].id, ", event_id ===>", event_id);
//         if (event[i].id === event_id) {
//           selectedEventData = event[i];
//           // selectedEventName = event[i];
//           selectedEventHost = event[i].user;
//           break;
//         }
//       }
//       // console.log("selectedEventHost",selectedEventHost)
//       // console.log("selectedEventData",selectedEventData)
//       this.setState({
//         selectedEventData: selectedEventData,
//         selectedEventHost: selectedEventHost,
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

//   render() {
//     const {
//       eventsData,
//       UpcomingEventsData,
//       eventTitle,
//       UpcomingEventsTitle,
//       bannerData,
//     } = this.state;
//     return (
//       <div>
//         {/* <!-- section1: navbar, hero carousel --> */}
//         <section className="mg-top">
//           <div id="header"></div>
//           <div
//             className="sub-herosection ev-bg"
//             style={{ backgroundImage: "url(" + bannerData.image + ")" }}
//           >
//             <div className="container-wrapper">
//               <div className="overlay boxShadow ">
//                 <div className="carl-caption text-start">
//                   <h1>
//                     {bannerData.title === null || bannerData.title === ""
//                       ? "Title"
//                       : bannerData.title}
//                   </h1>
//                   <p>
//                     {bannerData.content === null || bannerData.content === ""
//                       ? "No Content"
//                       : bannerData.content}
//                   </p>
//                   <Link
//                     className="btn btn-lg btn-primary boxShadow"
//                     to="/contact"
//                   >
//                     VCAT CONNECT
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* <!-- section2: About Us --> */}
//         {UpcomingEventsData.length > 0 ? (
//           <section className="eventSection upev-bg">
//             <div className="container-wrapper">
//               <div className="row">
//                 <h2>
//                   {UpcomingEventsTitle === null || UpcomingEventsTitle === ""
//                     ? "Title"
//                     : UpcomingEventsTitle}
//                 </h2>
//                 <div className="container">
//                   <div className="row">
//                     <div
//                       id="myCarousel"
//                       className="carousel slide upevent-slider"
//                       data-bs-ride="carousel"
//                     >
//                       <div className="carousel-inner">
//                         {UpcomingEventsData.map((UPevent, i) => {
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
//                                     className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
//                                     style={{ margin: "auto" }}
//                                   >
//                                     <div className="eventSection__content">
//                                       <div className="eventSection__contentbody">
//                                         <h2 className="mb-2 textCap">
//                                           {UPevent.name === null ||
//                                           UPevent.name === ""
//                                             ? "Event name"
//                                             : UPevent.name}
//                                         </h2>
//                                         <p className="mb-2">
//                                           {" "}
//                                           {UPevent.description === null ||
//                                           UPevent.description === ""
//                                             ? "Event description"
//                                             : UPevent.description}
//                                           <span className="displayonlyLargeScreen"></span>
//                                         </p>
//                                         <div className="eS-subcontent">
//                                           <img
//                                             src={
//                                               UPevent.user.image === null ||
//                                               UPevent.user.image === ""
//                                                 ? profile
//                                                 : UPevent.user.image
//                                             }
//                                             alt="event"
//                                           />
//                                           <div className="eS-subcontent__persondetails mt-2">
//                                             <h3 className="textCap">
//                                               {UPevent.user.name === null ||
//                                               UPevent.user.name === ""
//                                                 ? "User Name"
//                                                 : UPevent.user.name}{" "}
//                                             </h3>
//                                             <p className="textCap">
//                                               {UPevent.user.occupation ===
//                                                 null ||
//                                               UPevent.user.occupation === ""
//                                                 ? "User occupation"
//                                                 : UPevent.user.occupation}
//                                             </p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                       <button
//                                         className="btn btn-lg btn-primary"
//                                         onClick={() =>
//                                           this.setState({
//                                             status: true,
//                                             selectedEventData: UPevent,
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
//                                           "url(" + UPevent.image + ")",
//                                         height: "30rem",
//                                       }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                       <div className="carousel-indicators event-slider">
//                         <button
//                           type="button"
//                           data-bs-target="#myCarousel"
//                           data-bs-slide-to="0"
//                           className="active"
//                           aria-current="true"
//                           aria-label="Slide 1"
//                         ></button>
//                         <button
//                           type="button"
//                           data-bs-target="#myCarousel"
//                           data-bs-slide-to="1"
//                           aria-label="Slide 2"
//                         ></button>
//                         <button
//                           type="button"
//                           data-bs-target="#myCarousel"
//                           data-bs-slide-to="2"
//                           aria-label="Slide 3"
//                         ></button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ) : null}
//         <section className="eventSection upev-bg eventheight">
//           <div className="container-wrapper">
//             <div className="row ">
//               <h2 className="textCap">{eventTitle}</h2>
//               <div className="container-wrapper">
//                 <div className="row">
//                   {eventsData.length > 0 &&
//                     eventsData.map((event, i) => {
//                       const str = event.description;
//                       var sliced = str.slice(0, 70);
//                       return (
//                         <div
//                           key={i}
//                           className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
//                         >
//                           <div className="card m-btm m-auto ">
//                             <img
//                               src={
//                                 event.image == null || event.image === ""
//                                   ? event
//                                   : event.image
//                               }
//                               className="card-img-top"
//                               alt="event_image"
//                             />
//                             <div className="card-body">
//                               <h5 className="card-title  textCap">
//                                 {event.name == null || event.name === ""
//                                   ? "Event Name"
//                                   : event.name}
//                               </h5>
//                               <p className="card-text mb-0">{sliced}...</p>
//                               <p className="card-button mt-1">
//                                 <Button
//                                   onClick={(e) => this.handleClick(e, event.id)}
//                                   className="btn btn-primary"
//                                 >
//                                   Learn more
//                                 </Button>
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   <div className="d-flex align-item-center justify-center lg-screen mt-5">
//                     <Button
//                       className="btn btn-primary m-auto"
//                       disabled={
//                         this.state.LastPage &&
//                         this.state.LastPage > this.state.Current_page
//                           ? false
//                           : true
//                       }
//                       name="1"
//                       id="btn-view"
//                       onClick={this.handleSelect}
//                     >
//                       View More
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         {this.renderUserModal()}
//         {this.renderEventRegister()}
//       </div>
//     );
//   }

//   renderUserModal = () => {
//     // const { selectedEventImage, selectedEventTitle, selectedEventData } = this.state;
//     return (
//       <div>
//         {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
//         {/* {Object.keys(selectedUser).length > 0 ? */}
//         <Modal show={this.state.userModal} className="event-page-popup">
//           <Modal.Header>
//             <button
//               className="popup-button closeText"
//               onClick={this.handleClose}
//             >
//               Close
//               <span>
//                 <AiOutlineCloseCircle />
//               </span>
//             </button>
//           </Modal.Header>
//           <ModalBody>
//             <div className="event-info ">{this.renderEventCarasol()}</div>
//           </ModalBody>
//         </Modal>
//         {/* :
//                     null
//                 } */}
//       </div>
//     );
//   };

//   renderEventRegister = () => {
//     const { selectedEventData } = this.state;
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
//             <div className="event-info ">
//               <div id="herosection">
//                 <div className="container-wrapper">
//                   <div className="event-popup-info row">
//                     <div className="col-6 left">
//                       <div className="register-form-image">
//                         <img
//                           src={
//                             selectedEventData.image === null ||
//                             selectedEventData.image === ""
//                               ? event
//                               : selectedEventData.image
//                           }
//                           alt="upcoming-event"
//                         />
//                       </div>
//                       <div className="userMessage event-reg-text">
//                         <p>
//                           {selectedEventData.description === null ||
//                           selectedEventData.description === ""
//                             ? "Event description"
//                             : selectedEventData.description}
//                         </p>
//                         <p
//                           dangerouslySetInnerHTML={{
//                             __html:
//                               selectedEventData.discription === null ||
//                               selectedEventData.description === ""
//                                 ? "Event description"
//                                 : selectedEventData.description,
//                           }}
//                         ></p>
//                       </div>
//                     </div>
//                     <div className="col-6">
//                       <EventRegister
//                         name={selectedEventData.name}
//                         venue={selectedEventData.venue}
//                         image={selectedEventData.image}
//                         meetingType={selectedEventData.meeting_type}
//                         fromDate={selectedEventData.from_date}
//                         toDate={selectedEventData.to_date}
//                         status={this.state.status}
//                         closeModel={() => this.setState({ status: false })}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </ModalBody>
//         </Modal>
//         {/* :
//                     null
//                 } */}
//       </div>
//     );
//   };

//   renderEventCarasol() {
//     const { selectedEventData, selectedEventHost } = this.state;
//     return (
//       <div id="herosection">
//         <div
//           id="myCarousel"
//           className="carousel slide home-banner"
//           data-bs-ride="carousel"
//         >
//           <div className="carousel-inner">
//             {/* ${i === 0 ? 'active' : ''} */}
//             <div
//               className={` carousel-back-image`}
//               style={{
//                 backgroundImage: "url(" + selectedEventData.image + ")",
//               }}
//             ></div>
//           </div>
//         </div>

//         <div className="container-wrapper">
//           <div className="event-popup-info">
//             <div className="event-heading mb-4">
//               <h1 className=" mb-5">
//                 {selectedEventData.name === null ||
//                 selectedEventData.name === ""
//                   ? "Event name"
//                   : selectedEventData.name}
//               </h1>
//               <div className="host-name mb-4 dflex">
//                 <h5>Event Speaker :</h5>
//                 <h5 style={{ fontWeight: "700" }}>
//                   {selectedEventHost.name === null ||
//                   selectedEventHost.name === ""
//                     ? "Host name"
//                     : selectedEventHost.name}
//                 </h5>
//               </div>
//               <div className="dflex time">
//                 <h6>Date :</h6>
//                 <h6 style={{ fontWeight: "700" }}>
//                   {moment(selectedEventData.from_date).format("Do MMM YYYY")}
//                   {/* <span style={{ marginLeft: "1rem" }}>
//                                         {moment(selectedEventData.created_at).format(' h:mm A')}
//                                     </span> */}
//                 </h6>
//               </div>

//               {/* <p><Link className="btn btn-lg btn-primary boxShadow" to={`${banner.option_1}`}>Learn More</Link></p> */}
//             </div>
//             <div className="userMessage">
//               <p
//                 dangerouslySetInnerHTML={{
//                   __html:
//                     selectedEventData.discription === null ||
//                     selectedEventData.description === ""
//                       ? "Event description"
//                       : selectedEventData.description,
//                 }}
//               ></p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Events;

import React, { Component } from 'react'
import { callApi } from '../libraries/Api';
import Button from 'react-bootstrap/Button';
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal'
import ModalBody from "react-bootstrap/ModalBody";
import * as moment from 'moment';
import EventRegister from '../components/EventRegister';
import event from '../components/img/event.png';
import whitebanner from '../components/img/whitebanner.jpg';
import vcatbanner from '../components/img/vcatbanner.jpg';

class Events extends Component {
    state = {
        eventsData: [],
        UpcomingEventsData: [],
        bannerData: [],
        eventTitle: '',
        UpcomingEventsTitle: ' ',
        Current_page: 1,
        LastPage: 0,
        isDisabled: false,
        value: 0,
        newData: [],
        userModal: false,
        eventRegister: false,
        selectedEventData: {},
        selectedEventHost: {},
        event_id: [],
        Wingusers: [],
        selectedEventImage: {},
        status: false,
    }
    componentDidMount() {
        this.eventApi();
        // call API
    }

    eventApi = () => {
        const functionUrl = 'pages';
        const requestBody = {
            page: 'events',
            currentPage: this.state.Current_page,
            size: 3
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
                    eventTitle: ' PAST EVENTS',
                    UpcomingEventsTitle: 'UPCOMING EVENTS',
                    LastPage: result.eventsPage.last_page,

                });
            }
        });
    }
    handleClick = (e, event_id) => {
        if (e !== '') {
            const { eventsData } = this.state;
            const event = eventsData;

            let selectedEventData = {};
            let selectedEventHost = {};
            for (let i in event) {
                // console.log("event[i].id ===>", event[i].id, ", event_id ===>", event_id);
                if (event[i].id === event_id) {
                    selectedEventData = event[i];
                    // selectedEventName = event[i];
                    selectedEventHost = event[i].user;
                    break;
                }
            }
            // console.log("selectedEventHost",selectedEventHost)
            // console.log("selectedEventData",selectedEventData)
            this.setState({
                selectedEventData: selectedEventData,
                selectedEventHost: selectedEventHost,
            })

        }

        this.setState({
            userModal: true,
        })

    }

    handleClose = (e) => {
        this.setState({ userModal: false });

    }

    handleSelect = (e) => {
        this.setState({ Current_page: this.state.Current_page + 1 }, () => {
            this.eventApi();

        })
    }
    //     render() {
    //         return (<>
    //         {this.renderEventRegister()}</>)
    // }
    render() {
        const { eventsData, UpcomingEventsData, eventTitle, UpcomingEventsTitle, bannerData } = this.state;
        return (
            <div>
                {/* <!-- section1: navbar, hero carousel --> */}
                <section className='mg-top'>
                    <div id="header"></div>
                    <div className="sub-herosection ev-bg" style={{ backgroundImage: "url(" + bannerData.image + ")" }}>
                        <div className="container-wrapper">
                            <div className="overlay boxShadow ">
                                <div className="carl-caption text-start">
                                    <h1>{bannerData.title === null || bannerData.title === "" ? null : bannerData.title}</h1>
                                    <p>{bannerData.content === null || bannerData.content === "" ? null : bannerData.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- section2: About Us --> */}
                {UpcomingEventsData.length > 0 ?
                    <section className="eventSection upev-bg">
                        <div className="container-wrapper">

                            <div className="row">
                                <h2>{UpcomingEventsTitle === null || UpcomingEventsTitle === "" ? "Title" : UpcomingEventsTitle}</h2>
                                <div className="container">
                                    <div className="row">
                                        <div id="myCarousel" className="carousel slide upevent-slider" data-bs-ride="carousel">

                                            <div className="carousel-inner">
                                                {UpcomingEventsData.map((UPevent, i) => {
                                                    return (
                                                        <div key={i} className={`carousel-item evntCarousel boxShadow ${i === 0 ? 'active' : ''}`}>
                                                            <div className="container-fluid">
                                                                <div className="carl-caption text-start">
                                                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" style={{ margin: 'auto' }}>
                                                                        <div className="eventSection__content">
                                                                            <div className="eventSection__contentbody">
                                                                                <h2 className="mb-2 textCap">{UPevent.name === null || UPevent.name === "" ? null : UPevent.name}</h2>
                                                                                <p dangerouslySetInnerHTML={{ __html: UPevent.discription === null || UPevent.description === "" ? null : UPevent.description }}></p>
                                                                                {/* {UPevent.user === "" || UPevent.user === null ? null: */}
                                                                                <div className="eS-subcontent">
                                                                                    {/* <img src={UPevent.user.image === null || UPevent.user.image===""?profile:UPevent.user.image} alt="event" /> */}
                                                                                    {/* <div className="eS-subcontent__persondetails mt-2 dflex">
                                                                                        <p>Speaker :</p>
                                                                                        <h3 className="textCap">{UPevent.hosted_by === null || UPevent.hosted_by === "" ? "To be decided" : UPevent.hosted_by} </h3>
                                                                                    </div> */}
                                                                                </div>
                                                                                {/* } */}
                                                                            </div>
                                                                            <button className="btn btn-lg btn-primary" onClick={() => this.setState({ status: true, selectedEventData: UPevent })}>Register Now</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" style={{ margin: 'auto' }}>
                                                                        {UPevent.image === null || UPevent.image === "" ?
                                                                            <div className="event_bg-img mt-2" style={{ backgroundImage: "url(" + vcatbanner + ")", height: '28rem' }} >
                                                                            </div>
                                                                            :
                                                                            <div className="event_bg-img mt-2" style={{ backgroundImage: "url(" + UPevent.image + ")", height: '28rem' }} >
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="carousel-indicators event-slider">
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </section>
                    : null}
                <section className="eventSection upev-bg eventheight">
                    <div className="container-wrapper">
                        <div className="row ">
                            <h2 className="textCap">{eventTitle}</h2>
                            <div className="container-wrapper">
                                <div className="row">
                                    {eventsData.length > 0 && eventsData.map((event, i) => {
                                      console.log("event", event);
                                        const str = event.description;
                                        var sliced = str.slice(0, 70);
                                        return (

                                            <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                                                <div className="card m-btm m-auto " >
                                                    <img src={event.image || ""} className="card-img-top" alt="event_image" style={{ borderBottom: "0.8px solid #dddcdc" }} />
                                                    <div className="card-body">
                                                        <h5 className="card-title  textCap">{event.name == null || event.name === "" ? null : event.name}</h5>
                                                        <p className="card-text mb-0">{sliced}...</p>
                                                        <p className="card-button mt-1">
                                                            <Button onClick={(e) => this.handleClick(e, event.id)} className="btn btn-primary">Learn more</Button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="d-flex align-item-center justify-center lg-screen mt-5">
                                        <Button className="btn btn-primary m-auto" disabled={this.state.LastPage && this.state.LastPage > this.state.Current_page ? false : true}
                                            name="1" id="btn-view" onClick={this.handleSelect}>View More</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {this.renderUserModal()}
                {this.renderEventRegister()}
            </div>
        )
    }


    renderUserModal = () => {
        // const { selectedEventImage, selectedEventTitle, selectedEventData } = this.state;
        return (
            <div>
                {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
                {/* {Object.keys(selectedUser).length > 0 ? */}
                <Modal show={this.state.userModal} className="event-page-popup">
                    <Modal.Header>
                        <button className='popup-button closeText' onClick={this.handleClose}>Close<span><AiOutlineCloseCircle /></span></button>
                    </Modal.Header>
                    <ModalBody>
                        <div className='event-info '>
                            {this.renderEventCarasol()}
                        </div>
                    </ModalBody>
                </Modal>
                {/* :
                    null
                } */}
            </div>
        )
    }

    renderEventRegister = () => {

        const { selectedEventData } = this.state;
        return (
            <div>

                {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
                {/* {Object.keys(selectedUser).length > 0 ? */}
                <Modal show={this.state.status} className="event-page-popup eventRegister">
                    <Modal.Header>
                        <button className='popup-button closeText  register-form' onClick={() => this.setState({ status: false })}>Close<span><AiOutlineCloseCircle /></span></button>
                    </Modal.Header>
                    <ModalBody>
                        <div className='event-info '>
                            <div id='herosection'>
                                <div className="container-wrapper">
                                    <div className="event-popup-info row">
                                        <div className="col-6 left" >
                                            <div className="register-form-image">
                                                <img src={selectedEventData.image === null || selectedEventData.image === "" ? event : selectedEventData.image} alt="upcoming-event" />
                                            </div>
                                            <div className="userMessage event-reg-text">
                                                {/* <p>{selectedEventData.description === null || selectedEventData.description === ""? "Event description" :selectedEventData.description}</p> */}
                                                <p dangerouslySetInnerHTML={{ __html: selectedEventData.discription === null || selectedEventData.description === "" ? "Event description" : selectedEventData.description }}></p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <EventRegister name={selectedEventData.name} venue={selectedEventData.venue} image={selectedEventData.image} meetingType={selectedEventData.meeting_type} fromDate={selectedEventData.from_date} toDate={selectedEventData.to_date} status={this.state.status}
                                                closeModel={() => this.setState({ status: false })} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                {/* :
                    null
                } */}
            </div>
        )
    }



    renderEventCarasol() {
        const { selectedEventData, selectedEventHost } = this.state;
        return (
            <div id='herosection'>
                <div id="myCarousel" className="carousel slide home-banner" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {/* ${i === 0 ? 'active' : ''} */}
                        {selectedEventData.image === null || selectedEventData.image === "" ?
                            <div className={` carousel-back-image`} style={{ backgroundImage: "url(" + whitebanner + ")" }}>
                            </div>
                            :
                            <div className={` carousel-back-image`} style={{ backgroundImage: "url(" + selectedEventData.image + ")" }}>
                            </div>}
                    </div>
                </div>

                <div className="container-wrapper">
                    <div className="event-popup-info">
                        <div className="event-heading mb-4">
                            <h1 className=" mb-5">{selectedEventData.name === null || selectedEventData.name === "" ? "Event name" : selectedEventData.name}</h1>
                            <div className="host-name mb-4 dflex">
                                <h5>Event Speaker :</h5>
                                <h5 style={{ fontWeight: '700' }} >{selectedEventHost.name === null || selectedEventHost.name === "" ? "Host name" : selectedEventHost.name}</h5>
                            </div>
                            <div className="dflex time">
                                <h6>Date :</h6><h6 style={{ fontWeight: '700' }}>
                                    {moment(selectedEventData.from_date).format('MMM DD YYYY')}
                                    {/* <span style={{ marginLeft: "1rem" }}>
                                        {moment(selectedEventData.created_at).format(' h:mm A')}
                                    </span> */}
                                </h6>
                            </div>

                            {/* <p><Link className="btn btn-lg btn-primary boxShadow" to={`${banner.option_1}`}>Learn More</Link></p> */}
                        </div>
                        <div className="userMessage">
                            <p dangerouslySetInnerHTML={{ __html: selectedEventData.discription === null || selectedEventData.description === "" ? "Event description" : selectedEventData.description }}></p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default Events

