import { IoIosArrowDropdownCircle } from "react-icons/io"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import { DropDownCheck } from '../common/Validation'
import logo from '../components/img/logo.png'
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import User from "../modals/User";
import { Roles } from "../libraries/Roles";
import { assignPerm, PermAutoPopulate, Permissions } from "../libraries/Permissions";
import AppConfig from "../modals/AppConfig"
import { observer } from "mobx-react"

const animatedComponents = makeAnimated();

class AssignPerm extends React.Component {

    state = {
        AssignPerm: false,
        RoleList: [],
        PermissionList: [],
        StatusList: [{
            value: 0,
            label: "Active"
        },
        {
            value: 1,
            label: "Deactivate"
        }],
        selectPerm: [],
        selectedPerm: [],
        permTitle: [],
        PermissionStat: [],
    }
    componentDidMount = async (e) => {
        const response = await Permissions();
        const PermLis = [];
        if (response.statuscode === 200) {
            const Result = response.result.rolePermissions.data
            for (let i in Result) {
                let PerId = {
                    value: Result[i].id,
                    label: Result[i].permission_name
                };
                PermLis.push(PerId);
            }
            this.setState({
                PermissionList: PermLis
            })
        }
        const responseRoles = await Roles();
        const roleList = [];
        if (responseRoles.statuscode === 200) {
            const Result = responseRoles.result.data
            for (let i in Result) {
                const RoleId = {
                    value: Result[i].id,
                    label: Result[i].name
                };
                roleList.push(RoleId);
            }
            this.setState({
                RoleList: roleList
            })
        }
    }

    async componentDidUpdate(prevProps) {
        const id = this.props.editPerm
        if (this.props.AssignPerm !== prevProps.AssignPerm && id && this.props.AssignPerm) {

            this.setState({ AssignPerm: this.props.AssignPerm });

            const response = await PermAutoPopulate(id);

            if (response && response.status === 'success') {

                let result = response.result.permissions;
                const roleList = this.state.selectedRole;
                const selectedRoles = [];
                if (roleList && roleList.length > 0) {
                    for (let i in roleList) {
                        if (roleList[i]['value'] === result.role_id) {
                            const wing = {
                                value: result.role_id,
                                label: roleList[i]['label']
                            }
                            selectedRoles.push(wing);
                            break;
                        }
                    }
                }
                const PermList = this.state.selectPerm;
                const selectedPerm = [];
                if (PermList && PermList.length > 0) {
                    for (let i in PermList) {
                        if (PermList[i]['value'] === result.permission_id) {
                            const wing = {
                                value: result.permission_id,
                                label: PermList[i]['label']
                            }
                            selectedPerm.push(wing);
                            break;
                        }
                    }
                }

                const { StatusList: Status } = this.state;
                let Permissions = response.result.permissions;
                const Status_list = [];
                // let fields_status = [];
                if (Status && Status.length > 0) {
                    // fields_status = Array.from(Array(Permissions.length).keys());
                    for (let i = 0; i < Status.length; i++) {
                        if (parseInt(Status[i]['value']) === parseInt(Permissions.is_deleted)) {
                            Status_list.push({
                                label: Status[i]['label']
                            });
                        }
                    }

                }


                const { RoleList: Role } = this.state;
                let rolePermissions = response.result.permissions;
                const Role_list = [];
                // let fields_role = [];
                if (Role && Role.length > 0) {
                    // fields_role = Array.from(Array(rolePermissions.length).keys());
                    for (let i = 0; i < Role.length; i++) {
                        if (parseInt(Role[i]['value']) === parseInt(rolePermissions.role_id)) {
                            Role_list.push({
                                label: Role[i]['label']
                            });
                        }
                    }

                }
                const { PermissionList: Permission } = this.state;
                let selectPermission = response.result.permissions;
                const Permission_list = [];
                // let fields_perm = [];
                if (Permission && Permission.length > 0) {
                    // fields_perm = Array.from(Array(selectPermission.length).keys());
                    for (let i = 0; i < Permission.length; i++) {
                        if (parseInt(Permission[i]['value']) === parseInt(selectPermission.permission_id)) {
                            let role = {
                                value: selectPermission.permission_id,
                                label: Permission[i]['label']
                            }
                            Permission_list.push(role);
                        }
                    }
                }
                this.setState({
                    selectedRole: Role_list,
                    PermissionStat: Status_list,
                    selectPerm: Permission_list,

                })
            }
        }

    }

    onPermTitle = (permTitle) => {
        this.setState({
            permTitle: permTitle,
        })
    }

    onPermissionStat = (selectedPermStatus) => {

        this.setState({
            PermissionStat: selectedPermStatus,
        })
    }

    // onSelectPerm = (Selectedperm) => {
    //     const SelectedPerm = [];
    //     for (let i in Selectedperm) {
    //         let PId = {
    //             value: Selectedperm[i].value,
    //             label: Selectedperm[i].label
    //         };
    //         SelectedPerm.push(PId);
    //     }
    //     this.setState({
    //         selectPerm: Selectedperm
    //     })
    // }

    onSelectPerm = (selectPerm) => this.setState({ selectPerm });

    handleClose = () => {
        this.setState({
            permTitle: [],
            PermissionStat: [],
            selectPerm: [],
        });
        this.props.closeModel(false);
    }

