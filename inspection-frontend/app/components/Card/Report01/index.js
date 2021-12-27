import Icon from "@components/Icon";
import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { parseHexTransparency } from "@utils";

const CardReport01 = ({
    title = "",
    price = "",
    icon = "",
    style = {},
    onPress = () => {},
    disabled = false,
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, style]}
            onPress={onPress}
        >
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}
            >
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
                    <Text subhead light style={{ marginLeft: 5 }}>
                        {title}
                    </Text>
                </View>
                <Text headline style={{ marginTop: 8 }}>
                    {price}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

CardReport01.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  price: PropTypes.string,
  icon: PropTypes.string,
};

export default CardReport01;
