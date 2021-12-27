import Text from "@components/Text";
import { useTheme } from "@config";
import { parseHexTransparency } from "@utils";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";

const NUMBER_LINES = [...new Array(8)];

const dataInit = [
  {
    title: "Order Placed",
    description: "28 Apr 2020 09:00",
    isDone: true,
  },
  {
    title: "Order Accepted",
    description: "29 Apr 2020 09:00",
    isDone: false,
  },
  {
    title: "Order Shipping",
    description: "30 Apr 2020 09:00",
    isDone: false,
  },
  {
    title: "Completed",
    description: "1 May 2020 09:00",
    isDone: false,
  },
];
function TimeLine({ style, data }) {
  const { colors } = useTheme();

  return (
    <View style={style}>
      {data.map((item, index) => (
        <View key={index.toString()} style={{ flexDirection: "row" }}>
          <View
            style={{
              paddingRight: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: item.isDone
                  ? parseHexTransparency(colors.primary, 30)
                  : parseHexTransparency(colors.border, 30),
                justifyContent: "center",
                alignItems: "center",
                padding: 4,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: item.isDone
                    ? colors.primary
                    : colors.background,
                }}
              />
            </View>
            {index != data.length - 1 &&
              NUMBER_LINES.map((item, index) => (
                <View
                  key={index.toString()}
                  style={{
                    width: 0.5,
                    height: 4,
                    backgroundColor: colors.border,
                    marginBottom: 2,
                  }}
                />
              ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text caption1>{item.title}</Text>
            <Text caption2 grayColor>
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

TimeLine.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
};

TimeLine.defaultProps = {
  style: {},
  data: [],
};
export default TimeLine;
