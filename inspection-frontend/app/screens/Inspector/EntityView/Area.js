import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { InspectionAPI } from '../../../connect/api';
import { Text } from '@components'
import styles from "./styles";
import { Tasks02 } from '../../../containers'
import { useNavigation } from "@react-navigation/native";


const Area = ({ item,  navigation, entity }) => {


     /**
     * @description get inspector stats
     */
    const [ inspectorStat, setInspectorStat] =  useState({
        inspector_count:1,
        online_inspector:0
    })
    useEffect(()=>{
        InspectionAPI.getAreaStat(item?.id,entity?.id)
            .then((res)=>{
                setInspectorStat({
                    ...inspectorStat,
                    ...res
                })
            })
            .catch((err) => {
                console.log(err)
            })
    },[])


    /**
     * @description get list of inspector under manager
     */
     const [ inspectors, setInspectors ] = useState([])
     useEffect(() => {
        if(item && entity){
           InspectionAPI.listOfProfiles({area: item?.id, entity: entity?.id})
           .then((res)=>{
               setInspectors(res)
           })
           .catch((err)=>{
               console.log(err)
           })     
        }
   }, [item, entity]);


    const goToArea = () => {
        navigation.navigate('AreaView',{"area":item, "inspectors":inspectors, entity})
    }


    return (
        <>
           <Tasks02
                title={item.name}
                members={inspectors}
                inspectorStat={inspectorStat}
                onPress={goToArea}
                style={{
                    marginBottom: 10,
                    paddingHorizontal:20
                }}/>
       </>
    )
}

export default Area
