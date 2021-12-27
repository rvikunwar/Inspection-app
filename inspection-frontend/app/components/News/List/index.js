import Image from "@components/Image";
import Text from "@components/Text";
import { Images } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";

const NewsList = (props) => {
  const { style, onPress, image, subtitle, date, loading ,description, title  } = props;
  if (loading) {
    return <Loading style={style}/>;
  }
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image  source={{uri:image}} style={styles.image} />
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: -15,
          flex: 1,
          paddingVertical: 0,
        }}
      >
        <Text light footnote semibold grayColor>
        </Text>
        <Text
          headline
          semibold
          numberOfLines={2}
          style={styles.marginVertical5}
        >
          {title}
        </Text>
        <Text caption1 light grayColor>
          {description.substring(0,100)} . . .
        </Text>
        <View style={styles.contentRate} />
      </View>
    </TouchableOpacity>
  );
};

NewsList.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  date: PropTypes.string,
};

NewsList.defaultProps = {
  style: {},
  onPress: () => {},
  image: Images.news,
  title: "",
  subtitle: "",
  date: "",
};

export default NewsList;
