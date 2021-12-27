import React from "react";
import { View, Text } from "react-native";
import { PlaceholderLine, Placeholder } from "@components";
import styles from "./styles";

const Loading = (props) => {
  const { style } = props;
  return (
    <Placeholder style={[styles.loading, style]}>
      <PlaceholderLine style={styles.imageWishlist} />
      <PlaceholderLine width={100} />
      {/* <PlaceholderLine width={50} /> */}
    </Placeholder>
  );
};

export default Loading;
