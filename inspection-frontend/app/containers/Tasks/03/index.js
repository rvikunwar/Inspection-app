import Avatars from "@components/Avatars";
import Icon from "@components/Icon";
import ProgressCircle from "@components/Progress/Circle";
import Tag from "@components/Tag";
import Text from "@components/Text";
import { BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "../../../connect/api";
import { dateformat } from "../../../common";

const Tasks03 = ({
    style,
    onPress,
    title,
    description,
    assigned_to ,
    status = "",
    timestamp,
    task,
    user=null,
    refreshing,
    assigned_by,
    tab
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const { statusName, statusColor } = useMemo(() => {
        switch (status) {
            case "NEW":
                return {
                    statusName: status,
                    statusColor: "#0E9CF5",
                };
            case "PROCESSING":
                return {
                    statusName: status,
                    statusColor: BaseColor.pinkColor,
                };

            case "COMPLETED":
                return {
                    statusName: status,
                    statusColor: "#F4972F"
                };
            case "RE-ASSIGNED":
                return {
                    statusName: status,
                    statusColor:"#60505A"
                }; 
            default:
                return {
                    statusName: status,
                    statusColor: BaseColor.greenColor,
                };
        }
    }, [status]);


    const [ member, setMember ] =  useState([])
    const [ stats, setStats ] = useState({ todo: 0, completed:0})
    useEffect(()=>{
        let isMounted = true
        let id
        if(user && user===assigned_by){
            id = assigned_to
        } else if(user && user===assigned_to){
            id = assigned_by
        }

        if(isMounted){
            InspectionAPI.getMemberProfileDetails(id).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })

            InspectionAPI.getTodosStats(task)
            .then((res)=>{
                setStats({
                    todo: res.total,
                    completed: res.completed
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[tab, user, assigned_by, assigned_to])


    useEffect(()=>{
        let isMounted = true

        let id
        if(user && user===assigned_by){
            id = assigned_to
        } else if(user && user===assigned_to){
            id = assigned_by
        }


        if(isMounted){
            InspectionAPI.getMemberProfileDetails(id).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })

            InspectionAPI.getTodosStats(task)
            .then((res)=>{
                setStats({
                    todo: res.total,
                    completed: res.completed
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[refreshing])

    const [ assigne, setAssigne ] = useState("") 
    useEffect(()=>{
        if(user && user===assigned_by){
            setAssigne('assigned to')
        } else if(user && user===assigned_to){
            setAssigne('assigned by')
        }
    },[user, assigned_by, assigned_to])

    
    const percent = useMemo(() => {
        try {
            if (stats.todo != 0) {
                return Math.round((stats.completed / stats.todo) * 100);
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }, [stats]);

    return (
        <View style={[styles.contain, style, { marginTop:0, marginBottom:-8 }]}>
            <View style={{ flex: 1,  borderBottomWidth:1, borderBottomColor:"rgba(0,0,0,0.1)", paddingBottom:20 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                        <Text headline semibold title3 numberOfLines={1} >
                            {title}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection:"row", 
                    justifyContent:"flex-start", 
                    alignItems:"center",
                    marginTop:10,
                    marginBottom:10,
                    }}>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <Tag
                        light
                        textStyle={{
                            color: BaseColor.whiteColor,
                        }}
                        style={{
                            backgroundColor: statusColor,
                            paddingHorizontal: 10,
                            minWidth: 80,
                        }}
                    >
                        {statusName}
                    </Tag>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginLeft:15
                    }}
                >
                    {stats.todo>0 && <>
                    <Icon name="tasks" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingLeft: 5,
                            paddingRight: 20,
                        }}
                    >
                        {stats.todo} {t("todo's")}
                    </Text>
    

                    <Icon solid name="check" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingHorizontal: 5,
                            paddingRight: 20,
                        }}
                    >
                        {stats.completed} {t("completed")}
                    </Text>
                    </>}

                    <Icon solid name="calendar-day" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingHorizontal: 5,
                        }}
                    >
                        {dateformat(timestamp)}
                    </Text>
                </View>
                </View>
                <Text body2 light>
                    {description}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: 15,
                    }}
                >
                    <Avatars member={member} assigne={assigne} textstyle="body1"/>
                </View>
                {stats.todo>0 &&
                <>
                    <View style={styles.viewRight}>
                        <ProgressCircle
                            style={{ marginBottom: 2, }}
                            percent={percent}
                        />
                        
                        <Text footnote light>
                            {stats.todo} total todo
                        </Text>

                        <Text footnote light>
                            {stats.completed} todo completed
                        </Text>

                    </View>
                </>
                }
            </View>
        </View>
    );
};

Tasks03.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onPress: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    completedTodo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onOption: PropTypes.func,
};

export default Tasks03;