    validatePermTitle = () => {
        const onPermTitleError = DropDownCheck(this.state.permTitle);
        if (onPermTitleError === 1) {
            this.setState({ onPermTitleError: 'Field empty' });
            return false;
        } else return true;
    };


    validateRoleStatus = () => {
        const RoleStatusError = DropDownCheck(this.state.PermissionStat);
        if (RoleStatusError === 1) {
            this.setState({ RoleStatusError: 'Field empty' });
            return false;
        } else return true;
    };
    validateSelectPerm = () => {
        const SelectPermissionError = DropDownCheck(this.state.selectPerm);
        if (SelectPermissionError === 1) {
            this.setState({ SelectPermissionError: 'Field empty' });
            return false;
        } else return true;
    };

    // Empty input validation
    ValidateAll = () => {
        const RoleStatus = this.validateRoleStatus();
        const SelectedPerms = this.validateSelectPerm();
        const onPermTitleError = this.validatePermTitle();

        if (SelectedPerms && onPermTitleError &&
            RoleStatus) {
            return true;
        } else {
            return false;
        }
    }

    // on submit sign in function
    onSubmitCreate = async (e) => {
        e.preventDefault();
        // const editId = this.props.editPerm
        const allValidation = this.ValidateAll()
        const id = User.user_id;
        const { selectPerm } = this.state;
        const selectedPermissionIds = [];
        const selectedPermissionName = [];
        for (let i in selectPerm) {
            selectedPermissionIds.push(selectPerm[i].value);
            selectedPermissionName.push(selectPerm[i].label);
        }
        if (allValidation) {
            let requestData = {
                is_deleted: this.state.PermissionStat.value,
                // role_name: this.state.permTitle.label,
                role_id: this.state.permTitle.value,
                permission_id: selectedPermissionIds,
                // permission_name: selectedPermissionName
                // created_by: user_id,
            }
            const response = await assignPerm(requestData, id);
            if (response && response.status === 'success') {
                AppConfig.setMessage(" Permission created successfully", false);
                this.props.closeModel();
                this.props.refreshPerm();
                User.setRefresh(true)

            } else if (response.status === 'error') {
                this.props.closeModel(false);
                const result = response.result;
                let message = result;
                if (result[Object.keys(response.result)[0]]) {
                    message = result[Object.keys(response.result)[0]];
                }
                AppConfig.setMessage(message);
            }
        }
    };
    // Handle file select

    render() {
        const { StatusList, PermissionList, RoleList, permTitle, PermissionStat, selectPerm } = this.state
        return (
            <Modal
                size='md'
                className="border-style rounded CreateWingPage"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.props.AssignPerm}
            > <Modal.Header>
                    <div className="form-head">
                        <img src={logo} alt="logo" style={{ width: '70px', height: '70px', marginRight: "1rem" }} />
                        <h3> Assign Permissions</h3>
                        <button className='popup-button closeText' onClick={this.handleClose}>Close<span><AiOutlineCloseCircle /></span></button>

                    </div>
                </Modal.Header>
                <div className="p-3">
                    <Modal.Body>
                        <form className="align-items-center event-form" onSubmit={this.onSubmitCreate} autoComplete="off" autoSave="off">
                            <div className='mb-4'>
                                <div className='input-row mb-3'>
                                    <label className="selectIcon">Role <IoIosArrowDropdownCircle className="ml-3" /></label>
                                    <Select
                                        aria-label="Default select example"
                                        placeholder="Select Role"
                                        type="drop"
                                        value={permTitle}
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        onChange={this.onPermTitle}
                                        options={RoleList}
                                        // isMulti
                                        isClearable
                                    />
                                    <div className="d-flex justify-content-start">
                                        {this.state.onPermTitleError ? (<span className='small-font-size text-danger'> {this.state.onPermTitleError}</span>) : ''}
                                    </div>
                                </div>
                            </div>

                            <div className='mb-4'>
                                <div className="mb-3 select">
                                    <label className="selectIcon" >Permission <IoIosArrowDropdownCircle className="ml-3" /></label>
                                    <Select
                                        aria-label="Default select example"
                                        placeholder="Select the Permission"
                                        type="drop"
                                        value={selectPerm}
                                        onChange={this.onSelectPerm}
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        isMulti
                                        options={PermissionList}
                                    />
                                </div>

                                <div className="d-flex justify-content-start">
                                    {this.state.SelectPermissionError ? (<span className='small-font-size text-danger'> {this.state.SelectPermissionError}</span>) : ''}
                                </div>
                            </div>
                            <div className='mb-5 mt-3'>
                                <div className="form-padding mb-3">
                                    <label className="selectIcon">Permission Status<IoIosArrowDropdownCircle className="ml-3" /></label>
                                    <Select
                                        aria-label="Default select example"
                                        placeholder="Select Permission Status"
                                        value={PermissionStat}
                                        type="drop"
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        onChange={this.onPermissionStat}
                                        options={StatusList}
                                        // isMulti
                                        isClearable
                                    />
                                    <div className="d-flex justify-content-start">
                                        {this.state.RoleStatusError ? (<span className='small-font-size text-danger'> {this.state.RoleStatusError}</span>) : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="cta-section jc-sb mt-3">
                                <button type="submit" className="btn  event-cta-trans"
                                    onClick={this.handleClose}>Cancel</button>
                                <button type="submit" className="btn event-cta"
                                >Save</button>

                            </div>
                        </form>
                    </Modal.Body>
                </div>
            </Modal>
        )
    }
}

export default observer(AssignPerm)