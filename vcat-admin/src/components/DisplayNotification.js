import { observer } from 'mobx-react';
import React from 'react';
import { clearAll, HomeFeed, HomeNotifications, readAll, updateNotification } from '../libraries/dashboard';
import Notifications from '../common/Notifications';
import moment from 'moment';
import profile from '../components/img/profile.png';
import { BsArrowLeftShort } from "react-icons/bs";
import User from '../modals/User';
import DisplayFeed from './DisplayFeed';
import { Spinner } from 'react-bootstrap';

class DisplayNotification extends React.Component {
    state = {
        size: '',
        page: '',
        FeedData: [],
        notifications: [],
        show: false,
        feedId: '',
        isLoading: false,
        path: '',
    }

    async componentDidMount() {
        if (this.props.password) {
            this.setState({ password: this.props.password });
        }
        this.setState({ isLoading: true }, () => this.DisplayNotifications())
        this.DisplayFeedApi();

    }

    DisplayFeedApi = async () => {
        const requestData = {
            page: this.state.page,
            size: this.state.size,
            like_count: this.state.likeCount
        };
        const ResponseEvents = await HomeFeed(requestData);
        if (ResponseEvents && ResponseEvents.status === 'success') {
            const result = ResponseEvents.result
            const texts = [];
            for (let i in result.data) {
                texts.push(result.data[i].discription);
            }
            this.setState({
                FeedData: result.data,
                yourTextHere: texts
            });
        }
    }

    clearAllApi = async () => {
        const notificationId = [];
        const { notifications } = this.state;
        for (let i in notifications) {
            notificationId.push(notifications[i]['id']);
        }
        const requestData = {
            notification_id: notificationId,
            user_id: User.user_id
        }
        await clearAll(requestData)
        this.setState({ notifications: '' }, () => this.DisplayNotifications());
    }

    readAllApi = async () => {
        const notificationId = [];
        const { notifications } = this.state;
        for (let i in notifications) {
            notificationId.push(notifications[i]['id']);
        }
        const requestData = {
            notification_id: notificationId,
            user_id: User.user_id
        }
        await readAll(requestData)
        this.setState({ notifications }, () => this.DisplayNotifications());
    }

    updateReadNotificationApi = async (notification_id, index) => {
        const requestData = {
            user_id: User.user_id,
            notification_id,
        }
        const response = await updateNotification(requestData);
        if (response && response.status === 'success') {
            const { notifications } = this.state;
            const path = "/feed";
            notifications[index]["status"] = 1;
            this.setState(
                { notifications, feedId: response.result[0].status, path },
                () => Notifications.setFeedViewId(this.state.feedId)
            );
        }
    }

    DisplayNotifications = async () => {
        const requestData = {
            user_id: User.user_id,
        }
        const response = await HomeNotifications(requestData);
        const result = response?.result.Notifications;
        const notifications = [];
        for (let i in result?.data) {
            notifications.push(result.data[i]);
        }
        Notifications.setNotificationCount(response?.result.unreadedCount);
        this.setState({ notifications });
    }

    refreshPage() {
        window.location.reload(false);
    }

    renderNotify() {
        return (
            <div className="start-post py-0 px-0 display-post-main tc" style={{ height: '85vh', overflowY: 'auto' }}>
                <div className="notif-div t-l">
                    <div className="back-event"><button onClick={() => this.props.history.goBack()}>
                        <h6 className="mb-0">Notifications</h6>
                    </button></div>
                </div>
                {this.state.isLoading ? (this.state.notifications.length < 1 ?
                    <Spinner animation="border" variant="success" role="status" style={{ marginTop: '2.5rem' }}>
                        <span className="visually-hidden mt-4"></span>
                    </Spinner> : this.renderNotifications())
                    : <Spinner animation="border" variant="success" role="status" className='mt-3'>
                        <span className="visually-hidden "></span>
                    </Spinner>
                }
            </div>
        )
    }

    renderNotifications() {
        const path = '/feed';
        return this.state?.notifications?.map((notifications, index) => {
            let classStatus = 'bg-warning';
            const dateTimeAgo = moment(notifications?.updated_at).fromNow();
            if (notifications?.status === 1) {
                classStatus = 'bg-success';
            }
            return (
                <div className={`row insert-post-main mt-0 d-flex px-3 py-3 align-center pointer notif-div text-capitalize t-l  ${classStatus}`} key={notifications.id}
                    onClick={() => this.updateReadNotificationApi(notifications.id, index, path)}>
                    <div className="user-image col-auto m-0 p-0 mr-2">
                        <img src={notifications.image || profile} alt="NIMG" />
                    </div>
                    <div className="display-post col-auto pl-2">
                        <p className="small-font-size my-0 py-0 text-dark text-capitalize">{notifications.notification_message ? notifications.notification_message : '-'}</p>
                    </div>
                    <div className='pl-0 col d-flex jc-sb align-center justify-content-end'>
                        <span className="col d-flex justify-content-end xsmall-font-size theme-font-color" style={{ fontSize: '0.7rem' }}>
                            {dateTimeAgo}
                        </span>
                    </div>
                </div>
            )

        })
    }

    render() {
        return this.state.path === '/feed' ?
            <div className="post-box" style={{ height: '90vh', width: '100%', overflowY: 'auto' }}>
                <div className="display-box" style={{ width: '100%' }}>
                    <div className="notif-div t-l">
                        <div className="back-event">
                            <button onClick={() => this.setState({ path: '' })}><h6 className="mb-0" style={{ color: 'rgb(70 78 184)' }}> <BsArrowLeftShort /> Notifications</h6></button>
                        </div>
                    </div>
                    <DisplayFeed feedId={this.state.feedId} props={this.props} path='/feed' />
                </div>
            </div>
            :
            <>
                {this.renderNotify()}
                <div className="p-2 d-flex jc-end">
                    <button className="small-font-size font-weight-bold border-0 no-outline" onClick={() => this.clearAllApi()}>Clear All</button>
                </div>
            </>
    }
}

export default observer(DisplayNotification)