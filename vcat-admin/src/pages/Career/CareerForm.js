import React from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsTrashFill, BsUpload } from "react-icons/bs";
import ReactQuill from "react-quill";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";

// CSS  imports //
import "@pathofdev/react-tag-input/build/index.css";
import logo from "../../components/img/logo.png";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-quill/dist/quill.snow.css";

// Common file imports //
import { CheckDob, CheckMessage } from "../../common/Validation";
import AppConfig from "../../modals/AppConfig";
import { uploadMedia } from "../../common/uploadFile";
import User from "../../modals/User";

// Api file imports //
import {
  careerAutoPopulate,
  careerForm,
  updateCareer,
} from "../../libraries/careerDashboard";
import { observer } from "mobx-react";
import {
  JobTypeList,
  SalaryRangeList,
  SalaryTypeList,
} from "../../common/Lists";
import { Calendar } from "primereact/calendar";

// Components imports //

const animatedComponents = makeAnimated();

class CareerForm extends React.Component {
  state = {
    status: false,
    jobTitle: "",
    CompName: "",
    selectJobType: [],
    selectSalaryRange: [],
    selectHourly: [],
    ToDate: "",
    description: "",
    requirements: "",
    aboutCompany: "",
    location: "",
    image: "",
    j: [],
    careers: [],
    tags: [],
    selectedHourly: "",
    selectedJT: "",
    selectedRange: "",
    created_by: null,
  };

  componentDidMount() {
  }

  async componentDidUpdate(prevProps) {
    const id = this.props.editProjectId;
    console.log("career edit id", id);
    if (id !== undefined && id !== null && this.props.status !== prevProps.status && id && this.props.status) {
      this.setState({ status: this.props.status });
      const response = await careerAutoPopulate(id);

      if (response && response.status === "success") {
        let result = response.result.carriers;
        let CareerResult = response.result.carriers;

        const wings = [];
        if (JobTypeList && JobTypeList.length > 0) {
          for (let i = 0; i < JobTypeList.length; i++) {
            if (JobTypeList[i]["label"] === CareerResult.job_type) {
              wings.push(JobTypeList[i]);
            }
          }
        }

        const HourType = [];
        if (SalaryTypeList && SalaryTypeList.length > 0) {
          for (let i = 0; i < SalaryTypeList.length; i++) {
            if (SalaryTypeList[i]["label"] === CareerResult.salary_type) {
              HourType.push(SalaryTypeList[i]);
              break;
            }
          }
        }

        const SalaryType = [];
        if (SalaryRangeList && SalaryRangeList.length > 0) {
          for (let i = 0; i < SalaryRangeList.length; i++) {
            if (SalaryRangeList[i]["label"] === CareerResult.salary) {
              SalaryType.push(SalaryRangeList[i]);
              break;
            }
          }
        }
        const Tags = JSON.parse(CareerResult["tags"]);
        console.log("Tags", Tags);
        const message = [];
        // if (!Tags) {
        //   message = [];
        // }
        this.setState({
          jobTitle: result?.job_title,
          CompName: result?.company_name,
          selectJobType: wings[0],
          selectSalaryRange: SalaryType[0],
          ToDate: moment(result.updated_at).format("yyyy-MM-DD"),
          selectHourly: HourType[0],
          location: result?.location,
          description: result?.job_description,
          requirements: result?.requirements,
          aboutCompany: result?.about_company,
          tags: Tags ? Tags : message,
          image: result?.image,
          created_by: result?.created_by,
        });
      }
    }
  }

  handleClick = (e) => {
    this.setState({
      status: true,
    });
  };

  handleChangeD = (value) => {
    this.setState({
      description: value,
    });
  };

  handleChangeR = (value) => {
    this.setState({
      requirements: value,
    });
  };

  handleChangeA = (value) => {
    this.setState({
      aboutCompany: value,
    });
  };

  handleTags = (value) => {
    this.setState({
      tag: value,
    });
  };

  onSelectTags = (tags) => {
    this.setState({ tags: tags });
  };

  onSelectHourly = (hourly) => {
    this.setState({ selectHourly: hourly, selectHourlyError: "" });
  };

