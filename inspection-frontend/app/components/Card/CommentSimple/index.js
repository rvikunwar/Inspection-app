import Icon from "@components/Icon";
import Image from "@components/Image";
import Text from "@components/Text";
import { useTheme, BaseColor } from "@config";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { 
    ModalOption,
} from "@components";
import { InspectionAPI } from "../../../connect/api";


export default function CardCommentSimple(props) {
    const { colors } = useTheme();
    const { style, title, date,status, description, item, show,
        showAction, setShowAction, setEditTodoData, onAction = () => {} } = props;
    
    const [ openTodoStatus, setOpenTodoStatus] = useState(false)
    const [ statusv1, setStatus ] = useState({text:status})
    const TodoStatus = [
        {
            value: "NEW",
            iconName: "flag-checkered",
            text: "New todo",
        },
        {
            value: "ISSUE",
            iconName: "arrow-circle-down",
            text: "Have issue with todo",
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

    const definColor = (status) => {

        let color=BaseColor.greenColor;

        if(status==='NEW'){
            color = "#0E9CF5"
        }
         else if(status==="PROCESSING"){
            color = BaseColor.pinkColor
         }
         else if(status === "COMPLETED"){
            color = "#F4972F"
         }
         return color;
    }




    return (
        <View
            style={[
                styles.contain,
                { backgroundColor: colors.background },
                style,
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 0,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text headline numberOfLines={1} style={{fontSize:17}}>
                        {title}
                    </Text>

                </View>
                <View style={{ flexDirection:"row"}}>
                    <View style={{ backgroundColor: definColor(statusv1.value), paddingHorizontal:8,
                        paddingVertical: 2, 
                        borderRadius: 5, alignContent:"center", justifyContent:"center"}}>
                        <Text style={{ color: 'white', fontSize:12}}>{statusv1.text}</Text>
                    </View>
                    {!show &&
                    <TouchableOpacity style={{  width:20, alignItems:"flex-end"}} onPress={() => { 
                        setOpenTodoStatus(true)
                        }}>
                        <Icon name="ellipsis-v" size={14} />
                    </TouchableOpacity>}
                </View>
            </View>
            <View>
                <Text
                    body2
                    style={{
                        marginTop: 7,
                    }}
                >
                    {description}
                </Text>
            </View>
            <ModalOption
                options={TodoStatus}
                isVisible={openTodoStatus}
                onSwipeComplete={() => {
                    setOpenTodoStatus(false)
                }}
                onPress={(itemv1) => {
                    setStatus(itemv1)
                    InspectionAPI.updateTodoStatus({status:itemv1.value,id:item.id})
                    setOpenTodoStatus(false);
                }}
            />
        </View>
    );
}

CardCommentSimple.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    name: PropTypes.string,
    date: PropTypes.string,
    comment: PropTypes.string,
    status: PropTypes.string,
    onAction: PropTypes.func,
};
