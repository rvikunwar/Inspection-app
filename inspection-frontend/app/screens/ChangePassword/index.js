import {
    Button,
    Header,
    Icon,
    SafeAreaView,
    Text,
    TextInput,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { InspectionAPI } from "@connect/api";
import { showMessage } from "react-native-flash-message";


const ChangePassword = (props) => {
    const { navigation } = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const defaultAuthData = { old_password: "", new_password: "", confirm_password: "" }
    const [ authData, setAuthData ] = useState(defaultAuthData) 

    const ChangePasswordHandler = () => {

        if( authData.new_password === "" && authData.old_password === "" && authData.confirm_password === ""){
            showMessage({
                message: "Plz, fill all the detials . . .",
                type: "error",
              });
              setLoading(false)
              return;
        }

        if(authData.new_password.length<8){
            showMessage({
                message: "Password must contain atleast 8 characters",
                type: "error",
              });
              setLoading(false)
              return;
        }

        if(authData.new_password === authData.confirm_password){
                   
            InspectionAPI.changePassword(authData)
            .then((res)=>{
                setLoading(false)
                showMessage({
                    message: "Password changed",
                    description: "Your password is changed successfully",
                    type: "success",
                  });
                navigation.goBack();
            }).catch((err1)=>{
                setLoading(false)
                showMessage({
                    message: "Wrong current password",
                    description: "Plz check your current password",
                    type: "error",
                  });
            })

        } else {
            setLoading(false)
            showMessage({
                message: "Password mismatch",
                description: "Plz check new and confirm password, they are not identical",
                type: "error",
              });
        }

    }

  
    return (
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
            <Header
                title={"Change Password"}
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
            <ScrollView>
                <View style={styles.contain}>
                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {t("Current password")}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setAuthData({
                                ...authData,
                                "old_password": text
                            })
                        }}
                        autoCorrect={false}
                        secureTextEntry={true}
                        placeholder={"Enter your old password"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={authData.old_password}
                        selectionColor={colors.primary}
                    />
                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {"New password"}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setAuthData({
                                ...authData,
                                "new_password": text
                            })
                        }}
                        autoCorrect={false}
                        secureTextEntry={true}
                        placeholder={"Enter you new password"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={authData.new_password}
                        selectionColor={colors.primary}
                    />

                    <View style={styles.contentTitle}>
                        <Text headline semibold>
                            {"Confirm password"}
                        </Text>
                    </View>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={(text) => {
                            setAuthData({
                                ...authData,
                                "confirm_password": text
                            })
                        }}
                        autoCorrect={false}
                        secureTextEntry={true}
                        placeholder={"Confirm password"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={authData.confirm_password}
                        selectionColor={colors.primary}
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
                        ChangePasswordHandler()
                    }}>
                  {"Confirm"}
                </Button>
            </View>
        </SafeAreaView>
    );
  };
  
  export default ChangePassword;
  