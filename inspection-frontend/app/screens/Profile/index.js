import { AuthActions } from "@actions";
import {
  Button,
  Icon,
  ProfileDetail,
  SafeAreaView,
  Text,
  Tag,
  ProfilePerformance
} from "@components";
import { BaseStyle, useTheme } from "@config";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { InspectionAPI } from "@connect/api";
import Procfile from '@assets/images/procfile.jpg'
import { HOST_URL } from "@env";
import { showMessage } from "react-native-flash-message";
const { Logout, setExpoToken } = AuthActions;


const Profile = (props) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { navigation } = props;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [ department, setDepartment ]=  useState({ name:"" })
    const auth = useSelector((state) => state.auth);
    const login = auth.login.isAuthenticated;
    const expo_token = auth.user.expo_token;
    const profile = auth.user;
    const position = useSelector((state) => state.auth.user.position)
 
    const onLogOut = () => {
        InspectionAPI.removeExpoToken(expo_token).then(()=>{
            setLoading(true);
            dispatch(setExpoToken({ token: "" }))
            dispatch(Logout((response) => {
                setLoading(false);
            }));
            showMessage({
                message: 'Logout Successfull',
                type: "info",
              });
        })
    };

    const onLogIn = () => {
        navigation.navigate("SignIn");
    };

    const styleItem = {
        ...styles.profileItem,
        borderBottomColor: colors.border,
    };

    let defaultPerformance =  [
        { value: "0%", title: "Progress" },
        { value: "0", title: "Total tasks" },
        { value: "0", title: "Completed" },
    ]

    const [ performance, setPerformance ] = useState(defaultPerformance)

    useEffect(()=>{

        InspectionAPI.getEntity(profile.entity).then((res)=>{
            setDepartment(res)
        })

        InspectionAPI.getInspectorStat({ role: 'INSPECTOR' })
            .then((res)=>{
                defaultPerformance =  [
                    { value: String((res.completed/res.total).toFixed(4)*100) +"%" , title: "Progress" },
                    { value: res.total, title: "Total tasks" },
                    { value: res.completed, title: "Completed" },
                ]
                setPerformance(defaultPerformance)
            })
    },[])

    return (
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
          <View style={[BaseStyle.container, { flex: 1 }]}>
              <View style={{ marginBottom: 20 }}>
                  <Text header bold>
                      {"Profile"}
                  </Text>
              </View>
              <View style={{ flex: 1 }}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                        <ProfileDetail
                            image={profile?.profile_image?{uri:`${HOST_URL}${profile?.profile_image}`}:Procfile}
                            textFirst={profile.first_name + " " + profile.last_name}
                            textSecond={profile.email}
                            textThird={department.name}
                            icon={false}
                        />

                        <View style={styles.viewFollow}>
                            <View style={{ flex: 3 }}>
                            <Tag primary style={styles.follow} styleText={{}}>
                                {position}
                            </Tag>
                            </View>

                            <View style={{ flex: 5 }}>
                               {position === 'INSPECTOR' && <ProfilePerformance data={performance}/>}
                            </View>
                        </View>
                  
                        <View style={{ width: "100%" }}>
                            <TouchableOpacity
                                style={styleItem}
                                onPress={() => {
                                    navigation.navigate("Setting");
                                }}>
                                <Text body1>{t("setting")}</Text>
                                <Icon
                                    name="angle-right"
                                    size={18}
                                    color={colors.primary}
                                    style={{ marginLeft: 5 }}
                                    enableRTL={true}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styleItem}
                                onPress={() => {
                                    navigation.navigate("ProfileEdit", { profile });
                                }}>
                                <Text body1>{t("edit_profile")}</Text>
                                <Icon
                                    name="angle-right"
                                    size={18}
                                    color={colors.primary}
                                    style={{ marginLeft: 5 }}
                                    enableRTL={true}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styleItem}
                                onPress={() => {
                                    navigation.navigate("ChangePassword");
                                }}>
                                <Text body1>{t("change_password")}</Text>
                                <Icon
                                    name="angle-right"
                                    size={18}
                                    color={colors.primary}
                                    style={{ marginLeft: 5 }}
                                    enableRTL={true}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>

            <View style={{ padding: 10 }}>
                {login ? (
                    <Button full loading={loading} onPress={() => onLogOut()}>
                        {t("sign_out")}
                    </Button>
                ) : (
                    <Button full loading={loading} onPress={() => onLogIn()}>
                        {t("sign_in")}
                    </Button>
                )}
            </View>
      </SafeAreaView>
    );
  };

export default Profile;
