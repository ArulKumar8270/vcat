// import React, { Component } from 'react'
// import { callApi } from '../libraries/Api';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { AiFillInstagram } from "react-icons/ai";
// import { IoIosMail } from "react-icons/io";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Modal from 'react-bootstrap/Modal'
// import ModalBody from "react-bootstrap/ModalBody";
// import profile from '../components/img/profile.png';
// import log from '../components/img/log.png';

// class About extends Component {
//     state = {
//         aboutData: [],
//         bannerData: [],
//         pageInfo: [],
//         userData: [],
//         aboutLeaderHead: [],
//         users: [],
//         LeadId: '',
//         userModal: false,
//         userMessage: '',
//         selectedUser: {},
//         selectedOccupation: {},
//         chairman: {},
//         viceChairman: {},
//         pastChairman: {},
//         JointSecretary: {},
//         Secretary: {},
//         Treasurer: {},
//         member: {},
//         Wingusers: []

//     }
//     handleSelect = (id) => {

//         // const wing = e;
//         const membersId = 'users';

//         callApi(membersId, {}, 'GET', id).then((response) => {
//             if (response.statuscode === 200) {
//                 const result = response.result;
//                 const Wingusers = result.users;
//                 let chairman = [];
//                 let viceChairman = [];
//                 let member = [];
//                 let pastChairman = [];
//                 let JointSecretary = [];
//                 let Secretary = [];
//                 let Treasurer = [];

//                 for (let i in Wingusers) {
//                     const selectedOccupation = Wingusers[i].occupation;
//                     if (selectedOccupation === "President") {
//                         chairman.push(Wingusers[i]);
//                     }
//                     else if (selectedOccupation === "Vice President") {
//                         viceChairman.push(Wingusers[i]);

//                     }
//                     else if (selectedOccupation === "Past President") {
//                         pastChairman.push(Wingusers[i]);
//                     }
//                     else if (selectedOccupation === "Secretary") {
//                         Secretary.push(Wingusers[i]);
//                     }
//                     else if (selectedOccupation === "Joint Secretary") {
//                         JointSecretary.push(Wingusers[i]);
//                     }

//                     else if (selectedOccupation === "Treasurer") {
//                         Treasurer.push(Wingusers[i]);
//                     }
//                     else{
//                         member.push(Wingusers[i]);
//                     }

//                 }

//                 this.setState({
//                     membersIdBody: result.users,
//                     users: result.users,
//                     LeadId: id,
//                     userData: result.users,
//                     chairman: chairman,
//                     viceChairman: viceChairman,
//                     pastChairman: pastChairman,
//                     member: member,
//                     JointSecretary: JointSecretary,
//                     Secretary:Secretary,
//                     Treasurer:Treasurer
//                 });
//             }
//         }).catch((error) => {
//             console.log("API Error => ", error);
//         });
//         return false;
//     }
//     handleClick = (e, user_id) => {
//         if (e !== '') {
//             const { userData } = this.state;
//             const user = userData;
//             let selectedUser = {};
//             for (let i in user) {
//                 if (user[i].id === user_id) {
//                     selectedUser = user[i];
//                     break;
//                 }
//             }
//             this.setState({
//                 selectedUser: selectedUser,
//             })
//         }

//         this.setState({
//             userModal: true,
//         })
//     }

//     handleClose = (e) => {
//         this.setState({ userModal: false });

//     }

