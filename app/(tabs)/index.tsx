import AddSubtaskModal from '@/components/AddSubtaskModal';
import AddTaskModal from '@/components/AddTaskModal';
import CustomCalendarModal from '@/components/DatePickerModal';
import { AppIcon } from '@/components/ui/icon-symbol';
import { addNewSubTask } from '@/services/subtaskService';
import { add, postponeTasksByTaskIds, subscribeCompleteTasksByDate, subscribeOverdueTasks, subscribePendingTasksByDate, updateTaskStatusByTaskId } from '@/services/taskService';
import Checkbox from "expo-checkbox";
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskEditModal from './../../components/TaskEditModal';

export default function HomeScreen() {

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [showCompleteTasks, setShowCompleteTasks] = useState<boolean>(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState<boolean>(false);
  const [showTaskEdit, setShowTaskEdit] = useState<boolean>(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState<boolean>(false);
  const [activeTask, setActiveTask] = useState<any | null>(null);

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

  useEffect(() => {
    const unsubscribe = subscribePendingTasksByDate(
      todayStr,
      (tasks) => {
        // console.log(tasks);
        setTodayIncompleteTasks(tasks)
      },
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
            <AppIcon name="Menu" color="#222" />
            <Text className='text-[20.5px] font-semibold'>Today</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
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
                <View className={`mb-2 bg-white`} style={{ opacity: isActive ? 0.9 : 1 }}>
                  <Animated.View
                    layout={Layout.springify().damping(18).stiffness(180)}
                    entering={FadeInDown.duration(200)}
                    exiting={FadeOutUp.duration(150)}
                    className={`w-full box-content bg-white rounded-[10px] pl-[21px] py-4 h-[50px] ${item.subtasks?.length > 0 ? 'pr-0' : 'pr-4'} ${expandedTaskIds[item.task.id] && item.subtasks?.length > 0 ? '' : 'shadow-lg shadow-black/0.05'} flex-row items-center justify-between`}
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
                      onLongPress={drag}
                      delayLongPress={150}
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
                        <View
                          key={subtask.id}
                          className='w-full box-content bg-white rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] flex-row items-center justify-between mb-2'
                        >
                          <View className='flex-row items-center justify-between w-full'>
                            <View className='flex-row items-center gap-x-3'>
                              <View>
                                <Checkbox
                                  value={subtask.status !== 'pending'}
                                  onValueChange={() => { }}
                                  color={getPriorityColor(subtask.priorityLevel)}
                                  style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                />
                              </View>
                              <View>
                                <Text className='text-[14.5px]' numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                              </View>
                            </View>
                            <View>
                              <Text className='text-primary text-[12.5px]'>{subtask.time !== 'None' ? subtask.time : formatTaskDate(subtask.date)}</Text>
                            </View>
                          </View>
                        </View>
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
                    className='bg-white py-[12px] shadow-lg shadow-black/0.05 rounded-[10px] mb-2'
                  >
                    <View className='flex-row items-center justify-between pl-[21px] pr-4 mb-2'>
                      <View className='flex-row items-center gap-x-3'>
                        <Text className='text-[16px] font-medium text-[#222]'>Overdue</Text>
                        <Text className='text-[14px] text-gray-400'>{overdueTasks.length}</Text>
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

                    {showOverdueTasks
                      ? (
                        <Animated.FlatList
                          scrollEnabled={false}
                          itemLayoutAnimation={Layout.springify().damping(18).stiffness(180)}
                          data={overdueTasks}
                          keyExtractor={(item) => item.task.id}
                          renderItem={({ item }) => (
                            <View className='mb-2'>
                              <Animated.View
                                layout={Layout.springify().damping(18).stiffness(180)}
                                entering={FadeInDown.duration(200)}
                                exiting={FadeOutUp.duration(150)}
                                className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'
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
                                        <Text className='text-[15.5px]' numberOfLines={1} ellipsizeMode="tail">{item.task.taskname}</Text>
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
                                      className='pl-2 py-1'
                                    >
                                      {expandedTaskIds[item.task.id]
                                        ? <AppIcon name="ChevronDown" color="#9ca3af" size={18} />
                                        : <AppIcon name="chevronRight" color="#9ca3af" size={18} />
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
                                      className='w-full box-content bg-white rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] shadow-lg shadow-black/0.05 flex-row items-center justify-between mb-2'
                                    >
                                      <View className='flex-row items-center justify-between w-full'>
                                        <View className='flex-row items-center gap-x-3 w-[75%]'>
                                          <View>
                                            <Checkbox
                                              value={subtask.status !== 'pending'}
                                              onValueChange={() => { }}
                                              color={getPriorityColor(subtask.priorityLevel)}
                                              style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                            />
                                          </View>
                                          <View className='w-[72%]'>
                                            <Text className='text-[14.5px]' numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                          </View>
                                        </View>
                                        <View>
                                          <View>
                                            <Text className='text-red-500 text-[12.5px]'>{formatTaskDate(subtask.date)}</Text>
                                          </View>
                                          <View></View>
                                        </View>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              )}
                            </View>
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
                        keyExtractor={(item) => item.task.id}
                        renderItem={({ item }) => (
                          <View className='mb-2'>
                            <Animated.View
                              layout={Layout.springify().damping(18).stiffness(180)}
                              entering={FadeInDown.duration(200)}
                              exiting={FadeOutUp.duration(150)}
                              className='bg-white rounded-[10px] pl-[21px] pr-4 py-4 flex-row items-center justify-between'
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
                                    className='pl-2 py-1'
                                  >
                                    {expandedTaskIds[item.task.id]
                                      ? <AppIcon name="ChevronDown" color="#9ca3af" size={18} />
                                      : <AppIcon name="chevronRight" color="#9ca3af" size={18} />
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
                                    className='bg-white rounded-[10px] pl-[21px] pr-4 py-3 h-[46px] shadow-lg shadow-black/0.05 flex-row items-center justify-between mb-2'
                                  >
                                    <View className='flex-row items-center justify-between w-full'>
                                      <View className='flex-row items-center gap-x-3'>
                                        <View>
                                          <Checkbox
                                            value={subtask.status !== 'pending'}
                                            onValueChange={() => { }}
                                            color={'#B8BFC8'}
                                            style={{ transform: [{ scale: 0.85 }], borderRadius: 5, borderWidth: 2 }}
                                          />
                                        </View>
                                        <View className='w-[72%]'>
                                          <Text className='text-[14.5px] text-gray-400 line-through' numberOfLines={1} ellipsizeMode="tail">{subtask.taskname}</Text>
                                        </View>
                                      </View>
                                      <View>
                                        <View>
                                          <Text className='text-gray-400 text-[12.5px] opacity-90'>{subtask.time !== 'None' ? subtask.time : formatTaskDate(subtask.date)}</Text>
                                        </View>
                                        <View></View>
                                      </View>
                                    </View>
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
        </View>

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
