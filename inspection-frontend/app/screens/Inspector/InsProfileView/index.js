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
    Button,
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
    TouchableOpacity
} from "react-native";
import styles from "./styles";
import { HOST_URL } from "@env"
import LoadingDots from "react-native-loading-dots";
import { InspectionAPI } from "@connect/api";
import { parseHexTransparency } from "@utils";
import { logger } from "react-native-logs";
import { Loader } from '@container'
import { haveChildren } from "@utils";



const InsProfileView = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [item, setItem] = useState();
    const scrollY = useRef(new Animated.Value(0)).current;
    const inspector = route.params?.profile 
    const department = route.params?.department
    const area = route.params?.area
    const [ loader, setLoader ] = useState(true)
    var log = logger.createLogger();

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
           InspectionAPI.getAreas({ inspector:inspector?.user})
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
   }, [inspector]);


   const [ Tasks, setFromTasks ] = useState([])
   const [ Tasksv1, setFromTasksv1 ] = useState([])
   const role = "INSPECTOR"
   useEffect(()=>{

       let isMounted = true

       if(isMounted){
           InspectionAPI.getInspectorTasks(role, inspector?.user).then((res)=>{
                setFromTasks(res)
                setFromTasksv1(res)
                setLoader(false)
                log.info("fetching tasks of selected inspector assigned by current user - successfull" );
           }).catch((err)=>{
                setLoader(true)
                console.log(false)
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
            default:
                return  BaseColor.greenColor;
          }
   }


   const [inspectorStatv1, setInspectorStatv1] = useState({
       total: null,
       completed:null
   })


   useEffect(()=>{

       if(inspector.user){
            InspectionAPI.getInspectorStat({role, inspector:inspector.user})
            .then((res)=>{
                setInspectorStatv1({
                    ...inspectorStat,
                    ...res
                })
            })
            .catch((err)=>{
                console.log(err)
            })

       }
 
   },[inspector.user])


   const data = [
    {
        name: "New",
        count: 0,
        color: "#0E9CF5",
        legendFontColor: "#7F7F7F",
    },
    {
        name: "Issue",
        count: 0,
        color: BaseColor.greenColor,
        legendFontColor: "#7F7F7F",
    },


    {
        name: "Processing",
        count: 0,
        color: BaseColor.pinkColor,
        legendFontColor: "#0E9CF5",
    },
    {
        name: "Re-assigned",
        count: 0,
        color: "#60505A",
        legendFontColor: "#7F7F7F",
    },
    
    {
        name: "Completed",
        count: 0,
        color: BaseColor.accent,
        legendFontColor: "#F4972F",
    },
];

    const setStatdata = (res, setFunc) => {
        const data = [
            {
                name: "New",
                count: res.new,
                color: "#0E9CF5",
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Issue",
                count: res.has_issue,
                color: BaseColor.greenColor,
                legendFontColor: "#7F7F7F",
            },


            {
                name: "Processing",
                count: res.processing,
                color: BaseColor.pinkColor,
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Re-assigned",
                count: res.re_assigned,
                color: "#60505A",
                legendFontColor: "#7F7F7F",
            },
            
            {
                name: "Completed",
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
    useEffect(()=>{

        InspectionAPI.getInspectorStat({role,inspector:inspector.user})
        .then((res)=>{
            setStatdata(res, setInspectorStat)
        })
        .catch((err)=>{
            console.log(err)
        })
        
    },[])

    
    //FILTERING   entities
    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setFromTasks(
                Tasksv1.filter(
                    (item) =>
                        haveChildren(item.title, text)
                )
            );
        } else {
            setFromTasks(Tasksv1);
        }
    };



    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView, { paddingHorizontal:20}]}
            forceInset={{ top: "always", bottom: "always", }}>
            <Header title="INSPECTOR"/>

            <PieChart data={inspectorStat} />
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
                        {inspector?
                        <>
                            <ProfileAuthor
                                style={{ flex: 1 }}
                                image={{uri:`${HOST_URL}${inspector?.profile_image}`}}
                                name={`${inspector?.first_name} ${inspector?.last_name}`}
                                description={`(${item?.name})`}/>
                            
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
                                        <Text footnote>{inspector?.email}</Text>
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
                                        <Text footnote>{inspector?.phone_number}</Text>
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
                        borderWidth: StyleSheet.hairlineWidth,
                        marginTop:10,
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
                      
                        }}>
                        <Text headline>Allocated areas</Text>
                        {Areas.map((item, index)=>(
                            <View 
                                key={index}
                                style={{
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
                                <Text footnote light style={{color:"gray"}}>{item.name}</Text>
                            </View>
                        ))}
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
                          
                            }}>
                        <View>
                            <Text >Total task assigned : {inspectorStatv1.total}</Text>                            
                            <Text>Total task completed : {inspectorStatv1.completed}</Text>  

                            <TouchableOpacity style={[
                                
                                    styles.viewIcon1,
                                    {
                                    backgroundColor: parseHexTransparency(
                                        colors.primaryLight,
                                        30
                                    ),
                                        position:"absolute",
                                        bottom:-46,
                                        right: 80
                                }]} 
                                onPress={()=>{
                                    navigation.navigate("Messages",{ selectedUser: inspector });
                                }}
                            >
                                <Icon name="facebook-messenger" size={20} solid style={{color: colors.primary }}/>    
                            </TouchableOpacity> 


                            <TouchableOpacity style={[{
                            
                                position:"absolute",
                                bottom:-45,
                                right: 0,
                                zIndex:1000
                                }]} >
                                <Button style={{
                                    width:70,
                                    height:30,
                                    paddingHorizontal:0
                                }}
                                    onPress={()=>{
                                        navigation.navigate("CreateTask",{ 
                                            profile: inspector, 
                                            area: area, 
                                            department: department });
                                    }}>
                                    <Text
                                        style={{
                                            fontSize:11,
                                            color:"white"
                                        }}>Assign task</Text></Button>    
                            </TouchableOpacity>                        
                        </View>
                    </View>
                </View>

                <View style={{ marginTop:30, marginVertical:10 }}>
                    <View style={{
                        flexDirection:"row", 
                        justifyContent:"flex-start",
                        marginBottom:10}}>
                     
                        <Tag
                            light
                            textStyle={{
                                color: BaseColor.whiteColor,
                            }}
                            style={{
                                backgroundColor: '#8A28E5',
                                paddingHorizontal: 10,
                                minWidth: 80,
                                height:22
                            }}>
                            {"Task assigned"}
                        </Tag>
                    </View>

                    
                    <TouchableOpacity>
                        <TextInput
                            onChangeText={filterCategory}
                            style={{elevation:2, marginBottom:20}}
                            placeholder={"title"}
                            value={keyword}
                            keyboardType={null}
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

                    {!loader?

                    Tasks.map((item, index)=>(
                        <TouchableOpacity
                                key={index}
                                style={[styles.contain, {
                                    padding: 10,
                                    width: "100%",
                                    borderRadius: 8,
                                    marginBottom: 20,
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
                                  
                                }]}
                                onPress={()=>{
                                        navigation.navigate("TaskView", { item: item });
                                               
                                }}
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
                                    <Text footnote grayColor style={{ marginTop: 5, fontSize:14 }}>
                                    {item.description.substring(0,200)} . . .
                                    </Text>
                                </View>
                        </TouchableOpacity>
                    )):<Loader/>}
                    {(Tasks.length===0 )&&
                    <View style={{
                        flex:1, 
                        justifyContent:"center", 
                        alignItems:"center", marginTop:130,
                        }}>
                        <Text style={{color:"gray"}}>No data available</Text>
                    </View> }

                </View>
            </ScrollView>
         
        </SafeAreaView>
    );
};

export default InsProfileView;
