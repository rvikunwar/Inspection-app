import * as actionTypes from "@actions/actionTypes";
const initialState = {
    login: {
        isAuthenticated: false,
        token_access: null,
        token_refresh: null,

    },
    user: {
        lang: "en",
        username: "ss",
        email: "sss",
        active_on_service: true,
        entity: -1,
        first_name:"ss",
        last_name: "ss",
        profile_id: -1,
        manager_contact: 222,
        phone_number: 222,
        position: "ss",
        user_id: 111,
        profile_image: "s",
        unseen_messages: -1,
        messenger_list:[]
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
                        messenger_list: payload.messenger_list 
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
                    ...state,
                    login: {
                        isAuthenticated: false,
                        token_access: null,
                        token_refresh: null
                    },
                }

            default:
                return state;
    }
};
