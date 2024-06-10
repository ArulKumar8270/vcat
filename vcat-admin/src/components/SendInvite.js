import "react-big-calendar/lib/css/react-big-calendar.css";
import AppConfig from "../modals/AppConfig";
import React from "react";
import { CheckUserName, CheckEmail } from "../common/Validation";
import logo from "../components/img/logo.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import { sendInvite } from "../libraries/memberDashboard";
import { observer } from "mobx-react";
import User from "../modals/User";

class SendInvite extends React.Component {
  state = {
    status: false,
    sendInvite: false,
    CreateRole: false,
    CreateWing: false,
    AssignRole: false,
    name: "",
    email: "",
    phone: "",
    NameError: "",
    PhoneError: "",
    emailError: "",
  };

  componentDidUpdate(prevProps) {
    if (prevProps.sendInvite !== this.props.sendInvite && this.props.sendInvite) {
      this.setState({
        name: "",
        email: "",
        phone: "",
        NameError: "",
        PhoneError: "",
        emailError: "",
      });
    }
  }

  handleClose = () => {
    this.setState(
      {
        name: "",
        email: "",
        phone: "",
        NameError: "",
        PhoneError: "",
        emailError: "",
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  // Validation for username
  validateName = () => {
    let NameError = "Field empty";
    const check = CheckUserName(this.state.name) === 1;
    if (!check) NameError = "";
    this.setState({ NameError });
    return !check;
  };

  validateMob = () => {
    const { phone } = this.state;
    const check = typeof phone === "string" && phone.length === 10 && !isNaN(phone);
    let PhoneError = "Field empty";
    if (check)
      PhoneError = "";
    this.setState({ PhoneError });
    return check;
  };

  validateEmail = () => {
    const check = CheckEmail(this.state.email);
    let emailError = "Field empty";
    if (check === null)
      emailError = "";
    this.setState({ emailError });
    return check === null;
  };

  ValidateAll = () => {
    const name = this.validateName();
    const phone = this.validateMob();
    const email = this.validateEmail();

    const result = name && phone && email;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const { user_id } = User;
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        user_id
      };
      const response = await sendInvite(requestData);
      if (response && response.status === "success") {
        AppConfig.setMessage(" Invite Sent ", false);
        this.handleClose();
        User.setRefresh(true);
      } else if (response?.status === "error")
        AppConfig.setMessage(response?.message);
    }
  };

  render() {
    return (
      <div className="sendinvite" style={{ width: "500px" }}>
        <Modal
          size="md"
          className="border-style rounded"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.sendInvite}
          onHide={this.handleClose}
        >
          <Modal.Header>
            <div className="form-head width100 dflex jc-sb align-center">
              <div className="width100 dflex align-center">
                <img src={logo} alt="logo" />
                <h3 className="ml-2"> Send Invite </h3>
              </div>
              <button
                className="popup-button closeText dflex"
                onClick={this.handleClose}
              >
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </button>
            </div>
          </Modal.Header>
          <div className="p-3">
            <Modal.Body>
              <form
                className="align-items-center event-form"
                onSubmit={this.onSubmitCreate}
              >
                <div className="mb-4">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Name <span className="asterik">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${this.state.NameError ? "validationError" : ""}`}
                        onFocus={() => this.setState({ NameError: "" })}
                        id="personName"
                        placeholder="Enter the Name"
                        value={this.state.name}
                        onChange={(e) =>
                          this.setState({ name: e.target.value, NameError: "" })
                        }
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z ]{1}$/i;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-start">
                      {this.state.NameError ? (
                        <span className="small-font-size text-danger">
                          {this.state.NameError}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="form-padding mb-3">
                    <label>Email <span className="asterik">*</span></label>
                    <input
                      placeholder="example@gmail.com"
                      className={`form-control ${this.state.emailError ? "validationError" : ""}`}
                      onFocus={() => this.setState({ emailError: "" })}
                      type="text"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </div>
                  <div className="d-flex justify-content-start">
                    {this.state.emailError ? (
                      <span className="small-font-size text-danger">
                        {this.state.emailError}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="input-row">
                    <div className="mb-3">
                      <div className="form-padding mb-3">
                        <label>Phone number <span className="asterik">*</span></label>
                        <input
                          className={`form-control ${this.state?.PhoneError ? "validationError" : ""}`}
                          onFocus={() => this.setState({ PhoneError: "" })}
                          label=""
                          placeholder="Office Mobile Number"
                          type="tel"
                          value={this.state.phone}
                          onChange={(e) =>
                            this.setState({ phone: e.target.value })
                          }
                          onKeyPress={(e) => {
                            if (isNaN(e?.key) || e?.key === " ") {
                              e?.preventDefault();
                            }
                          }}
                          maxLength="10"
                        />
                      </div>
                      <div className="d-flex justify-content-start">
                        {this.state.PhoneError ? (
                          <span className="small-font-size text-danger">
                            {this.state.PhoneError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cta-section jc-end">
                  <button
                    type="submit"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn ml-2 event-cta">
                    Save
                  </button>
                </div>
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  };
}

export default observer(SendInvite);
