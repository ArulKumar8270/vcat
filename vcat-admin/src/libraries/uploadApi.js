import Notifications from "../common/Notifications";
import AppConfig from "../modals/AppConfig";

export const uploadApi = async (functionUrl, pictureData, callBack, fileType = 'png/pdf/txt/mp4/gif/csv/doc/docx', type) => {

    let url = global.baseUrl + functionUrl;
    if (global.apiUrls[functionUrl]) {
        url = global.baseUrl + global.apiUrls[functionUrl];
    }
    const formData = new FormData();
    formData.append('file', pictureData);
    formData.append('fileType', pictureData && pictureData.type ? pictureData.type : 'image/png/pdf/txt/mp4/gif/csv/doc/docx');
    formData.append('documentType', fileType);
    formData.append('type', type);

    // Starting Http Request

    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    console.log('OPENED', xhr.status);
    addListeners(xhr, callBack);
    xhr.onprogress = function () {
        console.log('LOADING', xhr.status);
    };

    xhr.onload = () => {
        console.log('DONE', xhr.status);
        const response = JSON.parse(xhr.response);
        if (response.status === "error")
            AppConfig.setMessage("The file must be a file of type: jpeg, jpg, png, gif, mp4,  doc, docx, pdf.");

        console.log('Response ', response);
        if (xhr.status === 200) {
            Notifications.setDocType("File uploaded")
            Notifications.setDocTypeError(1);

            // returning the response in callBack page 
            console.log('Response ', response.status);
            if (callBack)
                callBack(response);
            if (response.status === "success") {
                Notifications.setDocType("File uploaded")
                Notifications.setDocTypeError(1);
            } else {
                Notifications.setDocType("The file must be a file of type: jpeg, jpg, png, gif, mp4,  doc, docx, pdf.")
                Notifications.setDocTypeError(2);
            }
        }
        else {
            Notifications.setDocType("The file must be a file of type: jpeg, jpg, png, gif, mp4,  doc, docx, pdf.");
            AppConfig.setMessage("The file must be a file of type: jpeg, jpg, png, gif, mp4,  doc, docx, pdf.")
            Notifications.setDocTypeError(2);
        }
    };
    // Ending Http Request
    xhr.send(formData);
};



const addListeners = (xhr, callBack) => {

    xhr.addEventListener('loadstart', callBack);
    xhr.addEventListener('load', callBack);
    xhr.addEventListener('loadend', callBack);
    xhr.addEventListener('progress', callBack);
    xhr.addEventListener('error', callBack);
    xhr.addEventListener('abort', callBack);
    xhr.addEventListener('response', callBack);

};