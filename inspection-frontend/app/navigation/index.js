import { ApplicationActions } from "@actions";
import { BaseSetting, useTheme, useFont } from "@config";
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
import SignIn from "@screens/SignIn";
import ResetPassword from '@screens/ResetPassword'
import { InspectorMainScreens, CommonMainScreens, MangerMainScreens } from "./main";
import { setOnlineStatus, getMNCount, updateCoordinates } from '@socket/socketfunc'
import { NotificationActions } from "@actions";
import { managerScreen, inspectorScreen  } from "./config/project";
import { GlobalWebSocketInstance } from '@socket/NotificationSocket'
import { store } from 'app/store'
import FlashMessage from "react-native-flash-message";
import { AuthActions } from '@actions'
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
});


const { notiMsgCount } = AuthActions;

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

    const { countNotification } = NotificationActions
    const font = useFont();
    const expoToken =  useSelector((state) =>  state.auth.user.expo_token)
    const [notification, setNotification] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();

    

    useEffect(()=>{
        notificationListener.current = Notifications.addNotificationReceivedListener(setNotification);

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                // console.log(response, 'sjss')
                setNotification(response.notification);
            }
        );

        // Notifications.setNotificationCategoryAsync({
        //     identifier: 'download',
        //     actions: [{  
        //         identifier: 'openFile',
        //         buttonTitle: 'ssssssss',
        //         textInput: {
        //           submitButtonTitle:'sss',
        //           placeholder:'ssss',
        //         }
        //     }]
        // })

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    },[])


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
                compatibilityJSON: 'v3',
                resources: BaseSetting.resourcesLanguage,
                lng: languageCode,
                fallbackLng: languageCode,
            });
            setLoading(false);
            Utils.enableExperimental();
        };
        onProcess();
    }, []);


    /**
     * @description function for getting unseen notifications count
     *  and geting global socket connection 
     *  and it is used for getting new notifications
     */

     const [ socketConnection , setSocketConnection ] = useState(false)

     function waitForSocketConnection(WebSocketInstance, callback) {
        setTimeout(function () {
            if (WebSocketInstance.state() === 1) {
                setSocketConnection(true)
                console.log('Connection is made');
                console.log(typeof callback )
                if(typeof callback === 'function'){
                    console.log('conn')
                    callback();
                } return;
            } else {
                console.log('wait for connection...');
                waitForSocketConnection(callback);
            }
        }, 2000);
    }

    function GlobalUserSettings() {
        waitForSocketConnection(GlobalWebSocketInstance,() => GlobalWebSocketInstance.getMessageNotificationCount());
        GlobalWebSocketInstance.connect(currentUser);
    }

    const setNewNotification = () => {
        let count =  store.getState().auth.user['notfication_count'];
        dispatch(countNotification({ count: count+ 1 }));
    }

    const setMessageANDNotificationCount = (m) => {
        console.log(m,"mssm")
        dispatch(notiMsgCount(m))
    }

    useEffect(()=>{
        let isMounted = true;

        if (isMounted && isAuthenticated===true) {
            GlobalUserSettings();
            GlobalWebSocketInstance.addCallbacks({ setNewNotification, setMessageANDNotificationCount  })
        }
        return () => {
            isMounted = false
          }          
    },[isAuthenticated])


    useEffect(()=>{
        return () => {
            if(isAuthenticated){
                if(GlobalWebSocketInstance.state() === 1 && isAuthenticated){
                    GlobalWebSocketInstance.disconnect()
                    setSocketConnection(false)
                }
            }
        }
    },[])



    const appState = useRef(AppState.currentState);
    const [ appStateStatus, setAppStateStatus ] = useState(appState.current)

    useEffect(() => {
         const subscription = AppState.addEventListener("change", nextAppState => {
         if (appState.current.match(/inactive|background/) && nextAppState === "active"){
              console.log("App has come to the foreground!" );
              if(isAuthenticated===true){
                   setAppStateStatus(nextAppState)
                   setOnlineStatus(true)
                   getMNCount()              
              }
          }
        else{
              appState.current = nextAppState;
              console.log("AppState", appState.current);

              if(isAuthenticated === true&& socketConnection){
                   setOnlineStatus(false)
                   setAppStateStatus(nextAppState)
              }
         }

         });

         return () => {
              subscription.remove();
          };
    }, [isAuthenticated]);

    const [ coordinates, setCoordinates ] = useState('')
    useEffect(()=>{

        if(isAuthenticated){
            (async () => {
                let { status } = await  Location.requestForegroundPermissionsAsync();
               if (status !== 'granted') {
                  console.log('Permission to access location was denied');
                  return;
               } else {
                 console.log('Access granted!!')
                 
                 if (status === 'granted') {
                    await Location.watchPositionAsync({
                     accuracy:Location.Accuracy.BestForNavigation,
                     timeInterval:1000,
                     distanceInterval : 20
                     }
                     ,(location_update) => {
                   setCoordinates(location_update.coords)
                   }
                 )}               
                }
              })();
        }
    },[isAuthenticated])

    useEffect(()=>{
        if(isAuthenticated && socketConnection){
            (async () => {
                let { status } = await  Location.requestForegroundPermissionsAsync();
               if (status !== 'granted') {
                  console.log('Permission to access location was denied');
                  return;
               } else {
                 console.log('Access granted!!')
                 
                 if (status === 'granted') {
                   let loc1 = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation})
                   setCoordinates(loc1.coords)
                   updateCoordinates(coordinates)             
                }}
              })();
        }
    },[isAuthenticated, socketConnection])

    useEffect(()=>{
        if(isAuthenticated && socketConnection){
            updateCoordinates(coordinates)
        }
    },[coordinates])
    
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

                                <RootStack.Screen
                                    name="ResetPassword"
                                    component={ResetPassword}
                                    options={{ headerShown: false }}
                                />

                            </>
                       
                        }
                
                    </RootStack.Navigator>
                    <FlashMessage 
                        position="top" 
                        duration={2500}
                        style={{
                            marginTop: StatusBar.currentHeight,
                            minHeight: 0, 
                            padding: 10, 
                            fontFamily: `${font}-Regular`,                            
                            }} />

                </NavigationContainer>
            </AppearanceProvider>
        </View>
    )
};


export default Navigation;