import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useTheme, BaseColor } from "@config";
import styles from "./styles";

const ProgressBar = ({
    style = {},
    height = 5,
    color = "",
    percent = 10,
    width = "100%",
}) => {
    const { colors } = useTheme();
    return (
        <View style={[{ height: height, width: width }, style]}>
            <View style={styles.content}>
                <View
                    style={{
                        height: height,
                        width: "100%",
                        backgroundColor: colors.card,
                        borderRadius: height,
                        position: "absolute",
                    }}
                />
                <View
                    style={{
                        height: height,
                        width: `${percent}%`,
                        backgroundColor: color ? color : colors.primaryLight,
                        borderRadius: height,
                        position: "absolute",
                    }}
                />
            </View>
        </View>
    );
};

export default ProgressBar;
