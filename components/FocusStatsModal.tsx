import { ColorContext } from "@/context/colorContext";
import { ThemeContext } from "@/context/themeContext";
import {
    FocusType,
    getFocusRecordsByRange,
    getFocusSummaryByDate,
    getTotalFocusSummary,
} from "@/services/focusService";
import { ChevronLeft, ChevronRight, Plus, Share2, X } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

interface FocusStatsModalProps {
    visible: boolean;
    onClose: () => void;
}

export function formatRelativeDate(date: Date): string {
    const today = new Date();
    const input = new Date(date);

    today.setHours(0, 0, 0, 0);
    input.setHours(0, 0, 0, 0);

    const diffDays = (today.getTime() - input.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return input.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function formatTime(date: Date | any): string {
    if (!date) return "";
    const value = date?.toDate ? date.toDate() : new Date(date);
    return value.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatMinutesToHours(minutes: number): string {
    if (minutes <= 0) return "0 min";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }

    if (hours > 0) {
        return `${hours}h`;
    }

    return `${remainingMinutes}m`;
}

const FocusStatsModal: React.FC<FocusStatsModalProps> = ({ visible, onClose }) => {
    const { currentTheme } = useContext(ThemeContext);
    const { colorTheme } = useContext(ColorContext);
    const isDark = currentTheme === "dark";
    const cardBg = isDark ? "#1B1B1B" : "#FFFFFF";
    const textPrimary = isDark ? "#E5E7EB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#6B7280";

    const [totalPomos, setTotalPomos] = useState(0);
    const [todayPomos, setTodayPomos] = useState(0);
    const [yesterdayPomos, setYesterdayPomos] = useState(0);
    const [totalTime, setTotalTime] = useState<string[]>([]);
    const [todayTime, setTodayTime] = useState<string[]>([]);
    const [yesterdayTime, setYesterdayTime] = useState<string[]>([]);
    const [todayMinutes, setTodayMinutes] = useState(0);
    const [yesterdayMinutes, setYesterdayMinutes] = useState(0);

    const [focus, setFocus] = useState({ date: new Date(), time: ["0", "0"] });
    const [detailDate, setDetailDate] = useState(new Date());
    const [weekStartDate, setWeekStartDate] = useState(() => {
        const now = new Date();
        const start = new Date(now);
        const day = (start.getDay() + 6) % 7;
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return start;
    });
    const [thisWeekDocs, setThisWeekDocs] = useState<FocusType[]>([]);

    const isSameDay = (a: Date, b: Date) => {
        const d1 = new Date(a);
        const d2 = new Date(b);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();
    };

    const getThisWeekSeries = (items: FocusType[]) => {
        const endOfWeek = new Date(weekStartDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const startOfWeek = new Date(weekStartDate);
        startOfWeek.setHours(0, 0, 0, 0);

        const list = items
            .map((doc: any) => ({
                ...doc,
                date: doc.date?.toDate ? doc.date.toDate() : new Date(doc.date),
            }))
            .filter((doc: any) => doc.date >= startOfWeek && doc.date <= endOfWeek)
            .sort((a: any, b: any) => b.date.getTime() - a.date.getTime()) as FocusType[];

        setThisWeekDocs(list);
    };

    const today = new Date();
    const canGoForward = !isSameDay(detailDate, today);

    const formatWeekRange = (start: Date) => {
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        const sameMonth = start.getMonth() === end.getMonth();
        const startLabel = start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        const endLabel = end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        return sameMonth ? `${startLabel} - ${end.getDate()}` : `${startLabel} - ${endLabel}`;
    };

    const getWeekSeries = (start: Date, docs: FocusType[]) => {
        const buckets = new Array(7).fill(0);
        const startOfWeek = new Date(start);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        docs.forEach((doc: any) => {
            const rawDate = doc.date;
            const docDate = rawDate?.toDate ? rawDate.toDate() : new Date(rawDate);
            if (docDate < startOfWeek || docDate > endOfWeek) return;
            const dayIndex = (docDate.getDay() + 6) % 7;
            buckets[dayIndex] += doc.focusDuration ?? 0;
        });

        return buckets;
    };

    const weeklySeries = getWeekSeries(weekStartDate, thisWeekDocs);
    const currentWeekStart = (() => {
        const now = new Date();
        const start = new Date(now);
        const day = (start.getDay() + 6) % 7;
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return start;
    })();
    const canGoForwardWeek = weekStartDate.getTime() < currentWeekStart.getTime();

    const formatDiff = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        if (hours > 0 && mins > 0) return `${hours}h${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    useEffect(() => {
        if (!visible) return;
        const load = async () => {
            const summary = await getFocusSummaryByDate(new Date());
            setTodayPomos(summary.count);
            setTodayMinutes(summary.totalMinutes);
            const hours = Math.floor(summary.totalMinutes / 60);
            const minutes = Math.floor(summary.totalMinutes % 60);
            setTodayTime([String(hours), String(minutes)]);
        };
        load();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        const load = async () => {
            const summary = await getFocusSummaryByDate(detailDate);
            const hours = Math.floor(summary.totalMinutes / 60);
            const minutes = Math.floor(summary.totalMinutes % 60);
            setFocus({ date: detailDate, time: [String(hours), String(minutes)] });
        };
        load();
    }, [detailDate, visible]);

    useEffect(() => {
        if (!visible) return;
        const load = async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const summary = await getFocusSummaryByDate(yesterday);
            setYesterdayPomos(summary.count);
            setYesterdayMinutes(summary.totalMinutes);
            const hours = Math.floor(summary.totalMinutes / 60);
            const minutes = Math.floor(summary.totalMinutes % 60);
            setYesterdayTime([String(hours), String(minutes)]);
        };
        load();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        const load = async () => {
            const summary = await getTotalFocusSummary();
            setTotalPomos(summary.count);
            const hours = Math.floor(summary.totalMinutes / 60);
            const minutes = Math.floor(summary.totalMinutes % 60);
            setTotalTime([String(hours), String(minutes)]);
        };
        load();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        const loadWeek = async () => {
            const start = new Date(weekStartDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            const items = await getFocusRecordsByRange(start, end);
            getThisWeekSeries(items);
        };
        loadWeek();
    }, [weekStartDate, visible]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <SafeAreaView className={`flex-1 ${isDark ? "bg-[#000000]" : "bg-[#F5F6F8]"}`}>
                <View className="px-4 pt-3">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={onClose} className="w-10 h-10 rounded-full items-center justify-center">
                            <X size={20} color={isDark ? "#E5E7EB" : "#111827"} />
                        </TouchableOpacity>
                        <Text className="text-[18px] font-semibold" style={{ color: textPrimary }}>
                            Focus Statistics
                        </Text>
                        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
                            <Share2 size={18} color={isDark ? "#E5E7EB" : "#111827"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
                    <View className="flex-row gap-x-4">
                        <View className="flex-1 rounded-2xl p-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                            <Text className="text-[14px] font-semibold" style={{ color: textPrimary }}>
                                Today's Pomos
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-[12px]" style={{ color: textSecondary }}>
                                    {yesterdayPomos > todayPomos
                                        ? yesterdayPomos - todayPomos
                                        : todayPomos - yesterdayPomos} from yesterday
                                </Text>
                                <Text className={`text-[13px] ${yesterdayPomos > todayPomos ? "text-[#EF4444]" : "text-green-500"} ml-2`}>
                                    {yesterdayPomos > todayPomos ? "↓" : "↑"}
                                </Text>
                            </View>
                            <Text className="text-[32px] font-semibold mt-3" style={{ color: colorTheme }}>
                                {todayPomos}
                            </Text>
                        </View>
                        <View className="flex-1 rounded-2xl p-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                            <Text className="text-[14px] font-semibold" style={{ color: textPrimary }}>
                                Today's Focus (h)
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-[12px]" style={{ color: textSecondary }}>
                                    {formatDiff(Math.abs(todayMinutes - yesterdayMinutes))} from yesterday
                                </Text>
                                <Text className={`text-[12px] ml-2 ${todayMinutes >= yesterdayMinutes ? "text-green-500" : "text-[#EF4444]"}`}>
                                    {todayMinutes >= yesterdayMinutes ? "↑" : "↓"}
                                </Text>
                            </View>
                            <View className="flex-row items-end mt-3">
                                <Text className="text-[30px] font-semibold" style={{ color: colorTheme }}>
                                    {todayTime[0]}
                                </Text>
                                <Text className="text-[14px] font-semibold ml-1" style={{ color: colorTheme }}>
                                    h
                                </Text>
                                <Text className="text-[30px] font-semibold ml-3" style={{ color: colorTheme }}>
                                    {todayTime[1]}
                                </Text>
                                <Text className="text-[14px] font-semibold ml-1" style={{ color: colorTheme }}>
                                    m
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row gap-x-4 mt-4">
                        <View className="flex-1 rounded-2xl p-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                            <Text className="text-[14px] font-semibold" style={{ color: textPrimary }}>
                                Total Pomos
                            </Text>
                            <Text className="text-[28px] font-semibold mt-3" style={{ color: colorTheme }}>
                                {totalPomos}
                            </Text>
                        </View>
                        <View className="flex-1 rounded-2xl p-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                            <Text className="text-[14px] font-semibold" style={{ color: textPrimary }}>
                                Total Focus Dur...
                            </Text>
                            <View className="flex-row items-end mt-3">
                                <Text className="text-[24px] font-semibold" style={{ color: colorTheme }}>
                                    {totalTime[0]}
                                </Text>
                                <Text className="text-[12px] font-semibold ml-1" style={{ color: colorTheme }}>
                                    h
                                </Text>
                                <Text className="text-[24px] font-semibold ml-2" style={{ color: colorTheme }}>
                                    {totalTime[1]}
                                </Text>
                                <Text className="text-[12px] font-semibold ml-1" style={{ color: colorTheme }}>
                                    m
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="rounded-2xl p-4 mt-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[15px] font-semibold" style={{ color: textPrimary }}>
                                Details
                            </Text>
                            <View className="flex-row items-center gap-x-2">
                                <TouchableOpacity
                                    onPress={() => {
                                        setDetailDate((prev) => {
                                            const next = new Date(prev);
                                            next.setDate(next.getDate() - 1);
                                            return next;
                                        });
                                    }}
                                >
                                    <ChevronLeft size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                                </TouchableOpacity>
                                <Text className="text-[12px]" style={{ color: textPrimary }}>
                                    {formatRelativeDate(detailDate)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!canGoForward) return;
                                        setDetailDate((prev) => {
                                            const next = new Date(prev);
                                            next.setDate(next.getDate() + 1);
                                            return next;
                                        });
                                    }}
                                    disabled={!canGoForward}
                                >
                                    <ChevronRight size={18} color={canGoForward ? (isDark ? "#6B7280" : "#9CA3AF") : "#E5E7EB"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="items-center mt-6">
                            <View className="w-[170px] h-[170px] rounded-full border-[10px] items-center justify-center" style={{ borderColor: colorTheme }}>
                                <Text className="text-[20px] font-semibold" style={{ color: textPrimary }}>
                                    {focus.time[0]}h{focus.time[1]}m
                                </Text>
                            </View>
                            <View className="mt-4 items-center">
                                <Text className="text-[12px]" style={{ color: textPrimary }}>
                                    {focus.time[0]}h{focus.time[1]}m
                                </Text>
                                <Text className="text-[12px]" style={{ color: textSecondary }}>Unclass...</Text>
                            </View>
                        </View>

                        <View className="mt-6">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-[15px] font-semibold" style={{ color: textPrimary }}>
                                    Focus Ranking
                                </Text>
                                <View className="flex-row items-center gap-x-2">
                                    <Text className="text-[12px]" style={{ color: textSecondary }}>List</Text>
                                    <ChevronRight size={16} color={isDark ? "#6B7280" : "#9CA3AF"} />
                                </View>
                            </View>
                            <View className="mt-3">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-[12px]" style={{ color: textSecondary }}>Unclassified</Text>
                                    <Text className="text-[12px]" style={{ color: textSecondary }}>
                                        {focus.time[0]}h{focus.time[1]}m • 100%
                                    </Text>
                                </View>
                                <View className="h-[6px] rounded-full mt-2" style={{ backgroundColor: isDark ? "#1F2937" : "#E5E7EB" }}>
                                    <View className="h-[6px] rounded-full w-full" style={{ backgroundColor: colorTheme }} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="rounded-2xl p-4 mt-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[15px] font-semibold" style={{ color: textPrimary }}>
                                Trends
                            </Text>
                            <View className="flex-row items-center gap-x-2">
                                <TouchableOpacity
                                    onPress={() => {
                                        setWeekStartDate((prev) => {
                                            const next = new Date(prev);
                                            next.setDate(next.getDate() - 7);
                                            return next;
                                        });
                                    }}
                                >
                                    <ChevronLeft size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                                </TouchableOpacity>
                                <Text className="text-[12px]" style={{ color: textPrimary }}>
                                    {formatWeekRange(weekStartDate)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!canGoForwardWeek) return;
                                        setWeekStartDate((prev) => {
                                            const next = new Date(prev);
                                            next.setDate(next.getDate() + 7);
                                            return next;
                                        });
                                    }}
                                    disabled={!canGoForwardWeek}
                                >
                                    <ChevronRight size={18} color={canGoForwardWeek ? (isDark ? "#6B7280" : "#9CA3AF") : "#E5E7EB"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="mt-6">
                            <View className="h-[160px] rounded-2xl px-2 py-3" style={{ backgroundColor: isDark ? "#111827" : "#F7F8FA" }}>
                                <Svg width="100%" height="100%" viewBox="0 0 320 140">
                                    <Defs>
                                        <LinearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <Stop offset="0%" stopColor={colorTheme} stopOpacity="0.35" />
                                            <Stop offset="100%" stopColor={colorTheme} stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    {(() => {
                                        const maxVal = Math.max(...weeklySeries, 1);
                                        const paddingX = 12;
                                        const paddingY = 10;
                                        const width = 320 - paddingX * 2;
                                        const height = 140 - paddingY * 2;
                                        const stepX = width / 6;
                                        const points = weeklySeries.map((val, idx) => {
                                            const x = paddingX + stepX * idx;
                                            const y = paddingY + height - (val / maxVal) * height;
                                            return { x, y };
                                        });
                                        const linePath = points
                                            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                                            .join(" ");
                                        const areaPath = `${linePath} L ${paddingX + width} ${paddingY + height} L ${paddingX} ${paddingY + height} Z`;

                                        return (
                                            <>
                                                <Path d={areaPath} fill="url(#trendGradient)" />
                                                <Path d={linePath} stroke={colorTheme} strokeWidth={3} fill="none" />
                                                {points.map((p, idx) => (
                                                    <Circle key={idx} cx={p.x} cy={p.y} r={4} fill={colorTheme} />
                                                ))}
                                            </>
                                        );
                                    })()}
                                </Svg>
                            </View>
                            <View className="flex-row justify-between mt-2 px-1">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                                    <Text key={label} className="text-[11px]" style={{ color: textSecondary }}>
                                        {label}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View className="rounded-2xl p-4 mt-4 shadow-sm" style={{ backgroundColor: cardBg }}>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[15px] font-semibold" style={{ color: textPrimary }}>
                                Focus Record
                            </Text>
                            <TouchableOpacity className="w-8 h-8 rounded-full items-center justify-center">
                                <Plus size={18} color={colorTheme} />
                            </TouchableOpacity>
                        </View>
                        {thisWeekDocs.map((x: any) => (
                            <View key={x.id} className="mt-3 rounded-2xl p-3" style={{ backgroundColor: isDark ? "#111827" : "#F7F8FA" }}>
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-[14px]" style={{ color: textPrimary }}>
                                            {formatRelativeDate(x.date)}
                                        </Text>
                                        <Text className="text-[12px] mt-1" style={{ color: textSecondary }}>
                                            {formatTime(x.startTime)} - {formatTime(x.endTime)}
                                        </Text>
                                        {x.taskId && <Text style={{ color: textSecondary }}>{x.taskName}</Text>}
                                    </View>
                                    <Text className="text-[12px]" style={{ color: textSecondary }}>
                                        {formatMinutesToHours(x.focusDuration)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default FocusStatsModal;
