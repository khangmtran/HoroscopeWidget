import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { requestWidgetUpdate } from "react-native-android-widget";
import { widgetStorage } from "../utils/widgetStorage";
import { MainWidget } from "../widgets/MainWidget";

export type ThemeState = {
  bgColor: string;
  textColor: string;
  textFont: string;
  widgetSize: string;
  topic: string;
  zodiac: string;
  isLoading: boolean;
};

export type ThemeContextType = {
  theme: ThemeState;
  setTheme: Dispatch<SetStateAction<ThemeState>>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>({
    bgColor: "white",
    textColor: "black",
    textFont: "system",
    widgetSize: "medium",
    topic: "string",
    zodiac: "string",
    isLoading: true,
  });

  // Load theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedBgColor = await AsyncStorage.getItem("bg_color");
        const savedTextColor = await AsyncStorage.getItem("text_color");
        const savedTextFont = await AsyncStorage.getItem("text_font");
        const savedWidgetSize = await AsyncStorage.getItem("widget_size");
        const savedTopic = await AsyncStorage.getItem("topic");
        const savedZodiac = await AsyncStorage.getItem("zodiac");
        setTheme({
          bgColor: savedBgColor || "#000000",
          textColor: savedTextColor || "#FFFFFF",
          textFont: savedTextFont || "system",
          widgetSize: savedWidgetSize || "medium",
          topic: savedTopic || "General",
          zodiac: savedZodiac || "Aquarius",
          isLoading: false,
        });
      } catch (error) {
        console.log("Error loading theme", error);
        setTheme((prev) => ({ ...prev, isLoading: false }));
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage
  useEffect(() => {
    const saveThemeAndUpdateWidgets = async () => {
      if (!theme.isLoading) {
        try {
          // Save to AsyncStorage
          await AsyncStorage.setItem("bg_color", theme.bgColor);
          await AsyncStorage.setItem("text_color", theme.textColor);
          await AsyncStorage.setItem("text_font", theme.textFont);
          await AsyncStorage.setItem("widget_size", theme.widgetSize);
          await AsyncStorage.setItem("topic", theme.topic);
          await AsyncStorage.setItem("zodiac", theme.zodiac);

          // Save to widget storage
          await widgetStorage.saveWidgetTheme(
            theme.bgColor,
            theme.textColor,
            theme.textFont
          );

          // Update all widgets
          await updateAllWidgets();
        } catch (error) {
          console.log("Error saving theme or updating widgets:", error);
        }
      }
    };

    saveThemeAndUpdateWidgets();
  }, [
    theme.bgColor,
    theme.textColor,
    theme.textFont,
    theme.widgetSize,
    theme.topic,
    theme.zodiac,
    theme.isLoading,
  ]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const updateAllWidgets = async () => {
  try {
    const horoscopeText =
      (await AsyncStorage.getItem("horoscope")) ?? "Loading..";
    const bgColor = (await AsyncStorage.getItem("bg_color")) ?? "#000000";
    const textColor = (await AsyncStorage.getItem("text_color")) ?? "#FFFFFF";
    const textFont = (await AsyncStorage.getItem("text_font")) ?? "Inter";

    await requestWidgetUpdate({
      widgetName: "HoroscopeSmall",
      renderWidget: () => (
        <MainWidget
          horoscopeText={horoscopeText}
          bgColor={bgColor}
          textColor={textColor}
          textFont={textFont}
          widgetSize="small"
        />
      ),
    });
    await requestWidgetUpdate({
      widgetName: "HoroscopeMedium",
      renderWidget: () => (
        <MainWidget
          horoscopeText={horoscopeText}
          bgColor={bgColor}
          textColor={textColor}
          textFont={textFont}
          widgetSize="medium"
        />
      ),
    });
    await requestWidgetUpdate({
      widgetName: "HoroscopeLarge",
      renderWidget: () => (
        <MainWidget
          horoscopeText={horoscopeText}
          bgColor={bgColor}
          textColor={textColor}
          textFont={textFont}
          widgetSize="large"
        />
      ),
    });
  } catch (error) {
    console.log("Error updating widgets:", error);
  }
};