//     componentDidMount() {
//         const functionUrl = 'pages';
//         const requestBody = {
//             page: 'about_us'
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             if (response.statuscode === 200) {
//                 const result = response.result;

//                 this.setState({
//                     bannerData: result.bannerData[0],
//                     pageInfo: result.pageInfo[0],
//                     userData: result.userData,
//                     events: result.events,
//                     aboutLeaderHead: [{
//                         name: 'BOARD OF TRUSTEES',
//                         id: 1
//                     }, {
//                         name: 'Mentors',
//                         id: 2
//                     }, {
//                         name: 'Past Presidents',
//                         id: 3
//                     }]

//                 }, () => {
//                     this.handleSelect(1);
//                 });
//             }
//         });

//         // call API

//     }

//     render() {
//         const { LeadId, pageInfo, aboutLeaderHead, bannerData, pastChairman, member, chairman, viceChairman, JointSecretary,Secretary ,Treasurer} = this.state;
//         return (
//             <div>
//                 <section className='mg-top'>
//                     <div className="sub-herosection abouthero-bg " style={{ backgroundImage: "url(" + bannerData.image + ")" }}>
//                         <div className="container-wrapper ">
//                             {/* <div className="overlay boxShadow ">
//                                 <div className="carl-caption text-start">
//                                     <h1>{bannerData.title === null || bannerData.title === ""?"No Title":bannerData.title}</h1>
//                                     <p>{bannerData.content === null || bannerData.content === ""?"No content":bannerData.content}</p>
//                                 </div>
//                             </div> */}
//                         </div>
//                     </div>
//                 </section>
//                 {/* <!-- section2: About Us --> */}
//                 < section className="aboutpagesection eventheight" >
//                     <div className="container-wrapper d-flex">
//                         <div className="row">
//                             <div className="col-12 ">
//                                 <div className="aboutpagePara">
//                                     <p><div className="aboutpageImgae m-3" >
//                                         {/* {pageInfo.option_1 === null || pageInfo.option_1 === "" ? */}
//                                             <img src={log} alt="" width="100%" />
//                                         {/* //     :
//                                         //     <img src={pageInfo.option_1} alt="" width="100%" style={{ float: 'right', height: '15rem', width: '15rem' }} />
//                                         // } */}
//                                     </div> <p dangerouslySetInnerHTML={{ __html: pageInfo.content }}>
//                                         </p>

//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section >
//                 <section className="section-team eventheight">
//                     <div className="container-wrapper">
//                         {/* <!-- Start Header Section --> */}
//                         <div className="row justify-content-center  text-center">
//                             <div className="col-md-8 col-lg-8">
//                                 <div className="header-section">
//                                     <div className="container">
//                                         <div className="row board-row">
//                                             {aboutLeaderHead.map((lead, i) => {
//                                                 return (
//                                                     <div key={i} className="col-sm-2 col-md-4 col-lg-4 col-xl-4">
//                                                         <h3 className={parseInt(LeadId) && parseInt(LeadId) === lead.id ? "leaderActive leader-toggleBtn" : "leader-toggleBtn"} >
//                                                             <button className="button-wing" name={lead.id} onClick={() => this.handleSelect(lead.id)}>{lead.name}</button>
//                                                         </h3>
//                                                     </div>

//                                                 );
//                                             })}

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <!-- / End Header Section --> */}
//                         <div className="row">
//                             {/* <!-- Chairman Person --> */}
//                             {chairman.length > 0 && chairman.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                             {/* <!-- viceChairman  Person --> */}

//                             {viceChairman.length > 0 && viceChairman.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                             {/* <!-- pastChairman  Person --> */}

//                             {pastChairman.length > 0 && pastChairman.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                             {/* <!-- members  Person --> */}

//                             {Secretary.length > 0 && Secretary.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }

//                             {JointSecretary.length > 0 && JointSecretary.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                             {Treasurer.length > 0 && Treasurer.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                             {member.length > 0 && member.map((user, i) => {
//                                 return this.renderUser(user, i)
//                             }
//                             )
//                             }
//                         </div>
//                     </div>
//                 </section>
//                 {this.renderUserModal()}

//             </div >
//         )
//     }
//     renderUser = (user, i) => {
//         return (
//             <div key={i} className="col-6 col-sm-3 col-lg-3 col-xl-2 padd-0"><div className="single-person" onClick={(e) => this.handleClick(e, user.id, user.occupation)}>
//                     <div className="person-image">
//                         {user.image === null || user.image === "" ?
//                             <img src={profile} alt="profile" /> :
//                             <img src={user.image} alt="profile" />}
//                     </div>
//                     <div className="person-info">
//                         <h4 className="full-name">{user.name === null || user.name===""?"User Name":user.name}</h4>
//                         <span className="speciality">{user.occupation === null || user.occupation === "" ?
//                         "None":user.occupation}</span>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     renderUserModal = () => {
//         const { selectedUser } = this.state;

