import { 
    Icon, 
    Text, 
    ProfileAuthor ,
    Button
} from "@components";
import { useTheme } from "@config";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import MapView from 'react-native-maps';
import { darkStyle } from './darkStyle'
import { HOST_URL } from "@env"
import { parseHexTransparency } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as Linking from "expo-linking";
import { COUNTRY_CODE } from '@env'


const MapMarkerView = ({ item, setSelectedProfile, setOpen }) => {

     return (
        <MapView.Marker
            onPress={() => {
                setSelectedProfile(item)
                setOpen(true)
            }}
            coordinate={{
                latitude: parseFloat(item?.latitude), 
                longitude: parseFloat(item?.longitude)}}>
                <View style={{ flexDirection:'row'}}>
                    <View style={{borderRadius: 10, marginRight:5, padding:4, backgroundColor:'#49A809'}}>
                        <Text style={{fontSize: 14, fontWeight: '600'}}>{item.first_name}</Text>
                        <Text style={{fontSize: 13, fontWeight: '600'}}>{item.last_name}</Text>
                    </View>
                    <Icon 
                        name='map-marker-alt' 
                        size={30}
                        color={'#49A809'}/>

                </View>

        </MapView.Marker>
     )
}


const ProfileCardView = ({ inspector, area, department }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={styles.ProfileCardView}>
            <View style={styles.containerProfile}>
                <View style={{flex:1}}>
                    <ProfileAuthor
                        style={{ flex: 1 }}
                        image={{uri:`${HOST_URL}${inspector?.profile_image}`}}
                        name={`${inspector?.first_name} ${inspector?.last_name}`}
                        description={`(${department?.name})`}
                        styleDescription={{color: 'black'}}
                        />
                    <TouchableOpacity style={[           
                            styles.viewIcon1,
                            {
                            backgroundColor: parseHexTransparency(
                                colors.primaryLight,
                                50
                            ),
                                position:"absolute",
                                top: 10,
                                right: 80
                        }]} 
                        onPress={()=>{
                            navigation.navigate("Messages",{ selectedUser: inspector, 
                            selectedUser_image: `${HOST_URL}${inspector.profile_image}`, 
                            profile: inspector });
                        }}>
                        <Icon name="facebook-messenger" size={24} solid style={{color: colors.primary }}/>    
                    </TouchableOpacity> 


                    <TouchableOpacity style={[{
                    
                        position:"absolute",
                        top: 15,
                        right: 0,
                        zIndex:1000
                        }]} >
                        <Button style={{
                            width:70,
                            height:30,
                            paddingHorizontal:0
                        }}
                            onPress={()=>{
                                navigation.navigate("CreateTask",{ 
                                    profile: inspector, 
                                    area: area, 
                                    department: department });
                            }}>
                            <Text
                                style={{
                                    fontSize:11,
                                    color:"white"
                                }}>Assign task</Text></Button>    
                    </TouchableOpacity>   

                </View>

                            
                <View style={{flexDirection: "row", flex:1}}>
                        <TouchableOpacity
                            onPress={()=>{
                                Linking.openURL(`mailto:${inspector?.email}`)
                            }} style={[styles.header]}>
                        <View
                            style={[
                                styles.viewIcon,
                                {
                                    backgroundColor: parseHexTransparency(
                                        colors.primaryLight,
                                        30
                                    ),
                                },
                            ]}>
                                
                            <Icon
                                name={"mail-bulk"}
                                size={12}
                                style={{ color: colors.primary }}
                                solid
                            />
                            
                        </View>

                        <View>
                            <Text>Email: </Text>
                            <Text footnote>{inspector?.email}</Text>
                        </View>
                    </TouchableOpacity>

                   
                    <TouchableOpacity
                        onPress={()=>{
                            Linking.openURL(`tel:${COUNTRY_CODE} ${inspector?.phone_number}`);

                        }} style={[styles.header, {marginLeft: 20}]}>
                        <View
                            style={[
                                styles.viewIcon,
                                {
                                    backgroundColor: parseHexTransparency(
                                        colors.primaryLight,
                                        30
                                    ),
                                },
                            ]}>
                                
                            <Icon
                                name={"phone"}
                                size={12}
                                style={{ color: colors.primary }}
                                solid
                            />
                            
                        </View>

                        <View>
                            <Text>Phone number: </Text>
                            <Text footnote>{inspector?.phone_number}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


export default function PreviewMap({ navigation, route }) {

    const [ selectedProfile, setSelectedProfile ] = useState()
    const [ open, setOpen ] = useState(false)

    const latitude = useSelector(state =>   state.auth.user.latitude)
    const longitude = useSelector(state =>   state.auth.user.longitude)


    /**
     * @description Called when image item is selected or activated
     */

    const area = route?.params?.area
    const inspectors =  route?.params?.users || []
    const department = route?.params?.department



    const defaultProfile = () => {
        for(let i=0; i<inspectors.length; i++){
            if(inspectors[i].online){
                setSelectedProfile(inspectors[i])
                setOpen(true)
                return
            }
        }
    }

    useEffect(()=>{
        defaultProfile()
    },[inspectors])



    return (
        <View>
            <TouchableOpacity 
                style={styles.container}  
                onPress={() => {
                    navigation.goBack();
                }}>
                <Icon name="times" size={20}  color={"white"}/>
            </TouchableOpacity>


            <MapView style={styles.map}
                showsBuildings={true}
                showsIndoors={true}
                scrollEnabled={true}
                pitchEnabled={true}
                customMapStyle={darkStyle}
                initialRegion={{
                    latitude: parseFloat(selectedProfile?.latitude? selectedProfile.latitude: area?.latitude),
                    longitude: parseFloat(selectedProfile?.longitude?selectedProfile.longitude: area?.longitude),
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                }}>
                {latitude&&
                    <MapView.Marker
                        coordinate={{
                            latitude: parseFloat(latitude), 
                            longitude: parseFloat(longitude)}}>
                            <View style={{ flexDirection:'row'}}>

                                <Icon 
                                    name='map-marker-alt' 
                                    size={30}
                                    color={'#EF3612'}/>

                            </View>

                    </MapView.Marker>
                }
                {inspectors.map((item, index)=>(
                    item.longitude && item.online && 
                    <MapMarkerView 
                        item={item} 
                        key={index} 
                        setSelectedProfile={setSelectedProfile}
                        setOpen={setOpen}
                        currentUser={{latitude,longitude}}/>
                ))}
            </MapView>
            { open && <ProfileCardView inspector={selectedProfile} area={area} department={department}/>}

        </View>
    );
}
