import React from "react";
import 'date-fns';
import { FaCalendarAlt } from "react-icons/fa";
import { observer } from "mobx-react";
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import "./DashboardCalender.css";
import { getCalendarDates } from "../libraries/memberDashboard";
import User from "../modals/User";
import { CommonTable } from "../common/CommonElements";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import moment from "moment";

class DashboardCalender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDates: [],
            meetingDates: [],
            eventDetails: [],
            meetingDetails: [],
            content: "",
            showDialog: false,
            // header: "",
            tableValue: [],
        };
    }

    componentDidMount = () => {
        this.onLoadFunc();
    }

    onLoadFunc = async () => {
        const response = await getCalendarDates(User.user_id);
        if (response) {
            const { status, result } = response;
            if (status === 'success' && result) {
                const { events, meetings } = result;
                if (events) {
                    const {
                        details: oldEventDetails,
                        //  dates: oldEventDates,
                    } = events;
                    const eventDetails = [];
                    const eventDates = [];
                    if (Array.isArray(oldEventDetails) && oldEventDetails.length > 0) {
                        oldEventDetails.forEach((oldEvent) => {
                            const event = { ...oldEvent };
                            const fromDate = new Date(event?.from_date)?.toDateString();
                            eventDates.fromDateStr = fromDate;
                            eventDetails.push(event);
                            eventDates.push(fromDate);
                        });
                        this.setState({ eventDetails, eventDates });
                    }
                }
                if (meetings) {
                    const {
                        details: oldMeetingDetails,
                        // dates: oldMeetingDates,
                    } = meetings;
                    const meetingDetails = [];
                    const meetingDates = [];
                    if (Array.isArray(oldMeetingDetails) && oldMeetingDetails.length > 0) {
                        oldMeetingDetails.forEach((oldMeeting) => {
                            const meeting = { ...oldMeeting };
                            const fromDate = new Date(meeting?.from_date)?.toDateString();
                            meetingDates.fromDateStr = fromDate;
                            meetingDetails.push(meeting);
                            meetingDates.push(fromDate);
                        });
                        this.setState({ meetingDetails, meetingDates });
                    }
                }
            }
        }
    };

    getOnlyDate({ year, month, day }) {
        return new Date(
            year,
            month,
            day,
            0, 0, 0, 0
        );
    }

    render() {
        const {
            eventDates,
            eventDetails,
            meetingDates,
            meetingDetails,
            tableValue,
        } = this.state;
        return (
            <div className="calender mt-3 mb-0">
                <div>
                    <div className="cal-icon bold-text" style={{ padding: "1rem 2rem 0rem" }}><p><FaCalendarAlt /> CALENDER</p></div>
                    <div className="cus-calendar">
                        <Calendar
                            value={new Date()}
                            inline
                            // selectionMode="multiple"
                            dateTemplate={(date) => {
                                const newDate = this.getOnlyDate(date)?.toDateString();
                                if (eventDates?.includes(newDate)) {
                                    return <span style={{
                                        backgroundColor: "orange",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <strong>{date.day}</strong>
                                    </span>
                                }
                                if (meetingDates?.includes(newDate)) {
                                    return <span style={{
                                        backgroundColor: "greenyellow",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <strong>{date.day}</strong>
                                    </span>
                                }
                                return date.day;
                            }}
                            onChange={({ value }) => {
                                const newDate = this.getOnlyDate({ year: value?.getFullYear(), month: value?.getMonth(), day: value?.getDate() })?.toDateString();
                                if (eventDates?.includes(newDate) || meetingDates?.includes(newDate)) {
                                    // let content = "";
                                    const showDialog = true;
                                    // const header = `Events and Meetings on ${newDate}`;
                                    // if (eventDates?.includes(newDate)) {
                                    //     content = "Events are ";
                                    //     const events = eventDetails?.filter(({ from_date }) => new Date(from_date)?.toDateString() === newDate);
                                    //     for (let i = 0; i < events.length; i++) {
                                    //         const { title } = events[i];
                                    //         if (i === 0) {
                                    //             content += title;
                                    //         } else if (i !== events.length - 1) {
                                    //             content += ", " + title;
                                    //         } else {
                                    //             content += " and " + title;
                                    //         }
                                    //     }
                                    // }
                                    // if (eventDates?.includes(newDate) && meetingDates?.includes(newDate))
                                    //     content += " and ";
                                    // if (meetingDates?.includes(newDate)) {
                                    //     content = "Meetings are ";
                                    //     const meetings = meetingDetails?.filter(({ from_date }) => new Date(from_date)?.toDateString() === newDate);
                                    //     for (let i = 0; i < meetings.length; i++) {
                                    //         const { title } = meetings[i];
                                    //         if (i === 0) {
                                    //             content += title;
                                    //         } else if (i !== meetings.length - 1) {
                                    //             content += ", " + title;
                                    //         } else {
                                    //             content += " and " + title;
                                    //         }
                                    //     }
                                    // }
                                    const newTableValue = [];
                                    if (eventDates?.includes(newDate)) {
                                        const events = eventDetails?.filter(({ from_date }) => new Date(from_date)?.toDateString() === newDate);
                                        for (let i = 0; i < events.length; i++) {
                                            const tableRow = { ...events[i] };
                                            // const startDate = moment(tableRow?.from_date).format("DD MMM YY");
                                            const startDate = moment(tableRow?.from_date).format("DD-MMM-YY");
                                            const startTime = moment(tableRow?.from_date).format("hh:mm A");
                                            // const endDate = moment(tableRow?.to_date).format("DD MMM YY");
                                            const endTime = moment(tableRow?.to_date).format("hh:mm A");
                                            // tableRow.date = `${startDate}  ${startTime} - ${startDate === endDate ? endTime : endDate + "  " + endTime}`
                                            tableRow.date = String(startDate);
                                            tableRow.time = `${startTime} - ${endTime}`;
                                            tableRow.type = "Event";
                                            tableRow.index = newTableValue.length + 1;
                                            newTableValue?.push(tableRow);
                                        }
                                    }
                                    if (meetingDates?.includes(newDate)) {
                                        const meetings = meetingDetails?.filter(({ from_date }) => new Date(from_date)?.toDateString() === newDate);
                                        for (let i = 0; i < meetings.length; i++) {
                                            const tableRow = { ...meetings[i] };
                                            // const startDate = moment(tableRow?.from_date).format("DD MMM YY");
                                            const startDate = moment(tableRow?.from_date).format("DD-MMM-YY");
                                            const startTime = moment(tableRow?.from_date).format("hh:mm A");
                                            // const endDate = moment(tableRow?.to_date).format("DD MMM YY");
                                            const endTime = moment(tableRow?.to_date).format("hh:mm A");
                                            // tableRow.date = `${startDate}  ${startTime} - ${startDate === endDate ? endTime : endDate + "  " + endTime}`
                                            tableRow.date = String(startDate);
                                            tableRow.time = `${startTime} - ${endTime}`;
                                            tableRow.type = "Meeting";
                                            tableRow.index = newTableValue.length + 1;
                                            newTableValue?.push(tableRow);
                                        }
                                    }

                                    this.setState({
                                        // content, 
                                        // header,
                                        showDialog,
                                        tableValue: newTableValue,
                                    });
                                }
                            }}
                        />
                    </div>
                    <hr />
                    <div className="d-flex flex-column">
                        <div className="col d-flex align-items-center">
                            <div className="p-2 col-auto rounded-circle" style={{
                                backgroundColor: "orange",
                                width: "10px",
                                height: "10px"
                            }}></div>
                            <div className="col">
                                Event
                            </div>
                        </div>
                        <div className="col d-flex align-items-center">
                            <div className="p-2 col-auto rounded-circle" style={{
                                backgroundColor: "greenyellow",
                                width: "10px",
                                height: "10px"
                            }}></div>
                            <div className="col">
                                Meeting
                            </div>
                        </div>
                        <div className="col d-flex align-items-center">
                            <div className="p-2 col-auto rounded-circle" style={{
                                backgroundColor: "#464eb8",
                                width: "10px",
                                height: "10px"
                            }}></div>
                            <div className="col">
                                Today
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    // header={this.state?.header}                    
                    header="Event and Meeting Notifications"
                    visible={this.state?.showDialog}
                    style={{ width: '70vw' }}
                    onHide={() => {
                        this.setState({
                            showDialog: false,
                            // content: "", 
                            // header: "",
                            tableValue: [],
                        });
                    }}
                    draggable={false}
                >
                    <CommonTable
                        value={tableValue}
                    >
                        <Column
                            field="index"
                            header="SL"
                            sortable
                            filterPlaceholder="Search by SL"
                            style={{ minWidth: '3rem', maxWidth: '4rem' }}
                        />
                        <Column
                            field="title"
                            header="Title"
                            sortable
                            filter
                            filterPlaceholder="Search by Title"
                            style={{
                                minWidth: '20rem',
                                maxWidth: '23rem',
                            }}
                            body={(data, option) => <>
                                <Tooltip target={`.event-or-meeting-title${data?.id}-${data?.type}`} content={data?.title} />
                                <div className={`event-or-meeting-title${data?.id}-${data?.type}`} data-toggle="tooltip" title={data?.title}>
                                    {data?.title && data?.title?.length > 36 ? data?.title.slice(0, 35) + '...' : data?.title}
                                </div>
                            </>}
                        />
                        <Column
                            field="type"
                            header="Type"
                            sortable
                            filterPlaceholder="Search by Type"
                            style={{ minWidth: '5rem', maxWidth: '7rem' }}
                        />
                        <Column
                            field="date"
                            header="Date"
                            sortable
                            filter
                            filterPlaceholder="Search by Date"
                            style={{
                                minWidth: '12rem',
                                maxWidth: '15rem',
                            }}
                            body={(data, option) => <>
                                <Tooltip target={`.event-or-meeting-date${data?.id}-${data?.type}`} content={data?.date} />
                                <div className={`event-or-meeting-date${data?.id}-${data?.type}`} data-toggle="tooltip" title={data?.date}>
                                    {data?.date && data?.date?.length > 36 ? data?.date.slice(0, 35) + '...' : data?.date}
                                </div>
                            </>}
                        />
                        <Column
                            field="time"
                            header="Time"
                            sortable
                            filter
                            filterPlaceholder="Search by Time"
                            style={{
                                minWidth: '12rem',
                                maxWidth: '15rem',
                            }}
                            body={(data, option) => <>
                                <Tooltip target={`.event-or-meeting-time${data?.id}-${data?.type}`} content={data?.time} />
                                <div className={`event-or-meeting-time${data?.id}-${data?.type}`} data-toggle="tooltip" title={data?.time}>
                                    {data?.time && data?.time?.length > 36 ? data?.time.slice(0, 35) + '...' : data?.time}
                                </div>
                            </>}
                        />
                        {/* <Column
                            field="venue"
                            header="Venue"
                            sortable
                            filter
                            filterPlaceholder="Search by Venue"
                            style={{
                                minWidth: '12rem',
                                maxWidth: '15rem',
                            }}
                            body={(data, option) => <>
                                <Tooltip target={`.event-or-meeting-venue${data?.id}-${data?.type}`} content={data?.venue} />
                                <div className={`event-or-meeting-venue${data?.id}-${data?.type}`} data-toggle="tooltip" title={data?.venue}>
                                    {data?.venue && data?.venue?.length > 36 ? data?.venue.slice(0, 35) + '...' : data?.venue}
                                </div>
                            </>}
                        /> */}
                    </CommonTable>
                </Dialog>
            </div>
        );
    }
}

export default observer(DashboardCalender);