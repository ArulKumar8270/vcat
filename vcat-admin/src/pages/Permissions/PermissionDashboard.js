// Imports order //

// Plugins //
import React, { createRef } from "react";
import "date-fns";
import { observer } from "mobx-react";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

// Common file imports //

// Api file imports //
import { deletePerm, permissionTable } from "../../libraries/Permissions";

// Components imports //
import CreateWing from "../../components/CreateWing";
import CreateRole from "../../components/CreateRole";
import AssignPerm from "../../components/AssignPerm";
import MemberForm from "../Member-Management/MemberForm";
import AppConfig from "../../modals/AppConfig";
import ConfirmModal from "../../components/ConfirmModal";
import CreatePermission from "../../components/CreatePermission";


import moment from "moment";
import { CommonTable, TableGlobalSearch } from "../../common/CommonElements";

import { Menu } from "primereact/menu";
import { Calendar } from "primereact/calendar";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./PermissionDashboard.css";

import { ExportService } from "../../common/ExportService";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission } from "../../common/Common";

class PermissionDashboard extends React.Component {
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
    // {
    //   label: `Permission's Dashboard`,
    //   command: () => {
    //     window.location.pathname = "/permission"
    //   }
    // },
  ];
  navigationOptions = [
    {
      label: 'Member Dashboard',
      command: () => {
        window.location.pathname = "/member"
      }
    },
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
    // {
    //   label: `Permission's Dashboard`,
    //   command: () => {
    //     window.location.pathname = "/permission"
    //   }
    // },
  ];

  constructor(props) {
    super(props);
    this.menuRef = createRef();
    this.state = {
      status: false,
      selectFilterOption: {},
      CreateList: [],
      Createmember: false,
      CreatePermission: false,
      CreateRole: false,
      CreateWing: false,
      AssignPerm: false,
      rows: [],
      columns: [],
      size: 10,
      filter: new Date(),
      search: "",
      current_page: 1,
      totalData: 0,
      editPerm: "",
      deleteId: "",
      // new
      permissionData: [],
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

  componentDidMount = async () => {
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
    const response = await permissionTable({ filter });
    if (response) {
      const { result: oldPermissionData } = response;
      if (oldPermissionData && Array.isArray(oldPermissionData)) {
        const permissionData = [];
        oldPermissionData.forEach((row) => {
          permissionData.push({
            ...row,
            permission_name:
              row?.permission_name === "WRITE_CONTENT"
                ? "Write Content"
                : row?.permission_name === "READ_CONTENT"
                  ? "Read Content"
                  : row?.permission_name === "READ_MOM"
                    ? "Read MOM"
                    : row?.permission_name === "WRITE_MOM"
                      ? "Write MOM"
                      : row?.permission_name === "READ_MEETING"
                        ? "Read Meeting"
                        : row?.permission_name === "WRITE_MEETING"
                          ? "Write Meeting"
                          : row?.permission_name === "READ_ACCOUNT"
                            ? "Read Account"
                            : row?.permission_name === "WRITE_ACCOUNT"
                              ? "Write Account"
                              : row?.permission_name === "READ_EVENT"
                                ? "Read Event"
                                : row?.permission_name === "WRITE_EVENT"
                                  ? "Write Event"
                                  : row?.permission_name === "READ_SCHOLARSHIP"
                                    ? "Read Scholarship"
                                    : row?.permission_name === "WRITE_SCHOLARSHIP"
                                      ? "Write Scholarship"
                                      : row?.permission_name === "READ_RESOURCE"
                                        ? "Read Resource"
                                        : row?.permission_name === "WRITE_RESOURCE"
                                          ? "Write Resource"
                                          : row?.permission_name === "READ_CAREER"
                                            ? "Read Career"
                                            : row?.permission_name === "WRITE_CAREER"
                                              ? "Write Career"
                                              : row?.permission_name === "READ_DOCUMENT"
                                                ? "Read Document"
                                                : row?.permission_name === "WRITE_DOCUMENT"
                                                  ? "Write Document"
                                                  : row?.permission_name === "READ_DOCUMENT"
                                                    ? "Read Document"
                                                    : row?.permission_name === "WRITE_DOCUMENT"
                                                      ? "Write Document"
                                                      : "-",
            is_deleted: row?.is_deleted === 0 ? "Active" : "Inactive",
          })
        });
        this.setState({ permissionData });
      }
    }
    this.setState({ loading: false });
  }

  exportExcel() {
    const { permissionData } = this.state;
    if (permissionData && permissionData.length > 0) {
      const tableData = permissionData;
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "SL": row?.permission_id,
          "Permission": row?.permission_name || "-",
          "Role": row?.role_name || "-",
          "Active/ Inactive": row?.is_deleted || "-",
        });
      });
      this.exportServices.exportExcel(`Permissions`, [
        { field: "SL", header: "SL" },
        { field: "Permission", header: "Permission" },
        { field: "Role", header: "Role" },
        { field: "Active/ Inactive", header: "Active/ Inactive" },
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

  handleClick = () => {
    this.setState({
      status: true,
      CreateWing: false,
      CreateRole: false,
      AssignPerm: false,
      CreatePermission: false,
    });
  };

  onCreateWing = () => {
    this.setState({
      CreateWing: true,
      CreateRole: false,
      AssignPerm: false,
      CreatePermission: false,
      status: false,
    });
  };

  onCreateRole = () => {
    this.setState({
      CreateRole: true,
      AssignPerm: false,
      CreateWing: false,
      CreatePermission: false,
      status: false,
    });
  };

  onAssignPerm = () => {
    this.setState({
      editPerm: "",
      AssignPerm: true,
      CreateWing: false,
      status: false,
      CreatePermission: false,
      CreateRole: false,
    });
  };

  onCreatePermission = () => {
    this.setState({
      editPerm: "",
      AssignPerm: false,
      CreateWing: false,
      status: false,
      CreatePermission: true,
      CreateRole: false,
    });
  };

  updatePermission = (id) => {
    this.setState({ editPerm: id, CreatePermission: true });
  };

  deletePermission = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = () => {
    const id = this.state.deleteId;
    deletePerm(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        AppConfig.setMessage(response.result);
        await this.tableFetchApi();
      }
    });
  };

  render() {
    const { permissionData: tableValue, loading, globalFilter } = this.state;
    const columns = [
      <Column
        field="permission_id"
        header="SL"
        sortable
        filter
        filterPlaceholder="Search by Wing Sl"
        style={{ minWidth: '8rem', maxWidth: '10rem' }}
      />,
      <Column
        field="permission_name"
        header="Permission"
        sortable
        filter
        filterPlaceholder="Search by Permission"
      // style={{ minWidth: '14rem', maxWidth: '17rem' }}
      />,
      <Column
        field="role_name"
        header="Role"
        sortable
        filter
        filterPlaceholder="Search by Role"
      // style={{ minWidth: '14rem', maxWidth: '17rem' }}
      />,
      <Column
        field="is_deleted"
        header="Active/ Inactive"
        sortable
        filter
        filterPlaceholder="Search by Active/ Inactive"
      // style={{ minWidth: '14rem', maxWidth: '17rem' }}
      />,
      <Column
        header="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data) => {
          return <div className="d-flex align-items-center">
            <div className="d-flex" >
              <div className="col d-flex align-items-center justify-content-center">
                <MdEdit
                  size={40}
                  color="white"
                  onClick={() => this.updatePermission(data.permission_id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state?.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deletePermission(data.permission_id)}
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
            <BsArrowLeftShort /> PERMISSION'S DASHBOARD
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
            <div className="col d-flex align-items-center justify-content-end mt-2">
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
              globalFilterFields={["permission_id", "permission_name", "role_name", "is_deleted"]}
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
          {this.state.CreateRole ? (
            <CreateRole
              CreateRole={this.state.CreateRole}
              closeModel={() => this.setState({ CreateRole: false })}
              saveAccess={this.state?.writeAccess}
            />
          ) : null}
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
            afterSubmit={this.componentDidMount}
            saveAccess={this.state?.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the Permission?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
}
export default observer(PermissionDashboard);