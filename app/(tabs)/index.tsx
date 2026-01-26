import AddTaskModal from '@/components/AddTaskModal';
import CustomCalendarModal from '@/components/DatePickerModal';
import { AppIcon } from '@/components/ui/icon-symbol';
import { add, subscribeCompleteTasksByDate, subscribeOverdueTasks, subscribePendingTasksByDate, updateTaskStatusByTaskId } from '@/services/taskService';
import Checkbox from "expo-checkbox";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [showCompleteTasks, setShowCompleteTasks] = useState<boolean>(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState<boolean>(false);

  const todayStr = new Date().toLocaleDateString("en-CA");

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("None");
  const [selectedReminder, setSelectedReminder] = useState("None");
  const [selectedRepeat, setSelectedRepeat] = useState("None");
  const [selectedPriority, setSelectedPriority] = useState("none");
  const [selectedTaskType, setSelectedTaskType] = useState("none");
  const [tags, setTags] = useState("");

  const [todayIncompleteTasks, setTodayIncompleteTasks] = useState<any[]>([]);
  const [todayCompleteTasks, setTodayCompleteTasks] = useState<any[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribePendingTasksByDate(
      todayStr,
      (tasks) => setTodayIncompleteTasks(tasks),
      (error) => console.log(error)
    );

    return unsubscribe;
  }, [todayStr]);

  useEffect(() => {
    const unsubscribe = subscribeCompleteTasksByDate(
      todayStr,
      (tasks) => setTodayCompleteTasks(tasks),
      (error) => console.log(error)
    );

    return unsubscribe;
  }, [todayStr]);

  useEffect(() => {
    const unsubscribe = subscribeOverdueTasks(
      todayStr,
      (tasks) => setOverdueTasks(tasks),
      (error) => console.log(error)
    );

    return unsubscribe;
  }, [todayStr]);

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

  async function handleChecked(taskId: string, checked: boolean) {
    console.log("taskId", taskId, "checked", checked);
    console.log(checked ? 'complete' : 'pending');

    try {
      await updateTaskStatusByTaskId(taskId, checked ? 'complete' : 'pending');
    }
    catch (e) {
      console.log(e);
    }
  }

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
          <Animated.FlatList
            scrollEnabled={false}
            itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
            data={todayIncompleteTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Animated.View
                layout={Layout.springify().damping(18).stiffness(180)}
                entering={FadeInDown.duration(200)}
                exiting={FadeOutUp.duration(150)}
                className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 shadow-lg shadow-black/0.05 flex-row items-center justify-between mb-2'
              >
                <View className='flex-row items-center gap-x-3'>
                  <View>
                    <Checkbox
                      value={item.status !== 'pending'}
                      onValueChange={(checked) => handleChecked(item.id, checked)}
                      color={item.status !== 'pending' ? "#4772FA" : "#B8BFC8"}
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
              </Animated.View>
            )}
          >
          </Animated.FlatList>

          {/* overdue */}
          {overdueTasks.length > 0 && (
            <Animated.View
              layout={Layout.springify().damping(18).stiffness(180)}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              className='bg-white py-[12px] shadow-lg shadow-black/0.05 rounded-[10px] mb-2'
            >
              <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
                <View className='flex-row items-center gap-x-3'>
                  <Text className='text-[16px] font-medium text-[#222]'>Overdue</Text>
                  <Text className='text-[14px] text-gray-400'>{overdueTasks.length}</Text>
                </View>
                <View className='flex-row items-center gap-x-1'>
                  <TouchableOpacity onPress={() => setShowOverdueTasks((prev) => !prev)}>
                    {showOverdueTasks
                      ? <AppIcon name="ChevronDown" color='#9ca3af' size={17} />
                      : <AppIcon name="chevronRight" color='#9ca3af' size={17} />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {showOverdueTasks
                ? (
                  <Animated.FlatList
                    scrollEnabled={false}
                    itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
                    data={overdueTasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Animated.View
                        layout={Layout.springify().damping(18).stiffness(180)}
                        entering={FadeInDown.duration(200)}
                        exiting={FadeOutUp.duration(150)}
                        className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'
                      >
                        <View className='flex-row items-center gap-x-3'>
                          <View>
                            <Checkbox
                              value={item.status !== 'pending'}
                              onValueChange={(checked) => handleChecked(item.id, checked)}
                              color={item.status !== 'pending' ? "#4772FA" : "#B8BFC8"}
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
                      </Animated.View>
                    )}
                  >
                  </Animated.FlatList>
                )
                : ''
              }
            </Animated.View>
          )}


          {/* today complete task container */}
          {todayCompleteTasks.length > 0
            ?
            <Animated.View
              layout={Layout.springify().damping(18).stiffness(180)}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              className={`bg-white py-[12.5px] shadow-lg shadow-black/0.05 mb-2 rounded-[10px] ${todayCompleteTasks.length > 0 ? 'visible' : 'invisible'}`}
            >
              <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
                <View className='flex-row items-center gap-x-3'>
                  <Text className='text-[16px] font-medium text-gray-400'>Completed</Text>
                  <Text className='text-[14px] text-gray-400'>{todayCompleteTasks.length}</Text>
                </View>
                <View className='flex-row items-center gap-x-1'>
                  <TouchableOpacity onPress={() => setShowCompleteTasks((prev) => !prev)}>
                    {showCompleteTasks
                      ? <AppIcon name="ChevronDown" color='#9ca3af' size={17} />
                      : <AppIcon name="chevronRight" color='#9ca3af' size={17} />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {/* today complete tasks */}
              {showCompleteTasks
                ?
                <Animated.FlatList
                  scrollEnabled={false}
                  itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
                  data={todayCompleteTasks}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Animated.View
                      layout={Layout.springify().damping(18).stiffness(180)}
                      entering={FadeInDown.duration(200)}
                      exiting={FadeOutUp.duration(150)}
                      className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'
                    >
                      <View className='flex-row items-center gap-x-3'>
                        <View>
                          <Checkbox
                            value={item.status !== 'pending'}
                            onValueChange={(checked) => handleChecked(item.id, checked)}
                            color={item.status !== 'pending' ? "#B8BFC8" : "#4772FA"}
                            style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                          />
                        </View>
                        <View>
                          <Text className='text-[15.5px] text-gray-400 line-through'>{item.taskname}</Text>
                        </View>
                      </View>
                      <View>
                        <View>
                          <Text className='text-gray-400 text-[13px] opacity-90'>{formatTaskDate(item.date)}</Text>
                        </View>
                        <View></View>
                      </View>
                    </Animated.View>
                  )}
                >
                </Animated.FlatList>
                : ''
              }
            </Animated.View>
            : ''
          }

        </ScrollView>

      </SafeAreaView >

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
