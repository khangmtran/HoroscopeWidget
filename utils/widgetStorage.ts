import { ExtensionStorage } from "@bacons/apple-targets";
import { Platform } from "react-native";

const APP_GROUP = "group.KnT.DailyHoroscope";

export interface WidgetData {
  bgColor: string;
  textColor: string;
  textFont: string;
  horoscope: string;
}

export class WidgetStorageManager {
  private storage: ExtensionStorage | null = null;

  constructor() {
    if (Platform.OS === "ios") {
      this.storage = new ExtensionStorage(APP_GROUP);
    }
  }

  // Get current widget data
  private getWidgetData(): Partial<WidgetData> {
    if (!this.storage) return {};

    const data = this.storage.get("widgetData");
    if (!data) return {};

    try {
      return JSON.parse(data) as Partial<WidgetData>;
    } catch {
      return {};
    }
  }

  saveWidgetTheme(bgColor: string, textColor: string, textFont: string) {
    if (!this.storage) return;

    const currentData = this.getWidgetData();

    this.storage.set(
      "widgetData",
      JSON.stringify({
        ...currentData,
        bgColor,
        textColor,
        textFont,
      })
    );

    ExtensionStorage.reloadWidget();
  }

  saveWidgetData(horoscope: string) {
    if (!this.storage) return;

    const currentData = this.getWidgetData();

    this.storage.set(
      "widgetData",
      JSON.stringify({
        ...currentData,
        horoscope,
      })
    );

    ExtensionStorage.reloadWidget();
  }

  clearWidgetData() {
    if (!this.storage) return;
    this.storage.remove("widgetData");
    ExtensionStorage.reloadWidget();
  }
}

export const widgetStorage = new WidgetStorageManager();
