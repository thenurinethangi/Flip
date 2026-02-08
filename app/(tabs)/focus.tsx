import FocusTimeModal from '@/components/FocusTimeModal'
import { AppIcon } from '@/components/ui/icon-symbol'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Pause, Play, Square } from 'lucide-react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle } from 'react-native-svg'

const focus = () => {

  const [focusTimeChangeCount, setFocusTimeChangeCount] = useState(1);

  const [totalSeconds, setTotalSeconds] = useState(60 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('end');

  const [showFocusTimeModal, setShowFocusTimeModal] = useState(false);

  useEffect(() => {
    const getFocusTime = async () => {
      const focusTime = await AsyncStorage.getItem('focusTime');
      if (focusTime && Number(focusTime) <= 180) {
        setTotalSeconds(Number(focusTime) * 60);
      }
    }
    getFocusTime();
  }, [focusTimeChangeCount]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (status === 'end') {
      setRemainingSeconds(totalSeconds);
    }
  }, [status]);

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

  async function handleSetFocusTime(minutes: number) {
    const clampedMinutes = Math.min(180, Math.max(1, minutes));
    setIsRunning(false);
    setTotalSeconds(clampedMinutes * 60);
    setRemainingSeconds(clampedMinutes * 60);
    await AsyncStorage.setItem('focusTime', String(clampedMinutes));
    setFocusTimeChangeCount((prev) => prev + 1);
    setShowFocusTimeModal(false);
  }


  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1'>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold'>Pomo</Text>
          </View>
          <View className='flex-row items-center gap-x-3'>
            <AppIcon name="ChartPie" color="#424242" size={22} />
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        <View className='flex-1 items-center pt-14'>
          <View className='items-center'>
            <View className='flex-row items-center gap-x-2 mb-16'>
              <Text className='text-[16px] text-[#6B7280]'>Focus</Text>
              <AppIcon name='chevronRight' color='#C5C9D3' size={16} />
            </View>

            <View className='items-center justify-center relative' style={{ width: size, height: size }}>
              <Svg width={size} height={size}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke='#E5E7EB'
                  strokeWidth={strokeWidth}
                  fill='none'
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke='#4772FA'
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
                  <Text className='text-[42px] text-[#111827]'>{displayTime}</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View className='mt-[96px]'>
              {!isRunning && status === 'end'
                ? <TouchableOpacity
                  onPress={() => {
                    setIsRunning(true);
                    setStatus('runing');
                  }}
                  className='bg-[#4772FA] px-12 py-3 rounded-full w-[165px] h-[47px]'
                >
                  <Text className='text-white text-[16px] text-center'>Start</Text>
                </TouchableOpacity>
                : <View className='flex-row items-center gap-x-7 translate-x-7'>
                  <TouchableOpacity
                    onPress={() => {
                      setIsRunning((prev) => !prev);
                      setStatus('pause');
                    }}
                    className='bg-[#4772FA] rounded-full w-[63px] h-[63px] justify-center items-center'
                  >
                    {isRunning ? <Pause color={'white'} size={30} fill={'white'} strokeWidth={1} /> : <Play color={'white'} size={30} fill={'white'} />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'End session',
                        'Do you want to save the focus time or quit?',
                        [
                          {
                            text: 'Quit', style: 'destructive', onPress: () => {
                              setIsRunning(false);
                              setStatus('end');
                            }
                          },
                          {
                            text: 'Save', onPress: () => {
                              setIsRunning(false);
                              setStatus('end');
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
                    className='border border-gray-400 rounded-full w-[50px] h-[50px] justify-center items-center'
                  >
                    <Square color={'#BDBDBD'} size={19} fill={'#BDBDBD'} />
                  </TouchableOpacity>
                </View>
              }
            </View>

            {!isRunning && status === 'end'
              ? <View className='mt-5'>
                <Text className='text-gray-500 text-[14px]'>Today: 1 Pomo . 1 hour</Text>
              </View>
              : ''}
          </View>
        </View>

      </SafeAreaView>

      <FocusTimeModal
        visible={showFocusTimeModal}
        initialMinutes={totalSeconds / 60}
        onClose={() => setShowFocusTimeModal(false)}
        onSave={handleSetFocusTime}
      >
      </FocusTimeModal>
    </>
  )
}

export default focus