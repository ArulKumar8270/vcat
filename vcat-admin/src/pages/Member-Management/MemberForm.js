import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from "moment";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";

// CSS  imports //
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "../../components/img/logo.png";
import s from "../../components/img/s.jpg";

// Common file imports //
import User from "../../modals/User";
import AppConfig from "../../modals/AppConfig";
import {
  CheckDob,
  CheckMessage,
  CheckUserName,
  DropDownCheck,
  CheckMeetingCode,
  CheckPhone,
  CheckEmail,
  CheckAddress,
} from "../../common/Validation";

// Api file imports //
import {
  memberAutoPopulate,
  // memberDashboard,
  memberFormInsert,
  memberRoles,
  updateMember,
} from "../../libraries/memberDashboard";
import { observer } from "mobx-react";
import { roleTable } from "../../libraries/Roles";
import { alphaKeyPress, BloodGroupOptions, numberKeyPress } from "../../common/Common";
import { Calendar } from "primereact/calendar";

const designationRoleList = [
  {
    label: "Life Trustee",
    value: "Life Trustee",
  },
  {
    label: "Life Member",
    value: "Life Member",
  },
  {
    label: "Non Member",
    value: "Non Member",
  },
];

// Components imports //
const animatedComponents = makeAnimated();

class MemberForm extends React.Component {
  constructor() {
    super();
    this.onCATypeChange = this.onCATypeChange.bind(this);
    this.onJoinType = this.onJoinType.bind(this);
    this.onPayType = this.onPayType.bind(this);
    this.state = {
      status: null,
      MemberNo: "",
      email: "",
      role_id: "",
      personName: "",
      fatherName: "",
      Qualification: "",
      DOB: "",
      DOM: "",
      DOS: "",
      BloodGroup: null,
      Occupation: "",
      MemberOcc: "",
      OfficeAddress: "",
      CAResidence: "",
      CAOffice: "",
      OfficeMob: "",
      ResAddress: "",
      MobNum: "",
      SpouseName: "",
      NOC: "",
      NameChild1: "",
      NameChild2: "",
      NameChild3: "",
      NameChild4: "",
      AssOrg: "",
      SocialOrg: "",
      BLife: "",
      BMember: "",
      Cash: "",
      OnlineTransfer: "",
      Check: "",
      DD: "",

      onPayType: "",
      onCATypeChange: "",
      onJoinType: "",
      selectBG: "",
      selectedRoleId: [],
      SelectedWing: [],
      selectWing: {},
      selectDesignationTitle: null,
      selectDesignation: null,
      selectWingRole: {},

      DesignationList: [],
      profile: "",
      coverImage: { s },
      WingList: [],
      onStatusType: "",
      inActiveStatusComments: "",
      transactionId: "",
      rolesArr: [],
    };
  }

  componentDidMount = async () => {
    //   const response = await memberDashboard();
    //   if (response.statuscode === 200) {
    //     const DesList = [
    //       {
    //         value: 1,
    //         label: "BOARD OF TRUSTEES",
    //       },
    //       {
    //         value: 2,
    //         label: "Mentors",
    //       },
    //       {
    //         value: 3,
    //         label: "Past Presidents",
    //       },
    //     ];

    //     await this.RoleApi();
    //     this.setState({
    //       DesignationList: DesList,
    //     });
    //   }  
    const DesList = [
      {
        value: 1,
        label: "BOARD OF TRUSTEES",
      },
      {
        value: 2,
        label: "Mentors",
      },
      {
        value: 3,
        label: "Past Presidents",
      },
    ];

    await this.RoleApi();
    this.setState({
      DesignationList: DesList,
    });
  };

