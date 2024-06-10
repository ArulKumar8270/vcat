// import React from 'react'
// import { callApi } from '../libraries/Api';
// import { observer } from 'mobx-react';
// import { CheckUserName, CheckEmail, CheckPhone } from "../common/Validation";
// import AppConfig from '../modals/AppConfig';
// import ToastMessage from '../modals/ToastMessage';

// class EventRegister extends React.Component {

//     state = {
//         phoneNumberError: '',
//         emailError: '',
//         nameError: '',
//         postId: null,
//         name: '',
//         email: '',
//         phoneNumber: '',
//         messages: '',
//         status: false,
//         error: '',
//         rank: '',
//         eventRegister: false

//     }

//     render() {
//         return (
//             <div>
//                 {/* <!-- section0: navbar --> */}
//                 {/* <!-- section1: main --> */}
//                 <div className="rightsideRegister ">
//                     <h3 className="mt-3" style={{ fontSize: "1.5rem" }}>EVENT REGISTRATION FORM </h3>
//                     <div className="container-wrapper">
//                         <form className="align-items-center contact-form">

//                             <div className="d-flex justify-content-start">
//                                 {this.state.nameError ? (<span className='small-font-size text-danger'> {this.state.nameError}</span>) : ''}
//                             </div>
//                             <div className="dflex mb-3 ">
//                                 <label htmlFor="name exampleFormControlInput1" className="form-label required">Name</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="name"
//                                     required
//                                     placeholder="John Doe"
//                                     value={this.state.name}
//                                     onChange={(e) => this.setState({ name: e.target.value })}
//                                 />
//                             </div>
//                             <div className="d-flex justify-content-start">
//                                 {this.state.emailError ? (<span className='small-font-size text-danger'> {this.state.emailError}</span>) : ''}
//                             </div>
//                             <div className="dflex mb-3 ">
//                                 <label htmlFor="email exampleFormControlInput1" className="form-label required">Email address</label>
//                                 <input
//                                     required
//                                     type="email"
//                                     className="form-control"
//                                     id="email"
//                                     placeholder="name@example.com"
//                                     value={this.state.email}
//                                     onChange={(e) => this.setState({ email: e.target.value })}
//                                 />

//                             </div>
//                             <div className="d-flex justify-content-start">
//                                 {this.state.phoneNumberError ? (<span className='small-font-size text-danger'> {this.state.phoneNumberError}</span>) : ''}
//                             </div>
//                             <div className="dflex mb-3 ">
//                                 <label htmlFor="phone exampleFormControlInput1" className="form-label required">Phone</label>
//                                 <input
//                                     required
//                                     type=" tel"
//                                     className="form-control"
//                                     id="phone"
//                                     placeholder="8889993293"
//                                     value={this.state.phoneNumber}
//                                     onChange={(e) => this.setState({ phoneNumber: e.target.value })}
//                                 />

//                             </div>

//                             <div className="dflex mb-3">
//                                 <label htmlFor="rank exampleFormControlInput1" className="form-label">Member ID</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="rank"
//                                     placeholder="For members"
//                                     value={this.state.rank}
//                                     onChange={(e) => this.setState({ rank: e.target.value })}
//                                 />
//                             </div>
//                             {/* <div className="d-flex justify-content-start">
//                                 {this.state.messageError ? (<span className='small-font-size text-danger'> {this.state.messageError}</span>) : ''}
//                             </div> */}
//                             <div className="dflex mb-3 ">
//                                 <label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
//                                 <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
//                                     value={this.state.messages}
//                                     required
//                                     onChange={(e) => this.setState({ messages: e.target.value })}
//                                 ></textarea>

//                             </div>
//                             <button type="submit" className="btn btn-primary"
//                                 onClick={this.onSubmitContact}>Register</button>
//                             <ToastMessage />

//                         </form>
//                     </div>

//                 </div>

//             </div>
//         )
//     }
//     // Validation for Employee Name
//     validateName = () => {
//         const nameError = CheckUserName(this.state.name);
//         if (nameError === 1) {
//             AppConfig.setMessage('Name field empty');
//             return false;
//         } else if (nameError === 4) {
//             AppConfig.setMessage('Invalid  name');
//             return false;
//         } else return true;
//     };

