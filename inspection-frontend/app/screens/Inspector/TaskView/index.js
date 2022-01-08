import {
    CardCommentSimple,
    Header,
    Icon,
    ModalFilter,
    ProductSpecGrid,
    ProfileAuthor,
    SafeAreaView,
    Tag,
    Text,
    ModalOption,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback, useMemo  } from "react";
import { useTranslation } from "react-i18next";
import {
    ScrollView,
    TouchableOpacity,
    View,
    StyleSheet
} from "react-native";
import styles from "./styles";
import { dateformat } from "@common";
import { InspectionAPI} from "@connect/api";
import { HOST_URL } from '@env'
import LoadingDots from "react-native-loading-dots";
import Attachment from './Attachment'


const TaskView = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [sortOption, setSortOption] = useState();
    const [ showAction, setShowAction ] = useState(false)
    const [ editTododata, setEditTodoData ] = useState()

    let dotAction = [
        {
            value: "Edit todo",
            text: "Edit todo",
            func: () => {
                navigation.navigate('TodoCreate', { item: editTododata})
            }
        },
        {
            value: "Delete todo",
            text:"Delete todo",
            func: () => {
               deleteTodo(editTododata.id)
            }
        },
    ]


    const [ openStatus, setOpenStatus] = useState(false)

    const TaskStatus = [
        {
            value: "NEW",
            iconName: "flag-checkered",
            text: "New task",
        },
        {
            value: "RE-ASSIGNED",
            iconName: "arrow-circle-up",
            text: "Re-assign task",
        },
        {
            value: "ISSUE",
            iconName: "arrow-circle-down",
            text: "Have issue with task",
        },
        {
            value: "PROCESSING",
            iconName: "circle-notch",
            text: "Processing",
        },
        {
            value: "COMPLETED",
            iconName: "check-circle",
            text: "Completed",
        }
    ];


    const [showTaskAction, setShowTaskAction] = useState(false)


    const defaultValues = {
        id:null,
        title: "",
        description: "",
        timestamp: null,
        end_date: null,
        assigned_to: null,
        assigned_by:null,
        entity: null,
        id: null,
        priority: null,
        status: null,
    }

    const [item, setItem] = useState(defaultValues);
    const [ refreshv1, setRefreshv1 ] = useState(false)


    useEffect(() => {
        if (route?.params?.members) {
            setMembers(route?.params?.members);
        }
    }, [route?.params?.members]);

    useEffect(() => {
        if (route?.params?.item) {
            setItem(route?.params?.item);
        }
    }, [route?.params?.item]);

    useEffect(() => {
        
        if (route?.params?.update) {
            setRefreshv1(!refreshv1);
        }
    }, [route?.params?.update]);

    const onSelectFilter = (item) => {
        setSortOption(
            sortOption.map((option) => ({
                ...option,
                checked: item.value == option.value,
            }))
        );
    };


    //GET DETAILS OF THE MEMBER (TASK ASSIGNED BY)
    const [ member, setMember ] =  useState()
    useEffect(()=>{
        let isMounted = true

        if(isMounted && item.id!=null){
            InspectionAPI.getMemberProfileDetails(item.assigned_by).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[item, route?.params?.taskdata])


    
    //GET DETAILS OF THE MEMBER (TASK ASSIGNED TO)
    const [ assigned_to, setAssignTo ] =  useState()
    useEffect(()=>{
        let isMounted = true

        if(isMounted && item.id!=null){
            InspectionAPI.getMemberProfileDetails(item.assigned_to).then((res)=>{
                setAssignTo(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[item, route?.params?.taskdata])

   
    //TODO LIST ASSOCIATED WITH TASK
    const [ todo, setTodo ] = useState([])
    useEffect(()=>{

        let isMounted = true

        if(isMounted && item.id!=null){
            InspectionAPI.getListofTodos(item.id).then((res)=>{
                setTodo(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }
    },[item.id, refreshv1])


      //FOR DELETING TODO
      const deleteTodo = (id) => {
        InspectionAPI.deleteTodoData(id).then(()=>{

            let data =  todo.filter((item)=>{
                if(item.id!=id){
                    return item
                }
            })
            setTodo(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const { statusName, statusColor } = useMemo(() => {
        switch (item.status) {
            case "NEW":
                return {
                    statusName: item.status,
                    statusColor: "#0E9CF5",
                };
            case "PROCESSING":
                return {
                    statusName: item.status,
                    statusColor: BaseColor.pinkColor,
                };

            case "COMPLETED":
                return {
                    statusName: item.status,
                    statusColor: "#F4972F"
                };
            case "RE-ASSIGNED":
                return {
                    statusName: item.status,
                    statusColor:"#60505A"
                }; 
            default:
                return {
                    statusName: item.status,
                    statusColor: BaseColor.greenColor,
                };
        }
    }, [item.status]);


    const { priorityName, priorityColor } = useMemo(() => {
        switch (item.priority) {
            case "URGENT":
                return {
                    priorityName: t(item.priority),
                    priorityColor: "#0E9CF5",
                };
            case "HIGH":
                return {
                    priorityName: t(item.priority),
                    priorityColor: BaseColor.pinkColor,
                };
            case "MEDIUM":
                return {
                    priorityName: t(item.priority),
                    priorityColor: BaseColor.pinkColor,
                };
            default:
                return {
                    priorityName: t(item.priority),
                    priorityColor: BaseColor.greenColor,
                };
        }
    }, [item.priority]);

    
    //FILES FOR EVIDENCE
    const [ fileList, setFileList ] = useState([])
    useEffect(()=>{
        if(item.id){
            InspectionAPI.getFilesforTask(item.id)
            .then((res)=>{
                setFileList(res)
            })
            .catch((err)=>{
                console.log(err)
            })
        }

    },[item.id])

    //FILES
    useEffect(()=>{
        if(route.params.fileList){
            setFileList(route.params.fileList)
        }
    },[route.params.fileList])


    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView, { flex: 1 }]}
            edges={["right", "top", "left"]}
        >
            <Header
                title={t("task_view")}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.text}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <View style={{ flex: 1 }}>
                <View
                    style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={styles.container}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
                        <View>
                            <View style={{
                                flexDirection:"row", 
                                justifyContent:"space-between", 
                                alignItems:"center"}}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    {member?
                                    <>
                                        <ProfileAuthor
                                            style={{ flex: 0.8}}
                                            image={{uri:`${HOST_URL}${member.profile_image}`}}
                                            name={`${member.first_name} ${member.last_name}`}
                                            description={'(Inspector)'}
                                        />
                                        </>:
                                        <View style={{height:30, width:70,paddingTop:4}}>
                                            <LoadingDots bounceHeight={2} size={16}/>
                                        </View>
                                }

                                </View>
                                <TouchableOpacity style={{
                                    zIndex:1000, 
                                    alignItems:"flex-end", 
                                    width:30}} onPress={() => {
                                      setOpenStatus(true)
                                }}>
                                    <Icon name="ellipsis-v" size={14} />
                                </TouchableOpacity>

                            </View>
                            <Text title3>{item.title}</Text>

                            <Text body2 light style={{ paddingVertical: 0 }}>
                                {item.description}
                            </Text>
                            <View style={{
                                flexDirection:"row", 
                                justifyContent:"space-between", 
                                flex:1,
                                marginTop:10}}>
                                <View style={{
                                        width: "58%"}}>
                                    <Text
                                        headline
                                        style={{
                                            paddingTop: 10,
                                            paddingBottom: 0
                                        }}
                                    >
                                        {"Overview"}
                                    </Text>
                                <View style={{
                                        flexDirection: "row",
                                        flexWrap:"wrap",
                                        alignItems: "center",
                                        padding: 10,
                                        marginTop:5,
                                        borderWidth:1,
                                        borderRadius: 8,
                                        marginBottom: 0,
                                        borderWidth: StyleSheet.hairlineWidth,
                                        ...Platform.select({
                                            android: {
                                                elevation: 2,
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
                                    
                                    }}>
                                    <View style={[styles.specifications,]}>
                                        <View style={{ flex: 1, flexDirection: "row", }}>
                                            <ProductSpecGrid
                                                description={t("Assigned on")}
                                                renderTitle={() => (
                                                    <Tag
                                                        primary
                                                        style={{
                                                            minWidth: 80,
                                                            marginTop: 5,
                                                            paddingVertical: 4,
                                                            backgroundColor:
                                                                "#0CA622",
                                                        }}
                                                    >
                                                        {dateformat(item.timestamp)}
                                                    </Tag>
                                                )}
                                            />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: "row" }}>
                                            <ProductSpecGrid
                                                description={t("Task closes on")}
                                                renderTitle={() => (
                                                    <Tag
                                                        primary
                                                        style={{
                                                            minWidth: 80,
                                                            marginTop: 5,
                                                            paddingVertical: 4,
                                                            backgroundColor:
                                                                colors.primaryLight,
                                                        }}
                                                    >
                                                        {dateformat(item.end_date)}
                                                    </Tag>
                                                )}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.specifications}>
                                        <View style={{ flex: 1, flexDirection: "row" }}>
                                            <ProductSpecGrid
                                                description={t("status")}
                                                renderTitle={() => (
                                                    <Tag
                                                        primary
                                                        style={{
                                                            minWidth: 80,
                                                            marginTop: 5,
                                                            paddingVertical: 4,
                                                            backgroundColor:
                                                                statusColor,
                                                        }}
                                                    >
                                                        {statusName}
                                                    </Tag>
                                                )}
                                            />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: "row" }}>
                                            <ProductSpecGrid
                                                description={t("Priority")}
                                                renderTitle={() => (
                                                    <Tag
                                                    primary
                                                    style={{
                                                        minWidth: 80,
                                                        marginTop: 5,
                                                        paddingVertical: 4,
                                                        backgroundColor:
                                                            priorityColor ,
                                                    }}
                                                >
                                                    {priorityName}
                                                </Tag>
                                                )}
                                            />
                                        </View>
                                    </View>
                                </View>
                             </View>

                             <View style={{width: "37%",}}>
                                 <Text
                                    headline
                                    style={{
                                        paddingTop: 10,
                                        paddingBottom: 0
                                    }}>Assigned to</Text>
                                <View style={{
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: 10,
                                    marginTop:5,
                                    borderWidth:1,
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    ...Platform.select({
                                        android: {
                                            elevation: 2,
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
                                
                                }}>
                                {member?
                                    <>
                                        <ProfileAuthor
                                            style={{ flex: 1, justifyContent:"center", alignItems:"center"}}
                                            image={{uri:`${HOST_URL}${ assigned_to?.profile_image}`}}
                                            name={`${ assigned_to?.first_name} ${ assigned_to?.last_name}`}
                                            description={`(${assigned_to?.email})`}
                                            styleLeft={{flexDirection:"column",justifyContent:"center", alignItems:"center" }}
                                            styleDescription={{ }}
                                        />
                                        </>:
                                        <View style={{height:30, width:70,paddingTop:4}}>
                                            <LoadingDots bounceHeight={2} size={16}/>
                                        </View>
                                }
                                </View>
                                 
                             </View>
                                
                            </View>
                        </View>
                        {item.reason_for_reassigning !="" &&
                            <View style={{marginTop:20}}>
                                <Text
                                    headline
                                    style={{ paddingHorizontal: 4, fontSize: 21 }}>
                                    {"Reason for re-assigning"}
                                </Text>
                                <Text body2 light style={{ paddingVertical: 0, paddingHorizontal:5 }}>
                                    {item?.reason_for_reassigning}
                                </Text>
                            </View>
                        }
                        {todo.length>0 &&
                        <View style={{ flex: 1, marginTop:20 }}>
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingTop: 20,
                                        alignContent:"center",
                                    }}
                                >
                                    <Text
                                        headline
                                        style={{ paddingHorizontal: 4, fontSize: 21 }}
                                    >
                                        {t("To do's list")}
                                    </Text>

                                </View>
                            </View>
                            
                            {todo.map((item, index)=>(
                                <CardCommentSimple
                                    key={index}
                                    style={{
                                        borderBottomWidth: 0.5,
                                        paddingHorizontal:4,
                                        borderColor: BaseColor.dividerColor,
                                    }}
                                    item={item}
                                    showAction={showAction}
                                    setShowAction={setShowAction}
                                    setEditTodoData={setEditTodoData}
                                    status={item.status}
                                    title={item.title}
                                    description={item.description}
                                />
                            ))}
                        </View>
                    }  

                    {
                        fileList.length>0 && 
                        <View>
                            <Text
                                headline
                                style={{ paddingHorizontal: 4, marginTop:30, fontSize: 21 }}>
                                {"Evidence files"}
                            </Text>
                            <Attachment fileList={fileList}/>
                        </View>
                    }
                     
                    </ScrollView>
                </View>
            </View>

            <ModalFilter
                options={sortOption}
                isVisible={modalVisible}
                onSwipeComplete={() => {
                    setModalVisible(false);
                }}
                onApply={() => {
                    const option = sortOption.find((item) => item.checked);
                    setOption(option);
                    setModalVisible(false);
                }}
                onSelectFilter={onSelectFilter}
            />

            {showAction?<ModalOption
                value={{}}
                options={dotAction}
                isVisible={showAction}
                onSwipeComplete={() => {
                    setShowAction(false);
                }}
                onPress={(option) => {
                    if(typeof option === "function"){
                        option()
                    }
                    setShowAction(false);
                }}
            />:null}

            {showTaskAction?<ModalOption
                value={{}}
                options={TaskdotAction}
                isVisible={showTaskAction}
                onSwipeComplete={() => {
                    setShowTaskAction(false);
                }}
                onPress={(option) => {
                    if(typeof option === "function"){
                        option()
                    }
                    setShowTaskAction(false);
                }}
            />:null}

            <ModalOption
                options={TaskStatus}
                isVisible={openStatus}
                onSwipeComplete={() => {
                    setOpenStatus(false);
                }}
                onPress={(item) => {
                    setItem({
                        ...route?.params?.item,
                        status:item.value
                    })
                    InspectionAPI.updateStatus({status:item.value,id:route?.params?.item.id})
                    setOpenStatus(false);
                }}
            />
        </SafeAreaView>
    );
};

export default TaskView;
