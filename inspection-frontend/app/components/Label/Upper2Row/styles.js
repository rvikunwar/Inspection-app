import { StyleSheet } from "react-native";
import * as Utils from "@utils";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingBottom: 10
        // width: "100%",
        // height: Utils.scaleWithPixel(50),
    },
    text: {
        textTransform: "uppercase"
    },
    textCenter: {
        textAlign: "center",
    },
    textMarginCenter: {
        marginVertical: 3,
    },
});
