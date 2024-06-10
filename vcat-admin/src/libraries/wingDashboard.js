import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
/**
*
* @param{email, password)data
*/
export const wingDashboard = async (requestData = {}) => {
    const functionUrl = "wings";
    // const id = User.user_id;
    // console.log("api", id);
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
export const WingAutoPopulate = async (id) => {
    const functionUrl = "wings";
    // const id = User.user_id;
    // console.log("api", id);
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
export const deleteWing = async (id) => {
    const functionUrl = "wings/delete";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, {}, 'DELETE', id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};

export const deleteWingMember = async (id) => {
    const functionUrl = "delete_wing_member";
    try {
        return callApi(functionUrl, {}, 'DELETE', id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }
};

export const updateWing = async (requestData, id) => {
    const functionUrl = "wing/members/update";
    // const id = User.user_id;
    console.log("api", id);
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
export const wingTable = async (requestData = {}) => {
    const functionUrl = "wings/get";
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