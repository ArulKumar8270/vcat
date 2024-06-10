import "react-big-calendar/lib/css/react-big-calendar.css";
import AppConfig from "../modals/AppConfig";
import React from "react";
import {
  CheckMessage,
  CheckUserName,
  DropDownCheck,
} from "../common/Validation";
import logo from "../components/img/logo.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import User from "../modals/User";
import {
  CreateRoleInsert,
  RoleAutoPopulate,
  updateRole,
} from "../libraries/Roles";
import { observer } from "mobx-react";
import { permissionDropdown } from "../libraries/Permissions";
import { MultiSelect } from "react-multi-select-component";

const animatedComponents = makeAnimated();

class CreateRole extends React.Component {
  StatusList = [
    {
      value: 0,
      label: "Active",
    },
    {
      value: 1,
      label: "Deactivate",
    },
  ];
  state = {
    CreateRole: false,
    RoleName: "",
    RoleDes: "",
    RoleNameList: [],
    RoleStatus: [],
    PermissionList: [],
    UpdatedPermissions: [],
    selectedRole: {},
    selectPerm: [],
    // 
    selectPermissionError: null,
    RoleStatusError: null,
  };
  componentDidMount = async (e) => {
    await this.GetPermissions();
  };

  GetPermissions = async (e) => {
    const response = await permissionDropdown();
    if (response) {
      const { result: PermissionList, status } = response;
      if (status === 'success' && PermissionList) {
        if (Array.isArray(PermissionList)) {
          this.setState({ PermissionList });
        }
      }
    }
  };

  onRoleStatus = (selectedRoleStatus) => {
    this.setState({
      RoleStatus: selectedRoleStatus,
      RoleStatusError: "",
    });
  };

  onRoleTitle = (selectedRole) => {
    this.setState({
      RoleNameList: selectedRole,
    });
  };

  async componentDidUpdate(prevProps) {
    const id = this.props.editRole;
    if (
      this.props.CreateRole !== prevProps.CreateRole &&
      id &&
      this.props.CreateRole
    ) {
      this.setState({ CreateRole: this.props.CreateRole });

      const response = await RoleAutoPopulate(id);

      if (response && response.status === "success") {
        let Permissions = response.result.roles;
        let Status_list = null;
        if (this.StatusList && this.StatusList.length > 0) {
          const statusFilterResult = this.StatusList.filter(({ value }) => Number(value) === Number(Permissions.is_active));
          if (statusFilterResult.length > 0) {
            Status_list = statusFilterResult[0];
          }
        }
        const { rolesPermissions } = response.result;
        const { PermissionList } = this.state;
        const Permission_List = [];
        if (rolesPermissions && Array.isArray(rolesPermissions) && rolesPermissions.length > 0) {
          rolesPermissions.forEach((rolesPermission) => {
            const filterResult = PermissionList.filter((permission) => Number(permission.value) === Number(rolesPermission));
            if (filterResult.length > 0) {
              Permission_List.push(filterResult[0]);
            }
          });
        }
        this.setState({
          RoleStatus: Status_list,
          RoleName: Permissions.name,
          RoleDes: Permissions.description,
          selectPerm: Permission_List,
        });
      }
    }
  }

  onSelectPerm = (selectPerm) => {
    this.setState({
      selectPerm,
      selectPermissionError: "",
    });
  };

