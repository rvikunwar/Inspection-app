import { Icon, Image, Text } from "@components";
import { Images, useTheme, BaseColor } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import styles from "./styles";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
} from "react-native-chart-kit";
import { parseHexTransparency } from "@utils";
const chartConfig = {
    
};

const ChartBarChart = ({ style = {}, data = {} }) => {
    const { colors } = useTheme();
    return (
        <BarChart
            data={data}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                // // barPercentage: 1,
                propsForBackgroundLines: {
                    strokeWidth: 0.5,
                    stroke: colors.border,
                    x: 50,
                },
                propsForLabels: {
                    color: "red"
                },
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.text,
                barPercentage: 0.8,
                // useShadowColorFromDataset: true, // optional
            }}
            style={{
                marginHorizontal: 0,
                marginVertical: 8,
                // borderRadius: 16,
            }}
            yAxisLabel="$"
            showBarTops={false}
            showValuesOnTopOfBars={false}
            withVerticalLabels
            withInnerLines
            fromZero
            // horizontalLabelRotation={20}
        />
    );
};

ChartBarChart.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    label: PropTypes.string,
    value: PropTypes.string,
    onPress: PropTypes.func,
};

export default ChartBarChart;
