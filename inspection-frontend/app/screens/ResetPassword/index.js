import { Button, Header, Icon, SafeAreaView, TextInput } from "@components";
import { BaseStyle, useTheme } from "@config";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { InspectionAPI } from "@connect/api";


const ResetPassword = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = () => {
    //   InspectionAPI.resetPasswordHandler()
    //   .then((res)=>{
    //     navigation.navigate("SignIn");
    //     setLoading(false)
    //   }).catch(()=>{
    //       setLoading(false)
    //   })
  }


  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={"Reset password"}
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
        <View
          style={{
            alignItems: "center",
            padding: 20,
            width: "100%",
          }}>
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 15 }]}
            onChangeText={(text) => setEmail(text)}
            autoCorrect={false}
            placeholder={"Email address"}
            value={email}
            selectionColor={colors.primary}
          />
          <View style={{ width: "100%" }}>
            <Button
                full
                disabled={loading}
                style={{ marginTop: 20 }}
                onPress={() => {
                    setLoading(true)
                    resetPasswordHandler()
                }}
                loading={loading}>
                    {"Reset password"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
