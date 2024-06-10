import React from "react";
import "date-fns";
import { observer } from "mobx-react";
import moment from "moment";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import User from "../../modals/User";

// Api file imports //
import {
  careerTable,
  deleteJobPost,
} from "../../libraries/careerDashboard";

// Components imports //
import ConfirmModal from "../../components/ConfirmModal";
import CareerForm from "./CareerForm";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./CareerDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission, getOnlyDate } from "../../common/Common";

class CareerDashboard extends React.Component {
  exportServices;

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      tableData: [],
      menu: "Latest",
      selectFilterOption: {},
      CreateRole: false,
      CreateWing: false,
      AssignPerm: false,
      filter: "30 days",
      visible: false,
      editProjectId: "",
      // new
      careerData: [],
      loading: true,
      globalFilter: "",
      // 
      writeAccess: checkPermission("WRITE_CAREER"),
      deleteAccess: checkPermission("DELETE_CAREER"),
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
    const { filter } = this.state;
    const { user_id } = User;
    const requestData = { filter, user_id };
    const response = await careerTable(requestData);
    if (response) {
      const { result: oldCareerData } = response;
      if (oldCareerData && Array.isArray(oldCareerData)) {
        const careerData = [];
        oldCareerData.forEach((row) => {
          careerData.push({
            ...row,
            posted_on: moment(row?.created_at).format("Do MMMM YYYY"),
          });
        });
        this.setState({ careerData });
      }
    }
    this.setState({ loading: false });
  }

  getTableData = () => {
    const { careerData, menu } = this.state;
    if (careerData && careerData.length > 0) {
      if (menu === "Archive") {
        return careerData.filter(({ created_at }) => new Date(created_at) < getOnlyDate());
      }
      return careerData.filter(({ created_at }) => new Date(created_at) >= getOnlyDate());
    }
    return [];
  }

  exportExcel() {
    const { menu } = this.state;
    const tableData = this.getTableData();
    const excelData = [];
    tableData.forEach((row) => {
      excelData.push({
        "SL": row?.id,
        "Company": row?.company_name || "-",
        "Job Title": row?.job_title || "-",
        "Location": row?.location || "-",
        "Posted On": row?.posted_on || "-",
      });
    });
    this.exportServices.exportExcel(`${menu} Jobs`, [
      { field: "SL", header: "SL" },
      { field: "Company", header: "Company" },
      { field: "Job Title", header: "Job Title" },
      { field: "Location", header: "Location" },
      { field: "Posted On", header: "Posted On" },
    ], excelData);
  }

  handleClick = (e) => {
    this.setState({
      status: true,
      editProjectId: null,
    });
  };

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  updateCareer = (id) => {
    this.setState({ editProjectId: id, status: true });
  };

  deleteCareer = (id) => {
    this.setState({ visible: true, deleteId: id });
  };

  getSuccess = async () => {
    const id = this.state.deleteId;
    await deleteJobPost(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        AppConfig.setMessage(response?.result, false);
        User.setRefresh();
        await this.tableFetchApi();
      }
    });
  };

  render() {
    const { user_id } = User;
    const { loading, globalFilter } = this.state;
    const tableValue = this.getTableData();
    const columns = [
      <Column
        field="id"
        header="SL"
        key="SL"
        sortable
        filterPlaceholder="Search by SL"
        style={{ minWidth: '6rem', maxWidth: '7rem' }}
      />,
      <Column
        field="image"
        header="Logo"
        key="Logo"
        style={{ minWidth: '7rem', maxWidth: '10rem' }}
        align="center"
        // headerClassName="d-flex justify-content-center"
        body={(data) => data?.image ? <img
          className="img-fluid"
          alt="careerLogo"
          style={{ width: "2.8rem", height: "auto" }}
          src={data?.image}
        /> : " - "}
      />,
      <Column
        field="company_name"
        header="Company"
        key="Company"
        sortable
        filter
        filterPlaceholder="Search by Company"
      />,
      <Column
        field="job_title"
        header="Job Title"
        key="Job Title"
        sortable
        filter
        filterPlaceholder="Search by Job Title"
      />,
      <Column
        field="location"
        header="Location"
        key="Location"
        sortable
        filter
        filterPlaceholder="Search by Location"
      />,
      <Column
        field="posted_on"
        header="Posted On"
        key="Posted On"
        sortable
        filter
        filterPlaceholder="Search by Date"
      />,
      <Column
        header="Action"
        key="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data, option) => {
          return <div className="d-flex align-items-center">
            <div className="d-flex" >
              <div className="col d-flex align-items-center justify-content-center">
                <MdEdit
                  size={40}
                  color="white"
                  onClick={() => this.updateCareer(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {(this.state?.writeAccess && String(user_id) === String(data?.created_by)) || this.state.deleteAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteCareer(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
            </div>
          </div>;
        }} />
    ]
    return (
      <div className="app-main__outer ">
        <div className="back-event mb-3 ">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> CAREER
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
            <div className="col d-flex justify-content-end">
              <div className="col-auto d-flex align-items-center p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest Jobs"
                  archiveLabel="Archive Jobs"
                />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button onClick={this.handleClick}>
                  Create Job Post
                </Button>
              </div> : null}
              <div className="col-auto btn-group p-0 m-0 ml-2">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="d-lg-flex d-none d-xl-none mb-2 align-items-center justify-content-between">
            <div className="col-auto">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex justify-content-end">
              <div className="col-auto d-flex align-items-center p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest Jobs"
                  archiveLabel="Archive Jobs"
                />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                <Button onClick={this.handleClick}>
                  Create Job Post
                </Button>
              </div> : null}
              <div className="col-auto btn-group p-0 m-0 ml-2">
                <TableFilterDropdown
                  value={this.state.filter}
                  onChange={this.callApiFilter}
                />
              </div>
            </div>
          </div>
          <div className="d-md-flex d-none d-lg-none mb-2 align-items-center justify-content-between">
            <div className="col-auto">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex flex-column">
              <div className="col-auto d-flex align-items-center justify-content-end p-0 m-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                  latestLabel="Latest Jobs"
                  archiveLabel="Archive Jobs"
                />
              </div>
              <div className="d-flex justify-content-end mt-2">
                {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0">
                  <Button onClick={this.handleClick}>
                    Create Job Post
                  </Button>
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
            <div className="col d-flex align-items-center justify-content-end">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex align-items-center justify-content-end p-0 m-0 mt-2">
              <TableTabs
                value={this.state.menu}
                onChange={(menu) => this.setState({ menu })}
              />
            </div>
            {this.state?.writeAccess ? <div className="col create-event d-flex align-items-center justify-content-end p-0 m-0 mt-2">
              <Button onClick={this.handleClick}>
                Create Job Post
              </Button>
            </div> : null}
            <div className="col btn-group user-button-grp d-flex align-items-center justify-content-end p-0 m-0 mt-2">
              <TableFilterDropdown
                value={this.state.filter}
                onChange={this.callApiFilter}
              />
            </div>
          </div>
          <div className="table">
            <CommonTable
              value={tableValue}
              loading={loading}
              exportExcel={this.exportExcel}
              globalFilterFields={["id", "company_name", "job_title", "location", "posted_on"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <CareerForm
            status={this.state.status}
            editProjectId={this.state.editProjectId}
            closeModel={async () => {
              this.setState({ status: false });
            }}
            afterSubmit={this.componentDidMount}
            saveAccess={this.state?.writeAccess}
            deleteAccess={this.state?.deleteAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the Job?"
            confirm={async () => {
              await this.getSuccess();
            }}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
}
export default observer(CareerDashboard);
