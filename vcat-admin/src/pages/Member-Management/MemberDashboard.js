// Imports order //

// Plugins //
import React, { createRef } from "react";
import "date-fns";
import { observer } from "mobx-react";
import moment from "moment";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import User from "../../modals/User";

// Api file imports //
import { approveMember, deleteMember, memberTable } from "../../libraries/memberDashboard";

// Components imports //
import MemberForm from "./MemberForm";
import CreateWing from "../../components/CreateWing";
import CreateRole from "../../components/CreateRole";
import ConfirmModal from "../../components/ConfirmModal";
import AssignPerm from "../../components/AssignPerm";
import CreatePermission from "../../components/CreatePermission";
import SendInvite from "../../components/SendInvite";

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Column } from 'primereact/column';

// CSS  imports //
import "./MemberDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableGlobalSearch } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { Tooltip } from "primereact/tooltip";
import { checkPermission } from "../../common/Common";

class MemberDashboard extends React.Component {
  exportServices;

  menuRef;

  CreateMenuItems = [
    {
      label: 'Create Member',
      command: () => {
        this.handleClick();
      }
    },
    {
      label: 'Create Wing',
      command: () => {
        this.onCreateWing();
      }
    },
    {
      label: 'Create Role',
      command: () => {
        this.onCreateRole();
      }
    },
    {
      label: 'Create Permission',
      command: () => {
        this.onCreatePermission();
      }
    },
    // {
    //   label: 'Member Dashboard',
    //   command: () => {
    //     window.location.pathname = "/member"
    //   }
    // },
    {
      label: 'Role Dashboard',
      command: () => {
        window.location.pathname = "/role"
      }
    },
    {
      label: `Wing's Dashboard`,
      command: () => {
        window.location.pathname = "/wing"
      }
    },
    {
      label: `Permission's Dashboard`,
      command: () => {
        window.location.pathname = "/permission"
      }
    },
  ];
  navigationOptions = [
    // {
    //   label: 'Member Dashboard',
    //   command: () => {
    //     window.location.pathname = "/member"
    //   }
    // },
    {
      label: 'Role Dashboard',
      command: () => {
        window.location.pathname = "/role"
      }
    },
    {
      label: `Wing's Dashboard`,
      command: () => {
        window.location.pathname = "/wing"
      }
    },
    {
      label: `Permission's Dashboard`,
      command: () => {
        window.location.pathname = "/permission"
      }
    },
  ];

  constructor(props) {
    super(props);
    this.menuRef = createRef();
    this.state = {
      status: false,
      selectFilterOption: {},
      Createmember: false,
      CreateRole: false,
      sendInvite: false,
      DropdownClicked: false,
      CreatePermission: false,
      CreateWing: false,
      AssignPerm: false,
      rows: [],
      columns: [],
      size: 10,
      filter: new Date(),
      search: "",
      current_page: 1,
      totalData: 0,
      visible: false,
      editMember: "",
      sortBy: "",
      // new
      memberData: [],
      loading: true,
      globalFilter: "",
      // 
      writeAccess: checkPermission("WRITE_ACCOUNT"),
      approveAccess: checkPermission("APPROVAL_ACCOUNT"),
      userApproval: false,
      userApprovalId: null,
    };
    this.exportExcel = this.exportExcel.bind(this);
    this.exportServices = new ExportService();
    AppLayoutConfig.setShowLayout(true);
    AppLayoutConfig.setShowHeader(true);
    AppLayoutConfig.setShowSidebar(true);
    AppLayoutConfig.setShowFooter(true);
    AppLayoutConfig.setShowSideCalendar(true);
    AppLayoutConfig.setShowChat(true);
  }

  componentDidMount = async (e) => {
    await this.tableFetchApi();
  };

  tableFetchApi = async () => {
    this.setState({ loading: true });
    const { filter: oldFilter } = this.state;
    let filter = null;
    if (oldFilter) {
      filter = moment(oldFilter);
      filter.add(1, "day");
      filter = filter.format("yyyy-MM-DD");
    }
    const response = await memberTable({ filter });
    if (response) {
      const { result: oldMemberData } = response;
      if (oldMemberData && Array.isArray(oldMemberData)) {
        const memberData = [];
        oldMemberData.forEach((row) => {
          let role_id = "--";
          switch (String(row?.role_id)) {
            case "1":
              role_id = "President";
              break;
            case "2":
              role_id = "Vice President";
              break;
            case "3":
              role_id = "Secretary";
              break;
            case "4":
              role_id = "Joint Secretary";
              break;
            case "5":
              role_id = "Treasurer";
              break;
            case "6":
              role_id = "Mentor";
              break;
            case "7":
              role_id = "Past President";
              break;

            default:
              break;
          }
          let created_at = "-";
          if (row?.created_at)
            created_at = moment(row?.created_at).format("Do MMMM YYYY");
          const newRow = {
            ...row,
            role_id,
            created_at,
          };
          memberData.push(newRow);
        })
        this.setState({ memberData });
      }
    }
    this.setState({ loading: false });
  }

