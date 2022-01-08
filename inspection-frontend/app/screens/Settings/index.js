import React from "react";
import { useSelector } from "react-redux";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { BaseStyle, useTheme } from "@config";
import { BaseSetting } from "@config";
import { Header, SafeAreaView, Icon, Text } from "@components";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";


export default function Setting({ isShowHeader = true }) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const forceDark = useSelector((state) => state.application.force_dark);
    const font = useSelector((state) => state.application.font);

    
    const darkOption = forceDark
        ? "Always on"
        : forceDark != null
        ? "Always off"
        : "dynamic_system";


    const renderContent = () => {
        return (
            <ScrollView
                contentContainerStyle={[
                    styles.contain,
                    { paddingTop: isShowHeader ? 15 : 0 },
                ]}>
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate("ThemeSetting");
                    }}>
                    <Text body1>{"theme"}</Text>
                    <View
                        style={[
                            styles.themeIcon,
                            { backgroundColor: colors.primary },
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => navigation.navigate("FontOption")}>
                    <Text body1>{"Font"}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Text body1 grayColor>
                            {font ?? "Default"}
                        </Text>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                            enableRTL={true}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate("SelectDarkOption");
                    }}>
                    <Text body1>{"Dark theme"}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Text body1 grayColor>
                            {darkOption}
                        </Text>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                            enableRTL={true}
                        />
                    </View>
                </TouchableOpacity>

                <View style={styles.profileItem}>
                    <Text body1>{'App version'}</Text>
                    <Text body1 grayColor>
                        {BaseSetting.appVersion}
                    </Text>
                </View>
            </ScrollView>
        );
    };

    if (!isShowHeader) {
        return renderContent();
    }

    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}>
            <Header
                title={"Settings"}
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

            {renderContent()}
        </SafeAreaView>
    );
}
