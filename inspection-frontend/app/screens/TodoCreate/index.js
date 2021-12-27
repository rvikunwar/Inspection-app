import {
    FormDoubleSelectOption,
    Header,
    Icon,
    PButtonAddUser,
    ProfileGridSmall,
    SafeAreaView,
    Text,
    TextInput,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { PTeamMembersInCreate } from "@data";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "../../connect/api";


const TaskCreate = (props) => {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const [headerName, setHeaderName] = useState(t("Create todo"));
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigation = useNavigation();
    const route = useRoute();

    const defaultValues = {
        id: null,
        title: null,
        description: null
    }

    const [ formdata, setFormdata ] = useState(defaultValues)

    useEffect(() => {
        if (route?.params?.item) {
            const item = route?.params?.item;
            console.log(item)
            if(item){
                setHeaderName(t("Edit todo"));
                setFormdata({
                    ...defaultValues,
                    ...item
                })

            } else{
                setHeaderName(t("Create_todo")); 
            }
        }
    }, [route?.params?.item]);

    useEffect(()=>{
        if(route?.params?.task){
            setFormdata({
                ...formdata,
                task: route?.params?.task
            })
        }

    },[route?.params?.task])

    
    //FOR UPDATING AND POSTING TODO's
    const [ refreshv1, setRefreshv1 ] = useState(false)
    const submitFormHandler = () => {

        if(formdata.id){
            InspectionAPI.updateTodoData(formdata, formdata.id).then((res)=>{
                navigation.navigate('TaskView', {'update': formdata})
            }).catch((err)=>{
                console.log(err.reponse.data)
            })
        }
        else{
            InspectionAPI.postTodoData(formdata).then((res)=>{
                navigation.navigate('TaskView', {'update': formdata})
            }).catch((err)=>{
                console.log(err)
            })
        }
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
                        placeholder={"Give a title for you todo"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={formdata.title}
                    />

                    <Text headline style={styles.title}>
                        {t("description")}
                    </Text>
                    <TextInput
                        style={[
                            BaseStyle.textInput,
                            { marginTop: 10, height: 350 },
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
                        placeholder={"Give some brief about todo"}
                        placeholderTextColor={BaseColor.grayColor}
                        value={formdata.description}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskCreate;
