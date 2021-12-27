import ProfileAuthor from "@components/Profile/Author";
import Text from "@components/Text";
import { Images } from "@config";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";
import { InspectionAPI } from "../../../connect/api";
import { HOST_URL } from '@env'


const News169 = (props) => {
  const { name, description, title, style, image, avatar, onPress, loading, head, refreshing } = props;

  if (loading) {
    return <Loading style={style}/>;
  }

  //GET DETAILS OF THE MEMBER HEAD
  const [ member, setMember ] =  useState()
  useEffect(()=>{
      let isMounted = true

      if((isMounted && head )|| (isMounted && refreshing===true && head)){
        InspectionAPI.getMemberProfileDetails(head).then((res)=>{
              setMember(res)
          }).catch((err)=>{
              console.log(err)
          })
      }
      return ()=>{
          isMounted=false
      }

  },[refreshing])

  return (
    <TouchableOpacity style={[style,{marginBottom:30}]} onPress={onPress}>
      <ImageBackground
        source={{uri:image}}
        style={styles.imageBackground}
        borderRadius={8}
      />
      <ProfileAuthor image={{uri:`${HOST_URL}${member?.profile_image}`}} 
        name={member?.first_name} description={member?.position} />
      <Text title3 semibold>
        {title}
      </Text>
      <View>
        <Text blackColor semibold>
          {description.substring(0,100)} . . .
        </Text>
      </View>
    </TouchableOpacity>
  );
};

News169.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

News169.defaultProps = {
  style: {},
  image: Images.news,
  avatar: Images.profile2,
  name: "",
  description: "",
  title: "",
  onPress: () => {},
};

export default News169;
