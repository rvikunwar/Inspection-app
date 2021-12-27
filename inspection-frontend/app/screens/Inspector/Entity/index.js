import React, { useState, useEffect } from 'react'
import {
    Text,
    PieChart,
    Header,
    TextInput,
    Icon,
    ListTextButton,
    Tag
} from "@components";
import { InspectionAPI } from "@connect/api";
import { haveChildren } from "@utils";
import { 
    SafeAreaView, 
    TouchableOpacity,
    FlatList
} from "react-native";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { useNavigation} from "@react-navigation/native";
import style from './styles'


export default function Entity() {

    const { colors } = useTheme();
    const navigation = useNavigation();

 
    const data = [
        {
            name: "New tasks",
            count: 0,
            color: "#0E9CF5",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Tasks with issue",
            count: 0,
            color: BaseColor.greenColor,
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Tasks re-assigned",
            count: 0,
            color: "#60505A",
            legendFontColor: "#7F7F7F",
        },
    
        {
            name: "Tasks on progress",
            count: 0,
            color: BaseColor.pinkColor,
            legendFontColor: "#0E9CF5",
        },
        
        {
            name: "Completed tasks",
            count: 0,
            color: BaseColor.accent,
            legendFontColor: "#F4972F",
        },
    ];

    const setStatdata = (res, setFunc) => {
        const data = [
            {
                name: "New tasks",
                count: res.new,
                color: "#0E9CF5",
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Tasks with issue",
                count: res.has_issue,
                color: BaseColor.greenColor,
                legendFontColor: "#7F7F7F",
            },
            {
                name: "Tasks re-assigned",
                count: res.re_assigned,
                color: "#60505A",
                legendFontColor: "#7F7F7F",
            },
    
            {
                name: "Tasks on progress",
                count: res.processing,
                color: BaseColor.pinkColor,
                legendFontColor: "#7F7F7F",
            },
            
            {
                name: "Completed tasks",
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
    const role = "INSPECTOR"
    useEffect(()=>{

        InspectionAPI.getInspectorStat({role})
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
            setEntities(
                entitiesv1.filter(
                    (item) =>
                        haveChildren(item.name, text) ||
                        haveChildren(item.email, text)
                )
            );
        } else {
            setEntities(entitiesv1);
        }
    };


    /**
     * @description get list of entities
     */
    const [ entities, setEntities ] = useState([])
    const [ entitiesv1, setEntitiesv1 ] = useState([])

    useEffect(()=>{
        InspectionAPI.getEntityList()
        .then((res)=>{
            setEntities(res)
            setEntitiesv1(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView, style.container]}
            forceInset={{ top: "always", bottom: "always"}}>
            <Header title={"DEPARTMENTS"}/>

            <PieChart data={inspectorStat}/>

            <TouchableOpacity
                style={{
                    zIndex:10000
                }}>
                <TextInput
                    onChangeText={filterCategory}
                    style={{elevation:3}}
                    placeholder={"name, email"}
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

            <FlatList
                style={style.flatlist}
                data={entities}
                keyExtractor={(item, index) => item.id}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ListTextButton
                    // image={{uri:`${HOST_URL}${item.profile_image}`}}
                    name={item.name}
                    description={item?.email}
                    style={{marginTop: 5}}
                    styleDescription={{marginTop:0}}
                    onPress={() => {
                        navigation.navigate("EntityView",{ entity: item });
                    }}
                    componentRight={
                        <Tag
                            
                            outline
                            style={{
                                paddingHorizontal: 20,
                                backgroundColor: colors.background,
                            }}
                        >
                            {`${"Check"}`}
                        </Tag>
                    }
                />
                )}
            />

        </SafeAreaView>
    )
}
