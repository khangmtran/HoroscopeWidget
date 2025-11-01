"use no memo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Linking } from "react-native";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { MainWidget } from "./MainWidget";

const nameToWidget = {
  HoroscopeSmall: MainWidget,
  HoroscopeMedium: MainWidget,
  HoroscopeLarge: MainWidget,
};

const getWidgetSize = (widgetName: string): "small" | "medium" | "large" => {
  if (widgetName === "HoroscopeSmall") return "small";
  if (widgetName === "HoroscopeMedium") return "medium";
  if (widgetName === "HoroscopeLarge") return "large";
  return "medium";
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  const widgetSize = getWidgetSize(widgetInfo.widgetName);
  const horoscopeText =
    (await AsyncStorage.getItem("horoscope")) ?? "Loading..";
  const bgColor = (await AsyncStorage.getItem("bg_color")) ?? "#000000";
  const textColor = (await AsyncStorage.getItem("text_color")) ?? "#FFFFFF";
  const textFont = (await AsyncStorage.getItem("text_font")) ?? "Inter";

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      props.renderWidget(
        <Widget
          horoscopeText={horoscopeText}
          bgColor={bgColor}
          textColor={textColor}
          textFont={textFont}
          widgetSize={widgetSize}
        />
      );
      break;

    case "WIDGET_DELETED":
      break;

    case "WIDGET_CLICK":
      if (props.clickAction === "OPEN_APP") {
        Linking.openURL("horoscopeapp://").catch((err) => {
          console.error("Failed to open app:", err);
        });
      }
      break;

    default:
      break;
  }
}
