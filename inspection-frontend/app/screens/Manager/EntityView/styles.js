import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 0,
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
        width: 30,
        height: 30,
        marginRight: 0,
        justifyContent: "center",
        alignItems: "center",
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
