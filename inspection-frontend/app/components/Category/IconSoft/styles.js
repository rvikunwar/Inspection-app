import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    textAlign: "center",
    alignItems: "center",
    // minWidth: 80,
  },
  iconContent: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    width: 60,
  },
  isRound: {
    borderRadius: 20,
    width: 50,
    height: 50,
  }
});
