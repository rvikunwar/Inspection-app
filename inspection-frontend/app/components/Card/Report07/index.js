import Icon from "@components/Icon";
import Text from "@components/Text";
import Tag from "@components/Tag";
import { useTheme, BaseColor } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { parseHexTransparency } from "@utils";

const CardReport07 = ({
    title = "",
    price = "",
    icon = "",
    style = {},
    onPress = () => {},
    subTitle = "",
    percent = "",
    isUp = true
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text headline>{price}</Text>
                    <View style={[styles.header]}>
                        <View
                            style={[
                                styles.viewIcon,
                                {
                                    backgroundColor: parseHexTransparency(
                                        colors.primaryLight,
                                        30
                                    ),
                                },
                            ]}
                        >
                            <Icon
                                name={icon}
                                size={12}
                                style={{ color: colors.primary }}
                                solid
                            />
                        </View>
                    </View>
                </View>
                <Text footnote light>
                    {title}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 5,
                        alignItems: "center",
                    }}
                >
                    <View
                        small
                        style={{
                            backgroundColor: parseHexTransparency(
                                isUp
                                    ? BaseColor.greenColor
                                    : colors.primaryLight,
                                30
                            ),
                            padding: 3,
                            borderRadius: 5,
                            marginRight: 5,
                        }}
                    >
                        <Text
                            caption2
                            style={{
                                color: isUp
                                    ? BaseColor.greenColor
                                    : colors.primaryLight,
                            }}
                        >
                            {percent}
                        </Text>
                    </View>
                    <Text caption2 light>
                        {subTitle}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

CardReport07.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  price: PropTypes.string,
  icon: PropTypes.string,
  subTitle: PropTypes.string,
};

export default CardReport07;
