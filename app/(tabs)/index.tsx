import AddTaskModal from '@/components/AddTaskModal';
import CustomCalendarModal from '@/components/DatePickerModal';
import { AppIcon } from '@/components/ui/icon-symbol';
import { add, getPendingTasksByDate } from '@/services/taskService';
import Checkbox from "expo-checkbox";
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const todayStr = new Date().toLocaleDateString("en-CA");

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("None");
  const [selectedReminder, setSelectedReminder] = useState("None");
  const [selectedRepeat, setSelectedRepeat] = useState("None");
  const [selectedPriority, setSelectedPriority] = useState("none");
  const [selectedTaskType, setSelectedTaskType] = useState("none");
  const [tags, setTags] = useState("");

  const [todayIncomletedTasks, setTodayIncomletedTasks] = useState<any[]>([]);

  useEffect(() => {
    const getTodayIncomletedTasks = async () => {
      try {
        const tasks = await getPendingTasksByDate(todayStr);
        console.log(tasks);
        setTodayIncomletedTasks(tasks);
      }
      catch (e) {
        console.log(e);
      }
    }
    getTodayIncomletedTasks();
  }, []);

  async function addNewTask(payload: {
    taskname: string;
    date: string;
    time: string;
    reminder: string;
    repeat: string;
    priorityLevel: string;
    taskType: string;
    tags: string;
  }) {

    console.log("NEW TASK", payload);

    try {
      const id = await add(payload);
      console.log('-------------', id);
    }
    catch (e) {
      console.log(e);
    }

    setSelectedDate(todayStr);
    setSelectedTime('None');
    setSelectedReminder('None');
    setSelectedRepeat('None');
    setSelectedPriority('none');
    setSelectedTaskType('none');
    setTags('');
  }

  const formatTaskDate = (dateStr: string) => {
    const input = new Date(dateStr);
    const today = new Date();

    input.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays =
      (input.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    return input.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 px-4'>

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

          {/* today incomplete tasks */}
          <FlatList
            data={todayIncomletedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
                    <Text className='text-[15.5px]'>{item.taskname}</Text>
                  </View>
                </View>
                <View>
                  <View>
                    <Text className='text-primary text-[13px]'>{formatTaskDate(item.date)}</Text>
                  </View>
                  <View></View>
                </View>
              </View>
            )}
          >
          </FlatList>

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
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedReminder={selectedReminder}
        selectedRepeat={selectedRepeat}
        selectedPriority={selectedPriority}
        selectedTaskType={selectedTaskType}
        tags={tags}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setSelectedReminder={setSelectedReminder}
        setSelectedRepeat={setSelectedRepeat}
        setSelectedPriority={setSelectedPriority}
        setSelectedTaskType={setSelectedTaskType}
        setTags={setTags}
        onAddTask={addNewTask}
      />

      <CustomCalendarModal
        visible={showDate}
        date={selectedDate}
        choooseDate={setSelectedDate}
        onClose={() => setShowDate(false)}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedReminder={selectedReminder}
        setSelectedReminder={setSelectedReminder}
        selectedRepeat={selectedRepeat}
        setSelectedRepeat={setSelectedRepeat}
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
