/**

* Common Api for upload file or profile pic.

* @param(file, callback)

* @return API response

*/
import '../libraries/Global';
import { uploadApi } from "../libraries/uploadApi";

export const uploadMedia = async (image, callBack, type = 'photo_video') => {
    const functionUrl = "file";
    console.log("function Url : ", functionUrl)
    try {
        await uploadApi(functionUrl, image, callBack, 'POST', type);
    } catch (error) {
        console.log('Error from catch => ', error);
    }
}

export const uploadFile = async (image, callBack, type = 'document_path') => {

    const functionUrl = "file";
    console.log("function Url : ", functionUrl)
    try {

        const response = await uploadApi(functionUrl, image, callBack, 'POST', type);

        if (response) {

            return callBack(response);

        }

    } catch (error) {

        console.log('Error from catch => ', error);

    }

}
export const uploadWingImage = async (image, callBack, type = 'wing_image') => {

    const functionUrl = "file";
    console.log("function Url : ", functionUrl)
    try {

        const response = await uploadApi(functionUrl, image, callBack, 'POST', type);

        if (response) {

            return callBack(response);

        }

    } catch (error) {

        console.log('Error from catch => ', error);

    }

}