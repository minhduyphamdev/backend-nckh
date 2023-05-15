const messageConstants = require('../constants/messageConstants');
const {getBaseLecturerByName} = require('../services/scopusServices/getBaseLecturerService');

/**
 * @param {Express.Request} request 
 * @param {Express.Response} response 
 * @returns {Promise}  
 */
 async function getScopusAuthorByName(request, response) {
    
    //Get the query params
    const firstName = request.query.firstName;
    const lastName = request.query.lastName;
    
    //Default response is error response
    let responseJson = {
        code: messageConstants.SCOPUS_FIND_AUTHOR_BY_NAME_NOT_FOUND_CODE,
        message: messageConstants.SCOPUS_FIND_AUTHOR_BY_NAME_NOT_FOUND_MESSAGE,
    }

    scopusResponse = await getBaseLecturerByName(firstName, lastName);
    if (scopusResponse) {
        responseJson = {
            code: messageConstants.SCOPUS_FIND_AUTHOR_BY_NAME_FOUND_CODE,
            message: messageConstants.SCOPUS_FIND_AUTHOR_BY_NAME_FOUND_MESSAGE,
            data: scopusResponse,
        }

        return response.status(200).json(responseJson);
    }

    return response.status(500).json(responseJson);
}

module.exports = {
    getScopusAuthorByName
};