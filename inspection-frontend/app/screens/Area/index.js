import {
    CategoryBlock,
    CategoryBoxColor,
    CategoryBoxColor2,
    CategoryGrid,
    CategoryIcon,
    CategoryList,
    Header,
    Icon,
    SafeAreaView,
    Text,
    TextInput,
} from "@components";
import { BaseColor, BaseStyle, Typography, useTheme } from "@config";
import { CategoryData } from "@data";
import * as Utils from "@utils";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useTranslation } from "react-i18next";
import { InspectionAPI } from "../../connect/api";
let timeoutChangeMode = null;
import { useNavigation, useRoute } from "@react-navigation/native";


const Area = (props) => {
    const navigation = useNavigation()
    const { data } = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [search, setSearch] = useState("");
    const [modeView, setModeView] = useState("bars");
    const [loading, setLoading] = useState(true);

    
    /**
     * @description gets the list of areas allocated to
     * departemnt through api
     */
    const [ Areas, setAreas ] = useState([])
    const [ SAreas, setSearchAreas ] = useState([]) //SEARCH
    useEffect(()=>{

       
        if (data){
            const entity = data.item.id
            InspectionAPI.getAreas(entity)
            .then((res)=>{
                setAreas(res)
                setSearchAreas(res)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[data])

    
    
    /**
     * @description CALLBACK FOR REFRESHING DATA
     */
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoading(true)
        setSearch("")

            try{
                const entity = data.item.id
                InspectionAPI.getAreas(entity)
                .then((res)=>{
                    setAreas(res)
                    setRefreshing(false);
                    setSearchAreas(res)
                    setLoading(false)
                })
                .catch((err)=>{
                    console.log(err)
                    setRefreshing(false);
                    setLoading(false)
                })
            }
            catch(err){
                setLoading(false)

                setRefreshing(false)
            }
        
        }, [refreshing]);


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const onChangeView = () => {
        setLoading(true);
        clearTimeout(timeoutChangeMode);
        timeoutChangeMode = setTimeout(() => {
            setLoading(false);
        }, 1000);
        Utils.enableExperimental();
        let mode = "columns";
        switch (modeView) {
            case "columns":
                mode = "th-large";
                break;
            case "th-large":
                mode = "list";
                break;
            case "list":
                mode = "grip-vertical";
                break;
            case "grip-vertical":
                mode = "th-list";
                break;
            case "th-list":
                mode = "bars";
                break;
            case "bars":
                mode = "columns";
                break;
            default:
                mode = "columns";
                break;
        }
        setModeView(mode);
    };

    const gotoAreas = (item) => {
        navigation.navigate("AreaView",{ area:item, department: data.item });
    };

    const renderItem = ({ item, index }) => {
 
        switch (modeView) {
            case "columns":
                return (
                    <CategoryBoxColor
                        loading={loading}
                        style={{
                            paddingLeft: index % 2 == 0 ? 0 : 15,
                            paddingBottom: 15,
                        }}
                        title={item.name}
                        icon={item.icon}
                        color={item.color}
                        onPress={()=>{
                            gotoAreas(item)
                        }}
                    />
                );
            case "th-large":
                return (
                    <CategoryBoxColor2
                        loading={loading}
                        style={{
                            paddingLeft: index % 2 == 0 ? 0 : 15,
                            paddingBottom: 15,
                        }}
                        title={item.name}
                        latitude={parseFloat(item.latitude)}
                        longitude={parseFloat(item.longitude)}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        onPress={()=>{
                            gotoAreas(item)
                        }}
                    />
                );
            case "list":
                return (
                    <CategoryIcon
                        loading={loading}
                        style={{
                            marginBottom: 10,
                        }}
                        title={item.name}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        color={item.color}
                        onPress={()=>{
                            gotoAreas(item)
                        }}
                    />
                );
            case "th-list":
                return (
                    <CategoryList
                        loading={loading}
                        style={{
                            paddingBottom: 15,
                        }}
                        title={item.name}
                        latitude={parseFloat(item.latitude)}
                        longitude={parseFloat(item.longitude)}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        color={item.color}
                        image={item.image}
                        onPress={()=>{
                            gotoAreas(item)
                        }}
                    />
                );
            case "bars":
                return (
                    <CategoryBlock
                        loading={loading}
                        style={{
                            paddingBottom: loading ? 0 : 15,
                        }}
                        title={item.name}
                        latitude={parseFloat(item.latitude)}
                        longitude={parseFloat(item.longitude)}
                        subtitle={item.subtitle}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        image={item.image}
                        onPress={()=>{
                            gotoAreas(item)
                        }}
                    />
                );

            default:
                return (
                    <CategoryBoxColor
                    style={{
                        paddingLeft: index % 2 == 0 ? 0 : 15,
                        paddingBottom: 15,
                    }}
                    title={item.name}
                />
                );
        }
    };

    const getTotalCol = () => {
        switch (modeView) {
            case "columns":
                return 2;
            case "th-large":
                return 2;
            case "list":
                return 1;
            case "grip-vertical":
                return 2;
            case "th-list":
                return 1;
            case "bars":
                return 1;
            default:
                return 1;
        }
    };

    const onChangeText = (text) => {
        setSearch(text);
        setAreas(
            text
                ? SAreas.filter((item) => {
                    if(item.name.toLowerCase().includes(text)){
                        return item
                    }})
                : SAreas
        );
    };

    const renderContent = () => {
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView]}
                edges={['right', 'top', 'left']}
            >
                <View style={BaseStyle.container}>
                    <Header
                        style={{ marginBottom: 20 }}
                        renderLeft={() => (
                            <Text header bold>
                                {t("Areas")}
                            </Text>
                        )}
                        title={""}
                        styleLeft={{
                            flex: 1,
                        }}
                        styleContentLeft={{
                            flex: 1,
                            justifyContent: "center",
                            paddingHorizontal: 0,
                            width: "100%",
                        }}
                        styleContentCenter={{
                            flex: 0,
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                        }}
                        styleRight={{ flex: 0 }}
                        renderRight={() => {
                            return (
                                <Icon
                                    name={modeView}
                                    size={20}
                                    color={BaseColor.grayColor}
                                />
                            );
                        }}
                        onPressRight={() => onChangeView()}
                    />
                    <TextInput
                        style={[BaseStyle.textInput, Typography.body1]}
                        onChangeText={onChangeText}
                        autoCorrect={false}
                        placeholder={t("search")}
                        placeholderTextColor={BaseColor.grayColor}
                        value={search}
                        selectionColor={colors.primary}
                        onSubmitEditing={() => {}}
                    />
                </View>

                <FlatList
                    key={getTotalCol()}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                    }}
                    numColumns={getTotalCol()}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={Areas}
                    keyExtractor={(item, index) => item.id}
                    renderItem={renderItem}
                />
            </SafeAreaView>
        );
    };


    return renderContent();
};

export default Area;
