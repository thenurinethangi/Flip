import AddCountdownModal from '@/components/AddCountdownModal'
import CountdownTypeModal, { CountdownTypeId } from '@/components/CountdownTypeModal'
import CountdownViewModal from '@/components/CountdownViewModal'
import Spinner from '@/components/spinner'
import { AppIcon } from '@/components/ui/icon-symbol'
import { useAuth } from '@/context/authContext'
import { ColorContext } from '@/context/colorContext'
import { ThemeContext } from '@/context/themeContext'
import { subscribeCountdown } from '@/services/countdownService'
import { useRouter } from 'expo-router'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export const getDaysLeftFromToday = (futureDateStr: string): number => {
  if (!futureDateStr) return 0;

  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [year, month, day] = futureDateStr.split('-').map(Number);
  const futureUTC = Date.UTC(year, month - 1, day);

  const diffMs = futureUTC - todayUTC;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

type CountdownType = 'Countdown' | 'Anniversary' | 'Birthday' | 'Holiday'

const countdownTypeImageMap: Record<CountdownType, any> = {
  Countdown: require('./../../assets/images/sand-clock.png'),
  Anniversary: require('./../../assets/images/hearts.png'),
  Birthday: require('./../../assets/images/cake.png'),
  Holiday: require('./../../assets/images/balloon.png'),
};

const typeBgColorMap: Record<CountdownType, string> = {
  Holiday: "#D1FAE5",
  Birthday: "#FFE0B2",
  Anniversary: "#FBCFE8",
  Countdown: "#BFDBFE",
};

const typeColorMap: Record<CountdownType, string> = {
  Holiday: "#10B981",
  Birthday: "#F87171",
  Anniversary: "#EC4899",
  Countdown: "#3B82F6",
};

const Countdown = () => {
  const { user, loading } = useAuth();
  const { currentTheme } = useContext(ThemeContext);
  const { colorTheme } = useContext(ColorContext);
  const router = useRouter();
  const isDark = currentTheme === 'dark';
  const cardBg = isDark ? '#1B1B1B' : '#FFFFFF';
  const textPrimary = isDark ? '#E5E7EB' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  const [showCountdownTypeModal, setShowCountdownTypeModal] = useState(false);
  const [showAddCountdownModal, setShowAddCountdownModal] = useState(false);
  const [showViewCountdownModal, setShowViewCountdownModal] = useState(false);
  const [selectedCountdownType, setSelectedCountdownType] = useState<CountdownTypeId | null>(null);

  const [countdowns, setCountdowns] = useState<Array<{ id: string } & Record<string, any>>>([]);
  const [activeCountdowns, setActiveCountdowns] = useState<any | null>(null);
  const [isCountdownsLoading, setIsCountdownsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) {
      setCountdowns([]);
      setIsCountdownsLoading(false);
      return;
    }
    setIsCountdownsLoading(true);
    let unsubscribe: (() => void) | undefined;
    subscribeCountdown(
      (c) => {
        setCountdowns(c);
        setIsCountdownsLoading(false);
      },
      (error) => {
        console.log(error);
        setIsCountdownsLoading(false);
      },
    )
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((error) => {
        console.log(error);
        setIsCountdownsLoading(false);
      });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);


  return (
    <>
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#000000]' : 'bg-[#F5F6F8]'}`}>

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
            backgroundColor: colorTheme,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colorTheme,
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
            <Text className='text-[20.5px] font-semibold' style={{ color: textPrimary }}>Countdown</Text>
          </View>
          <View className=''>
            <AppIcon name="EllipsisVertical" color={isDark ? '#E5E7EB' : '#424242'} size={22} />
          </View>
        </View>

        {/* countdowns container */}
        <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 20, paddingBottom: 0, marginBottom: 0 }}>
          {isCountdownsLoading ? (
            <Spinner />
          ) : (
            <FlatList
              data={countdowns}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className={`mb-[8px] rounded-[10px]`} style={{ backgroundColor: cardBg }}>
                  <Animated.View
                    layout={Layout.springify().damping(18).stiffness(180)}
                    entering={FadeInDown.duration(200)}
                    exiting={FadeOutUp.duration(150)}
                    className={`w-full box-content rounded-[10px] py-4 px-5 flex-row items-center justify-between shadow-md shadow-black/0.05`}
                    style={{ backgroundColor: cardBg }}
                  >
                    <Pressable onPress={() => { setActiveCountdowns(item); setShowViewCountdownModal(true); }} className='flex-row items-center gap-x-3 flex-1' pointerEvents="box-none">
                      <View
                        className="w-[36px] h-[36px] rounded-full flex-row justify-center items-center"
                        style={{ backgroundColor: typeBgColorMap[item.type as CountdownType] ?? typeBgColorMap.Countdown }}
                      >
                        <Image source={countdownTypeImageMap[item.type as CountdownType] ?? countdownTypeImageMap.Countdown} className='w-[22px] h-[22px]'></Image>
                      </View>
                      <View className='flex-1 justify-center'>
                        <Text className='text-[16px] font-semibold' style={{ color: textPrimary }} numberOfLines={1} ellipsizeMode="tail">
                          {item.countdownName}
                        </Text>
                      </View>
                    </Pressable>
                    <View className='justify-center items-end'>
                      <View>
                        <Text className='text-[22px] font-semibold' style={{ color: colorTheme }}>{getDaysLeftFromToday(item.date)}</Text>
                      </View>
                      <View>
                        <Text className='text-[12px]' style={{ color: colorTheme }}>Days left</Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              )}
            />
          )}
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

      <CountdownViewModal
        visible={showViewCountdownModal}
        onClose={() => setShowViewCountdownModal(false)}
        countdown={activeCountdowns}
      />
    </>
  )
}

export default Countdown