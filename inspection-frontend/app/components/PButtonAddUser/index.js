import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "@components/Icon";
import styles from "./styles";
import { useTheme } from "@config";

const PButtonAddUser = ({
    onPress = () => {}
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: colors.primary }]}
            onPress={onPress}
        >
            <Icon name="plus-circle" size={14} solid color={colors.primary} />
        </TouchableOpacity>
    );
};

export default PButtonAddUser;
