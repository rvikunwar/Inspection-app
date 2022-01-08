import {
    SafeAreaView,
    Header,
    Text
} from "@components";
import { BaseStyle, useTheme } from "@config";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Image, TouchableOpacity, View, RefreshControl } from "react-native";
import styles from "./styles";
import { HOST_URL } from '@env'
import { InspectionAPI } from "@connect/api";
import { renderTimestamp } from '@common'
import { updateNotificationCountToZero,  updateNotificationSeenStatus } from '../../socket/socketfunc'
import { useIsFocused } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { NotificationActions } from "@actions";
import { getNotificationCount } from '@selectors' 
import Procfile from '@assets/images/procfile.jpg'
import * as Progress from 'react-native-progress';



const ListFooterComponent = () => <View style={{alignItems: 'center', marginVertical: 5}}>
        <Text 
            grayColor
            footnote
            style={{   
                borderRadius:30,
                width: 100,
                textAlign:'center',
                borderWidth:1,
                borderColor: 'rgba(0,0,0,0.3)'
            }}> Loading...</Text>
    </View>

let stopFetchMore = true;  

const NotificationText = ({ item }) => {

    return (
        <View style={[styles.notification, !item.is_seen?styles.seenEffect:null]}>
            
            {item.sender.profile_image ? 
                <Image source={{uri:`${HOST_URL}${item.sender.profile_image}`}}
                    style={[
                        styles.thumb,    
                    ]}/>:
                <Image source={Procfile} style={[styles.thumb, styleThumb]}/>}
      
            <View style={styles.notificationSection}>  
            <Text callout style={{fontWeight: '600'}}> {item.title} </Text>          

                <View style={styles.text}>
                    <Text headline semibold>{item.sender.first_name} {item.sender.last_name}  
                    <Text subhead> {item.content}</Text></Text>

                </View>
                <Text footnote style={{marginTop: 4}}>{renderTimestamp(item.timestamp)}</Text>
            </View>
        </View>)
}


export default function Notifications() {

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { countNotification } = NotificationActions;
    let count  = useSelector(getNotificationCount);
    const [refreshing, setRefreshing] = useState(false);
    const [ page, setPage] = useState(1)
    const [ loadMore, setLoadMore ] = useState(false)
    const [ Loader, setLoader ] = useState(true)
    const [ more , setMore ] = useState(false)
    const { colors } = useTheme();

    /**
     * @description for adding more content when user to bottom
     * of screen
     */
    const addition = () => {

        if(!stopFetchMore){
            setPage(page+1)
            stopFetchMore = true;

            InspectionAPI.getNotifications(page)
            .then((res)=>{
                if(res.next === null){
                    setMore(false)
                } else {
                    setMore(true)
                }
                setLoadMore(false)
                setNotifications([...notifications,...res.results])
            })
            .catch((err)=>{
                console.log(err)
                setLoadMore(false)
            })
        }
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try{
            setPage(1)
            InspectionAPI.getNotifications(page)
                .then((res)=>{
                    if(res.next === null){
                        setMore(false)
                    } else {
                        setMore(true)
                    }
                    setRefreshing(false);
                    setNotifications(res.results)
                })
                .catch((err)=>{
                    setRefreshing(false);
                    console.log(err)
                })
        } catch(err){
            setRefreshing(false)
        }
   
      }, [refreshing]);


    useEffect(() => {
        if (isFocused && count>0) {
            dispatch(countNotification({ count: 0 }))
            updateNotificationCountToZero()
        }
      }, [isFocused]);


    //settings notifications
    const [ notifications, setNotifications ] = useState([])

    useEffect(()=>{
        if(count === 0){
            setPage(1)
            InspectionAPI.getNotifications(page)
                .then((res)=>{
                    if(res.next === null){
                        setMore(false)
                    } else {
                        setMore(true)
                    }
                    setNotifications(res.results)
                    setLoader(false)
                    console.log(res)

                })
                .catch((err)=>{
                    console.log(err)
                    setLoader(false)
                })
        }
    },[])
   

    //creates websocket connection for notifications
    useEffect(()=>{
        let isMounted = true;

        if(isMounted === true && isFocused){
            if(count>0){
                setPage(1)
                setLoader(true)
                InspectionAPI.getNotifications(page)
                    .then((res)=>{
                        if(res.next === null){
                            setMore(false)
                        } else {
                            setMore(true)
                        }
                        setNotifications(res.results)
                        setLoader(false)

                    })
                    .catch((err)=>{
                        console.log(err)
                        setLoader(false)

                    })
                    setTimeout(()=>{
                        updateNotificationSeenStatus()
                    },5000)
            }

        }
                
    },[isFocused])


    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}>
            <Header title={"Notifications"}/>
            <View style={styles.contain}>
            {Loader?
                <View style={{
                    alignItems:'center',
                    justifyContent:'center',
                    height:'100%'
                }}>
                    <Progress.Circle 
                        size={49} 
                        color={colors.primary}
                        indeterminate={true}
                        borderWidth= {3}/>
                </View>:
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    onEndReached={() => {
                        if(more){
                            setLoadMore(true)
                            addition()
                        }
                    }}
                    onScrollBeginDrag={() => {
                        stopFetchMore = false
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => loadMore && <ListFooterComponent/>}
                    keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item, index }) => (
                        <NotificationText item={item} key={index}/>
                    )}
                />}           
            </View>
        </SafeAreaView>
    );
}
