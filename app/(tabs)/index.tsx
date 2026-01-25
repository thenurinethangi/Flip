import { AppIcon } from '@/components/ui/icon-symbol';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from "expo-checkbox";
import { useState } from 'react';
import AddTaskModal from '@/components/AddTaskModal';
import DatePickerModal from '@/components/DatePickerModal';
import CustomCalendarModal from '@/components/DatePickerModal';

export default function HomeScreen() {

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("None");
  const [selectedReminder, setSelectedReminder] = useState("None");
  const [selectedRepeat, setSelectedRepeat] = useState("None");
  const [selectedPriority, setSelectedPriority] = useState("No Priority");
  const [selectedTaskType, setSelectedTaskType] = useState("None");
  const [tags, setTags] = useState("");

  function addNewTask() {

  }

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 px-4'>

        <TouchableOpacity
          onPress={() => {
            setShowAdd(true)
            console.log("FAB PRESSED");
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
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            zIndex: 999,
            elevation: 20,
          }}
        >
          <AppIcon name="Plus" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <View className='mt-[17px] flex-row justify-between items-center'>
          <View className='flex-row items-center gap-x-4'>
            <AppIcon name="Menu" color="#222" />
            <Text className='text-[20.5px] font-semibold'>Today</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        <ScrollView className='mt-5 px-0.5 mb-5'>

          {/* today tasks */}
          <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 shadow-lg shadow-black/0.05 flex-row items-center justify-between mb-2'>
            <View className='flex-row items-center gap-x-3'>
              <View>
                <Checkbox
                  value={false}
                  // onValueChange={setChecked}
                  color={false ? "#4772FA" : "#B8BFC8"}
                  style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                />
              </View>
              <View>
                <Text className='text-[15.5px]'>Learn React Native</Text>
              </View>
            </View>
            <View>
              <View>
                <Text className='text-primary text-[13px]'>Today</Text>
              </View>
              <View></View>
            </View>
          </View>

          <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 shadow-lg shadow-black/0.05 flex-row items-center justify-between mb-2'>
            <View className='flex-row items-center gap-x-3'>
              <View>
                <Checkbox
                  value={false}
                  // onValueChange={setChecked}
                  color={false ? "#4772FA" : "#B8BFC8"}
                  style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                />
              </View>
              <View>
                <Text className='text-[15.5px]'>Learn React Native</Text>
              </View>
            </View>
            <View>
              <View>
                <Text className='text-primary text-[13px]'>Today</Text>
              </View>
              <View></View>
            </View>
          </View>

          {/* overdue */}
          <View className='bg-white py-4 shadow-lg shadow-black/0.05 mb-4 rounded-[10px] mt-2'>
            <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
              <View className='flex-row items-center gap-x-3'>
                <Text className='text-[16px] font-medium text-[#222]'>Overdue</Text>
                <Text className='text-[14px] text-gray-400'>3</Text>
              </View>
              <View className='flex-row items-center gap-x-1'>
                <Text className='text-red-500 text-[13.5px]'>Postpone</Text>
                <AppIcon name="chevronRight" color='#9ca3af' size={17} />
              </View>
            </View>

            <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-x-3'>
                <View>
                  <Checkbox
                    value={false}
                    // onValueChange={setChecked}
                    color={false ? "#4772FA" : "#B8BFC8"}
                    style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                  />
                </View>
                <View>
                  <Text className='text-[15.5px]'>Learn React Native</Text>
                </View>
              </View>
              <View>
                <View>
                  <Text className='text-primary text-[13px]'>Today</Text>
                </View>
                <View></View>
              </View>
            </View>

            <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-x-3'>
                <View>
                  <Checkbox
                    value={false}
                    // onValueChange={setChecked}
                    color={false ? "#4772FA" : "#B8BFC8"}
                    style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                  />
                </View>
                <View>
                  <Text className='text-[15.5px]'>Learn React Native</Text>
                </View>
              </View>
              <View>
                <View>
                  <Text className='text-primary text-[13px]'>Today</Text>
                </View>
                <View></View>
              </View>
            </View>

          </View>

          {/* completed */}
          <View className='bg-white py-4 shadow-lg shadow-black/0.05 mb-5 rounded-[10px]'>
            <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
              <View className='flex-row items-center gap-x-3'>
                <Text className='text-[16px] font-medium text-gray-400'>Completed</Text>
                <Text className='text-[14px] text-gray-400'>3</Text>
              </View>
              <View className='flex-row items-center gap-x-1'>
                <AppIcon name="chevronRight" color='#9ca3af' size={17} />
              </View>
            </View>

            <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-x-3'>
                <View>
                  <Checkbox
                    value={true}
                    // onValueChange={setChecked}
                    color={true ? "#B8BFC8" : "#B8BFC8"}
                    style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                  />
                </View>
                <View>
                  <Text className='text-[15.5px] text-gray-400 line-through'>Learn React Native</Text>
                </View>
              </View>
              <View>
                <View>
                  <Text className='text-gray-400 text-[13px] opacity-90'>Today</Text>
                </View>
                <View></View>
              </View>
            </View>

            <View className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-x-3'>
                <View>
                  <Checkbox
                    value={true}
                    // onValueChange={setChecked}
                    color={true ? "#B8BFC8" : "#B8BFC8"}
                    style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                  />
                </View>
                <View>
                  <Text className='text-[15.5px] text-gray-400 line-through'>Learn React Native</Text>
                </View>
              </View>
              <View>
                <View>
                  <Text className='text-gray-400 text-[13px] opacity-90'>Today</Text>
                </View>
                <View></View>
              </View>
            </View>

          </View>

        </ScrollView>

      </SafeAreaView>

      <AddTaskModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onOpenCalendar={() => setShowDate(true)}
      />

      <CustomCalendarModal
        visible={showDate}
        onClose={() => setShowDate(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
