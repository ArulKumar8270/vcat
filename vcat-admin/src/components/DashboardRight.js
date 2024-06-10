import React from 'react'
import DashboardCalender from './DashboardCalender';
import { dashboard } from '../libraries/dashboard';
import User from '../modals/User';
import { observer } from 'mobx-react';
import AppConfig from '../modals/AppConfig';
import { Tooltip } from 'primereact/tooltip';

class DashboardSideBar extends React.Component {
    state = {
        userDetails: {},
        show: ''
    }

    async componentDidMount() {
        if (this.props.password)
            this.setState({ password: this.props.password });

        const id = User.user_id;
        console.log('user is ---.', id);
        const response = await dashboard();
        const result = response.result;
        console.log("result", result);
        if (response && response.status === 'success') {
            AppConfig.setMessage("Successfully Logged In");
            console.log('appConfig after res', response);
            this.setState({
                userDetails: response.result.userDetails[0],
            });
        }
    }

    render() {
        const { userDetails } = this.state;
        return (
            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header mt-3">

                <div className="app-main">

                    <div className="app-sidebar sidebar-shadow pos-rel">
                        <div className="app-header__logo">
                            <div className="logo-src"></div>
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
                                <div className='user-info'>
                                    <div className='bg-image' style={{ backgroundImage: `url(${userDetails.cover_pic})` }}></div>
                                    <div className='profile-image'>
                                        <img src={userDetails?.image} alt="UserImage" />
                                    </div>
                                    <div className='user-details'>
                                        <h3>{userDetails?.name || 'CA Sreenivas'}</h3>
                                        <h5 className="m-btm">{userDetails.occupation || 'Chairman'}</h5>
                                        <div className='contact-det'>
                                            <h5 className='m-btm'>Contact details</h5>
                                            <h3>{userDetails.phoneNumber || userDetails.mobile_number}</h3>
                                            {userDetails.email && typeof userDetails.email === "string" ? <>
                                                {userDetails.email && userDetails.email?.length > 20 && <Tooltip target={`.contact-email`} content={userDetails.email} />}
                                                <div className={`contact-email`} data-toggle="tooltip" title={userDetails.email}>
                                                    {userDetails.email && userDetails.email?.length > 20 ? userDetails.email.slice(0, 18) + '...' : userDetails.email}
                                                </div>
                                            </> : 'vcat@info.in'}
                                            {userDetails.email && typeof userDetails.email === "string" && userDetails.email.length < 20 ? userDetails.email : userDetails.email || 'vcat@info.in'}
                                        </div>
                                    </div>
                                </div>
                                {this.props.show === 'home' ?
                                    <div className="calender my-3">
                                        <div className="calender-below my-2 mx-1">
                                            <h5>Vcat forum</h5>
                                        </div>
                                    </div>
                                    :
                                    <DashboardCalender show='home' />
                                }
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(DashboardSideBar)
