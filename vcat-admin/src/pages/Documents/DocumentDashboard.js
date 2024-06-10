// Imports order //

// Plugins //
import React from "react";
import { observer } from "mobx-react";
import "date-fns";
import { BsArrowLeftShort } from "react-icons/bs";
import { GrDocumentPdf } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

// Common file imports //
import User from "../../modals/User";
import AppConfig from "../../modals/AppConfig";

// Api file imports //
import {
  DocCat,
  deleteDocument,
  documentTable,
} from "../../libraries/documentsDashboard";

// Components imports //
import ConfirmModal from "../../components/ConfirmModal";
import UploadDocument from "./UploadDocument.js";

import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./DocumentDashboard.css";
import { ExportService } from "../../common/ExportService";
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from "../../common/CommonElements";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import moment from "moment";
import { checkPermission, getOnlyDate } from "../../common/Common";

class DocumentDashboard extends React.Component {
  exportServices;

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      tableData: [],
      menu: "Latest",
      // visible: '',
      DropdownList: [],
      CategoryList: [],
      CategoryListData: [],
      selectCategory: null,
      filter: "30 days",
      visible: false,
      editDocument: "",
      deleteDocument: "",
      sortBy: "",
      // new
      documentData: [],
      loading: true,
      globalFilter: "",
      // 
      writeAccess: checkPermission("WRITE_DOCUMENT"),
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
    const resultCat = await DocCat();
    const CategoryList = [];
    CategoryList.push({ value: null, label: "All Documents" })
    if (resultCat && resultCat.status === "success") {
      const result = resultCat.result;
      const categories_dropdown = await result.categories_dropdown;
      for (let i in categories_dropdown) {
        let CatId = {
          value: categories_dropdown[i].id,
          label: categories_dropdown[i].name,
        };
        CategoryList.push(CatId);
      }
      this.setState({
        DropdownList: result.categories_dropdown,
        CategoryList,
      });
    }
  };

  tableFetchApi = async () => {
    this.setState({ loading: true });
    const { filter, selectCategory: category_id } = this.state;
    const response = await documentTable({ filter, category_id });
    if (response) {
      const { result: oldDocumentData } = response;
      if (oldDocumentData && Array.isArray(oldDocumentData)) {
        const documentData = [];
        oldDocumentData.forEach((row) => {
          documentData.push({
            ...row,
            created_on: row?.created_at ? moment(row?.created_at).format("Do MMMM YYYY") : row?.to_date,
          });
        })
        this.setState({ documentData });
      }
    }
    this.setState({ loading: false });
  }

  getTableData = () => {
    const { documentData, menu } = this.state;
    if (documentData && documentData.length > 0) {
      // return documentData.filter(({ is_archive }) => String(is_archive) === (menu === "Archive" ? "1" : "0"));
      const testDate = getOnlyDate();
      testDate.setFullYear(testDate.getFullYear() - 1);
      if (menu === "Archive") {
        return documentData.filter(({ created_at }) => new Date(created_at) < testDate);
      }
      return documentData.filter(({ created_at }) => new Date(created_at) >= testDate);
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
        "File Name": row?.file_name || "-",
        "File Url": row?.document_path || "No Link",
        "Added on": row?.created_on || "-",
      });
    });
    this.exportServices.exportExcel(`${menu} Documents`, [
      { field: "SL", header: "SL" },
      { field: "File Name", header: "File Name" },
      { field: "File Url", header: "File Url" },
      { field: "Added on", header: "Added on" },
    ], excelData);
  }

  handleClick = (e) => {
    this.setState({
      status: true,
    });
  };

  callApiFilter = ({ value: filter }) => {
    this.setState({ filter }, async () => {
      await this.tableFetchApi();
    });
  };

  onSelectCategory = async ({ value: selectCategory }) => {
    this.setState({ selectCategory }, async () => {
      await this.tableFetchApi();
    });
  };

  render() {
    const { CategoryList, loading, globalFilter } = this.state;
    const tableValue = this.getTableData();
    const columns = [
      <Column
        field="id"
        header="SL"
        sortable
        // filter
        filterPlaceholder="Search by SL"
        style={{ minWidth: '6rem', maxWidth: '7rem' }}
      />,
      <Column
        field="file_name"
        header="File Name"
        sortable
        filter
        filterPlaceholder="Search by File Name"
      />,
      <Column
        field="document_path"
        header="File"
        filterPlaceholder="Search by File"
        body={(data, option) => {
          return <div>
            <div className="tableData-col2 dflex no-border no-hover">
              {data?.document_path ?
                <a href={data?.document_path} target="_blank" rel="noreferrer">
                  <GrDocumentPdf />
                </a> : "No link"}
            </div>
          </div>
        }}
      />,
      <Column
        field="created_on"
        header="Added on"
        sortable
        filter
        filterPlaceholder="Search by Date"
      />,
      this.state?.writeAccess ? <Column
        header="Action"
        align="center"
        headerClassName="d-flex justify-content-center"
        body={(data, option) => {
          return <div className="d-flex align-items-center">
            <div className="d-flex" >
              <div className="col d-flex align-items-center justify-content-center">
                <MdDelete
                  size={40}
                  color="white"
                  onClick={() => this.deleteDocument(data.id)}
                  style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                />
              </div>
            </div>
          </div>;
        }} /> : null
    ];
    return (
      <div className="app-main__outer">
        <div className="back-event">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> DOCUMENTS
          </button>
        </div>
        <div className="content">
          <div className="d-xl-flex row d-none mb-2 align-items-center justify-content-between m-0 p-0">
            <div className="col-5 d-flex align-items-center m-0 p-0">
              <TableGlobalSearch
                value={globalFilter}
                onChange={(value) => this.setState({ globalFilter: value })}
              />
            </div>
            <div className="col d-flex justify-content-end">
              <div className="col-auto d-flex align-items-center m-0 p-0">
                <TableTabs
                  value={this.state.menu}
                  onChange={(menu) => this.setState({ menu })}
                />
              </div>
              {this.state?.writeAccess ? <div className="col-auto create-event p-0 ml-2">
                <Button onClick={() => this.setState({ status: true })}>
                  Upload Document
                </Button>
              </div> : null}
              <div className="col-auto btn-group user-button-grp p-0 ml-2">
                <Dropdown
                  optionLabel="label"
                  optionValue="value"
                  value={this.state.selectCategory}
                  options={CategoryList}
                  onChange={this.onSelectCategory}
                  placeholder="ALL DOCUMENTS"
                  className="rounded-pill pl-2 pr-2 filter-dropdown"
                  dropdownIcon="pi pi-chevron-down primary-color text-white rounded-circle p-1"
                />
              </div>
              <div className="col-auto btn-group user-button-grp p-0 ml-2">
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
            <div className="col d-flex flex-column">
              <div className="col-12 d-flex justify-content-end">
                <div className="col-auto d-flex align-items-center justify-content-end m-0 p-0">
                  <TableTabs
                    value={this.state.menu}
                    onChange={(menu) => this.setState({ menu })}
                  />
                </div>
                {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                  <Button onClick={() => this.setState({ status: true })}>
                    Upload Document
                  </Button>
                </div> : null}
              </div>
              <div className="col-12 d-flex justify-content-end mt-2">
                <div className="col-auto btn-group user-button-grp p-0 m-0">
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={this.state.selectCategory}
                    options={CategoryList}
                    onChange={this.onSelectCategory}
                    placeholder="ALL DOCUMENTS"
                    className="rounded-pill pl-2 pr-2 filter-dropdown"
                    dropdownIcon="pi pi-chevron-down primary-color text-white rounded-circle p-1"
                  />
                </div>
                <div className="col-auto btn-group p-0 m-0 ml-2">
                  <TableFilterDropdown
                    value={this.state.filter}
                    onChange={this.callApiFilter}
                  />
                </div>
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
              <div className="col-12 d-flex justify-content-end">
                <div className="col-auto d-flex align-items-center justify-content-end m-0 p-0">
                  <TableTabs
                    value={this.state.menu}
                    onChange={(menu) => this.setState({ menu })}
                  />
                </div>
                {this.state?.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                  <Button onClick={() => this.setState({ status: true })}>
                    Upload Document
                  </Button>
                </div> : null}
              </div>
              <div className="col-12 d-flex justify-content-end mt-2">
                <div className="col-auto btn-group user-button-grp p-0 m-0">
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={this.state.selectCategory}
                    options={CategoryList}
                    onChange={this.onSelectCategory}
                    placeholder="ALL DOCUMENTS"
                    className="rounded-pill pl-2 pr-2 filter-dropdown"
                    dropdownIcon="pi pi-chevron-down primary-color text-white rounded-circle p-1"
                  />
                </div>
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
              <Button onClick={() => this.setState({ status: true })}>
                Upload Document
              </Button>
            </div> : null}
            <div className="col-auto btn-group user-button-grp d-flex align-items-center justify-content-end mt-2">
              <Dropdown
                optionLabel="label"
                optionValue="value"
                value={this.state.selectCategory}
                options={CategoryList}
                onChange={this.onSelectCategory}
                placeholder="ALL DOCUMENTS"
                className="rounded-pill pl-2 pr-2 filter-dropdown ml-3"
                dropdownIcon="pi pi-chevron-down primary-color text-white rounded-circle p-1"
              />
            </div>
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
              globalFilterFields={["id", "file_name", "created_on"]}
              globalFilter={globalFilter}
            >
              {columns}
            </CommonTable>
          </div>
          <UploadDocument
            status={this.state.status}
            closeModel={() => this.setState({ status: false })}
            afterSubmit={this.tableFetchApi}
            saveAccess={this.state?.writeAccess}
          />
          <ConfirmModal
            delete={true}
            visible={this.state.visible}
            heading="Delete"
            title="Are you sure you want to delete the document?"
            confirm={() => this.getSuccess()}
            handleClose={() => this.setState({ visible: false })}
          />
        </div>
      </div>
    );
  }
  deleteDocument = (id) => {
    this.setState({ visible: true, deleteDocument: id });
  };

  getSuccess = () => {
    const id = this.state.deleteDocument;
    deleteDocument(id).then(async (response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        User.setRefresh();
        await this.tableFetchApi();
        AppConfig.setMessage(response.result, false);
      }
    });
  };
}
export default observer(DocumentDashboard);
