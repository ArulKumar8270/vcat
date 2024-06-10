// Imports order //

// Plugins //
import React from 'react'
import 'date-fns';
import { observer } from 'mobx-react';
import { BsArrowLeftShort } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

// Common file imports //
import User from '../../modals/User';
import AppConfig from '../../modals/AppConfig';

// Api file imports //
import { deleteEvent, eventTable, notifyEventMembers } from '../../libraries/event';

// Components imports //
import ConfirmModal from '../../components/ConfirmModal';
import EventsForm from './EventsForm';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

// CSS  imports //
import "./EventDashboard.css";
import moment from 'moment';
import { ExportService } from '../../common/ExportService';
import { CommonTable, TableFilterDropdown, TableGlobalSearch, TableTabs } from '../../common/CommonElements';
import AppLayoutConfig from '../../common/AppLayoutConfig';
import EventGallery from './EventGallery';
import EventSpeakers from './EventSpeakers';

import { Tooltip } from 'primereact/tooltip';
import { checkPermission } from '../../common/Common';

import logo from "../../components/img/logo.png";
import Modal from "react-bootstrap/Modal";
import { AiOutlineCloseCircle } from 'react-icons/ai';

class EventDashboard extends React.Component {
    exportServices;

    constructor(props) {
        super(props);
        this.state = {
            status: false,
            filter: "30 days",
            editEventId: '',
            deleteId: '',
            // new
            eventData: [],
            loading: true,
            globalFilter: "",
            menu: "Upcoming",
            // Gallery
            showGallery: false,
            eventGalleryId: null,
            eventGalleryTitle: null,
            // Speakers
            showSpeakers: false,
            eventSpeakersId: null,
            eventSpeakersTitle: null,
            // Access Rights
            writeAccess: checkPermission("WRITE_EVENT"),
            // Event Registration
            showEventRegistration: false,
            eventRegistrations: [],
        };
        this.exportExcel = this.exportExcel.bind(this);
        this.exportServices = new ExportService();
        AppLayoutConfig.setShowLayout(true);
        AppLayoutConfig.setShowHeader(true);
        AppLayoutConfig.setShowSidebar(true);
        AppLayoutConfig.setShowFooter(true);
        AppLayoutConfig.setShowSideCalendar(true);
        AppLayoutConfig.setShowChat(true);
    }

    componentDidMount = async (e) => {
        await this.tableFetchApi();
    }

    tableFetchApi = async () => {
        this.setState({ loading: true });
        const { filter } = this.state;
        const response = await eventTable({ filter });
        if (response) {
            const { result: oldEventData } = response;
            if (oldEventData && Array.isArray(oldEventData)) {
                const eventData = [];
                oldEventData.forEach((row) => {
                    eventData.push({
                        ...row,
                        from_date: row?.from_date ? moment(row?.from_date).format("yyyy-MM-DDTHH:mm:ss") : row?.from_date,
                        to_date: row?.to_date ? moment(row?.to_date).format("yyyy-MM-DDTHH:mm:ss") : row?.to_date,

                        event_start_date: row?.from_date ? moment(row?.from_date).format("DD MMM YY  hh:mm A") : row?.from_date,
                    });
                });
                this.setState({ eventData });
            }
        }
        this.setState({ loading: false });
    }

    exportExcel() {
        const { eventData, menu } = this.state;
        if (eventData && eventData.length > 0) {
            const tableData = eventData.filter((row) => {
                const today = new Date((new Date()).toDateString());
                const eventDate = new Date(row.from_date);
                if (this.state.menu === "Upcoming") {
                    return eventDate >= today;
                } else {
                    return eventDate < today;
                }
            });
            const excelData = [];
            tableData.forEach((row) => {
                excelData.push({
                    "SL": row?.id,
                    "Event Name": row?.name || "-",
                    "Event Description": row?.description || "-",
                });
            });
            this.exportServices.exportExcel(`${menu} Events`, [
                { field: "SL", header: "SL" },
                { field: "Event Name", header: "Event Name" },
                { field: "Event Description", header: "Event Description" },
            ], excelData)
        }
    }

    exportExcelEventRegistrations() {
        const { eventRegistrations } = this.state;
        if (eventRegistrations && eventRegistrations.length > 0) {
            const excelData = [];
            eventRegistrations.forEach((row) => {
                excelData.push({
                    "Name": row?.name || "-",
                    "Email": row?.email || "-",
                    "Mobile Number": row?.mobile_number || "-",
                    "ICAI Membership No": row?.icai_membership_no || "-",
                    "VCAT Membership Status": row?.vcat_membership_status || "-",
                    'Message or Query': row?.message || "-",
                });
            });
            this.exportServices.exportExcel(`Events Registrations`, [
                { field: "Name", header: "Name" },
                { field: "Email", header: "Email" },
                { field: "Mobile Number", header: "Mobile Number" },
                { field: "ICAI Membership No", header: "ICAI Membership No" },
                { field: "VCAT Membership Status", header: "VCAT Membership Status" },
                { field: `Message or Query`, header: `Message or Query` },
            ], excelData)
        }
    }

