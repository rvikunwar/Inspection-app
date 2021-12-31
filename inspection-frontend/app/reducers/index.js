import { combineReducers } from "redux";
import AuthReducer from "./auth";
import ApplicationReducer from "./application";
import NotificationReducer from "./notification";


export default combineReducers({
    auth: AuthReducer,
    application: ApplicationReducer,
    notification: NotificationReducer
});
