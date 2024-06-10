import 'react-big-calendar/lib/css/react-big-calendar.css'
import AppConfig from "../modals/AppConfig";
import React from 'react'
import { CheckDob, CheckMessage, CheckUserName, DropDownCheck, CheckMeetingCode, CheckPhone } from '../common/Validation'
import logo from '../components/img/logo.png'
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal'
import { memberDashboard } from "../libraries/memberDashboard";
import { memberFormInsert } from "../libraries/memberFormInsert";
import { observer } from "mobx-react";

class AssignRole extends React.Component {
    constructor() {
        super();
        this.onCATypeChange = this.onCATypeChange.bind(this);
        this.onJoinType = this.onJoinType.bind(this);
        this.onPayType = this.onPayType.bind(this);

    }
    state = {
        status: false,
        Createmember: false,
        CreateRole: false,
        CreateWing: false,
        AssignRole: false,
        MemberNo: '',
        personName: '',
        fatherName: '',
        Qualification: '',
        DOB: '',
        DOM: '',
        DOS: '',
        BloodGroup: {},
        Occupation: '',
        OfficeAdress: '',
        CAResidence: '',
        CAOffice: '',
        OffceMob: '',
        ResAdress: '',
        MobNum: '',
        SpouseName: '',
        NOC: '',
        NameChild1: '',
        NameChild2: '',
        NameChild3: '',
        NameChild4: '',
        AssOrg: '',
        SocialOrg: '',
        BLife: '',
        BMember: '',
        Cash: '',
        OnlineTransfer: '',
        Check: '',
        DD: '',

        onPayType: '',
        onCATypeChange: '',
        onJoinType: '',
        selectBG: '',

        selectFilterOption: {},
        filterDropdownList: [],
        BGList: []

    }
    componentDidMount = async (e) => {
        const response = await memberDashboard();
        if (response.statuscode === 200) {


        } const filterList = [{
            id: "1",
            value: "1 Week",
        },
        {
            id: "2",
            value: "15 Days",
        },
        {
            id: "3",
            value: "30 Days",

        },
        {
            id: "4",
            value: "30 Days",

        },
        {
            id: "5",
            value: "6 Months",

        },
        {
            id: "6",
            value: "1 Year",

        },
        {
            id: "7",
            value: "More than 1 year",

        },]

        const filterDropdownList = filterList;
        for (let i in filterDropdownList) {
            let CatId = {
                value: filterDropdownList[i].id,
                label: filterDropdownList[i].value
            };
            filterDropdownList.push(CatId);
        }

        this.setState({
            filterDropdownList,

        })
    }
    onSelectFilter = async (selectedFilter) => {
        this.setState({ selectFilterOption: selectedFilter });

    }

    onSelectBG = async (selectedBG) => {
        this.setState({ selectBG: selectedBG })
    }
    onCATypeChange(e) {
        this.setState({
            onCATypeChange: e.target.value,
        })
    }
    onJoinType(e) {
        this.setState({
            onJoinType: e.target.value,
        })
    }

