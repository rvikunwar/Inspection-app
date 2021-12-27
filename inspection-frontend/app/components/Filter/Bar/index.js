import { Icon, Text } from "@components";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useTheme } from "@config";

const FilterBar = ({
    style = {},
    onPress = () => {},
    leftTitle = "",
    centerTitle = "",
    rightTitle = "",
    value = {
        leftValue: false,
        centerValue: false,
        rightValue: true,
    },
    onChange = () => {},
}) => {
    const { colors } = useTheme();
    const renderView = (title, key = "leftValue", location) => (
        <TouchableOpacity
            style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: location,
            }}
            onPress={() => {
                onChange({ ...value, [key]: !value?.[key] });
            }}
        >
            <Text body2 style={styles.text}>
                {title}
                {"  "}
                <Icon
                    name={Boolean(value?.[key]) ? "chevron-up" : "chevron-down"}
                />
            </Text>
        </TouchableOpacity>
    );

    return (
        <View
            style={[
                styles.container,
                { borderBottomColor: colors.border },
                style,
            ]}
            onPress={onPress}
        >
            {renderView(leftTitle, "leftValue", "flex-start")}
            {renderView(centerTitle, "centerValue", "center")}
            {renderView(rightTitle, "rightValue", "flex-end")}
        </View>
    );
};

FilterBar.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    leftTitle: PropTypes.string,
    centerTitle: PropTypes.string,
    rightTitle: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
};

export default FilterBar;
