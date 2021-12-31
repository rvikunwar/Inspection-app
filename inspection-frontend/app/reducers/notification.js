import * as actionTypes from "@actions/actionTypes";
const initialState = {
    count: null,
    new_notification: []
};


export default (state = initialState, { type, payload } = action) => {
    switch (type) {
           
            case actionTypes.NOTIFICATION_COUNT:
                return {
                    ...state,
                    count: payload.count,
            }

            case actionTypes.NEW_NOTIFICATION:
                return {
                    ...state,
                    new_notification: [ payload.notification, ...state.new_notification ],
            }
        
            default:
                return state;
    }
};
