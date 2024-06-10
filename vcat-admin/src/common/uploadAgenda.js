/**

* Common Api for upload file or profile pic.

* @param(file, callback)

* @return API response

*/
import '../libraries/Global';
import { uploadApi } from "../libraries/uploadApi";

export const uploadAgenda = async (file, callBack) => {

    const functionUrl = "agenda";
    console.log("function Url : ", functionUrl)
    try {

        const response = await uploadApi(functionUrl, file, callBack, 'pdf/txt', 'agenda');

        if (response) {

            return callBack(response);

        }

    } catch (error) {

        console.log('Error from catch => ', error);

    }

}