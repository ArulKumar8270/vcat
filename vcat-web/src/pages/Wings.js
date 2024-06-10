// import React, { Component } from 'react'
// import { callApi } from '../libraries/Api';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import { FaPhoneAlt } from 'react-icons/fa';
// import { AiFillInstagram } from "react-icons/ai";
// import { IoIosMail } from "react-icons/io";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Modal from 'react-bootstrap/Modal'
// import profile from '../components/img/profile.png';
// import ModalBody from "react-bootstrap/ModalBody";



// class Wings extends Component {
//     state = {
//         bannerData: [],
//         pageInfo: [],
//         wingsData: [],
//         wingId: '',
//         wingsIdBody: [],
//         users: [],
//         selectTitle: 'Select Wing',
//         selectContent: '',
//         userModal: false,
//         selectedUser: {},
//         selectedOccupation: {},
//         chairman: {},
//         viceChairman: {},
//         pastChairman: {},
//         member: {},
//         Wingusers: []
//     }
//     handleClick = (e, user_id, user_occupation) => {
//         if (e !== '') {
//             const { users } = this.state;
//             const user = users;
//             let selectedUser = {};
//             for (let i in user) {
//                 if (user[i].id === user_id && user[i].occupation === user_occupation) {
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

//     handleSelect = (e) => {
//         if (e !== '') {
//             const { wingsData } = this.state;
//             const wing = wingsData[e];

//             const wingsId = 'wings';
//             callApi(wingsId, {}, 'GET', wing.id).then((response) => {

//                 if (response.statuscode === 200) {
//                     const result = response.result;
//                     console.log('result', result);
//                     const Wingusers = result.wingMember;
//                     let chairman = [];
//                     let viceChairman = [];
//                     let member = [];
//                     let pastChairman = [];

//                     for (let i in Wingusers) {
//                         const selectedOccupation = Wingusers[i].wing_role;
//                         if (selectedOccupation === "Chairperson") {
//                             chairman.push(Wingusers[i]);
//                             console.log('Chairperson', chairman)
//                         }
//                         else if (selectedOccupation === "Vice Chairperson") {
//                             viceChairman.push(Wingusers[i]);
//                             console.log('Vice Chairperson', viceChairman)

//                         }
//                         else if (selectedOccupation === "Past Chairperson" || selectedOccupation === "Co-Chairperson") {
//                             pastChairman.push(Wingusers[i]);
//                             console.log('Past Chairperson', pastChairman)
//                         }
//                         else {
//                             member.push(Wingusers[i]);
//                             console.log('Member', member)
//                         }

//                     }

