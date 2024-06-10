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
} from "react-icons/md";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import User from "../../modals/User";

// Api file imports //
import {
  deleteMeeting,
  meetingArchiveTable,
  meetingLatestTable,
  notifyMeetingMembers,
} from "../../libraries/meetingDashboard";

// Components imports //
import ConfirmModal from "../../components/ConfirmModal";
import MeetingForm from "./MeetingForm";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./MeetingDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission } from "../../common/Common";

class MeetingDashboard extends React.Component {
  exportServices;

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      menu: "Latest",
      selectFilterOption: {},
      filter: "30 days",
      visible: false,
      editMeetingId: "",
      createMinutes: "",
      // new
      latestMeetingData: [],
      archiveMeetingData: [],
      loading: true,
      globalFilter: "",
      writeAccess: checkPermission("WRITE_MEETING"),
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

  handleClick = (e) => {
    this.setState({
      editMeetingId: "",
      createMinutes: "",
      status: true,
    });
  };

  componentDidMount = async (e) => {
    await this.tableFetchApi();
  };

  latestMeetingFetchApi = async () => {
    const response = await meetingLatestTable();
    if (response) {
      const { result: latestMeetingData } = response;
      if (latestMeetingData && Array.isArray(latestMeetingData)) {
        this.setState({ latestMeetingData });
      }
    }
  };

  archiveMeetingFetchApi = async () => {
    const { filter } = this.state
    const response = await meetingArchiveTable({ filter });
    if (response) {
      const { result: archiveMeetingData } = response;
      if (archiveMeetingData && Array.isArray(archiveMeetingData)) {
        this.setState({ archiveMeetingData });
      }
    }
  };

  tableFetchApi = async () => {
    this.setState({ loading: true });
    await this.latestMeetingFetchApi();
    await this.archiveMeetingFetchApi();
    this.setState({ loading: false });
  }

  getCurrentTableData = () => this.state?.menu === "Archive" ? this.state?.archiveMeetingData : this.state?.latestMeetingData;

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  updateMeeting = (id) => {
    this.setState({ editMeetingId: id, status: true });
  };

  createMinutes = (id) => {
    this.setState({ createMinutes: id, editMeetingId: id });
    console.log("create meeting", id);
  };

