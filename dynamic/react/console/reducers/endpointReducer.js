import queryStringReducer from './queryStringReducer';
import postBodyReducer from './postBodyReducer';
import {actionTypes} from './reducer';
import {buildQsPath, buildPostBodyData, buildCurl, fillOrRemoveSampleData} from '../helpers';

const DOC_TYPES = {
    REQUEST: 'REQUEST',
    RESPONSE: 'RESPONSE'
};

const traversePropertyPath = (propertyPath, state) => {
    if (propertyPath === '') {
        return state;
    }

    const pathArray = propertyPath.split(':');

    return pathArray.reduce((accum, paramName) => {
        if (paramName.indexOf('[') !== -1) {
            const index = parseInt(paramName.slice(paramName.indexOf('[') + 1, paramName.indexOf(']')), 10);

            return accum.value[index];
        }
        return accum[paramName];
    }, state);
};

export default (state, action) => {
    let newState = {...state};

    switch (action.type) {
    case actionTypes.CONSOLE_VISIBILITY_TOGGLED:
        return {...newState, apiConsoleVisible: (!state.apiConsoleVisible)};
    case actionTypes.JUMP_TO_CONSOLE:
        return {...newState, apiConsoleVisible: true};
    case actionTypes.RESET_CONSOLE:
        newState = fillOrRemoveSampleData(newState, true);
        if (newState.postBodyData) {
            newState.postBodyData = buildPostBodyData(newState.postBody);
        }
        newState.qsPath = buildQsPath(newState.queryString);
        newState.curl = buildCurl(newState.isAuthenticated, newState);
        return {...newState, apiResponse: undefined};
    case actionTypes.SUBMIT_DONE:
        newState.apiResponse = action.apiResponse;
        if (action.error) {
            newState.error = action.error;
        }
        break;
    case actionTypes.FILL_REQUEST_SAMPLE_DATA:
        newState = fillOrRemoveSampleData(newState);
        if (newState.postBody) {
            newState.postBodyData = buildPostBodyData(newState.postBody);
        }
        newState.qsPath = buildQsPath(newState.queryString);
        newState.curl = buildCurl(newState.isAuthenticated, newState);
        break;
    case actionTypes.QUERY_PARAM_CHANGED:
        newState = {...newState, queryString: queryStringReducer(newState.queryString, action)};
        newState.qsPath = buildQsPath(newState.queryString);
        newState.curl = buildCurl(newState.isAuthenticated, newState);
        break;
    case actionTypes.PATH_PARAM_CHANGED:
        newState.pathParams[action.paramName].value = action.inputVal;
        newState.curl = buildCurl(newState.isAuthenticated, newState);
        break;
    case actionTypes.TOGGLE_DOCUMENTATION_ITEM_VISIBILITY:
        const stateToChange = action.documentationFor === DOC_TYPES.REQUEST ? newState.requestSchema : newState.responseSchema;
        const propToToggle = traversePropertyPath(action.postBodyParamName, stateToChange);

        propToToggle.uiState.visible = !propToToggle.uiState.visible;
        break;
    case actionTypes.POST_BODY_CHANGED:
    case actionTypes.ADD_ITEM_TO_POST_BODY_COLLECTION:
    case actionTypes.REMOVE_ITEM_FROM_POST_BODY_COLLECTION:
        const newPostBody = postBodyReducer(newState.postBody, action);
        const newPostBodyData = buildPostBodyData(newPostBody);
        const newCurl = buildCurl(newState.isAuthenticated, newState);

        return {...newState, postBody: newPostBody, postBodyData: newPostBodyData, curl: newCurl};
    default:
        break;
    }

    return newState;
};
