import {
    UIManager,
    LayoutAnimation,
    PixelRatio,
    Dimensions,
    I18nManager,
} from "react-native";
import { reloadAsync } from "expo-updates";
import { TRANSPARENCIES } from "./transparencies";
import { Alert, Platform } from 'react-native'
import { Linking } from 'expo';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

  
const scaleValue = PixelRatio.get() / 2;

export const setupLayoutAnimation = () => {
    if (Platform.OS === "android") {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
};

export const enableExperimental = () => {
    if (Platform.OS === "android") {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};
  
export const scaleWithPixel = (size, limitScale = 1.2) => {
    /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
    const value = scaleValue > limitScale ? limitScale : scaleValue;
    return size * value;
};

export const heightHeader = () => {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const landscape = width > height;

    if (Platform.OS === "android") return 45;
    if (Platform.isPad) return 65;
    switch (height) {
        case 375:
        case 414:
        case 812:
        case 896:
            return landscape ? 45 : 88;
        default:
            return landscape ? 45 : 65;
    }
};

export const heightTabView = () => {
    const height = Dimensions.get("window").height;
    let size = height - heightHeader();
    switch (height) {
        case 375:
        case 414:
        case 812:
        case 896:
          size -= 30;
          break;
        default:
          break;
    }

    return size;
};
  
export const getWidthDevice = () => {
    return Dimensions.get("window").width;
};

export const getHeightDevice = () => {
    return Dimensions.get("window").height;
};

export const scrollEnabled = (contentWidth, contentHeight) => {
    return contentHeight > Dimensions.get("window").height - heightHeader();
};

export const languageFromCode = (code) => {
    switch (code) {
        
        case "en":
            return "English";
      
        case "ar":
            return "Arabic";
      
        default:
            return "Unknown";
    }
};

export const isLanguageRTL = (code) => {
    switch (code) {
        case "ar":
            return true;
        default:
            return false;
    }
};

export const reloadLocale = (oldLanguage, newLanguage) => {
    const oldStyle = isLanguageRTL(oldLanguage);
    const newStyle = isLanguageRTL(newLanguage);
    if (oldStyle != newStyle) {
        I18nManager.forceRTL(newStyle);
        reloadAsync();
    }
};
  
export const parseHexTransparency = (
    hexColor = "#ffffff",
    transparency = 0
) => {
    return `${hexColor}${TRANSPARENCIES?.[transparency] ?? "00"}`;
};
  
export const haveChildren = (parent = "", children = "") => {
    const parentNew = parent?.toLowerCase?.();
    const childrenNew = children?.toLowerCase?.();
    return parentNew?.includes(childrenNew);
}


/**
 * @description it is for asking permission from user to send and recieve push notifications
 */
export const hasNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    
    let finalStatus = existingStatus;
    // If we don't already have permission, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') return true;
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Warning',
        'You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.',
        [
          { text: 'Cancel' },
          // If they said no initially and want to change their mind,
          // we can automatically open our app in their settings
          // so there's less friction in turning notifications on
          { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      )
      return false;
    }
  } catch (error) {
    Alert.alert(
      'Error',
      'Something went wrong while check your notification permissions, please try again later.'
    );
    return false;
  }
}


/**
 * @description for getting push notification
 */
export async function getPushToken() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("EXPO-TOKEN - ", token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }

