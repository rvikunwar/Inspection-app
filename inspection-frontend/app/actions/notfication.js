import * as actionTypes from "./actionTypes";


export const countNotification = (payload) => dispatch => {
    dispatch({
        type: actionTypes.NOTIFICATION_COUNT,
        payload:payload
    });
}


export const newNotification = (payload) => dispatch => {
    dispatch({
        type: actionTypes.NEW_NOTIFICATION,
        payload:payload
    });
}