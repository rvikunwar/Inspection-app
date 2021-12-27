import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
    content: {
        height: 160,
        width: "100%",
        borderRadius: 8,
        marginBottom: 0,
        borderWidth: StyleSheet.hairlineWidth,
        ...Platform.select({
            android: {
                elevation: 1,
            },
            default: {
                shadowColor: "rgba(0,0,0, .2)",
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 3,
                shadowRadius: 3,
            },
        }),
        justifyContent: "flex-end",
    },
    container: {
        width: "50%",
    },
    map: {
        borderRadius: 8,
        flex: 1,
        backgroundColor: "rgba(52, 52, 52, 0.8)",

      },
    viewIcon: {
        position: "absolute",
        left: 8,
        top: 8,
        borderRadius: 15,
        width: 29,
        height: 29,
        justifyContent: "center",
        alignItems: "center",
    },
    viewText: {
        borderRadius: 8,
        marginHorizontal: 10,
        marginBottom: 0,
        paddingTop:5,
        padding: 0,
    },

    loading: {
        height: "100%",
        width: "100%",
        borderRadius: 8,
    },
    containerLoading: {
        height: 160,
        width: "50%",
    }
});
