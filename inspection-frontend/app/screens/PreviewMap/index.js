import { 
    Icon, 
    Image, 
    TextInput, 
    Text, 
    ProfileAuthor ,
    Button
} from "@components";
import { Images, BaseColor, useTheme } from "@config";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import MapView from 'react-native-maps';
import { retroMapStyle } from './retroStyle'
import { darkStyle } from './darkStyle'
import { HOST_URL } from "@env"
import { parseHexTransparency } from "@utils";
import { useNavigation } from "@react-navigation/native";



const imagesInit = [
    { id: "1", image: Images.location1, selected: true },
    { id: "2", image: Images.location2 },
    { id: "3", image: Images.location3 },
    { id: "4", image: Images.location4 },
    { id: "5", image: Images.location5 },
    { id: "6", image: Images.location6 },
    { id: "7", image: Images.location7 },
];


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
                    <View style={[styles.header]}>
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
                    </View>

                    <View style={[styles.header, {marginLeft: 20}]}>
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
                    </View>
                </View>
            </View>
        </View>
    )
}


export default function PreviewMap({ navigation, route }) {
    const imagesParam = route?.params?.images ?? imagesInit;
    let flatListRef = null;
    let swiperRef = null;

    const [images, setImages] = useState(imagesParam);
    const [indexSelected, setIndexSelected] = useState(0);
    const [ selectedProfile, setSelectedProfile ] = useState()
    const [ open, setOpen ] = useState(false)


    const onSelect = (indexSelected) => {
        setIndexSelected(indexSelected);
        setImages(
            images.map((item, index) => {
                if (index == indexSelected) {
                    return {
                    ...item,
                    selected: true,
                    };
                } else {
                    return {
                    ...item,
                    selected: false,
                    };
                }
            })
        );
        flatListRef.scrollToIndex({
            animated: true,
            index: indexSelected,
        });
    };

    /**
     * @description Called when image item is selected or activated
     */
    const onTouchImage = (touched) => {
        if (touched == indexSelected) return;
        swiperRef.scrollBy(touched - indexSelected, false);
    };

    const area = route?.params?.area
    const inspectors =  route?.params?.users || []
    const department = route?.params?.department


    //FILTERING   
    const [keyword, setKeyword] = useState("");

    const filterCategory = (text) => {
        setKeyword(text);
        // if (text) {
        //     setAreas(
        //         areasv1.filter(
        //             (item) =>
        //                 haveChildren(item.name, text)
        //         )
        //     );
        // } else {
        //     setAreas(areas);
        // }
    };



    return (
        <View>
            {/* <TouchableOpacity 
                style={styles.container}  
                onPress={() => {
                    navigation.goBack();
                }}>
                <Icon name="times" size={20}  color={"gray"}/>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={{
                    zIndex:10000,
                    width:'100%',
                    paddingHorizontal:30,
                    marginBottom:10,
                    position:'absolute',
                    top:50,
                }}>
                <TextInput
                    onChangeText={filterCategory}
                    style={{elevation:3}}
                    placeholder={"location, name"}
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

            <MapView style={styles.map}
                showsBuildings={true}
                showsIndoors={true}
                scrollEnabled={true}
                pitchEnabled={true}
                customMapStyle={darkStyle}
                initialRegion={{
                    latitude: parseFloat(area?.latitude),
                    longitude: parseFloat(area?.longitude),
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                }}>
                {inspectors.map((item, index)=>(
                    item.longitude && item.online && 
                    <MapMarkerView 
                        item={item} 
                        key={index} 
                        setSelectedProfile={setSelectedProfile}
                        setOpen={setOpen}/>
                ))}
            </MapView>
            { open && <ProfileCardView inspector={selectedProfile} area={area} department={department}/>}

        </View>
    );
}
