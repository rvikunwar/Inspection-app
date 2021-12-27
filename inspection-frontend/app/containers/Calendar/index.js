import React, { useState, useEffect, useMemo, forwardRef } from "react";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Text, Icon } from "@components";
import styles from "./styles";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import { BaseColor, useTheme, DefaultFont, useFont } from "@config";
import { useTranslation } from "react-i18next";
import moment from "moment";
const formatDate = (date) => moment(date).format("MMM DD");

const CalendarPicker = (props, ref) => {
    const { style, onCancel = () => {}, onChange = () => {}, renderDate = null, openVal ,day} = props;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
	const [month, setMonth] = useState(moment(day).format("YYYY-MM-DD"));
	const [ endDate, setEndDate]= useState()
	useEffect(() => {
		if(ref?.current) {
			ref.current.open = open;
		}

	}, []);

	const open = () => {
		setModalVisible(openVal);
	}
    useEffect(() => {
        let markedIn = {};
        let d = new Date(day)
        let date = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
        setMonth(d)
        markedIn[date] = {
            selected: true,
            marked: true,
            selectedColor: colors.primary,
        };
        setMarkedDates(markedIn)
        setEndDate(date)
      
    }, [day]);

  

    const onDayPress = (day) => {
        let markedIn = {};
        let newEndDate = day.dateString;
        setMonth(newEndDate)

        markedIn[newEndDate] = {
            selected: true,
            marked: true,
            selectedColor: colors.primary,
        };
        setEndDate(newEndDate);
        setMarkedDates(markedIn)
    };


    return (
        <View style={[styles.contentPickDate, style]}>
            <Modal
                isVisible={modalVisible}
                backdropColor="rgba(0, 0, 0, 0.5)"
                backdropOpacity={1}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <View
                    style={[
                        styles.contentCalendar,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <Calendar
                        style={{
                            borderRadius: 8,
                            backgroundColor: colors.card,
                        }}
                        renderArrow={(direction) => {
                            return (
                                <Icon
                                    name={
                                        direction == "left"
                                            ? "angle-left"
                                            : "angle-right"
                                    }
                                    size={14}
                                    color={colors.primary}
                                    enableRTL={true}
                                />
                            );
                        }}
                        markedDates={markedDates}
                        // current={selected}
                        // minDate={minDate}
                        // maxDate={maxDate}
                        // onDayPress={(day) => setDaySelected(day.dateString)}
                        // markedDates={markedDates}
                        onDayPress={onDayPress}
                        monthFormat={"dd-MM-yyyy"}
                        onMonthChange={(month) => {
                            console.log("month changed", month);
                            setMonth(month.dateString);
                        }}
                        renderHeader={(date) => {
                            return (
                                <View style={{ alignItems: "center" }}>
                                    <Text title3 semibold>
                                        {moment(month).format("DD MMM YYYY")}
                                    </Text>
                                </View>
                            );
                        }}
                        theme={{
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.primary,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: "#ffffff",
                            todayTextColor: colors.primary,
                            dayTextColor: colors.text,
                            textDisabledColor: BaseColor.grayColor,
                            dotColor: colors.primary,
                            selectedDotColor: "#ffffff",
                            arrowColor: colors.primary,
                            monthTextColor: colors.text,
                            // textDayFontFamily: DefaultFont,
                            // textMonthFontFamily: DefaultFont,
                            // textDayHeaderFontFamily: DefaultFont,
                            textMonthFontWeight: "bold",
                            textDayFontSize: 14,
                            // textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                        }}
                    />
                    <View style={styles.contentActionCalendar}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                onCancel();
                            }}
                        >
                            <Text body1>{t("cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                onChange(endDate);
                            }}
                        >
                            <Text body1 primaryColor>
                                {t("done")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {renderDate ? (
                renderDate(open)
            ) : (
                <TouchableOpacity
                style={styles.itemPick}
                onPress={() =>  setModalVisible(!modalVisible)}>
                <Text headline semibold>
                    {endDate}
                </Text>
            </TouchableOpacity>
            )}
        </View>
    );
}

// DatePicker.propTypes = {
//     style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
//     onCancel: PropTypes.func,
//     onChange: PropTypes.func,
// };

// DatePicker.defaultProps = {
//     style: {},
//     onCancel: () => {},
//     onChange: () => {},
// };

export default forwardRef(CalendarPicker);