//                     this.setState({
//                         chairman: chairman,
//                         viceChairman: viceChairman,
//                         pastChairman: pastChairman,
//                         member: member,
//                         wingsIdBody: result.wing,
//                         users: result.users,
//                         selectTitle: result.wing.title,
//                         selectContent: result.wing.content,
//                         Wingusers: result.wingMember
//                     });
//                 }
//             });
//         }
//     }
//     componentDidMount() {
//         // call API
//         const functionUrl = 'pages';
//         const requestBody = {
//             page: 'wings'
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             if (response.status === "success") {
//                 const result = response.result;
//                 console.log('result', result);
//                 const wingData = result.wings;
//                 let selectId = '';
//                 if (wingData.length > 0) {
//                     selectId = 0;
//                 }

//                 this.setState({
//                     wingsData: wingData,
//                     bannerData: result.bannerData[0],
//                     pageInfo: result.pageInfo[0],
//                 }, () => {
//                     this.handleSelect(selectId);
//                 });
//             }
//         });

//     }

//     render() {
//         const { bannerData, wingsData, selectTitle, selectContent, pastChairman, member, chairman, viceChairman } = this.state;
//         return (
//             <div>
//                 <section className='mg-top'>
//                     <div id="header"></div>
//                     <div className="sub-herosection abouthero-bg" style={{ backgroundImage: "url(" + bannerData.image + ")" }}>
//                         <div className="container-wrapper">
//                             <div className="overlay boxShadow ">
//                                 <div className="carl-caption text-start">
//                                     <h1>{bannerData.title === null || bannerData.title === ""? "No Title" :bannerData.title}</h1>
//                                     <p>{bannerData.content === null || bannerData.content === ""? "No Content" :bannerData.content}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 {/* <!-- section2--> */}
//                 <section className="aboutpagesection  eventheight wingsSection">
//                     <div className="container-wrapper">
//                         <div className="row">
//                             <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                                 <div className="aboutpagePara">
//                                     <h3 className='textleft'>Wings</h3>
//                                     <div className="headingDropdown">
//                                         <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                                             <h2 className='textleft'>{selectTitle === null || selectTitle === ""?"Title":selectTitle}</h2>
//                                         </div>
//                                         <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 rigthlarge">
//                                             <div className="dropdown " ref={this.container}>

//                                                 <DropdownButton
//                                                     alignRight
//                                                     onSelect={this.handleSelect}
//                                                     title={selectTitle}
//                                                     id="dropdown-menu-align-right"
//                                                 >
//                                                     {wingsData.map((wing, i) => {
//                                                         return (
//                                                             <Dropdown.Item key={i} eventKey={i} className="dropdown-item" value={wing.name}>{wing.title}
//                                                             </Dropdown.Item>

//                                                         );
//                                                     })}
//                                                 </DropdownButton>
//                                             </div>

//                                         </div>
//                                     </div>
//                                     <p className='textleft' dangerouslySetInnerHTML={{ __html: selectContent }}></p>
//                                     {/* <p className='textleft' dangerouslySetInnerHTML={pageInfo.option_1}></p> */}

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="section-team eventheight no-background">
//                         <div className="container-wrapper">
//                             <div className="row ">
//                                 {/* <!-- Chairman Person --> */}
//                                 {chairman.length > 0 && chairman.map((user, i) => {
//                                     return this.renderUser(user, i)
//                                 }
//                                 )
//                                 }
//                                 {/* <!-- viceChairman  Person --> */}

//                                 {viceChairman.length > 0 && viceChairman.map((user, i) => {
//                                     return this.renderUser(user, i)
//                                 }
//                                 )
//                                 }

//                                 {/* <!-- pastChairman  Person --> */}

//                                 {pastChairman.length > 0 && pastChairman.map((user, i) => {
//                                     return this.renderUser(user, i)
//                                 }
//                                 )
//                                 }

//                             {/* <!-- members  Person --> */}

//                                 {member.length > 0 && member.map((user, i) => {
//                                     return (
//                                         <div className="row jc-sb" >
//                                             {user.users.length > 0 && user.users.map((mem, j) => {
//                                                 return (
//                                                     <div className="single-person nohover column" key={j} >
//                                                         <div className="person-image">
//                                                             {/* style={{ width: '150px', height: '150px' }} onClick={(e) => this.handleClick(e, user.id, user.occupation)}*/}
//                                                             <img src={mem.image === null || mem.image === ""? profile :mem.image} alt="profile" />
//                                                         </div>
//                                                         <div className="person-info">
//                                                             <h4 className="full-name">{mem.name === null || mem.name === ""? "Member name" :mem.name}</h4>
//                                                             <span className="speciality">{user.wing_role === null || user.wing_role === ""? "Member Role" :user.wing_role}</span>
//                                                         </div>
//                                                     </div>
//                                                 )
//                                             })}
//                                         </div>
//                                     )
//                             }
//                             )
//                             }
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 {this.renderUserModal()}
//             </div>


//         );
//     }

//     renderUser = (user, i) => {
//         return (
//             <div className="single-person nohover column" key={i}>
//                 {user.users.length > 0 && user.users.map((mem, j) => {
//                     return (
//                         <div className="single-person nohover" key={j} >
//                             <div className="person-image">
//                                 {/* style={{ width: '150px', height: '150px' }} onClick={(e) => this.handleClick(e, user.id, user.occupation)}*/}
//                                 <img src={mem.image === null || mem.image === ""? profile :mem.image} alt="profile" />
//                             </div>
//                             <div className="person-info">
//                                 <h4 className="full-name">{mem.name === null || mem.name === ""? "Member name" :mem.name}</h4>
//                                 <span className="speciality">{user.wing_role === null || user.wing_role === ""? "Member Role" :user.wing_role}</span>
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         )

//     }

//     renderUserModal = () => {
//         const { selectedUser } = this.state;
//         return (
//             <div >
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
//                                                 <img src={selectedUser.image === null || selectedUser.image === ""? profile :selectedUser.image} alt="profile"/>
//                                             </div>
//                                             <div className="user-info">
//                                                 <h4 className="full-name">{selectedUser.name === null || selectedUser.name === ""? "User Name" :selectedUser.name}</h4>
//                                                 <span className="speciality">{selectedUser.occupation === null || selectedUser.occupation === ""? "User occupation" :selectedUser.occupation}</span>
//                                             </div>
//                                             <div className="social-medialinks dflex justify-center">
//                                                 <a href={"tel: " + selectedUser.mobile_number}> <FaPhoneAlt /></a>
//                                                 <a href={"mailto:" + selectedUser.email}><IoIosMail /></a>
//                                                 {selectedUser.option_1 === 'true' ? <a href="/"><AiFillInstagram /></a> : <a href='/'></a>}
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
// export default Wings

