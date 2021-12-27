import { Icon, Image, Text } from "@components";
import { Images, BaseColor, useTheme } from "@config";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import ProgressBar from "@components/Progress/Bar";

const FileAttachment = ({
    icon = "",
    style = {},
    name = "",
    size = "",
    onPress = () => {},
    percent = "0",
    backgroundIcon = "",
}) => {
    const { colors } = useTheme();
    const {percentInt, isNormal, isLoading, isCompleted} = useMemo(() => {
        let data = {
            isNormal: true,
            isLoading: false,
            isCompleted: false,
            percentInt: 0
        }
        try {
            const percentInt = parseInt(percent);
            data.percentInt = percentInt;
            if(percentInt > 0 && percentInt < 100) {
                data.isNormal = false;
                data.isCompleted = false;
                data.isLoading = true;
            } else if(percentInt >= 100) {
                data.isNormal = false;
                data.isCompleted = true;
                data.isLoading = false;
            }
            return data;
        } catch (error) {
            return data;
        }
    }, [percent]);

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.image,
                    { backgroundColor: backgroundIcon || colors.primaryLight },
                ]}
            >
                <Icon
                    name={icon}
                    size={18}
                    style={{ color: BaseColor.whiteColor }}
                    solid
                />
            </View>
            <View
                style={{
                    paddingLeft: 15,
                    flex: 1,
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        // paddingRight: 10,
                        // paddingTop: 10
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text>{name}</Text>
                        <Text overline light>
                            {size}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{ paddingHorizontal: 10, zIndex:1000, elevation:3 }}
                        onPress={onPress}
                    >
                        {isLoading && (
                            <Icon
                                name="times-circle"
                                size={14}
                                solid
                                color={BaseColor.kashmir}
                            />
                        )}
                        {isCompleted && (
                            <Icon
                                name="times-circle"
                                size={14}
                                solid
                                color={BaseColor.greenColor}
                            />
                        )}
                        {isNormal && (
                            <Icon
                                name="times-circle"
                                size={14}
                                solid
                                color={BaseColor.kashmir}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {!isNormal && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <ProgressBar
                            style={{ flex: 1, paddingRight: 20 }}
                            percent={percentInt}
                            color={BaseColor.blueColor}
                        />
                        <Text footnote light style={{ paddingHorizontal: 10 }}>
                            {`${percentInt}%`}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

FileAttachment.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    icon: PropTypes.string,
    name: PropTypes.string,
    percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onPress: PropTypes.func,
    backgroundIcon: PropTypes.string
};

export default FileAttachment;
