import React from 'react'
import { HomeLatestCareers } from '../libraries/dashboard';
import { observer } from 'mobx-react';
import moment from 'moment';
import job1 from '../components/img/job1.png';
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';

class HomeLatestCareer extends React.Component {
    state = {
        userDetails: {},
        show: '',
        yourTextHere: '',
        minimumLength: 30,
        idealLength: 40,
        maxLength: 40,
        LatestEvents: [],
        LatestEventName: [],
        see_all: false,
        // Dialog props
        showDialog: false,
        selectedData: null,
    }

    async componentDidMount() {
        await this.showMoreApi();
    }

    showMoreApi = async () => {
        const requestData = {
            see_all: this.state.see_all
        }
        const ResponseEvents = await HomeLatestCareers(requestData);
        if (ResponseEvents && ResponseEvents.status === 'success') {
            const result = ResponseEvents
            const events = [];
            for (let i in result.latestCarriers) {
                events.push(result.latestCarriers[i].name);
            }
            this.setState({
                LatestEventName: events,
                LatestEvents: ResponseEvents.result.latestCarriers
            });
        }
    }

    renderDialog = () => {
        const { showDialog, selectedData } = this.state;
        return <Dialog
            header={
                selectedData ? <div className="d-flex">
                    <span className="mb-3 mr-2">
                        <img src={selectedData?.image || job1} alt='logo' style={{
                            width: "30px", height: "30px"
                        }} />
                    </span> {selectedData?.company_name}
                </div> : ""
            }
            visible={showDialog}
            style={{ width: '50vw' }}
            onHide={() => this.setState({ showDialog: false, selectedData: null })}
            dismissableMask
        >
            {selectedData ? <div className="d-flex flex-column">
                <div className="col d-flex my-2 p-0">
                    <div className="col">
                        <span className="font-weight-bold">Job Title :</span> {selectedData?.job_title}
                    </div>
                    <div className="col">
                        <span className="font-weight-bold">Company Name :</span> {selectedData?.company_name}
                    </div>
                </div>
                <div className="col d-flex my-2 p-0">
                    <div className="col">
                        <span className="font-weight-bold">Job Type :</span> {selectedData?.job_type}
                    </div>
                    <div className="col">
                        <span className="font-weight-bold">Date :</span> {moment(selectedData?.date_time).format("DD MMM YY")}
                    </div>
                </div>
                <div className="col d-flex my-2 p-0">
                    <div className="col">
                        <span className="font-weight-bold">Salary :</span> {selectedData?.salary}
                    </div>
                    <div className="col">
                        <span className="font-weight-bold">Salary Type :</span> {selectedData?.salary_type}
                    </div>
                </div>
                <div className="col my-2">
                    <span className="font-weight-bold">Location :</span> {selectedData?.location}
                </div>
                {Array.isArray(selectedData?.tags) && selectedData?.tags.length > 0 ? <div className="col my-2">
                    <span className="font-weight-bold">Job Tags :</span> {selectedData?.tags.join(", ")}
                </div> : null}
                <div className="col d-flex my-2 flex-column">
                    <div className="col-auto p-0 mb-3">
                        <span className="font-weight-bold">Job Description :</span>
                    </div>
                    <div className="col" dangerouslySetInnerHTML={{ __html: selectedData?.job_description }}></div>
                </div>
                <div className="col d-flex my-2 flex-column">
                    <div className="col p-0 mb-3">
                        <span className="font-weight-bold">Requirements :</span>
                    </div>
                    <div className="col" dangerouslySetInnerHTML={{ __html: selectedData?.requirements }}></div>
                </div>
                <div className="col d-flex my-2 flex-column">
                    <div className="col p-0 mb-3">
                        <span className="font-weight-bold">About Company :</span>
                    </div>
                    <div className="col" dangerouslySetInnerHTML={{ __html: selectedData?.about_company }}></div>
                </div>
            </div> : null}
        </Dialog>
    }

    render() {
        const { LatestEvents } = this.state;
        if (Array.isArray(LatestEvents) && LatestEvents.length > 0)
        return (
            <>
                <div className="app-container app-theme-white body-tabs-shadow mt-4 pt-1">
                    <div className="app-main px-1">
                        <div className="app-sidebar sidebar-shadow pos-rel pt-3">
                            <div className="scrollbar-sidebar mt-3">
                                <div className="app-sidebar__inner">
                                    <div className="Latest-events-div px-3 py-3 bg-white" style={{ borderRadius: '25px' }}>
                                        <h6>Latest Careers</h6>
                                        {LatestEvents.length > 0 && LatestEvents.map((e, i) => {
                                            return (
                                                <div key={i}>
                                                    <ul >
                                                        <li>
                                                            <span className="mb-3 mr-2">
                                                                <img src={e?.image || job1} alt='logo' style={{
                                                                    width: "30px", height: "30px"
                                                                }} />
                                                            </span> {e?.company_name}
                                                            <span className="ml-2">
                                                                {/* <Link to='/career' className="font-black">
                                                                <BsBoxArrowUpRight className='redirect' />
                                                            </Link> */}
                                                                <button onClick={() => {
                                                                    this.setState({ selectedData: e, showDialog: true });
                                                                }} style={{
                                                                    border: "none",
                                                                    backgroundColor: "transparent",
                                                                }}>
                                                                    <BsBoxArrowUpRight className="redirect" />
                                                                </button>
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        })}
                                        <p>
                                            {/* <button className="btn see-all" onClick={() => this.setState({ see_all: !this.state.see_all }, () => this.showMoreApi())}>
                                                {this.state.see_all ? "See less" : "See all"}
                                            </button> */}
                                            <a href={`${window.location.origin}/career`}>
                                                <button className="btn see-all" >
                                                    See all
                                                </button>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderDialog()}
            </>
        );
        return <></>;
    }
}

export default observer(HomeLatestCareer)