    handleClick = (e) => {
        this.setState({
            status: true,
        })
    }

    callApiFilter = ({ value: filter }) => {
        this.setState({ filter }, async () => {
            await this.tableFetchApi();
        });
    };

    updateEvent = (id) => {
        this.setState({ editEventId: id, status: true });
    }

    deleteEvent = (id) => {
        this.setState({ visible: true, deleteId: id });
    }

    getSuccess = async () => {
        const id = this.state.deleteId;
        await deleteEvent(id).then(async (response) => {
            if (response && response.status === "success") {
                User.setRefresh(true);
                await this.tableFetchApi();
                this.setState({ visible: false });
                AppConfig.setMessage(response.result, false);
            }
        })
    };

    showGallery(data) {
        this.setState({ showGallery: true, eventGalleryId: data.id, eventGalleryTitle: data?.title || data?.name });
    }

    renderGallery() {
        const {
            showGallery: show,
            eventGalleryId: id,
            eventGalleryTitle: title,
        } = this.state;
        const onClose = () => {
            this.setState({ showGallery: false, eventGalleryId: null });
        };
        return <EventGallery
            show={show}
            id={id}
            title={title}
            onClose={onClose}
            saveAccess={this.state.writeAccess}
        />
    }

    showSpeakers(data) {
        this.setState({ showSpeakers: true, eventSpeakersId: data.id, eventSpeakersTitle: data?.title || data?.name });
    }

    renderSpeakers() {
        const {
            showSpeakers: show,
            eventSpeakersId: id,
            eventSpeakersTitle: title,
        } = this.state;
        const onClose = () => {
            this.setState({ showSpeakers: false, eventSpeakersId: null });
        };
        return <EventSpeakers
            show={show}
            id={id}
            title={title}
            onClose={onClose}
            saveAccess={this.state.writeAccess}
        />
    }

    sendMail = async (id) => {
        const response = await notifyEventMembers(id);
        if (response) {
            const { status, result } = response;
            if (status === 'success' && result) {
                AppConfig.setMessage(result, false);
            }
        }
    };

    viewRegistrations = ({ id, registrations }) => {
        this.setState({ showEventRegistration: true, eventRegistrations: registrations });
    };

