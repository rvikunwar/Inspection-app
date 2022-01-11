import React, { useState, useEffect } from 'react'
import {
    Header,
    TextInput,
    Icon,
    ListTextButton,
    SafeAreaView,
    Tag
} from "@components";
import { InspectionAPI } from "@connect/api";
import { haveChildren } from "@utils";
import { BaseColor, BaseStyle, useTheme } from "@config";
import Procfile from '@assets/images/procfile.jpg'
import { HOST_URL } from "@env"
import { 
    View,
    TouchableOpacity,
    FlatList 
} from 'react-native'
import { Loader } from '@container'


export default function Managers(props) {

    const { colors } = useTheme();

    //FILTERING   entities
    const [keyword, setKeyword] = useState("");
    const [ managers, setManagers ] = useState([])
    const [ managersv1, setManagersv1 ] = useState([])
    const [ loader, setLoader ] = useState(true)
    const entity = props.route.params.entity
    const navigation = props.navigation

    useEffect(()=>{
        InspectionAPI.getManagersList(entity)
        .then((res)=>{
            setManagers(res)
            setManagersv1(res)
            setLoader(false)
            console.log(res)
            console.log('successfully fetched managers list')
        })
        .catch((err)=>{
            console.log(err, 'some error occured while fetching managers list')
            setLoader(false)
        })
    },[entity])


    const filterCategory = (text) => {
        setKeyword(text);
        if (text) {
            setManagers(
                managersv1.filter(
                    (item) =>
                        haveChildren(item.name, text) ||
                        haveChildren(item.email, text)
                )
            );
        } else {
            setManagers(managersv1);
        }
    };
    
    return (
        <SafeAreaView   
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always", bottom: "always"}}>
            <Header 
                title={"Managers"}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.text}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}/>

            <View
                style={{
                    paddingHorizontal: 20
                }}>
                <TouchableOpacity>
                    <TextInput
                        onChangeText={filterCategory}
                        style={{elevation:2}}
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
                        data={managers}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <ListTextButton
                                style={{paddingHorizontal:7, marginTop:0}}
                                image={item.profile_image?{uri:`${HOST_URL}${item.profile_image}`}:Procfile}
                                name={item.first_name +" "+ item.last_name}
                                description={item.email}
                                online={item.online}
                                onPress={() => {
                                    navigation.navigate("Messages",{ selectedUser: item });
                                }}
                                componentRight={
                                    <Tag
                                        outline
                                        style={{
                                            paddingHorizontal: 20,
                                            backgroundColor: colors.background,
                                        }}
                                    >
                                        {"Send text"}
                                    </Tag>
                                }/>
                        )}
                    />
            </View>
        </SafeAreaView>
    )
}
