import * as actionTypes from "./actionTypes";

const onLogin = payload => {
    return {
        type: actionTypes.LOGIN,
        payload
    };
};

const onLogout = () => {
    return {
        type: actionTypes.LOGOUT,
        payload:{}
    }
}

export const authentication = (payload, callback) => dispatch => {

    dispatch(onLogin(payload));
    if (typeof callback === "function") {
        callback();
    }
};


export const Logout = (callback) => dispatch => {

    dispatch(onLogout());
    if (typeof callback === "function") {
        callback();
    }

}

export const setUserProfile = (payload) => dispatch => {

    dispatch({
        type: actionTypes.SET_CURRENT_USER_DETAILS,
        payload
    })
}

export const setUnseenMessages = (payload) => dispatch => {

    dispatch({
        type: actionTypes.SET_UNSEEN_MESSAGES_COUNT,
        payload
    })
}
