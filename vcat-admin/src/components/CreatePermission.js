import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";
import { CheckMessage, DropDownCheck } from "../common/Validation";
import logo from "../components/img/logo.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
// import makeAnimated from 'react-select/animated';
import User from "../modals/User";
import {
  CreatePermInsert,
  PermAutoPopulate,
  updatePerm,
} from "../libraries/Permissions";
import AppConfig from "../modals/AppConfig";
import { observer } from "mobx-react";
// const animatedComponents = makeAnimated();

class CreatePermission extends React.Component {
  state = {
    CreatePermission: false,
    PermName: "",
    PermissionStat: {},
    PermissionList: [],
    StatusList: [
      {
        value: 0,
        label: "Active",
      },
      {
        value: 1,
        label: "Deactivate",
      },
    ],
  };
  async componentDidUpdate(prevProps) {
    const id = this.props.editPerm;
    if (
      this.props.CreatePermission !== prevProps.CreatePermission &&
      id &&
      this.props.CreatePermission
    ) {
      this.setState({ CreatePermission: this.props.CreatePermission });

      const response = await PermAutoPopulate(id);

      if (response && response.status === "success") {
        // let Status = this.state.StatusList;
        let Permissions = response.result.permissions;
        // let Status_list = [];
        // let fields_status = [];
        // if (Status && Status.length > 0) {
        //     // fields_status = Array.from(Array(Permissions.length).keys());
        //     for (let i = 0; i < Status.length; i++) {
        //         if (parseInt(Status[i]['value']) === parseInt(Permissions.is_deleted)) {
        //             let role = {
        //                 label: Status[i]['label'],
        //                 value:Status[i]['value']
        //             }
        //             Status_list.push(role);
        //         }
        //     }

        // }
        this.setState({
          PermName: Permissions.name,
        });
      }
    }
  }

  onPermissionStat = (selectedPermStatus) => {
    this.setState({
      PermissionStat: selectedPermStatus,
    });
  };

  handleClose = () => {
    this.setState({
      PermName: "",
      PermNameError: "",
    });
    this.props.closeModel(false);
  };
  // Validation for username

  validatePermName = () => {
    const PermNameError = CheckMessage(this.state.PermName);
    if (PermNameError === 1) {
      this.setState({ PermNameError: "Field empty" });
      return false;
    } else return true;
  };

  validatePermStatus = () => {
    const PermStatusError = DropDownCheck(this.state.PermissionStat);
    if (PermStatusError === 1) {
      this.setState({ PermStatusError: "Field empty" });
      return false;
    } else return true;
  };

  // Empty input validation

  ValidateAll = () => {
    const PermName = this.validatePermName();
    const PermStatus = this.validatePermStatus();

    if (PermName && PermStatus) {
      return true;
    } else {
      return false;
    }
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props?.saveAccess) {
      const editId = this.props.editPerm;
      const user_id = User.user_id;
      const allValidation = this.ValidateAll();
      const id = User.user_id;
      if (allValidation) {
        let requestData = {
          name: this.state.PermName,
          is_active: this.state.PermissionStat.label,
          created_by: user_id,
          user_id: user_id,
        };
        if (editId) {
          requestData["modified_by"] = User.user_id;
          const response = await updatePerm(requestData, editId);
          if (response && response.status === "success") {
            this.handleClose();
            User.setRefresh(true);
            AppConfig.setMessage("Permission updated successfully", false);
          } else if (response.status === "error") {
            this.props.closeModel(false);
            AppConfig.setMessage(response.result);
          }
        } else {
          const response = await CreatePermInsert(requestData, id);
          if (response && response.status === "success") {
            AppConfig.setMessage(" Permission created successfully", false);
            this.handleClose();
            User.setRefresh(true);
          } else if (response.status === "error") {
            const result = response.result;
            let message = result;
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
            this.handleClose();
          }
        }
        if (this.props.afterSubmit) {
          await this.props.afterSubmit();
        }
      }
    }
  };
  // Handle file select
  render() {
    return (
      <>
        <Modal
          size="md"
          className="border-style rounded CreateWingPage"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.CreatePermission}
        >
          <Modal.Header>
            <div className="form-head">
              <img alt="logo"
                src={logo}
                style={{ width: "50px", height: "50px", marginRight: "1rem" }}
              />
              {this.props.editPerm ? (
                <h3> Update Permission</h3>
              ) : (
                <h3> Create Permission</h3>
              )}
            </div>
            <button
              className="popup-button closeText"
              onClick={this.handleClose}
            >

              <span>
                <AiOutlineCloseCircle />
              </span>
            </button>
          </Modal.Header>
          <div className="p-3">
            <Modal.Body>
              <form
                className="align-items-center event-form"
                onSubmit={this.onSubmitCreate}
              >
                <div className="input-row mb-3">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center selectIcon">
                      Permission Name
                      <span className="asterik">*</span>
                    </label>
                    {this.state.PermNameError ?
                      <input
                        tabIndex="1"
                        type="text"
                        className="form-control validationError"
                        id="personName"
                        placeholder={this.state.PermNameError}
                        value={this.state.PermName}
                        onChange={(e) =>
                          this.setState({ PermName: e.target.value })
                        }
                      />
                      :
                      <input
                        tabIndex="1"
                        type="text"
                        className="form-control"
                        id="personName"
                        placeholder="Enter the Permission Name"
                        value={this.state.PermName}
                        onChange={(e) =>
                          this.setState({ PermName: e.target.value })
                        }
                        onKeyPress={(e) => {
                          const regex = /^[a-zA-Z ]{1}$/i;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    }
                  </div>
                </div>
                {this.props?.saveAccess ? <div className="cta-section jc-sb mt-3">
                  <button
                    type="submit"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn event-cta">
                    {this.props.editPerm ? "Update Permission" : "Create Permission"}
                  </button>
                </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </>
    );
  }
}

export default observer(CreatePermission);
