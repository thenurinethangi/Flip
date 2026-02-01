import AddTaskModal from '@/components/AddSubtaskModal';
import AddSubtaskModal from '@/components/AddSubtaskModal';
import CustomCalendarModal from '@/components/DatePickerModal';
import SubtaskEditModal from '@/components/SubtaskEditModel';
import TaskEditModal from '@/components/TaskEditModal';
import { AppIcon } from '@/components/ui/icon-symbol';
import { addNewSubTask, subscribeSubTasksByTaskId, updateSubtaskStatusBySubtaskId } from '@/services/subtaskService';
import { add, subscribeCompleteTasksByDate, subscribePendingTasksByDate, updateTaskStatusByTaskId } from '@/services/taskService';
import Checkbox from "expo-checkbox";
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const getMonthNameFromDate = (dateStr: string): string => {
  if (!dateStr) return '';

  const [, month] = dateStr.split('-');
  const monthIndex = Number(month) - 1;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[monthIndex] ?? '';
};

export default function TabTwoScreen() {

  const todayStr = new Date().toLocaleDateString("en-CA");

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [showCompleteTasks, setShowCompleteTasks] = useState<boolean>(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState<boolean>(false);
  const [showTaskEdit, setShowTaskEdit] = useState<boolean>(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState<boolean>(false);
  const [showSubtaskEdit, setShowSubtaskEdit] = useState(false);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [activeSubtask, setactiveSubtask] = useState<{} | null>(null);

  const [choooseDate, setChoooseDate] = useState(todayStr);
  const [monthStr, setMonthStr] = useState(getMonthNameFromDate(todayStr));

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("None");
  const [selectedReminder, setSelectedReminder] = useState("None");
  const [selectedRepeat, setSelectedRepeat] = useState("None");
  const [selectedPriority, setSelectedPriority] = useState("none");
  const [selectedTaskType, setSelectedTaskType] = useState("none");
  const [tags, setTags] = useState("");

  const [incompleteTasks, setIncompleteTasks] = useState<any[]>([]);
  const [completeTasks, setCompleteTasks] = useState<any[]>([]);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  const subtaskUnsubscribers = useRef<Record<string, () => void>>({});


  const updateSubtasksForTask = (taskId: string, subtasks: any[]) => {
    setIncompleteTasks((prev) =>
      prev.map((item) =>
        item.task.id === taskId ? { ...item, subtasks } : item,
      ),
    );
    setCompleteTasks((prev) =>
      prev.map((item) =>
        item.task.id === taskId ? { ...item, subtasks } : item,
      ),
    );
  };

  useEffect(() => {
    const unsubscribe = subscribePendingTasksByDate(
      choooseDate,
      (tasks) => {
        setIncompleteTasks(tasks)
      },
      (error) => console.log(error)
    );

    return unsubscribe;
  }, [choooseDate]);

  useEffect(() => {
    const unsubscribe = subscribeCompleteTasksByDate(
      choooseDate,
      (tasks) => setCompleteTasks(tasks),
      (error) => console.log(error)
    );

    return unsubscribe;
  }, [choooseDate]);

  useEffect(() => {
    const allTasks = [...incompleteTasks, ...completeTasks];
    const activeTaskIds = new Set(allTasks.map((item) => item.task.id));

    activeTaskIds.forEach((taskId) => {
      if (!subtaskUnsubscribers.current[taskId]) {
        subtaskUnsubscribers.current[taskId] = subscribeSubTasksByTaskId(
          taskId,
          (subtasks) => updateSubtasksForTask(taskId, subtasks),
          (error) => console.log(error),
        );
      }
    });

    Object.keys(subtaskUnsubscribers.current).forEach((taskId) => {
      if (!activeTaskIds.has(taskId)) {
        subtaskUnsubscribers.current[taskId]();
        delete subtaskUnsubscribers.current[taskId];
      }
    });
  }, [incompleteTasks, completeTasks]);

  useEffect(() => () => {
    Object.values(subtaskUnsubscribers.current).forEach((unsubscribe) => unsubscribe());
    subtaskUnsubscribers.current = {};
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

  async function addSubTask(payload: {
    taskname: string;
    date: string;
    time: string;
    reminder: string;
    repeat: string;
    priorityLevel: string;
    taskType: string;
    tags: string;
  }, taskId: string) {

    console.log("NEW SUB TASK", payload);

    try {
      const id = await addNewSubTask(payload, taskId);
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

  const getPriorityColor = (priority?: string) => {
    switch ((priority ?? "none").toLowerCase()) {
      case "high":
        return "#E24A4A";
      case "medium":
        return "#F2B233";
      case "low":
        return "#2F6BFF";
      default:
        return "#B8BFC8";
    }
  };

  const updateSubtaskStatusInList = (
    list: Array<{ task: { id: string } & Record<string, any>; subtasks?: Array<{ id: string } & Record<string, any>> }>,
    subtaskId: string,
    status: string,
  ) =>
    list.map((item) => {
      if (!item.subtasks || item.subtasks.length === 0) return item;
      const nextSubtasks = item.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, status } : subtask,
      );
      const changed = nextSubtasks.some((subtask, index) => subtask !== item.subtasks?.[index]);
      return changed ? { ...item, subtasks: nextSubtasks } : item;
    });

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

  async function handleSubtaskChecked(subtaskId: string, checked: boolean) {
    console.log("taskId", subtaskId, "checked", checked);
    console.log(checked ? 'complete' : 'pending');

    const nextStatus = checked ? 'complete' : 'pending';
    setIncompleteTasks((prev) => updateSubtaskStatusInList(prev, subtaskId, nextStatus));
    setCompleteTasks((prev) => updateSubtaskStatusInList(prev, subtaskId, nextStatus));

    try {
      await updateSubtaskStatusBySubtaskId(subtaskId, nextStatus);
    }
    catch (e) {
      console.log(e);
    }
  }

  const toggleSubtasks = (taskId: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const isNotPastDate = (dateStr: string): boolean => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const inputDate = new Date(year, month - 1, day);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today;
  };


  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 pb-0 mb-0'>

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
            <Text className='text-[20.5px] font-semibold'>{monthStr}</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        {/* Calendar */}
        <CalendarProvider
          date={todayStr}
          style={{ backgroundColor: '#F5F6F8', flex: 0 }}
          onDateChanged={(d) => {
            setChoooseDate(d);
            setMonthStr(getMonthNameFromDate(d));
          }}
        >
          <ExpandableCalendar
            initialPosition="collapsed"
            firstDay={1}
            closeOnDayPress={false}
            hideArrows
            renderHeader={() => null}
            style={{
              backgroundColor: '#F5F6F8',
              flex: 0,
              borderWidth: 0,
              borderRadius: 0,
              elevation: 0,
              shadowColor: 'transparent',
              shadowOpacity: 0,
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
            }}
            markedDates={{
              [choooseDate]: {
                selected: true,
                selectedColor: '#4772FA',
                selectedTextColor: '#FFFFFF',
              },
            }}
            calendarStyle={{
              backgroundColor: '#F5F6F8',
              flex: 0,
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
              textDayFontWeight: 700,
              textDayTextColor: '#3B3B3B',
              textSectionTitleColor: '#7A818E',
              textDayHeaderFontSize: 12.1,
              textDayHeaderFontWeight: '500',
              todayBackgroundColor: '#F5F6F8',
              todayTextColor: '#4772FA',
            }}
          />
        </CalendarProvider>

        {/* tasks container */}
        <View className='bg-[#F5F6F8] -translate-y-2 pb-0 mb-0' style={{ flex: 1, paddingHorizontal: 4, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* incomplete tasks */}
            {incompleteTasks.length > 0
              ? <View className='bg-white shadow-lg shadow-black/0.05 px-2 pb-2'>
                <Text className='text-[16px] font-semibold uppercase px-[12px] py-[14px]'>{formatTaskDate(choooseDate)}</Text>
                <FlatList
                  contentContainerStyle={{ paddingBottom: 0 }}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  data={incompleteTasks}
                  keyExtractor={(item) => item.task.id}
                  renderItem={({ item }) => (
                    <View className={`mb-1 bg-white`}>
                      <Animated.View
                        layout={Layout.springify().damping(18).stiffness(180)}
                        entering={FadeInDown.duration(200)}
                        exiting={FadeOutUp.duration(150)}
                        className={`w-full box-content bg-white rounded-[10px] pl-[21px] py-4 h-[48px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} ${expandedTaskIds[item.task.id] && item.subtasks?.length > 0 ? '' : ''} flex-row items-center justify-between`}
                      >
                        <View className='flex-row items-center gap-x-3 flex-1' pointerEvents="box-none">
                          <View pointerEvents="auto">
                            <Checkbox
                              value={item.task.status !== 'pending'}
                              onValueChange={(checked) => handleChecked(item.task.id, checked)}
                              color={getPriorityColor(item.task.priorityLevel)}
                              style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                            />
                          </View>
                          <View className='w-[82%]'>
                            <Text
                              className='text-[15.5px] flex-1'
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              onPress={() => {
                                setActiveTask(item.task);
                                setShowTaskEdit(true);
                              }}
                            >
                              {item.task.taskname}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          className='pr-2'
                        >
                          <View>
                            <View>
                              <Text className={`text-primary text-[13px] ${item.subtasks?.length > 0 ? 'translate-x-[13px] ' : 'translate-x-2'}`}>{item.task.time !== 'None' ? item.task.time : formatTaskDate(item.task.date)}</Text>
                            </View>
                            <View></View>
                          </View>
                        </TouchableOpacity>
                        {item.subtasks?.length > 0 && (
                          <TouchableOpacity
                            onPress={() => toggleSubtasks(item.task.id)}
                            className='pl-[7px]'
                          >
                            <AppIcon
                              name={expandedTaskIds[item.task.id] ? "ChevronDown" : "chevronRight"}
                              color="#9ca3af"
                              size={15}
                            />
                          </TouchableOpacity>
                        )}
                      </Animated.View>

                      {expandedTaskIds[item.task.id] && item.subtasks?.length > 0 && (
                        <View className='mt-1 ml-4'>
                          {item.subtasks.map((subtask: any) => (
                            <Animated.View
                              layout={Layout.springify().damping(18).stiffness(180)}
                              entering={FadeInDown.duration(200)}
                              exiting={FadeOutUp.duration(150)}
                              key={subtask.id}
                              className='w-full box-content bg-white rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                            >
                              <TouchableWithoutFeedback onPress={() => {
                                setactiveSubtask(subtask);
                              }}>
                                <View className='flex-row items-center justify-between w-full'>
                                  <View className='flex-row items-center gap-x-3'>
                                    <View>
                                      <Checkbox
                                        value={subtask.status !== 'pending'}
                                        onValueChange={(checked) => handleSubtaskChecked(subtask.id, checked)}
                                        color={subtask.status !== 'pending' ? '#B8BFC8' : getPriorityColor(subtask.priorityLevel)}
                                        style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                      />
                                    </View>
                                    <TouchableNativeFeedback onPress={() => {
                                      setactiveSubtask(subtask);
                                      setShowSubtaskEdit(true);
                                    }}>
                                      <Text className={`text-[14.5px] ${subtask.status !== 'pending' ? 'text-gray-400 line-through' : ''}`} numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                    </TouchableNativeFeedback>
                                  </View>
                                  <View>
                                    <Text className={`text-[12.5px] ${subtask.status !== 'pending' ? 'text-gray-400 opacity-90' : subtask.time === 'None' && !isNotPastDate(subtask.date) ? 'text-red-500' : 'text-primary'}`}>{subtask.time !== 'None' ? subtask.time : formatTaskDate(subtask.date)}</Text>
                                  </View>
                                </View>
                              </TouchableWithoutFeedback>
                            </Animated.View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
              : ''}

            {/* complete tasks container */}
            {completeTasks.length > 0
              ? <View className='bg-[#F5F6F8] pt-3 shadow-lg shadow-black/0.05 px-2'>
                <Animated.View
                  layout={Layout.springify().damping(18).stiffness(180)}
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(150)}
                  className={`bg-white py-[12.5px]  rounded-[10px] ${completeTasks.length > 0 ? 'visible' : 'invisible'}`}
                >
                  <View className=''>
                    <Text className='text-[16px] font-semibold text-gray-400 uppercase px-[12px] py-[14px]'>Completed</Text>
                  </View>

                  {/* today complete tasks */}
                  <FlatList
                    scrollEnabled={false}
                    itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
                    data={completeTasks}
                    keyExtractor={(item) => item.task.id}
                    renderItem={({ item }) => (
                      <View className='mb-0'>
                        <Animated.View
                          layout={Layout.springify().damping(18).stiffness(180)}
                          entering={FadeInDown.duration(200)}
                          exiting={FadeOutUp.duration(150)}
                          className={`bg-white rounded-[10px] pl-[21px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} py-4 flex-row items-center justify-between`}
                        >
                          <View className='flex-row items-center justify-between w-full'>
                            <TouchableOpacity
                              activeOpacity={0.9}
                              onPress={() => {
                                setActiveTask(item.task);
                                setShowTaskEdit(true);
                              }}
                              className='flex-row items-center justify-between flex-1'
                            >
                              <View className='flex-row items-center gap-x-3'>
                                <View>
                                  <Checkbox
                                    value={item.task.status !== 'pending'}
                                    onValueChange={(checked) => handleChecked(item.task.id, checked)}
                                    color={'#B8BFC8'}
                                    style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                                  />
                                </View>
                                <View className='w-[72%]'>
                                  <Text className='text-[15.5px] text-gray-400 line-through' numberOfLines={1} ellipsizeMode="tail">{item.task.taskname}</Text>
                                </View>
                              </View>
                              <View>
                                <View>
                                  <Text className='text-gray-400 text-[13px] opacity-90'>{item.task.time !== 'None' ? item.task.time : formatTaskDate(item.task.date)}</Text>
                                </View>
                                <View></View>
                              </View>
                            </TouchableOpacity>
                            {item.subtasks?.length > 0 && (
                              <TouchableOpacity
                                onPress={() => toggleSubtasks(item.task.id)}
                                className='pl-[5px]'
                              >
                                {expandedTaskIds[item.task.id]
                                  ? <AppIcon name="ChevronDown" color="#9ca3af" size={15} />
                                  : <AppIcon name="chevronRight" color="#9ca3af" size={15} />
                                }
                              </TouchableOpacity>
                            )}
                          </View>
                        </Animated.View>

                        {expandedTaskIds[item.task.id] && item.subtasks?.length > 0 && (
                          <View className='mt-1 ml-4'>
                            {item.subtasks.map((subtask: any) => (
                              <View
                                key={subtask.id}
                                className='bg-white rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                              >
                                <TouchableWithoutFeedback onPress={() => {
                                  setactiveSubtask(subtask);
                                  setShowSubtaskEdit(true);
                                }}>
                                  <View className='flex-row items-center justify-between w-full'>
                                    <View className='flex-row items-center gap-x-3'>
                                      <View>
                                        <Checkbox
                                          value={subtask.status !== 'pending'}
                                          onValueChange={(checked) => handleSubtaskChecked(subtask.id, checked)}
                                          color={'#B8BFC8'}
                                          style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                        />
                                      </View>
                                      <View className='w-[72%]'>
                                        <Text className={`text-[14.5px] text-gray-400 ${subtask.status !== 'pending' ? 'line-through' : ''}`} numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                      </View>
                                    </View>
                                    <View>
                                      <View>
                                        <Text className='text-gray-400 text-[12.5px] opacity-90'>{subtask.time !== 'None' ? subtask.time : formatTaskDate(subtask.date)}</Text>
                                      </View>
                                      <View></View>
                                    </View>
                                  </View>
                                </TouchableWithoutFeedback>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )
                    }
                  >
                  </FlatList>
                </Animated.View>
              </View>
              : ''}

            {/* no task view */}
            {completeTasks.length <= 0 && incompleteTasks.length <= 0
              ? <View className='flex-1 justify-center items-center pt-16'>
                <Image source={require('./../../assets/images/undraw_push-notifications_5z1s-removebg-preview.png')} className='w-[130px] h-[100px]'></Image>
                <View className='mt-12'>
                  <Text className='text-center font-bold text-[15px] tracking-wide'>You have a free day</Text>
                  <Text className='text-center text-gray-400 font-light tracking-wide mt-2'>Task it easy</Text>
                </View>
              </View>
              : ''
            }

          </ScrollView>
        </View>

      </SafeAreaView>

      <TaskEditModal
        visible={showTaskEdit}
        task={activeTask}
        onClose={() => setShowTaskEdit(false)}
        onAddSubtask={() => setShowSubtaskModal(true)}
      />

      <AddSubtaskModal
        visible={showSubtaskModal}
        onClose={() => setShowSubtaskModal(false)}
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
        onAddTask={(payload) => addSubTask(payload, activeTask?.id)}
      />

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

      {/* Subtask edit model */}
      <SubtaskEditModal
        visible={showSubtaskEdit}
        task={activeSubtask}
        onClose={() => setShowSubtaskEdit(false)}
      />
    </>
  );
}
