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
import { FlatList, ScrollView, View } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "@connect/api";
import { backendDateFormat } from '@common'
import ChooseFile from "./ChooseFile";


const TaskCreate = (props) => {

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

    const [ priority, setPriority ] = useState(TaskPriority[0])
    const [ openPriority, setOpenPriority ] = useState(false)

    const defaultValues = {
        id: null,
        title: null,
        description: null,
        priority: priority.value,
        assigned_to:null,
        entity:null,
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

        InspectionAPI.postTask(formdata).then((res)=>{
            if(fileList.length>0){
                uploadFiles(res.id,()=>{
                    setFormdata(defaultValues)

                    navigation.navigate('TaskView', {item: res, fileList:fileList})
                })
            } else{
                if(todo.length>0){
                    postTodo(res.id,()=>{
                        setFormdata(defaultValues)
    
                        navigation.navigate('TaskView', {item: res, fileList:fileList})
                    }) 
                }
                else{
                    setFormdata(defaultValues)
                    navigation.navigate('TaskView', {item: res})
                }
            }
            
        }).catch((err)=>{
            console.log(err)
        })
    
    }
    
    const [ fileList, setFileList ] = useState([])

    const uploadFiles = (task, callback) => {
        
        fileList.map((item)=>{
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
        })
        postTodo(task,callback)
    }

    const defaultTodo = {
        title: "",
        description: ""
    }
    const [ todo, setTodo ] = useState([defaultTodo])

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
                callback()
            })
            .catch((err)=>{
                console.log(err)
            })
        })
    }

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
                    <FormDoubleSelectOption
                        formdata={formdata}
                        setFormdata={setFormdata}
                        titleLeft={t("start_date")}
                        titleRight={t("end_date")}
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
                                <Text footnote whiteColor>Add more todo</Text></Button>
                    </View>
            

                {todo.map((item,index)=>(
                     <>
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
                     </>
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
        </SafeAreaView>
    );
};

export default TaskCreate;
