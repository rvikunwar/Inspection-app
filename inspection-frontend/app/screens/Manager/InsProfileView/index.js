import {
    Header,
    SafeAreaView,
    Tag,
    Text,
    ProfileAuthor,
    Icon,
    Button,
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
    StyleSheet,
    FlatList,
    TouchableOpacity
} from "react-native";
import styles from "./styles";
import { HOST_URL } from "@env"
import LoadingDots from "react-native-loading-dots";
import { InspectionAPI } from "@connect/api";
import { parseHexTransparency } from "@utils";


const InsProfileView = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [item, setItem] = useState();
    const scrollY = useRef(new Animated.Value(0)).current;
    const inspector = route.params?.inspector 
    const department = route.params?.department


    useEffect(() => {
        if (department) {
            setItem(department);
        }
    }, [department]);


    /**
     * @description get list of inspector under manager
     */
     const [ Areas, setAreas ] = useState([])
     useEffect(() => {

        let isMounted = true

        if(isMounted){
           InspectionAPI.getAreas({inspector:inspector?.user, entity:department.id})
           .then((res)=>{
               setAreas(res)
           })
           .catch((err)=>{
               console.log(err)
           })     
        }

        return () => {
            isMounted = false
        }
   }, []);


   const [fromTasks, setFromTasks] = useState({to:[], from :[]})
   const role = "MANAGER"
   useEffect(()=>{

       let isMounted = true

       if(isMounted){
           InspectionAPI.getInspectorTasks(role, inspector?.user).then((res)=>{
                setFromTasks(res)
           }).catch((err)=>{
               console.log(err)
           })
       }

       return () => {
           isMounted = false
       }

   },[])


   const statusColor = (status) => {
        switch (status) {
            case "NEW":
                return "#0E9CF5"
            case "PROCESSING":
                return BaseColor.pinkColor
            case "COMPLETED":
                return "#F4972F"
            case "RE-ASSIGNED":
                return "#60505A"
            default:
                return  BaseColor.greenColor;
          }
   }

   const [ selectT, setSelectT ] =  useState(0)

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

    const [task_assigned_to_others, setTask_assigned_to_others] = useState(data)  
    const [task_assigned_by_others, setTask_assigned_by_others] = useState(data)  

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

 
    
   const [inspectorStat, setInspectorStat] = useState()
   useEffect(()=>{

       if(inspector.user){
            InspectionAPI.getInspectorStat({role,inspector:inspector.user})
            .then((res)=>{
                setStatdata(res.task_assigned_by_others, setTask_assigned_by_others)
                setStatdata(res.task_assigned_to_others, setTask_assigned_to_others)
                setInspectorStat({"to_current_user": res.task_assigned_by_others.total, 
                    "by_current_user":res.task_assigned_to_others.total})

            })
            .catch((err)=>{
                console.log(err)
            })

       }
 
   },[inspector.user])



    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView, { paddingHorizontal:20}]}
            forceInset={{ top: "always", bottom: "always", }}
            >
            <Header title="INSPECTOR"/>

            <PieChart data={selectT===0?task_assigned_to_others:task_assigned_by_others} />

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

                <View style={{ flexDirection: "column", marginTop: 5 }}>
                    <View style={{ flex: 1, paddingRight: 7 }}>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: 10,
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
                                    shadowColor: "rgba(0,0,0, 0.9)",
                                    shadowOffset: { height: 0, width: 0 },
                                    shadowOpacity: 3,
                                    shadowRadius: 3,
                                },
                            }),
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          
                        }}
                    >
                        {inspector?
                        <>
                            <ProfileAuthor
                                style={{ flex: 1 }}
                                image={{uri:`${HOST_URL}${inspector?.profile_image}`}}
                                name={`${inspector?.first_name} ${inspector?.last_name}`}
                                description={`(${item?.name})`}
                            />
                            
                            <View style={{flexDirection: "row"}}>
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
                                        <Text>{inspector?.email}</Text>
                                    </View>
                                </View>

                                <View style={[styles.header, {marginLeft: 20}]}>
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
                                        <Text>{inspector?.phone_number}</Text>
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
                   
                </View>

                <View style={{flexDirection:"row"}}>

                    <View style={{ 
                        borderWidth:1,
                        borderRadius: 8,
                        width:"49%",
                        marginRight:"2%",
                        marginBottom: 0,
                        padding:10,
                        marginTop:10,
                        borderWidth: StyleSheet.hairlineWidth,
                        ...Platform.select({
                            android: {
                                elevation: 3,
                            },
                            default: {
                                shadowColor: "rgba(0,0,0, 0.9)",
                                shadowOffset: { height: 0, width: 0 },
                                shadowOpacity: 3,
                                shadowRadius: 3,
                            },
                        }),
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        }}>
                        <Text headline>Allocated areas</Text>
                        <FlatList
                            data={Areas}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <View style={{
                                    flexDirection:"row", 
                                    alignItems:"center",
                                    marginTop: 10,
                                    
                                    }}>
                                    <View style={{ 
                                        width: 8, 
                                        height: 8, 
                                        backgroundColor:"#4F86BD",
                                        borderRadius:10,
                                        marginRight:10}}/>
                                    <Text footnote light style={{ color:"gray"}}>{item.name}</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View style={{ 
                            borderWidth:1,
                            borderRadius: 8,
                            marginBottom: 0,
                            padding:10,
                            width:"49%",
                            height:100,
                            position:"relative",
                            borderWidth: StyleSheet.hairlineWidth,
                            marginTop:10,
                            ...Platform.select({
                                android: {
                                    elevation: 3,
                                },
                                default: {
                                    shadowColor: "rgba(0,0,0, 0.9)",
                                    shadowOffset: { height: 0, width: 0 },
                                    shadowOpacity: 3,
                                    shadowRadius: 3,
                                },
                            }),
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            }}>
                        <View>
                            <Text >Total task assigned by {inspector.first_name}: {inspectorStat?.by_current_user}</Text>                            
                            <Text>Total task assigned by others : {inspectorStat?.to_current_user}</Text>                       
                        </View>

                        <TouchableOpacity style={[
                                
                                styles.viewIcon1,
                                {
                                backgroundColor: parseHexTransparency(
                                    colors.primaryLight,
                                    50
                                ),
                                    position:"absolute",
                                    bottom:5,
                                    right: 5
                            }]} 
                            onPress={()=>{
                             navigation.navigate("Messages",{ selectedUser: inspector.user, 
                                selectedUser_image: `${HOST_URL}${inspector.profile_image}`, 
                                profile: inspector });
                            }}>
                            <Icon name="facebook-messenger" size={23} solid style={{color: colors.primary }}/>    
                        </TouchableOpacity> 
                    </View>
                </View>

                <View style={{ marginTop:30, marginVertical:10 }}>
                    <View style={{
                        flexDirection:"row", 
                        justifyContent:"space-around",}}>
                        <Button style={{
                            width:160, 
                            marginRight:20,
                            height:30, 
                            marginLeft:5,
                            borderWidth:1,
                            borderColor:"rgba(0,0,0,0.2)",
                            backgroundColor:selectT===0?"#79EC18":"transparent",
                            paddingHorizontal:5}}
                            onPress={()=>{setSelectT(0)}}>
                                <Text style={{fontSize:13, 
                                    color: "black" }}>
                                        TASKS ASSIGNED BY {inspector.first_name.toUpperCase()}</Text>
                        </Button>
                        <Button style={{
                            width:160, 
                            marginRight:20,
                            height:30, 
                            borderWidth:1,
                            borderColor:"rgba(0,0,0,0.2)",
                            backgroundColor:selectT===1?"#79EC18":"transparent",
                            paddingHorizontal:5}}
                            onPress={()=>{setSelectT(1)}}>
                                <Text style={{fontSize:13, 
                                    color:"black"}}>
                                    TASK ASSIGNED TO {inspector.first_name.toUpperCase()}</Text>
                        </Button>
                    </View>
                    <FlatList
                        data={selectT === 0? fromTasks?.to: fromTasks?.from}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[styles.contain, {
                                    borderWidth:1,
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    padding:10,
                                    marginTop:10,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    ...Platform.select({
                                        android: {
                                            elevation: 1,
                                        },
                                        default: {
                                            shadowColor: "rgba(0,0,0, 0.9)",
                                            shadowOffset: { height: 0, width: 0 },
                                            shadowOpacity: 3,
                                            shadowRadius: 3,
                                        },
                                    }),
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                }]}
                                onPress={()=>{
                                        navigation.navigate("TaskView", { item: item });
                                               
                                }}
                                activeOpacity={0.9}
                                >
                                <View style={{ paddingHorizontal: 10 }}>
                                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                        <Text headline semibold style={{width:"70%"}}>
                                        {item.title}
                                        </Text>
                                        <Tag
                                            light
                                            textStyle={{
                                                color: BaseColor.whiteColor,
                                            }}
                                            style={{
                                                backgroundColor: statusColor(item.status),
                                                paddingHorizontal: 10,
                                                minWidth: 80,
                                                height:22
                                            }}>
                                            {item.status}
                                        </Tag>
                                    </View>
                                    <Text footnote semibold grayColor style={{ marginTop: 5 }}>
                                    {item.description.substring(0,100)} . . .
                                    </Text>
                                </View>
                                </TouchableOpacity>
                        )}
                    />
                    {(selectT === 0 && fromTasks?.to.length===0 )&&
                    <View style={{
                        flex:1, 
                        justifyContent:"center", 
                        alignItems:"center", marginTop:130,
                        }}>
                        <Text style={{color:"gray"}}>No data available</Text>
                    </View> }
                    {(selectT === 1 && fromTasks?.from.length===0 )&&
                    <View style={{
                        flex:1, 
                        justifyContent:"center", 
                        alignItems:"center", marginTop:130,
                        }}>
                        <Text style={{color:"gray"}}>No data available</Text>
                    </View>}

                </View>
            </ScrollView>
         
        </SafeAreaView>
    );
};

export default InsProfileView;
