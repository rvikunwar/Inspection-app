import React from "react";
import { View } from "react-native";
import { PlaceholderLine, Placeholder } from "@components";
import styles from "./styles";
import ProfileAuthor from "@components/Profile/Author";

const Loading = (props) => {
  const { style } = props;
  return (
    <Placeholder style={style}>
        <PlaceholderLine style={styles.imageBackground} noMargin />
        <ProfileAuthor loading={true}/>
        <PlaceholderLine width={100}  noMargin/>
    </Placeholder>
  );
};

export default Loading;
