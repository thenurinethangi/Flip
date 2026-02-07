import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";

const COLOR_SERIES = {
    "#4772FA": "#4772FA",
    "#7ED6E3": "#7ED6E3",
    "#78E0D0": "#78E0D0",
    "#C7E2B1": "#C7E2B1",
    "#FFD28E": "#FFD28E",
    "#F7B2C4": "#F7B2C4",
    "#C9B8FF": "#C9B8FF",
    "#EDEDED": "#EDEDED",
    "#7D7F85": "#7D7F85",
    "#B7E6FF": "#B7E6FF",
};

export type ColorContextType = {
    colorTheme: string;
    toggleColor: (color: string) => void;
};

export const ColorContext = createContext<ColorContextType>({
    colorTheme: "#4772FA",
    toggleColor: () => { },
});

const ColorProvider = ({ children }: { children: ReactNode }) => {
    const [color, setColor] = useState<string>(COLOR_SERIES['#4772FA']);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadColor = async () => {
            try {
                const savedColor = await AsyncStorage.getItem("theme.color");
                if (savedColor) {
                    setColor(savedColor);
                }
            }
            catch {
                setColor('#4772FA');

            } finally {
                setIsLoaded(true);
            }
        };

        loadColor();
    }, []);

    const toggleColor = (c: string) => {
        setColor(c);
    };

    useEffect(() => {
        if (!isLoaded) return;
        void AsyncStorage.setItem("theme.color", color);
    }, [color, isLoaded]);

    return (
        <ColorContext.Provider value={{ colorTheme: color, toggleColor: toggleColor }}>
            {children}
        </ColorContext.Provider>
    );
};

export default ColorProvider;
