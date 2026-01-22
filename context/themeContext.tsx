import { createContext, ReactNode, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeContextType = {
    currentTheme: string;
    toggleTheme: (newTheme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: "light",
    toggleTheme: () => { },
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<string>(systemTheme || "light");

    useEffect(() => {
        if (systemTheme) {
            setTheme(systemTheme);
        }
    }, [systemTheme]);

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
