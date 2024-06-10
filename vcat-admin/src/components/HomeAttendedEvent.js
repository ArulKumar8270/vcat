import React from 'react'
import { HomeAttendedEvents } from '../libraries/dashboard';
import User from '../modals/User';
import { observer } from 'mobx-react';

class HomeAttendedEvent extends React.Component {
    state = {
        userDetails: {},
        show: '',
        AttendedEvents: [],
        see_all: false
    }

    async componentDidMount() {
        if (this.props.password) {
            this.setState({ password: this.props.password });
        }
        this.showMoreApi();
    }
    showMoreApi = async () => {
        const requestData = {
            see_all: this.state.see_all,
            user_id: User.user_id
        }
        const ResponseEvents = await HomeAttendedEvents(requestData);
        if (ResponseEvents && ResponseEvents.status === 'success') {
            this.setState({
                AttendedEvents: ResponseEvents.result.eventsAttended
            });
        }
    }

    render() {
        const { AttendedEvents } = this.state;
        return (
            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
                <div className="app-main">
                    <div className="app-sidebar sidebar-shadow pos-rel pt-4">
                        <div className="scrollbar-sidebar mt-3">
                            <div className="app-sidebar__inner">
                                <div className="Latest-events-div px-3 py-3 bg-white" style={{ borderRadius: '25px' }}>
                                    <h6>Recent Events attended </h6>

                                    {AttendedEvents.length > 0 && AttendedEvents.map((e, i) => {
                                        return (
                                            <>
                                                <ul key={i}>
                                                    <li key={i}><span className="mb-3"># </span>{e.name} </li>
                                                </ul>
                                            </>
                                        )
                                    })}
                                    <p>
                                        <button className="btn see-all" onClick={() => this.setState({ see_all: true }, () => this.showMoreApi())}>
                                            See all...
                                        </button>.
                                    </p>
                                </div>
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

export default observer(HomeAttendedEvent)
