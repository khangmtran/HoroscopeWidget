import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { forwardRef } from "react";
import {
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type ZodiacItem = {
  name: string;
  date: string;
  icon: ImageSourcePropType;
};

const ZodiacSheet = forwardRef<BottomSheet>((props, ref) => {
  const { theme, setTheme } = useTheme();
  return (
    <BottomSheet
      ref={ref}
      enablePanDownToClose
      snapPoints={["50%", "100%"]}
      index={-1}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      handleStyle={{ height: 30 }}
    >
      <View className="px-7 py-2 flex-row justify-between items-center">
        <Text className="text-2xl font-bold">Choose Your Sign</Text>
        <Pressable
          onPress={() =>
            ref && (ref as React.RefObject<BottomSheet>).current?.close()
          }
        >
          <Text className="text-xl" style={{ color: "gray" }}>
            Close
          </Text>
        </Pressable>
      </View>
      <BottomSheetFlatList
        data={ZodiacData}
        keyExtractor={(item: ZodiacItem) => item.name}
        renderItem={({ item }: { item: ZodiacItem }) => (
          <View className="p-5">
            <Pressable
              onPress={() => {
                setTheme((prev) => ({ ...prev, zodiac: item.name }));
                if (__DEV__) {
                  console.log("set zodiac to ", item.name);
                }
              }}
              className="flex-row items-center border rounded-xl py-5"
            >
              <View className="pl-2" style={{ width: "10%" }}>
                <Image source={item.icon} style={{ width: 25, height: 25 }} />
              </View>
              <View className="items-center" style={{ width: "25%" }}>
                <Text className="text-lg font-medium">{item.name}</Text>
              </View>
              <View className="" style={{ width: "55%" }}>
                <Text className="italic text-center">{item.date}</Text>
              </View>
              <View className="pr-2 items-end" style={{ width: "10%" }}>
                {theme.zodiac === item.name && (
                  <Image
                    source={require("../assets/icons/check.png")}
                    style={{ width: 20, height: 20 }}
                  />
                )}
              </View>
            </Pressable>
          </View>
        )}
      />
    </BottomSheet>
  );
});

export default ZodiacSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export const ZodiacData = [
  {
    name: "Aquarius",
    date: "January 20 - February 18",
    icon: require("../assets/icons/aquarius.png"),
  },
  {
    name: "Pisces",
    date: "February 19 - March 20",
    icon: require("../assets/icons/pisces.png"),
  },
  {
    name: "Aries",
    date: "March 21 - April 19",
    icon: require("../assets/icons/aries.png"),
  },
  {
    name: "Taurus",
    date: "April 20 - May 20",
    icon: require("../assets/icons/taurus.png"),
  },
  {
    name: "Gemini",
    date: "May 21 - June 20",
    icon: require("../assets/icons/gemini.png"),
  },
  {
    name: "Cancer",
    date: "June 21 - July 22",
    icon: require("../assets/icons/cancer.png"),
  },
  {
    name: "Leo",
    date: "July 23 - August 22",
    icon: require("../assets/icons/leo.png"),
  },
  {
    name: "Virgo",
    date: "August 23 - September 22",
    icon: require("../assets/icons/virgo.png"),
  },
  {
    name: "Libra",
    date: "September 23 - October 22",
    icon: require("../assets/icons/libra.png"),
  },
  {
    name: "Scorpio",
    date: "October 23 - November 21",
    icon: require("../assets/icons/scorpio.png"),
  },
  {
    name: "Sagittarius",
    date: "November 22 - December 21",
    icon: require("../assets/icons/sagittarius.png"),
  },
  {
    name: "Capricorn",
    date: "December 22 - January 19",
    icon: require("../assets/icons/capricorn.png"),
  },
];
