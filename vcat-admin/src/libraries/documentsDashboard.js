import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
import User from '../modals/User';
/**
*
* @param{email, password)data
*/
export const documentsDashboard = async (requestData = {}) => {
    const functionUrl = "documents";
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
export const documentInsert = async (requestData = {}) => {
    const functionUrl = "documents/insert";
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

export const deleteDocument = async (id) => {
    const functionUrl = "documents/delete";
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

export const documentTable = async (requestData = {}) => {
    const functionUrl = "documents/get";
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