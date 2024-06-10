// Imports order //

// Plugins //
import React from "react";
import "date-fns";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsUpload } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { observer } from "mobx-react";

// CSS  imports //
import "./ContentDashboard.css";

// Common file imports //
import AppConfig from "../../modals/AppConfig";
import User from "../../modals/User";
import { uploadFile } from "../../common/uploadFile";
import {
  CheckMessage,
  CheckUserName,
  DropDownCheck,
} from "../../common/Validation";

// Api file imports //
import {
  BannerContentInsert,
  BannerContentUpdate,
  contentBanner,
  contentPage,
  contentType,
  PageContentInsert,
  PageContentUpdate,
} from "../../libraries/Content";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import { checkPermission } from "../../common/Common";

// Components imports //

const animatedComponents = makeAnimated();

class ContentDashboard extends React.Component {
  state = {
    status: false,
    OnClickClear: false,
    selectFilterOption: [],
    CreateList: [],
    PageList: [],
    SelectedPageInfo: [],
    PreviewInfo: {},
    title: "",
    content: "",
    image: "",
    content_type: "",
    SelectPage: [],
    Type: [],
    pageId: "",
    StatusList: [
      {
        value: 1,
        label: "banner_content",
      },
      {
        value: 2,
        label: "page_content",
      },
    ],
    OnClear: false,
    onPreview: false,
    // 
    writeAccess: checkPermission("WRITE_CONTENT"),
  };

  componentDidMount = () => {
    AppLayoutConfig.setShowLayout(true);
    AppLayoutConfig.setShowHeader(true);
    AppLayoutConfig.setShowSidebar(true);
    AppLayoutConfig.setShowFooter(true);
    AppLayoutConfig.setShowSideCalendar(true);
    AppLayoutConfig.setShowChat(true);
  };

  onSelectFilter = async (selectedFilter) => {
    this.setState({ selectFilterOption: selectedFilter });
  };

  async callApiPageType() {
    if (this.state.Type) {
      const requestData = {
        content_type: this.state.Type?.label,
      };
      const response = await contentType(requestData);
      if (response && response.status === "success") {
        const Result = response.result;
        const Pages = Result.pages_dropdown;
        const PageLists = [];
        for (let i in Pages) {
          let PageId = {
            value: Pages[i].id,
            label: Pages[i].page,
          };
          PageLists.push(PageId);
        }
        this.setState({
          PageList: PageLists,
        });
      }
    }
  }

  async callApiPageInfo() {
    if (this.state.SelectPage) {
      const pageId = this.state.SelectPage?.value;
      let response;
      if (this.state.Type.label === "banner_content") {
        response = await contentBanner(pageId)
      } else if (this.state.Type.label === "page_content") {
        response = await contentPage(pageId);
      }
      if (response && response.status === "success") {
        const { result } = response;
        if (result) {
          let prop = "pages";
          if (this.state.Type.label === "banner_content") {
            prop = "banners";
          }
          if (result[prop]) {
            this.setState({
              SelectedPageInfo: result[prop],
              pageId,
              title: result[prop]?.title,
              content: result[prop]?.content,
              image: result[prop]?.image,
              // 
              titleError: "",
              descriptionError:"",
              TypeError:"",
              SelectPageError:"",
            });
          }
        }
      }
    }
  }

  onPreview = async () => {
    const { pageId } = this.state;
    let response;
    if (this.state.Type.label === "banner_content") {
      response = await contentBanner(pageId)
    } else if (this.state.Type.label === "page_content") {
      response = await contentPage(pageId);
    }
    if (response && response.status === "success") {
      const { result } = response;
      if (result) {
        let prop = "pages";
        if (this.state?.Type.label === "banner_content") {
          prop = "banners";
        }
        this.setState({
          PreviewInfo: result[prop],
          onPreview: true,
          OnClickClear: false,
        });
      }
    }
    return false;
  };

  renderClearForm() {
    let { OnClear } = this.state;
    let openTextStatus = OnClear === false ? true : false;
    OnClear = openTextStatus;
    return (
      <>
        {openTextStatus ? (
          <div className="content-1 col-5">
            <div className="content content-main-details screen-2">
              <div className="mb-4">Preview Screen</div>
              <div className="mb-4">
                <p>No Content</p>
              </div>
            </div>
          </div>
        ) : (
          this.renderFormDetails()
        )}
      </>
    );
  }

