import {
    CardReport02,
    CardReport04,
    Header,
    SafeAreaView,
    Tag,
    Text,
    ProfileAuthor,
    ListTextButton,
    TextInput,
    Icon,
    PieChart,
} from "@components";
import { BaseColor, BaseStyle, useTheme, Images } from "@config";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
    ScrollView, 
    View, 
    Animated, 
    I18nManager, 
    StyleSheet,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Touchable
} from "react-native";
import styles from "./styles";
import { HOST_URL } from "@env"
import LoadingDots from "react-native-loading-dots";
import { InspectionAPI } from "@connect/api";
import { useSelector } from "react-redux";
import { haveChildren } from "@utils";
import { parseHexTransparency } from "@utils";


const EntityView = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [itemv1, setItem] = useState();
    const scrollY = useRef(new Animated.Value(0)).current;


    //For header background color from transparent to header color
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [BaseColor.whiteColor, colors.text],
        extrapolate: "clamp",
        useNativeDriver: true,
    });


    /**
     * @description for viewing department directly
     */
    const department_id = useSelector(state => state.auth.user.entity)
     useEffect(() => {
         if(department_id){
            InspectionAPI.getEntity(department_id)
            .then((res)=>{
                setItem(res)
            })
            .catch((err)=>{
                console.log(err)
            })
             
         }
    }, [department_id]);

    /**
     * @description get list of inspector under manager
     */
     const manager = useSelector(state => state.auth.user.user_id)
     const [ inspectors, setInspectors ] = useState([])
     const [ inspectorsv1, setInspectorsv1 ] = useState([])
     useEffect(() => {
        if(manager){
           InspectionAPI.listOfProfiles({entity: department_id})
           .then((res)=>{
               setInspectors(res)
               setInspectorsv1(res)
           })
           .catch((err)=>{
               console.log(err)
           })     
        }
   }, [manager]);



    //GET DETAILS OF THE MEMBER (TASK ASSIGNED TO)
    const [ member, setMember ] =  useState()
    useEffect(()=>{
        let isMounted = true

        if(isMounted && itemv1?.person_in_charge!=null){
            InspectionAPI.getMemberProfileDetails(itemv1?.person_in_charge).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[itemv1?.person_in_charge])


    //GET MANAGER STATS
    const [ managerStat, setMnangerStat ] = useState({
        completed_task:null,
        inspector_count:null,
        task_count:null
    })
    useEffect(()=>{

        InspectionAPI.getManagerStat(manager)
        .then((res)=>{
            setMnangerStat({
                ...managerStat,
                ...res
            })
        }).
        catch((err)=>{
            console.log(err)
        })

    },[])


    //FILTERING   
    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setInspectors(
                inspectorsv1.filter(
                    (item) =>
                        haveChildren(item.first_name, text) ||
                        haveChildren(item.last_name, text) ||
                        haveChildren(item.email, text)
                )
            );
        } else {
            setInspectors(inspectorsv1);
        }
    };


    const data = [
        {
            name: "New tasks",
            count: 0,
            color: "#0E9CF5",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Tasks with issue",
            count: 0,
            color: BaseColor.greenColor,
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Tasks re-assigned",
            count: 0,
            color: "#60505A",
            legendFontColor: "#7F7F7F",
        },
    
        {
            name: "Tasks on progress",
            count: 0,
            color: BaseColor.pinkColor,
            legendFontColor: "#0E9CF5",
        },
        
        {
            name: "Completed tasks",
            count: 0,
            color: BaseColor.accent,
            legendFontColor: "#F4972F",
        },
    ];

    const setStatdata = (res, setFunc) => {
        const data = [
            {
                name: "New tasks",
                count: res.new,
                color: "#0E9CF5",
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Tasks with issue",
                count: res.has_issue,
                color: BaseColor.greenColor,
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Tasks re-assigned",
                count: res.re_assigned,
                color: "#60505A",
                legendFontColor: "#7F7F7F",
            },
    
            {
                name: "Tasks on progress",
                count: res.processing,
                color: BaseColor.pinkColor,
                legendFontColor: "#7F7F7F",
            },
            
            {
                name: "Completed tasks",
                count: res.completed,
                color: "#F4972F",
                legendFontColor: "#7F7F7F",
            },
        ];

        if(typeof setFunc === "function"){
            setFunc(data)
        }
    }

        
    const [inspectorStat, setInspectorStat] = useState(data)
    const role = "MANAGER"
    useEffect(()=>{

        if(department_id){
                InspectionAPI.getInspectorStat({role,entity:department_id})
                .then((res)=>{
                    setStatdata(res, setInspectorStat)
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    },[department_id])


    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always", bottom: "always" }}
            >
            <Header title={itemv1?.name}/>
      
            <PieChart data={inspectorStat}/>

            <ScrollView
                contentContainerStyle={styles.container}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
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
                )}>
         


                <View style={{ flex: 1, paddingRight: 7 }}>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",                         
                            padding: 10,
                            width: "100%",
                            borderRadius: 8,
                            marginBottom: 0,
                            borderWidth: StyleSheet.hairlineWidth,
                            ...Platform.select({
                                android: {
                                    elevation: 3,
                                },
                                default: {
                                    shadowColor: "rgba(0,0,0,1)",
                                    shadowOffset: { height: 0, width: 0 },
                                    shadowOpacity: 3,
                                    shadowRadius: 3,
                                },
                            }),

                            backgroundColor: colors.background,
                            borderColor: colors.border,
                           
                        }}
                    >
                        {member?
                        <>
                            <ProfileAuthor
                                style={{ flex: 1 }}
                                image={{uri:`${HOST_URL}${member?.profile_image}`}}
                                name={`${member?.first_name} ${member?.last_name}`}
                                description={"(Head of department)"}
                            />
                            
                            <View style={{flexDirection: "row",}}>
                                <View style={[styles.header]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}>
                                            
                                        <Icon
                                            name={"mail-bulk"}
                                            size={12}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                        
                                    </View>

                                    <View>
                                        <Text>Email: </Text>
                                        <Text footnote>{member?.email}</Text>
                                    </View>
                                </View>

                                <View style={[styles.header, {marginLeft: 50}]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}>
                                            
                                        <Icon
                                            name={"phone"}
                                            size={12}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                        
                                    </View>

                                    <View>
                                        <Text>Phone number: </Text>
                                        <Text footnote>{member?.phone_number}</Text>
                                    </View>
                                </View>
                            </View>
                            </>:
                            <View style={{height:30, width:70,paddingTop:4}}>
                                <LoadingDots bounceHeight={2} size={16}/>
                            </View>
                        }

                        </View>
                    </View>

                <View style={{ flexDirection: "row", marginTop: 5, marginBottom:20 }}>
                    <View style={{ flex: 1, paddingRight: 7 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                            marginTop:5,
                            width: "100%",
                            borderWidth:1,
                            borderRadius: 8,
                            marginBottom: 0,
                            borderWidth: StyleSheet.hairlineWidth,
                            ...Platform.select({
                                android: {
                                    elevation: 3,
                                },
                                default: {
                                    shadowColor: "rgba(0,0,0, 0.2)",
                                    shadowOffset: { height: 0, width: 0 },
                                    shadowOpacity: 3,
                                    shadowRadius: 3,
                                },
                            }),
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                        }}
                    >

                    <View style={{width:"25%"}}>
                        <Text headline>{itemv1?.name}</Text>
                    </View>
                    
                    <View style={{
                        flexDirection: "row", 
                        alignItems:"center", width:"70%"}}>
                                <View style={[styles.header,{width:"60%",paddingRight:28}]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}>
                                            
                                        <Icon
                                            name={"mail-bulk"}
                                            size={12}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                        
                                    </View>

                                    <View>
                                        <Text>Email: </Text>
                                        <Text footnote>{member?.email}</Text>
                                    </View>
                                </View>

                                <View style={[styles.header, {marginLeft: 0 ,width:"40%"}]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}>
                                            
                                        <Icon
                                            name={"phone"}
                                            size={12}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                        
                                    </View>

                                    <View>
                                        <Text>Phone number: </Text>
                                        <Text footnote>{member?.phone_number}</Text>
                                    </View>
                                </View>
                                </View>

                    </View>


                        {/* <CardReport04
                            style={{ marginBottom: 7, marginTop:10 }}
                            icon="chart-bar"
                            title="Tasks & inspectors stats"
                            subTitle1={`Total inspectors: ${managerStat.inspector_count}`}
                            subTitle2={`Total tasks: ${managerStat.task_count}`}
                            subTitle3={`Total tasks completed: ${managerStat.task_count}`}

                            percent1="68%"
                            percent2="50%"
                            percent3="90%"

                        /> */}
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        style={{
                            zIndex:10000
                        }}
                        onPress={()=>{
                            navigation.navigate('InspectorListView', {inspectors, itemv1})
                        }}>
                        <TextInput
                            disabled={true}
                            onFocus={()=>{
                                navigation.navigate('InspectorListView', {inspectors, itemv1})
                            }}
                            onChangeText={filterCategory}
                            style={{elevation:3}}
                            placeholder={"name, username or email"}
                            value={keyword}
                            keyboardType={null}
                            editable={false}
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
                    </TouchableOpacity>
                    <FlatList
                        data={inspectors}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <ListTextButton
                            image={{uri:`${HOST_URL}${item.profile_image}`}}
                            name={item.first_name +" "+ item.last_name}
                            description={item?.email}
                            online={item.online}
                            style={{marginTop: 7}}
                            onPress={() => {
                                navigation.navigate("InspectorProfile",{ inspector: item, department: itemv1 });
                            }}
                            componentRight={
                                <Tag
                                    
                                    outline
                                    style={{
                                        paddingHorizontal: 20,
                                        backgroundColor: colors.background,
                                    }}
                                >
                                    {`${t("check")}`}
                                </Tag>
                            }
                        />
                        )}
                    />
                </View>
            </ScrollView>


        </SafeAreaView>
    );
};

export default EntityView;
