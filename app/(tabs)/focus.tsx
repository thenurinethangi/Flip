import { AppIcon } from '@/components/ui/icon-symbol'
import React, { useEffect, useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle } from 'react-native-svg'

const focus = () => {
  const totalSeconds = 60 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const progress = useMemo(() => {
    return 1 - remainingSeconds / totalSeconds;
  }, [remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const displayTime = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;

  const size = 272;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

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

            <View className='items-center justify-center' style={{ width: size, height: size }}>
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
              <View className='absolute'>
                <Text className='text-[36px] text-[#111827] font-semibold'>{displayTime}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsRunning((prev) => !prev)}
              className='mt-[100px] bg-[#4772FA] px-12 py-3 rounded-full w-[165px] h-[47px]'
            >
              <Text className='text-white text-[16px] text-center'>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>

            <View className='mt-5'>
              <Text className='text-gray-500 text-[14px]'>Today: 1 Pomo . 1 hour</Text>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </>
  )
}

export default focus