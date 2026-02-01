import { AppIcon } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {

  const todayStr = new Date().toLocaleDateString("en-CA");
  const date = new Date().toLocaleDateString("en-CA");

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1'>

        <TouchableOpacity
          onPress={() => {
            setShowAdd(true);
          }}
          style={{
            position: 'absolute',
            bottom: 21,
            right: 21,
            width: 57,
            height: 57,
            borderRadius: 32,
            backgroundColor: '#4772FA',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#4772FA',
            shadowOpacity: 0.3,
            shadowRadius: 16,
            zIndex: 999,
            elevation: 20,
          }}
        >
          <AppIcon name="Plus" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold'>January</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        {/* Calendar */}
        <CalendarProvider
          date={date || todayStr}
          style={{ backgroundColor: '#F5F6F8' }}
        // onDateChanged={(d) => choooseDate(d)}
        >
          <ExpandableCalendar
            initialPosition="collapsed"
            firstDay={1}
            hideArrows
            renderHeader={() => null}
            style={{
              backgroundColor: '#F5F6F8',
              borderWidth: 0,
              borderRadius: 0,
              elevation: 0,
              shadowColor: 'transparent',
              shadowOpacity: 0,
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
            }}
            markedDates={{
              [date]: {
                selected: true,
                selectedColor: '#4772FA',
                selectedTextColor: '#FFFFFF',
              },
            }}
            calendarStyle={{
              backgroundColor: '#F5F6F8',
              borderWidth: 0,
              borderRadius: 0,
              shadowColor: 'transparent',
              shadowOpacity: 0,
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
              weekContainerStyle: {
                backgroundColor: '#F5F6F8',
              },
              elevation: 0,
              shadowColor: 'transparent',
            }}
            theme={{
              backgroundColor: '#F5F6F8',
              calendarBackground: '#F5F6F8',
              textDayFontSize: 14,
              textSectionTitleColor: '#6E7583',
              textDayHeaderFontSize: 12.3,
              textDayHeaderFontWeight: '500',
            }}
          />
        </CalendarProvider>

      </SafeAreaView>
    </>
  );
}