//         return (
//             <div >
//                 {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
//                 {Object.keys(selectedUser).length > 0 ?
//                     <Modal show={this.state.userModal} className="user-popup-section">
//                         <Modal.Header>
//                             <button className='popup-button closeText' onClick={this.handleClose}>Close<span><AiOutlineCloseCircle /></span></button>
//                         </Modal.Header>
//                         <ModalBody>
//                             <div className='userInfo '>
//                                 <p>
//                                     <div className=" userBlock">
//                                         <div className="single-user" >
//                                             <div className="user-image">
//                                                 {selectedUser.image === null || selectedUser.image === "" ?
//                                                     <img src={profile} alt="profile" /> :
//                                                     <img src={selectedUser.image} alt="profile" />}
//                                             </div>
//                                             <div className="user-info">
//                                                 <h4 className="full-name">{selectedUser.name === null || selectedUser.name === ""?"User Name":selectedUser.name}</h4>
//                                                 <span className="speciality">{selectedUser.occupation === null || selectedUser.occupation === ""?"User occupation":selectedUser.occupation}</span>
//                                             </div>
//                                             <div className="social-medialinks dflex justify-center">
//                                                 <a href={"tel: " + selectedUser.mobile_number}> <FaPhoneAlt /></a>
//                                                 <a href={"mailto: " + selectedUser.email}><IoIosMail /></a>
//                                                 {selectedUser.option_1 === 'true' ? <a href="/"><AiFillInstagram /></a> : <a></a>}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="userMessage">
//                                         <p dangerouslySetInnerHTML={{ __html: selectedUser.discription === null || selectedUser.discription=== ""?" No Data ":selectedUser.discription }}></p>
//                                     </div>
//                                 </p>
//                             </div>
//                         </ModalBody>
//                     </Modal>
//                     :
//                     null
//                 }
//             </div>
//         )
//     }
// }

// export default About

import React, { Component } from "react";
import { callApi } from "../libraries/Api";
import { FaPhoneAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoIosMail } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import profile from "../components/img/profile.png";
import log from "../components/img/log.png";

class About extends Component {
  state = {
    aboutData: [],
    bannerData: [],
    pageInfo: [],
    userData: [],
    aboutLeaderHead: [],
    users: [],
    LeadId: "",
    userModal: false,
    userMessage: "",
    selectedUser: {},
    selectedOccupation: {},
    chairman: {},
    viceChairman: {},
    pastChairman: {},
    JointSecretary: {},
    Secretary: {},
    Treasurer: {},
    member: {},
    Wingusers: [],
  };
  handleSelect = (id) => {
    // const wing = e;
    const membersId = "users";

    callApi(membersId, {}, "GET", id)
      .then((response) => {
        if (response.statuscode === 200) {
          const result = response.result;
          const Wingusers = result.users;
          let chairman = [];
          let viceChairman = [];
          let member = [];
          let pastChairman = [];
          let JointSecretary = [];
          let Secretary = [];
          let Treasurer = [];

          for (let i in Wingusers) {
            const selectedOccupation = Wingusers[i].occupation;
            const isSearch = selectedOccupation?.search("Past President");
            if (selectedOccupation === "President") {
              chairman.push(Wingusers[i]);
            } else if (selectedOccupation === "Vice President") {
              viceChairman.push(Wingusers[i]);
            } else if (isSearch !== -1) {
              pastChairman.push(Wingusers[i]);
            } else if (selectedOccupation === "Secretary") {
              Secretary.push(Wingusers[i]);
            } else if (selectedOccupation === "Joint Secretary") {
              JointSecretary.push(Wingusers[i]);
            } else if (selectedOccupation === "Treasurer") {
              Treasurer.push(Wingusers[i]);
            } else {
              member.push(Wingusers[i]);
            }
          }

          let sortedVicePresident = [];
          if (viceChairman && viceChairman.length > 0) {
            const refArr = [...viceChairman];
            for (let i = 0; i < viceChairman.length; i++) {
              const poppedElement = refArr.pop();
              sortedVicePresident.push({ ...poppedElement });
            }
          }
          let sortedMember = [];
          if (member && member.length > 0) {
            sortedMember = member.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
          }
          // let jointSec = [];
          // if (JointSecretary && JointSecretary.length > 0) {
          //     jointSec = JointSecretary.sort(( a, b ) => {
          //         if ( a.name < b.name ){
          //           return -1;
          //         }
          //         if ( a.name > b.name ){
          //           return 1;
          //         }
          //         return 0;
          //       })
          // }

          this.setState({
            membersIdBody: result.users,
            users: result.users,
            LeadId: id,
            userData: result.users,
            chairman: chairman,
            viceChairman: sortedVicePresident,
            // viceChairman: viceChairman,
            pastChairman: pastChairman,
            member: sortedMember,
            // JointSecretary: jointSec,
            JointSecretary,
            Secretary: Secretary,
            Treasurer: Treasurer,
          });
        }
      })
      .catch((error) => {
        console.log("API Error => ", error);
      });
    return false;
  };
  handleClick = (e, user_id) => {
    if (e !== "") {
      const { userData } = this.state;
      const user = userData;
      let selectedUser = {};
      for (let i in user) {
        if (user[i].id === user_id) {
          selectedUser = user[i];
          break;
        }
      }
      this.setState({
        selectedUser: selectedUser,
      });
    }

    this.setState({
      userModal: true,
    });
  };

