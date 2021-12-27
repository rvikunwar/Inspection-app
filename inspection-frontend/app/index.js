import React from 'react'
import { LogBox, Text } from 'react-native';
import { persistor, store } from "app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Utils from "@utils";
Utils.setupLayoutAnimation();
LogBox.ignoreAllLogs(true);
import App from './navigation/index'


const Inspection = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <App/>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    )
}


export default Inspection