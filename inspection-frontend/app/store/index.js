import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import logger from "redux-logger";
import rootReducer from "app/reducers";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from 'redux-thunk';

/**
 * Redux Setting
 */

let composeEnhancers = compose;

if(__DEV__){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

 const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    timeout: 100000,
    stateReconciler: autoMergeLevel2,
};

let middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
    middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer,composeEnhancers(applyMiddleware(...middleware)));
const persistor = persistStore(store);

export { store, persistor };
