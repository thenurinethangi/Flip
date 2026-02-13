import FocusStatsModal from '@/components/FocusStatsModal'
import FocusTaskModal from '@/components/FocusTaskModal'
import FocusTimeModal from '@/components/FocusTimeModal'
import { AppIcon } from '@/components/ui/icon-symbol'
import { useAuth } from '@/context/authContext'
import { ColorContext } from '@/context/colorContext'
import { ThemeContext } from '@/context/themeContext'
import { add, FocusType, subscribeFocusByDate } from '@/services/focusService'
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { useRouter } from 'expo-router'
import { Pause, Play, Square } from "lucide-react-native"
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, AppState, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle } from 'react-native-svg'

export type FocusedTask = {
  id: string;
  taskname: string;
  type: string;
}

type PomodoroSession = {
  mode: 'focus' | 'break';
  startTime: number;
  duration: number;
  task?: FocusedTask | null;
  notificationId?: string | null;
};

const STORAGE_KEY = 'ACTIVE_POMO';

const focus = () => {
  const { user, loading } = useAuth();
  const { currentTheme } = useContext(ThemeContext);
  const { colorTheme } = useContext(ColorContext);
  const router = useRouter();
  const isDark = currentTheme === 'dark';

  const [focusTimeChangeCount, setFocusTimeChangeCount] = useState(1);

  const [totalSeconds, setTotalSeconds] = useState(60 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('end');
  const [focusedTask, setFocusedTask] = useState<FocusedTask | null>(null);
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const lastCompletedSessionKeyRef = useRef<string | null>(null);

  const [isBreak, setIsBreak] = useState(false);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(1 * 60);
  const [remainingBreakSeconds, setRemainingBreakSeconds] = useState(totalBreakSeconds);
  const [isRunningBreak, setIsRunningBreak] = useState(false);
  const [statusBreak, setStatusBreak] = useState('end');

  const [pomos, setPomos] = useState(0);
  const [time, setTime] = useState('');

  const [showFocusTimeModal, setShowFocusTimeModal] = useState(false);
  const [showFocusTaskModal, setShowFocusTaskModal] = useState(false);
  const [showFocusStatsModal, setShowFocusStatsModal] = useState(false);

  const refreshFocusTime = async () => {
    const focusTime = await AsyncStorage.getItem('focusTime');
    if (focusTime && Number(focusTime) <= 180) {
      setTotalSeconds(Number(focusTime) * 60);
      setRemainingSeconds(Number(focusTime) * 60);
    }
  };

  useEffect(() => {
    refreshFocusTime();
  }, [focusTimeChangeCount]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)");
    }
  }, [user, loading]);

  const clearSession = async (cancelNotification: boolean = true) => {
    if (cancelNotification && session?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(session.notificationId);
      } catch {
        // ignore
      }
    }
    setSession(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const ensureNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return true;
    const request = await Notifications.requestPermissionsAsync();
    return request.status === "granted";
  };

  const createSession = async (nextSession: PomodoroSession) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const startBreakSession = async () => {
    const duration = totalBreakSeconds;
    const startTime = Date.now();

    let notificationId: string | null = null;
    try {
      const hasPermission = await ensureNotificationPermission();
      if (hasPermission) {
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Break finished',
            body: 'Ready for another focus session 🚀',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(Date.now() + duration * 1000),
          },
        });
      }
    } catch {
      notificationId = null;
    }

    const nextSession: PomodoroSession = {
      mode: 'break',
      startTime,
      duration,
      notificationId,
    };

    await createSession(nextSession);

    setIsBreak(true);
    setIsRunningBreak(true);
    setStatusBreak('running');
    setRemainingBreakSeconds(duration);
  };

  const startFocusSession = async (durationOverride?: number) => {
    const duration = durationOverride ?? totalSeconds;
    const startTime = Date.now();

    let notificationId: string | null = null;
    try {
      const hasPermission = await ensureNotificationPermission();
      if (hasPermission) {
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Focus complete',
            body: 'Time to take a break ☕',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(Date.now() + duration * 1000),
          },
        });
      }
    } catch {
      notificationId = null;
    }

    const nextSession: PomodoroSession = {
      mode: 'focus',
      startTime,
      duration,
      task: focusedTask,
      notificationId,
    };

    await createSession(nextSession);

    setIsBreak(false);
    setIsRunning(true);
    setStatus('running');
    setRemainingSeconds(duration);
  };

  const applySession = async (active: PomodoroSession) => {
    const elapsed = Math.floor((Date.now() - active.startTime) / 1000);
    const remaining = active.duration - elapsed;

    if (remaining <= 0) {
      if (active.mode === 'focus') {
        const sessionKey = `focus-${active.startTime}-${active.duration}`;
        if (lastCompletedSessionKeyRef.current === sessionKey) {
          return;
        }
        lastCompletedSessionKeyRef.current = sessionKey;
        await saveFocus(active.duration);
        await clearSession(false);
        setIsRunning(false);
        setStatus('end');
        setIsBreak(true);
        setIsRunningBreak(false);
        setStatusBreak('end');
        setRemainingBreakSeconds(totalBreakSeconds);
        setRemainingSeconds(0);
      } else {
        await clearSession(false);
        setIsBreak(false);
        setIsRunningBreak(false);
        setStatusBreak('end');
        await refreshFocusTime();
        setStatus('end');
        setIsRunning(false);
      }
      return;
    }

    if (active.mode === 'focus') {
      setIsBreak(false);
      setIsRunning(true);
      setStatus('running');
      setFocusedTask(active.task ?? null);
      setRemainingSeconds(remaining);
    } else {
      setIsBreak(true);
      setIsRunningBreak(true);
      setStatusBreak('running');
      setRemainingBreakSeconds(remaining);
    }
  };

  const restoreSession = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: PomodoroSession = JSON.parse(raw);
    setSession(parsed);
    await applySession(parsed);
  };

  useEffect(() => {
    restoreSession();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        restoreSession();
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isRunning && !isRunningBreak) return;
    const timer = setInterval(() => {
      if (session) {
        applySession(session);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, isRunningBreak, session]);

  useEffect(() => {
    if (status === 'end') {
      setRemainingSeconds(totalSeconds);
    }
  }, [status]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeFocusByDate(new Date(), (focusDocs: FocusType[]) => {
      setPomos(focusDocs.length);
      const durations = focusDocs.map((x: any) => x.focusDuration);
      let totalDurationInMinutes = 0;
      for (let i = 0; i < durations.length; i++) {
        const element = durations[i];
        totalDurationInMinutes += element;
      }

      const hours = Math.floor(totalDurationInMinutes / 60);
      const minutes = Math.floor(totalDurationInMinutes % 60);
      const hoursText = hours > 0 ? `${hours} hour${hours === 1 ? '' : 's'}` : '';
      const minutesText = minutes > 0 ? `${minutes} minute${minutes === 1 ? '' : 's'}` : '';
      const display = [hoursText, minutesText].filter(Boolean).join(' ');
      setTime(display || '0 minutes');
    });

    return unsubscribe;
  }, [user]);

  const resetFocusSession = () => {
    setIsRunning(false);
    setStatus('end');
    setIsBreak(false);
    setRemainingSeconds(totalSeconds);
  };

  const progress = useMemo(() => {
    return 1 - remainingSeconds / totalSeconds;
  }, [remainingSeconds, totalSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const displayTime = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;

  const size = 272;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const breakProgress = useMemo(() => {
    return 1 - remainingBreakSeconds / totalBreakSeconds;
  }, [remainingBreakSeconds, totalBreakSeconds]);

  const minutesBreak = Math.floor(remainingBreakSeconds / 60);
  const secondsBreak = remainingBreakSeconds % 60;
  const displayTimeBreak = `${String(minutesBreak).padStart(2, '0')} : ${String(secondsBreak).padStart(2, '0')}`;

  const sizeBreak = 272;
  const strokeWidthBreak = 7;
  const radiusBreak = (sizeBreak - strokeWidthBreak) / 2;
  const circumferenceBreak = 2 * Math.PI * radiusBreak;
  const dashOffsetBreak = circumferenceBreak * (1 - breakProgress);

  async function handleSetFocusTime(minutes: number) {
    const clampedMinutes = Math.min(180, Math.max(1, minutes));
    setIsRunning(false);
    setTotalSeconds(clampedMinutes * 60);
    setRemainingSeconds(clampedMinutes * 60);
    await AsyncStorage.setItem('focusTime', String(clampedMinutes));
    setFocusTimeChangeCount((prev) => prev + 1);
    setShowFocusTimeModal(false);
  }

  async function saveFocus(elapsedSecondsOverride?: number) {

    const elapsedSeconds = elapsedSecondsOverride ?? (totalSeconds - remainingSeconds);
    const startTime = new Date(Date.now() - elapsedSeconds * 1000);

    const payload = {
      focusDuration: Number((elapsedSeconds / 60).toFixed(2)),
      date: new Date(),
      startTime,
      endTime: new Date(),
      taskId: focusedTask?.id || null,
      type: focusedTask?.type || null,
    };

    try {
      const id = await add(payload);
    }
    catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <SafeAreaView className={`${isDark ? 'bg-[#000000]' : 'bg-[#F5F6F8]'} flex-1`}>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold' style={{ color: isDark ? '#E5E7EB' : '#111827' }}>Pomo</Text>
          </View>
          <View className='flex-row items-center gap-x-3'>
            <TouchableOpacity onPress={() => setShowFocusStatsModal(true)}>
              <AppIcon name="ChartPie" color={isDark ? '#E5E7EB' : '#424242'} size={22} />
            </TouchableOpacity>
            <AppIcon name="EllipsisVertical" color={isDark ? '#E5E7EB' : '#424242'} size={22} />
          </View>
        </View>

        <View className='flex-1 items-center pt-14'>
          {!isBreak
            ? <View className='items-center'>
              <TouchableOpacity onPress={() => setShowFocusTaskModal(true)} className='flex-row items-center gap-x-2 mb-16'>
                <Text className='text-[16px]' style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
                  {focusedTask ? focusedTask.taskname : 'Focus'}
                </Text>
                <AppIcon name='chevronRight' color={isDark ? '#6B7280' : '#C5C9D3'} size={16} />
              </TouchableOpacity>

              <View className='items-center justify-center relative' style={{ width: size, height: size }}>
                <Svg width={size} height={size}>
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={isDark ? '#1F2937' : '#E5E7EB'}
                    strokeWidth={strokeWidth}
                    fill='none'
                  />
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colorTheme}
                    strokeWidth={strokeWidth}
                    fill='none'
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap='round'
                    rotation='-90'
                    originX={size / 2}
                    originY={size / 2}
                  />
                </Svg>
                <View className='absolute inset-0 items-center justify-center'>
                  <TouchableWithoutFeedback onPress={() => {
                    if (isRunning) {
                      return;
                    }
                    setShowFocusTimeModal(true)
                  }}>
                    <Text className='text-[42px]' style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{displayTime}</Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>

              <View className='mt-[96px]'>
                {!isRunning && status === 'end'
                  ? <TouchableOpacity
                    onPress={() => startFocusSession()}
                    className='px-12 py-3 rounded-full w-[165px] h-[47px]'
                    style={{ backgroundColor: colorTheme }}
                  >
                    <Text className='text-white text-[16px] text-center'>Start</Text>
                  </TouchableOpacity>
                  : <View className='flex-row items-center gap-x-7 translate-x-7'>
                    <TouchableOpacity
                      onPress={() => {
                        if (isRunning) {
                          setIsRunning(false);
                          setStatus('pause');
                          clearSession();
                        } else {
                          startFocusSession(remainingSeconds);
                        }
                      }}
                      className='rounded-full w-[63px] h-[63px] justify-center items-center'
                      style={{ backgroundColor: colorTheme }}
                    >
                      {isRunning ? <Pause color={'white'} size={30} fill={'white'} strokeWidth={1} /> : <Play color={'white'} size={30} fill={'white'} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsRunning(false);
                        setStatus('pause');
                        Alert.alert(
                          'End session',
                          'Do you want to save the focus time or quit?',
                          [
                            {
                              text: 'Quit', style: 'destructive', onPress: () => {
                                clearSession();
                                resetFocusSession();
                              }
                            },
                            {
                              text: 'Save', onPress: () => {
                                saveFocus();
                                clearSession();
                                resetFocusSession();
                              }
                            },
                            {
                              text: 'Cancel', style: 'cancel', onPress: () => {
                                // setIsRunning(false);
                                // setStatus('end');
                              }
                            },
                          ],
                        );
                      }}
                      className='rounded-full w-[50px] h-[50px] justify-center items-center'
                      style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#9CA3AF' }}
                    >
                      <Square color={isDark ? '#6B7280' : '#BDBDBD'} size={19} fill={isDark ? '#6B7280' : '#BDBDBD'} />
                    </TouchableOpacity>
                  </View>
                }
              </View>

              {!isRunning && status === 'end'
                ? <View className='mt-5'>
                  <Text className='text-[14px]' style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    Today: {pomos} Pomo . {time || '0 minutes'}
                  </Text>
                </View>
                : ''}
            </View>

            : <View className='items-center mt-[70px]'>
              <View className='items-center'>
                {isBreak && (isRunningBreak || statusBreak !== 'end')
                  ? <View className='items-center justify-center relative' style={{ width: sizeBreak, height: sizeBreak }}>
                    <Svg width={sizeBreak} height={sizeBreak}>
                      <Circle
                        cx={sizeBreak / 2}
                        cy={sizeBreak / 2}
                        r={radiusBreak}
                        stroke={isDark ? '#1F2937' : '#E5E7EB'}
                        strokeWidth={strokeWidthBreak}
                        fill='none'
                      />
                      <Circle
                        cx={sizeBreak / 2}
                        cy={sizeBreak / 2}
                        r={radiusBreak}
                        stroke={isDark ? '#66BB6A' : '#66BB6A'}
                        strokeWidth={strokeWidthBreak}
                        fill='none'
                        strokeDasharray={`${circumferenceBreak} ${circumferenceBreak}`}
                        strokeDashoffset={dashOffsetBreak}
                        strokeLinecap='round'
                        rotation='-90'
                        originX={sizeBreak / 2}
                        originY={sizeBreak / 2}
                      />
                    </Svg>
                    <View className='absolute inset-0 items-center justify-center'>
                      <TouchableWithoutFeedback>
                        <Text className='text-[42px]' style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{displayTimeBreak}</Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  : <View>
                    <Image source={require('./../../assets/images/pomodoro-technique.png')} style={{ width: 180, height: 180, marginTop: 18 }} />
                    <View className='mt-6 items-center'>
                      <Text className='text-[22px] font-bold text-center mb-2' style={{ color: isDark ? '#E5E7EB' : '#111827' }}>You've got a pomo</Text>
                      <Text className='text-[14px] text-center' style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Relax for 5 minutes.</Text>
                    </View>
                  </View>
                }
              </View>

              <View className='mt-[100px]'>
                {!isRunningBreak && statusBreak === 'end'
                  ? <TouchableOpacity
                    onPress={() => startBreakSession()}
                    className='px-12 py-3 rounded-full w-[165px] h-[47px]'
                    style={{ backgroundColor: colorTheme }}
                  >
                    <Text className='text-white text-[16px] text-center'>Start Break</Text>
                  </TouchableOpacity>
                  : <View className='flex-row items-center gap-x-7 translate-x-7'>
                    <TouchableOpacity
                      onPress={() => {
                        if (isRunningBreak) {
                          setIsRunningBreak(false);
                          setStatusBreak('pause');
                          clearSession();
                        } else {
                          startBreakSession();
                        }
                      }}
                      className='rounded-full w-[63px] h-[63px] justify-center items-center'
                      style={{ backgroundColor: colorTheme }}
                    >
                      {isRunningBreak ? <Pause color={'white'} size={30} fill={'white'} strokeWidth={1} /> : <Play color={'white'} size={30} fill={'white'} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        clearSession();
                        setIsRunningBreak(false);
                        setStatusBreak('end');
                        setRemainingBreakSeconds(totalBreakSeconds);
                        setIsBreak(false);
                        resetFocusSession();
                      }}
                      className='rounded-full w-[50px] h-[50px] justify-center items-center'
                      style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#9CA3AF' }}
                    >
                      <Square color={isDark ? '#6B7280' : '#BDBDBD'} size={19} fill={isDark ? '#6B7280' : '#BDBDBD'} />
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>}
        </View>

      </SafeAreaView>

      <FocusTimeModal
        visible={showFocusTimeModal}
        initialMinutes={totalSeconds / 60}
        onClose={() => setShowFocusTimeModal(false)}
        onSave={handleSetFocusTime}
      >
      </FocusTimeModal>

      <FocusTaskModal
        visible={showFocusTaskModal}
        onClose={() => setShowFocusTaskModal(false)}
        onSelect={(task: FocusedTask) => setFocusedTask(task)}
      />

      <FocusStatsModal
        visible={showFocusStatsModal}
        onClose={() => setShowFocusStatsModal(false)}
      />
    </>
  )
}

export default focus