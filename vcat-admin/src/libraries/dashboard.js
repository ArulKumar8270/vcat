// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1
// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1
import { callApi } from './Api';
import './Global';
// import AppConfig from '../modals/AppConfig';
import User from '../modals/User';
/**
*
* @param{email, password)data
*/
export const dashboard = async (requestData = {}) => {
    const functionUrl = "internal_home/auth_user";
    const id = User.user_id;
    try {
        return callApi(functionUrl, requestData, 'GET', id)
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
export const All_Users = async (requestData = {}) => {
    const functionUrl = "all_users";
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

export const HomeUserActivity = async (requestData = {}) => {
    const functionUrl = "feeds/activity";
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

export const HomeUserFeed = async (requestData = {}) => {
    const functionUrl = "feeds/user_feeds";
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

export const HomeFeed = async (requestData = {}) => {
    const functionUrl = "feeds";
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

export const HomeFeedActivity = async (requestData = {}) => {
    const functionUrl = "feed_single";
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

export const HomeCommentInsert = async (requestData = {}) => {
    const functionUrl = "feeds/comments";
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

export const HomeFeedInsert = async (requestData = {}) => {
    const functionUrl = "feeds/insert";

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

export const HomeFeedLike = async (requestData = {}) => {
    const functionUrl = "feeds/likes";

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

export const HomeNotifications = async (requestData = {}) => {
    const functionUrl = "notification_list";

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


export const HomeLatestCareers = async (requestData = {}) => {
    const functionUrl = "internal_home/latest_carrier";

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
export const HomeLatestEvents = async (requestData = {}) => {
    const functionUrl = "internal_home/latest_events";

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

export const HomeAttendedEvents = async (requestData = {}) => {
    const functionUrl = "internal_home/events_attend";

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


/**
 *
 * @param{update read or unread) by id
 */
export const updateNotification = async (requestData) => {
    const functionUrl = "notification/readed";
    try {
        return await callApi(functionUrl, requestData, 'PUT')
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

/**
 *
 * @param{clear all notification) by all the id's
 */
export const clearAll = async (requestData) => {
    const functionUrl = "notification/clear_all";
    try {
        return await callApi(functionUrl, requestData, 'PUT')
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

/**
 *
 * @param{read all) by all the id's
 */
export const readAll = async (requestData, id) => {
    const functionUrl = "notification/read_all";
    try {
        return await callApi(functionUrl, requestData, 'PUT', id)
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

export const updateFeed = async (requestData,id) => {
    const functionUrl = "feed_update";
    try {
        return await callApi(functionUrl, requestData, 'PUT',id)
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

export const editFeedAutoPopulate = async (id) => {
    const functionUrl = "feed_show";
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

export const deleteFeed = async (id) => {
    const functionUrl = "feed_delete";
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


export const getUsersDropdown = async () => {
    const functionUrl = "dropdown/users";
    try {
        return callApi(functionUrl, {}, 'GET')
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