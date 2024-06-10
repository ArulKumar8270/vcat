import React from 'react'
import { MdHome, MdNotifications, MdDashboard } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai"
import logo from '../components/img/logo.png'
import profile from '../components/img/profile.png'
import { Link } from 'react-router-dom';
import { Nav} from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import { observer } from 'mobx-react';


const DashboardHeader = () => {
    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    // console.log('loc==>', splitLocation[1]);

    const { userDetails} = this.state;

    return (
        <div className="app-header header-shadow">
            <div className="app-header__logo">
                <Link to='/changepassword'><img src={logo} /></Link>
                <div className="header__pane ml-auto">
                    {/* <div>
                        <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-className="closed-sidebar">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div> */}
                </div>
            </div>
            <div className="app-header__mobile-menu">
                <div>
                    <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div className="app-header__menu">
                <span>
                    <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span className="btn-icon-wrapper">
                            <i className="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>
            <div className="app-header__content">
                <div className="app-header-left">
                    <div className="search-wrapper">
                        <div className="input-holder">
                            <input type="text" className="search-input" placeholder="Type to search" />
                            <button className="search-icon"><span></span></button>
                        </div>
                        <button className="close"></button>
                    </div></div>
                <div className="app-header-right">
                    <div className="header-btn-lg pr-0">
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="app-header-right">
                                    <Nav className="header-menu nav">
                                        <Nav.Item className="nav-item header-icon">
                                            <LinkContainer to="/">
                                                <Link className={splitLocation[1] === "" ? "nav-link  active " : "nav-link "} ><MdHome />
                                                    Home</Link>
                                            </LinkContainer>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item header-icon btn-group">
                                            <LinkContainer to="/">
                                                <Link className={splitLocation[1] === "" ? "nav-link  active " : "nav-link "} > <MdNotifications />
                                                    Notifications</Link>
                                            </LinkContainer>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item dropdown msg-icon header-icon">
                                            <LinkContainer to="/">
                                                <Link className={splitLocation[1] === "" ? "nav-link  active " : "nav-link "} >
                                                    <AiFillMessage />
                                                    Messages</Link>
                                            </LinkContainer>
                                        </Nav.Item>

                                        {/* <li className="nav-item header-icon">
                                            <a href="javascript:void(0);" className="nav-link">
                                                <MdHome />
                                                Home
                                            </a>
                                        </li>
                                        <li className="btn-group nav-item header-icon">
                                            <a href="javascript:void(0);" className="nav-link">
                                                <MdNotifications />
                                                Notifications
                                            </a>
                                        </li>
                                        <li className="dropdown nav-item msg-icon header-icon">
                                            <a href="javascript:void(0);" className="nav-link">
                                                <AiFillMessage />
                                                Messages
                                            </a>
                                        </li> */}

                                    </Nav>
                                </div>
                                <div className="widget-content-left  ml-3 header-user-info">
                                    {/* <div className="widget-heading">
                                        {userDetails.email}
                                    </div>
                                    <div className="widget-subheading">
                                        {userDetails.occupation}
                                    </div> */}
                                </div>
                                <div className="widget-content-right header-user-info ml-3">
                                    <div className="dropdown nav-item  header-icon">
                                        <a href="javascript:void(0);" className="nav-link">
                                            <MdDashboard />
                                            Dashboard
                                        </a>
                                    </div>
                                    <div className="btn-group user-button-grp">
                                        {/* <div className='user-button-grp'> */}
                                        <button type="button" className="btn-shadow user-button p-1 btn btn-sm p-0 btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                            <img src={profile} className='profile' style={{ "width": "30px", "height": "30px" }} />
                                        </button>
                                        <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="p-0 btn">
                                            Me  <i className="fa fa-angle-down ml-2 opacity-8"></i>
                                        </a>
                                        {/* </div> */}
                                        <div tabindex="-1" role="menu" aria-hidden="true" className="dropdown-menu dropdown-menu-right">
                                            <div className="dropdown-item widget-heading">
                                                {userDetails.name}
                                            </div>
                                            <div className="dropdown-item widget-subheading">
                                                {userDetails.occupation}
                                            </div>
                                            <div className="dropdown-item widget-subheading">
                                                {userDetails.email}
                                            </div>
                                            <div className="dropdown-item widget-heading">
                                                <Link to='/changepassword'> Change Password</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(DashboardHeader)