    onPayType(e) {
        this.setState({
            onPayType: e.target.value,
        })
    }
    render() {
        return (
            <>
                {this.renderCreateRole()}
                {this.renderCreateWing()}
                {this.renderAssignPerm()}
            </>
        )
    }
    renderCreateMember() {
        // const { BGList } = this.state;
        return (
            <div>
                <Modal
                    size='md'
                    className="border-style rounded"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.Createmember}
                > <Modal.Header>
                        <div className="form-head">
                            <img src={logo}
                            alt="logo"
                                style={{ width: '70px', height: '70px', marginRight: "1rem" }}
                            />
                            <h3> Member Management</h3>
                            <button className='popup-button closeText' onClick={() => this.props.closeModel(false)}>Close<span><AiOutlineCloseCircle /></span></button>

                        </div>
                    </Modal.Header>
                    <div className="p-3">
                        <Modal.Body>
                            <form className="align-items-center event-form" onSubmit={this.onSubmitCreate} autoComplete="off" autoSave="off">
                                <div className='row mb-4'>
                                    <div className='input-row mb-3'>
                                        <div className="form-padding mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="personName"
                                                placeholder="Enter the Name"
                                                value={this.state.personName}
                                                onChange={(e) => this.setState({ personName: e.target.value, personNameError: '' })}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-start">
                                            {this.state.personNameError ? (<span className='small-font-size text-danger'> {this.state.personNameError}</span>) : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className='row mb-4'>
                                    <div className="input-row">
                                        <div className='mb-3'>
                                            <div className="form-padding mb-3">
                                                <label>Office Mobile Number</label>
                                                <input
                                                    className="form-control"
                                                    label=""
                                                    placeholder="Office Mobile Number"
                                                    type="tel"
                                                    value={this.state.OffceMob}
                                                    onChange={(e) => this.setState({ OffceMob: e.target.value })}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                {this.state.descriptionError ? (<span className='small-font-size text-danger'> {this.state.descriptionError}</span>) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cta-section jc-end">
                                    <button type="submit" className="btn  event-cta-trans"
                                    >Cancel</button>
                                    <button type="submit" className="btn  event-cta"
                                    >Save</button>

                                </div>
                            </form>
                        </Modal.Body>
                    </div>
                </Modal>
            </div>
        )
    }

    renderCreateRole = () => {
        return (
            <>
                <Modal
                    size='md'
                    className="border-style rounded"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.CreateRole}
                > <Modal.Header>
                        <div className="form-head">
                            <img src={logo} alt="Logo"/>
                            <h3> Member Management</h3>
                            <button className='popup-button closeText' onClick={() => this.props.closeModel(false)}>Close<span><AiOutlineCloseCircle /></span></button>

                        </div>
                    </Modal.Header>
                    <div className="p-3">
                        <Modal.Body>
                            <form className="align-items-center event-form" onSubmit={this.onSubmitCreate} autoComplete="off" autoSave="off">
                                <div className='row mb-4'>
                                    <div className='input-row mb-3'>
                                        <div className="form-padding mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="personName"
                                                placeholder="Enter the Name"
                                                value={this.state.personName}
                                                onChange={(e) => this.setState({ personName: e.target.value, personNameError: '' })}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-start">
                                            {this.state.personNameError ? (<span className='small-font-size text-danger'> {this.state.personNameError}</span>) : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className='row mb-4'>
                                    <div className="input-row">
                                        <div className='mb-3'>
                                            <div className="form-padding mb-3">
                                                <label>Office Mobile Number</label>
                                                <input
                                                    className="form-control"
                                                    label=""
                                                    placeholder="Office Mobile Number"
                                                    type="tel"
                                                    value={this.state.OffceMob}
                                                    onChange={(e) => this.setState({ OffceMob: e.target.value })}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                {this.state.descriptionError ? (<span className='small-font-size text-danger'> {this.state.descriptionError}</span>) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cta-section jc-end">
                                    <button type="submit" className="btn  event-cta-trans"
                                    >Cancel</button>
                                    <button type="submit" className="btn  event-cta"
                                    >Save</button>

                                </div>
                            </form>
                        </Modal.Body>
                    </div>
                </Modal>

            </>
        )
    }
    renderAssignPerm = () => {
        return (
            <>
                <Modal
                    size='md'
                    className="border-style rounded"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.AssignRole}
                > <Modal.Header>
                        <div className="form-head">
                            <img src={logo} alt="Logo"/>
                            <h3> Member Management</h3>
                            <button className='popup-button closeText' onClick={this.handleClose}>Close<span><AiOutlineCloseCircle /></span></button>

                        </div>
                    </Modal.Header>
                    <div className="p-3">
                        <Modal.Body>
                            <form className="align-items-center event-form" onSubmit={this.onSubmitCreate} autoComplete="off" autoSave="off">
                                <div className='row mb-4'>
                                    <div className='input-row mb-3'>
                                        <div className="form-padding mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="personName"
                                                placeholder="Enter the Name"
                                                value={this.state.personName}
                                                onChange={(e) => this.setState({ personName: e.target.value, personNameError: '' })}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-start">
                                            {this.state.personNameError ? (<span className='small-font-size text-danger'> {this.state.personNameError}</span>) : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className='row mb-4'>
                                    <div className="input-row">
                                        <div className='mb-3'>
                                            <div className="form-padding mb-3">
                                                <label>Office Mobile Number</label>
                                                <input
                                                    className="form-control"
                                                    label=""
                                                    placeholder="Office Mobile Number"
                                                    type="tel"
                                                    value={this.state.OffceMob}
                                                    onChange={(e) => this.setState({ OffceMob: e.target.value })}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                {this.state.descriptionError ? (<span className='small-font-size text-danger'> {this.state.descriptionError}</span>) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cta-section jc-end">
                                    <button type="submit" className="btn  event-cta-trans"
                                        onClick={() => this.props.closeModel(false)}>Cancel</button>
                                    <button type="submit" className="btn  event-cta"
                                    >Save</button>

                                </div>
                            </form>
                        </Modal.Body>
                    </div>
                </Modal>

            </>
        )
    }
    handleClose = () => {
        this.setState({
            personName: '',
            Fromdate: new Date(),
            Todate: new Date(),
            eventName: '',
            selectHost: [],
            MeetingNumber: '',
            city: '',
            description: '',
            meetingType: '',
            eventType: '',
            topic: '',
            venue: '',
            selectWing: [],
            selectMember: [],
            agenda: '',
            eventImage: '',

        }, () => {
            this.props.closeModel(false);
        });
    }

    renderCreateWing = () => {
        return (
            <>
                <Modal
                    size='md'
                    className="border-style rounded"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.CreateWing}
                > <Modal.Header>
                        <div className="form-head">
                            <img src={logo} alt="Logo" />
                            <h3> Member Management</h3>
                            <button className='popup-button closeText' onClick={() => this.props.closeModel(false)}>Close<span><AiOutlineCloseCircle /></span></button>

                        </div>
                    </Modal.Header>
                    <div className="p-3">
                        <Modal.Body>
                            <form className="align-items-center event-form" onSubmit={this.onSubmitCreate} autoComplete="off" autoSave="off">
                                <div className='row mb-4'>
                                    <div className='input-row mb-3'>
                                        <div className="form-padding mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="personName"
                                                placeholder="Enter the Name"
                                                value={this.state.personName}
                                                onChange={(e) => this.setState({ personName: e.target.value, personNameError: '' })}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-start">
                                            {this.state.personNameError ? (<span className='small-font-size text-danger'> {this.state.personNameError}</span>) : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className='row mb-4'>
                                    <div className="input-row">
                                        <div className="mb-3">
                                            <div className="form-padding mb-3">
                                                <label>Office Mobile Number</label>
                                                <input
                                                    className="form-control"
                                                    label=""
                                                    placeholder="Office Mobile Number"
                                                    type="tel"
                                                    value={this.state.OffceMob}
                                                    onChange={(e) => this.setState({ OffceMob: e.target.value })}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                {this.state.descriptionError ? (<span className='small-font-size text-danger'> {this.state.descriptionError}</span>) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cta-section jc-end">
                                    <button type="submit" className="btn  event-cta-trans"
                                    >Cancel</button>
                                    <button type="submit" className="btn  event-cta"
                                    >Save</button>

                                </div>
                            </form>
                        </Modal.Body>
                    </div>
                </Modal>

            </>
        )
    }


    // Validation for username

    validatepersonName = () => {
        const eventNameError = CheckUserName(this.state.personName);
        if (eventNameError === 1) {
            this.setState({ eventNameError: 'Name empty' });
            return false;
        } else return true;
    };

    validateFatherName = () => {
        const personNameError = CheckUserName(this.state.fatherName);
        if (personNameError === 1) {
            this.setState({ personNameError: 'Name empty' });
            return false;
        } else return true;
    };

    validateDateSpouse = () => {
        const FromdateError = CheckDob(this.state.DOS);
        if (FromdateError === 1) {
            this.setState({ FromdateError: 'Date empty' });
            return false;
        } else return true;
    };

    validateOffceMob = () => {
        const FromdateError = CheckPhone(this.state.OffceMob);
        if (FromdateError === 1) {
            this.setState({ FromdateError: 'Date empty' });
            return false;
        } else return true;
    };

    validateMobNum = () => {
        const FromdateError = CheckPhone(this.state.MobNum);
        if (FromdateError === 1) {
            this.setState({ FromdateError: 'Date empty' });
            return false;
        } else return true;
    };

    validateDateMarriage = () => {
        const TodateError = CheckDob(this.state.DOM);
        if (TodateError === 1) {
            this.setState({ TodateError: 'Date empty' });
            return false;
        } else return true;
    };

    validateDOB = () => {
        const TodateError = CheckDob(this.state.DOB);
        if (TodateError === 1) {
            this.setState({ TodateError: 'Date empty' });
            return false;
        } else return true;
    };

    validateMemberNo = () => {
        const MeetingNumberError = CheckMeetingCode(this.state.MemberNo);
        if (MeetingNumberError === 1) {
            this.setState({ MeetingNumberError: 'field empty' });
            return false;
        } else return true;
    };

    validateQual = () => {
        const cityError = CheckUserName(this.state.Qualification);
        if (cityError === 1) {
            this.setState({ cityError: 'Field empty' });
            return false;
        } else return true;
    };

    validateSpouseName = () => {
        const cityError = CheckUserName(this.state.SpouseName);
        if (cityError === 1) {
            this.setState({ cityError: 'Field empty' });
            return false;
        } else return true;
    };

    // validateResAdress = () => {
    //     const cityError = CheckUserName(this.state.ResAdress);
    //     if (cityError === 1) {
    //         this.setState({ cityError: 'Field empty' });
    //         return false;
    //     } else return true;
    // };

    validateCN1 = () => {
        const cityError = CheckUserName(this.state.NameChild1);
        if (cityError === 1) {
            this.setState({ cityError: 'Field empty' });
            return false;
        } else return true;
    };
    validateCN2 = () => {
        const cityError = CheckUserName(this.state.NameChild2);
        if (cityError === 1) {
            this.setState({ cityError: 'Field empty' });
            return false;
        } else return true;
    };
    validateOcc = () => {
        const descriptionError = CheckMessage(this.state.Occupation);
        if (descriptionError === 1) {
            this.setState({ descriptionError: 'Field empty' });
            return false;
        } else return true;
    };
    validateAssOrg = () => {
        const descriptionError = CheckMessage(this.state.AssOrg);
        if (descriptionError === 1) {
            this.setState({ descriptionError: 'Field empty' });
            return false;
        } else return true;
    };
    validateResAdress = () => {
        const descriptionError = CheckMessage(this.state.ResAdress);
        if (descriptionError === 1) {
            this.setState({ descriptionError: 'Field empty' });
            return false;
        } else return true;
    };
    validateAddress = () => {
        const descriptionError = CheckMessage(this.state.OfficeAdress);
        if (descriptionError === 1) {
            this.setState({ descriptionError: 'Field empty' });
            return false;
        } else return true;
    };
    validateBG = () => {
        const venueError = DropDownCheck(this.state.BloodGroup);
        if (venueError === 1) {
            this.setState({ venueError: 'Field empty' });
            return false;
        } else return true;
    };
    validateNOC = () => {
        const venueError = DropDownCheck(this.state.NOC);
        if (venueError === 1) {
            this.setState({ venueError: 'Field empty' });
            return false;
        } else return true;
    };


    // Empty input validation

    ValidateAll = () => {
        const fatherName = this.validateFatherName();
        const personName = this.validatepersonName();
        const DateSpouse = this.validateDateSpouse();
        const OffceMob = this.validateOffceMob();
        const MobNum = this.validateMobNum();
        const DateMarriage = this.validateDateMarriage();
        const DOB = this.validateDOB();
        const MemberNo = this.validateMemberNo();
        const Qual = this.validateQual();
        const SpouseName = this.validateSpouseName();
        const CN1 = this.validateCN1();
        const CN2 = this.validateCN2();
        const Occ = this.validateOcc();
        const AssOrg = this.validateAssOrg();
        const ResAdress = this.validateResAdress();
        const Address = this.validateAddress();
        const BG = this.validateBG();
        const NOC = this.validateNOC();

        if (personName &&
            DateSpouse &&
            OffceMob &&
            MobNum &&
            DateMarriage &&
            DOB &&
            MemberNo &&
            Qual &&
            SpouseName &&
            ResAdress &&
            CN1 &&
            CN2 &&
            Occ &&
            AssOrg &&
            Address &&
            BG &&
            NOC && fatherName) {
            return true;
        } else {
            return false;
        }
    }

    // on submit sign in function
    onSubmitCreate = async (e) => {
        e.preventDefault();
        const allValidation = this.ValidateAll()
        if (allValidation) {
            const requestData = {
                nominee_name: this.state.personName,
                icai_membership_no: this.state.MemberNo,
                from_date: this.state.Fromdate,
                qualification: this.state.Qualification,


            }
            const response = await memberFormInsert(requestData);
            if (response && response.status === 'success') {
                AppConfig.setMessage(" Member Created ", false);
            } else if (response.status === 'error') {
                AppConfig.setMessage(response.result);
            }

        }
    };
    // Handle file select



}

export default observer(AssignRole)