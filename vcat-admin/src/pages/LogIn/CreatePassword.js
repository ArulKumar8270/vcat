
// Imports order //

// Plugins //
import React from 'react'
import { observer } from 'mobx-react';

// CSS  imports //
import logo from '../../components/img/logo.png'

// Common file imports //
import { CheckPassword, ComparePassword } from "../../common/Validation";

// Api file imports //
import { setPassword } from '../../libraries/login';

// Components imports //
import { Footer } from '../../components';
import AppLayoutConfig from '../../common/AppLayoutConfig';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

class CreatePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            password: '',
            // Toaster: 'false',
            emailError: '',
            passwordError: '',
            postId: null,
            username: '',
            status: false,
            error: '',
            conPasswordError: '',
            repeatpassword: '',
            user_id: ''
        };
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

    // Render signup form 
    renderCreatePassword() {
        return (
            <div className="col-md-4 align-center change_pwd_form">
                <div className="form-head mb-4 dflex align-center">
                    <img src={logo} alt="logo-login-page" style={{ width: '3.2rem', height: '3.2rem' }} />
                    <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
                </div>
                <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                    <form className="align-items-center " onSubmit={this.onPressSetPassword} autoComplete="off" autoSave="off">
                        <div className="form-head">
                            <h3 className="primary-font font_bold_600 mb-4">Create new password</h3>
                            <p className='font_bold_500 font_09rem'>Stay updated on your VCAT world </p>
                        </div>
                        <div className="p-float-label mt-4">
                            <Password
                                inputClassName={`form-control ${this.state.passwordError ? "p-invalid validationError" : ""}`}
                                className="w-100"
                                id="newPasswordInput"
                                value={this.state.password}
                                onFocus={() => this.setState({ passwordError: '' })}
                                onChange={({ target: { value: password } }) => this.setState({ password })}
                                feedback={false}
                                toggleMask
                                autoComplete="off"
                            />
                            <label htmlFor="newPasswordInput">New Password</label>
                        </div>
                        <div className="d-flex justify-content-start">
                            {this.state.passwordError ? (<span className='small-font-size text-danger'> {this.state.passwordError}</span>) : ''}
                        </div>
                        <div className="p-float-label mt-4">
                            <Password
                                inputClassName={`form-control ${this.state.conPasswordError ? "p-invalid validationError" : ""}`}
                                className="w-100"
                                id="newConfirmPasswordInput"
                                value={this.state.confirm_password}
                                onFocus={() => this.setState({ conPasswordError: '' })}
                                onChange={({ target: { value: confirm_password } }) => this.setState({ confirm_password })}
                                feedback={false}
                                toggleMask
                                autoComplete="off"
                            />
                            <label htmlFor="newConfirmPasswordInput">Confirm New Password</label>
                        </div>
                        <div className="d-flex justify-content-start">
                            {this.state.conPasswordError ? (<span className='small-font-size text-danger'> {this.state.conPasswordError}</span>) : ''}
                        </div>

                        <div className="cta-section">
                            <Button
                                label='Submit'
                                type="submit"
                                className="rounded-pill w-100 mt-3" style={{ fontSize: '1rem' }}
                            />

                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // Call the API to set the password
    onPressSetPassword = async (event) => {
        event.preventDefault();
        const allValidation = this.validateAll();
        if (allValidation) {
            const requestBody = {
                password: this.state.password,
                repeatpassword: this.state.confirm_password,
            };
            const response = await setPassword(requestBody);
            if (response && response.status === 'success') {
            } else if (response && !response.status) {
            }
            setPassword(requestBody).then((response) => {
                if (response && response.status === 'success') {
                    this.props.history.replace("/dashboard");
                }
            });
        }
    }

    // Checking all the mandatory form field
    validateAll = async () => {
        const passwordInput = await this.passwordCheck();
        const confirmPasswordInput = await this.confirmPasswordCheck();
        if (passwordInput && confirmPasswordInput) {
            return true;
        }
        return false;
    }

    // Checking password field
    passwordCheck = () => {
        const passwordError = CheckPassword(this.state.password);
        if (passwordError && passwordError === 1) {
            this.setState({ passwordError: 'empty password' });
            return false;
        }
        else if (passwordError && passwordError === 2) {
            this.setState({ passwordError: 'enter valid password' });
            return false;
        }
        return true;
    }

    // Checking confirm password field
    confirmPasswordCheck = () => {
        const conPasswordError = CheckPassword(this.state.confirm_password);
        if (conPasswordError && conPasswordError === 1) {
            this.setState({ conPasswordError: 'empty confirm password' });
            return false;
        }
        const comPasswordError = ComparePassword(this.state.password, this.state.confirm_password);
        if (comPasswordError) {
            this.setState({ conPasswordError: 'password match error' });
            return false;
        }
        return true;
    }

    render() {

        return (
            <div>
                {/* <!-- section0: navbar --> */}
                {/* <!-- section1: main --> */}
                <section className='login-section'>
                    <div className="admin-login-page row login-page wrapper" style={{ marginTop: '8rem' }}>
                        {this.renderCreatePassword()}
                    </div>
                    <Footer />
                </section>
            </div>
        )
    }

}

export default observer(CreatePassword)