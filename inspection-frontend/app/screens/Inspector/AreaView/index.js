import {
  Header,
  Icon,
  SafeAreaView,
  ListTextButton,
  Tag,
  TextInput,
  Text,
} from "@components";
import { BaseColor, BaseStyle, Images, useTheme } from "@config";
import * as Utils from "@utils";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  I18nManager,
  ScrollView,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl
} from "react-native";
import styles from "./styles";
import { PlaceholderLine, Placeholder } from "@components";
import MapView from 'react-native-maps';
import { haveChildren } from "@utils";
import { InspectionAPI } from "@connect/api";
import { HOST_URL } from "@env"
import Procfile from '@assets/images/procfile.jpg'
import { darkStyle } from '../../PreviewMap/darkStyle'


const AreaView = (props) => {
    const { navigation, route } = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
    const scrollY = useRef(new Animated.Value(0)).current;
    
    const  { area, entity }  = route.params;

    //For header background color from transparent to header color
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [BaseColor.whiteColor, colors.text],
        extrapolate: "clamp",
        useNativeDriver: true,
    });

    //For header image opacity
    const headerImageOpacity = scrollY.interpolate({
        inputRange: [0, 250 - heightHeader - 20],
        outputRange: [1, 0],
        extrapolate: "clamp",
        useNativeDriver: true,
    });

    //artist profile image position from top
    const heightViewImg = scrollY.interpolate({
        inputRange: [0, 250 - heightHeader],
        outputRange: [250, heightHeader],
        useNativeDriver: true,
    });


    /**
     * @description api call for list of users working on a area
     */
    const [ users, setUser ] = useState([])
    const [userv1, setUserv1] = useState([]);
    useEffect(()=>{
  
        const ins = route.params?.inspectors
    
        if(route.params?.inspectors){
            setUserv1([...ins, ...ins])
            setUser([...ins, ...ins])
        }
  
    },[route.params?.inspectors])

    const department = route.params?.entity


    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setUser(
                userv1.filter(
                    (item) =>
                        haveChildren(item.first_name, text) ||
                        haveChildren(item.email, text)
                )
            );
        } else {
            setUser(userv1);
        }
    };

    /**
   * @description CALLBACK FOR REFRESHING DATA
   */
      const [refreshing, setRefreshing] = useState(false);
      const onRefresh = useCallback(() => {
          setRefreshing(true);
          setLoading(true)
  
              try{
              InspectionAPI.listOfProfiles({area:area.id, entity:entity.id})
              .then((res)=>{
                  setUserv1(res)
                  setUser(res)
                  setLoading(false)
                  setRefreshing(false)
              })
              .catch((err)=>{
                  console.log(err)
                  setLoading(false) 
                  setRefreshing(false)
              })
              }
              catch(err){
                  setLoading(false)
  
                  setRefreshing(false)
              }
          
          }, [refreshing]);

    const renderContent = () => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 20 }}>

                {users.map((item, index)=>(
                    <ListTextButton
                        key={index}
                        style={{paddingHorizontal:7, marginTop:0}}
                        image={item.profile_image?{uri:`${HOST_URL}${item.profile_image}`}:Procfile}
                        name={item.first_name +" "+ item.last_name}
                        description={item.email}
                        online={item.online}
                        onPress={() => {
                            navigation.navigate("InsProfileView",{ profile: item, department:entity, area:area  });
                        }}
                        componentRight={
                            <Tag
                                outline
                                style={{
                                    paddingHorizontal: 20,
                                    backgroundColor: colors.background,
                                }}
                            >
                                {"check"}
                            </Tag>
                        }/>
                ))}

            </View>
        );
    };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: "always", bottom: "always" }}
      >
        <Header title={entity?.name} />
        <ScrollView
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          // showsHorizontalScrollIndicator={false}
          // showsVerticalScrollIndicator={false}
          overScrollMode={"never"}
          style={{ zIndex: 10 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            {
              useNativeDriver: false,
            }
          )}
        >
          <View style={{ height: 230 - heightHeader }} />
          <View
                style={{
                  marginTop: 10,
                  paddingHorizontal: 20,
                }}>
              <Text subhead>{entity?.name} </Text>
              <Text title3 style={{ marginVertical: 10, marginVertical: 4 }}>
                  {area.name}
              </Text>
            </View>

            <View
                style={{
                    paddingTop: 15,
                    paddingHorizontal: 25,
                    paddingBottom: 10,
                }}>
                <TextInput
                    onChangeText={filterCategory}
                    style={{elevation:3}}
                    placeholder={"name username or email"}
                    value={keyword}
                    icon={
                        <TouchableOpacity onPress={() => filterCategory("")}>
                            <Icon
                                name="times"
                                size={16}
                                color={BaseColor.grayColor}
                            />
                        </TouchableOpacity>
                    }
                />
            </View>
            {renderContent()}
        </ScrollView>

      </SafeAreaView>
      
      <Animated.View
        style={[
          styles.headerImageStyle,
          {
            opacity: headerImageOpacity,
            height: heightViewImg,
          },
        ]}
      >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={() =>
                    navigation.navigate("PreviewMap", { area, users, department })
                }>
                  <MapView style={[styles.map, { width: "100%", flex: 1}]}
                      showsBuildings={true}
                      showsTraffic={true}
                      showsIndoors={true}
                      scrollEnabled={false}
                      pitchEnabled={true}
                      showsIndoors={true}
                      customMapStyle={darkStyle}
                      initialRegion={{
                          latitude: parseFloat(area.latitude),
                          longitude: parseFloat(area.longitude),
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.02,
                    }}/>
            </TouchableOpacity>
          

      </Animated.View>
      <Animated.View style={[styles.headerStyle, { position: "absolute" }]}>
        <SafeAreaView
          style={{ width: "100%" }}
          forceInset={{ top: "always", bottom: "never" }}
        >
          <Header
            title=""
            renderLeft={() => {
              return (
                <Animated.Image
                  resizeMode="contain"
                  style={[
                    styles.icon,
                    {
                      transform: [
                        {
                          scaleX: I18nManager.isRTL ? -1 : 1,
                        },
                      ],
                      tintColor: headerBackgroundColor,
                    },
                  ]}
                  source={Images.angleLeft}
                />
              );
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
        </SafeAreaView>
      </Animated.View>

    </View>
  );
};

export default AreaView;
