import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppIcon } from '@/components/ui/icon-symbol'
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated'

const Countdown = () => {

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1'>

        <TouchableOpacity
          onPress={() => {
            // setShowAdd(true);
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
          <View className={`mb-1 bg-white rounded-[10px]`}>
            <Animated.View
              layout={Layout.springify().damping(18).stiffness(180)}
              entering={FadeInDown.duration(200)}
              exiting={FadeOutUp.duration(150)}
              className={`w-full box-content bg-white rounded-[10px] py-4 h-[48px] px-5 flex-row items-center justify-between shadow-lg shadow-black/0.05`}
            >
              <View className='flex-row items-center gap-x-3 flex-1' pointerEvents="box-none">
                <View>
                  <Image source={require('./../../assets/images/sand-clock.png')}></Image>
                </View>
                <View className='w-[82%]'>
                  <Text className='text-[16px] font-semibold flex-1' numberOfLines={1} ellipsizeMode="tail">
                    Weekend
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.6} className='pr-2'>
                <View>
                  <View>
                    <Text className={`text-primary text-[13px] translate-x-[13px]`}>eyewuewryuiwer</Text>
                  </View>
                  <View></View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

        </View>

      </SafeAreaView>
    </>
  )
}

export default Countdown