import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

// CSS  imports //
import logo from '../../components/img/logo.png'

// Common file imports //
import { CheckUserNameLogin } from "../../common/Validation";

// Api file imports //
import { forgot } from '../../libraries/login';
import AppConfig from '../../modals/AppConfig';

// Components imports //
import { Footer } from '../../components';
import AppLayoutConfig from '../../common/AppLayoutConfig';

import { Button } from 'primereact/button';

class ForgotPassword extends React.Component {
    state = {
        email: '',
        otp: '',
        status: false,
        error: ''
    }
    componentDidMount() {
        AppLayoutConfig.setShowLayout(false);
        AppLayoutConfig.setShowHeader(false);
        AppLayoutConfig.setShowSidebar(false);
        AppLayoutConfig.setShowFooter(false);
        AppLayoutConfig.setShowSideCalendar(false);
        AppLayoutConfig.setShowChat(false);
        this.setState({ status: 'otp' });
    }

    // Render forgot password function
    renderForgotPassword() {
        return (
            <div className="col-md-4 align-center">
                <div className="form-head mb-4 dflex align-center">
                    <img src={logo} alt="logo-login-page" style={{ width: '3.2rem', height: '3.2rem' }} />
                    <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
                </div>

                <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                    <form>
                        <div className="form-head">
                            <h3 className="primary-font font_1-9rem font_bold_600 mb-3">Forgot Password </h3>
                        </div>
                        <div className="mb-4 form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder='name@example.com'
                                label="Email"
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                onFocus={() => this.setState({ emailError: '' })}
                            />
                            {this.state.emailError ? (<span className='small-font-size text-danger'> {this.state.emailError}</span>) : ''}
                        </div>
                        <div className="d-flex justify-content-between">
                            <Link to='/' className="text-decoration-none d-flex">
                                <p className="primary-font my-3 font_bold_500">Login</p>
                            </Link>
                            <Button
                                onClickCapture={(e) => this.onSubmitForgotPassword(e)}
                                type='submit'
                                label="Submit"
                                className="rounded-pill" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    validateEmail = () => {
        const emailError = CheckUserNameLogin(this.state.email);
        if (emailError && emailError === 1) {
            this.setState({ emailError: "Enter email / phone no." });
            return false;
        } else if (emailError && emailError === 2) {
            this.setState({ emailError: "Enter valid email" });
            return false;
        } else if (emailError && emailError === 3) {
            this.setState({ emailError: "Enter valid phone" });
            return false;
        }
        return true;
    };

    // onsubmit function for forget password
    onSubmitForgotPassword = async (e) => {
        e?.preventDefault();
        const emailError = this.validateEmail()
        if (emailError) {
            const requestData = {
                username: this.state.email,
            };
            const response = await forgot(requestData);
            if (response && response.status === 'success') {
                AppConfig.setMessage("Otp sent to mail", false);
                AppConfig.setUserId(response.result.user_id);
            } else if (response.status === 'error') {
                AppConfig.setMessage(response?.result);
            }
            forgot(requestData).then((response) => {
                if (response && response.status === 'success') {
                    this.props.history.replace("/otp");
                }
            });
        }
    }

    render() {
        return (
            <div>
                <section className='login-section'>
                    <div className="admin-login-page row login-page wrapper" style={{ marginTop: '8rem' }}>
                        {this.renderForgotPassword()}
                    </div>
                    <Footer />
                </section>
            </div>

        )
    }


}


export default observer(ForgotPassword);