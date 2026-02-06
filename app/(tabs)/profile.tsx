import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppIcon } from '@/components/ui/icon-symbol'

const profile = () => {

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 pb-0 mb-0'>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold'>Settings</Text>
          </View>
          <View className=''>
            {/* <AppIcon name="EllipsisVertical" color="#424242" size={22} /> */}
          </View>
        </View>

      </SafeAreaView>
    </>
  )
}

export default profile