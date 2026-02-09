import AccountModal from '@/components/AccountModal'
import ThemeModal from '@/components/ThemeModal'
import { AppIcon } from '@/components/ui/icon-symbol'
import { ThemeContext } from '@/context/themeContext'
import { auth } from '@/services/firebase'
import { subscribeUser, UserProfile } from '@/services/userService'
import { router } from 'expo-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
  const { currentTheme } = useContext(ThemeContext);
  const isDark = currentTheme === 'dark';
  const cardBg = isDark ? '#1B1B1B' : '#FFFFFF';
  const textPrimary = isDark ? '#E5E7EB' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const borderColor = isDark ? '#111827' : '#F3F4F6';

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

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace('/(auth)');
    }
    catch (e) {
      console.log(e);
      Alert.alert('Fail to logout!');
    }
  }

  return (
    <>
      <SafeAreaView className={`flex-1 pb-0 mb-0 ${isDark ? 'bg-[#0B0F0E]' : 'bg-[#F5F6F8]'}`}>

        <View className='mt-[17px] flex-row justify-between items-center px-4'>
          <View className='flex-row items-center gap-x-4'>
            {/* <AppIcon name="Menu" color="#222" /> */}
            <Text className='text-[20.5px] font-semibold' style={{ color: textPrimary }}>Settings</Text>
          </View>
        </View>

        <ScrollView className='mt-4 flex-1' contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

          {/* Profile card */}
          <TouchableOpacity
            onPress={() => setShowAccountModal(true)}
            className='rounded-[18px] px-4 py-4 flex-row items-center justify-between shadow-xl shadow-black/15 border'
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <View className='flex-row items-center gap-x-4'>
              {userData.avatar === ''
                ? <View className='w-[59px] h-[59px] rounded-full items-center justify-center' style={{ backgroundColor: isDark ? '#111827' : '#E6E9F4' }}>
                  <AppIcon name='user' color={isDark ? '#6B7280' : '#9CA3AF'} size={22} />
                </View>
                : <Image source={{ uri: userData.avatar }} className='w-[59px] h-[59px] rounded-full object-center object-cover'></Image>
              }
              <View>
                <Text className='text-[17.5px] font-semibold' style={{ color: textPrimary }}>{userData.name}</Text>
                <View className='flex-row items-center gap-x-2 mt-1'>
                  <View className='px-2 py-[2px] rounded-full flex-row items-center gap-x-1' style={{ backgroundColor: isDark ? '#0F2E23' : '#E6F7EE' }}>
                    <Text className='text-[11px] font-semibold' style={{ color: '#22C55E' }}>Free</Text>
                  </View>
                  {/* <View className='px-2 py-[2px] rounded-full bg-[#E9ECF8] flex-row items-center gap-x-1'>
                    <Text className='text-[11px] text-[#64748B] font-semibold'>15 Badges</Text>
                  </View> */}
                </View>
              </View>
            </View>
            <AppIcon name='chevronRight' color={isDark ? '#6B7280' : '#C5C9D3'} size={20} />
          </TouchableOpacity>

          {/* Settings list */}
          <View className='rounded-[18px] mt-4 shadow-xl shadow-black/15 border overflow-hidden' style={{ backgroundColor: cardBg, borderColor }}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity onPress={item.fuc} key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#EEF2FF] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#4F6EF7' />
                  </View>
                  <Text className='text-[15px]' style={{ color: textPrimary }}>{item.label}</Text>
                </View>
                <AppIcon name='chevronRight' color={isDark ? '#6B7280' : '#C5C9D3'} size={18} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Integrations */}
          <View className='rounded-[18px] mt-4 shadow-xl shadow-black/15 border' style={{ backgroundColor: cardBg, borderColor }}>
            <TouchableOpacity className='flex-row items-center justify-between px-4 py-4'>
              <View className='flex-row items-center gap-x-3'>
                <View className='w-[30px] h-[30px] rounded-[10px] bg-[#E6FAF1] items-center justify-center'>
                  <AppIcon name='send' size={18} color='#22C55E' />
                </View>
                <Text className='text-[15px]' style={{ color: textPrimary }}>Integrations & Import</Text>
              </View>
              <AppIcon name='chevronRight' color={isDark ? '#6B7280' : '#C5C9D3'} size={18} />
            </TouchableOpacity>
          </View>

          {/* More */}
          <View className='rounded-[18px] mt-4 shadow-xl shadow-black/15 overflow-hidden border' style={{ backgroundColor: cardBg, borderColor }}>
            {moreItems.map((item) => (
              <TouchableOpacity key={item.label} className='flex-row items-center justify-between px-4 py-4'>
                <View className='flex-row items-center gap-x-3 flex-1'>
                  <View className='w-[30px] h-[30px] rounded-[10px] bg-[#FFF7E6] items-center justify-center'>
                    <AppIcon name={item.icon} size={18} color='#F59E0B' />
                  </View>
                  <Text className='text-[15px]' style={{ color: textPrimary }}>{item.label}</Text>
                </View>
                {item.hasSocial ? (
                  <View className='flex-row items-center gap-x-2'>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/twitter.png')} className='w-6 h-6 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/media.png')} className='w-7 h-7 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/communication.png')} className='w-6 h-6 rounded-full'></Image></View>
                    <View className='w-[20px] h-[20px] rounded-full items-center justify-center'><Image source={require('./../../assets/images/social.png')} className='w-6 h-6 rounded-full'></Image></View>
                  </View>
                ) : (
                  <AppIcon name='chevronRight' color={isDark ? '#6B7280' : '#C5C9D3'} size={18} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity onPress={handleLogout} className='rounded-[18px] mt-4 px-4 py-4 items-center shadow-xl shadow-black/15 border' style={{ backgroundColor: cardBg, borderColor }}>
            <Text className='text-[15px] font-medium' style={{ color: '#E94E4E' }}>Sign Out</Text>
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