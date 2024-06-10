import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { AiFillClockCircle } from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { FaUserGraduate, FaUsersCog } from "react-icons/fa";
import { IoDocumentTextSharp, IoDocuments } from "react-icons/io5";
import { BiBookContent } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";

// CSS  imports //
import "../components/img/profile_icon/mm.svg";

// Common file imports //
import User from "../modals/User";

// Api file imports //
import { dashboard } from "../libraries/dashboard";

// Components imports //
import Notifications from "../common/Notifications";
import AppLayoutConfig from "../common/AppLayoutConfig";

class Dashboard extends React.Component {
  cardsCollections = [
    {
      id: 1,
      title: "MOM",
      icon: <GiNotebook />,
      link: "/mom",
      permissions: ["READ_MOM", "WRITE_MOM"],
    },
    {
      id: 2,
      title: "Meeting",
      icon: <AiFillClockCircle />,
      link: "/meeting",
      permissions: ["READ_MEETING", "WRITE_MEETING"],
    },
    {
      id: 3,
      title: "Event",
      icon: <BiCalendarCheck />,
      link: "/event",
      permissions: ["READ_EVENT", "WRITE_EVENT"],
    },
    {
      id: 5,
      title: "Career",
      icon: <FaUserGraduate />,
      link: "/career",
      permissions: ["READ_CAREER", "WRITE_CAREER"],
    },
    {
      id: 6,
      title: "Document",
      icon: <IoDocumentTextSharp />,
      link: "/document",
      permissions: ["READ_DOCUMENT", "WRITE_DOCUMENT"],
    },
    {
      id: 7,
      title: "Member Management",
      icon: <FaUsersCog />,
      link: "/member",
      permissions: ["READ_ACCOUNT", "WRITE_ACCOUNT"],
    },
    {
      id: 8,
      title: "Content Management",
      icon: <BiBookContent />,
      link: "/content",
      permissions: ["READ_CONTENT", "WRITE_CONTENT"],
    },
    {
      id: 9,
      title: "Resources",
      icon: <IoDocuments />,
      link: "/resources",
      permissions: ["READ_RESOURCE", "WRITE_RESOURCE"],
    },
  ];
  state = {
    userDetails: {},
    userPermissions: [],
    UserStatus: [],
  };

  async componentDidMount() {
    AppLayoutConfig.setShowLayout(true);
    AppLayoutConfig.setShowHeader(true);
    AppLayoutConfig.setShowSidebar(true);
    AppLayoutConfig.setShowFooter(true);
    AppLayoutConfig.setShowSideCalendar(true);
    AppLayoutConfig.setShowChat(true);
    // 
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    const response = await dashboard();
    if (response && response.status === "success") {
      const { result } = response;
      const userPermissions = [];
      result?.userPermissions.forEach(({ name: userPermission }) => userPermissions?.push(userPermission));
      const userDetails = result.userDetails[0];
      localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
      this.setState({
        userDetails,
        userPermissions,
        UserStatus: [],
      }, async () => {
        User.setUserImage(userDetails?.image);
        Notifications.setUserRole(userDetails?.role_id);
        User.setName(userDetails?.name);
        await this.GetStatus();
      });
    }
  }

  GetStatus = async () => {
    const StatusCommonId = User.StatusCommonId;
    const { user_id } = User;
    if (user_id && StatusCommonId) {
      const q = query(
        collection(db, "Status"),
        where("user_id", "==", user_id)
      );
      onSnapshot(q, (querySnapshot) => {
        const { UserStatus } = this.state;
        querySnapshot.forEach((doc) => {
          UserStatus.push(doc.data());
        });
        this.setState({ UserStatus }, () => {
          if (UserStatus[0]?.status === true) {
            User.setUserStatus(true);
            User.setUserLastSeen(UserStatus[0].lastSeen);
          }
        });
      });
    }
  };

  render() {
    const { userPermissions } = this.state;
    return (
      <div className="app-main__outer">
        <div className="app-main__inner">
          <div className="pl-0 card-main">
            <div className="cards-layout">
              <h1 className="mb-5" style={{ fontSize: "2.5rem" }}>
                Dashboard
              </h1>
              <div className="row">
                {this.cardsCollections.map((card, i) => {
                  if (Array.isArray(userPermissions) && userPermissions.length > 0) {
                    let checkPermission = false;
                    for (let i = 0; i < card?.permissions?.length; i++) {
                      const permission = card?.permissions[i];
                      if (userPermissions.includes(permission)) {
                        checkPermission = true;
                        break;
                      }
                    }
                    if (checkPermission)
                      return <div
                        key={card?.id}
                        className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-4"
                      >
                        <Link to={card?.link}>
                          <div className="card m-btm m-auto ">
                            <div className="card-body">
                              <div className="card-title">
                                {card?.icon}
                              </div>
                              <h6>{card?.title}</h6>
                            </div>
                          </div>
                        </Link>
                      </div>
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default observer(Dashboard);