import {
    Header,
    Icon,
    PSelectOption,
    SafeAreaView,
    Tag,
    TextInput
} from "@components";
import {
    Tasks01
} from "@container";
import { BaseColor, BaseStyle, useTheme, Typography } from "@config";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Utils from "@utils";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View, RefreshControl, TouchableOpacity } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "@connect/api";
import { haveChildren } from "@utils";
import { useSelector } from "react-redux";


const Task = () => {

    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [status, setStatus] = useState([]);
    const [priority, setPriority] = useState([]);
    const [sort, setSort] = useState("sort");
    const [refreshing, setRefreshing] = useState(false);
    const role = 'MANAGER'
    const route = useRoute()

    const user = useSelector((state)=> state.auth.user.user_id)


    const PTaskPriority = [
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

    
    const PTaskStatus = [
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
    

    const goProjectDetail = (item) => {
        navigation.navigate("TaskView", { item: item });
    };

    const handleSort = () => {
        const task = [...tasks];
        task.sort((a, b) => {
            var priorityA = a.id;
            var priorityB = b.id;
            if (priorityB < priorityA) {
                return sort == "caret-down" ? -1 : 1;
            }
            if (priorityB > priorityA) {
                return sort == "caret-down" ? 1 : -1;
            }

            return 0;
        });
        return task;
    };

    const onSort = () => {
        Utils.enableExperimental();
        switch (sort) {
            case "sort":
                setTasks(handleSort());
                setSort("caret-down");
                break;
            case "caret-down":
                setTasks(handleSort());
                setSort("caret-up");
                break;
            case "caret-up":
                setTasks(tasks);
                setSort("sort");
                break;
            default:
                setTasks(tasks);
                setSort("sort");
                break;
        }
    };


    const onChangePriority = (type) => {

        setPriority(type);

        setTasks(filterData.filter((item) => {
            let find = []
            find  = type.filter((pr)=>{
                if(pr.value === item.priority){
                    return pr
                }
            })
            if(find.length>0){
                return item
            }
        }));
    };

    const onChangeStatus = (type) => {

        setStatus(type);

        setTasks(filterData.filter((item) => {
            let find = []
            find  = type.filter((pr)=>{
                if(pr.value === item.status){
                    return pr
                }
            })
            if(find.length>0){
                return item
            }
        }));
    };

    const [tasks, setTasks] = useState([])
    const [ filterData, setFilterData ] = useState([])

    useEffect(()=>{

        let isMounted = true

        if(isMounted){
            InspectionAPI.getTasksAssigned(role).then((res)=>{
                setTasks(res)
                setFilterData(res)
            }).catch((err)=>{
                console.log(err)
            })
        }

        return () => {
            isMounted = false
        }
    },[])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try{
            InspectionAPI.getTasksAssigned(role).then((res)=>{
                setPriority([])
                setTasks(res)
                setStatus([])
                setSort("sort")
                setFilterData(res)
                setRefreshing(false)
            }).catch((err)=>{
                console.log(err)
                setRefreshing(false)
            })
        }
        catch(err){
            setRefreshing(false)
        }
   
      }, [refreshing]);

    
    useEffect(()=>{
        if(route.params?.refresh===true){
            onRefresh()
        }
    },[route.params?.refresh])


    //FILTERING   
    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setTasks(
                filterData.filter(
                    (item) =>
                        haveChildren(item.title, text) 
                )
            );
        } else {
            setTasks(filterData);
        }
    };

    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView, { backgroundColor: colors.card }]}
            edges={["right", "top", "left"]}
        >
            <Header
                style={{ backgroundColor: colors.card }}
                title={t("Tasks assigned")}
            />
            <View style={[styles.filter, { borderColor: colors.border }]}>
                <Tag
                    gray
                    style={{
                        borderRadius: 3,
                        backgroundColor: BaseColor.kashmir,
                        marginHorizontal: 5,
                        paddingVertical: 3,
                    }}
                    textStyle={{
                        paddingHorizontal: 4,
                        color: BaseColor.whiteColor,
                    }}
                    icon={
                        <Icon
                            name={sort}
                            color={BaseColor.whiteColor}
                            size={10}
                        />
                    }
                    onPress={onSort}
                >
                    {t("sort")}
                </Tag>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <PSelectOption
                        title={t("priority")}
                        options={PTaskPriority}
                        value={priority}
                        onPress={(item) => onChangePriority(item)}
                    />
                    <PSelectOption
                        title={t("status")}
                        options={PTaskStatus}
                        value={status}
                        onPress={(item) => onChangeStatus(item)}
                    />
                </ScrollView>
            </View>

            <View style={{ paddingHorizontal:19, flexDirection:"row", marginBottom:10}}>
          

            <TextInput
                onChangeText={filterCategory}
                style={{elevation:3}}
                placeholder={"title . . ."}
                value={keyword}
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
            </View>

            <FlatList
                contentContainerStyle={{ backgroundColor: colors.card }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item, index }) => (
                    <Tasks01
                        title={item.title}
                        task={item.id}
                        description={`${item.description.substring(0,180)} . . .`}
                        status={item.status}
                        tasks={item.tasks}
                        user={user}
                        refreshing={refreshing}
                        timestamp={item.timestamp}
                        todo={10}
                        completedTodo={5}
                        assigned_to={item.assigned_to}
                        assigned_by={item.assigned_by}
                        onPress={() => goProjectDetail(item)}
                        style={{
                            paddingBottom: 20,
                            marginBottom: 15,
                            backgroundColor: "white",
                        }}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Task;
