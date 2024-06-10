// Imports order //

// Plugins //
import React, { createRef } from "react";
import "date-fns";
import { observer } from "mobx-react";
import { MdDelete, MdEdit } from "react-icons/md";
import { BsArrowLeftShort } from "react-icons/bs";

// Api file imports //
import { deleteWing, wingTable } from "../../libraries/wingDashboard";

// Components imports //
import MemberForm from "../Member-Management/MemberForm";
import CreateWing from "../../components/CreateWing";
import CreateRole from "../../components/CreateRole";
import AssignPerm from "../../components/AssignPerm";
import AppConfig from "../../modals/AppConfig";
import CreatePermission from "../../components/CreatePermission";
import ConfirmModal from "../../components/ConfirmModal";

import moment from "moment";
import { CommonTable, TableGlobalSearch } from "../../common/CommonElements";

import { Menu } from "primereact/menu";
import { Calendar } from "primereact/calendar";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import logo from "../../components/img/logo.png";
import "./WingDashboard.css";

import { ExportService } from "../../common/ExportService";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { Tooltip } from "primereact/tooltip";
import { checkPermission } from "../../common/Common";

class WingDashboard extends React.Component {
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
    // {
    //   label: `Wing's Dashboard`,
    //   command: () => {
    //     window.location.pathname = "/wing"
    //   }
    // },
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
    {
      label: 'Role Dashboard',
      command: () => {
        window.location.pathname = "/role"
      }
    },
    // {
    //   label: `Wing's Dashboard`,
    //   command: () => {
    //     window.location.pathname = "/wing"
    //   }
    // },
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
      Createmember: false,
      CreateRole: false,
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
      editWing: "",
      deleteId: "",
      // new
      wingData: [],
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
    const response = await wingTable({ filter });
    if (response) {
      const { result: wingData } = response;
      if (wingData && Array.isArray(wingData)) {
        this.setState({ wingData });
      }
    }
    this.setState({ loading: false });
  }

  exportExcel() {
    const { wingData } = this.state;
    if (wingData && wingData.length > 0) {
      const tableData = wingData;
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "Wing Id": row?.id,
          "Wing Name": row?.title || "-",
          "Wing Description": row?.content || "-",
        });
      });
      this.exportServices.exportExcel(`Wings`, [
        { field: "Wing Id", header: "Wing Id" },
        { field: "Wing Name", header: "Wing Name" },
        { field: "Wing Description", header: "Wing Description" },
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
      status: true,
      AssignPerm: false,
      CreateWing: false,
      CreatePermission: false,
      CreateRole: false,
    });
  };

  onCreateWing = (e) => {
    this.setState({
      CreateWing: true,
      editWing: "",
      CreatePermission: false,
      CreateRole: false,
      AssignPerm: false,
    });
  };

  onCreateRole = (e) => {
    this.setState({
      CreatePermission: false,
      CreateRole: true,
      AssignPerm: false,
      CreateWing: false,
    });
  };

  onAssignPerm = (e) => {
    this.setState({
      AssignPerm: true,
      CreatePermission: false,
      CreateRole: false,
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

  updateWing = (id) => {
    this.setState({ editWing: id, CreateWing: true });
  };

  deleteWing = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = () => {
    const id = this.state.deleteId;
    console.log("id delete", id);
    deleteWing(id).then((response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        AppConfig.setMessage(response.result, false);
      } else {
        AppConfig.setMessage(response?.result);
      }
    });
  };

  render() {
    const { wingData: tableValue, loading, globalFilter } = this.state;
    const columns = [
      <Column
        field="id"
        header="Wing Id"
        sortable
        filter
        filterPlaceholder="Search by Wing Id"
        style={{ minWidth: '5rem', maxWidth: '7rem' }}
      />,
      <Column
        field="image"
        header="Wing Image"
        align="center"
        headerClassName="d-flex justify-content-center"
        style={{ minWidth: '6rem', maxWidth: '7rem' }}
        body={(data, option) => <img
          style={{ width: "2.8rem", height: "auto" }}
          alt="wingImage"
          src={data?.image ? data?.image : logo}
        />}
      />,
      <Column
        field="title"
        header="Wing Name"
        sortable
        filter
        filterPlaceholder="Search by Wing Name"
        style={{
          minWidth: '18rem',
          maxWidth: '20rem',
        }}
        body={(data, option) => {
          return <>
            <Tooltip target={`.wing-title${data?.id}`} content={data?.title} />
            <div className={`wing-title${data?.id}`} data-toggle="tooltip" title={data.title}>
              {data?.title && data?.title?.length > 30 ? data?.title.slice(0, 30) + '...' : data?.title}
            </div></>;
        }}
      />,
      <Column
        field="content"
        header="Wing Description"
        sortable
        filter
        filterPlaceholder="Search by Wing Description"
        style={{
          minWidth: '18rem',
          maxWidth: '20rem',
        }}
        body={(data, option) => {
          return <>
            <Tooltip target={`.wing-content${data?.id}`} content={data?.content} />
            <div className={`d-flex align-items-center wing-content${data?.id}`} data-toggle="tooltip" title={data?.content} style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: data?.content && data?.content?.length > 30 ? `${data?.content?.slice(0, 30)}...` : "" }} />
          </>;
        }}
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
                  onClick={() => this.updateWing(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state?.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteWing(data.id)}
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
            <BsArrowLeftShort />
            WINGS DASHBOARD
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
              globalFilterFields={["id", "title", "content"]}
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
            editWing={this.state.editWing}
            closeModel={() => this.setState({ CreateWing: false })}
            afterSubmit={this.componentDidMount}
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
            saveAccess={this.state?.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the Wing?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
}
export default observer(WingDashboard);