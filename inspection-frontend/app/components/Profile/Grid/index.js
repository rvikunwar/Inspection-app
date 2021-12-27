import Image from "@components/Image";
import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity } from "react-native";
import styles from "./styles";

export default function ProfileGridSmall(props) {
    const { style, image, onPress, name } = props;
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.contain, style]}
            onPress={onPress}
        >
            <Image
                source={image}
                style={[styles.thumb, { borderColor: colors.border }]}
            />
            <Text body1>
                {name}
            </Text>
        </TouchableOpacity>
    );
}

ProfileGridSmall.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    image: PropTypes.node.isRequired,
    name: PropTypes.string,
    onPress: PropTypes.func,
};

ProfileGridSmall.defaultProps = {
    image: "",
    name: "",
    style: {},
    onPress: () => {},
};
