import { observer } from "mobx-react";
import React from "react";
import profile from "../components/img/profile.png";
import {
  HomeFeedLike,
  HomeFeedActivity,
  deleteFeed,
} from "../libraries/dashboard";
import { BiLike } from "react-icons/bi";
import moment from "moment";
import { GrChat, GrDocumentText, GrDocumentPdf } from "react-icons/gr";
import { BsThreeDotsVertical, BsArrowLeft } from "react-icons/bs";
import CommentInput from "./CommentInput";
import User from "../modals/User";
import AppConfig from "../modals/AppConfig";
import Popover from "react-bootstrap/Popover";

import { Comment } from "semantic-ui-react";
import InsertArticle from "../pages/Home/InsertArticle";
import ConfirmModal from "./ConfirmModal";
import Notifications from "../common/Notifications";
import { isEmpty } from "@firebase/util";

class DisplayFeed extends React.Component {
  state = {
    yourTextHere: "",
    minimumLength: 50,
    idealLength: 70,
    maxLength: 80,
    size: "",
    page: "",
    FeedData: [],
    show: false,
    CIshow: false,
    feedId: "",
    feedViewId: "",
    likeCount: "",
    like: 0,
    likeStatus: false,
    isShow: {},
    likeClickedStatus: false,
    insertArticle: false,
    onDelete: false,
    visible: false,
    path: "",
    isLikeShow: {},
    isCIShow: {},
    isLiked: {},
    isEmpty: false,
  };

  async componentDidMount() {
    if (this.props.password)
      this.setState({ password: this.props.password });
    this.DisplayFeed();
  }

