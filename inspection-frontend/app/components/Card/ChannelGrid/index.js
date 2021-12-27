import Image from "@components/Image";
import Text from "@components/Text";
import { Images } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";

const CardChannelGrid = (props) => {
  const { style, onPress, image, title, loading } = props;

  if (loading) {
    return <Loading style={style}/>;
  }

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={image} style={styles.imageWishlist} />
      <View style={{ paddingHorizontal: 10 }}>
        <Text
          headline
          semibold
          numberOfLines={2}
          style={styles.marginVertical3}
        >
          {title}
        </Text>

        <View style={styles.contentRate} />
      </View>
    </TouchableOpacity>
  );
};

CardChannelGrid.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  item: PropTypes.object,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
  type: PropTypes.string,
};

CardChannelGrid.defaultProps = {
  style: {},
  onPress: () => {},
  onPressTag: () => {},
  image: Images.channel1,
  title: "CNN",
};

export default CardChannelGrid;
