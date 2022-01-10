import Icon from "@components/Icon";
import Image from "@components/Image";
import Text from "@components/Text";
import Tag from "@components/Tag";
import { useTheme } from "@config";
import { parseHexTransparency } from "@utils";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";

export default function ListTextButton(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    description,
    styleName,
    styleDescription,
    onPressRight,
    componentRight,
    tagName,
    online
  } = props;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.4}
    >
      <View style={[styles.contentLeft, styleLeft]}>
        <View style={{position:"relative"}}>
          {image ? <Image source={image} style={[styles.thumb, styleThumb]} />:null}
          {online &&<View style={{
            width: 12,
            height: 12,
            borderRadius: 15,
            position:"absolute",
            bottom:0,
            right:8,
            backgroundColor:"#6BCE18",
            opacity:1
          }}/>}
        </View>
       
        <View>
          <Text headline semibold numberOfLines={1} style={styleName}>
            {name}
          </Text>
          <Text
            footnote
            grayColor
            numberOfLines={1}
            style={[{ marginTop: 4 }, styleDescription]}
          >
            {description}
          </Text>
        </View>
      </View>
      <View style={[styles.contentRight, styleRight]}>
        {componentRight ? (
          componentRight
        ) : (
          <Tag onPress={onPressRight} outline>
            {tagName}
          </Tag>
        )}
      </View>
    </TouchableOpacity>
  );
}

ListTextButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  description: PropTypes.string,
  iconName: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onPressRight: PropTypes.func,
  tagName: PropTypes.string,
};

ListTextButton.defaultProps = {
  name: "",
  description: "",
  iconName: "mobile-alt",
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  style: {},
  onPress: () => {},
  onPressRight: () => {},
  tagName: "",
};
