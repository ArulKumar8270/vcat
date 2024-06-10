import React from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, query, where, onSnapshot, setDoc } from "firebase/firestore";
import moment from "moment";
import Notifications from "../common/Notifications";
import profile from "../components/img/profile.png";
import { observer } from "mobx-react";
import User from "../modals/User";
import { dashboard } from "../libraries/dashboard";
import AppConfig from "../modals/AppConfig";
import { CheckMessage } from "../common/Validation";

class MessageChat extends React.Component {
  state = {
    messages: [],
    data: [],
    id: "",
    MemberId: "",
    MemberName: "",
    MemberImage: "",
    setText: "",
    commonId: "",
    LoggedInUserImage: "",
    LoggedInUserName: "",
    LoggedInUserId: "",
  };

  componentDidMount() {
    // const currentUser = User?.user_id;
    const commonId = this.props.commonId;
    const PersonId = this.props.MemberId;
    let ChatUserId = "";
    if (PersonId) {
      ChatUserId = PersonId.toString();
    }
    this.setState({ messages: [], commonId: commonId }, () => {
      this.GetMessages();
    });
    this.GetReceiverId(ChatUserId);
    this.Dashboard();
  }

  async componentDidUpdate(prevProps) {
    const PersonId = this.props.MemberId;
    if (this.props.commonId !== prevProps.commonId) {
      // const PersonName = this.props.MemberName;
      // const PersonImage = this.props.MemberImage;
      // const currentUser = User?.user_id;
      // const CurrentDate = moment().unix().toString();
      // const currentUserId = currentUser.toString();
      const ChatUserId = PersonId.toString();
      const commonId = this.props.commonId;
      this.setState({ messages: [], commonId: commonId }, () => {
        this.GetMessages();
      });
      this.GetReceiverId(ChatUserId);
    }
  }

  Dashboard = async () => {
    // const id = User.user_id;
    const response = await dashboard();
    // const result = response.result;
    if (response && response.status === "success") {
      this.setState({
        userDetails: response.result.userDetails[0],
      });
    }
    this.setState({
      LoggedInUserImage: this.state.userDetails.image,
      LoggedInUserName: this.state.userDetails.name,
      LoggedInUserId: this.state.userDetails.id,
    });
  };

