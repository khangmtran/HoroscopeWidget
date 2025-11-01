import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const WidgetSelector = () => {
  const { theme, setTheme } = useTheme();
  const handlePress = (size: "small" | "medium" | "large") => {
    setTheme((prev) => ({ ...prev, widgetSize: size }));
    if (__DEV__) {
      console.log(`set ${size} widget`);
    }
  };
  return (
    <View className="">
      <Text className="text-2xl font-bold mb-1 color-white">Widget Sizes</Text>
      <View className="flex-row justify-between p-2 border rounded-xl mb-5 bg-white">
        <Pressable onPress={() => handlePress("small")}>
          <Text
            className="text-lg font-medium border rounded-lg p-2"
            style={{
              backgroundColor: theme.widgetSize === "small" ? "white" : "gray",
            }}
          >
            Small
          </Text>
        </Pressable>

        <Pressable onPress={() => handlePress("medium")}>
          <Text
            className="text-lg font-medium border rounded-lg p-2"
            style={{
              backgroundColor: theme.widgetSize === "medium" ? "white" : "gray",
            }}
          >
            Medium
          </Text>
        </Pressable>

        <Pressable onPress={() => handlePress("large")}>
          <Text
            className="text-lg font-medium border rounded-lg p-2"
            style={{
              backgroundColor: theme.widgetSize === "large" ? "white" : "gray",
            }}
          >
            Large
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WidgetSelector;
