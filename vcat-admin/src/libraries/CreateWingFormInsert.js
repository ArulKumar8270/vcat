import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
/**
*
* @param{email, password)data
*/
export const CreateWingFormInsert = async (requestData = {}) => {
    const functionUrl = "wings/insert";
    try {
        return callApi(functionUrl, requestData, 'POST')
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