  handleClose = (e) => {
    this.setState({ userModal: false });
  };

  componentDidMount() {
    const functionUrl = "pages";
    const requestBody = {
      page: "about_us",
    };
    callApi(functionUrl, requestBody).then((response) => {
      if (response.statuscode === 200) {
        const result = response.result;

        this.setState(
          {
            bannerData: result.bannerData[0],
            pageInfo: result.pageInfo[0],
            userData: result.userData,
            events: result.events,
            aboutLeaderHead: [
              {
                name: "BOARD OF TRUSTEES",
                id: 1,
              },
              {
                name: "Mentors",
                id: 2,
              },
              {
                name: "Past Presidents",
                id: 3,
              },
            ],
          },
          () => {
            this.handleSelect(1);
          }
        );
      }
    });

    // call API
  }

  render() {
    const {
      LeadId,
      pageInfo,
      aboutLeaderHead,
      pastChairman,
      member,
      chairman,
      viceChairman,
      JointSecretary,
      Secretary,
      Treasurer,
    } = this.state;
    return (
      <div>
        {/* <section className='mg-top' style={{backgroundColor:"#f4f4f4"}}>
                    <div className="sub-herosection abouthero-bg " style={{ backgroundImage: "url(" + bannerData.image + ")",height:"90vh" }}>
                        <div className="container-wrapper ">
                            <div className="overlay boxShadow ">
                                <div className="carl-caption text-start">
                                    <h1>{bannerData.title === null || bannerData.title === ""?"No Title":bannerData.title}</h1>
                                    <p>{bannerData.content === null || bannerData.content === ""?"No content":bannerData.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
        {/* <!-- section2: About Us --> */}
        <section
          className="aboutpagesection mg-top eventheight"
          style={{ marginTop: "4rem" }}
        >
          <div className="container-wrapper d-flex">
            <div className="border padd2">
              <div className="row">
                <div className="col-12 ">
                  <div className="aboutpagePara">
                    <p>
                      <div className="aboutpageImgae m-3">
                        {/* {pageInfo.option_1 === null || pageInfo.option_1 === "" ? */}
                        <img src={log} alt="" width="100%" />
                        {/* //     :
                                        //     <img src={pageInfo.option_1} alt="" width="100%" style={{ float: 'right', height: '15rem', width: '15rem' }} />
                                        // } */}
                      </div>{" "}
                      <p
                        dangerouslySetInnerHTML={{ __html: pageInfo.content }}
                      ></p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-team eventheight">
          <div className="container-wrapper">
            {/* <!-- Start Header Section --> */}
            <div className="row justify-content-center  text-center">
              <div className="col-md-8 col-lg-8">
                <div className="header-section">
                  <div className="container">
                    <div className="row board-row">
                      {aboutLeaderHead.map((lead, i) => {
                        return (
                          <div
                            key={i}
                            className="col-sm-2 col-md-4 col-lg-4 col-xl-4"
                          >
                            <h3
                              className={
                                parseInt(LeadId) && parseInt(LeadId) === lead.id
                                  ? "leaderActive leader-toggleBtn"
                                  : "leader-toggleBtn"
                              }
                            >
                              <button
                                className="button-wing"
                                name={lead.id}
                                onClick={() => this.handleSelect(lead.id)}
                              >
                                {lead.name}
                              </button>
                            </h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- / End Header Section --> */}
            <div className="row d-flex flex-row justify-content-center">
              {/* <!-- Chairman Person --> */}
              {chairman.length > 0 &&
                chairman.map((user, i) => {
                  return this.renderUser(user, i);
                })}
              {/* <!-- viceChairman  Person --> */}

              {viceChairman.length > 0 &&
                viceChairman.map((user, i) => {
                  return this.renderUser(user, i);
                })}
              {/* <!-- pastChairman  Person --> */}

              {pastChairman.length > 0 &&
                pastChairman.map((user, i) => {
                  return this.renderUser(user, i);
                })}
              {/* <!-- members  Person --> */}

              {Secretary.length > 0 &&
                Secretary.map((user, i) => {
                  return this.renderUser(user, i);
                })}

              {JointSecretary.length > 0 &&
                JointSecretary.map((user, i) => {
                  return this.renderUser(user, i);
                })}
              {Treasurer.length > 0 &&
                Treasurer.map((user, i) => {
                  return this.renderUser(user, i);
                })}
              {member.length > 0 &&
                member.map((user, i) => {
                  return this.renderUser(user, i);
                })}
            </div>
          </div>
        </section>
        {this.renderUserModal()}
      </div>
    );
  }
  renderUser = (user, i) => {
    return (
      <div key={i} className="col-6 col-sm-3 col-lg-3 col-xl-2 padd-0">
        <div
          className="single-person"
          onClick={(e) => this.handleClick(e, user.id, user.occupation)}
        >
          <div className="person-image">
            {user.image === null || user.image === "" ? (
              <img src={profile} alt="profile" />
            ) : (
              <img src={user.image} alt="profile" />
            )}
          </div>
          <div className="person-info">
            <h4 className="full-name">
              {user.name === null || user.name === "" ? "User Name" : user.name}
            </h4>
            <span className="speciality">
              {/* {user.role_id === 1 ? "President"|| user.role_id === 2 ? "Vice President" || user.role_id === 3 ? "Secretary" || user.role_id === 4 ? "Joint Secretary"|| user.role_id === 5 ? "Treasurer" || "BOT Member"} */}
              {user.occupation === null || user.occupation === ""
                ? "None"
                : user.occupation}
            </span>
          </div>
        </div>
      </div>
    );
  };

  renderUserModal = () => {
    const { selectedUser } = this.state;

    return (
      <div>
        {/* object is used cause selectedUser is an array and it lenght  cant be accesed so its converted to object only to ckeck whether or not its empty */}
        {Object.keys(selectedUser).length > 0 ? (
          <Modal show={this.state.userModal} className="user-popup-section">
            <Modal.Header>
              <button
                className="popup-button closeText"
                onClick={this.handleClose}
              >
                Close
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </button>
            </Modal.Header>
            <ModalBody>
              <div className="userInfo ">
                {/* Below was a <p></p> */}
                <div>
                  <div className=" userBlock">
                    <div className="single-user">
                      <div className="user-image">
                        {selectedUser.image === null ||
                        selectedUser.image === "" ? (
                          <img src={profile} alt="profile" />
                        ) : (
                          <img src={selectedUser.image} alt="profile" />
                        )}
                      </div>
                      <div className="user-info">
                        <h4 className="full-name">
                          {selectedUser.name === null ||
                          selectedUser.name === ""
                            ? "User Name"
                            : selectedUser.name}
                        </h4>
                        <span className="speciality">
                          {selectedUser.occupation === null ||
                          selectedUser.occupation === ""
                            ? "User occupation"
                            : selectedUser.occupation}
                        </span>
                      </div>
                      <div className="social-medialinks dflex justify-center">
                        <a href={"tel: " + selectedUser.mobile_number}>
                          {" "}
                          <FaPhoneAlt />
                        </a>
                        <a href={"mailto: " + selectedUser.email}>
                          <IoIosMail />
                        </a>
                        {selectedUser.option_1 === "true" ? (
                          <a href="/">
                            &nbsp;
                            <AiFillInstagram />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="userMessage">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedUser.discription === null ||
                          selectedUser.discription === ""
                            ? " No Data "
                            : selectedUser.discription,
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>
        ) : null}
      </div>
    );
  };
}

export default About;
