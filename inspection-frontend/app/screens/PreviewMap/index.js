import { Header, Icon, Image, SafeAreaView, Text } from "@components";
import { BaseColor, BaseStyle, Images, useTheme } from "@config";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View,StatusBar} from "react-native";
import styles from "./styles";
import MapView from 'react-native-maps';


const imagesInit = [
  { id: "1", image: Images.location1, selected: true },
  { id: "2", image: Images.location2 },
  { id: "3", image: Images.location3 },
  { id: "4", image: Images.location4 },
  { id: "5", image: Images.location5 },
  { id: "6", image: Images.location6 },
  { id: "7", image: Images.location7 },
];

export default function PreviewMap({ navigation, route }) {
  const { colors } = useTheme();
  const imagesParam = route?.params?.images ?? imagesInit;
  let flatListRef = null;
  let swiperRef = null;

  const [images, setImages] = useState(imagesParam);
  const [indexSelected, setIndexSelected] = useState(0);


  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
    setImages(
      images.map((item, index) => {
        if (index == indexSelected) {
          return {
            ...item,
            selected: true,
          };
        } else {
          return {
            ...item,
            selected: false,
          };
        }
      })
    );
    flatListRef.scrollToIndex({
      animated: true,
      index: indexSelected,
    });
  };

  /**
   * @description Called when image item is selected or activated
   */
  const onTouchImage = (touched) => {
    if (touched == indexSelected) return;
    swiperRef.scrollBy(touched - indexSelected, false);
  };

  const area = route?.params?.area

  return (
    <View >

      <TouchableOpacity style={{alignItems:"center", justifyContent:"center", width:50, height:40, 
        position:"absolute", top:30, 
        zIndex:100, right:2}}  
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="times" size={20}  color={"gray"}/>
      </TouchableOpacity>

        <MapView style={styles.map}
             showsBuildings={true}
             showsTraffic={true}
             showsIndoors={true}
             scrollEnabled={true}
             pitchEnabled={true}
             showsIndoors={true}
            initialRegion={{
              latitude: parseFloat(area?.latitude),
              longitude: parseFloat(area?.longitude),
              latitudeDelta: 0.005,
              longitudeDelta: 0.02,
            }}/>
  
    </View>
  );
}
