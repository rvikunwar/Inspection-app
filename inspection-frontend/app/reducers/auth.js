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
        unseen_messages: 0,
        expo_token:null,
        notfication_count:0
    },
};


export default (state = initialState, { type, payload } = action) => {
    
    switch (type) {
           
            case actionTypes.LOGIN:
                return {
                    ...state,
                    login: {
                        ...state.login,
                        isAuthenticated: true,
                        token_access: payload.access,
                        token_refresh: payload.refresh
                    },
            }
        
            case actionTypes.SET_CURRENT_USER_DETAILS:
                return {
                    ...state,
                    user: {
                        ...state.user,
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
                        unseen_messages: payload.un_seen_messages,
                    }
                }
            case actionTypes.EDIT_CURRENT_USER_DETAILS:
                return {
                    ...state,
                    user: {
                        ...state.user,
                        email: payload.email,
                        first_name: payload.first_name,
                        last_name: payload.last_name
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
                
            case actionTypes.SET_EXPO_TOKEN:
                return {
                    ...state,
                    user: {
                        ...state.user,
                        expo_token: payload.token
                    }
                }
            case actionTypes.NOTIFICATION_COUNT:
                return {
                    ...state,
                    user: {
                        ...state.user,
                        notfication_count: payload.count,                    }
                }
            
            case actionTypes.SET_MESSAGE_NOTIFICATION_COUNT:
                return {
                    ...state,
                    user: {
                        ...state.user,
                        notfication_count: payload.notification, 
                        unseen_messages: payload.messages                   }
                }

            case actionTypes.LOGOUT:
                return {
                    ...state,
                    login: {
                        ...state.login,
                        isAuthenticated: false,
                        token_access: null,
                        token_refresh: null
                    },
                }

            default:
                return state;
    }
};
