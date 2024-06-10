import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";
import AppConfig from "../modals/AppConfig";
import { CheckMessage, CheckUserName } from "../common/Validation";
import logo from "../components/img/logo.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import { BsTrashFill } from "react-icons/bs";
import { BsUpload } from "react-icons/bs";
import { uploadWingImage } from "../common/uploadFile";
import Select from "react-select";
import { eventFormDropdown } from "../libraries/event";
import makeAnimated from "react-select/animated";
import { Roles } from "../libraries/Roles";
import { IoAddCircleOutline } from "react-icons/io5";
import { Permissions } from "../libraries/Permissions";
import { TiDelete } from "react-icons/ti";
import { CreateWingFormInsert } from "../libraries/CreateWingFormInsert";
import User from "../modals/User";
import {
  deleteWingMember,
  updateWing,
  WingAutoPopulate,
} from "../libraries/wingDashboard";
import { observer } from "mobx-react";

const animatedComponents = makeAnimated();

class CreateWing extends React.Component {
  state = {
    CreateWing: false,
    wingName: "",
    wingDes: "",
    wingImage: "",
    RoleList: [],
    RoleName: "",
    SelectRoleMem: {},
    SelectSingleRole: {},
    SelectSingleMember: {},
    selectedMultiMembers: {},
    SelectRole: {},
    selectedRole: {},
    PermissionList: [],
    Members: [],
    selectMembers: [],
    fields: [],
    fields_role: [],
    wingRoleMembers: [],
    WingRoleList: [
      { value: "1", label: "Chairperson" },
      { value: "2", label: "Vice Chairperson" },
      { value: "3", label: "Co-Chairperson" },
      { value: "4", label: "Past Chairperson" },
      { value: "5", label: "Member" },
    ],
    wingMemID: [],
    wing_member_id: [],
  };

  componentDidMount = async (e) => {
    const response = await Permissions();
    const PermLis = [];
    if (response.statuscode === 200) {
      const Result = response.result;
      for (let i in Result) {
        let PerId = {
          value: Result[i].id,
          label: Result[i].name,
        };
        PermLis.push(PerId);
      }
      this.setState({
        PermissionList: PermLis,
      });
    }
    const responseRoles = await Roles();
    const RoleLis = [];
    if (responseRoles.statuscode === 200) {
      const Result = responseRoles.result.data;
      for (let i in Result) {
        let RoleId = {
          value: Result[i].id,
          label: Result[i].name,
        };
        RoleLis.push(RoleId);
      }
      this.setState({
        RoleList: this.state.WingRoleList,
      });
    }

    const responseMembers = await eventFormDropdown();
    const MemberPresentList = [];
    if (responseMembers && responseMembers.status === "success") {
      const ResultMembers = responseMembers.result;
      const users_dropdown = ResultMembers.users_dropdown;
      for (let i in users_dropdown) {
        let UserId = {
          value: users_dropdown[i].id,
          label: users_dropdown[i].name,
        };
        MemberPresentList.push(UserId);
      }
      this.setState({
        Members: MemberPresentList,
      });
    }
  };

  async componentDidUpdate(prevProps) {
    const id = this.props.editWing;
    if (
      this.props.CreateWing !== prevProps.CreateWing &&
      id &&
      this.props.CreateWing
    ) {
      this.setState({ CreateWing: this.props.CreateWing });
      const response = await WingAutoPopulate(id);
      if (response && response.status === "success") {
        let result = response.result.wing;
        let WingResult = response.result.wingMember;
        let fields = [];
        const selectMembers = this.state.Members;
        const selectedMembers = [];
        let wingRoleMembers = [];
        const wingMemID = [];
        if (WingResult && WingResult.length > 0) {
          fields = Array.from(Array(WingResult.length).keys());
          for (let i = 0; i < WingResult.length; i++) {
            const childArray = [];
            const users = JSON.parse(WingResult[i]["members"]);
            for (let j in users) {
              for (let k in selectMembers) {
                if (users[j] === selectMembers[k]["value"]) {
                  childArray.push(selectMembers[k]);
                  break;
                }
              }
            }
            if (WingResult[i]["wing_role"] === "Member") {
              fields.pop();
              wingRoleMembers = childArray;
            } else {
              selectedMembers.push(childArray);
            }
            wingMemID.push(WingResult[i]["id"]);
          }
        }
        const SelectRole = this.state.RoleList;
        const selectedWingRoles = [];
        const wingRoles = [];
        let fields_role = [];
        if (SelectRole && SelectRole.length > 0) {
          fields_role = Array.from(Array(SelectRole.length).keys());
          for (let i = 0; i < SelectRole.length; i++) {
            for (let j in WingResult) {
              if (SelectRole[i]["label"] === WingResult[j].wing_role) {
                let role = {
                  value: SelectRole[i]["value"],
                  label: WingResult[j].wing_role,
                };
                if (WingResult[j]["wing_role"] === "Member") {
                  wingRoles.push(role);
                } else {
                  selectedWingRoles.push(role);
                }
              }
            }
          }
        }

        this.setState({
          user_id: result?.user_id,
          description: result?.content,
          wingName: result?.title,
          wingDes: result?.content,
          selectMembers: selectedMembers,
          SelectRoles: wingRoles,
          selectedRoles: selectedWingRoles,
          status: true,
          wingImage: result?.image,
          fields: fields,
          wingRoleMembers: wingRoleMembers,
          fields_role: fields_role,
          wingMemID: wingMemID,
          wing_member_id: WingResult,
        });
      }
    }
  }

