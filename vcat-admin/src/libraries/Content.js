
import { callApi } from './Api';
import './Global';

export const contentType = async (requestData = {}) => {
    const functionUrl = "content/dropdown/list";
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

export const PageContentInsert = async (requestData = {}) => {
    const functionUrl = "pages/insert";
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

export const contentPage = async (page_id) => {
    const functionUrl = "pages";
    try {
        return callApi(functionUrl, {}, 'GET', page_id)
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

export const PageContentUpdate = async (requestData, page_id) => {
    const functionUrl = "pages/update";
    try {
        return callApi(functionUrl, requestData, 'PUT', page_id)
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

export const BannerContentInsert = async (requestData = {}) => {
    const functionUrl = "banners/insert";
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

export const contentBanner = async (banner_id) => {
    const functionUrl = "banners";
    try {
        return callApi(functionUrl, {}, 'GET', banner_id)
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

export const BannerContentUpdate = async (requestData, banner_id) => {
    const functionUrl = "banners/update";
    try {
        return callApi(functionUrl, requestData, 'PUT', banner_id)
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

