import AddCountdownModal from '@/components/AddCountdownModal'
import CountdownTypeModal, { CountdownTypeId } from '@/components/CountdownTypeModal'
import { AppIcon } from '@/components/ui/icon-symbol'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const Countdown = () => {
  const [showCountdownTypeModal, setShowCountdownTypeModal] = useState(false);
  const [showAddCountdownModal, setShowAddCountdownModal] = useState(false);
  const [selectedCountdownType, setSelectedCountdownType] = useState<CountdownTypeId | null>(null);

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1'>

        <TouchableOpacity
          onPress={() => {
            setShowCountdownTypeModal(true);
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
            <Text className='text-[20.5px] font-semibold'>Countdown</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color="#424242" size={22} />
          </View>
        </View>

        {/* countdowns container */}
        <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 20, paddingBottom: 0, marginBottom: 0 }}>

          {/* single countdown */}
          <View className={`mb-2 bg-white rounded-[10px]`}>
            <Animated.View
              layout={Layout.springify().damping(18).stiffness(180)}
              entering={FadeInDown.duration(200)}
              exiting={FadeOutUp.duration(150)}
              className={`w-full box-content bg-white rounded-[10px] py-3 px-5 flex-row items-center justify-between shadow-lg shadow-black/0.05`}
            >
              <View className='flex-row items-center gap-x-3 flex-1' pointerEvents="box-none">
                <View className='w-[36px] h-[36px] rounded-full bg-blue-200 flex-row justify-center items-center'>
                  <Image source={require('./../../assets/images/sand-clock.png')} className='w-[22px] h-[22px]'></Image>
                </View>
                <View className='flex-1 justify-center'>
                  <Text className='text-[16px] font-semibold' numberOfLines={1} ellipsizeMode="tail">
                    Weekend
                  </Text>
                </View>
              </View>
              <View className='justify-center items-end'>
                <View>
                  <Text className={`text-primary text-[22px] font-semibold`}>6</Text>
                </View>
                <View>
                  <Text className='text-primary text-[12px]'>Days left</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* single countdown */}
          <View className={`mb-2 bg-white rounded-[10px]`}>
            <Animated.View
              layout={Layout.springify().damping(18).stiffness(180)}
              entering={FadeInDown.duration(200)}
              exiting={FadeOutUp.duration(150)}
              className={`w-full box-content bg-white rounded-[10px] py-3 px-5 flex-row items-center justify-between shadow-lg shadow-black/0.05`}
            >
              <View className='flex-row items-center gap-x-3 flex-1' pointerEvents="box-none">
                <View className='w-[36px] h-[36px] rounded-full bg-blue-200 flex-row justify-center items-center'>
                  <Image source={require('./../../assets/images/sand-clock.png')} className='w-[22px] h-[22px]'></Image>
                </View>
                <View className='flex-1 justify-center'>
                  <Text className='text-[16px] font-semibold' numberOfLines={1} ellipsizeMode="tail">
                    Weekend
                  </Text>
                </View>
              </View>
              <View className='justify-center items-end'>
                <View>
                  <Text className={`text-primary text-[22px] font-semibold`}>6</Text>
                </View>
                <View>
                  <Text className='text-primary text-[12px]'>Days left</Text>
                </View>
              </View>
            </Animated.View>
          </View>

        </View>

      </SafeAreaView>

      <CountdownTypeModal
        visible={showCountdownTypeModal}
        onClose={() => setShowCountdownTypeModal(false)}
        onSelect={(type) => {
          setSelectedCountdownType(type);
          setShowCountdownTypeModal(false);
          setShowAddCountdownModal(true);
        }}
      />

      <AddCountdownModal
        visible={showAddCountdownModal}
        onClose={() => setShowAddCountdownModal(false)}
        type={selectedCountdownType}
      />
    </>
  )
}

export default Countdown