import Image from "@components/Image";
import Text from "@components/Text";
import Tag from "@components/Tag";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { renderTimestamp } from '@common'
import Procfile from '@assets/images/procfile.jpg'


export default function ListTextButton(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    description,
    styleName,
    styleDescription,
    onPressRight,
    componentRight,
    tagName,
    online,
    timestamp,
    is_seen
  } = props;
  const { colors } = useTheme();



  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.4}
    >
      <View style={[styles.contentLeft, styleLeft]}>
        <View style={{position:"relative"}}>
          {image ? <Image source={image} style={[styles.thumb, styleThumb]} />:
          <Image source={Procfile} style={[styles.thumb, styleThumb]}/>}
          {online &&<View style={{
            width: 12,
            height: 12,
            borderRadius: 15,
            position:"absolute",
            bottom:0,
            right:8,
            backgroundColor:"#6BCE18",
            opacity:1
          }}/>}
        </View>
       
        <View>
          <Text headline semibold numberOfLines={1} style={{fontSize: 17, paddingTop:1, fontWeight: !is_seen?'600':'500'}}>
            {name}
          </Text>
          <View style={{flexDirection:"row",  marginTop: -2}}>
            <Text
                callout
                numberOfLines={1}
                style={[{
                    color: is_seen? "#9B9B9B": 'rgba(0,0,0,0.8)',
                    fontWeight: !is_seen?'800':'500',
                    fontSize:15,
                    fontFamily:!is_seen?'Droidkufi-Bold':'Droidkufi-Regular' }, 
                    styleDescription,
                    ]}
            >
                {description.length>30 ?`${description.substring(0,33)} . . .`:description}  • 
            </Text>
            <Text footnote grayColor 
                style={{
                    marginTop:4,
                    color: is_seen? "#9B9B9B": 'rgba(0,0,0,0.8)',
                    fontWeight: !is_seen?'700':'500',
                    }}>
                {"  " +renderTimestamp(timestamp.replace(/-/g,"/")) +"  "}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.contentRight, styleRight]}>
        {componentRight ? (
          componentRight
        ) : (
          <Tag outline>
            {tagName}
          </Tag>
        )}
      </View>
    </TouchableOpacity>
  );
}

ListTextButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  description: PropTypes.string,
  iconName: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onPressRight: PropTypes.func,
  tagName: PropTypes.string,
};

ListTextButton.defaultProps = {

  name: "",
  description: "",
  iconName: "mobile-alt",
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  style: {},
  onPress: () => {},
  onPressRight: () => {},
  tagName: "",
};
