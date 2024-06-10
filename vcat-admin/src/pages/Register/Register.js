import React, { createRef } from 'react'
import { observer } from 'mobx-react';
import { Footer } from '../../components';
import logo from '../../components/img/logo.png'
import CoverPic from '../../components/img/s.jpg'
import AppLayoutConfig from '../../common/AppLayoutConfig';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { alphaKeyPress, BloodGroupOptions, numberKeyPress } from '../../common/Common';
import { roleTable } from '../../libraries/Roles';
import { getInviteDetails, memberFormInsert } from '../../libraries/memberDashboard';

class RegisterModel {
    constructor() {
        this.name = null;
        this.icai_membership_no = null;
        // Father/Husbands name
        this.nominee_name = null;
        this.qualification = null;
        this.dob = null;
        this.blood_group = null;
        this.occupation = null;
        this.communication_address = null;
        this.office_address = null;
        this.office_mobile = null;
        this.mobile_number = null;
        this.residence_address = null;
        this.spouse_name = null;
        this.spouse_dob = null;
        this.marriage_date = null;
        this.nos_children = null;
        this.children_name_1 = null;
        this.children_name_2 = null;
        this.email = null;
        this.role_id = null;
        // this.designation_title = null;
        // this.designation = null;
        this.associate_org_member = null;
        this.associate_org_position = null;
        this.become = null;
        this.payment_type = null;
        // this.status = null;
        // this.payment_transaction_id = null;
        // extra
        this.cover_pic = CoverPic;
        this.status = true;
        this.invite_id = null;
    }
}

class Register extends React.Component {
    roleDefaultLabel = "BOT Member";
    constructor(props) {
        super(props);
        this.state = {
            formModel: new RegisterModel(),
            roleOptions: [],
            user_id: null,
            pageLoading: true,
            buttonLoading: false,
        };
        this.toast = createRef();
        AppLayoutConfig.setShowLayout(false);
        AppLayoutConfig.setShowHeader(false);
        AppLayoutConfig.setShowSidebar(false);
        AppLayoutConfig.setShowFooter(false);
        AppLayoutConfig.setShowSideCalendar(false);
        AppLayoutConfig.setShowChat(false);
    }

    componentDidMount = () => {
        this.onLoadFunc();
    };

    onLoadFunc = async () => {
        const { pageLoading } = this.state;
        if (!pageLoading) this.setState({ pageLoading: true });
        await this.setRoleOptions();
        let found = false;
        const { match } = this.props;
        let key;
        if (match) {
            const { params } = match;
            if (params) {
                const { secret_key } = params;
                if (secret_key) {
                    found = true;
                    key = secret_key;
                }
            }
        }
        if (found && key) {
            const response = await getInviteDetails(key);
            if (response) {
                const { status, result: inviteDetails } = response;
                if (status === 'success' && inviteDetails) {
                    const { roleOptions } = this.state;
                    const { id, name, email, phone, created_by } = inviteDetails;
                    const formModel = new RegisterModel();
                    formModel.name = name;
                    formModel.email = email;
                    formModel.mobile_number = phone;
                    formModel.user_id = created_by;
                    formModel.invite_id = id;
                    const result = roleOptions.filter(({ name: label }) => label === this.roleDefaultLabel);
                    if (result.length > 0) {
                        formModel.role_id = result[0]?.id;
                    }
                    this.setState({ formModel });
                } else {
                    window.location.pathname = "";
                }
            }
        } else {
            window.location.pathname = "";
        }
        setTimeout(() => {
            this.setState({ pageLoading: false });
        }, 500);
    };

    setRoleOptions = async () => {
        const response = await roleTable();
        if (response) {
            const { result: roleOptions, status } = response;
            if (status === "success" && roleOptions) {
                // this.setState({ roleOptions: Array.isArray(roleOptions) ? roleOptions : [] });
                if (Array.isArray(roleOptions) && roleOptions.length > 0) {
                    const { formModel } = this.state;

                    let role_id = null;
                    const result = roleOptions.filter(({ name: label }) => label === this.roleDefaultLabel);
                    if (result.length > 0) {
                        role_id = result[0]?.id;
                    }
                    this.setState({
                        roleOptions,
                        formModel: {
                            ...formModel,
                            role_id,
                        },
                    });
                } else {
                    this.setState({ roleOptions: [] });
                }
            }
        }
    };

