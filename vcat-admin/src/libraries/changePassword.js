import { callApi } from './Api';
import './Global';
import User from '../modals/User';
/**
*
* @param{email, password)data
*/
export const setChangePassword = async (requestData = {}) => {
    const functionUrl = "changepassword";
    const id = User.user_id

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

