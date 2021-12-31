import {
    HeaderText,
    Icon,
    SafeAreaView,
    TextInput,
    Header,
    Transaction2Col,
    Text
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { FActivites } from "@data";
import { useNavigation } from "@react-navigation/native";
import { haveChildren } from "@utils";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { HOST_URL } from '@env'
import WebSocketInstance from '../../socket/NotificationSocket';
import { useSelector } from "react-redux";
import { InspectionAPI } from "../../connect/api";
import { renderTimestamp } from '@common'


const NotificationText = ({ item }) => {

    const [ profile, setProfile ] = useState({first_name: "", last_name: "", profile_image: ""})

    useEffect(()=>{
        InspectionAPI.getUserProfileDetails(item.sender).then((res)=>{
            setProfile(res)
        })
    },[])


    return (
        <View style={[styles.notification, !item.is_seen?styles.seenEffect:null]}>
            <Image source={{uri:`${HOST_URL}${profile.profile_image}`}}
                    style={[
                        styles.thumb,    
                    ]}/>
            <View style={styles.notificationSection}>                
                <View style={styles.text}>
                    <Text headline semibold>{profile.first_name} {profile.last_name}  
                    <Text subhead> {item.content}</Text></Text>
                </View>
                <Text footnote style={{marginTop: 4}}>{renderTimestamp(item.timestamp)}</Text>
            </View>
        </View>)
}


export default function Notifications() {

    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState(FActivites);
    const navigation = useNavigation();
    const currentUser = useSelector((state)=> state.auth.user.user_id)


    //creating connection for notification socket
    function waitForSocketConnection(callback) {
        setTimeout(function () {
          if (WebSocketInstance.state() === 1) {
            console.log('Connection is made');
            callback();
            return;
          } else {
            console.log('wait for connection...');
            waitForSocketConnection(callback);
          }
        }, 100);
    }


    //initialising channels
    function initialiseChannel() {
        waitForSocketConnection(() => {
          WebSocketInstance.fetchNotification(); 
          
        });
        WebSocketInstance.connect(currentUser);
    }


    //callbacks
    const [ notifications, setNotifications ] = useState([])
    const setNotificationsfunc = (m, e) => {
        setNotifications(m)
    };
    

    //creates websocket connection for notifications
    useEffect(()=>{
        let isMounted = true
        if(isMounted === true){
            initialiseChannel()
            WebSocketInstance.addCallbacks({ setNotificationsfunc });
        }
        return () => {
            isMounted = false
            WebSocketInstance.disconnect();
        }
    },[])


    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}>
            <Header title={"Notifications"}/>
            <View style={styles.contain}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <NotificationText item={item}/>
                    )}
                />            
            </View>
        </SafeAreaView>
    );
}
