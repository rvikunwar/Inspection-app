import { 
    Header, 
    Icon, 
    SafeAreaView,
    Text,
    TextInput,
} from "@components";
import ListTextButton from './ListProfile'
import Tag from "./Tag";
import { BaseStyle, useTheme, BaseColor } from "@config";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, RefreshControl,View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { HOST_URL } from '@env'
import { useNavigation } from "@react-navigation/core";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/core";
import { InspectionAPI } from "@connect/api";
import * as Progress from 'react-native-progress';
import { haveChildren } from "@utils";
import { AuthActions } from '@actions'
import { getUnseenMessages } from '@selectors'
import { updateMessagesCountToZero } from '@socket/socketfunc'


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

const Messenger = () => {
    
    const navigation  = useNavigation();
    const isFocused = useIsFocused();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const currentUser = useSelector((state)=> state.auth.user.user_id)
    const [ page, setPage ] = useState(1)

    const [ messengerList, setMessengerList ] = useState([])
    const [ messengerListv1, setMessengerListv1 ] = useState([])

    const [ loadMore, setLoadMore ] = useState(false)
    const [ Loader, setLoader ] = useState(true)
    const [ more , setMore ] = useState(false)

    const dispatch = useDispatch();

    const { setUnseenMessages } = AuthActions
    const count = useSelector(getUnseenMessages)

    useEffect(()=>{
        if(count>0){
            dispatch(setUnseenMessages(0))
            updateMessagesCountToZero()
        }
    },[isFocused, count])

    const addition = () => {
        if(!stopFetchMore){
            setPage(page+1)
            stopFetchMore = true;
            InspectionAPI.getMessengerDetails(page).then((res)=>{
                setMessengerList([...messengerListv1, ...res.results])
                setMessengerListv1([...messengerListv1, ...res.results])
                if(res.next === null){
                    setMore(false)
                } else {
                    setMore(true)
                }
            }).catch((err)=>{
                console.log(err)
            })
            setLoadMore(false)
        }
    }

    useEffect(()=>{
        let isMounted = true;

        if(isMounted === true  && isFocused){
            setPage(1)
            InspectionAPI.getMessengerDetails(page).then((res)=>{
                setMessengerList([...res.results ])
                setLoader(false)
                setMessengerListv1([...res.results ])
                if(res.next === null){
                    setMore(false)
                } else {
                    setMore(true)
                }
            }).catch((err)=>{
                console.log(err),
                setLoader(false)
            })
        }
        return () => {
            isMounted=false;
        }
    }, [isFocused])


    //FILTERING   entities
    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setMessengerList(
                messengerListv1.filter(
                    (item) => 
                        haveChildren(item.profile_user[0].first_name, text) ||
                        haveChildren(item.profile_user[0].last_name, text)               
                )
            );
        } else {
            setMessengerList(messengerListv1);
        }
    };


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try{
            InspectionAPI.getMessengerDetails(page).then((res)=>{
                setMessengerList([...res.results ])
                setMessengerListv1([...res.results ])
                setRefreshing(false)
                if(res.next === null){
                    setMore(false)
                } else {
                    setMore(true)
                }
            }).catch((err)=>{
                console.log(err)
                setRefreshing(false)
            })
        }
        catch(err){
            setRefreshing(false)
        }
      }, [refreshing]);

  
      return (
          <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
            <Header
                title={t("messenger")}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <View>

                <TouchableOpacity
                    style={{
                        zIndex:10000,
                        paddingHorizontal:18,
                    }}>
                    <TextInput
                        onChangeText={filterCategory}
                        style={{elevation:3}}
                        placeholder={"Name"}
                        value={keyword}
                        keyboardType={null}
                        icon={
                            <TouchableOpacity onPress={() => filterCategory("")}>
                                <Icon
                                    name="times"
                                    size={16}
                                    color={BaseColor.grayColor}
                                />
                            </TouchableOpacity>
                        }
                    />
                </TouchableOpacity>
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
                    refreshControl={
                        <RefreshControl
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                  }
                    data={messengerList}
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
                    style={{marginBottom:90}}
                    ListFooterComponent={() => loadMore && <ListFooterComponent/>}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                        <ListTextButton
                            image={{uri:`${HOST_URL}${item.profile_user[0].profile_image}`}}
                            name={item.profile_user[0].first_name +" "+ item.profile_user[0].last_name}
                            description={item.message}
                            is_seen={currentUser==item.sender?true:item.is_seen}
                            online={item.profile_user[0].online}
                            timestamp={item.last_message_time}
                            style={{marginTop: 0}}
                            onPress={() => {
                                navigation.navigate("Messages", { selectedUser: item.profile_user[0] });
                            }}
                            componentRight={
                                <Tag value={item.unseen_count}/>
                            }/>
                      )}
                  />}
              </View>
          </SafeAreaView>
      );
  };
  
  export default Messenger;
  
  
  
  
  