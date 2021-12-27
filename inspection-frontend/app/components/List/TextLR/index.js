import { Text } from "@components";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity } from "react-native";
import styles from "./styles";
import { useTheme } from "@config";

const ListTextLR = ({
    style = {},
    textLeft = "",
    textRight = "",
    onPress = () => {},
    disabled = false
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                { borderBottomColor: colors.border },
                style,
            ]}
            onPress={onPress}
        >
            <Text body2 light>
                {textLeft}
            </Text>
            <Text body2>{textRight}</Text>
        </TouchableOpacity>
    );
};

ListTextLR.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    textLeft: PropTypes.string,
    textRight: PropTypes.string,
    onPress: PropTypes.func,
};

export default ListTextLR;
