import { Tabs } from "expo-router";
import React, { useContext } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppIcon } from "@/components/ui/icon-symbol";
import { ThemeContext } from "@/context/themeContext";

export default function TabLayout() {

  const { currentTheme } = useContext(ThemeContext);

  const isLight = currentTheme === "light";

  const inactiveColor = isLight ? "#6A7282" : "#4B4B4B";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#4772FA",
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: isLight ? "#F5F6F8" : "#000000",
          borderTopWidth: 0,
          borderTopColor: isLight ? "#F5F6F8" : "#000000",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: "Home",
          tabBarIcon: ({ color }) => <AppIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarShowLabel: false,
          title: "Explore",
          tabBarIcon: ({ color }) => <AppIcon name="Calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          tabBarShowLabel: false,
          title: "Focus",
          tabBarIcon: ({ color }) => <AppIcon name="Disc" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habit"
        options={{
          tabBarShowLabel: false,
          title: "Habit",
          tabBarIcon: ({ color }) => <AppIcon name="layers" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          title: "Profile",
          tabBarIcon: ({ color }) => <AppIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
