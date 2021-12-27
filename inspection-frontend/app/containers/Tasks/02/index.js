import ProgressCircle from "@components/Progress/Circle";
import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Avatars from '../Avatars/index'


const Project02 = ({
    title = "",
    style = {},
    onPress = () => {},
    description = "",
    progress = 0,
    disabled = false,
    days = "",
    members = [],
    inspectorStat,
    latitude,
    longitude
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
        >
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}
            >
                <View style={styles.viewProgress}>
                    <View style={styles.viewLeft}>
                        <Text headline semibold>{title}</Text>
                  
                        <Avatars
                            styleThumb={{marginTop:10, width: 30, height: 30 }}
                            users={members}
                            limit={5}
                        />
                    </View>
                    <View style={styles.viewRight}>
                        <ProgressCircle
                            style={{ marginBottom: 2, }}
                            percent={inspectorStat.inspector_count===0?0:parseInt((inspectorStat.online_inspector/inspectorStat.inspector_count)*100)}
                        />
                        
                        <Text footnote light>
                            {inspectorStat?.inspector_count} inspectors
                        </Text>

                        <Text footnote light>
                            {inspectorStat?.online_inspector} inspector online
                        </Text>

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

Project02.propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    subTitle: PropTypes.string,
    description: PropTypes.string,
    progress: PropTypes.number,
    days: PropTypes.string,
    members: PropTypes.array,
};

export default Project02;
