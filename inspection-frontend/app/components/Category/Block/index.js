import Image from "@components/Image";
import { Text, Icon } from "@components";
import { Images } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Loading from "./Loading";
import MapView from 'react-native-maps';


const CategoryBlock = (props) => {
  const { style, title, latitude, longitude, subtitle, onPress, loading } = props;
  if (loading) {
    return <Loading style={style}/>;
  }

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.5}
    >
    <MapView style={[styles.map, {flex: 1}]}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          scrollEnabled={false}
          pitchEnabled={true}
          showsIndoors={true}

          initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.02,
          }}/>
      <View style={styles.contentIcon}>
        <View style={{ paddingLeft: 0 }}>
          <View style={{marginTop:-10,  paddingTop:0}}>
            <Icon name=""/>
            <Text headline bold blackColor>
              {title}
            </Text>
          </View>
          
          <Text body2 bold whiteColor>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

CategoryBlock.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

CategoryBlock.defaultProps = {
  style: {},
  image: Images.location1,
  title: "",
  subtitle: "",
  onPress: () => {},
};

export default CategoryBlock;
