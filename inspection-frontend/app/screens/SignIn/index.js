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
import { Images } from "@config";
import React, { useState, useEffect } from "react";
import {
    ScrollView,
    TouchableOpacity,
    View,
    ImageBackground,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { userAgent, InspectionAPI } from "../../connect/api";

const { authentication, setUserProfile } = AuthActions;


const SignIn = (props) => {

    const { navigation } = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const defaultData = {
                          username:"",
                          password:""
                        }

    const [ formdata, setFormdata ] = useState(defaultData)

    const onLogin = () => {
        
        if (formdata.username== "" || formdata.password == "") {


        }
        else{
            setLoading(true);
            userAgent.loginUser(formdata).then((res)=>{
              

                InspectionAPI.getUserDetails(res.access).then((res1)=>{
                  
                  setFormdata(defaultData)
                  setLoading(false);
                    dispatch(
                      authentication(res, () => {
                      navigation.navigate("MainScreens");
                      })
                    )
                    dispatch(
                      setUserProfile(res1)
                      )
                      console.log(res1)
                }).catch((err)=>{
                  console.log(err)
                })

              }).catch((err)=>{
                    console.log(err.response.data)
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
          title={t("sign_in")}
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
          }}
      >
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
              placeholder={t("Username")}
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
              placeholder={t("Password")}
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
                onPress={onLogin}
              >
                {t("sign_in")}
              </Button>

            </View>
            <View style={styles.contentActionBottom}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ResetPassword")}
              >
                <Text body2 grayColor>
                  {t("forgot_your_password")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text body2 primaryColor>
                  {t("not_have_account")}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
