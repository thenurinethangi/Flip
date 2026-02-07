import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeContextType = {
    currentTheme: string;
    toggleTheme: (newTheme: string) => void;
    useSystemTheme: boolean;
    setUseSystemTheme: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: "light",
    toggleTheme: () => { },
    useSystemTheme: true,
    setUseSystemTheme: () => { },
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<string>(systemTheme || "light");
    const [useSystemTheme, setUseSystemTheme] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme.current");
                const savedUseSystem = await AsyncStorage.getItem("theme.useSystem");
                const useSystem = savedUseSystem !== "false";

                if (useSystem) {
                    setUseSystemTheme(true);
                    if (systemTheme) {
                        setTheme(systemTheme);
                    }
                } else if (savedTheme) {
                    setUseSystemTheme(false);
                    setTheme(savedTheme);
                }
            } catch {
                if (systemTheme) {
                    setTheme(systemTheme);
                }
            } finally {
                setIsLoaded(true);
            }
        };

        loadTheme();
    }, [systemTheme]);

    useEffect(() => {
        if (!isLoaded) return;
        if (useSystemTheme && systemTheme) {
            setTheme(systemTheme);
        }
    }, [isLoaded, systemTheme, useSystemTheme]);

    const toggleTheme = (newTheme: string) => {
        setUseSystemTheme(false);
        setTheme(newTheme);
    };

    useEffect(() => {
        if (!isLoaded) return;
        void AsyncStorage.setItem("theme.current", theme);
        void AsyncStorage.setItem("theme.useSystem", String(useSystemTheme));
    }, [isLoaded, theme, useSystemTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme, useSystemTheme, setUseSystemTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
