
import '../libraries/Global';
import { uploadApi } from "../libraries/uploadApi";

export const UploadDoc = async (file, callBack, type) => {
    // const id = User.user_id;
    const functionUrl = "files/upload";
    console.log("function Url : ", functionUrl)
    try {
        const response = await uploadApi(functionUrl, file, callBack, 'pdf/txt/csv/doc/docx', 'document_path', 'document_name');
        if (response) {
            return callBack(response);
        }
    } catch (error) {
        console.log('Error from catch => ', error);
    }
}



export const UploadResDoc = async (file, callBack, type) => {
    // const id = User.user_id;
    const functionUrl = "files/upload";

    console.log("function Url : ", functionUrl)
    try {
        const response = await uploadApi(functionUrl, file, callBack, 'resource_docs', 'document_path', 'document_name');
        if (response) {
            return callBack(response);
        }
    } catch (error) {
        console.log('Error from catch => ', error);
    }

}