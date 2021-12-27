import Icon from "@components/Icon";
import Text from "@components/Text";
import React, { Component, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ActionButton from "react-native-action-button";
import { useTheme, BaseColor } from "@config";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "@actions/actionTypes";

const MENUS = {
  news: {
    id: "news",
    iconName: "book",
    title: "News",
    navigate: "NewsMenu",
  },
  eCommerce: {
    id: "eCommerce",
    iconName: "shopping-cart",
    title: "E-commerce",
    navigate: "ECommerceMenu",
  },
};
const index = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const menuChoosed = useSelector((state) => state.application.menu);

  const handleChangeMenu = (menu) => {
    navigation.replace(menu.navigate);
    dispatch({
      type: actionTypes.SET_MENU,
      menu: menu.id,
    });
  };

  return (
    <ActionButton
      offsetX={20}
      offsetY={20}
      buttonColor={colors.primary}
      renderIcon={() => <Icon name="list-ul" color={BaseColor.whiteColor} size={24} />}
      size={56}
    >
      {Object.keys(MENUS).map((key) => {
        const menu = MENUS[key];
        return (
          <ActionButton.Item
            key={key}
            size={40}
            buttonColor={
              menuChoosed == key ? colors.primary : BaseColor.kashmir
            }
            title={
              <Text body1={menuChoosed != key} headline={menuChoosed == key}>
                {menu.title}
              </Text>
            }
            textStyle={{ fontSize: 9 }}
            textContainerStyle={{
              paddingHorizontal: 0,
              backgroundColor: "transparent",
              borderWidth: 0,
              shadowOpacity: null,
            }}
            onPress={() => handleChangeMenu(menu)}
          >
            <Icon name={menu.iconName} color={BaseColor.whiteColor} size={16} />
          </ActionButton.Item>
        );
      })}
    </ActionButton>
  );
};

export default index;