    showSuccess(message) {
        this.toast.show({ severity: 'success', summary: 'Success !', detail: message, life: 3000 });
    }

    showError(message) {
        this.toast.show({ severity: 'error', summary: 'Error!', detail: message, life: 3000 });
    }

    onSubmit = async (e) => {
        e?.preventDefault();
        const { formModel, buttonLoading } = this.state;
        if (!buttonLoading) {
            this.setState({ buttonLoading: true });
            const requestData = JSON.parse(JSON.stringify(formModel));
            const response = await memberFormInsert(requestData);
            if (response && response.status === "success") {
                // AppConfig.setMessage("Member registered successfully", false);
                this.showSuccess("Member registered successfully");
                window.location.pathname = "";
            } else if (response.status === "error") {
                const { result } = response;
                let message = String(result);
                if (result[Object.keys(response.result)[0]]) {
                    message = result[Object.keys(response.result)[0]];
                }
                // AppConfig.setMessage(message);
                this.showError(message);
            } else if (response.status === "0") {
                if (response.error) {
                    let errorMessages = "";
                    let personNameError = "";
                    let emailError = "";
                    let MobError = "";
                    const errorValidationMsg = "Field empty";
                    Object.keys(response.error).forEach((errKey) => {
                        const err = response.error[errKey];
                        if (err && Array.isArray(err) && err.length > 0) {
                            if (errorMessages === "")
                                errorMessages = err.join("\n");
                            else
                                errorMessages = errorMessages + "\n\n" + err.join("\n");
                        }
                        if (errKey === "mobile_number")
                            MobError = errorValidationMsg;
                        if (errKey === "name")
                            personNameError = errorValidationMsg;
                        if (errKey === "email")
                            emailError = errorValidationMsg;
                    });
                    this.setState({ personNameError, emailError, MobError });
                    // AppConfig.setMessage(errorMessages);
                    this.showError(errorMessages);
                }
            }
            setTimeout(() => {
                this.setState({ buttonLoading: false });
            }, 500);
        }
    };

    setFormModel(prop, value) {
        const { formModel: oldFormModel } = this.state;
        const formModel = { ...oldFormModel };
        formModel[prop] = value;
        this.setState({ formModel });
    }