//     // validateMessage = () => {
//     //     const messageError = CheckMessage(this.state.messages);
//     //     if (messageError === 1) {
//     //         AppConfig.setMessage('Message field empty');
//     //         return false;
//     //     } else return true;
//     // };

//     validateEmail = () => {
//         const emailError = CheckEmail(this.state.email);
//         if (emailError === 1) {
//             AppConfig.setMessage('Email empty');
//             return false;
//         } else if (emailError === 2) {
//             AppConfig.setMessage('Invalid email');
//             return false;
//         } else return true;
//     };

//     // Validation for phone Number
//     validatephoneNumber = () => {
//         const phoneNumberError = CheckPhone(this.state.phoneNumber);
//         if (phoneNumberError === 1) {
//             AppConfig.setMessage('PhoneNumber empty');
//             return false;
//         } else if (phoneNumberError === 2) {
//             AppConfig.setMessage('Invalid phone number');
//             return false;
//         } else return true;
//     };

//     // Empty input validation

//     ValidateAll = () => {

//         if (!this.validateName()) {
//             return false;
//         } else if (!this.validateEmail()) {
//             return false;
//         }
//         // else if (!this.validateMessage()) {
//         //     return false;
//         // }
//         else if (!this.validatephoneNumber()) {
//             return false
//         } else if (this.validateName() &&
//             this.validateEmail() &&
//             this.validatephoneNumber()
//             // &&
//             // this.validateMessage()
//         ) {
//             return true;
//         }
//         return false;
//     }

//     // onsubmit sign up function
//     onSubmitContact = async (e) => {
//         e.preventDefault();
//         const allValidation = this.ValidateAll()
//         if (allValidation) {
//             const url = 'events/reg/website'
//             const requestData = {
//                 name: this.state.name,
//                 email: this.state.email,
//                 mobile_number: this.state.phoneNumber,
//                 description: this.state.messages,
//                 rank: this.state.rank,
//                 event_name: this.props.name,
//                 to_date: this.props.toDate,
//                 from_date: this.props.fromDate,
//                 venue: this.props.venue,
//                 meetingType: this.props.meetingType,
//                 image: this.props.image
//             }
//             const response = await callApi(url, requestData);
//             if (response.status === 'success') {
//                 AppConfig.setMessage("Thank you for registering", false);
//                 this.props.closeModel();

//             } else if (response.status === 'error') {
//                 this.props.closeModel();
//                 AppConfig.setMessage("Error occurred");

//             }
//             this.setState({
//                 name: '',
//                 email: '',
//                 phoneNumber: [],
//                 messages: '',
//                 rank: '',
//                 status: false,
//             })
//         }
//     }

// }

// export default observer(EventRegister);

import React from "react";
import { callApi } from "../libraries/Api";
import { observer } from "mobx-react";
import {
  CheckUserName,
  CheckEmail,
  CheckPhone,
  CheckFullName,
} from "../common/Validation";
import AppConfig from "../modals/AppConfig";
import { GrDown } from "react-icons/gr";
import ToastMessage from "../modals/ToastMessage";

class EventRegister extends React.Component {
  state = {
    phoneNumberError: "",
    emailError: "",
    nameError: "",
    postId: null,
    name: "",
    email: "",
    phoneNumber: "",
    messages: "",
    status: false,
    error: "",
    rank: "",
    mmemStatus: "",
    eventRegister: false,
  };

