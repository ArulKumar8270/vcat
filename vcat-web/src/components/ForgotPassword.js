// Forgot passsword Page

import React from 'react';
import "../../css/common.css";
import {ThemeButton, CustomInput} from "../../common/Components";
import {CheckEmail} from "../../common/Validation";
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
// import {initPasswordReset} from "../../common/apis/Auth";
// import { AesUtil } from "../../libraries/Secure";
// import { observer } from "mobx-react";
import LoadingBar from 'react-top-loading-bar'
import ForgetImg from '../../assets/images/forgot.svg';
import Icomoon from '../../libraries/Icomoon';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



// const AES = new AesUtil(128, 168);
class ForgotPassword extends React.Component {
    state={
        userName:'',
        userNameErr:'',
        toastMessage:false,
        progress:''
    }

    render() {
        return (
            <Container fluid noGutters md className="themeBgColor">
                <LoadingBar
                    color='#DF5A14'
                    progress={this.state.progress}
                    onLoaderFinished={() => this.setState({progress:100})}
                />  
                <Row>
                    <Col sm={12} md={8}>
                        {this.renderForgotPasswordImage()}
                    </Col>
                    <Col sm={6} md={4} className="bg-white">
                        {this.renderForgotPassword()}
                    </Col>
                </Row>
            </Container>      
        )
    }

    // Render Forget password function


    // Render forgot password Image function

    renderForgotPasswordImage () {
        return(
            <>
                <Row className="pt-3 my-3 pl-3">  
                    <Icomoon className="pointer" color="#DF5A14" icon="larrow" size={20} onClick={()=>this.props.history.goBack()}/>
                    <p className="normalText pl-2 font-weight-bold pointer themeActiveFont" onClick={()=>this.props.history.goBack()}>Back</p>
                </Row>
                <img className="my-1"  alt="Forgot" src={ForgetImg} width="100%" height="693" />
            </> 
        )
    }

    // Render forgot password function

    renderForgotPassword() {
        return(
            <Container className="py-5 my-5">
                <form onSubmit={this.onSubmitForgotPassword}>
                    <Row className="pl-3 d-flex justify-content-center pt-5 my-5">
                        <h3 className="themeActiveFont">Forgot Password</h3>
                    </Row>
                    <Row className="pl-3">
                        <h4 className="fontColor bigText">Oops!</h4>
                    </Row>
                    <Row className="pl-3 pt-3">
                        <p className="smallText">Please enter your email id.</p>  
                    </Row>
                    <Row className="px-2 pt-3">
                        <CustomInput  
                            placeholder="Email" 
                            fieldStyle="outlined"
                            value={this.state.userName}
                            onChange={(e)=>this.setState({userName:e.target.value})}
                            iconName="email"
                            iconSize={30}
                            error
                        />
                    </Row>
                    {this.renderToastMessage()}
                    <Row className="pl-3 pt-3"> 
                        <ThemeButton type="submit" wrapperClass="btn loginBgColor col-md-12 fontStyle font-weight-bold megaText mt-3 text-white fontColor py-3" label="SEND ME NEW PASSWORD"/>
                    </Row>
                </form>
            </Container> 
        )
    }
    

    // Empty input validation
    ValidateAll = ( ) => {
        const userNameInput = this.validateUsername();
        if (userNameInput ) {
            return true;
        } else {
            return false;   
        }
    }
    // Validation for username
    validateUsername = () => {
        const usernameError = CheckEmail(this.state.userName);
        if (usernameError === 1) {
            this.setState({ userNameErr: 'Email empty' });
            return false;
        } else if (usernameError === 2) {
            this.setState({ userNameErr: 'Invalid user name' });
            return false;
        } else return true;
    };

     renderToastMessage = () =>{
        return (
            <div className="borderStyle borderColor">
              <Toast onClose={() => this.props.history.replace('/login')} show={this.state.toastMessage} delay={3000} autohide>
                    <Toast.Body>Check your Mail</Toast.Body>
              </Toast>
            </div>
        );
      }

    
    // onsubmit function for forget password

    onSubmitForgotPassword = async (e) =>{
        e.preventDefault();
        const allValidation = this.ValidateAll()
        if (allValidation) {
            // this.setState({ error: "", loading: true });
            // let requestBody = {
            // userName: await AES.encrypt(this.state.userName),
            // };
            // const response = await initPasswordReset(requestBody);
            // if (response && response.status && response.result) {
                this.setState({progress:100, toastMessage:true}) 
            //     } else if (response && !response.status) {
            //     this.setState({ error: response.message, loading: false });
            //     }
            //     return false;
             }; 
        }
}




export default ForgotPassword