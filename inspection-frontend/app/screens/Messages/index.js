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
import {useTranslation} from 'react-i18next';
import WebSocketInstance from '../../socket/websocket';
import { useSelector } from 'react-redux';
import { sendMessageHandler } from '../../socket/socketfunc'
import { renderTimestamp } from './commonfunc';
import Camera from './camera';
import { InspectionAPI } from '../../connect/api';


export default function Messages({route, navigation}) {

  const { selectedUser, selectedUser_image, profile } = route.params;
  const currentUser = useSelector((state)=> state.auth.user.user_id)
  const  [ roomname, setRoomname ] = useState(null) 

  const {t} = useTranslation();
  const {colors} = useTheme();
  const refFlatList = useRef(null);
  const [messageInput, setMessageInput ] = useState("")

  const [ newMessages, setNewMessages ] = useState()
  const [ messages, setMessages ] = useState([]);


  /**
   * @description for user details / id / entity
   */



  useEffect(()=>{
    
    return () => {
      WebSocketInstance.disconnect()
    }
  },[])


  //for defining room name for communication
  useEffect(() => {
    if(selectedUser < currentUser){
      setRoomname(`room_${selectedUser}_${currentUser}`)
    } else {
      setRoomname(`room_${currentUser}_${selectedUser}`)
    }
  }, [selectedUser])


  //for sending new messages
  const newMessageHandler = (content) => {
    const messagev1 = {
      sender: currentUser,
      receiver: selectedUser,
      content
    }
    sendMessageHandler(messagev1);
    setMessageInput('');
  }


  const setMessagesfunc = (m, e) => {
    setMessages(m)
  };

  const addMessagesfunc = (m) => {
    setNewMessages({
      ...m
    })
    if (refFlatList.current) {
      setTimeout(() => {
        refFlatList.current.scrollToEnd({animated: true});
      }, 500);
    }
  }

  useEffect(()=>{

    if(newMessages){
      setMessages(()=> {
        return [...messages,
        newMessages]
      })
    }
  },[newMessages])


  function initialiseChat() {
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(currentUser, selectedUser); 
      
    });
    WebSocketInstance.connect(roomname);
  }

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

  useEffect(() => {
    let isMounted = true;

    if (isMounted && roomname) {
      initialiseChat();

      WebSocketInstance.addCallbacks({setMessagesfunc, addMessagesfunc});
    }

    return () => {
      isMounted = false;
    };
  }, [roomname]);



  const renderItem = (item) => {
    if (selectedUser === item.sender) {
      return (
        <View style={styles.userContent}>
          <Image
            source={{uri: selectedUser_image}}
            style={[styles.avatar, {borderColor: colors.border}]}
          />
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
          <View
            style={[styles.meContentMessage, {backgroundColor: "#1381F8"}]}>
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


  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 30,
  });


  return (
    <View style={{flex: 1, marginTop:StatusBar.currentHeight, position:"relative"}}>
      <Header
        title={t('')}
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
          navigation.navigate("Messenger");
        }}
      />
      <KeyboardAvoidingView
        style={{flex: 1, justifyContent: 'flex-end'}}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        enabled>
        <SafeAreaView style={{ flex:1 }} edges={['right', 'left']}>
          <FlatList
            ref={refFlatList}
            data={messages}
            onContentSizeChange={() => refFlatList.current.scrollToEnd({animated: true})}
            onLayout={() => refFlatList.current.scrollToEnd({animated: true})}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => renderItem(item)}
          />
          <View style={styles.inputContent}>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={(text) => setMessageInput(text)}
                onSubmitEditing={() => {
                  newMessageHandler(messageInput)

                }}
                placeholder={t('type_message')}
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
        </SafeAreaView>
      </KeyboardAvoidingView>

      <TouchableOpacity 
        style={{
          position:"absolute", 
          top:8, 
          flex:1, 
          right:90, 
          zIndex: 1000, 
          elevation:100}}

        onPress={()=>{
          navigation.navigate('Camera')
        }}>
        <Icon 
          name="camera" 
          size={23} 
          color="gray"/>

      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          position:"absolute", 
          top:8, 
          flex:1, 
          right:60, 
          zIndex: 1000, 
          elevation:100}}

        onPress={()=>{
          navigation.navigate('Profile', {profile})
        }}>
        <Icon 
          name="user-ninja" 
          size={22} 
          color="gray" />

      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          position:"absolute", 
          top:10, 
          flex:1 , 
          right:25, 
          zIndex: 1000, 
          elevation:100}}
        onPress={()=>{
          navigation.navigate('TaskCreate', {profile})
        }}>
        <Icon 
          name="tasks" 
          size={22} 
          color="gray" />

      </TouchableOpacity>
      
    </View>
  );
}