  render() {
    console.log("eventData", this.props.eventData);
    return (
      <div>
        {/* <!-- section0: navbar --> */}
        {/* <!-- section1: main --> */}
        <div className="rightsideRegister ">
          <h3 className="mt-3" style={{ fontSize: "1.5rem" }}>
            EVENT REGISTRATION FORM{" "}
          </h3>
          <div className="container-wrapper">
            <form className="align-items-center contact-form">
              <div className="form-padding dflex mb-3 jc-sb">
                <label
                  className="dflex align-center"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  Name
                  <span
                    className="asterik mt-0"
                    style={{
                      fontSize: "0.7rem",
                      width: "100px",
                    }}
                  >
                    *
                  </span>
                </label>
                {this.state.nameError ? (
                  <input
                    className="form-control validationError"
                    label="Name"
                    placeholder={this.state.nameError}
                    type="text"
                    id="name"
                    required
                    value={
                      this.state.nameError
                        ? this.state.nameError
                        : this.state.name
                    }
                    onChange={(e) => this.setState({ name: e.target.value })}
                    onFocus={(e) => this.setState({ nameError: "" })}
                  />
                ) : (
                  <input
                    className="form-control"
                    label="Name"
                    type="text"
                    id="name"
                    required
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    onFocus={(e) => this.setState({ nameError: "" })}
                  />
                )}
              </div>
              <div className="form-padding dflex mb-3 jc-sb">
                <label
                  className=" align-center"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  Email
                  <span
                    className="asterik mt-0"
                    style={{
                      fontSize: "0.7rem",
                      width: "100px",
                    }}
                  >
                    *
                  </span>
                </label>
                {this.state.emailError ? (
                  <input
                    className="form-control validationError"
                    placeholder={this.state.emailError}
                    type="email"
                    id="email"
                    required
                    value={
                      this.state.emailError
                        ? this.state.emailError
                        : this.state.email
                    }
                    onFocus={(e) => this.setState({ emailError: "" })}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                ) : (
                  <input
                    className="form-control "
                    placeholder={this.state.emailError}
                    type="email"
                    id="email"
                    required
                    value={this.state.email}
                    onFocus={(e) => this.setState({ emailError: "" })}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                )}
              </div>

              <div className="form-padding dflex mb-3 jc-sb">
                <label
                  className="dflex align-center"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  Phone
                  <span
                    className="asterik mt-0"
                    style={{
                      fontSize: "0.7rem",
                      width: "100px",
                    }}
                  >
                    *
                  </span>
                </label>
                {this.state.phoneNumberError ? (
                  <input
                    className="form-control validationError"
                    placeholder={this.state.phoneNumberError}
                    type=" tel"
                    id="phone"
                    value={
                      this.state.phoneNumberError
                        ? this.state.phoneNumberError
                        : this.state.phoneNumber
                    }
                    onFocus={(e) => this.setState({ phoneNumberError: "" })}
                    onChange={(e) =>
                      this.setState({ phoneNumber: e.target.value })
                    }
                  />
                ) : (
                  <input
                    className="form-control "
                    type=" tel"
                    id="phone"
                    value={this.state.phoneNumber}
                    onFocus={(e) => this.setState({ phoneNumberError: "" })}
                    onChange={(e) =>
                      this.setState({ phoneNumber: e.target.value })
                    }
                  />
                )}
              </div>
              <div className="form-padding dflex mb-3 jc-sb">
                <label
                  className="dflex align-center"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  ICAI Membership No
                </label>
                <input
                  className="form-control "
                  type="text"
                  id="rank"
                  value={this.state.rank}
                  onChange={(e) => this.setState({ rank: e.target.value })}
                />
              </div>
              <div className="form-padding dflex mb-3  select-drop-box jc-sb pos-rel">
                <label
                  className="dflex align-center"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  VCAT Membership Status
                </label>
                <select
                  className="form-control  select-drop"
                  placeholder="Choose"
                  value={this.state.mmemStatus}
                  onChange={(e) =>
                    this.setState({ mmemStatus: e.target.value })
                  }
                >
                  <option
                    style={{ color: "#797d81" }}
                    defaultValue
                    value="null"
                  >
                    --- Select ---
                  </option>
                  <option id="1" value="Non Member">
                    Non Member
                  </option>
                  <option id="2" value="Life Trustee">
                    Life Trustee
                  </option>
                  <option id="3" value="Life Member">
                    Life Member
                  </option>
                </select>
                <GrDown
                  aria-disabled
                  style={{ position: "absolute", right: "1%", top: "29%" }}
                />
              </div>
              <div className="form-padding dflex mb-3 jc-sb">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  style={{
                    fontSize: "0.7rem",
                    width: "100px",
                  }}
                >
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={this.state.messages}
                  required
                  onChange={(e) => this.setState({ messages: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.onSubmitContact}
              >
                Register
              </button>
            </form>
          </div>
          <ToastMessage />
        </div>
      </div>
    );
  }
  // Validation for Employee Name
  validateName = () => {
    const nameError = CheckFullName(this.state.name);
    if (nameError === 1) {
      this.setState({ nameError: "Name required" });
      return false;
    } else if (nameError === 2) {
      this.setState({ nameError: "Invalid name" });
      return false;
    } else return true;
  };

  // validateMessage = () => {
  //     const messageError = CheckMessage(this.state.messages);
  //     if (messageError === 1) {
  //         AppConfig.setMessage('Message field empty');
  //         return false;
  //     } else return true;
  // };

  validateEmail = () => {
    const emailError = CheckEmail(this.state.email);
    if (emailError === 1) {
      this.setState({ emailError: "Email required" });
      return false;
    } else if (emailError === 2) {
      this.setState({ emailError: "Invalid email" });
      return false;
    } else return true;
  };

  // Validation for phone Number
  validatephoneNumber = () => {
    const phoneNumberError = CheckPhone(this.state.phoneNumber);
    if (phoneNumberError === 1) {
      this.setState({ phoneNumberError: "Phone required" });
      return false;
    } else if (phoneNumberError === 2) {
      this.setState({ phoneNumberError: "Invalid phone number" });
      return false;
    } else return true;
  };

  // Empty input validation

  ValidateAll = () => {
    if (!this.validateName()) {
      return false;
    } else if (!this.validateEmail()) {
      return false;
    }
    // else if (!this.validateMessage()) {
    //     return false;
    // }
    else if (!this.validatephoneNumber()) {
      return false;
    } else if (
      this.validateName() &&
      this.validateEmail() &&
      this.validatephoneNumber()
      // &&
      // this.validateMessage()
    ) {
      return true;
    }
    return false;
  };

  // onsubmit sign up function
  onSubmitContact = async (e) => {
    e.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const url = "registerEvents";
      const requestData = {
        event_id: this.props.eventData.id,
        name: this.state.name,
        email: this.state.email,
        mobile_number: this.state.phoneNumber,
        icai_membership_no: this.state.rank,
        vcat_membership_status: this.state.mmemStatus,
        message: this.state.messages,
      };
      const response = await callApi(url, requestData);
      if (response.status === "success") {
        AppConfig.setMessage("Thank you for registering", false);
        this.props.closeModel();
      } else if (response.status === "error") {
        this.props.closeModel();
        AppConfig.setMessage("Error occurred");
      }
      this.setState({
        name: "",
        email: "",
        phoneNumber: "",
        messages: "",
        rank: "",
        status: false,
        nameError: "",
        emailError: "",
        phoneNumberError: "",
        mmemStatus: "",
      });
    }
  };
}

export default observer(EventRegister);

// onsubmit sign up function
// onSubmitContact = async (e) => {
//   e.preventDefault();
//   const allValidation = this.ValidateAll();
//   if (allValidation) {
//     const url = "events/reg/website";
//     const requestData = {
//       name: this.state.name,
//       email: this.state.email,
//       mobile_number: this.state.phoneNumber,
//       description: this.state.messages,
//       rank: this.state.rank,
//       wing_rank: this.state.mmemStatus,
//       event_name: this.props.name,
//       to_date: this.props.toDate,
//       from_date: this.props.fromDate,
//       venue: this.props.venue,
//       meetingType: this.props.meetingType,
//       image: this.props.image,
//     };
//     const response = await callApi(url, requestData);
//     if (response.status === "success") {
//       AppConfig.setMessage("Thank you for registering", false);
//       this.props.closeModel();
//     } else if (response.status === "error") {
//       this.props.closeModel();
//       AppConfig.setMessage("Error occurred");
//     }
//     this.setState({
//       name: "",
//       email: "",
//       phoneNumber: "",
//       messages: "",
//       rank: "",
//       status: false,
//       nameError: "",
//       emailError: "",
//       phoneNumberError: "",
//       mmemStatus: "",
//     });
//   }
// };
