// Imports order //

// Plugins //
import React from "react";
import { observer } from "mobx-react";
import {
  doc,
  query,
  where,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import moment from "moment";
import { db } from "../../firebase";

// CSS  imports //
import profile from "../../components/img/profile.png";
import "react-quill/dist/quill.snow.css";

// Common file imports //
import User from "../../modals/User";
import { Permissions, ApiPermissions } from "../../common/Permission";
import Notifications from "../../common/Notifications";

// Api file imports //
import { memberAutoPopulate } from "../../libraries/memberDashboard";
import { All_Users, dashboard } from "../../libraries/dashboard";

// Components imports //
import DashboardHeader from "../DashboardHeader";
import MessageChat from "../../components/MessageChat";
import { Footer } from "../../components";
import AppLayoutConfig from "../../common/AppLayoutConfig";

class Messages extends React.Component {
  state = {
    userDetails: {},
    Current_User: "",
    userPermissions: {},
    Permissions: [],
    UserStatus: [],
    LatestEvents: [],
    ApiPermissions: [],
    clicked: false,
    Members: [],
    MemberId: "",
    MemberRole: "",
    MemberName: "",
    MemberStatus: false,
    MemberImage: "",
    messages: [],
    UserMessages: [],
    userdetail: {},
    chatCommonId: "",
    shown: false,
    chatUpArrow: false,
    ChatShown: false,
    ListStatus: [],
    ListStatusvalue: false,
  };

  async componentDidMount() {

    AppLayoutConfig.setShowLayout(false);
    AppLayoutConfig.setShowHeader(false);
    AppLayoutConfig.setShowSidebar(false);
    AppLayoutConfig.setShowFooter(false);
    AppLayoutConfig.setShowSideCalendar(false);
    AppLayoutConfig.setShowChat(false);
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    this.All_Users();
    const response = await dashboard();
    const result = response.result;
    if (response && response.status === "success") {
      const userPermissions = [];
      const userDetail = [];
      for (let i in result.userDetails) {
        userDetail.push(result.userDetails[i].name);
      }
      for (let i in result.userPermissions) {
        userPermissions.push(result.userPermissions[i].name);
      }
      this.setState({
        userDetails: response.result.userDetails[0],
        userPermissions: userPermissions,
        Permissions: Permissions,
        ApiPermissions: ApiPermissions,
        Current_User: userDetail,
      });
      this.GetStatus();
    }
  }
  All_Users = async () => {
    const requestData = {
      search: this.state.search,
    };
    const members = await All_Users(requestData);
    const MemberList = members.result.all_users;
    this.setState({ Members: MemberList }, () => {
      this.GetStatus();
    });
  };
  GetStatus = () => {
    const StatusCommonId = User.StatusCommonId;
    const { Members } = this.state;
    if (User.user_id && StatusCommonId) {
      const q = query(collection(db, "Status"), where("status", "==", true));
      onSnapshot(q, (querySnapshot) => {
        const allMembers = [];
        const availableMembers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          for (let j in Members) {
            if (Members[j]["id"] === parseInt(data["user_id"])) {
              availableMembers.push(data["user_id"]);
              Members[j]["availability"] = data["status"];
              Members[j]["lastSeen"] = data["lastSeen"];
              allMembers.push(Members[j]);
              break;
            }
          }
        });
        for (let j in Members) {
          if (!availableMembers.includes(Members[j]["id"])) {
            Members[j]["availability"] = false;
            Members[j]["lastSeen"] = "";
            allMembers.push(Members[j]);
          }
        }
        this.setState({ Members: allMembers });
      });
    }
  };
  // renderArray() {
  //     // const { Permissions, ApiPermissions } = this.state;
  //     // const equals = Permissions.length === ApiPermissions.length && Permissions.every((e, i) => e.name === ApiPermissions[i].name);

  // }
  singleMember = async (id) => {
    const response = await memberAutoPopulate(id);

    if (response && response.status === "success") {
      let result = response.result.users;
      this.setState({
        MemberId: result.id,
        MemberImage: result.image,
        MemberName: result.name,
        userdetail: result,
        MemberRole: result.role_id,
      });
    }
  };
  openChat = async (e, id, name, image, role, availability) => {
    this.singleMember(id);
    const fromID = User.user_id;
    const groupQ1 = query(
      collection(db, "Group"),
      where("fromId", "==", fromID),
      where("toId", "==", id)
    );
    const groupQ2 = query(
      collection(db, "Group"),
      where("toId", "==", fromID),
      where("fromId", "==", id)
    );
    let commonId = "";
    const querySnapshot1 = await getDocs(groupQ1);
    querySnapshot1.forEach((doc) => {
      const data = doc.data();
      const user_id = User.user_id;
      if (
        (data.fromId === user_id && data.toId === id) ||
        (data.fromId === id && data.toId === user_id)
      ) {
        commonId = data.commonId;
      }
    });

    const querySnapshot2 = await getDocs(groupQ2);
    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      const user_id = User.user_id;
      if (
        (data.fromId === user_id && data.toId === id) ||
        (data.fromId === id && data.toId === user_id)
      ) {
        commonId = data.commonId;
      }
    });
    if (!commonId) {
      commonId = moment().unix().toString();
      await setDoc(doc(db, "Group/" + commonId), {
        commonId: commonId,
        fromId: User.user_id,
        toId: id,
      });
    }
    await setDoc(doc(db, "Users/" + id), {
      commonId: commonId,
      id: id,
    });
    if (id) {
      Notifications.setName(name);
      Notifications.setUserId(id);
      Notifications.setProfileImage(image);
      const PersonName = this.state.MemberName;
      const PersonId = this.state.MemberId;
      const PersonImage = this.state.MemberImage;
      this.setState({
        MemberId: PersonId,
        MemberImage: PersonImage,
        MemberName: PersonName,
        chatCommonId: commonId,
        MemberStatus: availability,
      });
    }
    this.setState({ ChatShown: true });
  };
  callApiSearch = (e) => {
    const { value } = e.target;
    this.setState({ rows: [], current_page: 1, search: value }, () => {
      this.All_Users();
    });
    if (this.state.search === "") {
      this.All_Users();
    }
  };

  renderChatSidebar() {
    const searchActive = "active";
    const { Members } = this.state;
    return (
      <>
        <div
          className={`search-wrapper ${searchActive} dflex align-center jc-sb`}
          style={{ width: "100%" }}
        >
          <div className="input-holder mr-2" style={{ width: "90%" }}>
            <button
              className="search-icon"
              style={{ float: "none" }}
              onClick={() => {
                this.All_Users();
                this.setState({ searchActive });
              }}
            >
              <span></span>
            </button>

            <input
              type="text"
              className="search-input ml-4"
              placeholder="Search messages"
              onChange={this.callApiSearch}
            />
          </div>
        </div>
        <div
          className="message-box users"
          style={{ width: "auto", maxHeight: "67vh" }}
        >
          {Members.length > 0 &&
            Members.map((text, i) => {
              let last_seen = "";
              if (text.lastSeen && !text.lastSeen === "") {
                last_seen = moment(text.lastSeen).fromNow();
              } else {
                last_seen = null;
              }
              return (
                <>
                  {text.id === User.user_id ?
                    null :
                    <div
                      key={i}
                      onClick={(e) =>
                        this.openChat(
                          e,
                          text.id,
                          text.name,
                          text.image,
                          text.role_id,
                          text.availability
                        )
                      }
                      className="insert-post-main pos-rel mt-4 dflex px-2 align-center pointer"
                    >
                      <div className="user-image m-0 p-0 ">
                        <img src={text?.image || profile} alt="Mmg" />
                        {text.availability ? (
                          <p className="mb-0 ">
                            <span
                              className="statusSignal count"
                              style={{ top: "63%", right: "0%" }}
                            ></span>
                          </p>
                        ) : (
                          <a className="mb-0" >
                            <span
                              className="statusSignal offline count"
                              style={{ top: "63%", right: "0%" }}
                            ></span>
                          </a>
                        )}
                      </div>
                      <div
                        className="display-post ml-3 box-bottom  pb-3 dflex jc-sb"
                        style={{ width: "100%" }}
                      >
                        <p className="mb-0 font-bold">{text.name}</p>
                        {text.lastSeen && text.lastSeen === "" ? null : (
                          <span
                            className="mb-0 font-bold"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {last_seen}
                          </span>
                        )}
                      </div>
                    </div>}
                </>
              );
            })}
        </div>
      </>
    );
  }

  renderChat() {
    return (
      <div className="start-post p-0  display-post-main header-shadow">
        <div className="insert-post-main align-center p-2 info-strip">
          <div className="dflex align-center">
            <div className="display-post col-12 px-1 dflex align-center pos-rel">
              <div className="user-image col-1 m-0 px-0 pos-rel">
                {!this.state.MemberImage === null ? (
                  <img src={this.state.MemberImage} alt="profile" />
                ) : (
                  <img src={profile} alt="profile" />
                )}

                {this.state.MemberStatus ? (
                  <a className="mb-0">
                    <span
                      className="statusSignal count"
                      style={{ top: "65%", left: "87%" }}
                    ></span>
                  </a>
                ) : (
                  <a className="mb-0">
                    <span
                      className="statusSignal offline count"
                      style={{ top: "65%", left: "87%" }}
                    ></span>
                  </a>
                )}
              </div>
              <div className="col-11">
                <h6 className="tt-c ml-1 mb-1">
                  {this.state.MemberName
                    ? this.state.MemberName
                    : "User Name"}
                </h6>
                {this.state.MemberStatus ? (
                  <span className="tt-c ml-1">online</span>
                ) : (
                  <span className="tt-c ml-1">offline</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="insert-post-main px-2 align-center">
          {this.state.MemberId ? this.renderOpenChat() : null}
        </div>
      </div>
    );
  }

  renderOpenChat() {
    const { chatCommonId } = this.state;
    return <MessageChat
      UserDetails={this.state.userdetail}
      MemberId={this.state.MemberId}
      MemberRole={this.state.MemberRole}
      MemberImage={this.state.MemberImage}
      MemberName={this.state.MemberName}
      Current_User={this.state.Current_User}
      commonId={chatCommonId}
    />;
  }

  render() {
    return (
      <div>
        <div className="app-container app-theme-white message-main body-tabs-shadow fixed-sidebar home-dashboard fixed-header mt-3">
          <DashboardHeader
            props={this.props}
            setSearch={(e) => this.setState({ search: e })}
            path={this.props.location.pathname}
            logout={this.props}
          />
          <div className="app-main wrapper">
            {/* Side bar starts */}
            <div className="start-post px-2 member-list-chat header-shadow">
              {this.renderChatSidebar()}
            </div>
            <div
              className="app-main__outer  chat-box-main"
              style={{ justifyContent: "flex-start" }}
            >
              <div
                className="content "
                style={{ width: "100%", flexDirection: "row" }}
              >
                {this.renderChat()}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default observer(Messages);
