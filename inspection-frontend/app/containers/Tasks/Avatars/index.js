import React, { useMemo } from "react";
import { View } from "react-native";
import styles from "./styles";
import Image from "@components/Image";
import Text from "@components/Text";
import { useTheme } from "@config";
import { HOST_URL } from "@env"


const index = ({ styleThumb, users = [], limit = 0, isShowMore = true }) => {
    const { colors } = useTheme();

    const { remainder, usersLimit } = useMemo(() => {
        const limitInt = parseInt(limit);
        let remainder = 0;
        let usersLimit = users;
        if (limitInt != NaN && limitInt != 0) {
            remainder = users.length - limitInt;
            usersLimit = users.slice(0, limitInt);
        }

        return {
            remainder,
            usersLimit,
        };
    }, [users, limit]);

    return (
        <View
            style={{
                flexDirection: "row",
                marginRight: 7,
            }}
        >
            {usersLimit.map((item, index) => {
                return (
                    <Image
                        key={index}
                        source={{uri:`${HOST_URL}${item.profile_image}`}}
                        style={[
                            styles.thumb,
                            index != 0 ? { marginLeft: -15 } : {},
                            styleThumb,
                        ]}
                    />
                );
            })}
            {Boolean(remainder > 0 && isShowMore) && (
                <View
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: colors.card,
                            marginLeft: -10,
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        styleThumb,
                    ]}
                >
                    <Text footnote regular>
                        +{remainder}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default index;
