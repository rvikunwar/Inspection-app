import Text from "@components/Text";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import styles from "./styles";


export default function Tag({value}) {

  if(value>0){
    return (
        <TouchableOpacity
          style={StyleSheet.flatten([
            styles.default,[
              styles.outline,
              {
                  elevation:5,
                borderColor: 'rgba(0,0,0,0.2)',
                backgroundColor:'#5DADE2'
              },
            ],
          ])}
          activeOpacity={0.9}
        >
          <Text
            style={{color:"rgba(0,0,0,1)"}}
            numberOfLines={1}>
            {value}
          </Text>
        </TouchableOpacity>
      );
  } else return null;

}
