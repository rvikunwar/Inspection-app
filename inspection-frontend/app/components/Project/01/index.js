import Avatars from "@components/Avatars";
import Icon from "@components/Icon";
import ProgressBar from "@components/Progress/Bar";
import Tag from "@components/Tag";
import Text from "@components/Text";
import { BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { InspectionAPI } from "../../../connect/api";


const Project01 = ({
    style,
    users,
    setUsers,
    index,
    onPress,
    title,
    description,
    onOption,
    assigned_to = [],
    limit = 3,
    tasks = 100,
    todo = 0,
    completedTodo = 0,
    status = "",
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const percent = useMemo(() => {
        try {
            if (todo != 0) {
                return Math.round((completedTodo / todo) * 100);
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }, [completedTodo, todo]);

    const { statusName, statusColor } = useMemo(() => {
        switch (status) {
            case "NEW":
                return {
                    statusName: t(status),
                    statusColor: BaseColor.pinkLightColor,
                };
            case "PROCESSING":
                return {
                    statusName: t(status),
                    statusColor: BaseColor.pinkColor,
                };
            default:
                return {
                    statusName: t(status),
                    statusColor: BaseColor.greenColor,
                };
        }
    }, [status]);

    const [ member, setMember ] =  useState([])
    useEffect(()=>{
        let isMounted = true

        if(isMounted){
            InspectionAPI.getMemberProfileDetails(assigned_to).then((res)=>{
                setMember(res)
            }).catch((err)=>{
                console.log(err)
            })
        }
        return ()=>{
            isMounted=false
        }

    },[])


    return (
        <View style={[styles.contain, style, { backgroundColor: colors.card }]}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                        <Text title3 numberOfLines={1} >
                            {title}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        hitSlop={{ top: 10, right: 10, top: 10, left: 10 }}
                        style={{ paddingLeft: 16 }}
                        onPress={onOption}
                    >
                        <Icon name="ellipsis-h" size={14} color={colors.text}></Icon>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        paddingTop: 5,
                        paddingBottom: 10,
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
                        alignItems: "center",
                        paddingBottom: 20,
                    }}
                >
                    <Icon name="tasks" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingLeft: 5,
                            paddingRight: 20,
                        }}
                    >
                        {todo} {t("todo's")}
                    </Text>

                    <Icon solid name="check" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingHorizontal: 5,
                            paddingRight: 20,
                        }}
                    >
                        {completedTodo} {t("completed")}
                    </Text>

                    <Icon solid name="calendar-day" size={14} color={colors.text} />
                    <Text
                        caption1
                        style={{
                            paddingHorizontal: 5,
                        }}
                    >
                        {'12 Nov, 2021'}
                    </Text>
                </View>
                <Text body2 light>
                    {description}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: 20,
                    }}
                >
                    <Avatars member={member} />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: 20,
                        paddingBottom: 5,
                        justifyContent: "space-between",
                    }}
                >
                    <Text overline>
                        {t("completed")} {`${percent}%`}
                    </Text>
                    <Text overline>
                        {`${completedTodo}/${todo}`} {t("todo's")}
                    </Text>
                </View>
                <ProgressBar
                    style={{ flex: 1, paddingRight: 20 }}
                    color={BaseColor.accentColor}
                    percent={percent}
                />
            </View>
        </View>
    );
};

Project01.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onPress: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    completedTodo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onOption: PropTypes.func,
};

export default Project01;
