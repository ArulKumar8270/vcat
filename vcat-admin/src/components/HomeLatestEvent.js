import React from 'react'
import { getUsersDropdown, HomeLatestEvents } from '../libraries/dashboard';
import { observer } from 'mobx-react';
import moment from 'moment';
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';
import { GrDocumentDownload } from "react-icons/gr";
import Eve from "../components/img/Eve.jpg";

class HomeLatestEvent extends React.Component {
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
        memberOption: [],
    };

    async componentDidMount() {
        await this.setMemberDropdown();
        await this.showMoreApi();
    }

    setMemberDropdown = async () => {
        const response = await getUsersDropdown();
        const { status, result: memberOption } = response;
        if (status === "success" && memberOption) {
            this.setState({ memberOption: Array.isArray(memberOption) ? memberOption : [] });
        }
    }

    showMoreApi = async () => {
        const requestData = {
            see_all: this.state.see_all
        }
        const ResponseEvents = await HomeLatestEvents(requestData);
        if (ResponseEvents && ResponseEvents.status === 'success') {
            const result = ResponseEvents
            const events = [];
            for (let i in result.latestEvents) {
                events.push(result.latestEvents[i].name);
            }
            this.setState({
                LatestEventName: events,
                LatestEvents: ResponseEvents.result.latestEvents
            });
        }
    }

    getHostedBy = () => {
        const { selectedData, memberOption } = this.state;
        const hostedByNames = [];
        if (selectedData?.hosted_by && typeof selectedData?.hosted_by === 'string' && selectedData?.hosted_by.length > 0) {
            const hostedBy = JSON.parse(selectedData?.hosted_by);
            if (Array.isArray(hostedBy) && hostedBy.length > 0) {
                const hosts = memberOption.filter(({ value: user_id }) => hostedBy.includes(user_id));
                if (hosts.length > 0)
                    hosts.forEach(({ label: name }) => hostedByNames.push(name));
            }
        }
        if (hostedByNames.length > 0)
            return hostedByNames.join(", ");
        return "-";
    }

    renderDialog = () => {
        const { showDialog, selectedData } = this.state;
        return <Dialog headerClassName="d-none" contentClassName="p-0" contentStyle={{ fontSize: "1rem" }} dismissableMask visible={showDialog} style={{ width: '70vw' }} onHide={() => this.setState({ showDialog: false, selectedData: null })}>
            {selectedData ? <div className="d-flex flex-column">
                <div className="col d-flex row my-2">
                    <div className="col-12 col-md d-flex flex-column">
                        <div className="col-auto w-100 pb-2" style={{
                            color: "#1c1777",
                            fontSize: "40px",
                            fontWeight: "700"
                        }}>
                            {selectedData?.name}
                        </div>
                        <div className="col" dangerouslySetInnerHTML={{ __html: selectedData?.description }}></div>
                    </div>
                    <div className="col-12 col-md-5 pt-3 mt-1">
                        <img src={selectedData?.image || `${window.location.origin}${Eve}`} alt="" className="img-fluid" />
                    </div>
                </div>
                <div className="col d-flex row my-2 justify-content-around">
                    <div className="col-md-auto">
                        <span className="font-weight-bold">Date : </span>{moment(selectedData?.from_date).format("DD MMMM YY")}
                    </div>
                    <div className="col-md-auto">
                        <span className="font-weight-bold">Time : </span>{moment(selectedData?.from_date).format("hh:mm A")}
                    </div>
                    <div className="col-md-auto">
                        <span className="font-weight-bold">Venue : </span>{selectedData?.venue}
                    </div>
                </div>
                {selectedData?.event_speakers && Array.isArray(selectedData?.event_speakers) && selectedData?.event_speakers.length > 0 ? <>
                    <div className="col d-flex py-4 font-weight-bold h4 mx-3">
                        Speaker{selectedData?.event_speakers.length > 1 ? "s" : ""}
                    </div>
                    <div className="col d-flex row justify-content-around">
                        {selectedData?.event_speakers?.map((speaker) => {
                            return <>
                                <div className="col-lg-2 col-md-2 col-12 d-flex flex-column">
                                    <div className="col">
                                        <img src={speaker?.image || "https://vcat.co.in/static/media/profile.4ade3ff9.png"} alt="" className="img-fluid" />
                                    </div>
                                    <div className="col d-flex justify-content-center font-weight-bold text-center">
                                        {speaker.speaker}
                                    </div>
                                    <div className="col d-flex justify-content-center text-center">
                                        {speaker.position}
                                    </div>
                                </div>
                            </>;
                        })}
                    </div>
                </> : <>
                    <div className="col py-3 mx-3">
                        <span className="font-weight-bold h4">Speaker :</span> No Speakers for this event
                    </div>
                </>}
                {selectedData?.event_tags && Array.isArray(selectedData?.event_tags) && selectedData?.event_tags.length > 0 ? <>
                    <div className="col d-flex my-2 mx-3">
                        {selectedData?.event_tags?.map((tag) => {
                            return <>
                                <div className="col-auto rounded-3 d-flex align-items-center p-2 mr-2" style={{
                                    backgroundColor: "#fbeeee",
                                    color: "#f56681",
                                }}>
                                    <div className="col-auto">
                                        <i className="pi pi-tag"></i>
                                    </div>
                                    <div className="col-auto">
                                        {tag}
                                    </div>
                                </div>
                            </>;
                        })}
                    </div>
                </> : null}
                <div className="col p-2"></div>
            </div> : null}
        </Dialog>
    }

    render() {
        const { LatestEvents } = this.state;
        if (Array.isArray(LatestEvents) && LatestEvents.length > 0)
            return (<>
                <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
                    <div className="app-main">
                        <div className="app-sidebar sidebar-shadow pos-rel " style={{ paddingTop: '2rem' }}>
                            <div className="scrollbar-sidebar mt-3">
                                <div className="app-sidebar__inner">
                                    <div className="Latest-events-div px-3 py-3 bg-white" style={{ borderRadius: '25px' }}>
                                        <h6>Latest events</h6>
                                        {LatestEvents.map((e, i) => {
                                            return (
                                                <div key={i}>
                                                    <ul>
                                                        <li>
                                                            <span className="mb-3"># </span>{e?.name} <span className="ml-2">
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
                                            <a href="https://vcat.co.in/event" target="_blank" rel="noopener noreferrer">
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

export default observer(HomeLatestEvent)
