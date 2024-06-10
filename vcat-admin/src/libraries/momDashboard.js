import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
/**
*
* @param{email, password)data
*/
export const momDashboard = async (requestData = {}) => {
    const functionUrl = "moms";
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

export const mom = async (requestData = {}) => {
    const functionUrl = "moms/insert";
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

export const updateMom = async (requestData, id) => {
    const functionUrl = "moms/update";
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
// users 
export const momAutoPopulate = async (id) => {
    const functionUrl = "moms";
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
export const deleteMOM = async (id) => {
    const functionUrl = "moms/delete";
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
export const pastEvents = async (requestData = {}) => {
    const functionUrl = "moms/dropdown/events";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'GET')
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

export const momsTable = async (requestData = {}) => {
    const functionUrl = "moms/get";
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
export const momsLatestTable = async () => {
    const functionUrl = "latest/moms";
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
export const momsArchiveTable = async (requestData = {}) => {
    const functionUrl = "archive/moms";
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


export const approveMom = async (requestData = {}) => {
    const functionUrl = "moms/approve";
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
export const wingsDropdown = async () => {
    const functionUrl = "dropdown/wings";
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