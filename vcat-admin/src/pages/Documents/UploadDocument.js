import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { BsUpload } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import {
  GrDocumentText,
  GrDocumentPdf,
  GrDocumentImage,
  GrDocument,
} from "react-icons/gr";
import { AiOutlineCloseCircle } from "react-icons/ai";

// CSS  imports //
import logo from "../../components/img/logo.png";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import Modal from "react-bootstrap/Modal";
import User from "../../modals/User";
import { UploadDoc } from "../../common/UploadDoc";

// Api file imports //
import { DocCat, documentInsert } from "../../libraries/documentsDashboard";
import { observer } from "mobx-react";
import Notifications from "../../common/Notifications";

// Components imports //

const animatedComponents = makeAnimated();

class UploadDocument extends React.Component {
  state = {
    document_path: "",
    document_name: "",
    selectCategory: null,
    DropdownList: [],
    selectCategoryError: "",
  };

  componentDidMount = async (e) => {
    const DocResponse = await DocCat();
    if (DocResponse.statuscode === 200) {
      const result = DocResponse.result;
      const categories = result.categories_dropdown;
      const DropdownList = [];
      for (let i in categories) {
        let DropdownId = {
          value: categories[i].id,
          label: categories[i].name,
        };
        DropdownList.push(DropdownId);
      }
      this.setState({
        DropdownList,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({
        document_path: "",
        document_name: "",
        selectCategory: null,
        selectCategoryError: "",
        docError: '',
      });
    }
  }

  renderFileType() {
    const { document_path } = this.state;
    const fileExt = document_path.split(".").pop();
    let icon;
    switch (fileExt) {
      case "pdf":
      case "csv":
      case "txt":
        icon = (
          <GrDocumentPdf
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        );
        break;
      case "doc":
      case "docx":
        icon = (
          <GrDocumentText
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        );
        break;
      case "jpeg":
      case "jpg":
      case "png":
      case "gif":
        icon = (
          <GrDocumentImage
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        );
        break;

      default:
        icon = (
          <GrDocument
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        );
        break;
    }
    return (
      <div className="thumbnail-image">
        <a
          href={document_path}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {icon}
        </a>
      </div>
    );
  }
  renderThumbnailFile = () => {
    return (
      <>
        {this.state.document_path &&
          parseInt(Notifications.Doc_media_size) < 5000000 ? (
          <div className="col-md-12">
            <div
              className="d-flex my-3"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <div className="col-md-3 ">
                <div className="thumbnail-image">{this.renderFileType()}</div>
              </div>
              <div className="col-md-2">
                <BsTrashFill
                  className="theme-font-color big-font-size m-2 pointer"
                  onClick={() => this.setState({ document_path: "" })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-padding mb-4 mb-3 mt-2">
              <p>The file size is should be less than 5mb</p>
              <>
                {Notifications?.DocType ? (
                  <>
                    <p>{Notifications?.DocType}</p>
                  </>
                ) : (
                  <>{Notifications?.DocType}</>
                )}
              </>
            </div>
          </div>
        )}
      </>
    );
  };

  onSelectCategory = (selectedCategory) => {
    this.setState({ selectCategory: selectedCategory });
  };

  handleClose = () => {
    Notifications.setDocType("");
    Notifications.setMediaSizeDoc("");
    this.setState(
      {
        document_path: "",
        document_name: "",
        selectCategory: null,
        selectCategoryError: "",
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  validateSelectCategory = () => {
    const check = !!this.state.selectCategory;
    this.setState({ selectCategoryError: check ? "" : "Category empty" });
    return check;
  };

  validateDoc = () => {
    const check = (this.state.document_name && this.state.document_path);
    this.setState({ docError: check ? "" : "Please Upload Agenda" });
    console.log("Please Upload Agenda");
    return check;
  };

  ValidateAll = () => {
    const categoryCheck = this.validateSelectCategory();
    const docCheck = this.validateDoc();
    const result = categoryCheck && docCheck;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.props?.saveAccess) {
      if (this.props.password) {
        this.setState({ password: this.props.password });
      }
      const id = User.user_id;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const requestData = {
          filePath: this.state.document_path,
          cat_id: this.state.selectCategory.value,
          user_id: id,
          type: "document_path",
          file_name: this.state.document_name,
        };
        const response = await documentInsert(requestData);
        if (response && response.status === "success") {
          AppConfig.setMessage("Document uploaded", false);
          this.props.closeModel(false);
        } else if (response.status === "error") {
          AppConfig.setMessage(response?.result);
        }
        if (this.props?.afterSubmit)
          this.props?.afterSubmit();
      } else {
        return false;
      }
    }
  };
  // Handle file select

  // Select file
  selectUploadDocument = (e) => {
    e.preventDefault();
    const document_path = e.target.files[0];
    const document_name = e.target.files[0].name;
    const mediaSize = e.target.files[0].size;
    Notifications.setMediaSizeDoc(mediaSize);
    this.setState({ document_name: document_name });
    UploadDoc(document_path, this.callBackDocument);
  };

  callBackDocument = (response = false) => {
    if (response && response.status === "success") {
      this.setState({
        document_path: response.result.url,
        document_name: response.result.file_name,
      });
    }
  };

  handleUploadDocument = (e) => {
    this.setState({ docError: '' });
    e.preventDefault();
    const fileSelectorAgenda = document.getElementById("uploadDocument");
    fileSelectorAgenda.click();
  };

  render() {
    const { DropdownList } = this.state;
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
            <div className="form-head width100 dflex jc-sb align-center">
              <div className="width100 dflex align-center">
                <img src={logo} alt="logo" />
                <h3 className="ml-2"> Document </h3>
              </div>
              <button
                className="popup-button closeText dflex"
                onClick={this.handleClose}
              >
                <span>
                  <AiOutlineCloseCircle />
                </span>
              </button>
            </div>
          </Modal.Header>
          <div className="p-3">
            <Modal.Body>
              <form
                className="align-items-center event-form"
                encType="multipart/form-data"
                onSubmit={this.onSubmitCreate}
              >
                <div className="mb-4">
                  <label className="dflex align-center">
                    Document Category<span className="asterik">*</span>
                  </label>
                  <div className="form-floating mb-4 select">
                    <Select
                      aria-label="Default select example"
                      placeholder={this.state.selectCategoryError || "Select the Category"}
                      type="drop"
                      value={this.state.selectCategory}
                      className={this.state.selectCategoryError ? "validationError" : null}
                      onFocus={() =>
                        this.setState({ selectCategoryError: "" })
                      }
                      onChange={this.onSelectCategory}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      options={DropdownList}
                      isSearchable
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`form-padding mb-4 upload-agenda ${this.state.docError ? "text-danger border border-danger" : ''}`}>
                    {this.state.document_path ? (
                      <div className="col-md-12">
                        {this.renderThumbnailFile()}
                      </div>
                    ) : (
                      <div>
                        <input
                          className="form-control bsUpload"
                          id="uploadDocument"
                          type="file"
                          onChange={this.selectUploadDocument}
                        />
                        <button
                          className="btn  small-font-size font-style py-2 my-2"
                          onClick={this.handleUploadDocument}
                        >
                          <BsUpload />
                          <span className="mx-3">Upload Agenda <span className="asterik">*</span></span>
                        </button>
                        <p
                          className="small-font-size my-0"
                          style={{ fontSize: "0.8rem" }}
                        >
                          File resolution should be less than 5mb
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {this.props?.saveAccess ? <div className="cta-section">
                  <button
                    type="button"
                    className="btn event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta" onClick={this.onSubmitCreate}>
                    Upload document
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

export default observer(UploadDocument);
