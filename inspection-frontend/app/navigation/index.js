import { ApplicationActions } from "@actions";
import { BaseSetting, useTheme } from "@config";
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { languageSelect } from "@selectors";
import * as Utils from "@utils";
import i18n from "i18next";
import React, { useEffect, useRef, useState } from "react";
import { initReactI18next } from "react-i18next";
import { Platform, StatusBar, View, AppState, I18nManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
import * as Font from "expo-font";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import SignIn from "../screens/SignIn";
import { InspectorMainScreens, CommonMainScreens, MangerMainScreens } from "./main";
import WebSocketInstance from '../socket/websocket';
import { OnlineStatusSet } from '../socket/socketfunc'
import { AuthActions, NotificationActions } from "@actions";
import { managerScreen, inspectorScreen } from "./config/project";
import { GlobalWebSocketInstance } from '../socket/NotificationSocket'


const MainScreens = () => {

    const user = useSelector((state)=> state.auth.user)
    const position = user.position 
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
                
            {
            position === 'MANAGER' &&
                Object.keys(managerScreen()).map((name, index) => {
                    const { component, options } = managerScreen()[name];
                    return (
                        <MainStack.Screen
                            key={name}
                            name={name}
                            component={component}
                            options={options}
                        />
                    );
                })
                
            }

            
            {position === 'MANAGER' &&
                Object.keys(MangerMainScreens).map((name, index) => {
                    const { component, options } = MangerMainScreens[name];
                    return (
                        <MainStack.Screen
                            key={name}
                            name={name}
                            component={component}
                            options={options}
                        />
                    );
                })
            }


            {
            position === 'INSPECTOR' &&                  
                Object.keys(inspectorScreen()).map((name, index) => {
                    const { component, options } = inspectorScreen()[name];
                    return (
                        <MainStack.Screen
                            key={name}
                            name={name}
                            component={component}
                            options={options}
                        />
                    );
                })

            }


            {position === 'INSPECTOR' &&
                Object.keys(InspectorMainScreens).map((name, index) => {
                    const { component, options } = InspectorMainScreens[name];
                    return (
                        <MainStack.Screen
                            key={name}
                            name={name}
                            component={component}
                            options={options}
                        />
                    );
                })
            }

            {
                Object.keys(CommonMainScreens).map((name, index) => {
                    const { component, options } = CommonMainScreens[name];
                    return (
                        <MainStack.Screen
                            key={name}
                            name={name}
                            component={component}
                            options={options}
                        />
                    );
                })
            }


        </MainStack.Navigator>
    );
};



const Navigation = () => {
    const { theme } = useTheme();
    const isDarkMode = useColorScheme() === "dark";
    const language = useSelector(languageSelect);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const navigationRef = useRef(null);

    const isAuthenticated = useSelector((state)=> state.auth.login.isAuthenticated)
    const currentUser = useSelector((state)=> state.auth.user.user_id)

    const { setUnseenMessages } = AuthActions;
    const { countNotification } = NotificationActions

    useEffect(() => {
        //Config status bar
        if (Platform.OS == "android") {
            StatusBar.setBackgroundColor(isDarkMode ? "black" : "white", true);
        }
        StatusBar.setBarStyle(
            isDarkMode ? "light-content" : "dark-content",
            true
        );
    }, [isDarkMode]);

    useEffect(() => {
        I18nManager.forceRTL(true)

        const onProcess = async () => {

            // Lazy loady Font
            await Font.loadAsync(BaseSetting.resourcesFont);
            // Get current language of device
            const languageCode = language ?? BaseSetting.defaultLanguage;
            dispatch(ApplicationActions.onChangeLanguage(languageCode));
            // Config language for app
            await i18n.use(initReactI18next).init({
                resources: BaseSetting.resourcesLanguage,
                lng: languageCode,
                fallbackLng: languageCode,
            });
            setLoading(false);
            Utils.enableExperimental();
        };
        onProcess();
    }, []);


    function waitForSocketConnection(WebSocketInstance, callback) {
        setTimeout(function () {
            if (WebSocketInstance.state() === 1) {
            console.log('Connection is made');
            if(typeof callback === 'function'){
                callback();
            }
            return;
            } else {
            console.log('wait for connection...');
            waitForSocketConnection(callback);
            }
        }, 2000);
    }


    function  UserSettings() {
        waitForSocketConnection(WebSocketInstance,() => {
          WebSocketInstance.onlineStatus({user:currentUser,status:true}); 
          
        });
        WebSocketInstance.connect(currentUser, 'chat');
    }

    
    const UserDetails = (m) => {
        dispatch(setUnseenMessages(m.un_seen_messages))
    }


    useEffect(()=>{
        let isMounted = true;

        if (isMounted && isAuthenticated===true) {
            UserSettings();
            WebSocketInstance.addCallbacks({ UserDetails })
        } else {
            WebSocketInstance.disconnect()
        }

        return () => {
            isMounted = false
          }
          
    },[isAuthenticated])


    /**
     * @description function for getting unseen notifications 
     *  and geting global socket connection
     */
    function GlobalUserSettings() {
        waitForSocketConnection(GlobalWebSocketInstance,() => {
            GlobalWebSocketInstance.countNotification();           
        });
        GlobalWebSocketInstance.connect('global_setup_room');
    }

    const setNotificationCount = (m) => {
        dispatch(countNotification({ count: m }))
    }
    
    useEffect(()=>{
        let isMounted = true;

        if (isMounted && isAuthenticated===true) {
            GlobalUserSettings();
            GlobalWebSocketInstance.addCallbacks({ setNotificationCount  })
        } else {
            GlobalWebSocketInstance.disconnect()
        }

        return () => {
            isMounted = false
          }
          
    },[isAuthenticated])


    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            console.log("App has come to the foreground!");
           
            if(isAuthenticated===true){
                OnlineStatusSet({user:currentUser , status:true})
            }
            
          }
          else{
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log("AppState", appState.current);

            if(isAuthenticated === true){
                OnlineStatusSet({user:currentUser , status:false})
            }

          }
    
        });
    
        return () => {
          subscription.remove();
        };
      }, [isAuthenticated]);


    if (loading) {
        return null;
    }



    return (
        <View style={{ flex: 1, position: "relative", backgroundColor:"white"}}>
            <AppearanceProvider>
                <NavigationContainer theme={theme} ref={navigationRef}>
                    <RootStack.Navigator
                            screenOptions={{
                                headerShown: false,
                                cardStyle: { backgroundColor: "white" },
                                cardOverlayEnabled: true,
                                cardStyleInterpolator: ({
                                    current: { progress },
                                }) => ({
                                    cardStyle: {
                                        opacity: progress.interpolate({
                                            inputRange: [0, 0.5, 0.9, 1],
                                            outputRange: [0, 0.25, 0.7, 1],
                                        }),
                                    },
                                    overlayStyle: {
                                        opacity: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.5],
                                            extrapolate: "clamp",
                                        }),
                                    },
                                }),
                            }}
                            presentation="card"
                        >

                        {isAuthenticated === true?
                            
                            <RootStack.Screen
                                name="MainScreens"
                                component={MainScreens}
                                options={{ headerShown:false }}
                            />:
                            <>
                                <RootStack.Screen
                                    name="Login"
                                    component={SignIn}
                                    options={{ headerShown: false }}
                                />
                            </>
                       
                        }
                
                    </RootStack.Navigator>
                </NavigationContainer>
            </AppearanceProvider>
        </View>
    )
};


export default Navigation;