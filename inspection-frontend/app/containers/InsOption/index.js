import Icon from "@components/Icon";
import Text from "@components/Text";
import { ProfileAuthor } from '@components'
import Button from "@components/Button";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import styles from "./styles";
import { HOST_URL } from '@env'


const InspectorOption = (props) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const cardColor = colors.card;
    const {
        options = [],
        value = {},
        onPress,
        isMulti = false,
        ...attrs
    } = props;
    const [optionCustom, setOptionCustom] = useState(options);

    useEffect(() => {
        setOptionCustom(options)
    }, [options])

    useEffect(() => {
        if (isMulti) {
            const optionsMulti = options.map((item) => ({
                ...item,
                checked: value?.some?.(
                    (element) => element.value == item.value
                ),
            }));
            setOptionCustom(optionsMulti);
        } else {
            const optionsSingle = options.map((item) => ({
                ...item,
                checked: item.value == value?.value,
            }));
            setOptionCustom(optionsSingle);
        }
    }, []);

    const onApply = () => {
        onPress(optionCustom.filter((item) => item.checked));
    }

    const onSelect = (itemChose) => {
        if (isMulti) {
            const optionsMulti = optionCustom.map((item) => ({
                ...item,
                checked:
                    item.value == itemChose.value
                        ? !itemChose.checked
                        : item.checked,
            }));
            setOptionCustom(optionsMulti);
        } else {
            // const optionsSingle = optionCustom.map((item) => ({
            //     ...item,
            //     checked:
            //         item.value == itemChose.value
            //             ? !itemChose.checked
            //             : false,
            // }));
            // setOptionCustom(optionsSingle);
            onPress(itemChose);
        }
    };

    return (
        <Modal swipeDirection={["down"]} style={styles.bottomModal} {...attrs}>
            <View
                style={[
                    styles.contentFilterBottom,
                    { backgroundColor: cardColor },
                ]}
            >
                <View style={styles.contentSwipeDown}>
                    <View style={styles.lineSwipeDown} />
                </View>
                {optionCustom.map((item, index) => (
                    <TouchableOpacity
                        style={[
                            styles.contentActionModalBottom,
                            {
                                borderBottomColor: colors.border,
                                borderBottomWidth:
                                    index == options.length - 1
                                        ? 0
                                        : StyleSheet.hairlineWidth,
                            },
                        ]}
                        key={index}
                        onPress={() => onSelect(item)}
                    >
                        
                        <ProfileAuthor
                            style={{flex:1, paddingVertical:0}}
                            image={{uri:`${HOST_URL}${item.profile_image}`}}
                            name={`${item.first_name} ${item.last_name}`}
                        />
                    </TouchableOpacity>
                ))}
                {isMulti && (
                    <Button
                        full
                        style={{ marginTop: 10, marginBottom: 20 }}
                        onPress={onApply}
                    >
                        {t("apply")}
                    </Button>
                )}
            </View>
        </Modal>
    );
};

InspectorOption.propTypes = {
    options: PropTypes.array,
    onPress: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isMulti: PropTypes.bool,
};

export default InspectorOption;
