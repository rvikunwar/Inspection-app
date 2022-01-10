import React, { useState } from 'react'
import { TextInput, Icon, Header } from '@components'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useTheme, BaseColor } from "@config";
import { haveChildren } from "@utils";
import Area from '../EntityView/Area';


export default function AreaListView(props) {

    const { route, navigation } = props
    const areas = route.params.Areas
    const entity = route.params.entity
    
    //FILTERING   
    const [keyword, setKeyword] = useState("");
    const [ areasv1, setAreas] = useState(areas)

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setAreas(
                areasv1.filter(
                    (item) =>
                        haveChildren(item.name, text)
                )
            );
        } else {
            setAreas(areas);
        }
    };

    return (
        <View style={{
            paddingTop:30,
        }}>
            <Header 
                title="ALLOCATED AREAS"
                renderLeft={() => {
                    return (
                    <Icon
                        name="angle-left"
                        size={20}
                        color="#D1D1D1"
                        enableRTL={true}
                    />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}/>
            <View style={{paddingHorizontal:20, marginBottom:15}}>
                <TextInput
                    onChangeText={filterCategory}
                    autoFocus
                    style={{elevation:3,}}
                    placeholder={"Allocated areas"}
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
                    data={areasv1}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                        <Area item={item} navigation={navigation} entity={entity}/>
                    )}
                />
        </View>
    )
}