  deleteMeetingEntry = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = () => {
    const id = this.state.deleteId;
    deleteMeeting(id).then((response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        User.setRefresh();
        this.tableFetchApi();
        AppConfig.setMessage(response.result, false);
      }
    });
  };

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
      this.exportServices.exportExcel(`Meeting Notice ${menu}`, [
        { field: "SL", header: "SL" },
        { field: "Invocation", header: "Invocation" },
        { field: "City", header: "City" },
        { field: "Date", header: "Date" },
        { field: "Time", header: "Time" },
      ], excelData)
    }
  }

  sendMail = async (id) => {
    const response = await notifyMeetingMembers(id);
    if (response) {
      const { status, result } = response;
      if (status === 'success' && result) {
        AppConfig.setMessage(result, false);
      }
    }
  };

  render() {
    const { loading, globalFilter } = this.state;
    const tableValue = this.getCurrentTableData();
    const columns = [
      <Column
        field="date_time"
        header="Meeting Details"
        sortable
        filterPlaceholder="Search by Date Time"
        body={(data, option) => {
          const date = data?.from_date ? moment(data?.from_date).format("DD") : "--";
          const month = data?.from_date ? moment(data?.from_date).format("MMM") : "--";
          const year = data?.from_date ? moment(data?.from_date).format("yy") : "--";
          const time = data?.from_date ? moment(data?.from_date).format("hh:mm a") : "--";
          return (
            <div className="d-flex jc-sb align-center">
              <div className="d-flex">
                <div className="tableData-col3 dateBlock">
                  <div>
                    <p className="mb-0 month  font_08rem">{month}</p>
                  </div>
                  <div>
                    <p className="mb-0" style={{ fontSize: "1.2rem" }}>
                      {date}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0" style={{ fontSize: "0.6rem" }}>
                      {year}
                    </p>
                  </div>
                </div>
                <div
                  className="d-flex dateBlock mb-1 ml-1"
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div className="d-flex mb-2">
                    <div>
                      <p className="mb-0 ml-2">{data?.venue}</p>
                    </div>
                  </div>
                  <div className="d-flex align-center">
                    <div className="d-flex align-center">
                      <div>
                        <p className="mb-0">
                          <MdOutlineAccessTime />
                        </p>
                      </div>
                      <div className="ml-1">
                        <p className="mb-0 location">{time}</p>
                      </div>
                    </div>
                    <div className="d-flex ml-2align-center">
                      <div>
                        <p className="mb-0">
                          <MdLocationOn />
                        </p>
                      </div>
                      <div className="ml-1">
                        <p className="mb-0 location">{data?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }} />,
      <Column
        header="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data, option) => {
          return <div className="d-flex align-items-center justify-content-center">
            {this.state?.writeAccess && this.state?.menu === "Latest" ?
              <div className="col-auto p-0">
                <Button label="Send Mail" className="rounded-pill" onClick={() => this.sendMail(data?.id)}
                />
              </div> : null}
            {this.state.writeAccess && (!data?.mom_id) ?
              <div className="col-auto p-0 ml-2">
                <Button label="Create Minutes" className="rounded-pill" onClick={() => this.createMinutes(data?.id)}
                />
              </div> : null}
            <div className="col-auto p-0 ml-2">
              <MdEdit
                size={40}
                color="white"
                onClick={() => this.updateMeeting(data?.id)}
                style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
              />
            </div>
            {this.state.writeAccess ?
              <div className="col-auto p-0 ml-2">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteMeetingEntry(data?.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
          </div>;
        }} />
    ];
    return (
      <div className="app-main__outer">
        <div className="back-event mb-3">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> Meeting
          </button>
        </div>
        <div className="content">
          <div className="d-xl-flex row d-none mb-2 align-items-center justify-content-between">
            <div className="col-5 d-flex align-items-center m-0 p-0">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col-7 d-flex justify-content-end p-0 m-0">
              <div className="col-auto d-flex align-items-center p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest Meeting"
                  archiveLabel="Archive Meeting"
                />
              </div>
              {this.state.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button onClick={this.handleClick}>Create Meeting</Button>
              </div> : null}
              <div className="col-auto btn-group p-0 m-0 ml-2">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="d-md-flex d-none d-xl-none mb-2 align-items-center">
            <div className="col">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col-auto ml-auto d-flex flex-column justify-content-end align-items-end">
              <div className="col-auto p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest Meeting"
                  archiveLabel="Archive Meeting"
                />
              </div>
              <div className="d-flex mt-2">
                {this.state.writeAccess ? <div className="col-auto create-event p-0 m-0">
                  <Button onClick={this.handleClick}>Create Meeting</Button>
                </div> : null}
                <div className="col-auto btn-group p-0 m-0 ml-2">
                  <TableFilterDropdown
                    value={this.state.filter}
                    onChange={this.callApiFilter}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-sm-flex d-md-none flex-column mb-2 align-items-center justify-content-center">
            <div className="col-auto d-flex align-items-center">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="d-flex flex-column">
              <div className="col d-flex justify-content-end p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                />
              </div>
              {this.state.writeAccess ? <div className="create-event col p-0 m-0 d-flex justify-content-end">
                <Button onClick={this.handleClick}>Create Meeting</Button>
              </div> : null}
              <div className="btn-group p-0 m-0 col d-flex justify-content-end">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="table">
            <CommonTable
              value={tableValue}
              loading={loading}
              exportExcel={this.exportExcel}
              globalFilterFields={["id", "date_time", "invocation", "title", "city", "venue"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <MeetingForm
            status={this.state.status}
            editMeetingId={this.state.editMeetingId}
            createMinutes={this.state.createMinutes}
            closeModel={() => this.setState({ status: false })}
            props={this.props}
            afterSubmit={this.componentDidMount}
            saveAccess={this.state.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete Meeting"
            title="Are you sure you want to delete the Meeting?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
}
export default observer(MeetingDashboard);
