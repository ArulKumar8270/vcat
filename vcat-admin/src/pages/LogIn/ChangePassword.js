// Imports order //

// Plugins //
import React from 'react';
import { AiFillEye } from "react-icons/ai";
import { observer } from 'mobx-react';

// CSS  imports //
import logo from '../../components/img/logo.png'

// Common file imports //
import { CheckPassword, ComparePassword } from "../../common/Validation";
import AppConfig from '../../modals/AppConfig';

// Api file imports //
import { setChangePassword } from '../../libraries/changePassword';

// Components imports //
import { Footer } from '../../components'
import AppLayoutConfig from '../../common/AppLayoutConfig';


class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            password: '',
            oldPassword: '',
            newPassword: '',
            repeatpassword: '',
            confirmPassword: '',
            showOldPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            error: '',
            status: false,
            user_id: ''
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        // this.toggleShow = this.toggleShow.bind(this);
        AppLayoutConfig.setShowLayout(false);
    AppLayoutConfig.setShowHeader(false);
    AppLayoutConfig.setShowSidebar(false);
    AppLayoutConfig.setShowFooter(false);
    AppLayoutConfig.setShowSideCalendar(false);
    AppLayoutConfig.setShowChat(false);
    }

    componentDidMount() {
        if (this.props.password) {
            this.setState({ password: this.props.password });
        }
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }
    // toggleShow() {
    //     this.setState({ hidden: !this.state.hidden });
    // }

    // Render forgot password function

    renderChangePassword() {
        return (
            <div className="col-md-4 align-center change_pwd_form">
            <div className="form-head mb-4 dflex align-center">
                        <img src={logo} alt="logo-login-page"style={{width:'3.2rem',height:'3.2rem'}}/>
                        <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
            </div>
            <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                <h3 className="mb-4 primary-font font_1-9rem font_bold_600 mb-3">Change Password</h3>
                <form onSubmit={this.onSubmitChangePassword} autoComplete="off" autoSave="off">
                    <div className="form-floating mb-4">
                        <input
                            type={this.state.showOldPassword ? 'text' : 'password'}
                            className="form-control"
                            id="oldPassword"
                            label="Old Password"
                            placeholder='Old Password'
                            value={this.state.oldPassword}
                            onChange={(e) => this.setState({ oldPassword: e.target.value, oldPasswordError: '' })}
                            onFocus={() => this.setState({ oldPasswordError: '' })}
                            InputProps={{
                                endAdornment: (this.state.showOldPassword
                                    ?
                                    <AiFillEye icon='eye-slash-solid' size={20}
                                        onClick={() => this.setState({
                                            showOldPassword: !this.state
                                                .showOldPassword
                                        })}
                                    />
                                    : <AiFillEye icon='eye-solid' size={20}
                                        onClick={() => this.setState({
                                            showOldPassword: !this.state
                                                .showOldPassword
                                        })}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-start">
                        {this.state.oldPasswordError ? (<span className='small-font-size text-danger'> {this.state.oldPasswordError}</span>) : ''}
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type={this.state.showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            label="New Password"
                            placeholder='New Password'
                            className="form-control"
                            value={this.state.newPassword}
                            onChange={(e) => this.setState({ newPassword: e.target.value, newPasswordError: '' })}
                            onFocus={() => this.setState({ newPasswordError: '' })}
                            InputProps={{
                                endAdornment: (this.state.showNewPassword
                                    ?
                                    <AiFillEye icon='eye-slash-solid' size={20}
                                        onClick={() => this.setState({
                                            showNewPassword: !this.state
                                                .showNewPassword
                                        })}
                                    />
                                    : <AiFillEye icon='eye-solid' size={20}
                                        onClick={() => this.setState({
                                            showNewPassword: !this.state
                                                .showNewPassword
                                        })}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-start">
                        {this.state.newPasswordError ? (<span className='small-font-size text-danger'> {this.state.newPasswordError}</span>) : ''}
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            label="Confirm Password"
                            placeholder='Confirm New Password'
                            className="form-control"
                            value={this.state.confirmPassword}
                            onChange={(e) => this.setState({ confirmPassword: e.target.value, confirmPasswordError: '' })}
                            onFocus={() => this.setState({ confirmPasswordError: '' })}
                            InputProps={{
                                endAdornment: (this.state.showConfirmPassword
                                    ?
                                    <AiFillEye icon='eye-slash-solid' size={20}
                                        onClick={() => this.setState({
                                            showConfirmPassword: !this.state
                                                .showConfirmPassword
                                        })}
                                    />
                                    : <AiFillEye icon='eye-solid' size={20}
                                        onClick={() => this.setState({
                                            showConfirmPassword: !this.state
                                                .showConfirmPassword
                                        })}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-start">
                        {this.state.confirmPasswordError ? (<span className='small-font-size text-danger'> {this.state.confirmPasswordError}</span>) : ''}
                    </div>
                    <button type='submit'  style={{ fontSize: '1rem' }} className="btn btn-primary sign-up col-12">Submit</button>
                </form>
            </div>
            </div>

        )
    }

    oldPasswordCheck = () => {
        const oldPasswordError = CheckPassword(this.state.oldPassword);
        if (oldPasswordError && oldPasswordError === 1) {
            this.setState({ oldPasswordError: 'Old password empty' });
            return false;
        } else if (oldPasswordError && oldPasswordError === 2) {
            this.setState({ oldPasswordError: "Enter valid old password" });
            return false;
        }
        return true;
    };

    passwordCheck = () => {
        const passwordError = CheckPassword(this.state.newPassword);
        if (passwordError && passwordError === 1) {
            this.setState({ newPasswordError: 'Empty new password' });
            return false;
        } else if (passwordError && passwordError === 2) {
            this.setState({ newPasswordError: "Enter valid new password" });
            return false;
        }
        return true;
    };

    confirmPasswordCheck = () => {
        const conPasswordError = CheckPassword(this.state.confirmPassword);
        if (conPasswordError && conPasswordError === 1) {
            this.setState({ confirmPasswordError: "Empty Confirm password" });
            return false;
        }
        const comPasswordError = ComparePassword(
            this.state.newPassword,
            this.state.confirmPassword
        );
        if (comPasswordError) {
            this.setState({ confirmPasswordError: "Password doesn't match" });
            return false;
        }
        return true;
    };

    validateAll = async () => {
        const oldPasswordInput = await this.oldPasswordCheck();
        const passwordInput = await this.passwordCheck();
        const confirmPasswordInput = await this.confirmPasswordCheck();
        if (oldPasswordInput && passwordInput && confirmPasswordInput) {
            return true;
        }
        return false;
    };

    // onsubmit function for forget password

    onSubmitChangePassword = async (e) => {
        e.preventDefault();
        const allValidation = this.validateAll()
        if (allValidation) {
            const requestData = {
                oldpassword: this.state.oldPassword,
                newpassword: this.state.newPassword,
                repeatpassword: this.state.confirmPassword
            };
            const response = await setChangePassword(requestData);
            if (response && response.status === 'success') {
                this.props.history.replace("/login");
                AppConfig.setMessage("Password changed successfully", false);
            } else if (response.status === 'error') {
                AppConfig.setMessage(response?.result);
            }
        }
    }

    render() {
        return (
            // <Layout>
            <>
                <div>
                {/* <DashboardHeader /> */}
                {/* <!-- section0: navbar --> */}
                    {/* <!-- section1: main --> */}
                    <section className='login-section'>
                    <div className="admin-login-page row login-page wrapper" style={{marginTop:'8rem'}}>
                    {this.renderChangePassword()}
                    </div>
                        <Footer />
                </section>
            </div>
            </>
        )
    }
}


export default observer(ChangePassword);