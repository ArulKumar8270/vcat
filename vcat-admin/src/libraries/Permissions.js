import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
/**
*
* @param{email, password)data
*/
export const Permissions = async (requestData = {}) => {
    const functionUrl = "role_permissions";
    try {
        return callApi(functionUrl,requestData, 'POST')
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
export const PermAutoPopulate = async (id) => {
    const functionUrl = "permissions";
    try {
        return callApi(functionUrl, {}, 'GET', id)
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
export const updatePerm = async (requestData, id) => {
    const functionUrl = "permissions/update";
    try {
        return callApi(functionUrl, requestData, 'PUT', id)
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
export const CreatePermInsert = async (requestData={}) => {
    const functionUrl = "permissions/insert";
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
export const deletePerm = async (id) => {
    const functionUrl = "permissions/delete";
    try {
        return callApi(functionUrl, {}, 'DELETE', id)
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

export const assignPerm = async (requestData={},id) => {
    const functionUrl = "role_permissions/insert";
    try {
        return callApi(functionUrl, requestData, 'PUT',id)
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
export const permissionTable = async (requestData = {}) => {
    const functionUrl = "role_permissions/get";
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
export const permissionDropdown = async () => {
    const functionUrl = "dropdown/permissions";
    try {
        return callApi(functionUrl,{}, 'GET')
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