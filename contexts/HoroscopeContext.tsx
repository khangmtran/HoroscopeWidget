import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import HoroscopeService from "../services/HoroscopeService";
import { widgetStorage } from "../utils/widgetStorage";
import { updateAllWidgets, useTheme } from "./ThemeContext";

export type HoroscopeState = {
  data: string;
  isLoading: boolean;
  error: string | null;
};

export type HoroscopeContextType = {
  horoscope: HoroscopeState;
  refreshHoroscope: () => Promise<void>;
};

const HoroscopeContext = createContext<HoroscopeContextType | null>(null);

export function useHoroscope(): HoroscopeContextType {
  const context = useContext(HoroscopeContext);
  if (!context) {
    throw new Error("useHoroscope must be used within HoroscopeProvider");
  }
  return context;
}

export const zodiacDates: Record<string, string> = {
  Aquarius: "01-20",
  Pisces: "02-19",
  Aries: "03-21",
  Taurus: "04-20",
  Gemini: "05-21",
  Cancer: "06-21",
  Leo: "07-23",
  Virgo: "08-23",
  Libra: "09-23",
  Scorpio: "10-23",
  Sagittarius: "11-22",
  Capricorn: "12-22",
};

const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export function HoroscopeProvider({ children }: { children: React.ReactNode }) {
  const isFirstRender = useRef(true);
  const hasInitiallyLoaded = useRef(false);
  const { theme } = useTheme();
  const [horoscope, setHoroscope] = useState<HoroscopeState>({
    data: "",
    isLoading: true,
    error: null,
  });

  const fetchHoroscope = useCallback(async () => {
    try {
      setHoroscope((prev) => ({ ...prev, isLoading: true, error: null }));

      const zodiacDate = getZodiacDate(theme.zodiac) || "2025-01-20";
      const horoscopeData = await HoroscopeService.fetchDailyHoroscope(
        zodiacDate,
        theme.topic
      );

      setHoroscope({ data: horoscopeData, isLoading: false, error: null });

      // Save data + timestamp
      await widgetStorage.saveWidgetData(horoscopeData);
      await AsyncStorage.setItem("horoscope", horoscopeData);
      await AsyncStorage.setItem("lastFetchTime", Date.now().toString());

      await updateAllWidgets();
      if (__DEV__) console.log("Horoscope updated & widgets refreshed");
    } catch (error) {
      console.error("Failed to fetch horoscope:", error);
      setHoroscope({
        data: "",
        isLoading: false,
        error: "Failed to load horoscope",
      });
    }
  }, [theme.zodiac, theme.topic]);

  const refreshHoroscope = useCallback(async () => {
    await fetchHoroscope();
  }, [fetchHoroscope]);

  const checkAndFetch = useCallback(async () => {
    try {
      const lastFetch = await AsyncStorage.getItem("lastFetchTime");
      const lastTime = lastFetch ? parseInt(lastFetch, 10) : 0;
      const now = Date.now();

      if (!lastTime || now - lastTime >= THREE_HOURS) {
        if (__DEV__) console.log("Fetching new horoscope...");
        await fetchHoroscope();
      } else {
        if (__DEV__) {
          console.log(
            `Skipping fetch. Only ${(now - lastTime) / (1000 * 60)} minutes passed`
          );
        }

        const cached = await AsyncStorage.getItem("horoscope");
        if (cached) {
          setHoroscope({ data: cached, isLoading: false, error: null });
        } else {
          await fetchHoroscope();
        }
      }
    } catch (error) {
      console.error("Error checking fetch interval:", error);
      await fetchHoroscope();
    }
  }, [fetchHoroscope]);

  //run when theme change, isFirstRender to prevent fetch on launch
  useEffect(() => {
    if (theme.isLoading) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchHoroscope();
  }, [theme.topic, theme.zodiac]);

  // Run once when app loads, hasInitiallyLoaded to prevent re-run on any cases
  useEffect(() => {
    if (theme.isLoading) return;
    if (hasInitiallyLoaded.current) return;
    hasInitiallyLoaded.current = true;
    checkAndFetch();
  }, [theme.isLoading]);

  // Run when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (__DEV__) console.log("App active");
        checkAndFetch();
      }
    });
    return () => subscription.remove();
  }, [checkAndFetch]);

  return (
    <HoroscopeContext.Provider value={{ horoscope, refreshHoroscope }}>
      {children}
    </HoroscopeContext.Provider>
  );
}

export const getZodiacDate = (zodiacName?: string): string | null => {
  if (!zodiacName) return null;
  const retDate = zodiacDates[zodiacName];
  return retDate ? `2025-${retDate}` : null;
};
