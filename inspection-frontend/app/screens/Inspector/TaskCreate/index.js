import {
    FormDoubleSelectOption,
    Header,
    Icon,
    PButtonAddUser,
    ProfileGridSmall,
    SafeAreaView,
    Text,
    TextInput,
    ListOptionSelected,
    ModalOption,
    ModalFilter,
    ProfileAuthor,
    Button
} from "@components";
import { BaseColor, BaseStyle, useTheme, Images } from "@config";

import { useNavigation, useRoute } from "@react-navigation/core";
import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "@connect/api";
import { backendDateFormat } from '@common'
import ChooseFile from "./ChooseFile";
import {  sendNotificationHandler } from '../../../socket/socketfunc'
import * as Progress from 'react-native-progress';
import { showMessage } from "react-native-flash-message";
import { DatePicker } from '@container'


const TaskCreate = (props) => {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const [headerName, setHeaderName] = useState(t("Create task"));
    const navigation = useNavigation();
    const route = useRoute();
    const profile = route?.params?.profile
    const department = route?.params?.department
    const area = route?.params?.area
    const [ loader, setLoader ] = useState(false)


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
            value: "MEDIUM",
            iconName: "minus-circle",
            text: "Medium",
        },
        {
            value: "LOW",
            iconName: "arrow-circle-down",
            text: "Low",
        },
    ];

    const [ priority, setPriority ] = useState(TaskPriority[0])
    const [ openPriority, setOpenPriority ] = useState(false)


    //for handling notification and sending to user
    const notifictaionHandler = (title) => {
        sendNotificationHandler({
            title:"New assignment",
            title1:title,
            sender_name: profile?.first_name + " " + profile?.last_name,
            reciever: profile?.user,
            content: `has assigned you a new task for ${department?.name} for ${area?.name}`,
        })
    }


    const defaultValues = {
        id: null,
        title: null,
        description: null,
        priority: priority.value,
        assigned_to:profile.user,
        entity:department.id,
        end_date: backendDateFormat(new Date),
    }


    const [ formdata, setFormdata ] = useState(defaultValues)


    useEffect(() => {
        if (route?.params?.item) {
            const item = route?.params?.item;
            setFormdata({
                ...formdata,
                ...item
            })

            setHeaderName(t("Edit task"));
        }
    }, [route?.params?.item]);


    /**
     * @description for assigning entity id and assign to
     */
    useEffect(() => {
        if (profile) {
            setHeaderName(t("Create task"));
        }
    }, [profile]);


    //FOR UPDATING AND POSTING TASK
    const submitFormHandler = () => {
        if(formdata.title){
            notifictaionHandler(formdata.title)
        }
        setLoader(true)
        InspectionAPI.postTask(formdata).then((res)=>{

            if(fileList.length>0){
                uploadFiles(res.id,()=>{
                    setFormdata(defaultValues)
                    setLoader(false)
                    setFileList([])
                    setTodo([])
                    showMessage({
                        message: 'Task successfully submitted',
                        type: "success",
                      });
                    navigation.navigate('TaskView', {item: res, fileList:fileList})
                })
            } else{
                if(todo.length>0){
                    postTodo(res.id,()=>{
                        setFormdata(defaultValues)
                        setLoader(false)
                        setFileList([])
                        setTodo([])
                        showMessage({
                            message: 'Task successfully submitted',
                            type: "success",
                          });
                        navigation.navigate('TaskView', {item: res, fileList:fileList})
                    }) 
                }
                else{
                    setFormdata(defaultValues)
                    setLoader(false)
                    showMessage({
                        message: 'Task successfully submitted',
                        type: "success",
                      });
                    navigation.navigate('TaskView', {item: res})
                }
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

    
    const [ fileList, setFileList ] = useState([])


    const uploadFiles = (task, callback) => {
        
        fileList.map((item, index)=>{
            const form = new FormData();
            form.append('task', task);
            form.append('file', {
                name: item.file.name,
                type: item.file.mimeType,
                uri: Platform.OS === 'ios' ? 
                     item.file.uri.replace('file://', '')
                     : item.file.uri,
            });
            InspectionAPI.uploadFile(form)
            .then((res)=>{
                if(index === fileList.length-1){
                    if(todo.length == 0){
                        callback()
                    } else {
                        postTodo(task,callback)
                    }
                }
            }).catch((err)=>{
                setLoader(false)

                console.log(err, 'file upload')
                showMessage({
                    message: 'Something went wrong, please check',
                    type: "error",
                  });
            })
        })

    }


    const defaultTodo = {
        title: "",
        description: ""
    }
    const [ todo, setTodo ] = useState([])

    const addNewRow = () => {
        setTodo([
            ...todo,
            defaultTodo
        ]);
    }

    const postTodo = (task, callback) => {
        let data;
        todo.map((item, index)=>{
            data = item
            data['task']=task
            InspectionAPI.postTodoData(data)
            .then((res)=>{
                if(index === todo.length-1){
                    callback()
                }
            })
            .catch((err)=>{
                console.log(err, 'todo -error')
                showMessage({
                    message: 'Something went wrong, please check',
                    type: "error",
                  });
                setLoader(false)
            })
        })
    }

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
                            {"save"}
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
                            { marginTop: 10, height: 120 },
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
                        {t("schedule")}
                    </Text>
                    <TouchableOpacity style={{
                            width:'100%'
                        }}
                        onPress={()=>{
                            setShow(true)
                        }}>
                        <Text>
                            {backendDateFormat(formdata.end_date)}
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        show={show}
                        new1={true}
                        setShow={setShow}
                        day={`${new Date()}`}
                        onChangev1={(date)=>{
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
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        alignItems:"center",
                        marginTop:40
                    }}>
                        <Text headline>
                            {t("Todo's for task")}
                        </Text>
                        <Button 
                            style={{
                                width:100, 
                                height:25,
                                paddingHorizontal:4
                                }}
                                onPress={()=>{
                                    addNewRow()
                                }}>
                                <Text footnote whiteColor>Add todo's</Text></Button>
                    </View>
            

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
                </View>


                <ChooseFile fileList={fileList} setFileList={setFileList}/>

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

export default TaskCreate;
