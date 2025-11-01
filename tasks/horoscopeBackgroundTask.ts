import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { getZodiacDate } from "../contexts/HoroscopeContext";
import { updateAllWidgets } from "../contexts/ThemeContext";
import HoroscopeService from "../services/HoroscopeService";
import { widgetStorage } from "../utils/widgetStorage";

const HOROSCOPE_BACKGROUND_TASK = "horoscope-background-fetch";

TaskManager.defineTask(HOROSCOPE_BACKGROUND_TASK, async () => {
  try {
    if (__DEV__) {
      console.log("🌙 Background task started - fetching horoscope...");
    }
    const zodiac = (await AsyncStorage.getItem("zodiac")) || "Aquarius";
    const topic = (await AsyncStorage.getItem("topic")) || "General";
    const zodiacDate = getZodiacDate(zodiac) || "2025-01-20";
    const newHoroscope = await HoroscopeService.fetchDailyHoroscope(
      zodiacDate,
      topic
    );
    if (__DEV__) {
      console.log(newHoroscope);
    }
    // Save to AsyncStorage
    await AsyncStorage.setItem("horoscope", newHoroscope);

    // Save to widget storage (for iOS)
    await widgetStorage.saveWidgetData(newHoroscope);

    // Update all widgets using the exported function
    await updateAllWidgets();
    if (__DEV__) {
      console.log("✅ Background task completed successfully");
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("❌ Background task failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerHoroscopeBackgroundTask() {
  try {
    await BackgroundTask.registerTaskAsync(HOROSCOPE_BACKGROUND_TASK, {
      minimumInterval: 60 * 60 * 3, // 3 hours
      //minimumInterval: 60 * 15,
    });
    if (__DEV__) {
      console.log("✅ Background task registered");
    }
  } catch (error) {
    console.error("❌ Failed to register background task:", error);
  }
}
