import { callApi } from './Api';
import './Global';
import User from '../modals/User';
/**
*
* @param{email, password)data
*/
export const careerDashboard = async (requestData = {}) => {
    const functionUrl = "carrier";
    const id = User.user_id;
    console.log("api", id);
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
export const careerForm = async (requestData = {}) => {
    const functionUrl = "carrier/insert";
    // const id = User.user_id;
    // console.log("api", id);
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

export const updateCareer = async (requestData, id) => {
    const functionUrl = "carrier/update";
    // const id = User.user_id;
    // console.log("api", id);
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

export const careerAutoPopulate = async (id) => {
    const functionUrl = "carrier";
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
export const deleteJobPost = async (id) => {
    const functionUrl = "carrier/delete";
    // const id = User.user_id;
    // console.log("api", id);
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

export const careerTable = async (requestData = {}) => {
    const functionUrl = "carrier/get";
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

export const careerPersonalTable = async (requestData = {}) => {
    const functionUrl = "carrier/personal/get";
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