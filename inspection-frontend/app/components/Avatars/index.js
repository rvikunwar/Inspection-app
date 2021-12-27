import React, { useMemo } from "react";
import { View } from "react-native";
import styles from "./styles";
import Image from "@components/Image";
import Text from "@components/Text";
import { useTheme } from "@config";
import { HOST_URL } from '@env'


const index = (props) => {
    const { styleThumb, member, assigne} = props

    const { colors } = useTheme(); 


    return (
        <View
            style={{
                flexDirection: "row",
                marginRight: 7,
                alignItems:"center"
            }}
        >
            <Image
                key={index}
                source={{uri:`${HOST_URL}${member.profile_image}`}}
                style={[
                    styles.thumb,
                    
                ]}/>

                
                <View style={{ flex: 1, marginLeft:10 }}>
                    <Text subhead>
                       {member.first_name} {member.last_name}
                    </Text>
                    <View>
                     
                        {assigne ?
                            <Text caption1 light>
                                ({assigne})
                            </Text>:    
                            <Text>
                                ({member.position})
                            </Text>
                        }
                    </View>
                </View>
        </View>
    );
};

export default index;
