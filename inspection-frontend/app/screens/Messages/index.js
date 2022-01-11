import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {BaseStyle, Images, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Image, Text, TextInput} from '@components';
import styles from './styles';
import WebSocketInstance from '@socket/websocket';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessageHandler, updateMessageSeenStatus } from '@socket/socketfunc'
import { renderTimestamp } from './commonfunc';
import { InspectionAPI } from '@connect/api';
import Procfile from '@assets/images/procfile.jpg'
import { HOST_URL } from '@env'
import * as Progress from 'react-native-progress';
import { getUnseenMessages } from '@selectors'


let stopFetchMore = true;  

const ListFooterComponent = ({ colors }) => 
    <View style={{alignItems: 'center', marginVertical: 5}}>
        <Progress.Circle 
            size={35} 
            indeterminate={true} 
            borderWidth={2}
            color={colors.primary}/>
    </View>


//for rendering messages
const renderItem = (item, selectedUser, colors) => {

    if (selectedUser.user === item.sender) {

     return (
         <View style={styles.userContent }>

            {selectedUser.profile_image ? 
                <Image source={{uri:`${HOST_URL}${selectedUser.profile_image}`}}
                    style={[styles.avatar, {borderColor: colors.border}]}/>:
                <Image source={Procfile} style={[styles.avatar, {borderColor: colors.border}]}/>}

            <View style={{paddingHorizontal: 8}}>
                <View
                    style={[
                        styles.userContentMessage,
                        {backgroundColor: "#D1D1D1"},
                    ]}>
                <Text body2 whiteColor style={{color: "black"}}>
                    {item.content}
                </Text>
                    <View style={styles.userContentDate}>
                        <Text footnote numberOfLines={1} style={{ color:"black", fontSize: 11, opacity:0.4}}>
                            {renderTimestamp(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>

        </View>
      );
    }

    return (
        <View style={styles.meContent}>
            <View style={{paddingLeft: 8, }}>
                <View style={[styles.meContentMessage, {backgroundColor: "#1381F8"}]}>
                    <Text style={{ fontSize: 16, color: 'white'}}>{item.content}</Text>
                    <View style={styles.meContentDate}>
                        <Text footnote numberOfLines={1} style={{ color:"white", fontSize: 11}}>
                            {renderTimestamp(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};


export default function Messages({route, navigation}) {

    
    const selectedUser = route.params.selectedUser;
    const currentUser = useSelector((state)=> state.auth.user.user_id)
    const  [ roomname, setRoomname ] = useState(null)     
    const {colors} = useTheme();
    const refFlatList = useRef(null);
    const [messageInput, setMessageInput ] = useState("")

    const [ newMessages, setNewMessages ] = useState()
    const [ messages, setMessages ] = useState([]);

    const [ page, setPage] = useState(1)
    const [ loadMore, setLoadMore ] = useState(false)
    const [ Loader, setLoader ] = useState(true)
    const [ more , setMore ] = useState(false)

    const count = useSelector(getUnseenMessages)
    const [ socketConnection, setSocketConnection ] = useState(false)


    /**
     * @description for adding more content messages
     * of screen
     */
    const addition = () => {

        if(!stopFetchMore){

            setPage(page+1)
            stopFetchMore = true;

            InspectionAPI.fetchMessages(page, selectedUser.user)
            .then((res)=>{
                if(res.next === null){
                    setMore(false)
                } else {
                    setMore(true)
                }
                setLoadMore(false)
                setMessages([ ...messages, ...res.results])

            })
            .catch((err)=>{
                console.log(err)
                setLoadMore(false)
            })
        } else {
            setLoadMore(false)
        }
    }
    

    //for defining room name for communication
    useEffect(() => {
        // console.log(selectedUser, route.params, "sjshs")
        if(selectedUser.user < currentUser){
            setRoomname(`room_${selectedUser.user}_${currentUser}`)
        } else {
            setRoomname(`room_${currentUser}_${selectedUser.user}`)
        }
    }, [selectedUser])

    
    const offsetKeyboard = Platform.select({
        ios: 0,
        android: 30,
    });
   
    const addMessagesfunc = (m) => {
        setNewMessages({
            ...m
        })
     }


    /**
     * @description socket connection for chatting
     */

    function waitForSocketConnection(callback) {
        setTimeout(function () {
            if (WebSocketInstance.state() === 1) {
                setSocketConnection(true)
                console.log('Connection is made');
                if(typeof callback === 'function'){
                    callback();
                }
                return;
            } else {
                console.log('wait for connection...');
                waitForSocketConnection(callback);
            }
        }, 100);
    }
    
    function initialiseChat() {
        waitForSocketConnection(()=>{
            WebSocketInstance.updateUnseen(selectedUser.user)
        });
        WebSocketInstance.connect(roomname);
    }

        
    useEffect(() => {
        let isMounted = true;

        if (isMounted && roomname) {
            initialiseChat();
            WebSocketInstance.addCallbacks({addMessagesfunc});
        }

        return () => {
            isMounted = false;
        };
    }, [roomname])

    //for closing connection on quitting chat
    useEffect(()=>{
        return () => {
            WebSocketInstance.disconnect()
            setSocketConnection(false)
        }
    },[])

    
    //for sending new messages
    const newMessageHandler = (content) => {
        const messagev1 = {
            sender: currentUser,
            receiver: selectedUser.user,
            content
        }
        sendMessageHandler(messagev1);
        setMessageInput('');
        console.log(messagev1)
        setMessages(()=> {
            return [
            {...messagev1,
            timestamp:new Date()},
            ...messages
        ]
        })
        if (refFlatList.current) {
            setTimeout(() => {
                refFlatList.current.scrollToOffset({ offset: 1, animated: true})
               
            }, 300);
        }
    }

    //for hanlding new messages
    useEffect(()=>{
        
        if(newMessages && newMessages.sender != currentUser){
            setMessages(()=> {
                return [
                newMessages,
                ...messages,]
            })
            if (refFlatList.current) {
                setTimeout(() => {
                    refFlatList.current.scrollToOffset({ offset: 1, animated: true})
                   
                }, 300);
            }
        }
    },[newMessages])

    //for fetching messages
    useEffect(()=>{
        setPage(1)
        InspectionAPI.fetchMessages(page, selectedUser.user)
        .then((res)=>{
            if(res.next === null){
                setMore(false)
            } else {
                setMore(true)
            }
            setMessages(res.results)
            setLoader(false)
        })
        .catch((err)=>{
            console.log(err)
            setLoader(false)

        })
    },[])


    useEffect(()=>{
        console.log(count,'count', selectedUser.user)
        if(count>0 && socketConnection){
            updateMessageSeenStatus(selectedUser.user)
        }
    },[count, socketConnection])

    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}>

            <Header
            title={'Messages'}
            renderLeft={() => {
                return (
                <Icon
                    name="angle-left"
                    size={20}
                    color="#D1D1D1"
                    enableRTL={true}
                />
                );
            }}
            onPressLeft={() => {
                navigation.goBack();
            }}
            />
            <KeyboardAvoidingView
                style={{flex: 1, justifyContent: 'flex-end'}}
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                keyboardVerticalOffset={offsetKeyboard}
                enabled>
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
                    inverted
                    ref={refFlatList}
                    data={messages}
                    onEndReached={() => {
                        console.log("sshshs")
                        if(more){
                            setLoadMore(true)
                            addition()
                        }
                    }}
                    onScrollBeginDrag={() => {
                        stopFetchMore = false
                    }}
                    ListFooterComponent={() => loadMore && <ListFooterComponent colors={colors}/>}
                    keyExtractor={(item, index) => index}
                    renderItem={({item}) => renderItem(item, selectedUser, colors)}/>}

                <View style={styles.inputContent}>
                    <View style={{flex: 1}}>
                        <TextInput
                        onChangeText={(text) => setMessageInput(text)}
                        onSubmitEditing={() => {
                            newMessageHandler(messageInput)
                        }}
                        placeholder={'type message'}
                        value={messageInput}
                        />
                        
                    </View>
                    <TouchableOpacity
                        style={[styles.sendIcon, {backgroundColor: colors.primary}]}
                        onPress={()=>{
                            newMessageHandler(messageInput)
                        }}>
                        <Icon
                        name="paper-plane"
                        size={20}
                        color="white"
                        enableRTL={true}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
