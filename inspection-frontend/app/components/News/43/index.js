import ProfileAuthor from "@components/Profile/Author";
import Text from "@components/Text";
import { BaseColor, Images } from "@config";
import PropTypes from "prop-types";
import React ,{ useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";
import { LinearGradient } from "expo-linear-gradient"
import { InspectionAPI } from "../../../connect/api";
import { HOST_URL } from '@env'
import LoadingDots from "react-native-loading-dots";


const News43 = (props) => {
  const { name, description, title, image, style, avatar, onPress, loading, head, refreshing } = props;
  if (loading) {
    return <Loading style={style}/>;
  }

    //GET DETAILS OF THE MEMBER HEAD
    const [ member, setMember ] =  useState()
    useEffect(()=>{
        let isMounted = true

        if(isMounted && head ){
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
    <TouchableOpacity style={style} onPress={onPress}>
      <ImageBackground
        source={{uri:image}}
        style={styles.imageBackground}
        borderRadius={8}
      >
        <View style={styles.viewBackground}>
      
          <LinearGradient 
              colors={[ 'rgba(0,0,0,0.01)','rgba(0,0,0,0.8)']} 
              style={{width : '100%', paddingBottom:20}}>

          <View style={styles.viewItem}>
            {member?<ProfileAuthor
              styleThumb={styles.styleThumb}
              image={{uri:`${HOST_URL}${member?.profile_image}`}}
              styleName={{ color: BaseColor.whiteColor }}
              styleDescription={{
                color: BaseColor.whiteColor,
              }}
              style={{paddingHorizontal:8, }}
              name={member?.first_name+" "+member?.last_name}
              description={member?.position}
            />:<View style={{height:30, width:70,paddingTop:4, paddingLeft:10}}>
                <LoadingDots bounceHeight={2} size={16}/>
                </View>
                }
          </View>
              <View style={{paddingHorizontal:8}}>
                <Text title2 whiteColor semibold style={{opacity:0.8}}>
                  {title}
                </Text>
                <Text whiteColor semibold style={{opacity:0.8}}>
                  {description.substring(0,100)} . . .
                </Text>
              </View>

          </LinearGradient>
    
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

News43.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

News43.defaultProps = {
  style: {},
  image: Images.news,
  avatar: Images.profile2,
  name: "",
  description: "",
  title: "",
  onPress: () => {},
};

export default News43;
