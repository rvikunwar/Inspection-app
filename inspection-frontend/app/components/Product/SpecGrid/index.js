import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";

const SpecGrid = ({ style, description, title, renderTitle = null }) => {
    const { colors } = useTheme();
    return (
        <View style={style}>
            <Text caption1 grayColor>
                {description}
            </Text>
            {renderTitle ? (
                renderTitle()
            ) : (
                <Text body1 style={{ marginTop: 4 }}>
                    {title}
                </Text>
            )}
        </View>
    );
};

SpecGrid.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    description: PropTypes.string,
    title: PropTypes.any,
    renderTitle: PropTypes.func,
};

SpecGrid.defaultProps = {
    style: {},
    title: "",
    description: "",
    renderTitle: null
};

export default SpecGrid;
