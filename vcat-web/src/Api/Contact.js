import { callApi } from '../libraries/Api';
import '../libraries/Global';

/**
 *
 * @param{signup with email and password} email and password data
 */
export const contact = async (requestData = {}) => {
    const functionUrl = "contact";
    try {
        return await callApi(functionUrl, requestData)
            .then((response) => {
                return response;
            })
            .catch((error) => {
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};