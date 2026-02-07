import AccountModal from '@/components/AccountModal'
import ThemeModal from '@/components/ThemeModal'
import { AppIcon } from '@/components/ui/icon-symbol'
import { auth } from '@/services/firebase'
import { getUser, subscribeUser, UserProfile } from '@/services/userService'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const [userData, setUserData] = useState<UserProfile>({
    id: '',
    userId: '',
    avatar: '',
    name: '',
    email: ''
  });

  const settingsItems = [
    { label: 'Tab Bar', icon: 'layers' as const, fuc: () => { } },
    { label: 'Appearance', icon: 'Disc' as const, fuc: () => setShowThemeModal(true) },
    { label: 'Date & Time', icon: 'Clock' as const, fuc: () => { } },
    { label: 'Sounds & Notifications', icon: 'bell' as const, fuc: () => { } },
    { label: 'General', icon: 'Menu' as const, fuc: () => { } },
  ]

  const moreItems = [
    { label: 'Recommend to Friends', icon: 'send' as const },
    { label: 'Help & Feedback', icon: 'bell' as const },
    { label: 'Follow Us', icon: 'user' as const, hasSocial: true },
    { label: 'About', icon: 'code' as const },
  ]

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        void getUserAdditionalData(u.uid, u.email ?? "");
      }
    });
    return unsub;
  }, []);

  async function getUserAdditionalData(uid: string, email: string) {
    try {
      await subscribeUser(uid, (profile: UserProfile | null) => {
        if (profile) {
          setUserData(profile);
        }
        else {
          setUserData({
            id: '',
            userId: uid,
            avatar: '',
            name: email.split("@")[0],
            email: email.split("@")[0]
          });
        }
      }, (error) => console.log(error));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <SafeAreaView className='bg-[#F5F6F8] flex-1 pb-0 mb-0'>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold'>Settings</Text>
          </View>
        </View>

        <ScrollView className='mt-4 flex-1' contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

          {/* Profile card */}
          <TouchableOpacity onPress={() => setShowAccountModal(true)} className='bg-white rounded-[18px] px-4 py-4 flex-row items-center justify-between shadow-xl shadow-black/15 border border-gray-100'>
            <View className='flex-row items-center gap-x-4'>
              {userData.avatar === ''
                ? <View className='w-[59px] h-[59px] rounded-full bg-[#E6E9F4] items-center justify-center'>
                  <AppIcon name='user' color='#9CA3AF' size={22} />
                </View>
                : <Image source={{ uri: userData.avatar }} className='w-[59px] h-[59px] rounded-full object-center object-cover'></Image>
              }
              <View>
                <Text className='text-[17.5px] font-semibold text-[#111827]'>{userData.name}</Text>
                <View className='flex-row items-center gap-x-2 mt-1'>
                  <View className='px-2 py-[2px] rounded-full bg-[#E6F7EE] flex-row items-center gap-x-1'>
                    <Text className='text-[11px] text-[#22C55E] font-semibold'>Free</Text>
                  </View>
                  {/* <View className='px-2 py-[2px] rounded-full bg-[#E9ECF8] flex-row items-center gap-x-1'>
                    <Text className='text-[11px] text-[#64748B] font-semibold'>15 Badges</Text>
                  </View> */}
                </View>
              </View>
            </View>
            <AppIcon name='chevronRight' color='#C5C9D3' size={20} />
          </TouchableOpacity>

          {/* Settings list */}
          <View className='bg-white rounded-[18px] mt-4 shadow-xl shadow-black/15 border border-gray-100 overflow-hidden'>
            {settingsItems.map((item, index) => (
              <TouchableOpacity onPress={item.fuc} key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#EEF2FF] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#4F6EF7' />
                  </View>
                  <Text className='text-[15px] text-[#000000]'>{item.label}</Text>
                </View>
                <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Integrations */}
          <View className='bg-white rounded-[18px] mt-4 shadow-xl shadow-black/15 border border-gray-100'>
            <TouchableOpacity className='flex-row items-center justify-between px-4 py-4'>
              <View className='flex-row items-center gap-x-3'>
                <View className='w-[30px] h-[30px] rounded-[10px] bg-[#E6FAF1] items-center justify-center'>
                  <AppIcon name='send' size={18} color='#22C55E' />
                </View>
                <Text className='text-[15px] text-[#000000]'>Integrations & Import</Text>
              </View>
              <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
            </TouchableOpacity>
          </View>

          {/* More */}
          <View className='bg-white rounded-[18px] mt-4 shadow-xl shadow-black/15 overflow-hidden border border-gray-100'>
            {moreItems.map((item) => (
              <TouchableOpacity key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3 flex-1'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#FFF7E6] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#F59E0B' />
                  </View>
                  <Text className='text-[15px] text-[#000000]'>{item.label}</Text>
                </View>
                {item.hasSocial ? (
                  <View className='flex-row items-center gap-x-2'>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/twitter.png')} className='w-6 h-6 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/media.png')} className='w-7 h-7 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/communication.png')} className='w-6 h-6 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/social.png')} className='w-6 h-6 rounded-full'></Image></View>
                  </View>
                ) : (
                  <AppIcon name='chevronRight' color='#C5C9D3' size={18} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity className='bg-white rounded-[18px] mt-4 px-4 py-4 items-center shadow-xl shadow-black/15 border border-gray-100'>
            <Text className='text-[#E94E4E] text-[15px] font-medium'>Sign Out</Text>
          </TouchableOpacity>

        </ScrollView>

      </SafeAreaView>

      <AccountModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />

      <ThemeModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

    </>
  )
}

export default profile