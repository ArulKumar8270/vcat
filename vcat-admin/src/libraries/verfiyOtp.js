import { callApi } from './Api';
import './Global';
/**
*
* @param{email, password)data
*/
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
