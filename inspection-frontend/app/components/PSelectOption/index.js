import { Icon, Tag, ModalOption } from "@components";
import { useTheme } from "@config";
import { EOptions } from "@data";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";


const PSelectOption = ({ title = "Type", options = EOptions, value = [], onPress = () => {} }) => {
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [option, setOption] = useState({});

    return (
        <Fragment>
            <Tag
                iconRight
                style={{ marginHorizontal: 5 }}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                {`${title}${value.length > 0 ? ` (${value.length})  ` : " "}`}
                <Icon name="chevron-down" color={colors.text} size={10} />
            </Tag>
            <ModalOption
                isMulti={true}
                value={value}
                options={options}
                isVisible={modalVisible}
                onSwipeComplete={() => {
                    setModalVisible(false);
                }}
                onPress={(option) => {
                    onPress(option);
                    setModalVisible(false);
                }}
            />
        </Fragment>
    );
};

export default PSelectOption;
