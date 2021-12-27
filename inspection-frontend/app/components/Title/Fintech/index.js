import { Text } from "@components";
import React from 'react';
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";

const TitleFintech = ({
    style = {},
    title = "",
    textMore = "",
    onPress = () => {},
}) => {
    return (
        <View style={[styles.titleList, style]}>
            <Text title3>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text body2 accentColor>
                    {textMore}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TitleFintech
