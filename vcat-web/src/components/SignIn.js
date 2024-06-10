// // Sign in page
// import React from "react";
// import { Link } from "react-router-dom";
// import Logo from "../media/images/logo.png";
// import AppConfig from "../modals/AppConfig";
// import { observer } from "mobx-react";
// import ToastErrorMessage from "../common/ToastErrorMessage";
// import { CheckEmail, CheckPassword } from "../common/Validation";
// import { signin } from "../apis/User";

// class SignIn extends React.Component {
//   state = {
//     email: "",
//     password: "",
//     errror: "",
//     inputExample: "",
//     toastErrorMessage: false,
//   };
//   render() {
//     return (
//       <div>
//         <div className="d-flex align-items-center signup-bg">
//           <div className="col-md-12">
//             <div className="d-flex align-items-center justify-content-center">
//               <div className="col-md-3">
//                 <div className="d-flex justify-content-center">
//                   <img src={Logo} alt="logo" />
//                 </div>
//                 {this.renderSignIn()}
//               </div>
//             </div>
//             <div className="d-flex justify-content-center my-5">
//               <p className="normal-font-size text-center">
//                 {" "}
//                 <span className="blue-font font-weight-bold">
//                   Khakhra House{" "}
//                 </span>{" "}
//                 &nbsp; &#9400;2021 &nbsp;
//                 <span className="px-2"> User Agreement </span>
//                 <span className="px-2"> Privacy Policy </span>
//                 <span className="px-2"> Community Guidelines </span>
//                 <span className="px-2"> Cookie Policy </span>
//                 <span className="px-2"> Copyright Policy </span>
//                 <span className="px-2"> Send Feedback </span>
//               </p>
//             </div>
//             <div className="d-flex justify-content-end m-5">
//               {this.state.error ? (
//                 <ToastErrorMessage
//                   toastErrorMessage={this.state.error}
//                   errorMessage={this.state.error ? this.state.error : ""}
//                   inputExample={this.state.inputExample}
//                   handleClose={() =>
//                     this.setState({ toastErrorMessage: false })
//                   }
//                 />
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render signup form
//   renderSignIn() {
//     return (
//       <div className="col-md-12 rounded bg-white shadow p-3 my-3">
//         <h3 className="orange-font font-style mb-3">Sign In</h3>
//         <form onSubmit={this.onSubmitSignin}>
//           <div className="form-floating mb-3">
//             <input
//               type="text"
//               className="form-control"
//               id="floatingInput"
//               placeholder="name@example.com"
//               value={this.state.email}
//               onChange={(e) =>
//                 this.setState({ email: e.target.value, error: "" })
//               }
//             />
//             <label htmlFor="floatingInput">Email or Phone</label>
//           </div>
//           <div className="form-floating">
//             <input
//               type="password"
//               className="form-control"
//               id="floatingPassword"
//               placeholder="Password"
//               value={this.state.password}
//               onChange={(e) =>
//                 this.setState({ password: e.target.value, error: "" })
//               }
//             />
//             <label htmlFor="floatingPassword">Password</label>
//           </div>
//           <Link to="/forgot-password" className="text-decoration-none">
//             <p className="small-font-size blue-font font-weight-bold my-3">
//               Forgot Password?
//             </p>
//           </Link>
//           <button
//             type="submit"
//             className="btn button-bg-color text-white col-md-12 font-style my-3"
//           >
//             Sign in
//           </button>
//           <div className="d-flex justify-content-between my-3">
//             <p className="small-font-size">Dont have a account? </p>
//             <Link to="/sign-up" className="text-decoration-none">
//               <p className="small-font-size orange-font font-weight-bold">
//                 Create New Account
//               </p>
//             </Link>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // Validation for username

//   validateUsername = () => {
//     const usernameError = CheckEmail(this.state.email);
//     if (usernameError === 1) {
//       AppConfig.setMessage("Email or phone number empty");
//       return false;
//     } else if (usernameError === 2) {
//       AppConfig.setMessage(
//         "Please enter your email or phone number in format show below "
//       );
//       return false;
//     } else return true;
//   };

//   // Validation for password

//   validatePassword = () => {
//     const passwordError = CheckPassword(this.state.password);
//     if (passwordError === 1) {
//       AppConfig.setMessage("Password empty");
//       return false;
//     } else if (passwordError === 2) {
//       AppConfig.setMessage("Please enter your password in format show below");
//       return false;
//     } else return true;
//   };

//   // Empty input validation

//   ValidateAll = () => {
//     const userNameInput = this.validateUsername();
//     const passwordInput = this.validatePassword();
//     if (userNameInput && passwordInput) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   // on submit sign in function
//   onSubmitSignin = async (e) => {
//     e.preventDefault();
//     const allValidation = this.ValidateAll();
//     if (allValidation) {
//       const requestData = {
//         email: this.state.email,
//         password: this.state.password,
//       };
//       signin(requestData).then((response) => {
//         if (response && response.status === "success") {
//           this.props.history.replace("/home");
//         }
//       });
//     }
//   };
// }
// export default observer(SignIn);

// Sign in page
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../media/images/logo.png';
import AppConfig from '../modals/AppConfig';
import { observer} from 'mobx-react';
import ToastErrorMessage from '../common/ToastErrorMessage';
import {CheckEmail, CheckPassword} from "../common/Validation";
import { signin } from '../apis/User';

class SignIn extends React.Component{
    state={
        email:'',
        password:'',
        errror:'',
        inputExample:'',
        toastErrorMessage:false
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
                                {this.renderSignIn()}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center my-5">
                            <p className="normal-font-size text-center"> <span className='blue-font font-weight-bold'>Khakhra House </span> &nbsp; &#9400;2021 &nbsp;
                            <span className='px-2'> User Agreement </span>
                            <span className='px-2'> Privacy Policy </span>
                            <span className='px-2'> Community Guidelines </span>
                            <span className='px-2'> Cookie Policy </span>
                            <span className='px-2'> Copyright Policy </span>
                            <span className='px-2'> Send Feedback </span>
                            </p>  
                        </div>
                        <div className="d-flex justify-content-end m-5">
                        {this.state.error ?
                            <ToastErrorMessage 
                                toastErrorMessage={this.state.error}
                                errorMessage= {this.state.error ?   this.state.error: ''}
                                inputExample={this.state.inputExample}
                                handleClose={()=> this.setState({ toastErrorMessage: false })}
                            />
                            :
                            null
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Render signup form 
    renderSignIn() {
        return(
            <div className="col-md-12 rounded bg-white shadow p-3 my-3">
                <h3 className="orange-font font-style mb-3">Sign In</h3>
                <form onSubmit={this.onSubmitSignin}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text"  
                            className="form-control" 
                            id="floatingInput" 
                            placeholder="name@example.com"
                            value={this.state.email}
                            onChange={(e)=>this.setState({email:e.target.value, error:''})}
                        />
                        <label htmlFor="floatingInput">Email or Phone</label>
                    </div>
                    <div className="form-floating">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="floatingPassword" 
                            placeholder="Password"
                            value={this.state.password}
                            onChange={(e)=>this.setState({password:e.target.value, error:''})}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <Link to='/forgot-password' className="text-decoration-none"><p className="small-font-size blue-font font-weight-bold my-3">Forgot Password?</p></Link>
                    <button type='submit' className="btn button-bg-color text-white col-md-12 font-style my-3">Sign in</button>
                    <div className="d-flex justify-content-between my-3">
                        <p className="small-font-size">Dont have a account? </p>
                        <Link to='/sign-up' className="text-decoration-none"><p className="small-font-size orange-font font-weight-bold">Create New Account</p></Link>
                    </div>
                </form>
            </div>
        )
    }

    // Validation for username

    validateUsername = () => {
        const usernameError = CheckEmail(this.state.email);
        if (usernameError === 1) {
            AppConfig.setMessage('Email or phone number empty');
            return false;
        } else if (usernameError === 2) {
            AppConfig.setMessage('Please enter your email or phone number in format show below ');
            return false;
        } else return true;
    };

    // Validation for password

    validatePassword = () => {
        const passwordError = CheckPassword(this.state.password);
        if (passwordError === 1) {
            AppConfig.setMessage('Password empty');
            return false;
        } else if (passwordError === 2) {
            AppConfig.setMessage('Please enter your password in format show below');
            return false;
        } else return true;
    };

    // Empty input validation

    ValidateAll = ( ) => {
        const userNameInput = this.validateUsername();
        const passwordInput = this.validatePassword();
        if (userNameInput && passwordInput) {
            return true;
        } else {
            return false;   
        }
    }

    // on submit sign in function
    onSubmitSignin = async(e)=>{
        e.preventDefault();
        const allValidation = this.ValidateAll()
        if (allValidation) {
            const requestData = {
                email: this.state.email,
                password: this.state.password,
            }
            signin(requestData).then((response) => {
                if (response && response.status === 'success') {
                    this.props.history.replace("/home");
                }
            });  
        } 
    };
    
}
export default observer(SignIn);