  DisplayFeed = async () => {
    const requestData = {
      user_id: User.user_id,
      feed_id: Notifications?.feedViewId,
    };
    let empty = false;
    const ResponseActivity = await HomeFeedActivity(requestData);
    if (ResponseActivity && ResponseActivity.status === "success") {
      const result = ResponseActivity.result;
      if (isEmpty(result)) {
        empty = true;
      }
      this.setState(
        {
          isEmpty: empty,
          FeedData: result,
        },
        () => {
          const { FeedData, isShow, isLiked, isCIShow, isLikeShow } =
            this.state;
          for (let i = 0; i < FeedData.length; i++) {
            isShow[i] = false;
            isCIShow[i] = false;
            isLikeShow[i] = false;
            isLiked[i] = 0;
            this.setState({ isShow, isLiked, isCIShow, isLikeShow });
          }
        }
      );
    }
  };
  DisplayLikeApi = async () => {
    const requestData = {
      feed_id: this.state.feedId,
      liked_user: User.user_id,
      like: this.state.likeStatus,
    };
    const ResponseEvents = await HomeFeedLike(requestData);
    if (ResponseEvents && ResponseEvents.status === "success") {
      this.DisplayFeed();
    } else {
      this.DisplayFeed();
    }
  };
  refreshPage() {
    window.location.reload(false);
  }
  renderPopOver() {
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
      <strong>Holy guacamole!</strong> Check this info.
    </Popover>;
  }
  renderStartPost() {
    if (AppConfig.refresh) {
      this.DisplayFeed();
      AppConfig.setRefresh(false);
    }
    const { FeedData, isShow, isLiked, isCIShow, isLikeShow } = this.state;
    return FeedData !== [] &&
      FeedData.length > 0 &&
      FeedData.map((feed, i) => {
        const index = i;
        return (
          <div
            className="start-post mt-0 display-post-main t-l"
            key={Number(i)}
            onClick={(e) => {
              this.setState({ feedViewId: feed.id });
            }}
          >
            {feed.id ? (
              <>
                {feed.feed_users &&
                  feed.feed_users.map((user, j) => {
                    return (
                      <div className="insert-post-main" key={Number(j)}>
                        <div className="dflex align-center jc-sb">
                          <div className="dflex align-center" key={j}>
                            <div className="user-image ml-0 mt-0">
                              <img
                                src={user.image || profile}
                                alt="MemberImage"
                              />
                            </div>
                            <div className="display-post">
                              <h6>
                                {user.name ? user.name : "User Name"}
                              </h6>
                            </div>
                          </div>
                          {user.id === User.user_id ||
                            Notifications.UserRole === "1" ? (
                            <div className="btn-group user-button-grp">
                              <button
                                type="button"
                                className="btn-shadow user-button p-1 btn btn-sm p-0 btn"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                <BsThreeDotsVertical />
                              </button>
                              <div
                                tabIndex="-1"
                                role="menu"
                                aria-hidden="true"
                                className="dropdown-menu dropdown-menu-right"
                              >
                                <div className="settings">
                                  <button
                                   
                                    onClick={() => {
                                      this.setState({
                                        insertArticle: true,
                                        feedViewId: feed.id,
                                      });
                                    }}
                                  >
                                    Update Post
                                  </button>
                                </div>
                                <div className="settings">
                                  <button
                                   
                                    onClick={() => {
                                      this.deleteFeed({
                                        feedViewId: feed.id,
                                      });
                                    }}
                                  >
                                    Delete Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                <InsertArticle
                  insertArticle={this.state.insertArticle}
                  onDelete={this.state.onDelete}
                  FeedId={this.state.feedViewId}
                  closeModel={() =>
                    this.setState({ insertArticle: false })
                  }
                />
                <ConfirmModal
                  delete={true}
                  visible={this.state.visible}
                  heading="Delete Post"
                  title="Are you sure you want to delete the post?"
                  confirm={() => this.getSuccess()}
                  handleClose={() => this.setState({ visible: false })}
                />
                {this.renderPopOver()}

                {feed.discription ? (
                  <div className="read-more-div text t-l font">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: feed.discription,
                      }}
                    >
                    </p>
                  </div>
                ) : null}
                {feed.feed_paths ? (
                  <div>
                    {feed.feed_paths.split(".").pop() === "jpg" ||
                      feed.feed_paths.split(".").pop() === "png" ||
                      feed.feed_paths.split(".").pop() === "gif" ||
                      feed.feed_paths.split(".").pop() === "jpeg" ? (
                      <div className="insert-post-main dflex align-center mt-4">
                        <div
                         
                          style={{ width: "100%", height: "auto" }}
                        >
                          <img
                            src={feed.feed_paths}
                            style={{ width: "100%", height: "auto" }}
                            alt="postImage"
                          />
                        </div>
                      </div>
                    ) : null}
                    {feed.feed_paths.split(".").pop() === "mp4" &&
                      feed.feed_paths !== null ? (
                      <div className="insert-post-main dflex align-center mt-4">
                        <div style={{ width: "100%" }}>
                          <video width="100%" height="auto" controls>
                            <source
                              src={feed.feed_paths}
                              type="video/mp4"
                            />
                            <source
                              src={feed.feed_paths}
                              type="video/ogg"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    ) : null}
                    {feed.feed_paths !== null ? (
                      <>
                        {feed.feed_paths.split(".").pop() === "pdf" ||
                          feed.feed_paths.split(".").pop() === "csv" ||
                          feed.feed_paths.split(".").pop() === "txt" ? (
                          <div className="insert-post-main dflex align-center mt-4">
                            <div className="thumbnail-image mb-3 doc-icon-pdf">
                              <a
                                href={feed.feed_paths}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <GrDocumentPdf
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    cursor: "pointer",
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                        ) : null ||
                          feed.feed_paths.split(".").pop() === "doc" ||
                          feed.feed_paths.split(".").pop() === "docx" ? (
                          <div className="insert-post-main dflex align-center mt-4">
                            <div className="thumbnail-image mb-3  doc-icon-txt">
                              <a
                                href={feed.feed_paths}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <GrDocumentText
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    cursor: "pointer",
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
                <div className="dflex mt-2 jc-sb">
                  <div className="dflex">
                    <div className="insert-post-action-svg event-svg pos-rel dflex feed-like">
                      <BiLike
                        style={{ transform: "rotateY(180deg)" }}
                       
                      />
                    </div>
                    <div className="insert-post-action-svg dflex ml-3">
                      <p className="mb-0 " style={{ fontSize: "0.9rem" }}>
                        {feed.like_count}
                        <span className="ml-1"></span>
                      </p>
                    </div>
                  </div>
                  <div className="dflex">
                    <div className="insert-post-action-svg dflex align-center">
                      <button
                        className="mb-0 no-style"
                        onClick={(e, index) => {
                          isShow[i] = true;
                          this.setState({ isShow });
                        }}
                      >
                        {feed.get_comments.length} comments
                      </button>
                    </div>
                  </div>
                </div>
                <div className="insert-post-actions mt-2  pt-2 pos-rel">
                  <div className="insert-post-action-svg event-svg tc">
                    <button
                      className="no-style no-hover tc"
                      onClick={(likeCount, index) => {
                        isLiked[i] = 1;
                        isLikeShow[i] = true;
                        this.setState(
                          {
                            likeCount: parseInt(likeCount) + 1,
                            likeStatus: true,
                            feedId: feed.id,
                            likeClickedStatus: true,
                            isLiked,
                            isLikeShow,
                          },
                          () => this.DisplayLikeApi()
                        );
                      }}
                      style={{ padding: "0rem 0rem" }}
                    >
                      {this.state.isLikeShow[index] ||
                        feed?.get_likes[0]?.feed_name === "Liked" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          id="like-creation-medium"
                          data-supported-dps="24x24"
                        >
                          <g>
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              d="M12.69 9.5H5.06a1.8 1.8 0 00-1.56 2A1.62 1.62 0 005.15 13h.29a1.38 1.38 0 00-1.34 1.39 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.35a1.45 1.45 0 00-.15 1 1.51 1.51 0 001.51 1.12h4.08a6.3 6.3 0 001.56-.2l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.42 11.85 3 11 3a1.38 1.38 0 00-1.21 1.45c0 .25.13 1.12.18 1.43a10.6 10.6 0 001.76 3.62"
                              fill="#378fe9"
                              fill-rule="evenodd"
                            />
                            <path
                              d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                              fill="none"
                              stroke="#004182"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                        </svg>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            id="like-creation-medium"
                            data-supported-dps="24x24"
                          >
                            <g>
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path
                                d="M12.69 9.5H5.06a1.8 1.8 0 00-1.56 2A1.62 1.62 0 005.15 13h.29a1.38 1.38 0 00-1.34 1.39 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.35a1.45 1.45 0 00-.15 1 1.51 1.51 0 001.51 1.12h4.08a6.3 6.3 0 001.56-.2l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.42 11.85 3 11 3a1.38 1.38 0 00-1.21 1.45c0 .25.13 1.12.18 1.43a10.6 10.6 0 001.76 3.62"
                                fill="#fff"
                                fill-rule="evenodd"
                              />
                              <path
                                d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                                fill="none"
                                stroke="#000"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                          </svg>
                        </>
                      )}
                      <p className="my-0">Like </p>
                    </button>
                  </div>
                  <div className="insert-post-action-svg event-svg tc ">
                    <button
                      className="no-style no-hover tc"
                      style={{ padding: "0rem 0rem" }}
                      onClick={(e) => {
                        isCIShow[i] = true;
                        this.setState({
                          CIshow: true,
                          feedId: feed.id,
                          isCIShow,
                        });
                      }}
                    >
                      <GrChat style={{ fill: "#1F1F1F" }} />
                      <p className="my-0">Comment</p>
                    </button>
                  </div>
                </div>
                <CommentInput
                  CIshow={this.props.CIshow}
                  feedId={this.state.feedViewId}
                />
                <div className="comment-section-div t-l">
                  <Comment.Group>
                    {feed.get_comments.length > 0 &&
                      feed.get_comments.map((comment, j) => {
                        const time = feed.created_at;
                        const timeNow = moment(time).fromNow();
                        return (
                          <div className="mb-3 mt-3" key={Number(j)}>
                            <Comment
                              key={j}
                              className="dflex display-comments"
                            >
                              <Comment.Avatar
                                className="mr-1"
                                src={comment.image}
                                alt="commenter-image"
                              />
                              <Comment.Content className="col-10">
                                <div className="comment-content">
                                  <div
                                    className="dflex jc-sb"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    <Comment.Author as="a">
                                      {comment.name
                                        ? comment.name
                                        : "User"}
                                    </Comment.Author>
                                    <Comment.Metadata>
                                      {timeNow}
                                    </Comment.Metadata>
                                  </div>
                                  <div>
                                    {/* <Comment.Author>{comment.name}</Comment.Author> */}
                                    <Comment.Text>
                                      {comment.comment}
                                    </Comment.Text>
                                  </div>
                                </div>
                              </Comment.Content>
                            </Comment>
                          </div>
                        );
                      })}
                  </Comment.Group>
                </div>
              </>
            ) : (
              <>
                <div className="insert-post-main">
                  <p>Post was deleted</p>
                </div>
              </>
            )}
          </div>
        );
      });
  }
  deleteFeed = (id) => this.setState({ visible: true, deleteId: id });
  getSuccess = () => {
    const id = this.state.feedViewId;
    deleteFeed(id).then((response) => {
      if (response && response.status === "success") {
        this.setState({ visible: false });
        this.props.props.history.push("/home");
        User.setRefresh();
        this.DisplayFeed();
        AppConfig.setMessage(response.result, false);
      }
    });
  };
  
  render() {
    return (
      <>
        {this.props.props.path === "/notifications" ? null : (
          <div className="t-l">
            <div className="back-event">
              <button onClick={() => this.props.props.history.goBack()}>
                <h6 className="mb-0" style={{ color: "rgb(70 78 184)" }}>
                  <BsArrowLeft />
                </h6>
              </button>
            </div>
          </div>
        )}
        {this.state.isEmpty ? (
          <div
            className="start-post mt-0 display-post-main t-l dflex align-center"
            style={{ height: "15rem", justifyContent: "center" }}
          >
            <div className="insert-post-main">
              <p>This post is no longer available.</p>
            </div>
          </div>
        ) : (
          this.renderStartPost()
        )}
      </>
    );
  }
}
export default observer(DisplayFeed);
