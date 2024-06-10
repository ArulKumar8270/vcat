import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import { observer } from 'mobx-react';

// CSS  imports //
import logo from '../../components/img/logo.png'

// Common file imports //
import AppConfig from '../../modals/AppConfig';
import { OtpCheck } from "../../common/Validation";

// Api file imports //
import { resendOtp, verifyOtp } from '../../libraries/login';

// Components imports //
import { Footer } from '../../components';
import OtpInput from './OtpInput';
import AppLayoutConfig from '../../common/AppLayoutConfig';
import { Button } from 'primereact/button';


class Otp extends React.Component {
    state = {
        username: '',
        otp: '',
        status: false,
        resend: false,
        error: '',
        user_id: ''
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

    getOtp = (otp) => {
        this.setState({ otp });
    }

    validateOtp = () => {
        console.log("e", this.state.otp)
        const otpError = OtpCheck(this.state.otp);
        console.log("otpError", otpError)
        if (otpError && otpError === 1) {
            this.setState({ otpError: 'Empty otp' });
            return false;
        }
        else return true;
    };

    ValidateAll = () => {
        const OTP = this.validateOtp();
        console.log("OTP", OTP)
        if (OTP) {
            return true;
        } else {
            return false;
        }

    }

    onPressOtp = async (event) => {
        event.preventDefault();
        const allValidation = this.ValidateAll();
        if (allValidation) {
            const user_id = AppConfig.user_id;
            const requestBody = {
                otp: this.state.otp,
                user_id: user_id
            };
            const response = await verifyOtp(requestBody);
            if (response && response.status === 'success') {
                AppConfig.setMessage('OTP verified', false);
                this.props.history.replace("/create");                
            } else if (response.status === 'error') {
                AppConfig.setMessage(response?.result);
            }
            return false;
        }
    }

    ResendOtp = async (e) => {
        e?.preventDefault();
        const { user_id } = AppConfig;
        if (user_id) {
            const requestBody = {
                user_id
            };
            const response = await resendOtp(requestBody);
            if (response && response.status === 'success') {
                AppConfig.setMessage('OTP verified', false);
            } else if (response.status === 'error') {
                AppConfig.setMessage(response.result);
            }
        } else {
            window.location.pathname = "forgot";
        }
    }

    render() {
        return (
            <div>
                <section className='login-section'>
                    <div className="admin-login-page  login-page" >
                        <div className="col-md-3 align-center">
                            <div className="form-head mb-4 dflex align-center">
                                <img src={logo} alt="logo-login-page" style={{ width: '3.2rem', height: '3.2rem' }} />
                                <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
                            </div>
                            <div className="col-md-12 rounded bg-white shadow p-3 my-3 d-flex flex-column">
                                <form onSubmit={this.onPressOtp} autoComplete="off" autoSave="off">
                                    <div className="form-head">
                                        <h3 className="primary-font font_1-9rem font_bold_600 mb-3">OTP sent</h3>
                                    </div>
                                    <label className='primary-font' htmlFor="floatingInput">Enter OTP</label>
                                    <OtpInput getOtp={(otp) => this.getOtp(otp)} />
                                    {this.state.otpError ? (<span className='small-font-size text-danger'> {this.state.otpError}</span>) : ''}
                                    <Button
                                        label='Submit'
                                        type='submit'
                                        className="w-100 rounded-3" />
                                </form>
                                <div className='col-md-12 d-flex justify-content-between align-items-center p-0 m-0 mt-3'>
                                    <Link to='/forgot'><BsArrowLeftShort />  Didn't receive OTP</Link>
                                    <div className="create-event-trans col-auto m-0 p-0">
                                        <Button
                                            label="Resend otp"
                                            onClickCapture={this.ResendOtp}
                                            className="m-0 p-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
            </div>
        )
    }

}


export default observer(Otp)
