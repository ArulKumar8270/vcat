// https://vcat.co.in/staging/vcat-api/api/v1/roles/dropdown/list'

// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1
// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1https://vcat.co.in/staging/vcat-api/api/v1/events/dropdowns
import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
/**
*
* @param{email, password)data
*/
export const memberDashboard = async (requestData = {}) => {
    const functionUrl = "users";
    try {
        return callApi(functionUrl, requestData, 'POST')
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

export const updateMember = async (requestData, id) => {
    const functionUrl = "update";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'PUT', id)
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
export const deleteMember = async (id) => {
    const functionUrl = "delete";
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
export const memberFormInsert = async (requestData = {}) => {
    const functionUrl = "insert";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'POST')
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

// users 
export const memberAutoPopulate = async (id) => {
    const functionUrl = "single_user";
    // const id = User.user_id;
    // console.log("api", id);
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
export const memberRoles = async (requestData = {}) => {
    const functionUrl = "users/dropdown/roles";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'POST')
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }

}
export const sendInvite = async (requestData = {}) => {
    const functionUrl = "send_invite";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'POST')
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log("Error from API => ", error);
            });
    } catch (error) {
        console.log("Error from catch => ", error);
    }

}
export const memberSearch = async (requestData = {}) => {
    const functionUrl = "search/data";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'POST')
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

export const updateProfileDetails = async (requestData, id) => {
    const functionUrl = "profile/update";
    // const id = User.user_id;
    // console.log("api", id);
    try {
        return callApi(functionUrl, requestData, 'PUT', id)
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

export const memberTable = async (requestData = {}) => {
    const functionUrl = "users/get";
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

export const getInviteDetails = async (key) => {
    const functionUrl = "invite/get";
    try {
        return callApi(functionUrl, {}, 'GET',key)
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

export const getCalendarDates = async (id) => {
    const functionUrl = "calendar/get";
    try {
        return callApi(functionUrl, {}, 'GET',id)
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

export const approveMember = async (requestData) => {
    const functionUrl = "user/approve";
    try {
        return callApi(functionUrl, requestData, 'PUT')
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