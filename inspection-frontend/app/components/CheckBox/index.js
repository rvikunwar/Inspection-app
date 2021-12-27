import Icon from "@components/Icon";
import Text from "@components/Text";
import { useTheme } from "@config";
import React from "react";
import { TouchableOpacity } from "react-native";

const CheckBox = ({
  onPress = () => {},
  title = "",
  checkedIcon = "check-square",
  uncheckedIcon = "square",
  checked = true,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={onPress}
    >
      <Icon
        solid={checked}
        name={checked ? checkedIcon : uncheckedIcon}
        color={colors.text}
        size={24}
      />
      <Text body1 style={{ paddingHorizontal: 8 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
