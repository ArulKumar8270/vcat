import React from "react";
import "date-fns";
import { observer } from "mobx-react";
import moment from "moment";
import { BsArrowLeftShort } from "react-icons/bs";
import {
  MdOutlineAccessTime,
  MdDelete,
  MdEdit,
  MdLocationOn,
  MdCheck,
} from "react-icons/md";
import AppConfig from "../../modals/AppConfig";
import User from "../../modals/User";
import { approveMom, deleteMOM, momsArchiveTable, momsLatestTable } from "../../libraries/momDashboard";
import MomForm from "./MomForm";
import ConfirmModal from "../../components/ConfirmModal";
import Notifications from "../../common/Notifications";

import "./MomDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission } from "../../common/Common";

import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { downloadMomPdf } from "./MomDocument";


class MomDashboard extends React.Component {
  exportServices;

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      menu: "Latest",
      filter: "30 days",
      visible: false,
      editMomId: "",
      // new changes
      loading: true,
      globalFilter: "",
      latestMomData: [],
      archiveMomData: [],
      writeAccess: checkPermission("WRITE_MOM"),
      approvalAccess: checkPermission("APPROVAL_MOM"),
      momApprovalConfirmation: false,
      momApprovalConfirmationId: null,
      // PDF Viewer
      documentRowId: null,
      showDocument: false
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
    if (!Notifications.momformStatus) {
      Notifications.setmomformStatus(false);
    }
  };

  latestMomFetchApi = async () => {
    const response = await momsLatestTable();
    if (response) {
      const { result: latestMomData } = response;
      if (latestMomData && Array.isArray(latestMomData)) {
        this.setState({ latestMomData });
      }
    }
  };

  archiveMomFetchApi = async () => {
    const { filter } = this.state
    const response = await momsArchiveTable({ filter });
    if (response) {
      const { result: archiveMomData } = response;
      if (archiveMomData && Array.isArray(archiveMomData)) {
        this.setState({ archiveMomData });
      }
    }
  };

  tableFetchApi = async () => {
    this.setState({ loading: true });
    await this.latestMomFetchApi();
    await this.archiveMomFetchApi();
    this.setState({ loading: false });
  }

  getCurrentTableData = () => this.state?.menu === "Archive" ? this.state?.archiveMomData : this.state?.latestMomData;

  exportExcel() {
    const tableData = this.getCurrentTableData();
    if (tableData && tableData?.length > 0) {
      const { menu } = this.state;
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "SL": row?.id,
          "Invocation": row?.invocation || row?.title,
          "City": row?.city || "-",
          "Date": moment(row?.date_time).format("Do MMMM YYYY"),
          "Time": moment(row?.date_time).format("hh:mm a"),
        });
      });
      this.exportServices.exportExcel(`MOM Notice ${menu}`, [
        { field: "SL", header: "SL" },
        { field: "Invocation", header: "Invocation" },
        { field: "City", header: "City" },
        { field: "Date", header: "Date" },
        { field: "Time", header: "Time" },
      ], excelData)
    }
  }

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  handleClick = () => {
    this.setState({
      editMomId: "",
      status: true,
    });
  };

  updateMom = (id) => {
    this.setState({ editMomId: id, status: true });
  };

  deleteMOMEntry = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = async () => {
    this.setState({ loading: true });
    const id = this.state.deleteId;
    await deleteMOM(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        User.setRefresh();
        await this.tableFetchApi();
        AppConfig.setMessage(response.result, false);
      }
    });
    this.setState({ loading: false });
  };

  approveMom = async () => {
    this.setState({ loading: true });
    const { user_id } = User;
    const response = await approveMom({ id: this.state?.momApprovalConfirmationId, user_id })
    if (response) {
      const { status, result } = response;
      if (status === 'success' && result) {
        AppConfig.setMessage(result, false);
      }
    }
    this.setState({ momApprovalConfirmation: false, momApprovalConfirmationId: null });
    await this.tableFetchApi();
    this.setState({ loading: false });
  }

  validateStringField = (value) => {
    return typeof value === "string" && value?.length > 0;
  }

  render() {
    const { globalFilter, loading } = this.state;
    const tableValue = this.getCurrentTableData();
    const columns = [
      <Column
        field="id"
        header="SL"
        key="SL"
        sortable
        filterPlaceholder="Search by SL"
        style={{ minWidth: '6rem', maxWidth: '7rem' }}
        body={(data) => {
          return data.id;
        }}
      />,
      <Column
        field="date_time"
        header="MOM Details"
        key="MOM Details"
        sortable
        // filter
        filterPlaceholder="Search by Date Time"
        body={(data) => {
          const date = moment(data.date_time).format("DD");
          const month = moment(data.date_time).format("MMM");
          const year = moment(data.date_time).format("yy");
          const time = moment(data.date_time).format("hh:mm a");
          return (
            <div
              className="mom-table d-flex"
              style={{ alignItems: "flex-end" }}
            >
              <div className="tableData-col3 dateBlock">
                <div>
                  <p className="mb-0 month">{month}</p>
                </div>
                <div>
                  <p className="mb-0" style={{ fontSize: "1.4rem" }}>
                    {date}
                  </p>
                </div>
                <div>
                  <p className="mb-0" style={{ fontSize: "0.7rem" }}>
                    {year}
                  </p>
                </div>
              </div>
              <div
                className="dflex dateBlock mb-2 ml-2 font_09rem "
                style={{ flexDirection: "column" }}
              >
                <div className="dflex">
                  <div>
                    <p className="mb-0 ml-2 font_09rem  location">
                      {data.invocation || data.title}
                    </p>
                  </div>
                </div>
                <div className="dflex align-center">
                  <div className="dflex align-center">
                    <div>
                      <p className="mb-0 font_09rem ">
                        <MdOutlineAccessTime />
                      </p>
                    </div>
                    <div className="ml-1">
                      <p className="mb-0 v location">{time}</p>
                    </div>
                  </div>
                  <div className="dflex ml-2 align-center">
                    <div>
                      <p className="mb-0 font_09rem ">
                        <MdLocationOn />
                      </p>
                    </div>
                    <div className="ml-1">
                      <p className="mb-0 location font_09rem ">
                        {data.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }} />,
      <Column
        header="Action"
        key="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data) => {
          return <div className="d-flex align-items-center justify-content-center">
            <div className="d-flex" >
              {this.state?.approvalAccess && this.state?.menu === "Latest" ? <div className="col d-flex align-items-center justify-content-center">
                <MdCheck
                  size={40}
                  color="white"
                  onClick={() => {
                    if (this.validateStringField(data?.year) && this.validateStringField(data?.continuous) && this.validateStringField(data?.invocation)) {
                      this.setState({
                        momApprovalConfirmation: true,
                        momApprovalConfirmationId: data?.id,
                      })
                    }
                    else {
                      AppConfig.setMessage("Update MOM for Approval");
                    }
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
                : null}
              <div className="col d-flex align-items-center justify-content-center">
                <MdEdit
                  size={40}
                  color="white"
                  onClick={() => this.updateMom(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteMOMEntry(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
              <div className="col d-flex align-items-center justify-content-center">
                <Button
                  icon="pi pi-file-pdf"
                  className="p-button-rounded"
                  tooltip="Export PDF"
                  onClick={() => {
                    if (this.validateStringField(data?.year) && this.validateStringField(data?.continuous) && this.validateStringField(data?.invocation))
                      downloadMomPdf(data?.id);
                    else AppConfig.setMessage("Update MOM for Approval");
                  }}
                />
              </div>
            </div>
          </div>;
        }} />
    ];
    return (
      <div className="app-main__outer">
        <div className="back-event mb-3">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> MOM
          </button>
        </div>
        <div className="content">
          <div className="d-xl-flex d-none mb-2 align-items-center justify-content-between">
            <div className="col-auto d-flex align-items-center">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="d-flex justify-content-end" >
              <div className="d-flex align-items-center p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest MOM"
                  archiveLabel="Archive MOM"
                />
              </div>
              {/* {this.state.writeAccess ?
                <div className="create-event p-0 m-0 ml-2">
                  <Button onClick={this.handleClick}>Create Minutes</Button>
                </div> : null} */}
              <div className="btn-group p-0 m-0 ml-2">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="d-md-flex d-none d-xl-none flex-column mb-2 align-items-center">
            <div className="col">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col ml-auto d-flex justify-content-end">
              <div className="col-auto d-flex align-items-center p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest MOM"
                  archiveLabel="Archive MOM"
                />
              </div>
              {/* {this.state.writeAccess ? <div className="create-event col-auto p-0 m-0 ml-2">
                <Button onClick={this.handleClick}>Create Minutes</Button>
              </div> : null} */}
              <div className="btn-group p-0 m-0 ml-2 col-auto">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="d-sm-flex d-md-none flex-column mb-2 align-items-center justify-content-center">
            <div className="col-auto">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex flex-column">
              <div className="col d-flex justify-content-end p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest"
                  archiveLabel="Archive"
                />
              </div>
              {/* {this.state.writeAccess ? <div className="col d-flex justify-content-end p-0 m-0">
                <div className="create-event col-auto p-0 m-0 ml-2">
                  <Button onClick={this.handleClick}>Create Minutes</Button>
                </div>
              </div> : null} */}
              <div className="col d-flex justify-content-end p-0 m-0">
                <div className="btn-group p-0 m-0 ml-2 col-auto">
                  <TableFilterDropdown
                    value={this.state.filter}
                    onChange={this.callApiFilter}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table">
            <CommonTable
              value={tableValue}
              loading={loading}
              exportExcel={this.exportExcel}
              globalFilterFields={["id", "date_time", "invocation", "title", "city"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <MomForm
            status={this.state.status}
            editMOM={this.state.editMomId}
            closeModel={() => this.setState({ status: false })}
            afterSubmit={this.componentDidMount}
            saveAccess={this.state.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the MOM ?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
          <ConfirmModal
            visible={this.state.momApprovalConfirmation}
            heading="MOM Approval"
            title="Are you sure you want to approve the MOM ?"
            confirm={() => this.approveMom()}
            handleClose={() => this.setState({ momApprovalConfirmation: false, momApprovalConfirmationId: null })}
          />
        </div>
      </div>
    );
  }
}
export default observer(MomDashboard);
