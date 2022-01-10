import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    alignItems: "center",
    padding: 20,
    width: "100%"
  },
  container: {
    width:50, 
    height:40, 
    position:"absolute", 
    top:40, 
    zIndex:100000, 
    right:20
  },
  ProfileCardView: {
    width:'100%', 
    position: "absolute", 
    bottom: 100
  },
  containerProfile: {
    width: '90%', 
    marginLeft:'5%', 
    height: 118, 
    backgroundColor:"rgba(255,255,255,0.6)", 
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:15
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: "100%"
  },
  wrapper: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height+100,
  },
  contentPage: {
    bottom: 0
  },
  lineText: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

specifications: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
},
wrapContent: {
    flexWrap: "wrap",
    flexDirection: "row",
    borderColor: BaseColor.dividerColor,
    marginBottom: 20,
},
headerImageStyle: {
    height: 250,
    width: "100%",
    top: 0,
    alignSelf: "center",
    position: "absolute",
    // zIndex: 999,
    paddingBottom: 20,
},
contain: {
    flexDirection: "row"
},
contentRate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
},

header: {
    flexDirection: "row",
    alignItems: "center",
},
viewIcon: {
    borderRadius: 20,
    width: 20,
    height: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
},
viewIcon1: {
    borderRadius: 40,
    width: 40,
    height: 40,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "center",
},
icon: {
    width: 20,
    height: 20,
},
headerStyle: {
    height: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // zIndex: 200
},
});
