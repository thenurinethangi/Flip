import { useCountdown } from '@/hooks/useCountdown';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import Spinner from './spinner';
import { AppIcon } from './ui/icon-symbol';

interface ViewCountdownModalProps {
    visible: boolean;
    onClose: () => void;
    countdown: any
}

const CountdownViewModal: React.FC<ViewCountdownModalProps> = ({ visible, onClose, countdown }) => {

    const [isLoading, setIsLoading] = useState(true);

    const todayStr = new Date().toLocaleDateString("en-CA");

    const { days, hours, minutes, seconds } = useCountdown(countdown?.date || todayStr);

    const headerText = useMemo(() => {
        const dateStr: string = countdown?.date || todayStr;
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, (month ?? 1) - 1, day ?? 1);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const formattedDate = `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
        return `Days until ${weekday}, ${formattedDate}`;
    }, [countdown?.date, todayStr]);

    useEffect(() => {
        if (!visible) return;

        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown?.id, countdown?.date, visible]);

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="fullScreen"
                statusBarTranslucent
                onRequestClose={onClose}
            >
                <SafeAreaView className="flex-1 bg-[#DDE4FF]">
                    <View className="px-4 pt-2 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-x-4">
                            <TouchableOpacity onPress={onClose}>
                                <ArrowLeft
                                    size={22}
                                    color="#222"
                                    strokeWidth={2}
                                    className="opacity-70"
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center gap-x-5">
                            <TouchableOpacity>
                                <AppIcon name="EllipsisVertical" color="#6b7280" size={21} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 items-center justify-center px-5 relative">
                        {isLoading ? (
                            <View className="items-center justify-center" style={{ width: '100%', maxWidth: 320, height: 640 }}>
                                <Spinner />
                            </View>
                        ) : (
                            <>
                                <ImageBackground
                                    source={require('../assets/images/calendar-1.png')}
                                    resizeMode="contain"
                                    imageStyle={{ borderRadius: 24 }}
                                    style={{ width: '100%', maxWidth: 320, height: 640 }}
                                />

                                <View
                                    className="absolute items-center px-6"
                                    style={{ width: '100%', maxWidth: 320, height: 640, paddingTop: 120 }}
                                >
                                    <View className="flex-row items-center gap-x-2" style={{ paddingBottom: 100 }}>
                                        <Svg width={16} height={16} viewBox="0 0 24 24">
                                            <Rect x={3} y={4} width={18} height={17} rx={3} fill="#9AA6F9" />
                                            <Rect x={3} y={8} width={18} height={2} fill="#E9ECFF" />
                                            <Path d="M7 2v4M17 2v4" stroke="#E9ECFF" strokeWidth={2} strokeLinecap="round" />
                                        </Svg>
                                        <Text className="text-[14px] font-semibold text-gray-400">{headerText}</Text>
                                    </View>

                                    <Text className="mt-6 text-[64px] font-bold text-[#111827]" style={{ fontSize: 54, fontWeight: 900 }}>
                                        {days}
                                    </Text>
                                    <Text className="mt-1 font-medium text-gray-400">Days</Text>

                                    <View className="mt-6 w-full flex-row items-center justify-between">
                                        <View className="flex-1 items-center">
                                            <Text className="text-[18px] font-semibold text-[#111827]" style={{ fontSize: 30, fontWeight: 900 }}>{hours}</Text>
                                            <Text className="font-medium text-gray-400">Hours</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <Text className="text-[18px] font-semibold text-[#111827]" style={{ fontSize: 30, fontWeight: 900 }}>{minutes}</Text>
                                            <Text className="font-medium text-gray-400">Minutes</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <Text className="text-[18px] font-semibold text-[#111827]" style={{ fontSize: 30, fontWeight: 900 }}>{seconds}</Text>
                                            <Text className="font-medium text-gray-400">Seconds</Text>
                                        </View>
                                    </View>

                                    <Text className="mt-10 text-[20px] font-semibold" style={{ fontSize: 23, fontWeight: 700, color: '#4772FA', marginTop: 80 }}>
                                        {countdown?.countdownName ?? "Countdown"}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>

                </SafeAreaView>
            </Modal>

        </>
    )
}

export default CountdownViewModal