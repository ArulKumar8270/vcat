import React from 'react'
import { Nav } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";
import { MdHome, MdNotifications, MdDashboard } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { LinkContainer } from 'react-router-bootstrap';
import { observer } from 'mobx-react';
import Notifications from '../common/Notifications';

const HeaderMenu = () => {
    //assigning location variable
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    return (
        <Nav>
            <div className='header-menu nav'>
                <Nav.Item>
                    <div className="widget-content-right header-user-info ml-3">
                        <div className="dropdown nav-item  header-icon">
                            <LinkContainer to="/home" className="btn-group nav-item header-icon notify-bubble pos-rel">
                                <Link to="/home" className={splitLocation[1] === "" || splitLocation[1] === "home" ? "no-style no-hover dflex nav-link active" : "no-style no-hover dflex nav-link"} >
                                    <MdHome /> Home
                                </Link>
                            </LinkContainer>
                        </div>
                    </div></Nav.Item>
                <Nav.Item>
                    <div className="widget-content-right header-user-info ml-3">
                        <div className="dropdown nav-item  header-icon">
                            <LinkContainer to="/notifications" className="btn-group nav-item header-icon notify-bubble pos-rel">
                                <Link to="/notifications" className={splitLocation[1] === "notifications" ? "no-style no-hover dflex nav-link  active" : "no-style no-hover dflex nav-link"} >
                                    <MdNotifications /> Notifications
                                    <span className="count">
                                        {Notifications?.notificationCount}
                                    </span>
                                </Link>
                            </LinkContainer>
                        </div>
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <div className="widget-content-right header-user-info ml-3">
                        <div className="dropdown nav-item  header-icon">
                            <LinkContainer to="/messages" className="btn-group nav-item header-icon notify-bubble pos-rel">
                                <Link to="/messages" className={splitLocation[1] === "messages" ? "no-style no-hover dflex nav-link active" : "no-style no-hover dflex nav-link"} >
                                    <AiFillMessage /> Messages
                                </Link>
                            </LinkContainer>
                        </div>
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <div className="widget-content-right header-user-info ml-3">
                        <div className="dropdown nav-item  header-icon">
                            <LinkContainer to="/dashboard" className="btn-group nav-item header-icon notify-bubble pos-rel">
                                <Link to="/dashboard" className={splitLocation[1] === "dashboard" ? "no-style no-hover dflex nav-link active" : "no-style no-hover dflex nav-link"} >
                                    <MdDashboard /> Dashboard
                                </Link>
                            </LinkContainer>
                        </div>
                    </div>
                </Nav.Item>
            </div>
        </Nav>
    )
}

export default observer(HeaderMenu)
