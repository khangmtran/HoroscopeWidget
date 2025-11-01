import React from "react";
import { Dimensions, Text, View } from "react-native";
import { useHoroscope } from "../contexts/HoroscopeContext";
import { useTheme } from "../contexts/ThemeContext";

type WidgetSize = "small" | "medium" | "large";

interface WidgetPreviewProps {
  size?: WidgetSize;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = () => {
  const { theme } = useTheme();
  const { width: screenWidth } = Dimensions.get("window");
  const { horoscope } = useHoroscope();
  const horoscopeText = horoscope.error || horoscope.data || "Loading...";
  const widgetSize: WidgetSize = theme.widgetSize as WidgetSize;

  // iOS WidgetKit default sizes (points)
  const iosSizes: Record<WidgetSize, { w: number; h: number }> = {
    small: { w: 155, h: 155 },
    medium: { w: 329, h: 155 },
    large: { w: 329, h: 345 },
  };

  // Hardcoded font size based on widget size and text length
  const getFontSize = () => {
    const textLength = horoscopeText.length;
    
    if (widgetSize === "small") {
      if (textLength < 100) return 16;
      if (textLength < 200) return 14;
      if (textLength < 300) return 12;
      return 10;
    }
    
    if (widgetSize === "medium") {
      if (textLength < 150) return 18;
      if (textLength < 250) return 16;
      if (textLength < 350) return 14;
      return 12;
    }
    
    // large
    if (textLength < 200) return 20;
    if (textLength < 300) return 18;
    if (textLength < 400) return 16;
    return 14;
  };

  const baseSize = iosSizes[widgetSize];
  const scale = screenWidth / 375;
  const width = baseSize.w * scale;
  const height = baseSize.h * scale;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 16,
        backgroundColor: theme.bgColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        alignSelf: "center",
        margin: "auto",
      }}
    >
      <Text
        style={{
          fontSize: getFontSize(),
          color: theme.textColor,
          fontFamily: theme.textFont,
          textAlign: "center",
        }}
      >
        {horoscopeText}
      </Text>
    </View>
  );
};

export default WidgetPreview;
