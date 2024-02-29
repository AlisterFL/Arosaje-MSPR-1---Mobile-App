import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import DatePicker, { getToday } from 'react-native-modern-datepicker';


export default function ProfileScreen({navigation}) {
    const [selectedDate, setSelectedDate] = useState('');
    const currentDate = getToday();

  return (
    <View>
        <DatePicker
            onSelectedChange={date => setSelectedDate(date)}
            mode="calendar"
            minimumDate={currentDate}
            options={{
                selectedTextColor: '#fff',
                mainColor: '#A3D288',
              }}
          />
        
        <Text>Date sélectionnée : {selectedDate}</Text>
        <Text>Date sélectionnée : {currentDate}</Text>


    </View>
  )
}