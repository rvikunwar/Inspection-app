import {
    CardReport02,
    CardReport04,
    Header,
    SafeAreaView,
    Tag,
    Text,
    ProfileAuthor,
    ListTextButton,
    Icon,
    PieChart,
    TextInput
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
} from "react-native";
import styles from "./styles";
import { HOST_URL } from "@env"
import LoadingDots from "react-native-loading-dots";
import { InspectionAPI } from "@connect/api";
import { useSelector } from "react-redux";
import { parseHexTransparency } from "@utils";
import Area from "./Area";



const EntityView = (props) => {
    const { colors } = useTheme();
    const { navigation, route } = props
    const [itemv1, setItem] = useState();
    const scrollY = useRef(new Animated.Value(0)).current;


    /**
     * @description for viewing department directly
     */
    const entity = route?.params?.entity


    /**
     * @description get list of inspector under manager
     */
     const [ Areas, setAreas ] = useState([])
     useEffect(() => {
        if(entity){
           InspectionAPI.getAreas({entity: entity.id})
           .then((res)=>{
               setAreas(res)
           })
           .catch((err)=>{
               console.log(err)
           })     
        }
   }, [entity]);



    //GET DETAILS OF THE MEMBER (TASK ASSIGNED TO)
    const [ member, setMember ] =  useState()
    useEffect(()=>{
        let isMounted = true

        if(isMounted && entity?.person_in_charge!=null){
            InspectionAPI.getMemberProfileDetails(entity?.person_in_charge).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[itemv1?.person_in_charge])


    //GET MANAGER DETAILS
    const [ manager, setManager ] =  useState()
        useEffect(()=>{
            let isMounted = true

            if(isMounted){
                InspectionAPI.getManagerProfile().then((res)=>{
                    setManager(res)
                }).catch((err)=>{
                    console.log(err)
                })
            }
            return ()=>{
                isMounted=false
            }

    },[])

    
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
    const role = "INSPECTOR"
    useEffect(()=>{

        if(entity.id){
            InspectionAPI.getInspectorStat({role, entity:entity.id})
            .then((res)=>{
                setStatdata(res, setInspectorStat)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[entity])



    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always", bottom: "always" }}
            >
            <Header title={entity?.name.toUpperCase()}/>
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

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <View style={{ flex: 1, paddingHorizontal:20 }}>
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
                                    elevation: 1,
                                },
                                default: {
                                    shadowColor: "rgba(0,0,0, .2)",
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

                            <View
                                style={[
                                    {   flexDirection:"row",
                                    
                                        alignItems:"center",
                                        backgroundColor: colors.background,
                                        borderColor: colors.border,
                                    },
                                ]}>
                                <View style={[styles.header]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {   marginRight:5,
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}
                                    >
                                        <Icon
                                            name={"mail-bulk"}
                                            size={9}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                    </View>
                                </View>

                                <Text subhead light >
                                    {"email:"}
                                </Text>
                                <Text subhead style={{ marginLeft: 5, }}>
                                    {`${member?.email}`}
                                </Text>

                            
                            </View>

                            <TouchableOpacity style={[
                                        
                                        styles.viewIcon1,
                                        {
                                        backgroundColor: parseHexTransparency(
                                            colors.primaryLight,
                                            30
                                        ),
                                            position:"absolute",
                                            bottom:10,
                                            right: 10
                                    }]} 
                                    onPress={()=>{
                                        navigation.navigate("Messages",{ selectedUser: itemv1.user, 
                                            selectedUser_image: `${HOST_URL}${itemv1.profile_image}`, 
                                            profile: itemv1 });
                                        }}>
                                    <Icon name="facebook-messenger" size={20} solid style={{color: colors.primary }}/>    
                                </TouchableOpacity> 

                            <View
                                style={[
                                    {   flexDirection:"row",
                                        alignItems:"center",
                                        backgroundColor: colors.background,
                                        borderColor: colors.border,
                                    },
                                ]}>
                                <View style={[styles.header]}>
                                    <View
                                        style={[
                                            styles.viewIcon,
                                            {   marginRight:5,
                                                marginTop:3,
                                                backgroundColor: parseHexTransparency(
                                                    colors.primaryLight,
                                                    30
                                                ),
                                            },
                                        ]}
                                    >
                                        <Icon
                                            name={"phone"}
                                            size={9}
                                            style={{ color: colors.primary }}
                                            solid
                                        />
                                    </View>
                                </View>

                                <Text subhead light >
                                    {"phone number:"}
                                </Text>
                                <Text subhead style={{ marginLeft: 5, }}>
                                    {`${member?.phone_number}`}
                                </Text>
                            </View>
                            
                         
                            </>:
                            <View style={{height:30, width:70,paddingTop:4}}>
                                <LoadingDots bounceHeight={2} size={16}/>
                            </View>
                        }

                    </View>
                    </View>
                </View>


               
                <View>
                    <Text headline semibold
                        style={{
                            paddingHorizontal:20,
                            marginTop:30,
                            marginBottom:10
                        }}>Allocated Areas</Text>

                    <TouchableOpacity
                        style={{
                            zIndex:10000,
                            paddingHorizontal:20,
                            marginBottom:15,
                        }}
                        onPress={()=>{
                            navigation.navigate('AreasListView', {Areas, entity})
                        }}>
                        <TextInput
                            disabled={true}
                            style={{elevation:3}}
                            placeholder={"area name"}
                            keyboardType={null}
                            editable={false}
                            icon={
                                <TouchableOpacity>
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
                        data={Areas}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <Area item={item} navigation={navigation} entity={entity}/>
                        )}
                    />
                </View>
            </ScrollView> 

        </SafeAreaView>
    );
};

export default EntityView;
