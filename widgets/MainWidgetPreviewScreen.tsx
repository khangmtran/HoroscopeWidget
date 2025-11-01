import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { WidgetPreview } from "react-native-android-widget";
import { useHoroscope } from "../contexts/HoroscopeContext";
import { useTheme } from "../contexts/ThemeContext";
import { MainWidget } from "./MainWidget";

type WidgetSize = "small" | "medium" | "large";

export function MainWidgetPreviewScreen() {
  const { theme } = useTheme();
  const { horoscope } = useHoroscope();
  const { width: screenWidth } = Dimensions.get("window");

  const horoscopeText = horoscope.error || horoscope.data || "Loading...";
  const widgetSize: WidgetSize = theme.widgetSize as WidgetSize;
  
  // iOS WidgetKit default sizes (points)
  const iosSizes: Record<WidgetSize, { w: number; h: number }> = {
    small: { w: 155, h: 155 },
    medium: { w: 329, h: 155 },
    large: { w: 329, h: 345 },
  };

  const baseSize = iosSizes[widgetSize];
  const scale = screenWidth / 375;
  const width = baseSize.w * scale;
  const height = baseSize.h * scale;

  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => (
          <MainWidget
            horoscopeText={horoscopeText}
            bgColor={theme.bgColor}
            textColor={theme.textColor}
            textFont={theme.textFont}
            widgetSize={widgetSize}
          />
        )}
        width={width}
        height={height}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
