import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View, ImageBackground } from "react-native";
import styles from "./styles";
import { Images } from "@config";
import Loading from "./Loading";

const ProductCategory3 = (props) => {
  const { title, subtitle, image, style, onPress, loading } = props;
  const { colors } = useTheme();

  if (loading) {
    return <Loading style={style}/>;
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <ImageBackground
        source={image}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={[styles.content]}>
          <View style={[styles.viewText]}>
            <Text headline whiteColor numberOfLines={1}>
              {title}
            </Text>
            <Text footnote whiteColor>
              {subtitle}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

ProductCategory3.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.node.isRequired,
};

ProductCategory3.defaultProps = {
  onPress: () => {},
  style: {},
  subtitle: "",
  title: "",
  image: Images.location1,
};

export default ProductCategory3;
