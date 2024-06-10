import { callApi } from './Api';
import './Global';
/**
*
* @param{email, password)data
*/
export const meetingDashboard = async (requestData = {}) => {
    const functionUrl = "meeting";
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

export const meeting = async (requestData = {}) => {
    const functionUrl = "meeting/insert";
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

export const updateMeeting = async (requestData, id) => {
    const functionUrl = "meeting/update";
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
export const meetingAutoPopulate = async (id) => {
    const functionUrl = "meeting";
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
export const deleteMeeting = async (id) => {
    const functionUrl = "meeting/delete";
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
    const functionUrl = "meeting/dropdown/filter";
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
export const meetingTable = async (requestData = {}) => {
    const functionUrl = "meeting/get";
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
export const meetingLatestTable = async () => {
    const functionUrl = "latest/meeting";
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
export const meetingArchiveTable = async (requestData = {}) => {
    const functionUrl = "archive/meeting";
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
export const createMinutes = async (requestData = {}) => {
    const functionUrl = "meeting/create_mom";
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
export const notifyMeetingMembers = async (id) => {
    const functionUrl = "notify/meeting";
    try {
        return callApi(functionUrl, {}, 'GET', id)
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