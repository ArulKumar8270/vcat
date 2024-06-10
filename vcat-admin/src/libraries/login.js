import AppConfig from '../modals/AppConfig';
import User from '../modals/User';
import { callApi } from './Api';
import './Global';
/**
*
* @param{email, password)data
*/
export const login = async (requestData = {}) => {
    const functionUrl = "login";

    console.log("api");
    try {
        return await callApi(functionUrl, requestData)
            .then((response) => {
                if (response.status === 'success') {
                    const id = response.result.user_id;
                    User.setUserId(id);
                }
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};

export const setPassword = async (requestData = {}) => {
    const functionUrl = "create_password";
    const id = AppConfig.user_id

    console.log("api id", id);
    try {
        //id put after put -------
        return await callApi(functionUrl, requestData, 'PUT', id)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};

export const forgot = async (requestData = {}) => {
    const functionUrl = "request_otp";
    console.log("api");
    try {
        return await callApi(functionUrl, requestData)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};

export const verifyOtp = async (requestData = {}) => {
    const functionUrl = "verify_otp";
    console.log("api");
    try {
        return await callApi(functionUrl, requestData,'POST')
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};
export const resendOtp = async (requestData = {}) => {
    const functionUrl = "resend_otp";
    try {
        return await callApi(functionUrl, requestData,'POST')
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};