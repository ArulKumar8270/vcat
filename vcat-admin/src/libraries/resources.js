import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
import User from '../modals/User';
/**
*
* @param{email, password)data
*/
export const resourcesDashboard = async (requestData = {}) => {
    const functionUrl = "resource";
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
export const resourcesInsert = async (requestData = {}) => {
    const functionUrl = "resource/insert";
    // const id = User.user_id;
    // console.log("api---------->", id);
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

export const deleteResource = async (id) => {
    const functionUrl = "resource/delete";
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

export const updateResource = async (requestData, id) => {
    const functionUrl = "resource/update";
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

export const resourcesAutoPopulate = async (id) => {
    const functionUrl = "resource";
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
export const DocCat = async () => {
    const functionUrl = "category/dropdown/list";
    const id = User.user_id;
    console.log("api", id);
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
export const CategoryListData = async (id) => {
    const functionUrl = "documents/dropdown/category";
    // const id = User.user_id;
    // console.log("api---------->", id);
    try {
        return callApi(functionUrl, {}, 'POST', id)
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

export const resourceTable = async (requestData = {}) => {
    const functionUrl = "resource/get";
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