    render() {
        const { eventData, loading, globalFilter } = this.state;
        const tableValue = eventData && Array.isArray(eventData) && eventData.filter((row) => {
            const today = new Date((new Date()).toDateString());
            const eventDate = row?.from_date ? new Date(row?.from_date) : today;
            if (this.state.menu === "Upcoming") {
                return eventDate >= today;
            } else {
                return eventDate < today;
            }
        });
        const columns = [
            <Column
                field="id"
                header="SL"
                sortable
                // filter
                filterPlaceholder="Search by SL"
                style={{ minWidth: '3rem', maxWidth: '4rem' }}
            />,
            <Column
                field="name"
                header="Event Name"
                sortable
                filter
                filterPlaceholder="Search by Event Name"
                style={{
                    minWidth: '20rem',
                    maxWidth: '23rem',
                }}
                body={(data, option) => <>
                    <Tooltip target={`.event-title${data?.id}`} content={data?.name} />
                    <div className={`event-title${data?.id}`} data-toggle="tooltip" title={data.name}>
                        {data?.name && data?.name?.length > 36 ? data?.name.slice(0, 35) + '...' : data?.name}
                    </div>
                </>}
            />,
            <Column
                field="event_start_date"
                header="Date"
                sortable
                filter
                filterPlaceholder="Search by Date"
                style={{
                    minWidth: '12rem',
                    maxWidth: '15rem',
                }}
            />,
            <Column
                field="description"
                header="Event Description"
                sortable
                filter
                filterPlaceholder="Search by Event Description"
                style={{
                    minWidth: '20rem',
                    maxWidth: '23rem',
                }}
                body={(data, option) => {
                    return <>
                        <Tooltip target={`.event-description${data?.id}`} content={data?.description} />
                        <div className={`event-description${data?.id}`} data-toggle="tooltip" title={data.description}>
                            {data?.description && data?.description?.length > 35 ? data?.description.slice(0, 35) + '...' : data?.description}
                        </div></>;
                }}
            />,
            <Column
                field="description"
                header="Event Registrations"
                sortable
                filter
                filterPlaceholder="Search by Event Registration Count"
                align="center"
                style={{
                    minWidth: '20rem',
                    maxWidth: '23rem',
                }}
                body={(data, option) => {
                    return <div>
                        <Button label={`${(data?.registrations || []).length}`} className="rounded-pill" onClick={() => this.viewRegistrations(data)} icon="pi pi-eye" iconPos='right' />
                    </div>;
                }}
            />,
            <Column
                header="Action"
                align="center"
                headerClassName="d-flex justify-content-center"
                style={{ minWidth: '30rem', maxWidth: '33rem', }}
                body={(data, option) => {
                    return <div className="d-flex align-items-center">
                        <div className="d-flex" >
                            {this.state?.writeAccess && this.state?.menu === "Upcoming" ?
                                <div className="col d-flex align-items-center justify-content-center">
                                    <Button label="Send Mail" className="rounded-pill" onClick={() => this.sendMail(data?.id)}
                                        disabled={String(data?.yet_to_be_decided) === "1"}
                                    />
                                </div> : null}
                            <div className="col d-flex align-items-center justify-content-center">
                                <Button label="Speakers" className="rounded-pill" onClick={() => this.showSpeakers(data)} />
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <Button label="Gallery" className="rounded-pill" onClick={() => this.showGallery(data)} />
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <MdEdit
                                    size={40}
                                    color="white"
                                    onClick={() => this.updateEvent(data.id)}
                                    style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                                />
                            </div>
                            {this.state?.writeAccess ?
                                <div className="col d-flex align-items-center justify-content-center">
                                    <MdDelete
                                        size={40}
                                        color="white"
                                        onClick={() => this.deleteEvent(data.id)}
                                        style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                                    />
                                </div> : null}
                        </div>
                    </div>;
                }} />
        ];
        return (
            <div style={{ overflowX: "scroll" }}>
                <div className='app-main__outer container-fluid'>
                    <div className="back-event  m-3"><button onClick={() => this.props.history.goBack()}><BsArrowLeftShort /> Events</button></div>
                    <div className="content">
                        <div className="d-xl-flex d-none mb-2 align-items-center justify-content-between">
                            <div className="col-auto d-flex align-items-center">
                                <TableGlobalSearch
                                    value={globalFilter}
                                    onChange={(value) => this.setState({ globalFilter: value })}
                                />
                            </div>
                            <div className="col d-flex justify-content-end">
                                <div className="col-auto d-flex align-items-center p-0 m-0">
                                    <TableTabs
                                        value={this.state.menu}
                                        onChange={(menu) => this.setState({ menu })}
                                        latestLabel="Upcoming"
                                        latestValue='Upcoming'
                                        archiveLabel="Archive"
                                    />
                                </div>
                                {this.state.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                                    <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                                        Create Event
                                    </Button>
                                </div> : null}
                                <div className="col-auto btn-group p-0 m-0 ml-2">
                                    <TableFilterDropdown
                                        value={this.state.filter}
                                        onChange={this.callApiFilter}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-lg-flex d-none d-xl-none mb-2 align-items-center justify-content-between">
                            <div className="col-auto">
                                <TableGlobalSearch
                                    value={globalFilter}
                                    onChange={(value) => this.setState({ globalFilter: value })}
                                />
                            </div>
                            <div className="col d-flex justify-content-end">
                                <div className="col-auto d-flex align-items-center p-0 m-0">
                                    <TableTabs
                                        value={this.state.menu}
                                        onChange={(menu) => this.setState({ menu })}
                                        latestLabel="Upcoming"
                                        latestValue='Upcoming'
                                    />
                                </div>
                                {this.state.writeAccess ? <div className="col-auto create-event p-0 m-0 ml-2">
                                    <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                                        Create Event
                                    </Button>
                                </div> : null}
                                <div className="col-auto btn-group p-0 m-0 ml-2">
                                    <TableFilterDropdown
                                        value={this.state.filter}
                                        onChange={this.callApiFilter}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-md-flex d-none d-lg-none mb-2 align-items-center justify-content-between">
                            <div className="col-auto">
                                <TableGlobalSearch
                                    value={globalFilter}
                                    onChange={(value) => this.setState({ globalFilter: value })}
                                />
                            </div>
                            <div className="col d-flex flex-column">
                                <div className="col d-flex align-items-center justify-content-end p-0 m-0">
                                    <TableTabs
                                        value={this.state.menu}
                                        onChange={(menu) => this.setState({ menu })}
                                        latestLabel="Upcoming"
                                        latestValue='Upcoming'
                                    />
                                </div>
                                <div className="col d-flex justify-content-end mt-2">
                                    {this.state.writeAccess ? <div className="col-auto create-event p-0 m-0">
                                        <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                                            Create Event
                                        </Button>
                                    </div> : null}
                                    <div className="col-auto btn-group p-0 m-0 ml-2">
                                        <TableFilterDropdown
                                            value={this.state.filter}
                                            onChange={this.callApiFilter}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-sm-flex d-md-none flex-column mb-2 align-items-center justify-content-center">
                            <div className="col d-flex align-items-center justify-content-end p-0 m-0">
                                <TableGlobalSearch
                                    value={globalFilter}
                                    onChange={(value) => this.setState({ globalFilter: value })}
                                />
                            </div>
                            <div className="col d-flex align-items-center justify-content-end p-0 m-0 mt-2">
                                <TableTabs
                                    value={this.state.menu}
                                    onChange={(menu) => this.setState({ menu })}
                                    latestLabel="Upcoming"
                                    latestValue='Upcoming'
                                />
                            </div>
                            {this.state.writeAccess ? <div className="col create-event d-flex align-items-center justify-content-end p-0 m-0 mt-2">
                                <Button onClick={() => this.setState({ status: true, editEventId: '' })}>
                                    Create Event
                                </Button>
                            </div> : null}
                            <div className="col btn-group user-button-grp d-flex align-items-center justify-content-end p-0 m-0 mt-2">
                                <TableFilterDropdown
                                    value={this.state.filter}
                                    onChange={this.callApiFilter}
                                />
                            </div>
                        </div>
                        <div className="table">
                            <CommonTable
                                value={tableValue}
                                loading={loading}
                                exportExcel={this.exportExcel}
                                globalFilterFields={["id", "name", "description"]}
                                globalFilter={globalFilter}
                            >
                                {columns}
                            </CommonTable>
                        </div>
                        <EventsForm
                            status={this.state.status}
                            editEventId={this.state.editEventId}
                            closeModel={() => this.setState({ status: false })}
                            afterSubmit={this.tableFetchApi}
                            saveAccess={this.state.writeAccess}
                        />
                        <ConfirmModal
                            delete={true}
                            visible={this.state.visible}
                            heading="Delete"
                            title="Are you sure you want to delete the Event?"
                            confirm={() => this.getSuccess()}
                            handleClose={() => this.setState({ visible: false })}
                        />
                        {this.renderGallery()}
                        {this.renderSpeakers()}
                    </div>

                </div>

                <div>
                    <Modal
                        size="md"
                        className="border-style rounded"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={this.state.showEventRegistration}
                    >
                        <Modal.Header>
                            <div className="form-head width100 dflex jc-sb align-center">
                                <div className="width100 dflex align-center">
                                    <img src={logo} alt="logo" />
                                    <h3 className="ml-2"> Event Registrations </h3>
                                </div>
                                <button
                                    className="popup-button closeText dflex"
                                    onClick={() => this.setState({ showEventRegistration: false, eventRegistrations: [] })}
                                >
                                    <span>
                                        <AiOutlineCloseCircle />
                                    </span>
                                </button>
                            </div>
                        </Modal.Header>
                        <div className="p-0">
                            <Modal.Body>
                                <div className="table">
                                    <CommonTable
                                        value={this.state.eventRegistrations || []}
                                        exportExcel={this.exportExcelEventRegistrations}
                                    >
                                        <Column
                                            field="name"
                                            header="Name"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by Name"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                        />
                                        <Column
                                            field="email"
                                            header="Email"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by Email"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                        />
                                        <Column
                                            field="mobile_number"
                                            header="Mobile Number"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by Mobile Number"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                        />
                                        <Column
                                            field="icai_membership_no"
                                            header="ICAI Membership No"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by ICAI Membership No"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                        />
                                        <Column
                                            field="vcat_membership_status"
                                            header="VCAT Membership Status"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by VCAT Membership Status"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                        />
                                        <Column
                                            field="message"
                                            header="Message \ Query"
                                            sortable
                                            filter
                                            filterPlaceholder="Search by Message \ Query"
                                            style={{
                                                minWidth: '12rem',
                                                maxWidth: '15rem',
                                            }}
                                            body={(data, option) => {
                                                return <>
                                                    <Tooltip target={`.event-message${data?.id}`} content={data?.message} />
                                                    <div className={`event-message${data?.id}`} data-toggle="tooltip" title={data.message}>
                                                        {data?.message && data?.message?.length > 35 ? data?.message.slice(0, 35) + '...' : data?.message}
                                                    </div></>;
                                            }}

                                        />

                                    </CommonTable>
                                </div>

                            </Modal.Body>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default observer(EventDashboard)
