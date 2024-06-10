// https://vcat.co.in/staging/vcat-api/api/v1/

// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1
// https://vcat.co.in/staging/vcat-api/api/v1/internal_home/auth_user/1https://vcat.co.in/staging/vcat-api/api/v1/events/dropdowns
import { callApi } from "./Api";
import "./Global";
// import AppConfig from '../modals/AppConfig';
/**
 *
 * @param{email, password)data
 */
export const event = async (requestData = {}) => {
  const functionUrl = "events/insert";
  try {
    return callApi(functionUrl, requestData, "POST")
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

export const events = async (requestData = {}) => {
  const functionUrl = "events_all";

  try {
    return callApi(functionUrl, requestData, "POST")
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
export const deleteEvent = async (id) => {
  const functionUrl = "events/delete";
  try {
    return callApi(functionUrl, {}, "DELETE", id)
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
export const EventUpdate = async (requestData, id) => {
  const functionUrl = "events/update";
  try {
    return callApi(functionUrl, requestData, "PUT", id)
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

export const EventAutoPopulate = async (id) => {
  const functionUrl = "events";
  try {
    return callApi(functionUrl, {}, "GET", id)
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
export const eventFormDropdown = async (requestData = {}) => {
  const functionUrl = "events/dropdown/wings";
  try {
    return callApi(functionUrl, requestData, "GET")
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

export const eventTable = async (requestData = {}) => {
  const functionUrl = "events/get";
  try {
    return callApi(functionUrl, requestData, "POST")
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
export const saveEventGallery = async (requestData, id) => {
  const functionUrl = "events/updateGallery";
  try {
    return callApi(functionUrl, requestData, "PUT", id)
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

export const getEventSpeakers = async (id) => {
  const functionUrl = "events/speakers";
  try {
    return callApi(functionUrl, {}, "GET", id)
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

export const saveEventSpeaker = async (requestData = {}) => {
  const functionUrl = "events/saveEventSpeaker";

  try {
    return callApi(functionUrl, requestData, "POST")
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
export const updateEventSpeaker = async (requestData, id) => {
  const functionUrl = "events/updateEventSpeaker";
  try {
    return callApi(functionUrl, requestData, "PUT", id)
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
export const deleteEventSpeaker = async (id) => {
  const functionUrl = "events/deleteEventSpeaker";
  try {
    return callApi(functionUrl, {}, "DELETE", id)
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
export const notifyEventMembers = async (id) => {
  const functionUrl = "notify/events";
  try {
    const user = JSON.parse(localStorage.getItem("Member") || "{}");
    const { user_id: userId = "" } = user;
    return callApi(functionUrl, {}, "GET", `${id}/${userId}`)
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
