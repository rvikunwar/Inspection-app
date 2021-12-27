import React from "react";
import { View } from "react-native";
import CircularProgress from "./CircularProgress";
import Text from "@components/Text";
import { useTheme, BaseColor } from "@config";

const ProgressCircle = ({
    percent = 0,
    size = 40,
    borderWidth = 5,
    blankColor = "",
    donutColor = "",
    fillColor = "",
    style = {}
}) => {
    const { colors } = useTheme();
    return (
        <View style={style}>
            <CircularProgress
                percentage={percent}
                progressWidth={size / 2 - borderWidth}
                size={size}
                blankColor={BaseColor.text}
                donutColor={colors.primaryLight}
                fillColor={colors.background}
                // blankColor={blankColor || BaseColor.text}
                // donutColor={donutColor || colors.primaryLight}
                // fillColor={fillColor || colors.dividerColor}
            >
                <Text headline>{percent}%</Text>
            </CircularProgress>
        </View>
    );
};

export default ProgressCircle;
