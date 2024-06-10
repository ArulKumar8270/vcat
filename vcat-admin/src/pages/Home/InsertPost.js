// Imports order //

// Plugins //
import React from "react";
import { observer } from "mobx-react";
import { BsCardImage } from "react-icons/bs";
import { FcDocument } from "react-icons/fc";
import { GrArticle, GrYoutube } from "react-icons/gr";
// CSS  imports //
import profile from "../../components/img/profile.png";

// Common file imports //
import { Permissions, ApiPermissions } from "../../common/Permission";

// Api file imports //
import { dashboard } from "../../libraries/dashboard";

// Components imports //
import InsertArticle from "./InsertArticle";

class InsertPost extends React.Component {
  state = {
    userDetails: {},
    userPermissions: {},
    Permissions: [],
    LatestEvents: [],
    ApiPermissions: [],
    image: "",
    video: "",
    document: "",
    document_name: "",
    videoName: "",
    imageName: "",
    article: "",
    insertArticle: false,
    insertImage: false,
    insertVideo: false,
    insertDocument: false,
    PostContent: "",
  };

  async componentDidMount() {
    if (this.props.password)
      this.setState({ password: this.props.password });
    const response = await dashboard();
    const result = response?.result;
    if (response && response?.status === "success") {
      const userPermissions = [];
      for (let i in result?.userPermissions) {
        userPermissions.push(result?.userPermissions[i]?.name);
      }
      this.setState({
        userDetails: response?.result?.userDetails[0],
        userPermissions: userPermissions,
        Permissions: Permissions,
        ApiPermissions: ApiPermissions,
      });
    }
  }
  onInsertArticle = (e) => {
    this.setState({
      insertArticle: true,
      insertImage: false,
      insertVideo: false,
      insertDocument: false,
    });
  };
  onInsertImage = (e) => {
    this.setState({
      insertImage: true,
      insertArticle: false,
      insertVideo: false,
      insertDocument: false,
    });
  };
  onInsertVideo = (e) => {
    this.setState({
      insertVideo: true,
      insertArticle: false,
      insertImage: false,
      insertDocument: false,
    });
  };
  onInsertDocument = (e) => {
    this.setState({
      insertDocument: true,
      insertArticle: false,
      insertImage: false,
      insertVideo: false,
    });
  };
  render() {
    const { userDetails } = this.state;
    return (
      <>
        <div className="start-post px-2 pb-2">
          <div className="insert-post-main dflex align-center">
            <div className="user-image">
              <img src={userDetails?.image || profile} alt="userpostimage" />
            </div>
            <div className="insert-post">
              <div className="form-padding mb-3  mt-2">
                <input
                  tabIndex="2"
                  className="form-control"
                  label=""
                  placeholder="Start a post"
                  type="text"
                  style={{
                    height: "auto",
                    borderRadius: "60px",
                    verticalAlign: "middle",
                  }}
                  value={this.state.PostContent}
                  onChange={(e) =>
                    this.setState({ PostContent: e.target.value })
                  }
                  onClick={this.onInsertArticle}
                />
              </div>
            </div>
          </div>
          <div className="insert-post-actions mt-1">
            <div className="insert-post-action-svg event-svg dflex">
              <div className="form-padding  upload-agenda feed-upload">
                <div>
                  <input
                    className="form-control bsUpload "
                    id="uploadImage"
                    // label=""
                    // placeholder=""
                    type="file"
                    // value={this.state.selectAgenda}
                    onChange={this.selectUploadImage}
                  />
                  <button
                    className="btn dflex small-font-size align-center font-style py-2"
                    onClick={this.onInsertImage}
                  >
                    <BsCardImage style={{ fill: "#70B5F9" }} />
                    <p className="ml-1 mb-0">Photo</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="insert-post-action-svg video-svg dflex form-padding  upload-agenda feed-upload">
              <div>
                <input
                  className="form-control bsUpload "
                  id="uploadVideo"
                  // label=""
                  // placeholder=""
                  type="file"
                  // value={this.state.selectAgenda}
                  onChange={this.selectUploadVideo}
                />
                <button
                  className="btn dflex small-font-size font-style py-2 align-center"
                  onClick={this.onInsertVideo}
                >
                  <GrYoutube style={{ fill: "#7FC15E" }} />
                  <p className="ml-1 mb-0">Video</p>
                </button>
              </div>
            </div>
            <div className="insert-post-action-svg event-svg dflex form-padding  upload-agenda feed-upload">
              <div>
                <input
                  className="form-control bsUpload "
                  id="uploadAgendaFile"
                  // label=""
                  // placeholder=""
                  type="file"
                  // value={this.state.selectAgenda}
                  onChange={this.selectUploadAgendaFile}
                />
                <button
                  className="btn dflex small-font-size font-style py-2 align-center"
                  onClick={this.onInsertDocument}
                >
                  <FcDocument style={{ fill: "#70B5F9" }} />
                  <p className="ml-1 mb-0">Document</p>
                </button>
              </div>
            </div>
            <div className="insert-post-action-svg article-svg dflex form-padding  upload-agenda feed-upload">
              <div>
                <input
                  className="form-control bsUpload "
                  id="uploadAgendaFile"
                  // label=""
                  // placeholder=""
                  type="file"
                // value={this.state.selectAgenda}
                // onChange={this.selectUploadAgendaFile}
                />
                <button
                  className="btn dflex small-font-size font-style py-2 align-center"
                  onClick={this.onInsertArticle}
                >
                  <GrArticle style={{}} />
                  <p className="ml-1 mb-0">Start a Post</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <InsertArticle
          insertArticle={this.state.insertArticle}
          insertDocument={this.state.insertDocument}
          insertImage={this.state.insertImage}
          insertVideo={this.state.insertVideo}
          redirectModel={() =>
            this.setState({
              insertArticle: true,
              insertImage: false,
              insertVideo: false,
              insertDocument: false,
            })
          }
          closeModel={() =>
            this.setState({
              insertArticle: false,
              insertImage: false,
              insertVideo: false,
              insertDocument: false,
            })
          }
        />
      </>
    );
  }
}

export default observer(InsertPost);