  handleClose = () => {
    this.setState(
      {
        RoleStatus: [],
        RoleName: "",
        RoleDes: "",
        selectPerm: [],
        RoleNameError: "",
        // 
        CreateRole: false,
        RoleNameList: [],
        UpdatedPermissions: [],
        selectedRole: {},
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  // Validation for username
  validateSelectPerm = () => {
    const selectPermissionError = DropDownCheck(this.state.selectPerm);
    if (selectPermissionError === 1) {
      this.setState({ selectPermissionError: "Field empty" });
      return false;
    } else return true;
  };

  validateRoleName = () => {
    const RoleNameError = CheckUserName(this.state.RoleName);
    if (RoleNameError === 1) {
      this.setState({ RoleNameError: "Role Name empty" });
      return false;
    } else return true;
  };
  validateRoleDes = () => {
    const RoleDesError = CheckMessage(this.state.RoleDes);
    if (RoleDesError === 1) {
      this.setState({ RoleDesError: "Role Description empty" });
      return false;
    } else return true;
  };
  validateRoleNameList = () => {
    const RoleNameListError = DropDownCheck(this.state.RoleNameList);
    if (RoleNameListError === 1) {
      this.setState({ RoleNameListError: "Role Name List empty" });
      return false;
    } else return true;
  };

  validateRoleStatus = () => {
    const RoleStatusError = DropDownCheck(this.state.RoleStatus);
    if (RoleStatusError === 1) {
      this.setState({ RoleStatusError: "Field empty" });
      return false;
    } else return true;
  };

  // Empty input validation
  ValidateAll = () => {
    const RoleName = this.validateRoleName();
    const SelectedPerms = this.validateSelectPerm();
    const RoleStatus = this.validateRoleStatus();
    return RoleName && SelectedPerms && RoleStatus;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props?.saveAccess) {
      const editId = this.props.editRole;
      const user_id = User.user_id;
      const allValidation = this.ValidateAll();
      const { selectPerm } = this.state;
      const selectedPermissionIds = [];
      const selectedPermissionName = [];
      for (let i in selectPerm) {
        selectedPermissionIds.push(selectPerm[i].value);
        selectedPermissionName.push(selectPerm[i].label);
      }
      if (allValidation) {
        let requestData = {
          name: this.state.RoleName,
          description: this.state.RoleDes,
          user_id: user_id,
          is_active: this.state.RoleStatus?.value,
          permission_id: selectedPermissionIds,
        };
        if (editId) {
          requestData["user_id"] = User.user_id;
          const response = await updateRole(requestData, editId);
          if (response && response.status === "success") {
            this.handleClose();
            User.setRefresh(true);
            AppConfig.setMessage("Role updated successfully", false);
          } else if (response.status === "error") {
            this.handleClose();
            AppConfig.setMessage(response.result);
          }
        } else {
          const response = await CreateRoleInsert(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage(" Role created successfully", false);
            this.handleClose();
          } else if (response.status === "error") {
            this.handleClose();
            const result = response.result;
            let message = result;
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
          }
        }
      }
      if (this.props.afterSubmit) {
        await this.props.afterSubmit();
      }
    }
  };

  render() {
    const { PermissionList, selectPerm, RoleStatus } = this.state;
    return <div>
      <Modal
        size="md"
        className="border-style rounded CreateWingPage"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!!this.props.CreateRole}
      >
        <Modal.Header>
          <div className="form-head">
            <img
              alt="logo"
              src={logo}
              style={{ width: "50px", height: "50px", marginRight: "1rem" }}
            />
            {this.props.editRole ? (
              <h3> Update Role </h3>
            ) : (
              <h3> Create Role </h3>
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
              <div className="mb-4">
                <div className="input-row mb-3">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center">
                      Role Name <span className="asterik">*</span>
                    </label>
                    <input
                      // tabIndex="1"
                      type="text"
                      className={`form-control ${this.state.RoleNameError ? "validationError" : ""
                        }`}
                      id="personName"
                      placeholder={
                        this.state.RoleNameError
                          ? this.state.RoleNameError
                          : "Enter the Role Name"
                      }
                      value={this.state.RoleName}
                      onChange={(e) =>
                        this.setState({
                          RoleName: e.target.value,
                          RoleNameError: "",
                        })
                      }
                    />
                  </div>
                </div>
                <div className="input-row mb-3">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center">
                      Role Description
                    </label>
                    <input
                      // tabIndex="2"
                      type="text"
                      className="form-control"
                      id="personName"
                      placeholder="Enter the Role Description"
                      value={this.state.RoleDes}
                      onChange={(e) =>
                        this.setState({ RoleDes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 select">
                  <label className="selectIcon dflex align-center">
                    Permission <span className="asterik">*</span>
                  </label>

                  <MultiSelect
                    aria-label="Default select example"
                    placeholder={
                      this.state.selectPermissionError
                        ? this.state.selectPermissionError
                        : "Select the Permission"
                    }
                    className={
                      this.state.selectPermissionError ? "validationError" : null
                    }
                    type="drop"
                    value={selectPerm}
                    onChange={this.onSelectPerm}
                    components={animatedComponents}
                    isMulti
                    options={PermissionList}
                  // tabIndex="3"
                  />
                </div>

                <div className="d-flex justify-content-start">
                  {this.state.selectPermissionError ? (
                    <span className="small-font-size text-danger mb-2">
                      {this.state.selectPermissionError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mb-3">
                <div className="form-padding mb-3" style={{ width: "100%" }}>
                  <label className="dflex align-center selectIcon">
                    Role Active or Deactivate <span className="asterik">*</span>
                  </label>
                  <Select
                    aria-label="Default select example"
                    placeholder={this.state.RoleStatusError}
                    className={
                      this.state.RoleStatusError ? "validationError" : null
                    }
                    type="drop"
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onChange={this.onRoleStatus}
                    value={RoleStatus}
                    options={this.StatusList}
                    isClearable
                  // tabIndex="4"
                  />
                  <div className="d-flex justify-content-start mt-3">
                    {this.state.RoleStatusError ? (
                      <span className="small-font-size text-danger">
                        {this.state.RoleStatusError}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
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
                <button type="submit" className="btn  event-cta">
                  {this.props.editRole ? "Update Role " : "Create Role"}
                </button>
              </div> : null}
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </div>;
  }
}

export default observer(CreateRole);
