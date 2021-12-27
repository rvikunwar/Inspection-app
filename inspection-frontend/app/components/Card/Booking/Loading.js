import React from "react";
import { View } from "react-native";
import { PlaceholderLine, Placeholder } from "@components";
import styles from "./styles";

const Loading = (props) => {
  return (
    <Placeholder style={{ marginVertical: 4 }}>
      <PlaceholderLine  width={40} noMargin />
    </Placeholder>
  );
};

export default Loading;
