import React from 'react'
import { View } from 'react-native'
import * as Progress from 'react-native-progress';
import { useTheme } from "@config";


export default function Loader() {
    const { colors } = useTheme();
    return (
        <View style={{
            alignItems:'center',
            justifyContent:'center',
            flex:1}}>
            <Progress.Circle 
                size={49} 
                color={colors.primary}
                indeterminate={true}
                borderWidth= {3}/>
        </View>
    )
}
