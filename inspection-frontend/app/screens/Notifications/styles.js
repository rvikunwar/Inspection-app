import { StyleSheet } from "react-native";
import { BaseColor } from "@config";


export default StyleSheet.create({
    notification:{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth:1,
        borderBottomColor: "rgba(0,0,0,0.07)",
        paddingHorizontal: 14
    },
    seenEffect: {
        backgroundColor: "rgba(0,0,0,0.07)"
    },  
    notificationSection: {
        flex:1,
        alignItems: "flex-start",
    },
    textInput: {
        height: 46,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 5,
        padding: 10,
        width: "100%",
    },
    contain: {
        flex: 1,
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
    },
    thumb: {
        borderWidth: 1,
        borderColor: BaseColor.whiteColor,
        width: 60,
        height: 60,
        borderRadius: 100,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: BaseColor.whiteColor,
        marginRight: 8
      },
    text: {
        flexDirection:"row"
    }
});
