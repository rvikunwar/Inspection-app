import {
    Header,
    Icon,
    SafeAreaView,
    Text,
    TextInput,
    ListOptionSelected,
    ModalOption,
    ProfileAuthor
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, TouchableOpacity, Touchable } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "@connect/api";
import { backendDateFormat } from '@common'
import { useSelector } from "react-redux";
import { HOST_URL } from "@env"
import LoadingDots from "react-native-loading-dots";
import { InsOption, Calendar } from '@container'
import ChooseFile from './ChooseFile'
import * as Progress from 'react-native-progress';
import { showMessage } from "react-native-flash-message";
import { DatePicker } from '@container'

const TaskEdit = (props) => {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const [headerName, setHeaderName] = useState(t("Create task"));
    const navigation = useNavigation();
    const route = useRoute();


    const TaskPriority = [
        {
            value: "URGENT",
            iconName: "exclamation-triangle",
            text: "Urgent",
        },
        {
            value: "HIGH",
            iconName: "arrow-circle-up",
            text: "High",
        },
        {
            value: "MEDUIM",
            iconName: "minus-circle",
            text: "Meduim",
        },
        {
            value: "LOW",
            iconName: "arrow-circle-down",
            text: "Low",
        },
    ];

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



    const [ priority, setPriority ] = useState(TaskPriority[0])
    const [ status, setStatus ] = useState(TaskStatus[0])
    const [ openPriority, setOpenPriority ] = useState(false)
    const [ openStatus, setOpenStatus] = useState(false)
    const [ insVisible, setinsVisible ] = useState(false)
    const [ modalData, setModalData ] = useState("by")
    const [ loader, setLoader ] = useState(false)


    const defaultValues = {
        id: null,
        title: null,
        description: null,
        priority: priority.value,
        assigned_to:null,
        assigned_by:null,
        entity:null,
        end_date: backendDateFormat(new Date()),
        reason_for_reassigning:null
    }


    const [ formdata, setFormdata ] = useState(defaultValues)
    const [ fileList, setFileList ] = useState([])
    const [ todo, setTodo ] = useState(route?.params?.todo)


    useEffect(()=>{
        if(route?.params?.fileList){
            setFileList(route?.params?.fileList)
        }
    },[route?.params?.fileList])

    useEffect(() => {
        if (route?.params?.item) {
            const item = route?.params?.item;
            setFormdata({
                ...formdata,
                ...item
            })

        TaskStatus.filter((i)=>{
            if(item.status === i.value){
                setStatus(i)
            }
        })
        TaskPriority.filter((i)=>{
            if(item.priority === i.value){
                setPriority(i)
            }
        })

            setHeaderName(t("Edit task"));
        }
    }, [route?.params?.item]);

    const [ datev1, setDatev1 ] = useState(route?.params?.item.end_date)

    /**
     * @description for assigning entity id and assign to
     */
    useEffect(() => {
        if (route?.params?.profile) {
            const profile = route?.params?.profile;
            setFormdata({
                ...formdata,
                assigned_to:profile.user,
                enity:profile.entity
            })

            setHeaderName(t("Create task"));
        }
    }, [route?.params?.profile]);


    //FOR UPDATING AND POSTING TASK
    const submitFormHandler = () => {
        if(formdata.id){
            setLoader(true)
            InspectionAPI.updateTaskData(formdata, formdata.id).then((res)=>{
                    setFormdata(defaultValues)
                    if(todo.length>0){
                        putTodo(res.id,()=>{
             
                            showMessage({
                                message: 'Task successfully submitted',
                                type: "success",
                              });
                              navigation.navigate('TaskView',{'taskdata': res})
                              setFormdata(defaultValues)
                              setLoader(false)
                              setFileList([])
                              setTodo([])

                            }) 
                    } else {
                        setFormdata(defaultValues)
                        navigation.navigate('TaskView',{'taskdata': res})
                        setLoader(false)
                        setFileList([])
                        setTodo([])
                        showMessage({
                            message: 'Task successfully submitted',
                            type: "success",
                          });

                    }
            }).catch((err)=>{
                console.log(err, 'task error')
                showMessage({
                    message: 'Something went wrong, please check',
                    type: "error",
                  });
                setLoader(false)
            })
        }
    }

    const putTodo = (task, callback) => {
        let data;
        todo.map((item, index)=>{
            data = item
            data['task']=task
            InspectionAPI.updateTodoData(data, data.id)
            .then((res)=>{
                if(index === todo.length-1){
                    callback()
                }
            })
            .catch((err)=>{
                console.log(err, 'update todo -error')
                showMessage({
                    message: 'Something went wrong, please check',
                    type: "error",
                  });
                setLoader(false)
            })
        })
    }

 
    /**
     * @description get list of inspector under manager
     */
     const entity = useSelector(state => state.auth.user.entity)
     const [ inspectors, setInspectors ] = useState([])
     useEffect(() => {
        if(entity){
           InspectionAPI.listOfProfiles({entity: entity})
           .then((res)=>{
               setInspectors(res)
           })
           .catch((err)=>{
               console.log(err)
           })     
        }
   }, [entity]);

   const [ AssignedTo, setAssignedTo ] = useState()
   const [ AssignedBy, setAssignedBy ] = useState()
   
   useEffect(()=>{
        if(inspectors.length>0){
            inspectors.filter((item)=>{
                if(formdata.assigned_to===item.user){
                    setAssignedTo(item)
                }
                if(formdata.assigned_by === item.user){
                    setAssignedBy(item)
                }
            })
        }
   },[inspectors, formdata])
      
   const [show, setShow] = useState(false);

    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}
        >
            <Header
                title={headerName}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
                renderRight={() => {
                    return (
                        <Text headline primaryColor>
                            {t("save")}
                        </Text>
                    );
                }}
                onPressRight={() => {
                    submitFormHandler()
                }}
            />
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contain}>
                    <Text headline style={styles.title}>
                        {t("title")}
                    </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={(text) => {
                            setFormdata({
                                ...formdata,
                                "title": text
                            })
                        }}
                        autoCorrect={false}
                        placeholder={"Describe your task"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={formdata.title}
                    />

                    <Text headline style={styles.title}>
                        {t("description")}
                    </Text>
                    <TextInput
                        style={[
                            BaseStyle.textInput,
                            { marginTop: 10, height: 180 },
                        ]}
                        onChangeText={(text) => {
                            setFormdata({
                                ...formdata,
                                "description": text
                            })
                        }}
                        textAlignVertical="top"
                        multiline={true}
                        autoCorrect={false}
                        placeholder={"Enter some brief about task"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={formdata.description}
                    />

                    <Text headline style={styles.title}>
                        {"Reason for re-assigning"}
                    </Text>
                    <TextInput
                        style={[
                            BaseStyle.textInput,
                            { marginTop: 10, height: 80 },
                        ]}
                        onChangeText={(text) => {
                            setFormdata({
                                ...formdata,
                                "reason_for_reassigning": text
                            })
                        }}
                        textAlignVertical="top"
                        multiline={true}
                        autoCorrect={false}
                        placeholder={"Enter the reason for reassigning the task"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={formdata.reason_for_reassigning}
                    />
                    <Text headline style={styles.title}>
                        {"Schedule end day"}
                    </Text>
                    <TouchableOpacity style={{
                            width:'100%'
                        }}
                        onPress={()=>{
                            setShow(true)
                        }}>
                        <Text>
                            {backendDateFormat(datev1)}
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        show={show}
                        setShow={setShow}
                        day={`${datev1}`}
                        onChangev1={(date)=>{
                            setDatev1(date)
                            setFormdata({
                                ...formdata,
                                "end_date": backendDateFormat(date)
                            })
                        }}
                    />
                    <Text headline style={styles.title}>
                        {t("Other")}
                    </Text>

                    <ListOptionSelected
                        style={{ marginTop: 0 }}
                        textLeft={t("priority")}
                        textRight={t(priority.text)}
                        onPress={() => setOpenPriority(true)}
                    />

                    <ListOptionSelected
                        style={{ marginTop: 15 }}
                        textLeft={"Status"}
                        textRight={t(status.text)}
                        onPress={() => setOpenStatus(true)}
                    />


                    <View style={{
                        flexDirection: "row",
                        justifyContent:"space-between"
                    }}>
                        <TouchableOpacity onPress={()=>{
                                setModalData("to")
                                setinsVisible(true)
                            }} style={{width:"45%"}}>
                            {AssignedTo?
                            <>
                                <Text headline style={styles.title}>
                                    {t("Assigned to")}
                                </Text> 
                                <ProfileAuthor
                                    style={{ flex: 1 }}
                                    image={{uri:`${HOST_URL}${AssignedTo?.profile_image}`}}
                                    name={`${AssignedTo?.first_name} ${AssignedTo?.last_name}`}
                                    description={'(Inspector)'}
                                />
                            </>:
                            <View style={{height:30, width:70,paddingTop:4}}>
                                <LoadingDots bounceHeight={2} size={16}/>
                            </View>
                        }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                                setModalData("by")
                                setinsVisible(true)
                            }} style={{width:"45%",zIndex:1000, elevation:10}}>
                        {AssignedBy?
                            <>
                                <Text headline style={styles?.title}>
                                    {t("Assigned by")}
                                </Text> 
                                <ProfileAuthor
                                    image={{uri:`${HOST_URL}${AssignedBy?.profile_image}`}}
                                    name={`${AssignedBy?.first_name} ${AssignedBy?.last_name}`}
                                    description={'(Inspector)'}
                                />
                             </>:
                            <View style={{height:30, width:70,paddingTop:4}}>
                                <LoadingDots bounceHeight={2} size={16}/>
                            </View>
                        }
                        </TouchableOpacity>

                 
                    </View>
                    
                    <Text headline style={styles.title}>
                        {"Todo's"}
                    </Text>

                    {todo.map((item,index)=>(
                        <View key={index}>
                            <Text headline semibold style={{marginVertical:10}}>
                                {`Title of todo (${index+1})`}
                            </Text>
                            <TextInput
                                style={[BaseStyle.textInput]}
                                onChangeText={(text) => {
                                    let data = [ ...todo ]
                                    data[index]['title']=text
                                    setTodo(data)
                                }}
                                autoCorrect={false}
                                placeholder={"Describe your todo"}
                                placeholderTextColor={BaseColor.grayColor}
                                value={item.title}
                            />
                            <Text headline semibold style={{marginVertical:10}}>
                                {`description (${index+1})`}
                            </Text>
                            <TextInput
                                style={[
                                    BaseStyle.textInput,
                                    { marginTop: 0, height: 120 },
                                ]}
                                onChangeText={(text) => {
                                    let data = [ ...todo ]
                                    data[index]['description']=text
                                    setTodo(data)
                                }}
                                textAlignVertical="top"
                                multiline={true}
                                autoCorrect={false}
                                placeholder={"Description for todo"}
                                placeholderTextColor={BaseColor.grayColor}
                                value={item.description}
                            />
                        </View>
                    ))}

                    <View>
                        <Text
                            headline
                            style={{ paddingHorizontal: 4, marginTop:30, fontSize: 21 }}>
                            {"Evidence files"}
                        </Text>
                        <ChooseFile fileList={fileList} setFileList={setFileList} task={formdata.id}/>
                    </View>
        

                </View>
            </ScrollView>
       

            <ModalOption
                options={TaskPriority}
                isVisible={openPriority}
                onSwipeComplete={() => {
                    setOpenPriority(false);
                }}
                onPress={(item) => {
                    setPriority(item);
                    setFormdata({
                        ...formdata,
                        "priority": item.value
                    })
                    setOpenPriority(false);
                }}
            />
            <ModalOption
                options={TaskStatus}
                isVisible={openStatus}
                onSwipeComplete={() => {
                    setOpenStatus(false);
                }}
                onPress={(item) => {
                    setStatus(item);
                    setFormdata({
                        ...formdata,
                        "status": item.value
                    })
                    setOpenStatus(false);
                }}
            />
            <InsOption
                options={inspectors}
                isVisible={insVisible}
                onSwipeComplete={() => {
                    setinsVisible(false);
                }}
                onPress={(item) => {
                    if(modalData === "by"){
                        setFormdata({
                            ...formdata,
                            "assigned_by": item.user
                        })
                    }

                    else if(modalData === "to"){
                        setFormdata({
                            ...formdata,
                            "assigned_to": item.user
                        })
                    }
                    setinsVisible(false);
                }}
            />

            {loader &&
                <View style={{
                    position:'absolute',
                    top:0,
                    flex:1,
                    width:'100%',
                    backgroundColor:"rgba(0,0,0,0.4)",
                    alignItems:'center',
                    justifyContent:'center',
                    height:'100%'}}>
                    <Progress.Circle 
                        size={49} 
                        color={colors.primary}
                        indeterminate={true}
                        borderWidth= {3}/>
                </View>
            }
        </SafeAreaView>
    );
};

export default TaskEdit;
