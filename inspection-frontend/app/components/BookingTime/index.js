import Text from "@components/Text";
import { useTheme } from "@config";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import styles from "./styles";

const BookingTime = (props) => {
  const { style, checkInTime, checkOutTime, onCancel, onChange } = props;
  const { colors } = useTheme();

  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (date) => {
    hideDateTimePicker();
  };

  return (
    <View
      style={[
        styles.contentPickDate,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      <DateTimePicker
        mode="time"
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
      />
      <TouchableOpacity style={styles.itemPick} onPress={showDateTimePicker}>
        <Text caption1 light style={{ marginBottom: 5 }}>
          Check In
        </Text>
        <Text headline semibold>
          {checkInTime}
        </Text>
      </TouchableOpacity>
      <View style={styles.linePick} />
      <TouchableOpacity
        style={[styles.itemPick, styles.right]}
        onPress={showDateTimePicker}
      >
        <Text caption1 light style={{ marginBottom: 5 }}>
          Check Out
        </Text>
        <Text headline semibold>
          {checkOutTime}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

BookingTime.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  checkInTime: PropTypes.string,
  checkOutTime: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

BookingTime.defaultProps = {
  style: {},
  checkInTime: "09:00",
  checkOutTime: "18:00",
  onCancel: () => {},
  onChange: () => {},
};

export default BookingTime;
