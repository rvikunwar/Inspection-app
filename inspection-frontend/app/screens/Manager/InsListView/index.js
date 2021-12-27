import React, { useState } from 'react'
import { ListTextButton, Tag, TextInput, Icon, Header } from '@components'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useTheme, BaseColor } from "@config";
import {HOST_URL} from "@env"
import { haveChildren } from "@utils";


export default function InsListView(props) {

    const { route, navigation } = props
    const inspectors = route.params.inspectors
    const itemv1 = route.params.itemv1 
    const { colors } = useTheme();
    
    //FILTERING   
    const [keyword, setKeyword] = useState("");
    const [ inspectorsv1, setInspectors] = useState(inspectors)

    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setInspectors(
                inspectorsv1.filter(
                    (item) =>
                        haveChildren(item.first_name, text) ||
                        haveChildren(item.last_name, text) ||
                        haveChildren(item.email, text)
                )
            );
        } else {
            setInspectors(inspectors);
        }
    };

    return (
        <View style={{
            padding:10,
            paddingTop:30,
            paddingHorizontal:25
        }}>
            <Header title="INSPECTORS"/>

            <TextInput
                onChangeText={filterCategory}
                autoFocus
                style={{elevation:0}}
                placeholder={"name, username or email"}
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
            <FlatList
                data={inspectorsv1}
                keyExtractor={(item, index) => item.id}               
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ListTextButton
                        image={{uri:`${HOST_URL}${item.profile_image}`}}
                        name={item.first_name +" "+ item.last_name}
                        description={item?.email}
                        online={item.online}
                        style={{marginTop: 7}}
                        onPress={() => {
                            navigation.navigate("InspectorProfile",{ inspector: item, department: itemv1 });
                        }}
                    componentRight={
                        <Tag
                            
                            outline
                            style={{
                                paddingHorizontal: 20,
                                backgroundColor: colors.background,
                            }}
                        >
                            {`${"check"}`}
                        </Tag>
                    }
                />
                )}
            />
        </View>
    )
}
