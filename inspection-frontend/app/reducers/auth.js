import * as actionTypes from "@actions/actionTypes";
const initialState = {
    login: {
        isAuthenticated: false,
        token_access: null,
        token_refresh: null,

    },
    user: {
        lang: "en",
        username: null,
        email: null,
        active_on_service: null,
        entity: null,
        first_name: null,
        last_name: null,
        profile_id: null,
        manager_contact: null,
        phone_number: null,
        position: null,
        user_id: null,
        profile_image: null,
        unseen_messages:null
    },
};


export default (state = initialState, { type, payload } = action) => {
    
    switch (type) {
           
            case actionTypes.LOGIN:
                return {
                    ...state,
                    login: {
                        isAuthenticated: true,
                        token_access: payload.access,
                        token_refresh: payload.refresh
                    },
            }
        
            case actionTypes.SET_CURRENT_USER_DETAILS:
                return {
                    ...state,
                    user: {
                        user_id: payload.user,
                        email: payload.email,
                        entity: payload.entity,
                        first_name: payload.first_name,
                        last_name: payload.last_name,
                        profile_id: payload.id,
                        manager_contact: payload.manager_contact,
                        phone_number: payload.phone_number,
                        position: payload.position,
                        user_id: payload.user,
                        profile_image: payload.profile_image,
                        unseen_messages: payload.un_seen_messages  
                    }
                }

            case actionTypes.SET_UNSEEN_MESSAGES_COUNT:
                return {
                    ...state,
                    user: {
                        ...state.user,
                        unseen_messages: payload
                    }
                }

            case actionTypes.LOGOUT:
                return {
                    ...initialState
            }

            default:
                return state;
    }
};