  onSelectSalaryRange = (selectedRange) => {
    this.setState({
      selectSalaryRange: selectedRange,
      selectSalaryRangeError: "",
    });
  };

  onSelectJobType = (selectedJobType) => {
    this.setState({ selectJobType: selectedJobType, selectJobTypeError: "" });
  };

  handleClose = () => {
    this.setState(
      {
        jobTitle: "",
        CompName: "",
        selectJobType: [],
        selectSalaryRange: [],
        selectHourly: [],
        ToDate: "",
        description: "",
        requirements: "",
        aboutCompany: "",
        location: "",
        image: "",
        j: [],
        tags: [],
        jobTitleError: "",
        selectJobTypeError: "",
        selectSalaryRangeError: "",
        selectHourlyError: "",
        locationError: "",
        descriptionError: "",
        ToDateError: "",
        requirementsError: "",
        aboutCompanyError: "",
        TagError: "",
        CompNameError: "",
        created_by: null,
      },
      () => this.props.closeModel(false)
    );
  };

  selectUploadImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    const mediaType = e.target.files[0].type;
    this.setState({ mediaType: mediaType });
    uploadMedia(image, this.callBackImage);
  };

  callBackImage = (response = false) => {
    if (response && response.status === "success") {
      this.setState(
        {
          image: response.result.url,
          mediaName: response.result.mediaName,
        },
        () => { }
      );
    }
  };

  handleUploadImage = (e) => {
    e.preventDefault();
    const fileSelectorAgenda = document.getElementById("uploadImage");
    fileSelectorAgenda.click();
  };

  renderThumbnailImage = () => <div
    className="d-flex my-3"
    style={{
      justifyContent: "space-between",
      alignItems: "center",
      height: "15rem",
      overflow: "auto",
    }}
  >
    <div className="col-md-10 ">
      <div className="thumbnail-image">
        {this.state.image ? (
          <img
            src={this.state.image}
            alt="project"
            style={{ width: "100%", height: "auto", borderRadius: "unset" }}
          />
        ) : null}
      </div>
    </div>
    <div className="col-md-2">
      <BsTrashFill
        className="theme-font-color big-font-size m-2 pointer"
        style={{ width: "1.5rem", height: "1.5rem" }}
        onClick={() => this.setState({ image: "" })}
      />
    </div>
  </div>;

  validateJobTitle = () => {
    const jobTitleError = CheckMessage(this.state.jobTitle);
    if (jobTitleError === 1) {
      this.setState({ jobTitleError: "Field empty" });
      return false;
    } else return true;
  };

  validateCompName = () => {
    const CompNameError = CheckMessage(this.state.CompName);
    if (CompNameError === 1) {
      this.setState({ CompNameError: "Field empty" });
      return false;
    } else return true;
  };

  validateJobType = () => {
    const check = JobTypeList.includes(this.state.selectJobType);
    this.setState({ selectJobTypeError: check ? "" : "Field empty" });
    return check;
  };

  validateSalaryRange = () => {
    const check = SalaryRangeList.includes(this.state.selectSalaryRange);
    this.setState({ selectSalaryRangeError: check ? "" : "Field empty" });
    return check;
  };

  validateHourly = () => {
    const check = SalaryTypeList.includes(this.state.selectHourly);
    this.setState({ selectHourlyError: check ? "" : "Field empty" });
    return check;
  };

  validateLocation = () => {
    const locationError = CheckMessage(this.state.location);
    if (locationError === 1) {
      this.setState({ locationError: "Field empty" });
      return false;
    } else return true;
  };

  validateDescription = () => {
    const descriptionError = CheckMessage(this.state.description);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  validateToDateError = () => {
    const ToDateError = CheckDob(this.state.ToDate);
    if (ToDateError === 1) {
      this.setState({ ToDateError: "Field empty" });
      return false;
    } else return true;
  };

  validateRequirements = () => {
    const requirementsError = CheckMessage(this.state.requirements);
    if (requirementsError === 1) {
      this.setState({ requirementsError: "Field empty" });
      return false;
    } else return true;
  };

  validateAbout = () => {
    const aboutCompanyError = CheckMessage(this.state.aboutCompany);
    if (aboutCompanyError === 1) {
      this.setState({ aboutCompanyError: "Field empty" });
      return false;
    } else return true;
  };

  validateTag = () => {
    const TagError = CheckMessage(this.state.tags);
    if (TagError === 1) {
      this.setState({ TagError: "Field empty" });
      return false;
    } else return true;
  };

  // Empty input validation
  ValidateAll = () => {
    const ToDateInput = this.validateToDateError();
    const jobTitleInput = this.validateJobTitle();
    // const tagInput = this.validateTag();
    const jobTypeInput = this.validateJobType();
    // const aboutInput =  this.validateAbout();
    const CompNameInput = this.validateCompName();
    // const DescriptionInput =  this.validateDescription();
    const LocationInput = this.validateLocation();
    const HourlyInput = this.validateHourly();
    const SalaryRangeInput = this.validateSalaryRange();
    // const RequirementsInput =  this.validateRequirements();
    const result = ToDateInput &&
      jobTitleInput &&
      jobTypeInput &&
      // aboutInput &&
      CompNameInput &&
      // DescriptionInput &&
      LocationInput &&
      HourlyInput &&
      SalaryRangeInput
      // RequirementsInput
      ;
    if (!result)
      AppConfig.showValidationError();
    return result;
  };

  // on submit sign in function
  onSubmitCreate = async (e) => {
    e.preventDefault();
    if (this.props?.saveAccess) {
      const id = this.props.editProjectId;
      if (this.props.password) {
        this.setState({ password: this.props.password });
      }
      const user_id = User.user_id;
      const allValidation = this.ValidateAll();
      if (allValidation) {
        const { selectSalaryRange, selectJobType, selectHourly } = this.state;
        const requestData = {
          job_title: this.state.jobTitle,
          company_name: this.state.CompName,
          job_type: selectJobType.label,
          salary: selectSalaryRange.label,
          // date_time: this.state.ToDate,
          date_time: this.state?.ToDate ? moment(this.state?.ToDate).format("YYYY-MM-DDTHH:mm") : null,
          salary_type: selectHourly.label,
          location: this.state.location,
          job_description: this.state.description || "<p><br></p>",
          requirements: this.state.requirements || "<p><br></p>",
          about_company: this.state.aboutCompany || "<p><br></p>",
          tags: this.state.tags,
          filePath: this.state.image,
          user_id: user_id,
        };
        if (id) {
          requestData["user_id"] = User.user_id;
          const response = await updateCareer(requestData, id);
          if (response && response.status === "success") {
            this.props.closeModel(false);
            User.setRefresh(true);
            this.handleClose();
            AppConfig.setMessage("Job updated successfully", false);
          } else if (response.status === "error") {
            this.props.closeModel(false);
            AppConfig.setMessage(response?.result);
          }
        } else {
          const response = await careerForm(requestData);
          if (response && response.status === "success") {
            AppConfig.setMessage("Job Post Created", false);
            this.props.closeModel();
            this.handleClose();
            User.setRefresh(true);
          } else if (response.status === "error") {
            this.props.closeModel(false);
            const result = response.result;
            let message = result;
            if (result[Object.keys(response.result)[0]]) {
              message = result[Object.keys(response.result)[0]];
            }
            AppConfig.setMessage(message);
          }
        }
        if (this.props?.afterSubmit) {
          await this.props?.afterSubmit();
        }
      }
      return false;
    }
  };

  render() {
    const { tags } = this.state;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 7);
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
                <h3 className="ml-2"> Career </h3>
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
                onSubmit={this.onSubmitCreate}
              >
                <div className="row mb-4 dflex jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Job Title <span className="asterik">*</span>
                      </label>
                      {this.state.jobTitleError ? (
                        <input
                          className="form-control validationError"
                          id="JTitle"
                          placeholder={this.state.jobTitleError}
                          type="text"
                          onFocus={() => {
                            this.setState({ jobTitleError: "" });
                          }}
                          value={this.state.jobTitle}
                          onChange={(e) =>
                            this.setState({ jobTitle: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="JTitle"
                          placeholder="Enter the Job Title"
                          type="text"
                          onFocus={() => {
                            this.setState({ jobTitleError: "" });
                          }}
                          value={this.state.jobTitle}
                          onChange={(e) =>
                            this.setState({ jobTitle: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-padding mb-3">
                      <label className="dflex align-center">
                        Company Name <span className="asterik">*</span>
                      </label>
                      {this.state.CompNameError ? (
                        <input
                          className="form-control validationError"
                          id="Cname"
                          onFocus={() => {
                            this.setState({ CompNameError: "" });
                          }}
                          placeholder={this.state.CompNameError}
                          type="text"
                          value={this.state.CompName}
                          onChange={(e) =>
                            this.setState({ CompName: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          className="form-control"
                          id="Cname"
                          placeholder="Enter the Company Name"
                          onFocus={() => {
                            this.setState({ CompNameError: "" });
                          }}
                          type="text"
                          value={this.state.CompName}
                          onChange={(e) =>
                            this.setState({ CompName: e.target.value })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mb-4 dflex jc-sb">
                  <div className="input-row mb-3">
                    <div className="select mb-3">
                      <label className="selectIcon dflex align-center">
                        Job Type <span className="asterik">*</span>
                      </label>
                      <Select
                        aria-label="Default select example"
                        placeholder={
                          this.state.selectJobTypeError
                            ? this.state.selectJobTypeError
                            : "Job Type"
                        }
                        type="drop"
                        onChange={this.onSelectJobType}
                        components={animatedComponents}
                        className={
                          this.state.selectJobTypeError
                            ? "validationError"
                            : null
                        }
                        closeMenuOnScroll={true}
                        options={JobTypeList}
                        value={this.state.selectJobType}
                      />
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="mb-3 ">
                      <label
                        className="selectIcon dflex align-center"
                        htmlFor="toDate"
                      >
                        Date <span className="asterik">*</span>
                      </label>
                      <Calendar
                        showIcon
                        autoComplete="off"
                        autoSave="off"
                        inputClassName={`form-control ${this.state.ToDateError ? "validationError" : ""}`}
                        placeholder={this.state?.ToDateError || "dd-mm-yyyy"}
                        className="w-100"
                        value={this.state?.ToDate ? new Date(this.state?.ToDate) : null}
                        onChange={({ value }) => this.setState({ ToDate: value })}
                        onFocus={() => this.setState({ ToDateError: "" })}
                        // minDate={(this.props.editProjectId !== undefined && this.props.editProjectId !== null) ? new Date() : null}
                        minDate={minDate}
                        appendTo="self"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                      {/* <input
                        className={`form-control ${this.state.ToDateError ? "validationError" : ""}`}
                        id="toDate"
                        placeholder={this.state.ToDateError || "Date & Time"}
                        onFocus={() => {
                          this.setState({ ToDateError: "" });
                        }}
                        type="date"
                        value={this.state.ToDate}
                        onChange={(e) =>
                          this.setState({ ToDate: e.target.value })
                        }
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="row mb-4 dflex jc-sb">
                  <div className="input-row mb-3">
                    <div className="form-floating select mb-3">
                      <label className="selectIcon dflex align-center">
                        Salary <span className="asterik">*</span>
                      </label>
                      {this.state.selectSalaryRangeError ? (
                        <Select
                          aria-label="Default select example"
                          placeholder={this.state.selectSalaryRangeError}
                          type="drop"
                          onChange={this.onSelectSalaryRange}
                          className="validationError"
                          closeMenuOnSelect={true}
                          components={animatedComponents}
                          options={SalaryRangeList}
                          value={this.state.selectSalaryRange}
                        />
                      ) : (
                        <Select
                          aria-label="Default select example"
                          placeholder="Select the Salary Range"
                          type="drop"
                          onChange={this.onSelectSalaryRange}
                          closeMenuOnSelect={true}
                          components={animatedComponents}
                          options={SalaryRangeList}
                          value={this.state.selectSalaryRange}
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-row mb-3">
                    <div className="form-floating select mb-3">
                      <label className="selectIcon dflex align-center">
                        Salary Type <span className="asterik">*</span>
                      </label>
                      <Select
                        aria-label="Default select example"
                        placeholder={
                          this.state.selectHourlyError
                            ? this.state.selectHourlyError
                            : "Salary Type"
                        }
                        type="drop"
                        onChange={this.onSelectHourly}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        className={
                          this.state.selectHourlyError
                            ? "validationError"
                            : null
                        }
                        options={SalaryTypeList}
                        value={this.state.selectHourly}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center">
                      Location <span className="asterik">*</span>
                    </label>
                    {this.state.locationError ? (
                      <input
                        className="form-control validationError"
                        id="venue"
                        onFocus={() => {
                          this.setState({ locationError: "" });
                        }}
                        placeholder={this.state.locationError}
                        type="text"
                        value={this.state.location}
                        onChange={(e) =>
                          this.setState({ location: e.target.value })
                        }
                      />
                    ) : (
                      <input
                        className="form-control"
                        id="venue"
                        placeholder="Enter the Location"
                        type="text"
                        onFocus={() => {
                          this.setState({ locationError: "" });
                        }}
                        value={this.state.location}
                        onChange={(e) =>
                          this.setState({ location: e.target.value })
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <div className="form-padding mb-3">
                    <label className="dflex align-center">Job Tags </label>
                    <ReactTagInput
                      tags={tags}
                      placeholder="Type and press enter"
                      maxTags={10}
                      editable={true}
                      readOnly={false}
                      removeOnBackspace={true}
                      onChange={this.onSelectTags}
                      value={this.state.tags}
                    />
                  </div>

                  <div className="d-flex justify-content-start">
                    {this.state.TagError ? (
                      <span className="small-font-size text-danger">
                        {this.state.TagError}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="upload-section quill mb-3">
                  <div className="form-floating mb-3 upload-doc-strip">
                    <div className="form-control upload-doc-strip mb-4">
                      <h5>
                        Extra Question
                        <IoAddCircleOutline />
                      </h5>
                    </div>
                  </div>
                  <div className="mb-3 mt-2 pad-1r">
                    <label className="dflex align-center">
                      Job Description
                    </label>
                    <ReactQuill
                      value={this.state.description}
                      onChange={this.handleChangeD}
                      modules={this.modules}
                      formats={this.formats}
                      placeholder="Comments"
                      className="quill-content"
                    />
                  </div>
                  <div className="mb-3 mt-2 pad-1r">
                    <label className="dflex align-center">Requirements</label>
                    <ReactQuill
                      value={this.state.requirements}
                      onChange={this.handleChangeR}
                      modules={this.modules}
                      formats={this.formats}
                      placeholder="Comments"
                      className="quill-content"
                    />
                  </div>
                  <div className="mb-3 mt-2 pad-1r">
                    <label className="dflex align-center">About Company</label>
                    <ReactQuill
                      value={this.state.aboutCompany}
                      onChange={this.handleChangeA}
                      modules={this.modules}
                      formats={this.formats}
                      placeholder="Comments"
                      className="quill-content"
                    />
                  </div>
                  <div className="upload-section mb-4">
                    <div className="form-floating mb-3 upload-doc-strip">
                      <div className="form-control upload-doc-strip mb-4">
                        <h4>Company's Logo</h4>
                      </div>
                    </div>
                    <div className="upload-doc-div mb-4">
                      <div className="mb-4">
                        <div className="form-padding mb-4 upload-agenda">
                          {this.state.image ? (
                            <div className="col-md-12">
                              {this.renderThumbnailImage()}
                            </div>
                          ) : (
                            <div>
                              <input
                                className="form-control bsUpload "
                                id="uploadImage"
                                placeholder="Select Profile Image"
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                onChange={this.selectUploadImage}
                              />
                              <button
                                className="btn  small-font-size font-style py-2 my-2"
                                onClick={this.handleUploadImage}
                              >
                                <BsUpload />
                                <span className="mx-3">Upload Image </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(this.props?.saveAccess && String(this.state.created_by) === String(User.user_id)) || this.props?.deleteAccess ? <div className="cta-section">
                  <button
                    type="button"
                    className="btn  event-cta-trans"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn  event-cta">
                    {this.props.editProjectId ? "Update Job" : "Create Job"}
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

export default observer(CareerForm);