  onSelectRole = (selectedRole) => {
    this.setState({
      selectedRole: selectedRole,
    });
  };

  onSelectRoleMem = (selectedRole) => {
    this.setState({
      SelectRole: selectedRole,
    });
  };

  onSelectRoleMember = (selectedRoleMem) => {
    this.setState({
      SelectRoleMem: selectedRoleMem,
    });
  };

  onSelectSingleRole = (e, idx) => {
    const { selectedRoles } = this.state;
    selectedRoles[idx] = e;
    this.setState({ selectedRoles });
  };

  onSelectSingleMembers = (e, idx) => {
    const { selectMembers } = this.state;
    selectMembers[idx] = e;
    this.setState({ selectMembers });
  };

  onSelectMembers = (wingRoleMembers) => this.setState({ wingRoleMembers });

  renderThumbnailImage = () => {
    return this.props.editWing ? (
      <div
        className="d-flex my-3 "
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="col-md-3">
          <div className="thumbnail-image">
            <img
              src={this.state.wingImage}
              alt="project"
              style={{
                width: "100px",
                height: "auto",
                borderRadius: "unset",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    ) : (
      <div
        className="d-flex my-3"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="col-md-3">
          <div className="thumbnail-image">
            <img
              src={this.state.wingImage}
              alt="project"
              style={{
                width: "100px",
                height: "auto",
                borderRadius: "unset",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <div className="col-md-2">
          <BsTrashFill
            className="theme-font-color big-font-size m-2 pointer"
            onClick={() => this.setState({ wingImage: "" })}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    );
  };

  validateWingName = () => {
    const cityError = CheckUserName(this.state.wingName);
    if (cityError === 1) {
      this.setState({ cityError: "Field empty" });
      return false;
    } else return true;
  };

  validateWingDes = () => {
    const descriptionError = CheckMessage(this.state.wingDes);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  DynamicInput = () => {
    const { RoleList, fields, Members } = this.state;
    return (
      <div className="upload-section mb-4">
        <div className="form-floating mb-3 upload-doc-strip">
          <div className="form-control upload-doc-strip mb-4">
            <h4>Assign Roles</h4>
          </div>
        </div>
        <div className="upload-doc-div mb-4">
          <div className="mb-4"></div>
          <div className="App">
            <button
              type="button"
              className="btn upload-doc-div event-cta mb-4"
              style={{ width: "100%" }}
              onClick={this.handleAdd}
            >
              Add Member
              <IoAddCircleOutline
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  marginLeft: "0.5rem",
                }}
              />
            </button>
            {fields.length > 0 ? (
              <>
                {fields.map((field, idx) => {
                  const { selectMembers, selectedRoles } = this.state;
                  const currentRole = selectedRoles[idx];
                  const currentUser = selectMembers[idx];
                  return (
                    <div key={`${field}-${idx}`}>
                      <div>
                        <div className="upload-doc-div mb-4">
                          <div className="mb-3 select">
                            <label>Wing Role</label>
                            <Select
                              aria-label="Default select example"
                              placeholder="Select the Wing Role"
                              type="drop"
                              value={currentRole}
                              onChange={(e) => this.onSelectSingleRole(e, idx)}
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              options={RoleList}
                            />
                          </div>
                        </div>
                        <div className="upload-doc-div mb-4">
                          <div className="mb-3 select">
                            <label>Member </label>
                            <Select
                              aria-label="Default select example"
                              placeholder="Select the Member"
                              type="drop"
                              value={currentUser}
                              onChange={(e) =>
                                this.onSelectSingleMembers(e, idx)
                              }
                              closeMenuOnSelect={true}
                              options={Members}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn event-cta-trans"
                        style={{ width: "100%" }}
                        onClick={() => this.handleRemove(idx)}
                      >
                        Delete Member
                        <TiDelete
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  handleClose = () => {
    this.setState(
      {
        description: "",
        wingName: "",
        wingDes: "",
        selectMembers: {},
        selectedMultiMembers: {},
        SelectRoles: {},
        selectedRoles: {},
        wingImage: "",
        wingRoleMembers: [],
        cityError: "",
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  handleChange = (i, event) => {
    const { fields } = this.state;
    const values = [...fields];
    values[i].value = event.target.value;
    this.setState({ fields: values });
  };

  handleAdd = () => {
    const { fields } = this.state;
    const values = [...fields];
    values.push({ value: null });
    this.setState({ fields: values });
  };

  handleRemove = (i) => {
    const { fields } = this.state;
    const values = [...fields];
    values.splice(i, 1);
    const { wingMemID } = this.state;
    deleteWingMember(wingMemID[i]);
    delete wingMemID[i];
    this.setState({ wingMemID, fields: values });
  };

  // Empty input validation
  ValidateAll = () => {
    const wingName = this.validateWingName();

    if (wingName) {
      return true;
    } else {
      return false;
    }
  };

  // Handle file select
  handleUploadImage = (e) => {
    e.preventDefault();
    const fileSelector = document.getElementById("wingImage");
    fileSelector.click();
  };

  // Select file selectUploadImage
  selectUploadImage = (e) => {
    e.preventDefault();
    const wing_image = e.target.files[0];
    uploadWingImage(wing_image, this.callBackEventImage);
    console.log("upload", wing_image);
  };

  callBackEventImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ wingImage: response.result.url });
    }
    console.log("upload", this.state.wingImage);
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e.preventDefault();
    if (this.props?.saveAccess) {
      const allValidation = this.ValidateAll();
      const editId = this.props.editWing;
      if (allValidation) {
        const user_id = User.user_id;
        const { selectMembers, wingRoleMembers, wing_member_id } = this.state;
        const selectedMem = [];
        const selectedRole = [];
        const wing_member_ids = [];
        const memberIds = [];
        const singleMembers = [];
        console.log("default value => ", wingRoleMembers, selectMembers);
        const single_role_member = [];
        for (let j in selectMembers) {
          const single_role_member1 = [];
          single_role_member1.push(selectMembers[j]["value"]);
          singleMembers.push(single_role_member1);
        }
        for (let i in wingRoleMembers) {
          single_role_member.push(wingRoleMembers[i]["value"]);
          memberIds.push(wingRoleMembers[i]["value"]);
        }
        singleMembers.push(single_role_member);
        console.log("singleMembers", singleMembers);
        selectedMem.push(memberIds);
        for (let i in wing_member_id) {
          wing_member_ids.push(wing_member_id[i]["id"]);
        }

        for (let i in this.state.selectedRoles) {
          selectedRole.push(this.state.selectedRoles[i]["label"]);
        }

        const requestData = {
          title: this.state.wingName,
          content: this.state.wingDes,
          members: "null",
          status: true,
          image: this.state.wingImage,
          user_id: user_id,
        };
        const requestData2 = {
          wing_member_id: wing_member_ids,
          wing_role: selectedRole,
          members: singleMembers,
          wing_id: editId,
          user_id: user_id,
          title: this.state.wingName,
          content: this.state.wingDes,
          image: this.state.wingImage,
        };
        if (editId) {
          requestData["user_id"] = User.user_id;
          const response = await updateWing(requestData2, editId);
          if (response && response.status === "success") {
            this.handleClose();
            AppConfig.setMessage("Wing updated successfully", false);
          } else if (response.status === "error") {
            this.handleClose();
            AppConfig.setMessage(response.result);
          }
        } else {
          const response = await CreateWingFormInsert(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage(" Wing Created ", false);
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
        if (this.props?.afterSubmit) {
          await this.props?.afterSubmit();
        }
      }
    }
  };

  render() {
    const { Members, wingRoleMembers } = this.state;
    const currentUser = wingRoleMembers;
    return (
      <div className="CreateWingPage">
        <Modal
          size="md"
          className="border-style rounded CreateWingPage"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.CreateWing}
        >
          <Modal.Header>
            <div className="form-head">
              <img
                alt="logo"
                src={logo}
                style={{ width: "50px", height: "50px", marginRight: "1rem" }}
              />
              {this.props.editWing ? (
                <h3> Update Wing </h3>
              ) : (
                <h3> Create Wing </h3>
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
                  {this.props.editWing ? (
                    <div className="mb-4">
                      <div className="input-row">
                        <div className="mb-3">
                          <div className="form-padding mb-3">
                            <label>Wing Name</label>
                            <p
                              className="form-control"
                              style={{ height: "150px" }}
                            >
                              {this.state.wingName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="input-row mb-3">
                      <div className="form-padding mb-3">
                        <label className="selectIcon dflex align-center">
                          Wing Name <span className="asterik">*</span>
                        </label>
                        {this.state.cityError ? (
                          <input
                            tabIndex="1"
                            type="text"
                            className="form-control validationError"
                            id="personName"
                            placeholder={this.state.cityError}
                            onChange={(e) =>
                              this.setState({ wingName: e.target.value })
                            }
                            value={this.state.wingName}
                          />
                        ) : (
                          <input
                            tabIndex="1"
                            type="text"
                            className="form-control"
                            id="personName"
                            placeholder="Enter the Wing Name"
                            onChange={(e) =>
                              this.setState({ wingName: e.target.value })
                            }
                            value={this.state.wingName}
                            onKeyPress={(e) => {
                              const regex = /^[a-zA-Z ]{1}$/i;
                              if (!regex.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {this.props.editWing ? (
                  <div className="mb-4">
                    <div className="input-row">
                      <div className="mb-3">
                        <div className="form-padding mb-3">
                          <label>Wing Description</label>
                          <p
                            className="form-control"
                            style={{
                              height: "180px",
                              overflow: "auto",
                              resize: "vertical",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: this.state.wingDes,
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="input-row">
                      <div className="mb-3">
                        <div className="form-padding mb-3">
                          <label>Wing Description</label>
                          <textarea
                            tabIndex="2"
                            className="form-control"
                            label=""
                            placeholder="Wing Description"
                            type="textarea"
                            style={{ height: "150px" }}
                            value={this.state.wingDes}
                            onChange={(e) =>
                              this.setState({ wingDes: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <div className="form-padding mb-4 upload-agenda">
                    {this.state.wingImage ? (
                      <div className="col-md-12">
                        {this.renderThumbnailImage()}
                      </div>
                    ) : (
                      <div>
                        <input
                          className="form-control bsUpload "
                          id="wingImage"
                          label="Date"
                          placeholder=""
                          type="file"
                          onChange={this.selectUploadImage}
                        />
                        <button
                          className="btn  small-font-size font-style py-2 my-2"
                          onClick={this.handleUploadImage}
                        >
                          <BsUpload />
                          <span className="mx-3">Upload Event Image </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div></div>
                {this.props.editWing ? (
                  <div className="upload-section mb-5">
                    {this.DynamicInput()}
                    <div className="form-floating mb-3 upload-doc-strip">
                      <div className="form-control upload-doc-strip mb-4">
                        <h4>Add Wing Members</h4>
                      </div>
                    </div>
                    <div className="upload-doc-div mb-3">
                      <div className="mb-4">
                        <div className="input-row mb-3">
                          <label>Member</label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="mb-3 select">
                          <label>Add Members </label>
                          <Select
                            aria-label="Default select example"
                            placeholder="Select the Members"
                            type="drop"
                            value={currentUser}
                            onChange={this.onSelectMembers}
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            isMulti
                            isClearable
                            options={Members}
                          />
                        </div>
                        <div className="d-flex justify-content-start">
                          {this.state.selectMemberError ? (
                            <span className="small-font-size text-danger">
                              {this.state.selectMemberError}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props?.saveAccess ? <div className="cta-section jc-sb">
                  <button
                    type="submit"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta">
                    Save
                  </button>
                </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  };
}

export default observer(CreateWing);
