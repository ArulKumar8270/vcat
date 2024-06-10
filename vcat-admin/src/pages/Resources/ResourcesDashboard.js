// Imports order //

// Plugins //
import React from "react";
import { observer } from "mobx-react";
import "date-fns";
import moment from "moment";
import { BsArrowLeftShort } from "react-icons/bs";
import { GrDocumentPdf } from "react-icons/gr";
import { MdDelete, MdEdit } from "react-icons/md";

// Common file imports //
import User from "../../modals/User";
import AppConfig from "../../modals/AppConfig";

// Api file imports //
import { deleteResource, resourceTable } from "../../libraries/resources";

// Components imports //
import ConfirmModal from "../../components/ConfirmModal";
import Resources from "./Resources";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./ResourcesDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from "../../common/CommonElements";
import { Tooltip } from "primereact/tooltip";
import { checkPermission } from "../../common/Common";

class ResourcesDashboard extends React.Component {
  exportServices;

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      tableData: [],
      menu: "public",
      filter: "30 days",
      visible: false,
      editResourceId: "",
      deleteResource: "",
      // new
      resourceData: [],
      loading: true,
      globalFilter: "",
      // 
      writeAccess: checkPermission("WRITE_RESOURCE"),
    };
    this.exportExcel = this.exportExcel.bind(this);
    this.exportServices = new ExportService();
  }

  componentDidMount = async (e) => {
    await this.tableFetchApi();
  };

  tableFetchApi = async () => {
    this.setState({ loading: true });
    const { filter } = this.state;
    const response = await resourceTable({ filter });
    if (response) {
      const { result: oldResourceData } = response;
      if (oldResourceData && Array.isArray(oldResourceData)) {
        const resourceData = [];
        oldResourceData.forEach((row) => {
          resourceData.push({
            ...row,
            created_at: moment(row?.created_at).format("Do MMMM YYYY"),
          });
        });
        this.setState({ resourceData });
      }
    }
    this.setState({ loading: false });
  }

  getTableData = () => {
    const { resourceData, menu } = this.state;
    if (resourceData && resourceData.length > 0) {
      return resourceData.filter(({ type }) => type === menu);
    }
    return [];
  }

  exportExcel() {
    const { resourceData, menu } = this.state;
    if (resourceData && resourceData.length > 0) {
      const tableData = this.getTableData();
      const excelData = [];
      tableData.forEach((row) => {
        excelData.push({
          "SL": row?.id,
          "Subject": row?.subject || "-",
          "Topic": row?.topic || "No Link",
          "URL": row?.link || "-",
          "File": row?.document || "-",
          "Speaker": row?.speaker || "-",
          "Added on": row?.created_at || "-",
        });
      });
      this.exportServices.exportExcel(`${menu} Resources`, [
        { field: "SL", header: "SL" },
        { field: "Subject", header: "Subject" },
        { field: "Topic", header: "Topic" },
        { field: "URL", header: "URL" },
        { field: "File", header: "File" },
        { field: "Speaker", header: "Speaker" },
        { field: "Added on", header: "Added on" },
      ], excelData)
    }
  }

  handleClick = (e) => {
    this.setState({
      status: true,
    })
  }

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  deleteResources = (id) => {
    this.setState({ visible: true, deleteResource: id });
  };

  updateResource = (id) => {
    this.setState({ editResourceId: id, status: true });
  };

  getSuccess = () => {
    const id = this.state.deleteResource;
    deleteResource(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        User.setRefresh();
        AppConfig.setMessage(response.result, false);
        this.tableFetchApi();
      }
    });
  };

  render() {
    const { loading, globalFilter } = this.state;
    const tableValue = this.getTableData();
    const columns = [
      <Column
        field="id"
        header="SL"
        sortable
        filterPlaceholder="Search by SL"
        style={{ minWidth: '3rem', maxWidth: '4rem' }}
      />,
      <Column
        field="subject"
        header="Subject"
        sortable
        filter
        filterPlaceholder="Search by Subject"
        style={{
          minWidth: '10rem',
          maxWidth: '13rem',
        }}
        body={(data) => <>
          <Tooltip target={`.resource-subject${data?.id}`} content={data?.subject} />
          <div className={`resource-subject${data?.id}`} data-toggle="tooltip" title={data?.subject}>
            {data?.subject && data?.subject?.length > 36 ? data?.subject.slice(0, 35) + '...' : data?.subject}
          </div>
        </>}
      />,
      < Column
        field="topic"
        header="Topic"
        sortable
        filter
        filterPlaceholder="Search by Topic"
        style={{
          minWidth: '10rem',
          maxWidth: '13rem',
        }}
        body={(data, option) => <>
          <Tooltip target={`.resource-topic${data?.id}`} content={data?.topic} />
          <div className={`resource-topic${data?.id}`} data-toggle="tooltip" title={data?.topic}>
            {data?.topic && data?.topic?.length > 36 ? data?.topic.slice(0, 35) + '...' : data?.topic}
          </div>
        </>}
      />,
      <Column
        field="link"
        header="URL"
        filterPlaceholder="Search by URL"
        style={{
          minWidth: '10rem',
          maxWidth: '13rem',
        }}
        body={(data, option) => {
          return <div>
            <div className="d-flex">
              {data?.link ? <a
                href={data?.link}
                rel="noreferrer"
                target="_blank"
              >
                <Tooltip target={`.resource-link${data?.id}`} content={data?.link} />
                <div className={`resource-link${data?.id}`} data-toggle="tooltip" title={data?.link}>
                  {data?.link && data?.link?.length > 30 ? data?.link.slice(0, 30) + '...' : data?.link}
                </div>
              </a> : "No link"}
            </div>
          </div>
        }}
      />,
      <Column
        field="document"
        header="File"
        filterPlaceholder="Search by File"
        style={{ minWidth: '3rem', maxWidth: '4rem' }}
        body={(data, option) => {
          return <div>
            <div className="d-flex border-0 no-hover">
              {data?.document ?
                <a href={data?.document} target="_blank" rel="noreferrer">
                  <GrDocumentPdf />
                </a> : "No link"}
            </div>
          </div>
        }}
      />,
      <Column
        field="speaker"
        header="Speaker"
        sortable
        filter
        filterPlaceholder="Search by Speaker"
      />,
      <Column
        field="created_at"
        header="Added on"
        sortable
        filter
        filterPlaceholder="Search by Date"
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
                  onClick={() => this.updateResource(data?.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
              {this.state?.writeAccess ? <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteResources(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div> : null}
            </div>
          </div>;
        }} />
    ];
    return (
      <div style={{ overflowX: "scroll" }}>
        <div className="app-main__outer">
          <div className="back-event  ">
            <button onClick={() => this.props.history.goBack()}>
              <BsArrowLeftShort /> RESOURCES
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
                <div className="col-auto d-flex align-items-center p-0 m-0">
                  <TableTabs
                    value={this.state.menu}
                    onChange={(menu) => this.setState({ menu })}
                    latestLabel="Public"
                    latestValue="public"
                    archiveLabel="Private"
                    archiveValue="private"
                  />
                </div>
                {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                  <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                    Upload Document
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
              <div className="col-auto d-flex flex-column">
                <div className="col-auto d-flex align-items-center justify-content-end p-0 m-0">
                  <TableTabs
                    value={this.state.menu}
                    onChange={(menu) => this.setState({ menu })}
                  />
                </div>
                <div className="d-flex justify-content-end mt-2">
                  {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0">
                    <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                      Upload Document
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
              <div className="col-auto d-flex align-items-center justify-content-end">
                <TableGlobalSearch
                  value={globalFilter}
                  onChange={(value) => this.setState({ globalFilter: value })}
                />
              </div>
              <div className="col-auto d-flex align-items-center justify-content-end mt-2">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event d-flex align-items-center justify-content-end mt-2">
                <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                  Upload Document
                </Button>
              </div> : null}
              <div className="col-auto btn-group user-button-grp d-flex align-items-center justify-content-end mt-2">
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
                globalFilterFields={["id", "subject", "topic", "speaker", "created_at"]}
                globalFilter={globalFilter}
              >
                {columns}
              </CommonTable>
            </div>
            <Resources
              status={this.state.status}
              editResourceId={this.state.editResourceId}
              closeModel={() =>
                this.setState({ status: false, editResourceId: "" })
              }
              afterSubmit={this.tableFetchApi}
              saveAccess={this.state?.writeAccess}
            />
            <ConfirmModal
              delete={true}
              visible={this.state.visible}
              heading="Delete"
              title="Are you sure you want to delete the Document?"
              confirm={() => this.getSuccess()}
              handleClose={() => this.setState({ visible: false })}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default observer(ResourcesDashboard);
