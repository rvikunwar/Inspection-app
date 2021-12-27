import Text from "@components/Text";
import { Images, useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";

const NewsGrid = (props) => {
  let { title, style, image, onPress, loading, description } = props;
  const { colors } = useTheme();

  if (loading) {
    return <Loading style={style}/>;
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <ImageBackground
          source={{uri:image}}
          style={styles.imageBackground}
          borderRadius={8}
        />

        <Text title3 style={{paddingBottom:0}} numberOfLines={1}>
          {title}
        </Text>

        <Text body2 medium style={styles.title} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

NewsGrid.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

NewsGrid.defaultProps = {
  style: {},
  image: Images.news,
  title: "",
  onPress: () => {},
};

export default NewsGrid;
