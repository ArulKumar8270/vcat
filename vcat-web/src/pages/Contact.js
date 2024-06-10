// import React from 'react'
// import { callApi } from '../libraries/Api';
// import { observer } from 'mobx-react';
// import { CheckUserName, CheckEmail, CheckPhone } from "../common/Validation";
// import AppConfig from '../modals/AppConfig';
// import contactImg from '../components/img/contact.png'
// import ToastMessage from '../modals/ToastMessage';
// import { GrLocation } from "react-icons/gr";
// import { BiEnvelope } from "react-icons/bi";
// import { AiOutlinePhone } from "react-icons/ai";

// class Contact extends React.Component {

//     state = {
//         phoneNumberError: '',
//         // Toster: 'false',
//         emailError: '',
//         nameError: '',
//         postId: null,
//         name: '',
//         email: '',
//         phoneNumber: '',
//         messages: '',
//         status: false,
//         contactAddressLine1: '',
//         contactAddressLine2: '',
//         contactAddressLine3: '',
//         contactPhone: ' ',
//         contactEmail: '',
//         error: ''

//     }

//     componentDidMount() {
//         const functionUrl = 'pages';
//         const requestBody = {
//             page: 'contacts/insertt'
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             if (response.statusCode === 200) {
//                 const result = response.result;
//                 const contactInfo = result.pageInfo;
//                 for (let i in contactInfo) {
//                     if (contactInfo[i]['page'].match(/contacts/i)) {
//                     }
//                 }

//             }

//         });
//         // call API
//         this.setState({
//             contactAddressLine1: ' SRI VASAVI CA CHARITABLE TRUST ',
//             contactAddressLine2: ' No.9 Ground Floor,9th Main, 2nd Block Jayanagar, Bengaluru,',
//             contactAddressLine3: 'Karnataka, India',
//             contactPhone: ' +91 86608 69426',
//             contactEmail: 'info@vcat.co.in',

//         })

//         // Simple POST request with a JSON body using fetch
//         const requestOptions = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ title: 'Vcat-app Contact form API' })
//         };
//         fetch('https://vcat.co.in/staging/vcat-api/api/v1/contacts/insert', requestOptions)
//             .then(response => response.json())
//             .then(data => this.setState({ postId: data.id }));
//     }

//     render() {
//         const state = this.state;
//         return (
//             <div>
//                 {/* <!-- section0: navbar --> */}

//                 {/* <!-- section1: main --> */}
//                 <div className="contactSection hero dflex" >
//                     <div className="leftsideContact col-6">
//                         <div className="container-wrapper mt-5 contact-pad">
//                             <p>
//                                 <a href="https://www.google.com/maps/place/SRI+VASAVI+CA+CHARITABLE+TRUST/@12.93913,77.583863,15z/data=!4m5!3m4!1s0x0:0x17885d4063866260!8m2!3d12.9391299!4d77.5838629?hl=en" className="nav-link  no-hover wht fnt-size d-flex address "><GrLocation />
//                                     <span>{state.contactAddressLine1}<br />{state.contactAddressLine2}
//                                         <br />{state.contactAddressLine3}</span>
//                                 </a>
//                             </p>
//                             <p><a className="nav-link wht fnt-size contact-nav-link" target="_blank"  href="mailto:vcat@gmail.com"><BiEnvelope /> {state.contactEmail}</a></p>
//                             <p>
//                                 <a href={state.contactPhone} target="_blank" className="nav-link wht fnt-size contact-nav-link telephone"><AiOutlinePhone />{state.contactPhone}</a>
//                             </p>
//                             <img src={contactImg} alt="" width="80%" />
//                         </div>
//                     </div>
//                     <div className="rightsideContact col-6 mb-4">
//                         <div className="container-wrapper mt-5 contact-pad  pos-rel">
//                         <div className="align-items-center contact-form mb-4 contactfromhead">
//                             <h2 style={{fontSize:'1.8rem',marginBottom:'1.5rem', marginLeft:'1.2rem'}}> For any queries contact us</h2>
//                         </div>
//                             <form className="align-items-center contact-form">
//                                 <div className="d-flex justify-content-start">
//                                     {this.state.nameError ? (<span className='small-font-size text-danger'> {this.state.nameError}</span>) : ''}
//                                 </div>
//                                 <div className=" mb-3">
//                                     <label htmlFor="name exampleFormControlInput1" className="form-label required">Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="name"
//                                         placeholder="Vasavi"
//                                         value={this.state.name}
//                                         onChange={(e) => this.setState({ name: e.target.value })}
//                                     />
//                                 </div>
//                                 <div className="d-flex justify-content-start">
//                                     {this.state.emailError ? (<span className='small-font-size text-danger'> {this.state.emailError}</span>) : ''}
//                                 </div>
//                                 <div className=" mb-3">
//                                     <label htmlFor="email exampleFormControlInput1" className="form-label required">Email address</label>
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         id="email"
//                                         placeholder="name@example.com"
//                                         value={this.state.email}
//                                         onChange={(e) => this.setState({ email: e.target.value })}
//                                     />

//                                 </div>
//                                 <div className="d-flex justify-content-start">
//                                     {this.state.phoneNumberError ? (<span className='small-font-size text-danger'> {this.state.phoneNumberError}</span>) : ''}
//                                 </div>
//                                 <div className=" mb-3">
//                                     <label htmlFor="phone exampleFormControlInput1" className="form-label required">Phone</label>
//                                     <input
//                                         type=" tel"
//                                         className="form-control"
//                                         id="phone"
//                                         placeholder="0000000000"
//                                         value={this.state.phoneNumber}
//                                         onChange={(e) => this.setState({ phoneNumber: e.target.value })}
//                                     />

//                                 </div>

//                                 <div className="mb-3">
//                                     <label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
//                                     <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
//                                         value={this.state.messages}
//                                         onChange={(e) => this.setState({ messages: e.target.value })}
//                                     ></textarea>
//                                 </div>
//                                 <button type="submit" className="btn btn-primary"
//                                     onClick={this.onSubmitContact}>Submit</button>
//                             </form>
//                             <ToastMessage />
//                         </div>

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

//     // Validation for username

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
//         } else if (!this.validatephoneNumber()) {
//             return false
//         } else if (this.validateName() &&
//             this.validateEmail() &&
//             this.validatephoneNumber()
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
//             const url = 'contacts/insert'
//             const requestData = {
//                 name: this.state.name,
//                 email: this.state.email,
//                 phone: this.state.phoneNumber,
//                 messages: this.state.messages,
//                 postId: this.state.postId
//             }
//             const response = await callApi(url, requestData);
//             if (response.status === 'success') {
//                 AppConfig.setMessage("Form successfully submitted", false);

//             } else if (response.status === 'error') {
//                 AppConfig.setMessage(response.result);

//             }
//             this.setState({
//                 name: '',
//                 email: '',
//                 phoneNumber: '',
//                 messages: '',
//                 // postId: ''
//             })
//         }
//     }

// }

// export default observer(Contact);

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
import contactImg from "../components/img/contact.png";
import ToastMessage from "../modals/ToastMessage";
import { GrLocation } from "react-icons/gr";
import { BiEnvelope } from "react-icons/bi";
import { AiOutlinePhone } from "react-icons/ai";

class Contact extends React.Component {
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
    contactAddressLine1: "",
    contactAddressLine2: "",
    contactAddressLine3: "",
    contactPhone: " ",
    contactEmail: "",
    error: "",
  };

  componentDidMount() {
    const functionUrl = "pages";
    const requestBody = {
      page: "contacts/insertt",
    };
    callApi(functionUrl, requestBody).then((response) => {
      if (response.statusCode === 200) {
        const result = response.result;
        const contactInfo = result.pageInfo;
        for (let i in contactInfo) {
          if (contactInfo[i]["page"].match(/contacts/i)) {
          }
        }
      }
    });
    // call API
    this.setState({
      contactAddressLine1: " SRI VASAVI CA CHARITABLE TRUST ",
      contactAddressLine2:
        " No.9 Ground Floor,9th Main, 2nd Block Jayanagar, Bengaluru,",
      contactAddressLine3: "Karnataka, India",
      contactPhone: " +91 86608 69426",
      contactEmail: "info@vcat.co.in",
    });

    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Vcat-app Contact form API" }),
    };
    fetch(
      "https://vcat.co.in/staging/vcat-api/api/v1/contacts/insert",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => this.setState({ postId: data.id }));
  }

  render() {
    const state = this.state;
    return (
      <div>
        {/* <!-- section0: navbar --> */}

        {/* <!-- section1: main --> */}
        <div className="contactSection hero dflex">
          <div className="leftsideContact col-6">
            <div className="container-wrapper mt-5 contact-pad">
              <p>
                <a
                  href="https://www.google.com/maps/place/SRI+VASAVI+CA+CHARITABLE+TRUST/@12.93913,77.583863,15z/data=!4m5!3m4!1s0x0:0x17885d4063866260!8m2!3d12.9391299!4d77.5838629?hl=en"
                  className="nav-link  no-hover wht fnt-size d-flex address "
                >
                  <GrLocation />
                  <span>
                    {state.contactAddressLine1}
                    <br />
                    {state.contactAddressLine2}
                    <br />
                    {state.contactAddressLine3}
                  </span>
                </a>
              </p>
              <p>
                <a
                  className="nav-link wht fnt-size contact-nav-link"
                  rel="noreferrer"
                  href={`mailto:${state.contactEmail}`}
                >
                  <BiEnvelope /> {state.contactEmail}
                </a>
              </p>
              <p>
                <a
                  className="nav-link wht fnt-size contact-nav-link telephone"
                  rel="noreferrer"
                  href={`tel:${state.contactPhone}`}
                >
                  <AiOutlinePhone /> {state.contactPhone}
                </a>{" "}
              </p>
              <img src={contactImg} alt="" width="80%" />
            </div>
          </div>
          <div className="rightsideContact col-6 mb-4">
            <div className="container-wrapper mt-5 contact-pad  pos-rel">
              <div className="align-items-center contact-form mb-4 contactfromhead">
                <h2
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: "1.5rem",
                    marginLeft: "1.2rem",
                  }}
                >
                  {" "}
                  For any queries contact us
                </h2>
              </div>
              <form className="align-items-center contact-form">
                <div className="form-padding  mb-2 jc-sb">
                  <label className="dflex align-center">
                    Name<span className="asterik mt-0">*</span>
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
                <div className="form-padding  mb-2 jc-sb">
                  <label className=" align-center">
                    Email<span className="asterik mt-0">*</span>
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
                <div className="form-padding  mb-2 jc-sb">
                  <label className="dflex align-center">
                    Phone<span className="asterik mt-0">*</span>
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
                      onClick={(e) => this.setState({ phoneNumberError: "" })}
                      onChange={(e) =>
                        this.setState({ phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      className="form-control "
                      placeholder={this.state.phoneNumberError}
                      type=" tel"
                      id="phone"
                      value={this.state.phoneNumber}
                      onFocus={(e) => this.setState({ phoneNumberError: "" })}
                      onChange={(e) =>
                        this.setState({ phoneNumber: e.target.value })
                      }
                      onClick={(e) => this.setState({ phoneNumberError: "" })}
                    />
                  )}
                </div>
                <div className="form-padding  mb-2 jc-sb">
                  <label htmlFor="exampleFormControlTextarea1">Message</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={this.state.messages}
                    required
                    onChange={(e) =>
                      this.setState({ messages: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.onSubmitContact}
                >
                  Submit
                </button>
              </form>
            </div>
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

  ValidateAll = async () => {
    // if (!this.validateName()) {
    //   return false;
    // } else if (!this.validateEmail()) {
    //   return false;
    // } else if (!this.validatephoneNumber()) {
    //   return false;
    // } else if (
    //   this.validateName() &&
    //   this.validateEmail() &&
    //   this.validatephoneNumber()
    // ) {
    //   return true;
    // }
    // return false;
    const nameValidation = await this.validateName();
    const emailValidation = await this.validateEmail();
    const phoneValidation = await this.validatephoneNumber();

    if (nameValidation && emailValidation && phoneValidation) return true;
    return false;
  };

  // onsubmit sign up function
  onSubmitContact = async (e) => {
    e.preventDefault();
    const allValidation = await this.ValidateAll();
    if (allValidation) {
      const url = "contacts/insert";
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phoneNumber,
        messages: this.state.messages,
        postId: this.state.postId,
      };
      const response = await callApi(url, requestData);
      if (response.status === "success") {
        AppConfig.setMessage("Form successfully submitted", false);
      } else if (response.status === "error") {
        AppConfig.setMessage(response.result);
      }
      this.setState({
        name: "",
        email: "",
        phoneNumber: "",
        messages: "",
        // postId: ''
      });
    }
  };
}

export default observer(Contact);
