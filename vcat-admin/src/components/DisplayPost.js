import { observer } from "mobx-react";
import React from "react";
import profile from "../components/img/profile.png";
import {
  HomeFeed,
  HomeFeedLike,
  HomeCommentInsert,
  getUsersDropdown,
} from "../libraries/dashboard";
import { BiLike } from "react-icons/bi";
import { BsBoxArrowUpRight } from "react-icons/bs";
import moment from "moment";
import { GrChat, GrDocumentText, GrDocumentPdf } from "react-icons/gr";
import User from "../modals/User";
import AppConfig from "../modals/AppConfig";
import { Comment } from "semantic-ui-react";
// import { HomeFeed, dashboard, HomeCommentInsert } from '../libraries/dashboard'
import { CheckMessage } from "../common/Validation";
import Notifications from "../common/Notifications";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { getLikesText } from "../common/Common";

import logo from "../components/img/logo.png";
import Modal from "react-bootstrap/Modal";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CommonTable } from "../common/CommonElements";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { createRef } from "react";

class DisplayPost extends React.Component {
  usersFilterInputRef = createRef();
  state = {
    yourTextHere: " ",
    minimumLength: 10,
    idealLength: 40,
    maxLength: 50,
    size: 50,
    page: 1,
    FeedData: [],
    show: false,
    CIshow: false,
    feedId: "",
    feedViewId: "",
    likeCount: "",
    like: 0,
    likeStatus: false,
    isShow: {},
    isTextShow: {},
    isLikeShow: {},
    isCIShow: {},
    isLiked: {},
    likeClickedStatus: false,
    search: Notifications.searchPost,
    isLoading: false,
    reply: false,
    Comment: "",
    commentStatus: false,
    commented: false,
    fileExt: "",
    // 
    showMembersLiked: false,
    membersLiked: [],
    // 
    userList: [],
    showSelectUser: false,
    usersFilterValue: "",
    mentioned_users: []
  };

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }

    const response = await getUsersDropdown();
    if (response) {
      const { result: userList, status } = response;
      if (status === 'success' && Array.isArray(userList) && userList.length > 0) {
        this.setState({ userList });
      }
    }

    this.setState(
      {
        isLoading: true,
      },
      () => this.DisplayFeedApi()
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.search !== prevProps.search) {
      this.DisplayFeedApi();
    }
  }

  DisplayFeedApi = async () => {
    const search = Notifications?.searchPost;
    const requestData = {
      page: this.state.page,
      size: this.state.size,
      // like_count: this.state.likeCount,
      search: search,
    };
    const ResponseEvents = await HomeFeed(requestData);
    if (ResponseEvents && ResponseEvents.status === "success") {
      const result = ResponseEvents.result;
      const texts = [];
      const mlt = [];
      for (let i in result.data) {
        texts.push(result.data[i].discription);
        mlt.push(result.data[i].discription.length);
      }
      this.setState(
        {
          FeedData: result.data,
        },
        () => {
          const {
            FeedData,
            isShow,
            isLiked,
            isCIShow,
            isLikeShow,
            isTextShow,
          } = this.state;
          for (let i = 0; i < FeedData.length; i++) {
            isShow[i] = false;
            isTextShow[i] = false;
            isCIShow[i] = false;
            isLikeShow[i] = false;
            isLiked[i] = 0;
            this.setState({
              isShow,
              isLiked,
              isCIShow,
              isLikeShow,
              isTextShow,
            });
          }
        }
      );
    }
  };

  DisplayLikeApi = async () => {
    const requestData = {
      feed_id: this.state.feedId,
      liked_user: User.user_id,
    };
    const ResponseEvents = await HomeFeedLike(requestData);
    if (ResponseEvents && ResponseEvents.status === "success") {
      this.DisplayFeedApi();
    } else {
      this.DisplayFeedApi();
    }
  };

  refreshPage() {
    window.location.reload(false);
  }

  renderStartPostSearch() {
    if (User.refresh) {
      this.DisplayFeed();
      User.setRefresh(false);
    }

    const { FeedData, isShow, isLiked, isCIShow, isLikeShow, userList } =
      this.state;

    return (
      <>
        <div>
          {FeedData.length > 0 &&
            FeedData.map((feed, i) => {
              const index = i;
              return (
                <div>
                  <div
                    className="start-post mt-3 display-post-main t-l"
                    key={i}
                    onClick={(e) => {
                      Notifications.setFeedViewId(feed.id);
                    }}
                  >
                    {feed.feed_users &&
                      feed.feed_users.map((user, j) => <div
                        className="insert-post-main dflex jc-sb"
                        style={{ alignItems: "flex-start" }}
                      >
                        <div
                          className="insert-post-main dflex align-center jc-sb"
                          key={j}
                        >
                          <div className="user-image ml-0 mt-0">
                            <img src={user?.image || profile} alt="MemberImage" />
                          </div>
                          <div className="display-post">
                            <h6>{user.name ? user.name : "User Name"}</h6>
                          </div>
                        </div>
                        <Link to="/feed" className="font-black">
                          <BsBoxArrowUpRight className="redirect" />
                        </Link>
                      </div>)}
                    {feed?.discription ? (
                      <div className="read-more-div text fontPop blck">
                        <div className="collapse-group">
                          <p
                            dangerouslySetInnerHTML={{ __html: feed.discription }}
                            className="mb-0 t-l fontPop blck"
                          ></p>
                        </div>
                      </div>
                    ) : null}
                    {feed.feed_paths && feed.feed_paths !== null ? (
                      <div>
                        {['jpg', 'png', 'gif', 'jpeg'].includes(feed.feed_paths.split(".").pop()) ? (
                          <div className="insert-post-main dflex align-center mt-2">
                            <div style={{ width: "100%", height: "auto" }}>
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
                          <div className="insert-post-main dflex align-center mt-2">
                            <div style={{ width: "100%" }}>
                              <video width="100%" height="auto" controls>
                                <source src={feed.feed_paths} type="video/mp4" />
                                <source src={feed.feed_paths} type="video/ogg" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        ) : null}
                        {["pdf", "csv", "txt"].includes(feed.feed_paths.split(".").pop()) ? (
                          <div className="insert-post-main dflex align-center mt-2">
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
                          ["doc", "docx"].includes(feed.feed_paths.split(".").pop()) ? (
                          <div className="insert-post-main dflex align-center mt-4">
                            <div className="thumbnail-image mb-3 doc-icon-txt">
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
                      </div>
                    ) : null}

                    <div className="dflex mt-2 jc-sb">
                      <div className="dflex">
                        <div className="insert-post-action-svg event-svg pos-rel dflex feed-like">
                          <BiLike style={{ transform: "rotateY(180deg)" }} />
                          {/* <span className="count">{feed.get_likes.length}</span> */}
                        </div>
                        <div className="insert-post-action-svg dflex ml-3">
                          <p className="mb-0 " style={{ fontSize: "0.9rem" }}>
                            {/* {feed.like_count} */}
                            <button onClick={() => {
                              if (feed?.get_likes && feed?.get_likes?.length > 0)
                                this.setState({ showMembersLiked: true, membersLiked: feed?.get_likes });
                            }} style={{ backgroundColor: "transparent", borderWidth: 0 }}>
                              {getLikesText(feed?.get_likes)}
                            </button>
                            <span className="ml-1"></span>
                          </p>
                        </div>
                      </div>
                      <div className="dflex">
                        <div className="insert-post-action-svg dflex align-center">
                          {/* <div className="insert-post-action-svg ml-2 display-comment comments  event-svg feed-clap">
                                                <GrChat style={{ fill: '', }} />
                                            </div> */}
                          <button
                            className="mb-0 no-style"
                            onClick={(e, index) => {
                              const openStatus =
                                isShow[i] === false ? true : false;
                              isShow[i] = openStatus;
                              this.setState({ isShow });
                              // this.setState(prevState => ({
                              //     isShow: !prevState.isShow
                              //   }))
                            }}
                          >
                            {feed.get_comments.length} Comments
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
                                  fillRule="evenodd"
                                />
                                <path
                                  d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                                  fill="none"
                                  stroke="#004182"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          ) : (
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
                                  fillRule="evenodd"
                                />
                                <path
                                  d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                                  fill="none"
                                  stroke="#000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          )}
                          <p className="my-0">Like </p>
                        </button>
                      </div>
                      <div className="insert-post-action-svg event-svg tc ">
                        <button
                          className="mb-0 no-style no-hover"
                          style={{ padding: "0rem 0rem" }}
                          onClick={(e, index) => {
                            const CommentOpenStatus =
                              isCIShow[i] === false ? true : false;
                            const newIsCIShow = {};
                            Object.keys(isCIShow).forEach(key => {
                              newIsCIShow[key] = false;
                            });
                            newIsCIShow[i] = CommentOpenStatus;
                            this.setState({
                              CIshow: true,
                              feedId: feed.id,
                              isCIShow: newIsCIShow,
                              Comment: "",
                              mentioned_users: []
                            });
                          }}
                        >
                          <GrChat style={{ fill: "#1F1F1F" }} />
                          <p className="my-0">Comment</p>
                        </button>
                      </div>
                    </div>
                    {this.state.isCIShow[index] && this.state.feedId === feed.id
                      ? this.renderCommentInput()
                      : null}
                    {this.state.isShow[index] || this.state.commented[index] ? (
                      <div>
                        {feed.get_comments.length < 1 ? (
                          <div className="comment-section-div t-l">
                            <Comment.Group>
                              <div className="mb-3 mt-3">
                                <Comment className="dflex display-comments">
                                  {/* <Comment.Avatar className="mr-1" src={comment.image} alt="commenter-image" /> */}
                                  <Comment.Content className="col-10">
                                    <div className="comment-content">
                                      <div>
                                        <Comment.Text>No comments</Comment.Text>
                                      </div>
                                    </div>
                                  </Comment.Content>
                                </Comment>
                              </div>
                            </Comment.Group>
                          </div>
                        ) : (
                          <div className="comment-section-div">
                            <Comment.Group>
                              {feed.get_comments.map((comment, j) => {
                                const time = feed.created_at;
                                const timeNow = moment(time).fromNow();
                                return (
                                  <div className="mb-3 mt-3">
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
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
        </div>

        <div>
          <Modal
            size="md"
            className="border-style rounded"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showMembersLiked}
          >
            <Modal.Header>
              <div className="form-head width100 dflex jc-sb align-center">
                <div className="width100 dflex align-center">
                  <img src={logo} alt="logo" />
                  <h3 className="ml-2"> Members Liked </h3>
                </div>
                <button
                  className="popup-button closeText dflex"
                  onClick={() => this.setState({ showMembersLiked: false, membersLiked: [] })}
                >
                  <span>
                    <AiOutlineCloseCircle />
                  </span>
                </button>
              </div>
            </Modal.Header>
            <div className="p-0">
              <Modal.Body>
                <div className="table">
                  <CommonTable
                    value={this.state.membersLiked || []}
                  >
                    <Column
                      header="SL"
                      sortable
                      style={{
                        minWidth: '6rem',
                        maxWidth: '8rem',
                      }}
                      body={(data, option) => option.rowIndex + 1}
                    />
                    <Column
                      field="name"
                      header="Name"
                      sortable
                      filter
                      filterPlaceholder="Search by Name"
                      style={{
                        minWidth: '12rem',
                        maxWidth: '15rem',
                      }}
                    />
                  </CommonTable>
                </div>

              </Modal.Body>
            </div>
          </Modal>
        </div>

        <div>
          <Modal
            size='md'
            className="cus-modal border-style rounded insert-post"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state?.showSelectUser}
          >
            <Modal.Header>
              <div
                className="d-flex justify-content-between w-100"
              >
                <div className="col d-flex justify-content-start align-items-center">
                  <h5
                    className="mt-1 ml-2 align-self-center"
                    style={{ color: "#fff" }}
                  >
                    Find Member
                  </h5>
                </div>
                <button
                  className="popup-button closeText"
                  onClick={() => {
                    this.setState({ showSelectUser: false, usersFilterValue: "" });
                  }}
                >
                  <span>
                    <AiOutlineCloseCircle />
                  </span>
                </button>
              </div>
            </Modal.Header>
            <Modal.Body style={{ height: "auto" }}>
              <div className="d-flex flex-column">
                <InputText
                  ref={(ref) => this.usersFilterInputRef = ref}
                  autoFocus
                  value={this.state.usersFilterValue}
                  onChange={(e) => this.setState({ usersFilterValue: e.target.value })}
                  placeholder="Please type here to filter" />
                <div
                >
                  <DataTable
                    scrollable
                    scrollHeight="400px"
                    className="mt-2"
                    value={userList}
                    selectionMode="single"
                    onSelectionChange={({ value: { label, value } }) => {
                      this.setState(
                        {
                          Comment: `${this.state.Comment} @${label}`,
                          mentioned_users: this.state.mentioned_users.includes(value) ? this.state.mentioned_users : [...this.state.mentioned_users, value],
                          showSelectUser: false, usersFilterValue: "",
                        }
                        // mentioned_users
                      );
                    }}
                    dataKey="value"
                    responsiveLayout="scroll"
                    globalFilterFields={["label"]}
                    filters={{
                      'global': { value: this.state?.usersFilterValue, matchMode: FilterMatchMode.CONTAINS }
                    }}
                  >
                    <Column field="label" header="Names"></Column>
                  </DataTable>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </>
    );
  }

  renderStartPost() {
    if (User.refresh) {
      this.DisplayFeed();
      User.setRefresh(false);
    }

    const { FeedData, isShow, isLiked, isCIShow, isLikeShow, isTextShow } =
      this.state;

    return (
      <div>
        {FeedData.length > 0 &&
          FeedData.map((feed, i) => {
            const index = i;
            const truncate = (input) =>
              input?.length > 400 ? `${input.substring(0, 310)}...` : input;
            return (
              <div>
                <div
                  className="start-post mt-3 display-post-main t-l"
                  key={i}
                  onClick={(e) => {
                    Notifications.setFeedViewId(feed.id);
                  }}
                >
                  {feed?.feed_users &&
                    feed.feed_users.map((user, j) => <div
                      className="insert-post-main dflex jc-sb"
                      style={{ alignItems: "flex-start" }}
                    >
                      <div
                        className="insert-post-main dflex align-center jc-sb"
                        key={j}
                      >
                        <div className="user-image ml-0 mt-0">
                          <img src={user?.image || profile} alt="MemberImage" />
                        </div>
                        <div className="display-post">
                          <h6>{user?.name || "User Name"}</h6>
                        </div>
                      </div>
                      <Link to="/feed" className="font-black">
                        <BsBoxArrowUpRight className="redirect" />
                      </Link>
                    </div>
                    )}
                  {feed.discription ? (
                    <div className="read-more-div text fontPop blck">
                      <div className="collapse-group">
                        {feed.discription.length > 400 ? (
                          <>
                            {this.state.isTextShow[i] ? (
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: feed.discription,
                                }}
                                className="mb-0 fontPop blck t-l"
                              ></p>
                            ) : (
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: truncate(feed.discription),
                                }}
                                className={`mb-0 fontPop blck t-l`}
                              ></p>
                            )}
                            <button
                              className={`btn no-style no-hover ${isTextShow}`}
                              type="btn"
                              onClick={(e, index) => {
                                const openTextStatus =
                                  isTextShow[i] === false ? true : false;
                                isTextShow[i] = openTextStatus;
                                this.setState({ isTextShow });
                              }}
                              data-toggle="collapse"
                              data-target="#viewdetails"
                            >
                              {this.state.isTextShow[i]
                                ? "See less..."
                                : "See more..."}
                            </button>
                          </>
                        ) : (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: feed.discription,
                            }}
                            className="mb-0 t-l fontPop blck"
                          ></p>
                        )}
                      </div>
                    </div>
                  ) : null}
                  {feed.feed_paths && feed.feed_paths !== null ? (
                    <div>
                      {['jpg', 'png', 'gif', 'jpeg'].includes(feed.feed_paths.split(".").pop()) ? (
                        <div className="insert-post-main dflex align-center mt-2">
                          <div style={{ width: "100%", height: "auto" }} >
                            <img
                              src={feed.feed_paths}
                              style={{ width: "100%", height: "auto" }}
                              alt="postImage"
                            />
                          </div>
                        </div>
                      ) : null}
                      {feed.feed_paths.split(".").pop() === "mp4"
                        ? (
                          <div className="insert-post-main dflex align-center mt-2">
                            <div style={{ width: "100%" }}>
                              <video width="100%" height="auto" controls>
                                <source src={feed.feed_paths} type="video/mp4" />
                                <source src={feed.feed_paths} type="video/ogg" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        ) : null}
                      {["pdf", "csv", "txt"].includes(feed.feed_paths.split(".").pop()) ? (
                        <div className="insert-post-main dflex align-center mt-2">
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
                        ["doc", "docx"].includes(feed.feed_paths.split(".").pop()) ? (
                        <div className="insert-post-main dflex align-center mt-4">
                          <div className="thumbnail-image mb-3 doc-icon-txt">
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
                    </div>
                  ) : null}

                  <div className="dflex mt-2 jc-sb">
                    <div className="dflex">
                      <div className="insert-post-action-svg event-svg pos-rel dflex feed-like">
                        <BiLike style={{ transform: "rotateY(180deg)" }} />
                        {/* <span className="count">{feed.get_likes.length}</span> */}
                      </div>
                      {/* <div className="insert-post-action-svg event-svg dflex ml-2 feed-clap">
                                        <IoHandLeftOutline style={{ transform: 'rotate(314deg)' }} />
                                    </div>
                                    <div className="insert-post-action-svg video-svg dflex ml-2 feed-love">
                                        <AiOutlineHeart />
                                    </div> */}
                      <div className="insert-post-action-svg dflex ml-3">
                        <p className="mb-0 " style={{ fontSize: "0.9rem" }}>
                          {feed.like_count}
                          <span className="ml-1"></span>
                        </p>
                      </div>
                    </div>
                    <div className="dflex">
                      <div className="insert-post-action-svg dflex align-center">
                        {/* <div className="insert-post-action-svg ml-2 display-comment comments  event-svg feed-clap">
                                            <GrChat style={{ fill: '', }} />
                                        </div> */}
                        <button
                          className="mb-0 no-style"
                          onClick={(e, index) => {
                            const openStatus =
                              isShow[i] === false ? true : false;
                            isShow[i] = openStatus;
                            this.setState({ isShow });
                            // this.setState(prevState => ({
                            //     isShow: !prevState.isShow
                            //   }))
                          }}
                        >
                          {feed.get_comments.length} Comments
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
                                fillRule="evenodd"
                              />
                              <path
                                d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                                fill="none"
                                stroke="#004182"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                        ) : (
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
                                fillRule="evenodd"
                              />
                              <path
                                d="M5.06 10a1.42 1.42 0 00-1.56 1.5A1.6 1.6 0 005.15 13h.29a1.37 1.37 0 00-1.34 1.41 1.43 1.43 0 001.31 1.42A1.42 1.42 0 006 18.37a1.45 1.45 0 00-.15 1 1.53 1.53 0 001.52 1.13h4.08a6.8 6.8 0 001.55-.21l2.56-.75h3.38c1.78-.07 2.26-8.26 0-8.26h-1c-.17 0-.27-.34-.71-.82-.65-.71-1.39-1.62-1.91-2.13a12.62 12.62 0 01-3-3.92C11.9 3.44 11.85 3 11 3a1.29 1.29 0 00-.91.48 1.32 1.32 0 00-.3 1c0 .25.13 1.12.18 1.43A15.82 15.82 0 0011.73 10z"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                        )}
                        <p className="my-0">Like </p>
                      </button>
                    </div>
                    <div className="insert-post-action-svg event-svg tc ">
                      <button
                        className="mb-0 no-style no-hover"
                        style={{ padding: "0rem 0rem" }}
                        onClick={(e, index) => {
                          const CommentOpenStatus =
                            isCIShow[i] === false ? true : false;
                          isCIShow[i] = CommentOpenStatus;
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
                  {this.state.isCIShow[index]
                    ? this.renderCommentInput()
                    : null}
                  {this.state.isShow[index] || this.state.commented[index] ? (
                    <div>
                      {feed.get_comments.length < 1 ? (
                        <div className="comment-section-div t-l">
                          <Comment.Group>
                            <div className="mb-3 mt-3">
                              <Comment className="dflex display-comments">
                                {/* <Comment.Avatar className="mr-1" src={comment.image} alt="commenter-image" /> */}
                                <Comment.Content className="col-10">
                                  <div className="comment-content">
                                    <div>
                                      <Comment.Text>No comments</Comment.Text>
                                    </div>
                                  </div>
                                </Comment.Content>
                              </Comment>
                            </div>
                          </Comment.Group>
                        </div>
                      ) : (
                        <div className="comment-section-div">
                          <Comment.Group>
                            {feed.get_comments.map((comment, j) => {
                              const time = feed.created_at;
                              const timeNow = moment(time).fromNow();
                              return (
                                <div className="mb-3 mt-3">
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
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  renderCommentInput() {
    const currentUser = User.UserImage;
    return (
      <div className="comment-section-div">
        <Comment.Group>
          <form onSubmit={this.onSubmitComment} className="mb-4 t-l" autoComplete="off" autoSave="off">
            <div className="write-comment dflex mb-1">
              <Comment.Avatar
                src={currentUser}
                style={{ width: "2rem", height: "2rem" }}
                className="mr-2"
                alt="current-user"
              />
              <div className="text-area-main">
                <textarea
                  placeholder="your comment"
                  rows="2"
                  spellcheck="false"
                  value={this.state.Comment}
                  onChange={(e) =>
                    this.setState({
                      Comment: e.target.value,
                      commentStatus: true,
                    })
                  }
                  onKeyPress={(e) => {
                    if (e?.key === "@") {
                      e?.preventDefault();
                      this.editorRef?.editor?.blur();
                      this.setState({ showSelectUser: true, usersFilterValue: "" });
                      if (this.usersFilterInputRef && this.usersFilterInputRef?.current) this.usersFilterInputRef?.current?.focus();
                    }
                  }}
                />
              </div>
            </div>
            {this.state.Comment ? (
              <>
                <div className="mr-2"></div>
                <button className="no-style post-comment ml-5 mt-1">
                  Post
                </button>
              </>
            ) : null}
          </form>
        </Comment.Group>
      </div>
    );
  }

  validateComment = () => {
    const CommentError = CheckMessage(this.state.Comment);
    if (CommentError === 1) {
      this.setState({ CommentError: "Field empty" });
      return false;
    }
    return true;
  };

  ValidateAll = () => {
    const Comment = this.validateComment();

    if (Comment) return true;

    return false;
  };

  onSubmitComment = async (e) => {
    e.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const user_id = User.user_id;
      const mentioned_users = [];
      if (this.state?.mentioned_users && this.state?.mentioned_users.length > 0) {
        const { userList } = this.state;
        const mentionedUsers = userList.filter(({ value }) => this.state?.mentioned_users.includes(value));
        mentionedUsers.forEach(({ label, value }) => {
          if (this.state.Comment.includes(`@${label}`))
            mentioned_users.push(value);
        });
      }
      const requestData = {
        comment: this.state.Comment,
        feed_id: this.state.feedId,
        user_id: user_id,
        mentioned_users,
      };
      const response = await HomeCommentInsert(requestData);
      if (response && response.status === "success") {
        this.setState({
          Comment: "",
          commented: true,
          mentioned_users: [],
        });
        this.DisplayFeedApi();
      } else if (response.status === "error") {
        AppConfig.setMessage(response?.result);
      }
    }
  };

  render() {
    const { FeedData } = this.state;
    if (Notifications.searchPost || Notifications.searchPost === "")
      return <div>
        {this.state.isLoading ? (
          <div>
            {FeedData.length < 1 ? (
              <Spinner animation="border" variant="success" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            ) : this.renderStartPostSearch()}
          </div>
        ) : (
          <Spinner animation="border" variant="success" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        )}
      </div>;
    if (this.state.isLoading)
      return <div>
        <div>
          {FeedData.length < 1 ? (
            <Spinner animation="border" variant="success" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          ) : this.renderStartPost()}
        </div>
      </div>
    return <div>
      <Spinner animation="border" variant="success" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div>;
  }
}
export default observer(DisplayPost);
