import { 
  Header, 
  Tag,
  Icon, 
  SafeAreaView,
  ListTextButton, } from "@components";
import { BaseStyle, useTheme } from "@config";
import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl,View } from "react-native";
import { useTranslation } from "react-i18next";
import { InspectionAPI } from "../../connect/api";
import { HOST_URL } from '@env'
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import WebSocketInstance from '../../socket/websocket';


const Messenger = (props) => {
  
    const navigation  = useNavigation();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [ userProfiles, setUserProfiles ] = useState([])

    const messengerList = useSelector((state)=> state.auth.user.messenger_list)
    const currentUser = useSelector((state)=> state.auth.user.user_id)


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

    function initialiseChannel(currentUser, selectedUser) {

        let roomname;
        if(selectedUser < currentUser){
            roomname = `room_${selectedUser}_${currentUser}`
        } else {
            roomname = `room_${currentUser}_${selectedUser}`
        }
        waitForSocketConnection(() => {
          WebSocketInstance.fetchMessegerList(currentUser, selectedUser); 
          
        });
        WebSocketInstance.connect(roomname);
    }

    /**
     * @description  list of peoples for messaging
     */
    useEffect(()=>{

        if(messengerList.length>0){
            messengerList.map((item)=>{
                initialiseChannel(currentUser, item)
            })
        }
    },[messengerList])




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
          <View style={{paddingHorizontal:25, marginTop:5}}>
              <FlatList
                  refreshControl={
                      <RefreshControl
                          colors={[colors.primary]}
                          tintColor={colors.primary}
                          refreshing={refreshing}
                          onRefresh={() => {}}
                      />
                }
                  data={userProfiles}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item, index }) => (
                      <ListTextButton
                          image={{uri:`${HOST_URL}${item.profile_image}`}}
                          name={item.first_name +" "+ item.last_name}
                          description={item.email}
                          online={item.online}
                          style={{marginTop: 7}}
                          onPress={() => {
                            navigation.navigate("Messages",{ selectedUser: item.user, 
                              selectedUser_image: `${HOST_URL}${item.profile_image}`, 
                              profile: item });
                          }}
                          componentRight={
                              <Tag
                                  
                                  outline
                                  style={{
                                      paddingHorizontal: 20,
                                      backgroundColor: colors.background,
                                  }}
                              >
                                  {`${t("send")}`}
                              </Tag>
                            }
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default Messenger;




