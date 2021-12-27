import Icon from "@components/Icon";
import Text from "@components/Text";
import { BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import styles from "./styles";
import { parseHexTransparency } from "@utils";
import Loading from "./Loading";
export default function CategoryIconSoft({
    style = "",
    icon = "",
    title = "",
    onPress = () => {},
    loading = false,
    isNormal = true,
    isWhite = false,
    isRound = false,
    isBlack = false,
    maxWidth = 60,
}) {
    const { colors } = useTheme();
    if (loading) {
        return <Loading style={style} />;
    }

    const getIconColor = () => {
        if (isWhite) {
            return BaseColor.whiteColor;
        }
        if (isBlack) {
            return colors.text;
        }
        return colors.primaryLight;
    };

    return (
        <TouchableOpacity
            style={StyleSheet.flatten([
                styles.contain,
                isNormal && { backgroundColor: colors.backgroundColor },
                isWhite && { backgroundColor: BaseColor.grayColor },
                style,
            ])}
            onPress={onPress}
        >
            <View
                style={StyleSheet.flatten([
                    styles.iconContent,
                    isNormal && {
                        backgroundColor: parseHexTransparency(
                            colors.primary,
                            30
                        ),
                    },
                    isWhite && {
                        backgroundColor: parseHexTransparency(
                            colors.whiteColor,
                            30
                        ),
                    },
                    isBlack && {
                        backgroundColor: parseHexTransparency(
                            BaseColor.grayColor,
                            30
                        ),
                    },
                    isRound && styles.isRound,
                ])}
            >
                <Icon
                    name={icon}
                    size={isRound ? 24 : 32}
                    color={getIconColor()}
                    solid
                />
            </View>
            <View style={{ marginTop: 8, maxWidth: maxWidth }}>
                <Text
                    footnote
                    numberOfLines={1}
                    style={{ textAlign: "center" }}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

CategoryIconSoft.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    icon: PropTypes.node.isRequired,
    title: PropTypes.string,
    onPress: PropTypes.func,
};

CategoryIconSoft.defaultProps = {
    style: {},
    icon: "",
    title: "",
    onPress: () => {},
};
