import { Icon, Image, Text } from "@components";
import { Images, BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import ProgressBar from "@components/Progress/Bar";

const CardReport10 = ({
    icon = "",
    style = {},
    name = "",
    price = "",
    onPress = () => {},
    percent = "0",
    backgroundIcon = "",
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <View
                style={[
                    styles.image,
                    { backgroundColor: backgroundIcon || colors.primaryLight },
                ]}
            >
                <Icon
                    name={icon}
                    size={18}
                    style={{ color: BaseColor.whiteColor }}
                    solid
                />
            </View>
            <View
                style={{
                    paddingLeft: 15,
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text headline style={{ marginBottom: 10 }}>
                        {name}
                    </Text>
                    <Text headline style={[styles.text, { marginBottom: 10 }]}>
                        {price}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <ProgressBar
                        style={{ flex: 1, paddingRight: 20 }}
                        percent={percent}
                    />
                    <Text footnote light>
                        {`${percent}%`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

CardReport10.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    icon: PropTypes.string,
    name: PropTypes.string,
    percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onPress: PropTypes.func,
    backgroundIcon: PropTypes.string
};

export default CardReport10;
