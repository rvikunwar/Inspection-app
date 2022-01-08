import {
    Button,
    Header,
    Icon,
    Image,
    SafeAreaView,
    Text,
    TextInput,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { HOST_URL } from "@env";
import { InspectionAPI } from "@connect/api";
import { AuthActions } from "@actions";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch } from "react-redux";
import { showMessage } from "react-native-flash-message";
import Procfile from '@assets/images/procfile.jpg'



const ProfileEdit = (props) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [ profilePicker, setProfilePicker ] = useState("")
    const {  setUserProfile }  =  AuthActions; 
    const { navigation, route } = props;
    let profile = route?.params?.profile;

    const [ userProfile, setUserProfiledet ]= useState({
        first_name: profile.first_name, 
        last_name:profile.last_name, 
        email:profile.email,
        profile_image: `${HOST_URL}${profile?.profile_image}`
    })

    const defaultErrorMessage = {
        first_name:"",
        email: "",
    }

    const saveDataHandler = () => {
        const form = new FormData();
        form.append('first_name', userProfile.first_name);
        form.append('last_name', userProfile.last_name);
        form.append('email', userProfile.email);

        if(profilePicker !== ""){
            form.append('profile_image', {
                name: profilePicker.name,
                type: profilePicker.mimeType,
                uri: Platform.OS === 'ios' ? 
                    profilePicker.uri.replace('file://', '')
                     : profilePicker.uri,
            });
        }

        InspectionAPI.updateUserDetails(form, profile.profile_id)
            .then((res)=>{
                dispatch(setUserProfile(res));
                setLoading(false)
                navigation.goBack();
            }).catch((err)=>{
                setLoading(false)
                if(err.response.data){

                      Object.keys(err.response.data).forEach((k) => {
                        
                        showMessage({
                            message: k,
                            description:  err.response.data[k][0],
                            type: "error",
                          });
                        
                      });
                }
                console.log(err)
            })
    }

    const DocumentPickerfunc = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        if(result.mimeType.split('/')[0]==='image'){
            setProfilePicker(result)
            setUserProfiledet({
                ...userProfile,
                profile_image: result.uri
            })
        } else {
            showMessage({
                message: "Please select a valid image",
                type: "error",
              });
        }
    }
  
    return (
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
          <Header
              title={t("edit_profile")}
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
              onPressRight={() => {}}
          />
            <ScrollView>
                <View style={styles.contain}>

                    <TouchableOpacity onPress={DocumentPickerfunc}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 10,
                        }}
                        >
                        {userProfile.profile_image?
                        <Image source={{uri:`${userProfile?.profile_image}`}} 
                            style={styles.thumb}/>
                            :
                            <Image source={Procfile} style={styles.thumb}/>
                        }
                    </TouchableOpacity>

                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {t("First name")}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setUserProfiledet({
                                ...userProfile,
                                first_name: text
                            })
                        }}
                        autoCorrect={false}
                        placeholder={"first name"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={userProfile.first_name}
                        selectionColor={colors.primary}
                    />
                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {"Last name"}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setUserProfiledet({
                                ...userProfile,
                                last_name: text
                            })
                        }}
                        autoCorrect={false}
                        placeholder={"last name"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={userProfile.last_name}
                        selectionColor={colors.primary}
                    />
                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {t("email")}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setUserProfiledet({
                                ...userProfile,
                                email: text
                            })
                        }}                        
                        autoCorrect={false}
                        placeholder={t("input_email")}
                        placeholderTextColor={BaseColor.grayColor}
                        value={userProfile.email}
                    />
                </View>
            </ScrollView>
            <View style={{ padding: 20 }}>
                <Button
                    loading={loading}
                    full
                    disabled={loading}
                    onPress={() => {
                      setLoading(true);
                      saveDataHandler();
                    }}>
                    {'Confirm'}
                </Button>
            </View>
        </SafeAreaView>
    );
  };
  
  export default ProfileEdit;
  