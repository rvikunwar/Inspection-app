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
import { EFilterColors, EFilterSizes } from "@data";
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
import { FFriends } from "@data";
import { haveChildren } from "@utils";
import { InspectionAPI } from "../../connect/api";
import { HOST_URL } from "@env"


const AreaView = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const  { area, department }  = route.params;
  const [loading, setLoading] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [modalVisible, setModalVisible] = useState(false);
  const [colorChoosed, setColorChoosed] = useState(EFilterColors[0]);
  const [sizeChoosed, setSizeChoosed] = useState(EFilterSizes[0]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const productData = {  ...area };


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);


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
      setUserv1(ins)
      setUser(ins)
    }

  },[route.params?.inspectors])



  const renderPlaceholder = () => {
    let holders = Array.from(Array(7));

    return (
      <Placeholder>
        <View style={{padding: 20}}>
          {holders.map((item, index) => (
            <PlaceholderLine style={{height:10, marginBottom:30}} key={index} width={100}/>
          ))}
        </View>
      </Placeholder>
    );
  };


  const [keyword, setKeyword] = useState("");

  const filterCategory = (text) => {
      setKeyword(text);
      if (text) {
          setUser(
              users.filter(
                  (item) =>
                      haveChildren(item.first_name, text) ||
                      haveChildren(item.last_name, text)
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
           setSearch("")
   
               try{
                InspectionAPI.listOfProfiles(area.id, department.id)
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
      <View
          style={{
              paddingTop: 15,
              paddingBottom: 20,
          }}
      >
          <TextInput
              onChangeText={filterCategory}
              placeholder={t("name_username_or_email")}
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
      <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
                elevation={1}
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }
          renderItem={({ item, index }) => (
              <ListTextButton
                  image={{uri:`${HOST_URL}${item.profile_image}`}}
                  name={item.first_name +" "+ item.last_name}
                  description={item.email}
                  online={true}
                  componentRight={
                      <Tag
                          onPress={() => {
                            navigation.navigate("Messages",{ selectedUser: item.user, 
                              selectedUser_image: `${HOST_URL}${item.profile_image}`, 
                              profile: item  });
                          }}
                          outline
                          style={{
                              paddingHorizontal: 20,
                              backgroundColor: colors.background,
                          }}
                      >
                          {`${t("send")}`}
                      </Tag>
                  }
              />
          )}
      />
  </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: "always", bottom: "always" }}
      >
        <Header title={department?.name} />
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
          <View style={{ height: 220 - heightHeader }} />
          <View
            style={{
              marginVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text subhead>{department?.name} </Text>
            <Text title3 style={{ marginVertical: 10, marginVertical: 4 }}>
              {area.name}
            </Text>
          </View>

          {loading ? renderPlaceholder() : renderContent()}
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
          navigation.navigate("PreviewMap")
        }
      >
          <MapView style={[styles.map, {flex: 1, width: "100%"}]}
            showsBuildings={true}
            showsTraffic={true}
            showsIndoors={true}
            scrollEnabled={false}
            pitchEnabled={true}
            showsIndoors={true}
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
            style={{color:"black"}}
            barStyle=""
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
                      tintColor: "black",
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