    render() {
        const {
            formModel,
            roleOptions,
            pageLoading,
            buttonLoading,
        } = this.state;
        if (pageLoading) return <div
            className="bg-white w-100 d-flex flex-column justify-content-center" style={{ height: "100vh" }}>
            <ProgressSpinner />
        </div>

        const {
            name: nameValue,
            icai_membership_no: icaiMembershipNoValue,
            nominee_name: nomineeNameValue,
            qualification: qualificationValue,
            dob: dobValue,
            blood_group: bloodGroupValue,
            occupation: occupationValue,
            communication_address: communicationAddressValue,
            office_address: officeAddressValue,
            office_mobile: officeMobileValue,
            mobile_number: mobileNumberValue,
            residence_address: residenceAddressValue,
            spouse_name: spouseNameValue,
            spouse_dob: spouseDobValue,
            marriage_date: marriageDateValue,
            nos_children: nosChildrenValue,
            children_name_1: childrenName1Value,
            children_name_2: childrenName2Value,
            email: emailValue,
            role_id: roleValue,
            // designation_title: designationTitleValue,
            // designation: designationValue,
            associate_org_member: associateOrgMemberValue,
            associate_org_position: associateOrgPositionValue,
            become: becomeValue,
            payment_type: paymentTypeValue,
            // status: statusValue,
            // payment_transaction_id: paymentTransactionIdValue,
        } = formModel;
        return (
            <div
                className="bg-white w-100 d-flex flex-column justify-content-center"
            >
                <Toast ref={(el) => this.toast = el} />
                <div
                    className="d-flex justify-content-center align-items-center p-3" >
                    <img src={logo} alt="logo-login-page" style={{ width: '3.2rem', height: '3.2rem' }} />
                    <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
                </div>
                <div className="container card col-md-8 col-11 align-self-center shadow-lg d-flex flex-column p-4 mb-3 rounded-3">
                    <div className="row d-flex justify-content-center">
                        <div className="col-auto p-4" style={{
                            fontWeight: "bold",
                            fontSize: "20px",
                        }}>
                            Member Registration
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Name
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={nameValue || ""}
                                disabled
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                ICAI MEMBERSHIP NO
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={icaiMembershipNoValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("icai_membership_no", value)}
                                maxLength="30"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Father's/Husband's Name
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={nomineeNameValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("nominee_name", value)}
                                onKeyPress={alphaKeyPress}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Qualification
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={qualificationValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("qualification", value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Date of Birth
                            </label>
                            <Calendar
                                showIcon
                                autoComplete="off"
                                autoSave="off"
                                inputClassName="form-control"
                                className="w-100"
                                value={dobValue}
                                onChange={({ value }) => this.setFormModel("dob", value)}
                                maxDate={new Date()}
                                readOnlyInput
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Blood Group
                            </label>
                            <Dropdown
                                options={BloodGroupOptions}
                                value={bloodGroupValue}
                                onChange={({ value }) => this.setFormModel("blood_group", value)}
                                placeholder="Select the Blood Group"
                                autoComplete="off"
                                autoSave="off"
                                className="w-100"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 p-0">
                            <div className="d-flex flex-column">
                                <div className="col mb-3">
                                    <label className="d-flex align-items-center">
                                        Occupation
                                    </label>
                                    <InputText
                                        autoComplete="off"
                                        autoSave="off"
                                        className="form-control"
                                        value={occupationValue || ""}
                                        onChange={({ target: { value } }) => this.setFormModel("occupation", value)}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label className="d-flex align-items-center">
                                        Communication Address (Please Select)
                                    </label>
                                    <div className="d-flex align-items-center row">
                                        <div className="field-radiobutton col-auto d-flex align-items-center">
                                            <RadioButton
                                                inputId="communicationAddressOption1"
                                                name="communicationAddressValue"
                                                value="Office"
                                                onChange={({ value }) => this.setFormModel("communication_address", value)}
                                                checked={communicationAddressValue === 'Office'}
                                                autoComplete="off"
                                                autoSave="off"
                                            />
                                            <label
                                                htmlFor="communicationAddressOption1"
                                                className="mt-1 ml-2"
                                            >Office</label>
                                        </div>
                                        <div className="field-radiobutton col-auto d-flex align-items-center">
                                            <RadioButton
                                                inputId="communicationAddressOption2"
                                                name="communicationAddressValue"
                                                value="Residence"
                                                onChange={({ value }) => this.setFormModel("communication_address", value)}
                                                checked={communicationAddressValue === 'Residence'}
                                                autoComplete="off"
                                                autoSave="off"
                                            />
                                            <label
                                                htmlFor="communicationAddressOption2"
                                                className="mt-1 ml-2"
                                            >Residence</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Office Address
                            </label>
                            <InputTextarea
                                rows={5}
                                cols={30}
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={officeAddressValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("office_address", value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 p-0">
                            <div className="d-flex flex-column">
                                <div className="col mb-3">
                                    <label className="d-flex align-items-center">
                                        Office Mobile Number
                                    </label>
                                    <InputText
                                        autoComplete="off"
                                        autoSave="off"
                                        className="form-control"
                                        value={officeMobileValue || ""}
                                        onChange={({ target: { value } }) => this.setFormModel("office_mobile", value)}
                                        onKeyPress={numberKeyPress}
                                        maxLength="10"
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label className="d-flex align-items-center">
                                        Mobile Number
                                    </label>
                                    <InputText
                                        autoComplete="off"
                                        autoSave="off"
                                        className="form-control"
                                        value={mobileNumberValue || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Residential Address
                            </label>
                            <InputTextarea
                                rows={5}
                                cols={30}
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={residenceAddressValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("residence_address", value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Name of Spouse
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={spouseNameValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("spouse_name", value)}
                                onKeyPress={alphaKeyPress}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Spouse Date of Birth
                            </label>
                            <Calendar
                                showIcon
                                autoComplete="off"
                                autoSave="off"
                                inputClassName="form-control"
                                className="w-100"
                                value={spouseDobValue}
                                onChange={({ value }) => this.setFormModel("spouse_dob", value)}
                                maxDate={new Date()}
                                readOnlyInput
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Marriage Date
                            </label>
                            <Calendar
                                showIcon
                                autoComplete="off"
                                autoSave="off"
                                inputClassName="form-control"
                                className="w-100"
                                value={marriageDateValue}
                                onChange={({ value }) => this.setFormModel("marriage_date", value)}
                                maxDate={new Date()}
                                readOnlyInput
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                No's of Children
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={nosChildrenValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("nos_children", value)}
                                onKeyPress={numberKeyPress}
                                maxLength="2"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Child 1 Name
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={childrenName1Value || ""}
                                onChange={({ target: { value } }) => this.setFormModel("children_name_1", value)}
                                onKeyPress={alphaKeyPress}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Child 2 Name
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={childrenName2Value || ""}
                                onChange={({ target: { value } }) => this.setFormModel("children_name_2", value)}
                                onKeyPress={alphaKeyPress}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Email
                            </label>
                            <InputText
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={emailValue || ""}
                                disabled
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                Role
                            </label>
                            <Dropdown
                                options={roleOptions || []}
                                optionLabel="name"
                                optionValue="id"
                                value={roleValue}
                                onChange={({ value }) => this.setFormModel("role_id", value)}
                                placeholder="Select the Roles"
                                autoComplete="off"
                                autoSave="off"
                                className="w-100"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="d-flex align-items-center">
                                If associated with any Professional Body, please furnish the Name of the Organization and Membership Number:
                            </label>
                            <InputTextarea
                                rows={5}
                                cols={30}
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={associateOrgMemberValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("associate_org_member", value)}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label className="d-flex align-items-center">
                                If associated with any Charitable/Social Organization, please furnish the Name of the Organization and position held:
                            </label>
                            <InputTextarea
                                rows={5}
                                cols={30}
                                autoComplete="off"
                                autoSave="off"
                                className="form-control"
                                value={associateOrgPositionValue || ""}
                                onChange={({ target: { value } }) => this.setFormModel("associate_org_position", value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                I would like to become (Please Select)
                            </label>
                            <div className="d-flex align-items-center row">
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="becomeOption1"
                                        name="becomeValue"
                                        value="life_trustee"
                                        onChange={({ value }) => this.setFormModel("become", value)}
                                        checked={becomeValue === 'life_trustee'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="becomeOption1"
                                        className="mt-1 ml-2"
                                    >Life Trustee(Rs.25,000/-)</label>
                                </div>
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="becomeOption2"
                                        name="becomeValue"
                                        value="member"
                                        onChange={({ value }) => this.setFormModel("become", value)}
                                        checked={becomeValue === 'member'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="becomeOption2"
                                        className="mt-1 ml-2"
                                    >Member (1,001/-)</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="d-flex align-items-center">
                                I'm enclosing herewith
                            </label>
                            <div className="d-flex align-items-center row">
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="paymentTypeOption1"
                                        name="paymentTypeValue"
                                        value="cash"
                                        onChange={({ value }) => this.setFormModel("payment_type", value)}
                                        checked={paymentTypeValue === 'cash'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="paymentTypeOption1"
                                        className="mt-1 ml-2"
                                    >Cash</label>
                                </div>
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="paymentTypeOption2"
                                        name="paymentTypeValue"
                                        value="online_transfer"
                                        onChange={({ value }) => this.setFormModel("payment_type", value)}
                                        checked={paymentTypeValue === 'online_transfer'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="paymentTypeOption2"
                                        className="mt-1 ml-2"
                                    >Online Transfer</label>
                                </div>
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="paymentTypeOption1"
                                        name="paymentTypeValue"
                                        value="cheque"
                                        onChange={({ value }) => this.setFormModel("payment_type", value)}
                                        checked={paymentTypeValue === 'cheque'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="paymentTypeOption1"
                                        className="mt-1 ml-2"
                                    >Cheque</label>
                                </div>
                                <div className="field-radiobutton col-auto d-flex align-items-center">
                                    <RadioButton
                                        inputId="paymentTypeOption2"
                                        name="paymentTypeValue"
                                        value="dd"
                                        onChange={({ value }) => this.setFormModel("payment_type", value)}
                                        checked={paymentTypeValue === 'dd'}
                                        autoComplete="off"
                                        autoSave="off"
                                    />
                                    <label
                                        htmlFor="paymentTypeOption2"
                                        className="mt-1 ml-2"
                                    >Demand Drafts (DD)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button
                            label="Register Member"
                            aria-label="Register Member"
                            className="rounded-pill p-3 mt-2"
                            onClick={this.onSubmit}
                            loading={buttonLoading}
                        />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default observer(Register);