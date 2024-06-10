import { callApi } from './Api';
import './Global';
/**
*
* @param{email, password)data
*/
export const CategoryInsert = async (requestData = {}) => {
    const functionUrl = "category/insert";
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
// value={this.state.selectCat}  https://vcat.co.in/staging/vcat-api/api/v1/
