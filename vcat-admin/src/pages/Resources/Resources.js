import React from "react";
import { BsUpload } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { GrDocumentText, GrDocumentPdf, GrDocument } from "react-icons/gr";
import { AiOutlineCloseCircle } from "react-icons/ai";

// CSS  imports //
import logo from "../../components/img/logo.png";

// Common file imports //
import { CheckMessage, DropDownCheck } from "../../common/Validation";
import AppConfig from "../../modals/AppConfig";
import Modal from "react-bootstrap/Modal";
import User from "../../modals/User";
import { UploadResDoc } from "../../common/UploadDoc";

// Api file imports //
import { DocCat } from "../../libraries/documentsDashboard";
import { observer } from "mobx-react";
import Notifications from "../../common/Notifications";
import {
  resourcesAutoPopulate,
  resourcesInsert,
  updateResource,
} from "../../libraries/resources";
import AppLayoutConfig from "../../common/AppLayoutConfig";

class Resources extends React.Component {
  state = {
    status: false,
    document_path: "",
    document_name: "",
    selectCategory: {},
    DropdownList: [],
    subject: "",
    topic: "",
    speaker: "",
    url: "",
    resourceType: "public",
  };

  componentDidMount = async () => {
    AppLayoutConfig.setShowLayout(true);
    AppLayoutConfig.setShowHeader(true);
    AppLayoutConfig.setShowSidebar(true);
    AppLayoutConfig.setShowFooter(true);
    AppLayoutConfig.setShowSideCalendar(true);
    AppLayoutConfig.setShowChat(true);
    const DocResponse = await DocCat();
    if (DocResponse.statuscode === 200) {
      const result = DocResponse.result;
      const categories = await result.categories_dropdown;
      const DropdownList = [];
      for (let i in categories) {
        const DropdownId = {
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

  async componentDidUpdate(prevProps) {
    const id = this.props.editResourceId;
    if (this.props.status !== prevProps.status && id && this.props.status) {
      this.setState({ status: this.props.status });
      const response = await resourcesAutoPopulate(id);
      if (response) {
        const { status, result } = response;
        if (status === 'success' && result) {
          const { resources } = result;
          this.setState({
            subject: resources?.subject,
            topic: resources?.topic,
            speaker: resources?.speaker,
            document_path: resources?.document,
            url: resources?.link,
            resourceType: resources?.type,
            // user_id: User.user_id
          });
        }
      }
    }
  }

  renderFileType() {
    const { document_path } = this.state;
    const fileExt = document_path.split(".").pop();
    console.log("file ext", fileExt);
    // return (
    //   <>
    //     {fileExt === "pdf" || fileExt === "csv" || fileExt === "txt" ? (
    //       <div className="thumbnail-image">
    //         <a
    //           href={document_path}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           download
    //         >
    //           <GrDocumentPdf
    //             style={{ width: "50px", height: "50px", cursor: "pointer" }}
    //           />
    //         </a>
    //       </div>
    //     ) : null || fileExt === "doc" || fileExt === "docx" ? (
    //       <div className="thumbnail-image">
    //         <a
    //           href={document_path}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           download
    //         >
    //           <GrDocumentText
    //             style={{ width: "50px", height: "50px", cursor: "pointer" }}
    //           />
    //         </a>
    //       </div>
    //     ) : null}
    //   </>
    // );
    if (['pdf', 'csv', 'txt'].includes(fileExt))
      return <div className="thumbnail-image">
        <a
          href={document_path}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <GrDocumentPdf
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        </a>
      </div>
    if (['doc', 'docx'].includes(fileExt))
      return <div className="thumbnail-image">
        <a
          href={document_path}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <GrDocumentText
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        </a>
      </div>
    return <div className="thumbnail-image">
      <a
        href={document_path}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <GrDocument
          style={{ width: "50px", height: "50px", cursor: "pointer" }}
        />
      </a>
    </div>

  }

  renderThumbnailFile = () => {
    return this.state.document_path ? (
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
    );
  };

  onSelectCategory = (selectedCategory) => {
    this.setState({ selectCategory: selectedCategory });
  };

  resourceType = (e) => {
    this.setState({ resourceType: e.target.value });
  };

  handleClose = () => {
    Notifications.setDocType("");
    Notifications.setMediaSizeDoc("");
    this.setState(
      {
        document_path: "",
        filePath: "",
        file_name: "",
        subject: "",
        topic: "",
        speaker: "",
        link: "",
        resourceType: "public",
        SubjectError: "",
        TopicError: "",
        SpeakerError: "",
        urlError: "",
        docError: "",
      },
      () => {
        this.props.closeModel(false);
      }
    );
  };

  validateSubjectError = () => {
    const SubjectError = CheckMessage(this.state.subject);
    if (SubjectError === 1) {
      this.setState({ SubjectError: "Field empty" });
      return false;
    } else return true;
  };

  validateSpeakerError = () => {
    const SpeakerError = CheckMessage(this.state.speaker);
    if (SpeakerError === 1) {
      this.setState({ SpeakerError: "Field empty" });
      return false;
    } else return true;
  };

  validateTopicError = () => {
    const TopicError = CheckMessage(this.state.topic);
    if (TopicError === 1) {
      this.setState({ TopicError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectCategory = () => {
    const selectCategoryError = DropDownCheck(this.state.selectCategory);
    if (selectCategoryError === 1) {
      this.setState({ selectCategoryError: "Field empty" });
      return false;
    } else return true;
  };

  validateUrlError = () => {
    const urlError = CheckMessage(this.state.url);
    const urlRegex = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (urlError === 1 || !urlRegex.test(this.state.url)) {
      this.setState({ urlError: "Field empty" });
      return false;
    }
    return true;
  };

  validateDoc = () => {
    const check = (this.state.document_path);
    this.setState({ docError: check ? "" : "Please Upload Document" });
    console.log("Please Upload Agenda");
    return check;
  };

  ValidateAll = () => {
    const selectCategoryInput = this.validateSelectCategory();
    const subjectInput = this.validateSubjectError();
    const topicInput = this.validateTopicError();
    const speakerInput = this.validateSpeakerError();
    const docInput = this.validateDoc();
    // const urlErrorInput = this.validateUrlError();
    // const result =
    //   selectCategoryInput &&
    //   subjectInput &&
    //   topicInput &&
    //   speakerInput &&
    //   urlErrorInput;
    const result =
      selectCategoryInput &&
      subjectInput &&
      topicInput &&
      speakerInput &&
      docInput;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e.preventDefault();
    if (this.props?.saveAccess) {
      if (this.props.password) {
        this.setState({ password: this.props.password });
      }
      const id = User.user_id;
      const editId = this.props.editResourceId;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const requestData = {
          filePath: this.state.document_path,
          user_id: id,
          // type: "document_path",
          type: this.state.resourceType,
          // file_name: this.state.document_name,
          subject: this.state.subject,
          topic: this.state.topic,
          speaker: this.state.speaker,
          link: this.state.url,
        };
        console.log("response", requestData);
        if (editId) {
          requestData["user_id"] = User.user_id;
          const response = await updateResource(requestData, editId);
          if (response && response.status === "success") {
            this.handleClose();
            AppConfig.setMessage("Resource updated successfully", false);
          } else if (response.status === "error") {
            AppConfig.setMessage(response?.result);
          }
        } else {
          const response = await resourcesInsert(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage("Resource created successfully", false);
            this.handleClose();
          } else if (response.status === "error") {
            const result = response.result;
            let message = result;
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
          }
        }
        if (this.props.afterSubmit) await this.props.afterSubmit();
      }
    }
  };

  // Select file
  selectUploadDocument = (e) => {
    e.preventDefault();
    const document_path = e.target.files[0];
    const document_name = e.target.files[0].name;
    const mediaSize = e.target.files[0].size;
    Notifications.setMediaSizeDoc(mediaSize);
    this.setState({ document_name: document_name });
    UploadResDoc(document_path, this.callBackDocument);
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
    return (
      <div>
        <Modal
          size="md"
          className="border-style rounded"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props?.status ? true : false}
        >
          <Modal.Header>
            <div className="form-head width100 dflex jc-sb align-center">
              <div className="width100 dflex align-center">
                <img src={logo} alt="res_logo" />
                <h3 className="ml-2">Resource</h3>
              </div>
              <button
                className="popup-button closeText dflex"
                onClick={this.handleClose}
              >
                Close
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
                <div className="row jc-sb">
                  <div className="input-row mb-3 mr-2">
                    <div className="form-padding mb-3">
                      <label>
                        Subject <span className="asterik">*</span>
                      </label>
                      {this.state.SubjectError ? (
                        <input
                          type="text"
                          className="form-control validationError"
                          id="floatingInput"
                          placeholder={this.state.SubjectError}
                          value={this.state.subject}
                          onFocus={() => this.setState({ SubjectError: "" })}
                          onChange={(e) =>
                            this.setState({ subject: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="Subject"
                          value={this.state.subject}
                          onFocus={() => this.setState({ SubjectError: "" })}
                          onChange={(e) =>
                            this.setState({ subject: e.target.value })
                          }
                        />
                      )}
                    </div>
                    {/* <div className="d-flex justify-content-start">
                                            {this.state.SubjectError ? (<span className='small-font-size text-danger'> {this.state.SubjectError}</span>) : ''}
                                        </div> */}
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label>
                        Topic <span className="asterik">*</span>
                      </label>
                      {this.state.TopicError ? (
                        <input
                          type="text"
                          className="form-control validationError"
                          id="floatingInput"
                          placeholder={this.state.TopicError}
                          value={this.state.topic}
                          onFocus={() => this.setState({ TopicError: "" })}
                          onChange={(e) =>
                            this.setState({ topic: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="Topic"
                          value={this.state.topic}
                          onFocus={() => this.setState({ TopicError: "" })}
                          onChange={(e) =>
                            this.setState({ topic: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-2 jc-sb">
                  <div className="input-row">
                    <div className="form-padding mb-2">
                      <label>
                        Speaker <span className="asterik">*</span>
                      </label>
                      {this.state.SpeakerError ? (
                        <input
                          type="text"
                          className="form-control validationError"
                          id="floatingInput"
                          placeholder={this.state.SpeakerError}
                          value={this.state.speaker}
                          onFocus={() => this.setState({ SpeakerError: "" })}
                          onChange={(e) =>
                            this.setState({ speaker: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="Speaker"
                          value={this.state.speaker}
                          onFocus={() => this.setState({ SpeakerError: "" })}
                          onChange={(e) =>
                            this.setState({ speaker: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="form-padding">
                      <label>
                        {/* URL <span className="asterik">*</span> */}
                        URL
                      </label>
                      <input
                        type="text"
                        // className={`form-control ${this.state.urlError ? "validationError" : ""
                        //   }`}
                        className="form-control"
                        id="floatingInput"
                        placeholder={
                          this.state.urlError
                            ? this.state.urlError
                            : "https://www.link.com"
                        }
                        value={this.state.url}
                        // onFocus={() => this.setState({ urlError: "" })}
                        onChange={(e) => this.setState({ url: e.target.value })}
                      />
                    </div>
                    {/* <div className="d-flex justify-content-start">
                                            {this.state.cityError ? (<span className='small-font-size text-danger'> {this.state.cityError}</span>) : ''}
                                        </div> */}
                  </div>
                  <div className="input-row">
                    <div className={`radio-section pay-type mb-5`}>
                      <label htmlFor="floatingInput" className="radio-head">
                        Type
                      </label>
                      <div className="form-padding radio-input radio mt-3">
                        <div className="internal inner">
                          <input
                            value="public"
                            type="radio"
                            id="public"
                            checked={this.state.resourceType === "public"}
                            style={{ margin: "0px 10px" }}
                            onChange={this.resourceType}
                          />
                          <label htmlFor="public">Public</label>
                        </div>
                        <div className="inner virtual">
                          <input
                            value="private"
                            type="radio"
                            id="private"
                            style={{ margin: "0px 10px" }}
                            checked={this.state.resourceType === "private"}
                            onChange={this.resourceType}
                          />
                          <label htmlFor="private">Private</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className={`form-padding mb-4 upload-agenda ${this.state.docError ? "text-danger border border-danger" : ''}`}>
                    {this.state.document_path ? (
                      <div className="col-md-12 row">
                        {this.renderThumbnailFile()}
                      </div>
                    ) : (
                      <div>
                        <input
                          className="form-control bsUpload row"
                          id="uploadDocument"
                          type="file"
                          onChange={this.selectUploadDocument}
                        />
                        <button
                          className="btn  small-font-size font-style py-2"
                          onClick={this.handleUploadDocument}
                        >
                          <BsUpload />
                          <span className="mx-3">Upload Document <span className="asterik">*</span></span>
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
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta">
                    Save
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

export default observer(Resources);
