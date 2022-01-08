import React from "react";
import { Icon, Text } from "@components";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { BaseColor, useTheme } from "@config";
import { useSelector } from "react-redux";

export const tabBarIcon = ({ color, name }) => (
    <Icon name={name} size={20} solid color={color} />
);

export const tabBarIconHaveNoty = ({ countFunc, color, name }) => {

    const count = useSelector(countFunc)
    
    return (
        <View>
            {tabBarIcon({ color, name })}
            { count>0 &&<View
                style={{
                    borderWidth: 1,
                    borderColor: BaseColor.whiteColor,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    width: 20,
                    height: 20,
                    backgroundColor:'#5DADE2',
                    zIndex:100,
                    top: -5,
                    right: -12,
                    borderRadius: 10,
                }}
            >
                <Text whiteColor caption2>
                    {count}
                </Text>
            </View>
        }
        </View>
)};

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigator = ({
    tabScreens = {}, initialRoute
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();


    return (
        <BottomTab.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                showIcon: true,
                showLabel: true,
                activeTintColor: colors.primaryColor,
                inactiveTintColor: BaseColor.grayColor,
                labelStyle: {
                    fontSize: 12,
                },
            }}
        >
            {Object.keys(tabScreens).map((name, index) => {
                const { options, component } = tabScreens[name];

                return (
                    <BottomTab.Screen
                        key={index}
                        name={name}
                        component={component}
                        options={{
                            ...options,
                            title: t(options.title),
                        }}
                    />
                );
            })}
        </BottomTab.Navigator>
    );
};

