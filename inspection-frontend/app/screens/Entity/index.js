import {
    FilterSort,
    Header,
    Icon,
    News169,
    News43,
    NewsGrid,
    NewsList,
    SafeAreaView,
    TextInput,
    Text
} from "@components";
import { BaseColor, useTheme, BaseStyle, Typography } from "@config";
// Load sample data
import { PostListData } from "@data";
import * as Utils from "@utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Animated, Platform, RefreshControl, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InspectionAPI } from "../../connect/api";
import { HOST_URL } from '@env'


const currentLocationInit = {
    latitude: null,
    longitude: null,
};

let timeoutChangeMode = null;

export const modes = {
    square: "align-right",
    bars: "bars",
    thList: "th-list",
    thLarge: "th-large",
};

const Entity = ({ mode = modes.square, posts = PostListData }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [modeView, setModeView] = useState(mode);
    const [currentLocation, setCurrentLocation] = useState(currentLocationInit);
    const [list, setList] = useState(posts);
    const [loading, setLoading] = useState(true);
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;

    const sortSelectedv1 = [ {
        text: "Ascending",
        value:"ascending",
        icon:"sort-amount-up"
    },
    {
        text: "Descending",
        value:"descending",
        icon:"sort-amount-down"
    },
    {
        text: "Random sort",
        value:"random",
        icon:"sort"
    }]

 

    const clampedScroll = useRef(
        Animated.diffClamp(
            Animated.add(
                scrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: "clamp",
                }),
                offsetAnim
            ),
            0,
            40
        )
    ).current;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const onChangeSort = () => {};

    const onFilter = () => {
        navigation.navigate("Filter");
    };

    const onChangeView = () => {
        setLoading(true);
        clearTimeout(timeoutChangeMode);
        timeoutChangeMode = setTimeout(() => {
            setLoading(false);
        }, 1000);
        Utils.enableExperimental();
        let mode = "align-right";
        switch (modeView) {
            case "align-right":
                mode = "bars";
                break;
            case "bars":
                mode = "th-list";
                break;
            case "th-list":
                mode = "th-large";
                break;
            case "th-large":
                mode = "align-right";
                break;

            default:
                break;
        }
        setModeView(mode);
    };

    const getTotalCol = () => {
        switch (modeView) {
            case "align-right":
                return 1;
            case "bars":
                return 1;
            case "th-list":
                return 1;
            case "th-large":
                return 2;
            default:
                return 1;
        }
    };

    const goPostDetail = (item) => () => {
        navigation.navigate("EntityMenu", { item: item });
    };

    const renderItem = ({ item, index }) => {
        switch (modeView) {
            case "align-right":
                return (
                    <News43
                        head={item.person_in_charge}
                        refreshing={refreshing}
                        loading={loading}
                        style={{ marginVertical: 8 }}
                        description={item.description}
                        title={item.name}
                        image={`${HOST_URL}${item.background_image}`}
                        onPress={goPostDetail(item)}
                    />
                );
            case "bars":
                return (
                    <News169
                        head={item.person_in_charge}
                        refreshing={refreshing}
                        loading={loading}
                        style={{ marginVertical: 8 }}
                        description={item.description}
                        title={item.name}
                        image={`${HOST_URL}${item.background_image}`}                       
                        onPress={goPostDetail(item)}
                    />
                );

            case "th-list":
                return (
                    <NewsList
                        loading={loading}
                        style={{ marginVertical: 8 }}
                        description={item.description}
                        title={item.name}
                        image={`${HOST_URL}${item.background_image}`}  
                        onPress={goPostDetail(item)}
                    />
                );
            case "th-large":
                return (
                    <NewsGrid 
                        description={item.description}
                        title={item.name}
                        image={`${HOST_URL}${item.background_image}`}  
                        loading={loading}
                        style={{
                            paddingLeft: index % 2 == 0 ? 0 : 15,
                            paddingBottom: 15,
                        }}

                        onPress={goPostDetail(item)}
                    />
                );
            default:
                break;
        }
    };

    const renderList = () => {
        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, 40],
            outputRange: [0, -40],
            extrapolate: "clamp",
        });
        const android = Platform.OS == "android";
        return (
            <View style={{ flex: 1, }}>
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentInset={{ top: 50 }}
                    contentContainerStyle={{
                        marginTop: android ? 50 : 0,
                        paddingBottom:50,
                        paddingHorizontal: 20,
                    }}
                    refreshControl={
                        <RefreshControl
                            elevation={1}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: scrollAnim,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                    data={departments}
                    key={getTotalCol()}
                    numColumns={getTotalCol()}
                    keyExtractor={(item, index) => item.id}
                    renderItem={renderItem}
                />
                {departments.length === 0&&<View style={{flex:1,justifyContent:"flex-start",
                    marginTop:-150, alignItems:"center"}}>
                    <Text style={{color:"gray"}}>No data availabale</Text>
                    </View>}
                <Animated.View
                    style={[
                        styles.navbar,
                        { transform: [{ translateY: navbarTranslate }] },
                    ]}
                >
                   
                    <FilterSort
                        modeView={modeView}
                        onChangeSort={onChangeSort}
                        onChangeView={onChangeView}
                        onFilter={onFilter}
                        sortSelectedv1={sortSelectedv1}
                        SortDepartments={SortDepartments}
                    />
                
                </Animated.View>
            </View>
        );
    };

    //Getting department data
    const [ departments, setDepartments ] = useState([])
    const [ Sdepartments, setSdepartments ] = useState([])
    useEffect(()=>{
        setLoading(true)
        InspectionAPI.getDepartments()
        .then((res)=>{
            setLoading(false)
            setDepartments(res)
            setSdepartments(res)
        }).catch((err)=>{
            console.log(err)
            setLoading(false)
        })
    },[])


    //CALLBACK FOR REFRESHING DATA
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoading(true)
        setSearch("")

            try{
                InspectionAPI.getDepartments()
                .then((res)=>{
                    setRefreshing(false)
                    setLoading(false)

                    setDepartments(res)
                }).catch((err)=>{
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


    const SortDepartments = (value) => {
        setLoading(true)
        InspectionAPI.getDepartments("sort", value[0].value)
        .then((res)=>{
            setLoading(false)
            setDepartments(res)
        }).catch((err)=>{
            console.log(err)
            setLoading(false)
        })
    }


    const [search, setSearch] = useState("");
    const  onSearchSubmit = (text) => {
        setSearch(text);
        setDepartments(
            text
                ? Sdepartments.filter((item) => {
                    if(item.name.toLowerCase().includes(text)){
                        return item
                    }})
                : Sdepartments
        );
    };


    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}
        >
            <Header
                title={t("DEPARTMENTS")}
            />
            <View style={{ paddingHorizontal:19, flexDirection:"row"}}>
                <TextInput
                    style={[BaseStyle.textInput, Typography.body1]}
                    onChangeText={(text)=>{
                        onSearchSubmit(text)
                    }}
                    autoCorrect={false}
                    placeholder={t("search")}
                    placeholderTextColor={BaseColor.grayColor}
                    value={search}
                    selectionColor={colors.primary}
                    onSubmitEditing={() => {
                        onSearchSubmit(search)
                    }}
                />
                <TouchableOpacity style={{width:70, marginLeft:-70, alignItems:"flex-end", paddingRight:20,
                     elevation:0, backgroundColor: "transparent"}} onPress={()=>{
                    onSearchSubmit(search)
                }}>
                    <Icon name="search" style={{fontSize:20, 
                        marginTop:13, color: BaseColor.grayColor, zIndex:100}}/>
                </TouchableOpacity>
            </View>
      
            {renderList()}
        </SafeAreaView>
    );
};

export default Entity;
