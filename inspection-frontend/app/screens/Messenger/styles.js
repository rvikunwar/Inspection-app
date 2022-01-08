import { StyleSheet } from "react-native";
import { BaseColor, Typography, FontWeight } from "@config";


export default StyleSheet.create({
    contain: {
        flexDirection: "row",
        alignItems:'center',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        borderBottomWidth: 1
      },
      contentLeft: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      thumb: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginRight: 8,
      },
      contentRight: {
        justifyContent: "center",
        alignItems: "flex-end",
      },
      viewIcon: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
      },
      default: {
        flexDirection: "row",
        marginTop:-25
    },
    primary: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    textPrimary: StyleSheet.flatten([
        Typography.caption1,
        { color: BaseColor.whiteColor },
    ]),
    outline: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },


});
