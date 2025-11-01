import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomizeSheet from "../components/CustomizeSheet";
import TutorialSheet from "../components/TutorialSheet";
import WidgetPreview from "../components/WidgetPreview";
import ZodiacSheet, { ZodiacData } from "../components/ZodiacSheet";
import { useTheme } from "../contexts/ThemeContext";

export default function Index() {
  const { theme } = useTheme();
  // control bottom sheet
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const zodiacSheetRef = useRef<BottomSheet>(null);
  const tutorialSheetRef = useRef<BottomSheet>(null);
  const selectedZodiac = ZodiacData.find((z) => z.name === theme.zodiac);
  return (
    <GestureHandlerRootView>
      {/* wraps screen to enable modals */}
      <BottomSheetModalProvider>
        <View className="flex-1">
          {/* header */}
          <View className="flex-row justify-end mt-14 mx-2">
            <Pressable
              className="items-center"
              onPress={() => {
                tutorialSheetRef.current?.expand();
              }}
            >
              <Image
                source={require("../assets/icons/information.png")}
                style={{ width: 20, height: 20, tintColor: "#4287f5" }}
              />
              <Text className="color-gray-500">Widget Tutorial</Text>
            </Pressable>
          </View>
          <View className="items-center justify-center">
            <Text className="text-3xl font-bold">Daily Horoscope</Text>
            <View className="flex-row gap-2 items-center">
              <Text className="text-2xl my-1 italic">{theme.zodiac}</Text>
              {selectedZodiac && (
                <Image
                  source={selectedZodiac.icon}
                  style={{ width: 18, height: 18 }}
                />
              )}
            </View>
            <Text style={{ color: "gray" }}>
              Customize your horoscope widget
            </Text>
            <Text style={{ color: "gray" }}>
              Set your sign, add font styles, colors and more
            </Text>
          </View>
          {/* main content */}
          <View className="flex-1 ">
            {/* widget */}
            <WidgetPreview />
            {/* buttons */}
            <View className="flex-row justify-between items-center">
              {/* customize button */}
              <View className="p-5 mb-5">
                <Pressable onPress={() => bottomSheetRef.current?.present()}>
                  <View className="border rounded-2xl self-start p-3.5 bg-white">
                    <View className="flex-row gap-2 items-center">
                      <Image
                        source={require("../assets/icons/customize.png")}
                        style={{ width: 18, height: 18 }}
                      />
                      <Text className="text-lg font-bold">Customize</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
              {/* setting button */}
              <View className="p-5 mb-5">
                <Pressable onPress={() => zodiacSheetRef.current?.expand()}>
                  <View className="border rounded-2xl self-start p-3.5 bg-white">
                    <View className="flex-row gap-2 items-center">
                      <Image
                        source={require("../assets/icons/zodiac_wheel.png")}
                        style={{ width: 18, height: 18 }}
                      />
                      <Text className="text-lg font-bold">Zodiac Signs</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* bottom sheet */}
            <CustomizeSheet ref={bottomSheetRef} />
            <ZodiacSheet ref={zodiacSheetRef} />
            <TutorialSheet ref={tutorialSheetRef} />
          </View>
          {/* end of main content */}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
