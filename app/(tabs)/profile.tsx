import { AppIcon } from '@/components/ui/icon-symbol'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {

  const settingsItems = [
    { label: 'Tab Bar', icon: 'layers' as const },
    { label: 'Appearance', icon: 'Disc' as const },
    { label: 'Date & Time', icon: 'Clock' as const },
    { label: 'Sounds & Notifications', icon: 'bell' as const },
    { label: 'Widgets', icon: 'layers' as const },
    { label: 'General', icon: 'Menu' as const },
  ]

  const moreItems = [
    { label: 'Recommend to Friends', icon: 'send' as const },
    { label: 'Help & Feedback', icon: 'bell' as const },
    { label: 'Follow Us', icon: 'user' as const, hasSocial: true },
    { label: 'About', icon: 'code' as const },
  ]

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 pb-0 mb-0'>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold'>Settings</Text>
          </View>
        </View>

        <ScrollView className='mt-4' contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Profile card */}
          <TouchableOpacity className='bg-white rounded-[18px] px-4 py-4 flex-row items-center justify-between shadow-sm shadow-black/5'>
            <View className='flex-row items-center gap-x-3'>
              <View className='w-[48px] h-[48px] rounded-full bg-[#E6E9F4] items-center justify-center'>
                <AppIcon name='user' color='#9CA3AF' size={22} />
              </View>
              <View>
                <Text className='text-[16px] font-semibold text-[#111827]'>Thenuri Nathangi</Text>
                <View className='flex-row items-center gap-x-2 mt-1'>
                  <View className='px-2 py-[2px] rounded-full bg-[#E6F7EE] flex-row items-center gap-x-1'>
                    <Text className='text-[11px] text-[#22C55E] font-semibold'>Lv.6</Text>
                  </View>
                  <View className='px-2 py-[2px] rounded-full bg-[#E9ECF8] flex-row items-center gap-x-1'>
                    <Text className='text-[11px] text-[#64748B] font-semibold'>15 Badges</Text>
                  </View>
                </View>
              </View>
            </View>
            <AppIcon name='chevronRight' color='#C5C9D3' size={20} />
          </TouchableOpacity>

          {/* Premium */}
          <View className='bg-white rounded-[18px] px-4 py-4 flex-row items-center justify-between mt-4 shadow-sm shadow-black/5'>
            <View className='flex-row items-center gap-x-3 flex-1'>
              <View className='w-[36px] h-[36px] rounded-full bg-[#FFF4D6] items-center justify-center'>
                <Text className='text-[16px]'>👑</Text>
              </View>
              <View className='flex-1'>
                <Text className='text-[15px] font-semibold text-[#111827]'>Premium Account</Text>
                <Text className='text-[12px] text-[#9CA3AF]'>Calendar view and more features</Text>
              </View>
            </View>
            <View className='border border-[#F4B183] px-3 py-[6px] rounded-full'>
              <Text className='text-[#E57B2C] text-[12px] font-semibold'>Upgrade Now</Text>
            </View>
          </View>

          {/* Settings list */}
          <View className='bg-white rounded-[18px] mt-4 shadow-sm shadow-black/5 overflow-hidden'>
            {settingsItems.map((item, index) => (
              <TouchableOpacity key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#EEF2FF] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#4F6EF7' />
                  </View>
                  <Text className='text-[15px] text-[#111827] font-medium'>{item.label}</Text>
                </View>
                <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Integrations */}
          <View className='bg-white rounded-[18px] mt-4 shadow-sm shadow-black/5'>
            <TouchableOpacity className='flex-row items-center justify-between px-4 py-4'>
              <View className='flex-row items-center gap-x-3'>
                <View className='w-[30px] h-[30px] rounded-[10px] bg-[#E6FAF1] items-center justify-center'>
                  <AppIcon name='send' size={18} color='#22C55E' />
                </View>
                <Text className='text-[15px] text-[#111827] font-medium'>Integrations & Import</Text>
              </View>
              <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
            </TouchableOpacity>
          </View>

          {/* More */}
          <View className='bg-white rounded-[18px] mt-4 shadow-sm shadow-black/5 overflow-hidden'>
            {moreItems.map((item) => (
              <TouchableOpacity key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3 flex-1'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#FFF7E6] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#F59E0B' />
                  </View>
                  <Text className='text-[15px] text-[#111827] font-medium'>{item.label}</Text>
                </View>
                {item.hasSocial ? (
                  <View className='flex-row items-center gap-x-2'>
                    <View className='w-[20px] h-[20px] rounded-full bg-[#111827] items-center justify-center'><Text className='text-[10px] text-white'>X</Text></View>
                    <View className='w-[20px] h-[20px] rounded-full bg-[#FF4500] items-center justify-center'><Text className='text-[10px] text-white'>R</Text></View>
                    <View className='w-[20px] h-[20px] rounded-full bg-[#1877F2] items-center justify-center'><Text className='text-[10px] text-white'>f</Text></View>
                    <View className='w-[20px] h-[20px] rounded-full bg-[#E1306C] items-center justify-center'><Text className='text-[10px] text-white'>Ig</Text></View>
                    <View className='w-[20px] h-[20px] rounded-full bg-[#3B82F6] items-center justify-center'><Text className='text-[10px] text-white'>B</Text></View>
                  </View>
                ) : (
                  <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity className='bg-white rounded-[18px] mt-4 px-4 py-4 items-center shadow-sm shadow-black/5'>
            <Text className='text-[#E94E4E] text-[15px] font-semibold'>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

      </SafeAreaView>
    </>
  )
}

export default profile