import { AuthActions } from "@actions";
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
import {
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { userAgent, InspectionAPI } from "../../connect/api";
import { getPushToken } from '@utils';
import { showMessage } from "react-native-flash-message";
const { authentication, setUserProfile, setExpoToken } = AuthActions;


const SignIn = (props) => {

    const { navigation } = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const defaultData = { username:"", password:"" }

    const [ formdata, setFormdata ] = useState(defaultData)

    const onLogin = () => {

        if (formdata.username== "" || formdata.password == "") {
            showMessage({
                message: 'Fill all the details in order to login',
                type: "error",
              });
        } else {
            userAgent.loginUser(formdata).then((res)=>{
                    setLoading(true);
                    InspectionAPI.getUserDetails(res.access).then((res1)=>{
                        setFormdata(defaultData)
                        setLoading(false);
                        dispatch(setUserProfile(res1));
                        dispatch(authentication(res, () => {
                            getPushToken().then((res)=>{
                                InspectionAPI.addExpoToken({token: res})
                                dispatch(setExpoToken({ token: res }))
                            });
                            showMessage({
                                message: 'Login Successfull',
                                type: "success",
                              });
                            navigation.navigate("MainScreens");
                        }))
                    })
                    .catch((err)=>{
                        console.log(err)
                        setLoading(false);
                    })
            })
            .catch((err)=>{
                console.log(err.response.data)
                
                showMessage({
                    message: 'Credentials are not correct, please check',
                    type: "error",
                  });
                setLoading(false);
            })
        }
    }

    const offsetKeyboard = Platform.select({
        ios: 0,
        android: 20,
    });

     return (
            <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
              <Header
                  title={"Sign in"}
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

              <KeyboardAvoidingView
                  behavior={Platform.OS == "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={offsetKeyboard}
                  style={{
                      flex: 1,
                  }}>
                  <View style={styles.contain}>
                        <TextInput
                            style={[BaseStyle.textInput]}
                            onChangeText={(text) => {
                                setFormdata({
                                    ...formdata,
                                    "username": text
                                })
                            }}
                            onFocus={() => {
                                setSuccess({
                                    ...success,
                                    id: true,
                                });
                            }}
                            autoCorrect={false}
                            placeholder={"Username"}
                            placeholderTextColor={
                                success.id ? BaseColor.grayColor : colors.primary
                            }
                            value={formdata.username}
                            selectionColor={colors.primary}
                        />
                        <TextInput
                            style={[BaseStyle.textInput, { marginTop: 10 }]}
                            onChangeText={(text) => {
                                setFormdata({
                                  ...formdata,
                                  "password": text
                                })
                            }}
                            onFocus={() => {
                                setSuccess({
                                  ...success,
                                  password: true,
                                });
                            }}
                            autoCorrect={false}
                            placeholder={"Password"}
                            secureTextEntry={true}
                            placeholderTextColor={
                                success.password ? BaseColor.grayColor : colors.primary
                            }
                            value={formdata.password}
                            selectionColor={colors.primary}
                        />
                    
                        <View style={{ width: "100%", marginVertical: 16 }}>
                            <Button
                                full
                                loading={loading}
                                style={{ marginTop: 20 }}
                                onPress={onLogin}>
                                    {"Sign in"}
                            </Button>
                        </View>
                        <View style={styles.contentActionBottom}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("ResetPassword")}>
                                <Text body2 grayColor>
                                    {"Forgot your password"}
                                </Text>
                            </TouchableOpacity>

                      </View>
                  </View>
              </KeyboardAvoidingView>
          </SafeAreaView>
  );
};

export default SignIn;
