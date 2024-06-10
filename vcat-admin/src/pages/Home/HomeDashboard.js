import React from "react";
import { observer } from "mobx-react";

// CSS  imports //
import profile from "../../components/img/profile.png";

// Common file imports //
import { Permissions, ApiPermissions } from "../../common/Permission";
import User from "../../modals/User";

// Api file imports //
import { dashboard } from "../../libraries/dashboard";

// Components imports //
import DashboardHeader from "../DashboardHeader";
import DashboardSideBar from "../DashboardSideBar";
import DisplayPost from "../../components/DisplayPost";
import DisplayUserProfile from "../../components/DisplayUserProfile";
import DisplayActivity from "../../components/DisplayActivity";
import HomeLatestEvent from "../../components/HomeLatestEvent";
import DisplayNotification from "../../components/DisplayNotification";
import InsertPost from "./InsertPost";
import HomeLatestCareer from "../../components/HomeLatestCareer";
import DisplayFeed from "../../components/DisplayFeed";
import AppLayoutConfig from "../../common/AppLayoutConfig";
import ChatPopUp from "../../components/ChatPopUp";

class HomeDashboard extends React.Component {
  state = {
    userDetails: {},
    userPermissions: {},
    Permissions: [],
    LatestEvents: [],
    ApiPermissions: [],
    search: "",
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

  renderDisplayPage() {
    const path = this.props.location.pathname;
    if (path === "/post") return this.renderDisplayActivity();
    if (path === "/profile") return this.renderDisplayUserProfile();
    if (path === "/feed") return this.renderDisplayFeed();
    if (path === "/notifications") return this.renderDisplayNotifications();
    return this.renderDisplayPost();
  }

  renderDisplayUserProfile() {
    const { userDetails } = this.state;
    return (
      <div
        className="post-box"
        style={{ height: "90vh", overflowY: "auto", width: "100%" }}
      >
        <div className="insert-box mb-4">
          <div className="start-post dflex align-center ">
            <div className="user-image ml-0 mt-0">
              <img
                src={userDetails?.image || profile}
                alt="Profile"
                style={{ borderRadius: "50%", width: "3rem", height: "3rem" }}
              />
            </div>
            <div className="insert-post">
              <div className="form-padding dflex mt-2">
                <p className="mb-0">
                  {userDetails.name ? userDetails.name : "User Name"}
                </p>
                <p className="mb-0">'s &nbsp; Profile</p>
              </div>
            </div>
          </div>
        </div>
        <div className="display-box tc" style={{ width: "100%" }}>
          <DisplayUserProfile
            props={this.props}
            path={this.props.location.pathname}
          />
        </div>
      </div>
    );
  }

  renderDisplayNotifications() {
    return (
      <div className="display-box tc" style={{ width: "100%" }}>
        <DisplayNotification
          props={this.props}
          path={this.props.location.pathname}
        />
      </div>
    );
  }

  renderDisplayActivity() {
    const { userDetails } = this.state;
    return (
      <div
        className="post-box"
        style={{ height: "90vh", overflowY: "auto", width: "100%" }}
      >
        <div className="insert-box mb-4">
          <div className="start-post dflex align-center">
            <div className="user-image ml-0 mt-0">
              <img
                src={userDetails?.image || profile}
                alt="Profile"
                style={{ borderRadius: "50%", width: "3rem", height: "3rem" }}
              />
            </div>
            <div className="insert-post">
              <div className="form-padding dflex mt-2">
                <p className="mb-0">
                  {userDetails.name ? userDetails.name : "User Name"}
                </p>
                <p className="ml-2 mb-0">Post and Activity</p>
              </div>
            </div>
          </div>
        </div>
        <div className="display-box tc" style={{ width: "100%" }}>
          <DisplayActivity
            props={this.props}
            path={this.props.location.pathname}
          />
        </div>
      </div>
    );
  }

  renderDisplayFeed() {
    return (
      <div
        className="post-box"
        style={{ height: "90vh", width: "100%", overflowY: "auto" }}
      >
        <div
          className="display-box tc"
          style={{ height: "90vh", overflowY: "auto", width: "100%" }}
        >
          <DisplayFeed path={this.props.location.pathname} props={this.props} />
        </div>
      </div>
    );
  }

  renderDisplayPost() {
    return (
      <div
        className="post-box"
        style={{ height: "90vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <div className="insert-box mb-4">
          <InsertPost />
        </div>
        <div className="display-box tc" style={{ width: "100%" }}>
          <DisplayPost
            props={this.props}
            path={this.props.location.pathname}
            search={this.state.search}
          />
        </div>
      </div>
    );
  }

  renderLatestEvents() {
    return (
      <div className="right-event-bar">
        <HomeLatestEvent />
        <HomeLatestCareer />
      </div>
    );
  }

  render() {
    if (User.refresh) {
      User.setRefresh(false);
    }
    return (
      <div>
        <div
          className="app-container hoM app-theme-white body-tabs-shadow notifications fixed-sidebar home-dashboard Home fixed-header"
          style={{ minHeight: "100%" }}
        >
          <DashboardHeader
            props={this.props}
            setSearch={(e) => this.setState({ search: e })}
            path={this.props.location.pathname}
            logout={this.props}
          />
          <div className="app-main wrapper">
            {/* Side bar starts */}
            <DashboardSideBar show="home" />
            <div className="home-app-outer app-main__outer">
              <div className="content dflex" style={{ flexDirection: "row", backgroundColor: "#f1f4f6" }}>
                {this.renderDisplayPage()}
                {this.renderLatestEvents()}
              </div>
            </div>
          </div>
        </div>
        <ChatPopUp />
      </div>
    );
  }
}

export default observer(HomeDashboard);
