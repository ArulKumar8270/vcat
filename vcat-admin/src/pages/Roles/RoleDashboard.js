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
import { deleteRole, roleTable } from "../../libraries/Roles";

// Components imports //
import CreateWing from "../../components/CreateWing";
import CreateRole from "../../components/CreateRole";
import ConfirmModal from "../../components/ConfirmModal";
import MemberForm from "../Member-Management/MemberForm";
import AssignPerm from "../../components/AssignPerm";
import CreatePermission from "../../components/CreatePermission";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./RoleDashboard.css";
import { ExportService } from "../../common/ExportService";
import { Calendar } from "primereact/calendar";
import { Menu } from "primereact/menu";
import { CommonTable, TableGlobalSearch } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission } from "../../common/Common";

class RoleDashboard extends React.Component {
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
    {
      label: 'Member Dashboard',
      command: () => {
        window.location.pathname = "/member"
      }
    },
    // {
    //   label: 'Role Dashboard',
    //   command: () => {
    //     window.location.pathname = "/role"
    //   }
    // },
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
    {
      label: 'Member Dashboard',
      command: () => {
        window.location.pathname = "/member"
      }
    },
    // {
    //   label: 'Role Dashboard',
    //   command: () => {
    //     window.location.pathname = "/role"
    //   }
    // },
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
      CreateList: [],
      CreatePermission: false,
      CreateRole: false,
      CreateWing: false,
      AssignPerm: false,
      rows: [],
      columns: [],
      filter: new Date(),
      editRole: "",
      deleteId: "",
      // new
      roleData: [],
      loading: true,
      globalFilter: "",
      // 
      writeAccess: checkPermission("WRITE_ACCOUNT"),
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
    const response = await roleTable({ filter });
    if (response) {
      const { result: oldRoleData } = response;
      if (oldRoleData && Array.isArray(oldRoleData)) {
        const roleData = [];
        oldRoleData.forEach((row) => {
          roleData.push({
            ...row,
            created_on: moment(row?.created_at).format("Do MMMM YYYY"),
            is_active: String(row?.is_active) === "0" ? "Active" : "Inactive",
          });
        })
        this.setState({ roleData });
      }
    }
    this.setState({ loading: false });
  }

  exportExcel() {
    const { roleData } = this.state;
    if (roleData && roleData.length > 0) {
      const tableData = roleData;
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "Role Id": row?.id,
          "Role": row?.name || "-",
          "Active/ Inactive": row?.is_active || "-",
          "Created on": row?.created_on || "-",
        });
      });
      this.exportServices.exportExcel(`Roles`, [
        { field: "Role Id", header: "Role Id" },
        { field: "Role", header: "Role" },
        { field: "Active/ Inactive", header: "Active/ Inactive" },
        { field: "Created on", header: "Created on" },
      ], excelData);
    }
  }

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  onSelectFilter = async (selectedFilter) => {
    this.setState({ selectFilterOption: selectedFilter });
  };

  onSelectCreate = async () => {
    this.setState({ status: true });
  };

  handleClick = (e) => {
    this.setState({
      status: true,
      CreateWing: false,
      CreateRole: false,
      CreatePermission: false,
      AssignPerm: false,
    });
  };

  onCreateWing = (e) => {
    this.setState({
      CreateWing: true,
      CreateRole: false,
      CreatePermission: false,
      AssignPerm: false,
      status: false,
    });
  };

  onCreateRole = (e) => {
    this.setState({
      CreateRole: true,
      editRole: "",
      AssignPerm: false,
      CreatePermission: false,
      CreateWing: false,
      status: false,
    });
  };

  onAssignPerm = (e) => {
    this.setState({
      AssignPerm: true,
      CreatePermission: false,
      CreateWing: false,
      CreateRole: false,
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

  updateRole = (id) => {
    this.setState({ editRole: id, CreateRole: true });
  };

  deleteRole = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = () => {
    const id = this.state.deleteId;
    deleteRole(id).then((response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        AppConfig.setMessage(response.result, false);
        User.setRefresh(true);
      }
    });
  };

  render() {
    const { roleData: tableValue, loading, globalFilter } = this.state;
    const columns = [
      <Column
        field="id"
        header="Role Id"
        sortable
        filter
        filterPlaceholder="Search by Role Id"
        style={{ minWidth: '8rem', maxWidth: '10rem' }}
      />,
      <Column
        field="name"
        header="Role"
        sortable
        filter
        filterPlaceholder="Search by Role"
      // style={{ minWidth: '6rem', maxWidth: '7rem' }}                                        
      />,
      <Column
        field="is_active"
        header="Active/ Inactive"
        sortable
        filter
        filterPlaceholder="Search by Active/ Inactive"
      // style={{ minWidth: '14rem', maxWidth: '17rem' }}
      />,
      <Column
        field="created_on"
        header="Created on"
        sortable
        filter
        filterPlaceholder="Search by Created on"
      // style={{ minWidth: '6rem', maxWidth: '7rem' }}                                        
      />,
      <Column
        header="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data, option) => {
          return <div className="d-flex align-items-center">
            <div className="d-flex" >
              <div className="col d-flex align-items-center justify-content-center">
                <MdEdit
                  size={40}
                  color="white"
                  onClick={() => this.updateRole(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state?.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteRole(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
            </div>
          </div>;
        }} />
    ];
    return (
      <div className="app-main__outer">
        <div className="back-event mb-3">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> ROLES DASHBOARD
          </button>
        </div>
        <div className="content">
          <div className="d-md-flex d-none mb-2 align-items-center justify-content-between">
            <div className="col-auto d-flex">
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
          <div className="d-sm-flex d-md-none flex-column mb-2 align-items-center justify-content-center">
            <div className="col d-flex align-items-center justify-content-end">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col-12 d-flex align-items-center justify-content-end mt-2">
              <div className="col create-event p-0 m-0">
              <Menu model={this.state?.writeAccess ? this.CreateMenuItems : this.navigationOptions} popup ref={el => this.menuRef = el} id="popup_menu" />
                <Button label="Create" icon="pi pi-plus" iconPos="right" onClick={(event) => this.menuRef?.toggle(event)} aria-controls="popup_menu" aria-haspopup />
              </div>
            </div>
            <div className="col d-flex align-items-center justify-content-end p-0 m-0 mt-3">
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
              globalFilterFields={["id", "name", "is_active", "created_on"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <MemberForm
            status={this.state.status}
            closeModel={() => this.setState({ status: false })}
            saveAccess={this.state?.writeAccess}
          />
          <CreateWing
            CreateWing={this.state.CreateWing}
            closeModel={() => this.setState({ CreateWing: false })}
            saveAccess={this.state?.writeAccess}
          />
          <CreateRole
            CreateRole={this.state.CreateRole}
            editRole={this.state.editRole}
            closeModel={() => this.setState({ CreateRole: false })}
            afterSubmit={this.componentDidMount}
            saveAccess={this.state?.writeAccess}
          />
          <AssignPerm
            AssignPerm={this.state.AssignPerm}
            closeModel={() => this.setState({ AssignPerm: false })}
            saveAccess={this.state?.writeAccess}
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
            title="Are you sure you want to delete the Role?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
}
export default observer(RoleDashboard);