  exportExcel() {
    const { memberData } = this.state;
    if (memberData && memberData.length > 0) {
      const tableData = memberData;
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "Member Id": row?.id,
          "Name": row?.name || "-",
          "Email": row?.email || "-",
          "Contact Number": row?.mobile_number || "-",
          // "Role": row?.role_id || "-",
          "Role": row?.roles || row?.role_id || "-",
          "Designation": row?.occupation || "-",
        });
      });
      this.exportServices.exportExcel(`Members`, [
        { field: "Member Id", header: "Member Id" },
        { field: "Name", header: "Name" },
        { field: "Email", header: "Email" },
        { field: "Contact Number", header: "Contact Number" },
        { field: "Role", header: "Role" },
        { field: "Designation", header: "Designation" },
      ], excelData);
    }
  }

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  onSelectCreate = async () => {
    this.setState({ status: true });
  };

  handleClick = (e) => {
    this.setState({
      editMember: "",
      status: true,
      CreateWing: false,
      sendInvite: false,
      CreateRole: false,
      CreatePermission: false,
      AssignPerm: false,
    });
  };

  onCreateWing = (e) => {
    this.setState({
      CreateWing: true,
      CreatePermission: false,
      status: false,
      sendInvite: false,
      CreateRole: false,
      AssignPerm: false,
    });
  };

  onCreateRole = (e) => {
    this.setState({
      CreateRole: true,
      CreateWing: false,
      CreatePermission: false,
      sendInvite: false,
      status: false,
      AssignPerm: false,
    });
  };

  onAssignPerm = (e) => {
    this.setState({
      AssignPerm: true,
      CreateRole: false,
      CreateWing: false,
      CreatePermission: false,
      sendInvite: false,
      status: false,
    });
  };

  onSendInvite = (e) => {
    this.setState({
      sendInvite: true,
      AssignPerm: false,
      CreateRole: false,
      CreatePermission: false,
      CreateWing: false,
      status: false,
    });
  };

  onCreatePermission = (e) => {
    this.setState({
      editPerm: "",
      AssignPerm: false,
      CreateWing: false,
      status: false,
      CreatePermission: true,
      CreateRole: false,
    });
  };

  updateMember = (id) => {
    this.setState({ editMember: id, status: true });
  };

  deleteMember = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = () => {
    const id = this.state.deleteId;
    deleteMember(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        await this.tableFetchApi();
        AppConfig.setMessage(response.result, false);
        User.setRefresh(true);
      }
    });
  };

  approveUser = async () => {
    const { user_id } = User;
    const requestData = {
      id: this.state.userApprovalId,
      user_id
    };
    const response = await approveMember(requestData);
    if (response) {
      const { status, result } = response;
      if (status === "success" && result) {
        await this.tableFetchApi();
        this.setState({ userApproval: false, userApprovalId: null });
        AppConfig.setMessage(result, false);
        User.setRefresh(true);
      }
    }
  };

  render() {
    const { memberData: tableValue, loading, globalFilter } = this.state;
    const columns = [
      <Column
        field="id"
        header="Member Id"
        sortable
        filter
        filterPlaceholder="Search by Member Id"
        style={{ minWidth: '8rem', maxWidth: '10rem' }}
      />,
      <Column
        field="name"
        header="Name"
        sortable
        filter
        filterPlaceholder="Search by Name"
        // style={{ minWidth: '17rem', maxWidth: '20rem' }}
        // style={{ minWidth: '6rem', maxWidth: '7rem' }}                                              
        body={(data, option) => <>
          <Tooltip target={`.member-name${data?.id}`} content={data?.name} />
          <div className={`member-name${data?.id}`} data-toggle="tooltip" title={data?.name}>
            {(data?.name) && (data?.name)?.length > 20 ? (data?.name).slice(0, 20) + '...' : data?.name}
          </div>
        </>}
      />,
      <Column
        field="email"
        header="Email"
        sortable
        filter
        filterPlaceholder="Search by Email"
        // style={{ minWidth: '17rem', maxWidth: '20rem' }}
        // body={(data, option) => String(data['email']).toLowerCase()}
        body={(data, option) => {
          const newEmail = String(data['email']).toLowerCase();
          return <>
            <Tooltip target={`.member-email${data?.id}`} content={newEmail} />
            <div className={`member-email${data?.id}`} data-toggle="tooltip" title={newEmail}>
              {(newEmail) && (newEmail)?.length > 20 ? (newEmail).slice(0, 20) + '...' : newEmail}
            </div>
          </>
        }}

      />,
      <Column
        field="mobile_number"
        header="Contact Number"
        sortable
        filter
        filterPlaceholder="Search by Contact Number"
        style={{ minWidth: '14rem', maxWidth: '17rem' }}
      />,
      <Column
        field="roles"
        header="Role"
        sortable
        filter
        filterPlaceholder="Search by Role"
        // style={{ minWidth: '6rem', maxWidth: '7rem' }}    
        // body={(data, option) => data?.roles || data?.role_id}
        body={(data, option) => <>
          <Tooltip target={`.member-roles${data?.id}`} content={data?.roles || data?.role_id} />
          <div className={`member-roles${data?.id}`} data-toggle="tooltip" title={data?.roles || data?.role_id}>
            {(data?.roles || data?.role_id) && (data?.roles || data?.role_id)?.length > 20 ? (data?.roles || data?.role_id).slice(0, 20) + '...' : data?.roles || data?.role_id}
          </div>
        </>}
      />,
      // <Column
      //   field="occupation"
      //   header="Designation"
      //   sortable
      //   filter
      //   filterPlaceholder="Search by Designation"
      //   // style={{ minWidth: '6rem', maxWidth: '7rem' }}  
      //   body={(data, option) => <>
      //     <Tooltip target={`.member-occupation${data?.id}`} content={data?.occupation} />
      //     <div className={`member-occupation${data?.id}`} data-toggle="tooltip" title={data?.occupation}>
      //       {(data?.occupation) && (data?.occupation)?.length > 20 ? (data?.occupation).slice(0, 20) + '...' : data?.occupation}
      //     </div>
      //   </>}
      // />,
      <Column
        field="designation"
        header="Designation"
        sortable
        filter
        filterPlaceholder="Search by Designation"
        // style={{ minWidth: '6rem', maxWidth: '7rem' }}  
        body={(data, option) => <>
          <Tooltip target={`.member-designation${data?.id}`} content={data?.designation} />
          <div className={`member-designation${data?.id}`} data-toggle="tooltip" title={data?.designation}>
            {(data?.designation) && (data?.designation)?.length > 20 ? (data?.designation).slice(0, 20) + '...' : data?.designation}
          </div>
        </>}
      />,
      <Column
        header="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data, option) => {
          return <div className="d-flex align-items-center">
            <div className="d-flex" >
              <div className="col d-flex align-items-center justify-content-center">
                {data?.approved !== 1 && <Button
                  icon="pi pi-check"
                  className="p-button-rounded"
                  disabled={!this.state?.approveAccess}
                  onClick={() => this.setState({ userApproval: true, userApprovalId: data?.id })}
                />}
              </div>
              <div className="col d-flex align-items-center justify-content-center">
                <MdEdit
                  size={40}
                  color="white"
                  onClick={() => this.updateMember(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state?.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteMember(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
            </div>
          </div>;
        }} />];
    return (
      <div className="app-main__outer">
        <div className="back-event mb-4">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> MEMBER MANAGEMENT
          </button>
        </div>
        <div className="content">
          <div className="d-lg-flex d-none mb-2 align-items-center justify-content-between">
            <div className="col-auto d-flex align-items-center">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex justify-content-end">
              <div className="col-auto create-event p-0 m-0">
                <Menu model={this.state?.writeAccess ? this.CreateMenuItems : this.navigationOptions} popup ref={el => this.menuRef = el} id="popup_menu" />
                <Button label="Create" icon="pi pi-plus" iconPos="right" onClick={(event) => this.menuRef?.toggle(event)} aria-controls="popup_menu" aria-haspopup />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button
                  label="Send Invite"
                  onClick={this.onSendInvite}
                />
              </div> : null}
              <div className="col-auto d-flex align-items-center p-0 m-0 ml-2">
                <span className="p-float-label">
                  <Calendar
                    id="tillDate"
                    value={this.state.filter}
                    onChange={this.callApiFilter}
                    placeholder="dd-mm-yyyy"
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    showIcon
                    maxDate={new Date()}
                  />
                  <label htmlFor="tillDate">Till Date</label>
                </span>
              </div>
            </div>
          </div>
          <div className="d-md-flex d-none d-lg-none mb-2 align-items-center justify-content-between">
            <div className="col-auto d-flex align-items-center">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex justify-content-end">
              <div className="col-auto create-event p-0 m-0">
                <Menu model={this.state?.writeAccess ? this.CreateMenuItems : this.navigationOptions} popup ref={el => this.menuRef = el} id="popup_menu" />
                <Button label="Create" icon="pi pi-plus" iconPos="right" onClick={(event) => this.menuRef?.toggle(event)} aria-controls="popup_menu" aria-haspopup />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button
                  label="Send Invite"
                  onClick={this.onSendInvite}
                />
              </div> : null}
              <div className="col-md-5 d-flex align-items-center p-0 m-0 ml-2">
                <span className="p-float-label">
                  <Calendar
                    id="tillDate"
                    value={this.state.filter}
                    onChange={this.callApiFilter}
                    placeholder="dd-mm-yyyy"
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    showIcon
                    maxDate={new Date()}
                  />
                  <label htmlFor="tillDate">Till Date</label>
                </span>
              </div>
            </div>
          </div>
          <div className="d-sm-flex d-md-none flex-column mb-2 align-items-center justify-content-center">
            <div className="col d-flex align-items-center justify-content-end p-0 m-0">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex align-items-center justify-content-end mt-2">
              <div className="col-auto create-event p-0 m-0">
                <Menu model={this.state?.writeAccess ? this.CreateMenuItems : this.navigationOptions} popup ref={el => this.menuRef = el} id="popup_menu" />
                <Button label="Create" icon="pi pi-plus" iconPos="right" onClick={(event) => this.menuRef?.toggle(event)} aria-controls="popup_menu" aria-haspopup />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button
                  label="Send Invite"
                  onClick={this.onSendInvite}
                />
              </div> : null}
            </div>
            <div className="col-12 d-flex align-items-center justify-content-end p-0 m-0 mt-4">
              <span className="p-float-label">
                <Calendar
                  id="tillDate"
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                  placeholder="dd-mm-yyyy"
                  dateFormat="dd-mm-yy"
                  readOnlyInput
                  showIcon
                  maxDate={new Date()}
                />
                <label htmlFor="tillDate">Till Date</label>
              </span>
            </div>
          </div>
          <div className="table">
            <CommonTable
              value={tableValue}
              loading={loading}
              exportExcel={this.exportExcel}
              globalFilterFields={["id", "name", "email", "mobile_number", "roles", "occupation"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <MemberForm
            status={this.state.status}
            editMember={this.state.editMember}
            props={this.props}
            closeModel={() => this.setState({ status: false })}
            afterSubmit={this.tableFetchApi}
            saveAccess={this.state?.writeAccess}
          />
          <CreateWing
            CreateWing={this.state.CreateWing}
            props={this.props}
            closeModel={() => this.setState({ CreateWing: false })}
            saveAccess={this.state?.writeAccess}
          />
          {this.state.CreateRole ? (
            <CreateRole
              CreateRole={this.state.CreateRole}
              props={this.props}
              closeModel={() => this.setState({ CreateRole: false })}
              saveAccess={this.state?.writeAccess}
            />
          ) : null}
          <AssignPerm
            AssignPerm={this.state.AssignPerm}
            props={this.props}
            closeModel={() => this.setState({ AssignPerm: false })}
            saveAccess={this.state?.writeAccess}
          />
          <SendInvite
            sendInvite={this.state.sendInvite}
            props={this.props}
            closeModel={() => this.setState({ sendInvite: false })}
          />
          <CreatePermission
            CreatePermission={this.state.CreatePermission}
            editPerm={this.state.editPerm}
            closeModel={() =>
              this.setState({ CreatePermission: false })
            }
            saveAccess={this.state?.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the Member?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
          <ConfirmModal
            visible={this.state.userApproval}
            heading="Member Approval"
            title="Are you sure you want to approve the Member?"
            confirm={() => this.approveUser()}
            handleClose={() => this.setState({ userApproval: false, userApprovalId: null })}
          />
        </div>
      </div>
    );
  }
}
export default observer(MemberDashboard);