import  { Component } from 'react'
import { callApi } from '../libraries/Api';
import { FaPhoneAlt } from 'react-icons/fa';
import { AiFillInstagram } from "react-icons/ai";
import { IoIosMail } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal'
import profile from '../components/img/profile.png';
import ModalBody from "react-bootstrap/ModalBody";
import w1 from '../components/img/wings/w1.png';



class Wings extends Component {
    state = {
        bannerData: [],
        pageInfo: [],
        wingsData: [],
        wingId: '',
        wingsIdBody: [],
        users: [],
        selectTitle: 'Select Wing',
        selectContent: '',
        userModal: false,
        selectedUser: {},
        selectedOccupation: {},
        chairman: {},
        viceChairman: {},
        pastChairman: {},
        member: {},
        Wingusers: []
    }
    handleClick = (e, user_id, user_occupation) => {
        if (e !== '') {
            const { users } = this.state;
            const user = users;
            let selectedUser = {};
            for (let i in user) {
                if (user[i].id === user_id && user[i].occupation === user_occupation) {
                    selectedUser = user[i];
                    break;
                }
            }
            this.setState({
                selectedUser: selectedUser,
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
        const y = parseInt(e) -1;
        console.log("id", y)
        if (y !== '') {
            const { wingsData } = this.state;
            const wing = wingsData[e];

            const wingsId = 'wings';
            callApi(wingsId, {}, 'GET', wing.id).then((response) => {

                if (response.statuscode === 200) {
                    const result = response.result;
                    console.log('result', result);
                    const Wingusers = result.wingMember;
                    let chairman = [];
                    let viceChairman = [];
                    let member = [];
                    let pastChairman = [];

                    for (let i in Wingusers) {
                        const selectedOccupation = Wingusers[i].wing_role;
                        if (selectedOccupation === "Chairperson") {
                            chairman.push(Wingusers[i]);
                            console.log('Chairperson', chairman)
                        }
                        else if (selectedOccupation === "Vice Chairperson") {
                            viceChairman.push(Wingusers[i]);
                            console.log('Vice Chairperson', viceChairman)

                        }
                        else if (selectedOccupation === "Past Chairperson" || selectedOccupation === "Co-Chairperson") {
                            pastChairman.push(Wingusers[i]);
                            console.log('Past Chairperson', pastChairman)
                        }
                        else {
                            member.push(Wingusers[i]);
                            console.log('Member', member)
                        }

                    }

                    this.setState({
                        chairman: chairman,
                        viceChairman: viceChairman,
                        pastChairman: pastChairman,
                        member: member,
                        wingsIdBody: result.wing,
                        users: result.users,
                        selectTitle: result.wing.title,
                        selectContent: result.wing.content,
                        Wingusers: result.wingMember
                    });
                }
            });
        }
    }
    componentDidMount() {
        // call API
        const functionUrl = 'pages';
        const requestBody = {
            page: 'wings'
        };
        callApi(functionUrl, requestBody).then((response) => {
            if (response.status === "success") {
                const result = response.result;
                console.log('result', result);
                const wingData = result.wings;
                let selectId = '';
                if (wingData.length > 0) {
                    selectId = 0;
                }

                this.setState({
                    wingsData: wingData,
                    bannerData: result.bannerData[0],
                    pageInfo: result.pageInfo[0],
                }, () => {
                    this.handleSelect(selectId);
                });
            }
        });
    }  
    
HomeWings = () => {
    const { wingsData } = this.state;
    return (
        <div className='HomeWings'>
            <section className="wingsSection">
                <div className="container-wrapper">
                    <div className="row">
                        {/* <h2 className='mt-2 mb-2'>Wings</h2> */}
                        <div className="container-wrapper wingsSection__content mt-3">
                            <div className="row ">
                                {wingsData.map((wing, i) => {
                                    return (
                                        <div key={i}  style={{cursor:'pointer'}}
                                            className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 buttonCardNoStyle">
                                            <a href='#wingsSection'>
                                            <button onClick={()=>this.handleSelect(parseInt(wing.id)-1)}  style={{cursor:'pointer'}}
                                                className=" buttonCardNoStyle">
                                            <div className="card boxShadow">
                                                <img src={wing.image === null || wing.image===""? w1 :wing.image} alt="wingImage" width="80px" />
                                                <h3>{wing.title === null || wing.title===""? null :wing.title}</h3>
                                            </div>
                                        </button>
                                            </a>
                                        </div>
                                       
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

    render() {
        const { selectTitle, selectContent, pastChairman, member, chairman, viceChairman } = this.state;
        return (
            <div>
              {this.HomeWings()}
                {/* <!-- section2--> */}
                <div className='mt-1'  id='wingsSection' style={{height:"5vh"}}></div>
                <section className="aboutpagesection  eventheight wingsSection mt-3">
                    <div className="container-wrapper">
                        <div className="row" >
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div className="aboutpagePara">
                                    <div className="headingDropdown">
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                            <h2 className='textleft'>{selectTitle === null || selectTitle === ""?"Title":selectTitle}</h2>
                                        </div>
                                    </div>
                                    <p className='textleft' dangerouslySetInnerHTML={{ __html: selectContent }}></p>
                                    {/* <p className='textleft' dangerouslySetInnerHTML={pageInfo.option_1}></p> */}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section-team pt-4 eventheight no-background">
                        <div className="container-wrapper">
                            <div className="row d-flex flex-row justify-content-center ">
                                {/* <!-- Chairman Person --> */}
                                {chairman.length > 0 && chairman.map((user, i) => {
                                    return this.renderUser(user, i)
                                }
                                )
                                }
                                {/* <!-- viceChairman  Person --> */}

                                {viceChairman.length > 0 && viceChairman.map((user, i) => {
                                    return this.renderUser(user, i)
                                }
                                )
                                }

                                {/* <!-- pastChairman  Person --> */}

                                {pastChairman.length > 0 && pastChairman.map((user, i) => {
                                    return this.renderUser(user, i)
                                }
                                )
                                }

                            {/* <!-- members  Person --> */}

                                {member.length > 0 && member.map((user, i) => {
                                    return (
                                        <div className="row d-flex flex-row justify-content-center" >
                                            {user.users.length > 0 && user.users.map((mem, j) => {
                                                return (
                                                    <div className="single-person nohover column" key={j} >
                                                        <div className="person-image">
                                                            {/* style={{ width: '150px', height: '150px' }} onClick={(e) => this.handleClick(e, user.id, user.occupation)}*/}
                                                            <img src={mem.image === null || mem.image === ""? profile :mem.image} alt="profile" />
                                                        </div>
                                                        <div className="person-info">
                                                            <h4 className="full-name">{mem.name === null || mem.name === ""? "Member name" :mem.name}</h4>
                                                            <span className="speciality">{user.wing_role === null || user.wing_role === ""? "Member Role" :user.wing_role}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                            }
                            )
                            }
                            </div>
                        </div>
                    </div>
                </section>
                {this.renderUserModal()}
            </div>


        );
    }

    renderUser = (user, i) => {
        return (
            <div className="single-person nohover column" key={i}>
                {user.users.length > 0 && user.users.map((mem, j) => {
                    return (
                        <div className="single-person nohover" key={j} >
                            <div className="person-image">
                                {/* style={{ width: '150px', height: '150px' }} onClick={(e) => this.handleClick(e, user.id, user.occupation)}*/}
                                <img src={mem.image === null || mem.image === ""? profile :mem.image} alt="profile" />
                            </div>
                            <div className="person-info">
                                <h4 className="full-name">{mem.name === null || mem.name === ""? "Member name" :mem.name}</h4>
                                <span className="speciality">{user.wing_role === null || user.wing_role === ""? "Member Role" :user.wing_role}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )

    }

    renderUserModal = () => {
        const { selectedUser } = this.state;
        return (
            <div >
                {Object.keys(selectedUser).length > 0 ?
                    <Modal show={this.state.userModal} className="user-popup-section">
                        <Modal.Header>
                            <button className='popup-button closeText' onClick={this.handleClose}>Close<span><AiOutlineCloseCircle /></span></button>
                        </Modal.Header>
                        <ModalBody>
                            <div className='userInfo '>
                                <p>

                                    <div className=" userBlock">
                                        <div className="single-user" >
                                            <div className="user-image">
                                                <img src={selectedUser.image === null || selectedUser.image === ""? profile :selectedUser.image} alt="profile"/>
                                            </div>
                                            <div className="user-info">
                                                <h4 className="full-name">{selectedUser.name === null || selectedUser.name === ""? "User Name" :selectedUser.name}</h4>
                                                <span className="speciality">{selectedUser.occupation === null || selectedUser.occupation === ""? "User occupation" :selectedUser.occupation}</span>
                                            </div>
                                            <div className="social-medialinks dflex justify-center">
                                                <a href={"tel: " + selectedUser.mobile_number}> <FaPhoneAlt />&nbsp;</a>
                                                <a href={"mailto:" + selectedUser.email}><IoIosMail />&nbsp;</a>
                                                {selectedUser.option_1 === 'true' ? <a href="/"><AiFillInstagram />&nbsp;</a> :null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="userMessage">
                                        <p dangerouslySetInnerHTML={{ __html: selectedUser.discription === null || selectedUser.discription=== ""?" No Data ":selectedUser.discription }}></p>

                                    </div>
                                </p>

                            </div>
                        </ModalBody>
                    </Modal>
                    :
                    null
                }
            </div>
        )
    }
}
export default Wings
