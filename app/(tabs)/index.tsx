import AddSubtaskModal from '@/components/AddSubtaskModal';
import AddTaskModal from '@/components/AddTaskModal';
import CustomCalendarModal from '@/components/DatePickerModal';
import SubtaskEditModal from '@/components/SubtaskEditModel';
import Spinner from '@/components/spinner';
import { AppIcon } from '@/components/ui/icon-symbol';
import { requestNotificationPermission } from '@/config/notificationConfig';
import { useAuth } from '@/context/authContext';
import { ColorContext } from '@/context/colorContext';
import { ThemeContext } from '@/context/themeContext';
import { addNewSubTask, subscribeSubTasksByTaskId, updateSubtaskStatusBySubtaskId } from '@/services/subtaskService';
import { add, postponeTasksByTaskIds, subscribeCompleteTasksByDate, subscribeOverdueTasks, subscribePendingTasksByDate, updateTaskStatusByTaskId } from '@/services/taskService';
import Checkbox from "expo-checkbox";
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskEditModal from './../../components/TaskEditModal';

export default function HomeScreen() {

  const { user, loading } = useAuth();
  const { currentTheme } = useContext(ThemeContext);
  const { colorTheme } = useContext(ColorContext);
  const router = useRouter();
  const isDark = currentTheme === 'dark';
  const textPrimary = isDark ? '#E5E7EB' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [showCompleteTasks, setShowCompleteTasks] = useState<boolean>(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState<boolean>(false);
  const [showTaskEdit, setShowTaskEdit] = useState<boolean>(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState<boolean>(false);
  const [showSubtaskEdit, setShowSubtaskEdit] = useState(false);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [activeSubtask, setactiveSubtask] = useState<{} | null>(null);

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
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)");
    }
  }, [user, loading]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const subtaskUnsubscribers = useRef<Record<string, () => void>>({});
  const taskLoadState = useRef({ pending: false, complete: false, overdue: false });

  const markTasksLoaded = (key: keyof typeof taskLoadState.current) => {
    if (!taskLoadState.current[key]) {
      taskLoadState.current[key] = true;
      const { pending, complete, overdue } = taskLoadState.current;
      if (pending && complete && overdue) {
        setIsTasksLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      taskLoadState.current = { pending: false, complete: false, overdue: false };
      setIsTasksLoading(false);
      return;
    }
    taskLoadState.current = { pending: false, complete: false, overdue: false };
    setIsTasksLoading(true);
  }, [user, todayStr]);

  const updateSubtasksForTask = (taskId: string, subtasks: any[]) => {
    setTodayIncompleteTasks((prev) =>
      prev.map((item) =>
        item.task.id === taskId ? { ...item, subtasks } : item,
      ),
    );
    setTodayCompleteTasks((prev) =>
      prev.map((item) =>
        item.task.id === taskId ? { ...item, subtasks } : item,
      ),
    );
    setOverdueTasks((prev) =>
      prev.map((item) =>
        item.task.id === taskId ? { ...item, subtasks } : item,
      ),
    );
  };


  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribePendingTasksByDate(
      todayStr,
      (tasks) => {
        // console.log(tasks);
        setTodayIncompleteTasks(tasks)
        markTasksLoaded("pending");
      },
      (error) => {
        console.log(error);
        markTasksLoaded("pending");
      }
    );

    return unsubscribe;
  }, [todayStr, user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeCompleteTasksByDate(
      todayStr,
      (tasks) => {
        setTodayCompleteTasks(tasks);
        markTasksLoaded("complete");
      },
      (error) => {
        console.log(error);
        markTasksLoaded("complete");
      }
    );

    return unsubscribe;
  }, [todayStr, user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeOverdueTasks(
      todayStr,
      (tasks) => {
        setOverdueTasks(tasks);
        markTasksLoaded("overdue");
      },
      (error) => {
        console.log(error);
        markTasksLoaded("overdue");
      }
    );

    return unsubscribe;
  }, [todayStr, user]);

  useEffect(() => {
    if (!user) {
      Object.values(subtaskUnsubscribers.current).forEach((unsubscribe) => unsubscribe());
      subtaskUnsubscribers.current = {};
      setTodayIncompleteTasks([]);
      setTodayCompleteTasks([]);
      setOverdueTasks([]);
      setExpandedTaskIds({});
      return;
    }
    const allTasks = [...todayIncompleteTasks, ...todayCompleteTasks, ...overdueTasks];
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
  }, [todayIncompleteTasks, todayCompleteTasks, overdueTasks, user]);

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
    setTodayIncompleteTasks((prev) => updateSubtaskStatusInList(prev, subtaskId, nextStatus));
    setTodayCompleteTasks((prev) => updateSubtaskStatusInList(prev, subtaskId, nextStatus));
    setOverdueTasks((prev) => updateSubtaskStatusInList(prev, subtaskId, nextStatus));

    try {
      await updateSubtaskStatusBySubtaskId(subtaskId, nextStatus);
    }
    catch (e) {
      console.log(e);
    }
  }

  async function handlePostpone() {

    const ids = overdueTasks.map((item) => {
      return item.task.id
    });
    console.log(ids);

    try {
      await postponeTasksByTaskIds(ids, todayStr);
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
      <SafeAreaView className={`${currentTheme === 'light' ? 'bg-[#F5F6F8]' : 'bg-[#000000]'} flex-1`}>

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
            backgroundColor: colorTheme,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colorTheme,
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
            <AppIcon name="Menu" color={isDark ? '#E5E7EB' : '#222'} />
            <Text className='text-[20.5px] font-semibold' style={{ color: textPrimary }}>Today</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color={isDark ? '#E5E7EB' : '#424242'} size={22} />
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 0, marginBottom: 0 }}>
          {isTasksLoading ? (
            <Spinner />
          ) : (
            <>
              {/* today incomplete tasks */}
              <DraggableFlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={todayIncompleteTasks}
                keyExtractor={(item) => item.task.id}
                activationDistance={8}
                onDragEnd={({ data }) => setTodayIncompleteTasks(data)}
                renderItem={({ item, drag, isActive }) => (
                  <ScaleDecorator>
                    <View className={`mb-2`} style={{ opacity: isActive ? 0.9 : 1, backgroundColor: cardBg, borderRadius: 10 }}>
                      <Animated.View
                        layout={Layout.springify().damping(18).stiffness(180)}
                        entering={FadeInDown.duration(200)}
                        exiting={FadeOutUp.duration(150)}
                        className={`w-full box-content rounded-[10px] pl-[21px] py-4 h-[48px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} ${expandedTaskIds[item.task.id] && item.subtasks?.length > 0 ? '' : 'shadow-lg shadow-black/0.05'} flex-row items-center justify-between`}
                        style={{ backgroundColor: cardBg }}
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
                              style={{ color: textPrimary }}
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
                          onLongPress={drag}
                          delayLongPress={150}
                          activeOpacity={0.6}
                          className='pr-2'
                        >
                          <View>
                            <View>
                              <Text
                                className={`text-[13px] ${item.subtasks?.length > 0 ? 'translate-x-[13px] ' : 'translate-x-2'}`}
                                style={{ color: colorTheme }}
                              >
                                {item.task.time !== 'None' ? item.task.time : formatTaskDate(item.task.date)}
                              </Text>
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
                              className='w-full box-content rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                              style={{ backgroundColor: cardBg }}
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
                                      <Text className={`text-[14.5px] ${subtask.status !== 'pending' ? 'text-gray-400 line-through' : ''}`} style={{ color: subtask.status !== 'pending' ? '#9CA3AF' : textPrimary }} numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                    </TouchableNativeFeedback>
                                  </View>
                                  <View>
                                    <Text className={`text-[12.5px]`} style={{ color: subtask.status !== 'pending' ? '#9CA3AF' : subtask.time === 'None' && !isNotPastDate(subtask.date) ? '#ef4444' : colorTheme }}>
                                      {subtask.time !== 'None' ? subtask.time : formatTaskDate(subtask.date)}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableWithoutFeedback>
                            </Animated.View>
                          ))}
                        </View>
                      )}
                    </View>
                  </ScaleDecorator>
                )}
                ListFooterComponent={
                  <>
                    {/* overdue */}
                    {overdueTasks.length > 0 && (
                      <Animated.View
                        layout={Layout.springify().damping(18).stiffness(180)}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(150)}
                        className='py-[12px] shadow-lg shadow-black/0.05 rounded-[10px] mb-2'
                        style={{ backgroundColor: cardBg }}
                      >
                        <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
                          <View className='flex-row items-center gap-x-3'>
                            <Text className='text-[16px] font-medium' style={{ color: textPrimary }}>Overdue</Text>
                            <Text className='text-[14px]' style={{ color: textSecondary }}>{overdueTasks.length}</Text>
                          </View>
                          <View className='flex-row items-center gap-x-3'>
                            <TouchableOpacity onPress={handlePostpone} className='flex-row items-center gap-x-1'>
                              <Text className='text-red-500 text-[13.5px]'>Postpone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowOverdueTasks((prev) => !prev)}>
                              {showOverdueTasks
                                ? <AppIcon name="ChevronDown" color='#9ca3af' size={17} />
                                : <AppIcon name="chevronRight" color='#9ca3af' size={17} />
                              }
                            </TouchableOpacity>
                          </View>
                        </View>

                        {showOverdueTasks ? (
                          <Animated.FlatList
                            scrollEnabled={false}
                            itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
                            data={overdueTasks}
                            keyExtractor={(item) => item.task.id}
                            renderItem={({ item }) => (
                              <View className='mb-2' style={{ backgroundColor: cardBg }}>
                                <Animated.View
                                  layout={Layout.springify().damping(18).stiffness(180)}
                                  entering={FadeInDown.duration(200)}
                                  exiting={FadeOutUp.duration(150)}
                                  className={`rounded-[10px] pl-[21px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} py-4 flex-row items-center justify-between`}
                                  style={{ backgroundColor: cardBg }}
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
                                      <View className='flex-row items-center gap-x-3 w-[75%]'>
                                        <View>
                                          <Checkbox
                                            value={item.task.status !== 'pending'}
                                            onValueChange={(checked) => handleChecked(item.task.id, checked)}
                                            color={getPriorityColor(item.task.priorityLevel)}
                                            style={{ transform: [{ scale: 0.87 }], borderRadius: 5, borderWidth: 2 }}
                                          />
                                        </View>
                                        <View className='w-[72%]'>
                                          <Text className='text-[15.5px]' style={{ color: textPrimary }} numberOfLines={1} ellipsizeMode="tail">{item.task.taskname}</Text>
                                        </View>
                                      </View>
                                      <View>
                                        <View>
                                          <Text className='text-red-500 text-[13px]'>{formatTaskDate(item.task.date)}</Text>
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
                                      className='w-full box-content rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                                      style={{ backgroundColor: cardBg }}
                                    >
                                      <TouchableWithoutFeedback onPress={() => {
                                        setactiveSubtask(subtask);
                                        setShowSubtaskEdit(true);
                                      }}>
                                        <View className='flex-row items-center justify-between w-full'>
                                          <View className='flex-row items-center gap-x-3 w-[75%]'>
                                            <View>
                                              <Checkbox
                                                value={subtask.status !== 'pending'}
                                                onValueChange={(checked) => handleSubtaskChecked(subtask.id, checked)}
                                                color={subtask.status !== 'pending' ? '#B8BFC8' : getPriorityColor(subtask.priorityLevel)}
                                                style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                              />
                                            </View>
                                            <View className='w-[72%]'>
                                              <Text className={`text-[14.5px] ${subtask.status !== 'pending' ? 'text-gray-400 line-through' : 'text-white'}`} numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                            </View>
                                          </View>
                                          <View>
                                            <View>
                                              <Text className={`text-[12.5px]`} style={{ color: subtask.status !== 'pending' ? '#9CA3AF' : !isNotPastDate(subtask.date) ? '#ef4444' : colorTheme }}>{formatTaskDate(subtask.date)}</Text>
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
                          )}
                        >
                          </Animated.FlatList>
                        ) : null}
                      </Animated.View>
                    )}


                {/* today complete task container */}
                {todayCompleteTasks.length > 0
                  ?
                  <Animated.View
                    layout={Layout.springify().damping(18).stiffness(180)}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    className={`py-[12.5px] shadow-lg shadow-black/0.05 mb-2 rounded-[10px] ${todayCompleteTasks.length > 0 ? 'visible' : 'invisible'}`}
                    style={{ backgroundColor: cardBg }}
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
                        keyExtractor={(item) => item.task.id}
                        renderItem={({ item }) => (
                          <View className='mb-2'>
                            <Animated.View
                              layout={Layout.springify().damping(18).stiffness(180)}
                              entering={FadeInDown.duration(200)}
                              exiting={FadeOutUp.duration(150)}
                              className={`rounded-[10px] pl-[21px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} py-4 flex-row items-center justify-between`}
                              style={{ backgroundColor: cardBg }}
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
                                    className='rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                                    style={{ backgroundColor: cardBg }}
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
                      </Animated.FlatList>
                      : ''
                    }
                  </Animated.View>
                  : ''
                }
              </>
            }
          />
            </>
          )}
        </View>

        <TaskEditModal
          visible={showTaskEdit}
          task={activeTask}
          onClose={() => setShowTaskEdit(false)}
          onAddSubtask={() => setShowSubtaskModal(true)}
          onOpenSubtaskEdit={(subtask) => {
            setactiveSubtask(subtask);
            setShowSubtaskEdit(true);
          }}
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

      {/* Subtask edit model */}
      <SubtaskEditModal
        visible={showSubtaskEdit}
        task={activeSubtask}
        onClose={() => setShowSubtaskEdit(false)}
      />

    </>
  );
}