  GetReceiverId = async (ChatUserId) => {
    const groupQ = query(
      collection(db, "Users"),
      where("fromId", "==", ChatUserId)
    );
    const querySnapshot = await getDocs(groupQ);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      this.setState({ commonId: data.commonId }, () => {
        this.GetMessages();
      });
    });
  };

  GetMessages = async () => {
    const { commonId } = this.state;
    if (commonId) {
      const q = query(
        collection(db, "Chat/" + commonId + "/Messages"),
        where("commonId", "==", commonId)
      );
      onSnapshot(q, (querySnapshot) => {
        // let messages = this.state.messages;
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        this.setState({ messages });
      });
    }
  };

  validateContent = () => {
    const descriptionError = CheckMessage(this.state.setText);
    if (descriptionError === 1) {
      this.setState({ descriptionError: "Field empty" });
      return false;
    } else return true;
  };

  sendMessage = async (e) => {
    e.preventDefault();
    const CurrentDate = moment().unix().toString();
    const commonId = this.state.commonId;
    const CurrentUserImage = User?.UserImage;
    // const CurrentUserInfo =this.props.UserDetails;
    const UserId = User.user_id;
    const CurrentUserName = User?.person_name;
    const validate = await this.validateContent();
    if (validate) {
      await setDoc(
        doc(collection(db, "Chat/" + commonId + "/Messages"), CurrentDate),
        {
          commonId: commonId,
          createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
          fromUser: UserId || this.state.LoggedInUserId,
          message: this.state.setText,
          fromUserImage: CurrentUserImage || this.state.LoggedInUserImage,
          fromUserName: CurrentUserName || this.state.LoggedInUserName,
          toUserID: Notifications.chatUser_id,
          toUsername: Notifications.name,
        }
      );
      this.setState({ setText: "", descriptionError: "" });
    } else {
      AppConfig.setMessage("Empty message");
    }
  };

  render() {
    // const PersonId = Notifications?.chatUser_id;
    // const PersonName = Notifications?.name;
    // const PersonImage = Notifications?.profile_image;
    // const Member_Role = '';
    const { messages } = this.state;
    const { MemberName, MemberImage, MemberRole } = this.props;

    // const currentUser = User.user_id;
    // const UserId = User.user_id;

    return (
      <>
        <div
          className="message-box chat-box pos-rel "
          style={{ height: "43vh" }}
        >
          <div className="insert-post-main my-2 px-2 py-3  text-message display-post">
            <div className="insert-post-main dflex text-message display-post">
              <div className="user-image col-1 m-0 px-0">
                <img src={MemberImage || profile} alt="NIMG" />
              </div>
              <div className="message col-11">
                <div className={`user-single-message mb-2 tt-c`}>
                  <a>{MemberName || Notifications.name}</a>
                  <p>
                    {MemberRole && parseInt(MemberRole) === 1
                      ? "President"
                      : parseInt(MemberRole) === 2
                        ? "Vice President"
                        : parseInt(MemberRole) === 3
                          ? "Secretary"
                          : parseInt(MemberRole) === 4
                            ? "Joint Secretary"
                            : parseInt(MemberRole) === 5
                              ? "Treasurer"
                              : parseInt(MemberRole) === 6
                                ? "Mentor"
                                : parseInt(MemberRole) === 7
                                  ? "Past President"
                                  : "Member"}
                  </p>
                </div>
              </div>
            </div>
            {messages.length > 0 &&
              messages.map((msg, i) => {
                const createdAt = msg.createdAt;
                const currentChatDate =
                  moment(createdAt).format("YYYY-MM-DD");
                let lastChatDate = "";
                if (i > 0) {
                  const { messages } = this.state;
                  lastChatDate = moment(messages[i - 1].createdAt).format(
                    "YYYY-MM-DD"
                  );
                }
                let changeDate = false;
                if (lastChatDate !== currentChatDate) {
                  changeDate = true;
                }
                let bgColor = "BgColorMsgTo";
                if (msg.fromUser === User.user_id) {
                  bgColor = "BgColorMsgFrom";
                }
                let TextColor = " black";
                if (
                  this.state.MemberId !== User.user_id &&
                  this.state.MemberName !== User.person_name
                ) {
                  TextColor = " blue";
                }
                return (
                  <>
                    {messages.length < 1 ? (
                      <div className="insert-post-main dflex text-message display-post">
                        <div className="message col-11">
                          <p>No new messages</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="insert-post-main  pos-rel text-message display-post"
                        key={i}
                      >
                        {changeDate ? (
                          <div className="msg-time-hr-div mb-3">
                            <hr style={{ width: "100%" }} />
                            <span className="msg-time">
                              {createdAt ? moment(createdAt).fromNow() : "-"}
                            </span>
                          </div>
                        ) : null}
                        <div className="dflex">
                          <div className="user-image col-1 m-0 px-0">
                            <img
                              src={msg.fromUserImage || profile}
                              alt="fromUserImage"
                            />
                          </div>
                          <div className="message col-11 pos-rel">
                            <div
                              className={`user-single-message mb-3 tt-c ${bgColor}`}
                            >
                              <div className="dflex jc-sb">
                                <a className={`${TextColor}`}>
                                  {msg.fromUserName || MemberName}
                                </a>
                                <div className="msg-time-hr-div mt-0">
                                  <span>
                                    {createdAt
                                      ? moment(createdAt).fromNow()
                                      : "-"}
                                  </span>
                                </div>
                              </div>
                              {/* <p>{msg.user_id}</p> */}
                              <p className="mt-2 mb-2">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
        </div>
        <div>
          <form>
            <div className="sendMsg">
              <div className="pb-2 create-event">
                <textarea
                  className="form-control text-box mb-1"
                  id="off"
                  placeholder="Message..."
                  value={this.state.setText}
                  onChange={(e) => this.setState({ setText: e.target.value })}
                  type="textarea"
                  style={{ height: "120px" }}
                />
                <div className="d-flex justify-content-start">
                  {this.state.descriptionError ? (
                    <span className="small-font-size text-danger">
                      {this.state.descriptionError}
                    </span>
                  ) : ""}
                </div>
                {this.state.setText ?
                  <button
                    className="create-event"
                    type="submit"
                    onClick={this.sendMessage}
                  >
                    Send
                  </button>
                  :
                  null
                }

              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default observer(MessageChat);
