import React from 'react'
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components';
import { db } from '../../firebase';
import { doc, collection, setDoc, query, getDocs, where, updateDoc } from "firebase/firestore";
import moment from 'moment';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

// CSS  imports //
import logo from '../../components/img/logo.png'

// Common file imports //
import User from '../../modals/User';
import { CheckEmail, CheckPassword, CheckPhone, CheckUserNameLogin } from "../../common/Validation";
import AppConfig from '../../modals/AppConfig';

// Api file imports //
import { login } from '../../libraries/login';
import Notifications from '../../common/Notifications';
import AppLayoutConfig from '../../common/AppLayoutConfig';
import { Button } from 'primereact/button';

// Components imports //


class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            password: '',
            // Toaster: 'false',
            emailError: '',
            passwordError: '',
            usernameErr: "",
            postId: null,
            username: '',
            status: false,
            error: ''
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.toggleShow = this.toggleShow.bind(this);

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

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    // Render signUp form 
    renderLogin() {
        return (
            <div className="col-md-4 align-center">
                <div className="form-head mb-4 dflex align-center">
                    <img src={logo} alt="logo-login-page" style={{ width: '3.2rem', height: '3.2rem' }} />
                    <h1 className="font_bold_700 primary-font mb-0 ml-3"> VCAT </h1>
                </div>
                <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                    <form className="align-items-center " autoComplete="off" autoSave="off" >
                        <div className="form-head">
                            <h3 className="primary-font font_bold_600 mb-4"> Sign in</h3>
                            <p className='font_bold_500 font_09rem'>Stay updated on your VCAT world </p>
                        </div>
                        <div className="form-floating mb-4">
                            <InputText
                                id="usernameInput"
                                placeholder={this.state.emailError || this.state.usernameErr || "Email/Phone"}
                                value={this.state.username}
                                className={`form-control ${this.state.emailError || this.state.usernameErr ? "p-invalid validationError" : ""}`}
                                onFocus={() => this.setState({ emailError: '', usernameErr: '' })}
                                onChange={({ target: { value: username } }) => this.setState({ username })}
                                autoComplete="off"
                                autoSave="off"
                                autoFocus
                                onSubmit={this.onSubmitLogin}
                            />
                        </div>
                        <div className="form-floating mb-4">
                            <Password
                                inputClassName={`form-control ${this.state.passwordError ? "p-invalid validationError" : ""}`}
                                className="w-100"
                                id="passwordInput"
                                placeholder={this.state.passwordError || "Password"}
                                value={this.state.password}
                                onFocus={() => this.setState({ passwordError: '' })}
                                onChange={({ target: { value: password } }) => this.setState({ password })}
                                feedback={false}
                                toggleMask
                                autoComplete="off"
                                onSubmit={this.onSubmitLogin}
                            />
                        </div>
                        <div className="cta-section">
                            <Link to='/forgot' className="text-decoration-none sign-up forgot-password "><p className="small-font-size font_bold_500 primary-font forgot-pwd">Forgot Password?</p></Link>
                            {this.state.error ? (<span className='small-font-size text-danger'> {this.state.error}</span>) : ''}

                            <Button
                                label='Sign In'
                                type="submit"
                                className="btn-primary text-white w-100 rounded-pill"
                                style={{ fontSize: '1rem' }}
                                onClickCapture={this.onSubmitLogin}
                            // onSubmit={this.onSubmitLogin}
                            />
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    validateEmail = () => {
        const emailError = CheckEmail(this.state.username);
        if (emailError === 1) {
            this.setState({ emailError: "Field empty" });
            return false;
        } else
            if (emailError === 2) {
                this.setState({ emailError: "Enter valid email" });
                AppConfig.setMessage("Enter valid email");
                return false;
            }
            else return true;
    };


    validateUserName = () => {
        console.log("user name error", this.state.usernameErr)
        const usernameErr = CheckUserNameLogin(this.state.username);
        if (usernameErr && usernameErr === 1) {
            this.setState({ usernameError: "Empty email / phone no." });
            return false;
        } else if (usernameErr && usernameErr === 2) {
            this.setState({ usernameError: "Enter valid email" });
            return false;
        } else if (usernameErr && usernameErr === 3) {
            this.setState({ usernameError: "Enter valid phone" });
            return false;
        }
        return true;
    };
    validatePassword = () => {
        const passwordError = CheckPassword(this.state.password);
        if (passwordError === 1) {
            this.setState({ passwordError: "Field empty" });
            return false;
        } else return true;
    };

    // Empty input validation

    ValidateAll = () => {
        this.validateUserName();
        const checkUsername = CheckEmail(this.state.username) || CheckPhone(this.state.username);
        const passwordInput = this.validatePassword();
        if (checkUsername && passwordInput) {
            return true;
        } else {
            return false;
        }
    }

    // on submit sign in function
    onSubmitLogin = async (e) => {
        e.preventDefault();
        const allValidation = this.ValidateAll()
        if (allValidation) {
            const requestData = {
                username: this.state.username,
                password: this.state.password,
            }
            const response = await login(requestData);
            if (response && response.status === 'success') {
                AppConfig.setApiKey(response.result.token);
                User.setUserId(response.result.user_id);
                Notifications.setCurrentId(response.result.user_id);
                await this.sendStatus();
            } else if (response.status === 'error') {
                const result = response.result;
                let message = result;
                if (result[Object.keys(response.result)]) {
                    message = result[Object.keys(response.result)];
                }
                this.setState({
                    passwordError: response.result || message || response.result.message,
                    emailError: response.result || message || response.result.message
                });
                console.log("response.result|| message || response.result.message", message)
                if (response.result === "your password is wrong") {
                    AppConfig.setMessage("your password is wrong");
                } else {
                    AppConfig.setMessage(message);
                }
            }
        }
    };

    sendStatus = async (e) => {
        const StatusCommonId = moment().unix().toString();
        const Id = User?.user_id;
        const q = query(collection(db, 'Status'), where('user_id', '==', Id));
        const querySnapshot = await getDocs(q);
        let statusId = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (User.user_id === data.user_id) {
                statusId = data.StatusCommonId;
            }
        });
        if (statusId) {
            User.setStatusCommonId(statusId);
            const q = doc(db, "Status", statusId);
            await updateDoc(q, {
                status: true
            });
        } else {
            User.setStatusCommonId(StatusCommonId);
            const lastSeen = moment().format("YYYY-MM-DD  hh:mm:ss");
            await setDoc(doc(collection(db, 'Status'), StatusCommonId), {
                status: true,
                user_id: Id,
                lastSeen,
                StatusCommonId: StatusCommonId
            });
        }
    }

    render() {
        return (
            <div>
                <section className='login-section'>
                    <div className="admin-login-page row login-page wrapper" style={{ marginTop: '8rem' }}>
                        {this.renderLogin()}
                    </div>
                    <Footer />
                </section>
            </div>
        )
    }
}

export default observer(LogIn);