  renderFormDetails = () => {
    const { PreviewInfo, OnClickClear } = this.state;
    return (
      <>
        {!OnClickClear ? (
          <div className="content-1">
            <div className="content content-main-details screen-2 pb-2">
              <div className="mb-3">Preview Screen</div>
              <div className="mb-3 mt-3">
                <h3>{PreviewInfo.title}</h3>
              </div>
              <div className="mb-3">
                <p
                  dangerouslySetInnerHTML={{ __html: PreviewInfo.content }}
                  className="mb-0 t-l fontPop blck"
                ></p>
              </div>
              <div
                className="Pageinfo-img mb-2"
                style={{ width: "400px", borderRadius: "25px" }}
              >
                <img
                  src={PreviewInfo.image}
                  alt=""
                  style={{ width: "400px", borderRadius: "25px" }}
                />
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="btn font_bold_500 event-cta-trans"
                  onClick={this.onClearForm}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="content-1 col-6">
            <div
              className="content content-main-details screen-2 pb-2"
              style={{ height: "6rem" }}
            >
              <div className="mb-1 px-3 dflex align-center">
                <p>Preview Screen</p>
              </div>
              <div className="mb-2 ml-3 dflex align-center">
                <p>No Info</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  renderForm() {
    const { StatusList, PageList } = this.state;
    return (
      <>
        <div>
          <form className="align-items-center event-form py-2" style={{
            padding: "15px",
            backgroundColor: "white",
            borderRadius: "1rem"
          }} autoComplete="off" autoSave="off">
            <div className="mb-2">
              <div className="mb-2 select">
                <label>
                  Content type <span className="asterik">*</span>
                </label>
                <Select
                  aria-label="Default select example"
                  placeholder="Select the Content type"
                  type="drop"
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  isClearable
                  options={StatusList}
                  value={this.state.Type}
                  onFocus={() => this.setState({ TypeError: "" })}
                  onChange={(e) =>
                    this.setState({ Type: e, TypeError: "" }, async () => {
                      // if (this.state.Type === "banner_content") {

                      // }
                      // if (this.state.Type === "page_content") {
                      await this.callApiPageType();
                      // }
                    })
                  }
                  className={this.state.TypeError ? "validationError" : null}
                />
              </div>
              <div className="d-flex justify-content-start">
                {this.state.TypeError ? (
                  <span className="small-font-size text-danger">
                    {this.state.TypeError}
                  </span>
                ) : <></>}
              </div>
            </div>
            <div className="mb-2">
              <div className="input-row mb-2">
                <label>
                  Page <span className="asterik">*</span>
                </label>
                <Select
                  aria-label="Default select example"
                  placeholder="Select Page "
                  type="drop"
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  onFocus={() => this.setState({ SelectPageError: "" })}
                  onChange={(e) =>
                    this.setState(
                      { SelectPage: e, SelectPageError: "" },
                      async () => {
                        await this.callApiPageInfo();
                      }
                    )
                  }
                  options={PageList}
                  isClearable
                  value={this.state.SelectPage}
                  className={
                    this.state.SelectPageError ? "validationError" : null
                  }
                />
                <div className="d-flex justify-content-start">
                  {this.state.SelectPageError ? (
                    <span className="small-font-size text-danger">
                      {this.state.SelectPageError}
                    </span>
                  ) : <></>}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="input-row mb-2">
                <div className="form-padding mb-2">
                  <label>
                    Title <span className="asterik">*</span>
                  </label>
                  <input
                    // tabIndex="1"
                    type="text"
                    className={`form-control ${this.state.titleError ? "validationError" : ""
                      }`}
                    id="personName"
                    placeholder={
                      this.state.titleError
                        ? this.state.titleError
                        : "Enter the Title"
                    }
                    value={this.state.title}
                    onFocus={() => this.setState({ titleError: "" })}
                    onChange={(e) =>
                      this.setState({ title: e.target.value })
                    }
                  />
                </div>
                {/* <div className="d-flex justify-content-start">
                  {this.state.titleError ? (
                    <span className="small-font-size text-danger">
                      {this.state.titleError}
                    </span>
                  ) : (
                    ""
                  )}
                </div> */}
              </div>
            </div>
            <div className="mb-2">
              <div className="input-row">
                <div className="mb-2">
                  <div className="form-padding mb-2">
                    <label>
                      Description <span className="asterik">*</span>
                    </label>
                    <textarea
                      // tabIndex="2"
                      className={`form-control content-description ${this.state.descriptionError ? "validationError" : ""
                        }`}
                      label=""
                      placeholder={
                        this.state.descriptionError
                          ? this.state.descriptionError
                          : "Description"
                      }
                      type="textarea"
                      style={{ height: "150px" }}
                      value={this.state.content}
                      onFocus={() => this.setState({ descriptionError: "" })}
                      onChange={(e) =>
                        this.setState({
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="d-flex justify-content-start">
                    {this.state.descriptionError ? (
                      <span className="small-font-size text-danger">
                        {this.state.descriptionError}
                      </span>
                    ) : (
                      ""
                    )}
                  </div> */}
                </div>
              </div>
            </div>
            {this.state.Type && this.state.Type.label === "banner_content" ?
              <div className="mb-2">
                <div className="form-padding mb-2 ">
                  {!this.state.image ? (
                    <div className="row">
                      <div className="col-12">
                        <div className="upload-agenda mb-1 mt-1">
                          <input
                            className="form-control bsUpload "
                            id="Image"
                            label="Date"
                            placeholder=""
                            type="file"
                            value={this.state.image}
                            onChange={this.selectUploadImage}
                          />
                          <button
                            className="btn  small-font-size font-style py-2"
                            onClick={this.handleUploadImage}
                          >
                            <BsUpload />
                            <span className="mx-3">Upload Image </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-12">{this.renderThumbnailImage()}</div>
                  )}
                </div>
              </div> : null}

            <div className="cta-section jc-sb">
              <div>
                <button
                  type="button"
                  className="btn font_bold_500 event-cta-trans"
                  onClick={this.onPreview}
                >
                  Preview
                </button>
              </div>
              {this.state?.writeAccess ? <button
                type="submit"
                className="btn font_bold_500 event-cta"
                onClick={this.onSubmitCreate}
              >
                Save
              </button> : null}
            </div>
          </form>
        </div>
      </>
    );
  }

  onClearForm = () => {
    this.setState({
      OnClickClear: true,
      OnClear: true,
      image: "",
      content: "",
      title: "",
      Type: [],
      SelectPage: [],
      PreviewInfo: {},
    });
  };

  // Validation for username
  validateTitle = () => {
    const titleError = CheckUserName(this.state.title);
    if (titleError === 1) {
      this.setState({ titleError: "Field empty" });
      return false;
    } else return true;
  };

  validateContent = () => {
    const descriptionError = CheckMessage(this.state.content);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  validateType = () => {
    const TypeError = DropDownCheck(this.state.Type);
    if (TypeError === 1) {
      this.setState({ TypeError: "Field empty" });
      return false;
    } else return true;
  };

  validateSelectPage = () => {
    const SelectPageError = DropDownCheck(this.state.SelectPage);
    if (SelectPageError === 1) {
      this.setState({ SelectPageError: "Field empty" });
      return false;
    } else return true;
  };

  // // Empty input validation
  ValidateAll = () => {
    const typeInput = this.validateType();
    const titleInput = this.validateTitle();
    const contentInput = this.validateContent();
    const selectPageInput = this.validateSelectPage();

    const result = typeInput && titleInput && contentInput && selectPageInput;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  renderThumbnailImage = () => {
    return (
      <div
        className="d-flex my-3"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="col-md-3">
          <div className="thumbnail-image">
            {this.state.image === null || this.state.image === "" ? (
              <img
                src={this.state.PreviewInfo.image}
                alt="project"
                style={{
                  width: "100px",
                  height: "auto",
                  borderRadius: "unset",
                  cursor: "pointer",
                }}
              />
            ) : (
              <img
                src={this.state.image}
                alt="project"
                style={{
                  width: "100px",
                  height: "auto",
                  borderRadius: "unset",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>
        <div className="col-md-2">
          <MdDelete
            className="theme-font-color big-font-size m-2 pointer"
            onClick={() => this.setState({ image: "" })}
            style={{
              width: "30px",
              height: "auto",
              borderRadius: "unset",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    );
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const fileSelector = document.getElementById("Image");
    fileSelector.click();
  };

  // Select file selectUploadImage
  selectUploadImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    uploadFile(image, this.callBackEventImage);
  };

  callBackEventImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState({ image: response.result.url });
    }
  };

  refreshPage() {
    window.location.reload(false);
  }

  onSubmitCreate = async (e) => {
    e?.preventDefault();
    if (this.state?.writeAccess) {
      const user_id = User.user_id;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const requestData = {
          page: this.state.SelectedPageInfo.page,
          title: this.state.title,
          content: this.state.content,
          image: this.state.image,
          option_1: this.state.image,
          option_2: this.state.Type.label,
          status: true,
          title_limit: 2,
          content_limit: 4,
          user_id: user_id,
          modified_by: user_id,
        };
        const page_id = this.state.SelectPage.value;
        let response;
        if (page_id) {
          if (this.state.Type.label === "banner_content") {
            response = await BannerContentUpdate(requestData, page_id);
          } else if (this.state.Type.label === "page_content") {
            response = await PageContentUpdate(requestData, page_id);
          }
        } else {
          requestData["page"] = this.state.SelectedPageInfo[0].page;
          requestData["user_id"] = user_id;
          if (this.state.Type.label === "banner_content") {
            response = await BannerContentInsert(requestData);
          }
          else if (this.state.Type.label === "page_content") {
            response = await PageContentInsert(requestData);
          }
        }
        if (response && response.status === "success") {
          AppConfig.setMessage("Changes updated successfully", false);
          this.onClearForm();
        } else if (response.status === "error") {
          AppConfig.setMessage(response?.result);
        }
      }
      return false;
    }
  };

  render() {
    const { PreviewInfo } = this.state;
    return (
      <div className="app-main__outer">
        <div className="back-event mb-3">
          <button onClick={() => this.props.history.goBack()}>
            <BsArrowLeftShort /> CONTENT MANAGEMENT
          </button>
        </div>
        <div className="d-flex flex-column flex-md-row view-screen">
          <div className="content-1 col-md-6 col-12 screen-1 mb-4">
            <div className="content content-main-form ">
              {this.renderForm()}
            </div>
          </div>
          {PreviewInfo.id ? <>{this.renderFormDetails()}</> : null}
        </div>
      </div>
    );
  }
}
export default observer(ContentDashboard);
