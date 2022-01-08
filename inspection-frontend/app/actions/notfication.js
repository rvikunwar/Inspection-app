import * as actionTypes from "./actionTypes";


export const countNotification = (payload) => dispatch => {
    dispatch({
        type: actionTypes.NOTIFICATION_COUNT,
        payload:payload
    });
}

export const countMessages = (payload) => dispatch => {
    dispatch({
        type: actionTypes.MESSAGES_COUNT,
        payload:payload
    });
}