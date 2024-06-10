// Signup page
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Common.css';
import Logo from '../media/images/logo.png';
import { observer} from 'mobx-react';
import {signup} from '../apis/User';
import User from '../modals/User';
import AppConfig from '../modals/AppConfig';
import ToastErrorMessage from '../common/ToastErrorMessage';
import { CheckUserName, CheckEmail, CheckPassword, CheckPhone} from "../common/Validation";

class SignUp extends React.Component{
    state={
        name:'',
        email:'',
        phoneNumber:'',
        newPassword:'',
        confirmPassword:'',
        toastErrorMessage:false,
        error:''

    }

    render(){
        return(
            <div>
                <div className="d-flex align-items-center signup-bg">
                    <div className="col-md-12">
                        <div className="d-flex align-items-center justify-content-center">                        
                            <div className="col-md-3">
                                <div className="d-flex justify-content-center">
                                    <img src={Logo} alt='logo'/> 
                                </div>
                                {this.renderSignUp()}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <p className="normal-font-size text-center"> 
                                <span className='blue-font font-weight-bold'>Khakhra House </span> &nbsp; &#9400;2021 &nbsp;
                                <span className='px-2'> User Agreement </span>
                                <span className='px-2'> Privacy Policy </span>
                                <span className='px-2'> Community Guidelines </span>
                                <span className='px-2'> Cookie Policy </span>
                                <span className='px-2'> Copyright Policy </span>
                                <span className='px-2'> Send Feedback </span>
                            </p>  
                        </div>
                        <div className="d-flex justify-content-end m-5">
                            <ToastErrorMessage 
                                toastErrorMessage={this.state.error}
                                errorMessage= {this.state.error ?   this.state.error : null}
                                inputExample={this.state.inputExample}
                                handleClose={()=> this.setState({ toastErrorMessage: false })}
                            />
                        </div>
                       
                    </div>     
                </div>    
             </div>
        )
    }

    // Render signup form 
    renderSignUp() {
        return(
            <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                <h3 className="orange-font font-style py-3">Sign up</h3>
                <form onSubmit={this.onSubmitSignup}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text"  
                            className="form-control" 
                            id="name" 
                            placeholder="Name"
                            value={this.state.name}
                            onChange={(e)=>this.setState({name:e.target.value})}
                        />
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="email"  
                            className="form-control" 
                            id="email" 
                            placeholder="name@example.com"
                            value={this.state.email}
                            onChange={(e)=>this.setState({email:e.target.value})}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="number"  
                            className="form-control" 
                            id="phone" 
                            placeholder="Phone Number"
                            value={this.state.phoneNumber}
                            onChange={(e)=>this.setState({phoneNumber:e.target.value})}
                        />
                        <label htmlFor="phone">Phone</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="newPassword" 
                            placeholder="New Password"
                            value={this.state.newPassword}
                            onChange={(e)=>this.setState({newPassword:e.target.value})}
                        />
                        <label htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="form-floating">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="confirmPassword" 
                            placeholder="Confirm Password"
                            value={this.state.confirmPassword}
                            onChange={(e)=>this.setState({confirmPassword:e.target.value})}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    {/* <div className="d-flex justify-content-center">
                        {this.state.error ?  (<span className='small-font-size text-danger'> {this.state.error}</span>):''}
                    </div> */}
                    <button type='submit' className="btn button-bg-color text-white col-md-12 font-style my-3 py-2">Sign up</button>
                    <div className="d-flex justify-content-between">
                        <p className="small-font-size">Already having a account? </p>
                        <Link to='/sign-in' className="text-decoration-none"><p className="small-font-size orange-font font-weight-bold">Sign in</p></Link>
                    </div>
                </form>        
            </div>
        )
    }

    // Validation for  Name
    validateName = () => {
        const nameError = CheckUserName(this.state.name);
        if (nameError === 1) {
            this.setState({ error: 'Name empty' });
            return false;
        } else if (nameError === 2) {
            this.setState({ error: 'Invalid  name' });
            return false;
        } else return true;
    };

    // Validation for username

    validateEmail = () => {
        const emailError = CheckEmail(this.state.email);
        if (emailError === 1) {
            this.setState({ error: 'Email number empty' });
            return false;
        } else if (emailError === 2) {
            this.setState({ error: 'Please enter your email or phone number in format show below ' ,  inputExample: (<span>Email: example@abc.com <br/>  Phone:+91 9876543210</span>)});
            return false;
        } else return true;
    };

    // Validation for password

    validatePassword = () => {
        const passwordError = CheckPassword(this.state.newPassword);
        if (passwordError === 1) {
            this.setState({ error: 'Password empty' });
            return false;
        } else if (passwordError === 2) {
            this.setState({ error: 'Please enter your password in format show below',  inputExample: 'Abc1@abc'});
            return false;
        } else return true;
    };

    // Validation for phone Number
    validatephoneNumber = () => {
        const phoneNumberError = CheckPhone(this.state.phoneNumber);
        if (phoneNumberError === 1) {
            this.setState({ error: 'Phone Number empty' });
            return false;
        } else if (phoneNumberError === 2) {
            this.setState({ error: 'Invalid phone number' });
            return false;
        } else return true;
    };

    // Validation for password
    // validatePassword = () => {
    //     const passwordError = CheckPassword(this.state.password);
    //     if (passwordError === 1) {
    //         this.setState({ error: 'Password empty' });
    //         return false;
    //     } else if (passwordError === 2) {
    //         this.setState({ error: 'Please enter your password in format show below'});
    //         return false;
    //     } else return true;
    // };

    // Validation for confirm password
    validateConfirmPassword = () => {
        const confirmPasswordError = CheckPassword(this.state.confirmPassword);
        if (confirmPasswordError === 1) {
            this.setState({
                error: 'Empty confirm password'
            });
            return false;
        } else if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({
                error: 'Confirm password is not same as password'
            });
            return false;
        }
        return true;
    };

    // Empty input validation

    ValidateAll = ( ) => {
        const nameInput = this.validateName();
        const emailInput = this.validateEmail();
        const phoneNumberInput = this.validatephoneNumber();
        const passwordInput = this.validatePassword();
        const confirmPasswordInput =this.validateConfirmPassword();
        
        if ( nameInput && emailInput  && phoneNumberInput && passwordInput && confirmPasswordInput ) {
            return true;
        } else {
            return false;   
        }
    }

    // onsubmit sign up function
    onSubmitSignup = async(e) => {
        e.preventDefault();
        const allValidation = this.ValidateAll()
        if (allValidation) {
            const requestData = {
                name:this.state.name,
                email: this.state.email,
                phone_number: this.state.phoneNumber,
                password: this.state.newPassword,
            }
            const response = await signup(requestData );
            if (response && response.status === 'error') {
                this.setState({
                    error: response.result,
                });
            }else{
                User.setUserId(response.result.id)
                User.setName(response.result.name)
                User.setEmail(response.result.email)
                User.setPhone(response.result.phone_number)
                AppConfig.setApiKey(response.result.api_key)
                console.log('mbox', User.user_id)
                this.props.history.replace("/home");
            }
        }
    };
}
export default observer(SignUp);