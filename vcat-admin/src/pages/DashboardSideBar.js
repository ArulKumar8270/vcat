import React from 'react'
import DashboardCalender from '../components/DashboardCalender';
import profile from '../components/img/profile.png'
import { dashboard } from '../libraries/dashboard';
import { observer } from 'mobx-react';
import HomeAttendedEvent from '../components/HomeAttendedEvent';
import { Link } from 'react-router-dom';
import { Tooltip } from 'primereact/tooltip';

class DashboardSideBar extends React.Component {
    state = {
        userDetails: {},
        show: '',
        DesList: [{
            value: 1,
            label: 'BOARD OF TRUSTEES'
        },
        {
            value: 2,
            label: 'Mentors'
        },
        {
            value: 3,
            label: 'Past Presidents'

        },
        {
            value: 4,
            label: 'Member'
        }]
    }
    async componentDidMount() {
        if (this.props.password) {
            this.setState({ password: this.props.password });
        }
        const response = await dashboard();
        if (response && response.status === 'success') {
            this.setState({
                userDetails: response.result.userDetails[0],
            });

        }

    }
    render() {
        const { userDetails } = this.state;
        console.log("userDetails", userDetails);
        return (
            <div className="app-sidebar sidebar-shadow  ">
                <div className="app-header__logo">
                    {/* <div className="logo-src"></div> */}
                    <div className="header__pane ml-auto">
                        <div>
                            <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-classname="closed-sidebar">
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
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
                <div className="scrollbar-sidebar">
                    <div className="app-sidebar__inner">
                        <div className='user-info mb-3'>
                            <Link to="/profile">
                                <div className='bg-image' style={{ backgroundImage: `url(${userDetails.cover_pic})` }}></div>
                                <div className='profile-image'>
                                    <img src={userDetails?.image || profile} alt='userImage' className='profile' />
                                    {/* <MdEdit /> */}
                                </div>  </Link>
                            <div className='user-details'>
                                <h3>{userDetails.name ? userDetails.name : 'User Name'}</h3>
                                <h5 className="m-btm">{userDetails.occupation ? userDetails.occupation : null}</h5>
                                <div className='contact-det'>
                                    <h5 className='m-btm'>Contact details</h5>
                                    <h3>{userDetails.mobile_number ? userDetails.mobile_number : null}</h3>
                                    {userDetails.email && typeof userDetails.email === "string" ? <>
                                        {userDetails.email && userDetails.email?.length > 20 && <Tooltip target={`.contact-email`} content={userDetails.email} />}
                                        <div className={`contact-email`} data-toggle="tooltip" title={userDetails.email}>
                                            {userDetails.email && userDetails.email?.length > 23 ? userDetails.email.slice(0, 20) + '...' : userDetails.email}
                                        </div>
                                    </> : 'vcat@info.in'}
                                </div>
                            </div>
                        </div>
                        {this.props.show === 'home' ?
                            <div className="home-left-bar">
                                <HomeAttendedEvent />
                            </div>
                            :
                            <DashboardCalender show='home' />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(DashboardSideBar)
