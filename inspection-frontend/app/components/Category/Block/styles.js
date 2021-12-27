import { StyleSheet, Dimensions } from "react-native";
import { BaseColor } from "@config";
import * as Utils from "@utils";

export default StyleSheet.create({
    contain: {
        flexDirection: "row",
        height: Utils.scaleWithPixel(140),
        marginBottom: 30,
        position:"relative",
        // opacity: 0.5
    },
    contentIcon: {
        position: "absolute",
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 165,
        flex: 1,
      },
    image: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: "rgba(52, 52, 52, 0.8)",
        height: "100%"
    }
});