  async componentDidUpdate(prevProps) {
    const id = this.props.editMember;
    if (this.props.status !== prevProps.status && this.props.status) {
      await this.componentDidMount();
      if (id !== undefined && id !== null) {
        this.setState({ status: this.props.status });

        const response = await memberAutoPopulate(id);
        if (response && response.status === "success") {
          let result = response.result.users;
          const { DesignationList } = this.state;
          let selectedDesTitle = null;
          if (DesignationList && DesignationList.length > 0) {
            for (let i = 0; i < DesignationList.length; i++) {
              if (result?.designation_title && Number(DesignationList[i]["value"]) === Number(result?.designation_title)) {
                selectedDesTitle = DesignationList[i];
                break;
              }
            }
          }

          const selectedDes = result?.designation ? { label: result?.designation, value: result?.designation } : null;
          const selectedRoleId = [];
          if (result?.role_id) {
            const roleIds = JSON.parse(result?.role_id) || [];
            const { rolesArr } = this.state;
            if (Array.isArray(roleIds) && roleIds.length > 0) {
              roleIds?.forEach((roleId) => {
                for (let index = 0; index < rolesArr.length; index++) {
                  const role = rolesArr[index];
                  if (String(roleId) === String(role?.value)) {
                    selectedRoleId.push(role);
                  }
                }
              });
            } else if (typeof roleIds === 'number') {
              for (let index = 0; index < rolesArr.length; index++) {
                const role = rolesArr[index];
                if (String(roleIds) === String(role?.value)) {
                  selectedRoleId.push(role);
                }
              }
            }
          }
          this.setState({
            personName: result?.name,
            MemberNo: result?.icai_membership_no,
            Qualification: result?.qualification,
            DOB: result?.dob ? moment(result?.dob).format("yyyy-MM-DD") : "",
            fatherName: result?.nominee_name,
            selectBG: { value: result?.blood_group, label: result?.blood_group },
            onCATypeChange: result?.communication_address,
            MemberOcc: result?.occupation,
            Occupation: result?.member_occupation,
            OfficeAddress: result?.office_address,
            ResAddress: result?.residence_address,
            OfficeMob: result?.office_mobile,
            MobNum: result?.mobile_number,
            selectDesignationTitle: selectedDesTitle,
            selectDesignation: selectedDes,
            SpouseName: result?.spouse_name,
            DOS: result?.spouse_dob ? moment(result?.spouse_dob).format("yyyy-MM-DD") : "",
            DOM: result?.marriage_date ? moment(result?.marriage_date).format("yyyy-MM-DD") : "",
            NOC: result?.nos_children,
            NameChild1: result?.children_name_1,
            NameChild2: result?.children_name_2,
            children_name_3: null,
            AssOrg: result?.associate_org_member,
            SocialOrg: result?.associate_org_position,
            onJoinType: result?.become,
            onPayType: result?.payment_type,
            selectedRoleId,
            email: result?.email,

            transactionId: result?.payment_transaction_id,
            onStatusType: result?.status !== undefined && result?.status !== null ? (result?.status ? "active" : "inactive") : null,
            inActiveStatusComments: result?.inactive_status_comments,
          });
        }
      }
    }
  }

  async callApiDes() {
    const requestData = {
      designation_id: this.state.selectDesignationTitle?.value,
    };
    const response = await memberRoles(requestData);
    if (response && response.status === "success") {
      const Result = response.result;
      const RoleList = Result.roles_dropdown;
      const RoleLists = [];
      for (let i in RoleList) {
        const PageId = {
          value: RoleList[i].id,
          label: RoleList[i].name,
        };
        RoleLists.push(PageId);
      }
      this.setState({
        RoleList: RoleLists,
      });
    }
  }

  RoleApi = async () => {
    const response = await roleTable();
    if (response) {
      const { result, status } = response;
      if (status === "success" && result) {
        const rolesArr = [];
        result?.forEach(({ id, name }) => {
          rolesArr.push({
            label: name,
            value: id,
          });
        });
        this.setState({ rolesArr });
      }
    }
  };

  onSelectWing = (e) => {
    const SelectedWing = [];
    for (let i in e) {
      const WingId = {
        value: e[i].value,
        label: e[i].label,
      };
      SelectedWing.push(WingId);
    }

    this.setState({
      selectWing: SelectedWing,
    });
  };

  onSelectWingRole = (e) => {
    const SelectedWingRole = [];
    for (let i in e) {
      const WingId = {
        value: e[i].value,
        label: e[i].label,
      };
      SelectedWingRole.push(WingId);
    }

    this.setState({
      selectWingRole: SelectedWingRole,
    });
  };

  onSelectCreate = async () => {
    this.setState({ status: true });
  };

  onSelectBG = (selectedBG) => {
    this.setState({ selectBG: selectedBG });
  };

  onSelectDesignation = (selectedDesignation) => {
    this.setState({ selectDesignation: selectedDesignation });
  };

  onCATypeChange = (e) => {
    this.setState({
      onCATypeChange: e.target.value,
    });
  };

  onJoinType = (e) => {
    this.setState({
      onJoinType: e.target.value,
    });
  };

  onPayType = (e) => {
    this.setState({
      onPayType: e.target.value,
    });
  };

  onStatusType = (e) => {
    this.setState({ onStatusType: e.target.value });
  };

  onSelectRole = (selectedRoleId) => {
    console.log("selectedRoleId", selectedRoleId);
    this.setState({ selectedRoleId });
  };

