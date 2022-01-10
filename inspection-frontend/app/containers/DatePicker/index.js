import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function DatePicker({new1, show, day, onChangev1,  setShow}) {
    const [date, setDate] = useState(new1 ? new Date:new Date(Date.parse(`${day.replace(/-/g,"/")} 11:23:00`)));
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      onChangev1(currentDate)
    };
     
  
    return (
      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    )
}
