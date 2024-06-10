import { callApi } from './Api';
import './Global';
/**
*
* @param{email, password)data
*/
export const RoleList = async () => {
    const functionUrl = "roles/dropdown/list";
    try {
        return callApi(functionUrl, {}, 'GET')
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