  handleClose = () => {
    this.setState(
      {
        MemberNo: "",
        email: "",
        role_id: "",
        personName: "",
        fatherName: "",
        Qualification: "",
        DOB: "",
        DOM: "",
        DOS: "",
        Occupation: "",
        MemberOcc: "",
        OfficeAddress: "",
        CAResidence: "",
        CAOffice: "",
        OfficeMob: "",
        ResAddress: "",
        MobNum: "",
        SpouseName: "",
        NOC: "",
        NameChild1: "",
        NameChild2: "",
        NameChild3: "",
        NameChild4: "",
        AssOrg: "",
        SocialOrg: "",
        BLife: "",
        BMember: "",
        Cash: "",
        OnlineTransfer: "",
        Check: "",
        DD: "",

        onPayType: "",
        onCATypeChange: "",
        onJoinType: "",
        selectBG: {},
        selectedRoleId: [],
        SelectedWing: [],
        selectWing: {},
        selectDesignationTitle: null,
        selectDesignation: null,
        selectWingRole: {},
        personNameError: "",
        emailError: "",
        MobError: "",

        transactionId: null,
        onStatusType: null,
        inActiveStatusComments: null,
        // 
        status: null,
        BloodGroup: null,
        DesignationList: [],
        profile: "",
        coverImage: { s },
        WingList: [],
        rolesArr: [],
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  // Validation for username
  validatePersonName = () => {
    let personNameError = "Field empty";
    const check = [1, 2].includes(CheckUserName(this.state.personName));
    if (!check) personNameError = "";
    this.setState({ personNameError });
    return !check;
  };

  validateMail = () => {
    let emailError = "Field empty";
    const check = [1, 2].includes(CheckEmail(this.state.email));
    if (!check) emailError = "";
    this.setState({ emailError });
    return !check;
  };

  validateFatherName = () => {
    let fatherNameError = "Field empty";
    const check = CheckUserName(this.state.fatherName) === 1;
    if (!check) fatherNameError = ""
    this.setState({ fatherNameError });
    return !check;
  };

  validateDateSpouse = () => {
    let SpouseDateError = "Field empty";
    const check = CheckDob(this.state.DOS) === 1
    if (!check) SpouseDateError = "";
    this.setState({ SpouseDateError });
    return !check;
  };

  validateOfficeMob = () => {
    let OfficeMobError = "Field empty";
    const check = CheckPhone(this.state.OfficeMob) === 1
    if (!check) OfficeMobError = "";
    this.setState({ OfficeMobError });
    return !check;
  };

  validateMobNum = () => {
    const check = CheckPhone(this.state.MobNum) === null;
    let MobError = "Field empty";
    if (check) MobError = "";
    this.setState({ MobError });
    return check;
  };

  validateDateMarriage = () => {
    const check = CheckDob(this.state.DOM) === 1;
    let DOMError = "Field empty";
    if (!check) DOMError = "";
    this.setState({ DOMError });
    return !check;
  };

  validateDOB = () => {
    const DOBError = CheckDob(this.state.DOB);
    if (DOBError === 1) {
      this.setState({ DOBError: "Field empty" });
      return false;
    }
    return true;
  };

  validateMemberNo = () => {
    const MeetingNumberError = CheckMeetingCode(this.state.MemberNo);
    if (MeetingNumberError === 1) {
      this.setState({ MeetingNumberError: "Field empty" });
      return false;
    }
    return true;
  };

  validateQual = () => {
    const QualificationError = CheckUserName(this.state.Qualification);
    if (QualificationError === 1) {
      this.setState({ QualificationError: "Field empty" });
      return false;
    }
    return true;
  };

  validateSpouseName = () => {
    const SpouseNameError = CheckUserName(this.state.SpouseName);
    if (SpouseNameError === 1) {
      this.setState({ SpouseNameError: "Field empty" });
      return false;
    }
    return true;
  };

  validateCN1 = () => {
    const NameChild1Error = CheckUserName(this.state.NameChild1);
    if (NameChild1Error === 1) {
      this.setState({ NameChild1Error: "Field empty" });
      return false;
    }
    return true;
  };
  validateCN2 = () => {
    const NameChild2Error = CheckUserName(this.state.NameChild2);
    if (NameChild2Error === 1) {
      this.setState({ NameChild2Error: "Field empty" });
      return false;
    }
    return true;
  };
  validateOcc = () => {
    const OccupationError = CheckMessage(this.state.MemberOcc);
    if (OccupationError === 1) {
      this.setState({ OccupationError: "Field empty" });
      return false;
    } else return true;
  };
  validateAssOrg = () => {
    const AssOrgError = CheckMessage(this.state.AssOrg);
    if (AssOrgError === 1) {
      this.setState({ AssOrgError: "Field empty" });
      return false;
    } else return true;
  };
  validateResAddress = () => {
    const ResAddressError = CheckAddress(this.state.ResAddress);
    if (ResAddressError === 1) {
      this.setState({ ResAddressError: "Field empty" });
      return false;
    } else return true;
  };
  validateAddress = () => {
    const OfficeAddressError = CheckAddress(this.state.OfficeAddress);
    if (OfficeAddressError === 1) {
      this.setState({ OfficeAddressError: "Field empty" });
      return false;
    } else return true;
  };

  validateBG = () => {
    const BloodGroupError = DropDownCheck(this.state.BloodGroup);
    if (BloodGroupError === 1) {
      this.setState({ BloodGroupError: "Field empty" });
      return false;
    } else return true;
  };
  validateNOC = () => {
    const NOCError = DropDownCheck(this.state.NOC);
    if (NOCError === 1) {
      this.setState({ NOCError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectWing = () => {
    const SelectWingError = DropDownCheck(this.state.selectWing);
    if (SelectWingError === 1) {
      this.setState({ SelectWingError: "Name empty" });
      return false;
    } else return true;
  };

  getRoleValues() {
    const { selectedRoleId } = this.state;
    const roleIds = [];
    if (Array.isArray(selectedRoleId) && selectedRoleId.length > 0) {
      selectedRoleId?.forEach(({ value: roleId }) => roleIds.push(roleId));
    }
    return roleIds;
  }

  // Empty input validation
  ValidateAll = () => {
    const personName = this.validatePersonName();
    const MobNum = this.validateMobNum();
    const Email = this.validateMail();

    const result = personName && MobNum && Email;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props?.saveAccess) {
      const { user_id } = User;
      const edit = this.props.editMember;
      const allValidation = this.ValidateAll();
      let bg = null;
      if (this.state.selectBG !== undefined && this.state.selectBG !== null && this.state.selectBG.label !== undefined) {
        bg = this.state.selectBG.label;
      }
      if (allValidation) {
        const requestData = {
          name: this.state.personName,
          image: this.state.profile,
          cover_pic: this.state.coverImage.s,
          wings: "[]",
          user_id,
          nominee_name: this.state.fatherName ? this.state.fatherName : null,
          icai_membership_no: this.state.MemberNo ? this.state.MemberNo : null,
          qualification: this.state.Qualification ? this.state.Qualification : null,
          dob: this.state?.DOB ? moment(this.state?.DOB).format("YYYY-MM-DDTHH:mm") : null,
          blood_group: bg ? bg : null,
          occupation: this.state.MemberOcc,
          member_occupation: this.state.Occupation,
          communication_address: this.state.onCATypeChange ? this.state.onCATypeChange : null,
          office_address: this.state.OfficeAddress ? this.state.OfficeAddress : null,
          residence_address: this.state.ResAddress ? this.state.ResAddress : null,
          office_mobile: this.state.OfficeMob ? this.state.OfficeMob : null,
          mobile_number: this.state.MobNum,
          destination: this.state.selectDesignationTitle && this.state.selectDesignationTitle?.value ? this.state.selectDesignationTitle?.value : null,
          spouse_name: this.state.SpouseName ? this.state.SpouseName : null,
          spouse_dob: this.state?.DOS ? moment(this.state?.DOS).format("YYYY-MM-DDTHH:mm") : null,
          marriage_date: this.state?.DOM ? moment(this.state?.DOM).format("YYYY-MM-DDTHH:mm") : null,
          nos_children: this.state.NOC ? this.state.NOC : null,
          children_name_1: this.state.NameChild1 ? this.state.NameChild1 : null,
          children_name_2: this.state.NameChild2 ? this.state.NameChild2 : null,
          children_name_3: null,
          associate_org_member: this.state.AssOrg,
          associate_org_position: this.state.SocialOrg,

          become: this.state.onJoinType,
          payment_type: this.state.onPayType,
          role_id: JSON.stringify(this.getRoleValues()),
          email: this.state.email,
          discription: null,
          option_1: null,
          designation_title: this.state.selectDesignationTitle && this.state.selectDesignationTitle?.value ? this.state.selectDesignationTitle?.value : null,
          designation: this.state.selectDesignation && this.state.selectDesignation?.value ? this.state.selectDesignation?.value : null,
          payment_transaction_id: this.state?.transactionId ? this.state?.transactionId : null,
          status: (this.state.onStatusType !== undefined && this.state.onStatusType !== null) ? (this.state.onStatusType === "active") : null,
          inactive_status_comments: this.state.inActiveStatusComments && this.state.onStatusType !== "active" ? this.state.inActiveStatusComments : null
        };
        if (edit) {
          const response = await updateMember(requestData, edit);
          if (response && response.status === "success") {
            this.handleClose();
            AppConfig.setMessage("Member updated successfully", false);
          } else if (response.status === "error") {
            this.handleClose();
            AppConfig.setMessage(response?.result);
          } else if (response.status === "0") {
            if (response.error) {
              if (typeof response.error === "string") {
                AppConfig.setMessage(response.error);
              }
              else {
                let errorMessages = "";
                Object.keys(response.error).forEach((errKey) => {
                  const err = response.error[errKey];
                  if (err && Array.isArray(err) && err.length > 0) {
                    if (errorMessages === "")
                      errorMessages = err.join("\n");
                    else
                      errorMessages = errorMessages + "\n\n" + err.join("\n");
                  }
                });
                AppConfig.setMessage(errorMessages);
              }
            }
            AppConfig.setMessage(response?.result);
          }
        } else {
          requestData.approved = true;
          const response = await memberFormInsert(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage("Member created successfully", false);
            this.handleClose();
          } else if (response.status === "error") {
            this.props.closeModel(false);
            const result = response.result;
            let message = result;
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
          } else if (response.status === "0") {
            if (response.error) {
              let errorMessages = "";
              let personNameError = "";
              let emailError = "";
              let MobError = "";
              const errorValidationMsg = "Field empty";
              Object.keys(response.error).forEach((errKey) => {
                const err = response.error[errKey];
                if (err && Array.isArray(err) && err.length > 0) {
                  if (errorMessages === "")
                    errorMessages = err.join("\n");
                  else
                    errorMessages = errorMessages + "\n\n" + err.join("\n");
                }
                if (errKey === "mobile_number")
                  MobError = errorValidationMsg;
                if (errKey === "name")
                  personNameError = errorValidationMsg;
                if (errKey === "email")
                  emailError = errorValidationMsg;
                this.setState({ personNameError, emailError, MobError });

              });
              AppConfig.setMessage(errorMessages);
            }
          }
        }
        if (this.props.afterSubmit) await this.props.afterSubmit();
      }
    }
  };

  render() {
    const {
      // RoleList, 
      DesignationList,
      rolesArr,
      selectedRoleId,
    } =
      this.state;
    return (
      <div>
        <Modal
          size="md"
          className="border-style rounded"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.status}
        >
          <Modal.Header>
            <div className="form-head">
              <img
                alt="logo"
                src={logo}
                style={{ width: "50px", height: "50px", marginRight: "1rem" }}
              />
              <h3> Member Form</h3>
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
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Name <span className="asterik">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${this.state.personNameError ? "validationError" : ""
                          }`}
                        id="personName"
                        placeholder={
                          this.state.personNameError
                            ? this.state.personNameError
                            : "Enter the Name"
                        }
                        value={this.state.personName || ""}
                        onChange={(e) =>
                          this.setState({
                            personName: e.target.value,
                            personNameError: "",
                          })
                        }
                        onKeyPress={alphaKeyPress}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        ICAI MEMBERSHIP NO
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="MemberNo"
                        placeholder="ICAI MEMBERSHIP NO"
                        value={this.state.MemberNo || ""}
                        onChange={(e) =>
                          this.setState({ MemberNo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Father's/Husband's Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fatherName"
                        placeholder="Enter the Name"
                        value={this.state.fatherName || ""}
                        onChange={(e) =>
                          this.setState({
                            fatherName: e.target.value,
                            personNameError: "",
                          })
                        }
                        onKeyPress={alphaKeyPress}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Qualification</label>
                      <input
                        type="text"
                        className="form-control"
                        id="Qualification"
                        placeholder="Qualification"
                        value={this.state.Qualification || ""}
                        onChange={(e) =>
                          this.setState({ Qualification: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label className="selectIcon" htmlFor="fromDate">
                        Date of Birth
                      </label>
                      {/* <input
                        className="form-control"
                        id="DOB"
                        label="From"
                        placeholder="Date of Birth"
                        type="date"
                        value={this.state.DOB}
                        onChange={(e) => this.setState({ DOB: e.target.value })}
                      /> */}
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName="form-control"
                        placeholder="dd-mm-yyyy"
                        className="w-100"
                        value={this.state?.DOB ? new Date(this.state?.DOB) : null}
                        onChange={({ value }) => this.setState({ DOB: value })}
                        maxDate={new Date()}
                        appendTo="self"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="select mb-3">
                      <label className="selectIcon">
                        Blood Group
                      </label>
                      <Select
                        aria-label="Default select example"
                        placeholder="Select the Blood Group"
                        type="drop"
                        closeMenuOnSelect={true}
                        value={this.state.selectBG || null}
                        components={animatedComponents}
                        onChange={this.onSelectBG}
                        options={BloodGroupOptions}
                        isClearable
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-4">
                      <label>Occupation</label>
                      <input
                        type="text"
                        className="form-control"
                        id="MemberOcc"
                        placeholder="Enter your Occupation"
                        value={this.state.MemberOcc || ""}
                        onChange={(e) =>
                          this.setState({ MemberOcc: e.target.value })
                        }
                      />
                    </div>
                    <div className="radio-section event-type">
                      <label
                        htmlFor="floatingInput"
                        className="radio-head mb-3"
                      >
                        Communication Address (Please Select)
                      </label>
                      <div className="form-padding radio-input  ">
                        <div className="dflex align-center internal">
                          <input
                            value="office"
                            type="radio"
                            name="onCATypeChange radio"
                            id="office"
                            checked={this.state.onCATypeChange === "office"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onCATypeChange}
                          />
                          <label htmlFor="office" className="mb-0">
                            Office
                          </label>
                        </div>
                        <div className="dflex align-center virtual">
                          <input
                            value="residence"
                            type="radio"
                            name="onCATypeChange radio"
                            id="residence"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.onCATypeChange === "residence"}
                            onChange={this.onCATypeChange}
                          />
                          <label htmlFor="residence" className="mb-0">
                            Residence
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="input-row mb-3" style={{ marginTop: "" }}>
                    <div className="form-padding mb-3">
                      <label>Office Address</label>
                      <textarea
                        className="form-control"
                        id="off"
                        label=""
                        placeholder="Office Address"
                        type="textarea"
                        style={{ height: "170px" }}
                        value={this.state.OfficeAddress || ""}
                        onChange={(e) =>
                          this.setState({ OfficeAddress: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row">
                    <div className="mb-3">
                      <div className="form-padding mb-3">
                        <label>Office Mobile Number</label>
                        <input
                          className="form-control"
                          label=""
                          placeholder="Office Mobile Number"
                          type="tel"
                          value={this.state.OfficeMob || ""}
                          onChange={(e) =>
                            this.setState({ OfficeMob: e.target.value })
                          }
                          onKeyPress={numberKeyPress}
                          maxLength="10"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-padding mb-3">
                        <label className="dflex align-center">
                          Mobile Number<span className="asterik">*</span>
                        </label>
                        {this.state.MobError ? (
                          <input
                            className="form-control validationError"
                            label=""
                            placeholder={this.state.MobError}
                            type="tel"
                            value={this.state.MobNum || ""}
                            onChange={(e) =>
                              this.setState({ MobNum: e.target.value })
                            }
                            onKeyPress={numberKeyPress}
                            maxLength="10"
                          />
                        ) : (
                          <input
                            className="form-control"
                            label=""
                            placeholder="Mobile Number"
                            type="tel"
                            value={this.state.MobNum || ""}
                            onChange={(e) =>
                              this.setState({ MobNum: e.target.value })
                            }
                            onKeyPress={numberKeyPress}
                            maxLength="10"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Residential Address</label>
                      <textarea
                        className="form-control"
                        label=""
                        placeholder="Residential Address"
                        type="textarea"
                        style={{ height: "162px" }}
                        value={this.state.ResAddress || ""}
                        onChange={(e) =>
                          this.setState({ ResAddress: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Name of Spouse</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name of Spouse"
                        value={this.state.SpouseName || ""}
                        onChange={(e) =>
                          this.setState({ SpouseName: e.target.value })
                        }
                        onKeyPress={alphaKeyPress}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label className="selectIcon" htmlFor="fromDate">
                        Spouse Date of Birth
                      </label>
                      {/* <input
                        className="form-control"
                        id="DOB"
                        label="From"
                        placeholder="Date of Birth"
                        type="date"
                        value={this.state.DOS || ""}
                        onChange={(e) => this.setState({ DOS: e.target.value })}
                      /> */}
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName="form-control"
                        placeholder="dd-mm-yyyy"
                        className="w-100"
                        value={this.state?.DOS ? new Date(this.state?.DOS) : null}
                        onChange={({ value }) => this.setState({ DOS: value })}
                        maxDate={new Date()}
                        appendTo="self"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label className="selectIcon" htmlFor="fromDate">
                        Marriage Date
                      </label>
                      {/* <input
                        className="form-control"
                        id="DOM"
                        label="From"
                        placeholder="Marriage Date"
                        type="date"
                        value={this.state.DOM || ""}
                        onChange={(e) => this.setState({ DOM: e.target.value })}
                      /> */}
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName="form-control"
                        placeholder="dd-mm-yyyy"
                        className="w-100"
                        value={this.state?.DOM ? new Date(this.state?.DOM) : null}
                        onChange={({ value }) => this.setState({ DOM: value })}
                        maxDate={new Date()}
                        appendTo="self"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>No's of Children</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="No of Children"
                        value={this.state.NOC || ""}
                        onChange={(e) => this.setState({ NOC: e.target.value })}
                        onKeyPress={numberKeyPress}
                        maxLength="2"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Child 1 Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Child 1 Name"
                        value={this.state.NameChild1 || ""}
                        onChange={(e) =>
                          this.setState({
                            NameChild1: e.target.value,
                            NameChild1Error: "",
                          })
                        }
                        onKeyPress={alphaKeyPress}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>Child 2 Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Child 2 Name"
                        value={this.state.NameChild2 || ""}
                        onChange={(e) =>
                          this.setState({
                            NameChild2: e.target.value,
                            NameChild2Error: "",
                          })
                        }
                        onKeyPress={alphaKeyPress}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-4 jc-sb">
                  {/* <div className="row mb-4"> */}
                  <div
                    className="input-row  form-padding mb-3"
                  // style={{ width: "100%" }}
                  >
                    <label className="dflex align-center">
                      Email<span className="asterik">*</span>
                    </label>
                    {this.state.emailError ? (
                      <input
                        placeholder={this.state.emailError}
                        className="form-control validationError"
                        // type="email"
                        type="text"
                        value={this.state.email || ""}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                    ) : (
                      <input
                        placeholder="example@gmail.com"
                        className="form-control"
                        // type="email"
                        type="text"
                        value={this.state.email || ""}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                    )}
                  </div>
                  <div className="input-row mb-3">
                    <div className="select">
                      <label className="selectIcon">Role</label>
                      <Select
                        aria-label="Default select example"
                        placeholder="Select the Roles"
                        type="drop"
                        closeMenuOnSelect={true}
                        value={selectedRoleId}
                        components={animatedComponents}
                        onChange={this.onSelectRole}
                        options={rolesArr}
                        isClearable
                        isMulti
                      />
                    </div>
                  </div>
                </div>
                {this.props.editMember ? (
                  <div className="row jc-sb mb-4">
                    <div className="input-row mb-3 select">
                      <label>Designation Title</label>
                      <Select
                        aria-label="Default select example"
                        placeholder="Select the Designation"
                        type="drop"
                        onChange={(e) =>
                          this.setState({ selectDesignationTitle: e }, () => {
                            // this.callApiDes();
                          })
                        }
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        value={this.state.selectDesignationTitle}
                        isClearable
                        options={DesignationList}
                      />
                    </div>
                    <div className="d-flex justify-content-start">
                      {this.state.role_idError ? (
                        <span className="small-font-size text-danger">
                          {this.state.role_idError}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="input-row mb-3 ">
                      <label>Designation </label>
                      <Select
                        aria-label="Default select example"
                        placeholder="Select the Designation"
                        type="drop"
                        closeMenuOnSelect={true}
                        value={this.state.selectDesignation}
                        components={animatedComponents}
                        onChange={(e) =>
                          this.setState({ selectDesignation: e })
                        }
                        options={designationRoleList}
                        // options={RoleList}
                        isClearable
                      />
                    </div>
                  </div>
                ) : null}

                <div className="row mb-4">
                  <div
                    className="input-row form-padding mb-3"
                    style={{ width: "100%" }}
                  >
                    <label>
                      If associated with any Professional Body, please furnish
                      the Name of the Organization and Membership Number:
                    </label>
                    <textarea
                      className="form-control"
                      type="textarea"
                      style={{ height: "100px" }}
                      value={this.state.AssOrg || ""}
                      onChange={(e) =>
                        this.setState({ AssOrg: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-5">
                  <div
                    className="input-row form-padding mb-3"
                    style={{ width: "100%" }}
                  >
                    <label>
                      If associated with any Charitable/Social Organization,
                      please furnish the Name of the Organization and position
                      held:
                    </label>
                    <textarea
                      className="form-control"
                      type="textarea"
                      style={{ height: "100px" }}
                      value={this.state.SocialOrg || ""}
                      onChange={(e) =>
                        this.setState({ SocialOrg: e.target.value })
                      }
                    />
                  </div>
                </div>
                {this.props.editMember ? (
                  <div className="d-flex flex-row justify-content-between">
                    <div className="radio-section join-type mb-4">
                      <label htmlFor="floatingInput" className="radio-head">
                        I would like to become (Please Select)
                      </label>
                      <div className="form-padding radio-input mt-3 radio ">
                        <div className="inner internal ">
                          <input
                            type="radio"
                            name="onJoinType radio"
                            value="life_trustee"
                            id="life_trustee"
                            checked={this.state.onJoinType === "life_trustee"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onJoinType}
                          />
                          <label htmlFor="life_trustee">
                            Life Trustee(Rs.25,000/-)
                          </label>
                        </div>
                        <div className="inner virtual">
                          <input
                            type="radio"
                            name="onJoinType radio"
                            value="member"
                            id="member"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.onJoinType === "member"}
                            onChange={this.onJoinType}
                          />
                          <label htmlFor="member">Member (1,001/-)</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="input-row mb-3">
                        <div className="form-padding mb-3">
                          <label className="dflex align-center">
                            Payment Transaction Id
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="transactionId"
                            placeholder="Transaction Id"
                            value={this.state.transactionId || ""}
                            onChange={(e) =>
                              this.setState({
                                transactionId: e.target.value,
                                transactionIdError: "",
                              })
                            }
                            style={{ width: "300px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="radio-section join-type mb-4">
                    <label htmlFor="floatingInput" className="radio-head">
                      I would like to become (Please Select)
                    </label>
                    <div className="form-padding radio-input mt-3 radio ">
                      <div className="inner internal ">
                        <input
                          type="radio"
                          name="onJoinType radio"
                          value="life_trustee"
                          id="life_trustee"
                          checked={this.state.onJoinType === "life_trustee"}
                          style={{ margin: "0px 10px" }}
                          onChange={this.onJoinType}
                        />
                        <label htmlFor="life_trustee">
                          Life Trustee(Rs.25,000/-)
                        </label>
                      </div>
                      <div className="inner virtual">
                        <input
                          type="radio"
                          name="onJoinType radio"
                          value="member"
                          id="member"
                          style={{ margin: "0px 10px" }}
                          checked={this.state.onJoinType === "member"}
                          onChange={this.onJoinType}
                        />
                        <label htmlFor="member">Member (1,001/-)</label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="radio-section pay-type mb-4">
                  <label htmlFor="floatingInput" className="radio-head">
                    I'm enclosing herewith
                  </label>
                  <div className="form-padding radio-input radio mt-3">
                    <div className="internal inner">
                      <input
                        value="cash"
                        type="radio"
                        name="onPayType radio"
                        id="cash"
                        checked={this.state.onPayType === "cash"}
                        style={{ margin: "0px 10px" }}
                        onChange={this.onPayType}
                      />
                      <label htmlFor="cash">Cash</label>
                    </div>
                    <div className="inner virtual">
                      <input
                        value="online_transfer"
                        type="radio"
                        name="onPayType radio"
                        id="online_transfer"
                        style={{ margin: "0px 10px" }}
                        checked={this.state.onPayType === "online_transfer"}
                        onChange={this.onPayType}
                      />
                      <label htmlFor="online_transfer">Online Transfer</label>
                    </div>
                    <div className="inner internal ">
                      <input
                        value="cheque"
                        type="radio"
                        name="onPayType radio"
                        id="cheque"
                        checked={this.state.onPayType === "cheque"}
                        style={{ margin: "0px 10px" }}
                        onChange={this.onPayType}
                      />
                      <label htmlFor="cheque">Cheque</label>
                    </div>
                    <div className="inner virtual">
                      <input
                        value="dd"
                        type="radio"
                        name="onPayType radio"
                        id="dd"
                        style={{ margin: "0px 10px" }}
                        checked={this.state.onPayType === "dd"}
                        onChange={this.onPayType}
                      />
                      <label htmlFor="dd">Demand Drafts (DD)</label>
                    </div>
                  </div>
                </div>
                {this.props.editMember ? (
                  <>
                    <div
                      className={`radio-section pay-type ${this.state.onStatusType === "inactive" ? "mb-4" : "mb-5"}`}
                    >
                      <label htmlFor="floatingInput" className="radio-head">
                        Status
                      </label>
                      <div className="form-padding radio-input radio mt-3">
                        <div className="internal inner">
                          <input
                            value="active"
                            type="radio"
                            name="onStatusType radio"
                            id="active"
                            checked={this.state.onStatusType === "active"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.onStatusType}
                          />
                          <label htmlFor="active">Active</label>
                        </div>
                        <div className="inner virtual">
                          <input
                            value="inactive"
                            type="radio"
                            name="onStatusType radio"
                            id="inactive"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.onStatusType === "inactive"}
                            onChange={this.onStatusType}
                          />
                          <label htmlFor="inactive">Inactive</label>
                        </div>
                      </div>
                    </div>
                    {this.state.onStatusType === "inactive" ? (
                      <div className="row mb-5">
                        <div
                          className="input-row col-sm form-padding mb-3"
                          style={{ width: "100%" }}
                        >
                          <label>Comments:</label>
                          <textarea
                            className="form-control"
                            type="textarea"
                            style={{ height: "100px" }}
                            value={this.state.inActiveStatusComments || ""}
                            onChange={(e) =>
                              this.setState({
                                inActiveStatusComments: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {this.props?.saveAccess ? <div className="cta-section">
                  <button
                    type="button"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta">
                    {this.props.editMember ? "Update member" : "Create Member"}
                  </button>
                </div> : null}
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}

export default observer(MemberForm);
