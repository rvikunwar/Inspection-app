import React from "react";
import { PlaceholderLine, Placeholder } from "@components";
import styles from "./styles";

const Loading = (props) => {
  const { style } = props;
  return (
    <Placeholder>
      <PlaceholderLine width={100} style={[styles.contain, style]} />
    </Placeholder>
  );
};

export default Loading;
