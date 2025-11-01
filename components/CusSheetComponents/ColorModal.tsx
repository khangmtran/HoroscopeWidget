import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import oc from "open-color";
import React, { forwardRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

type ColorModalProps = {
  selectedModal: string | null;
};

const ColorModal = forwardRef<BottomSheetModal, ColorModalProps>(
  (props, ref) => {
    const { selectedModal } = props;
    const { theme, setTheme } = useTheme();
    const colorPalette = [
      "#FFFFFF",
      ...oc.gray,
      "#000000",
      ...oc.red,
      ...oc.pink,
      ...oc.grape,
      ...oc.violet,
      ...oc.indigo,
      ...oc.blue,
      ...oc.cyan,
      ...oc.teal,
      ...oc.green,
      ...oc.lime,
      ...oc.yellow,
      ...oc.orange,
    ];

    const handleColorPress = (color: string) => {
      if (selectedModal === "Background Color") {
        if (__DEV__) {
          console.log("bg change");
        }
        setTheme((prev) => ({ ...prev, bgColor: color }));
      }
      if (selectedModal === "Text Color") {
        if (__DEV__) {
          console.log("text change");
        }
        setTheme((prev) => ({ ...prev, textColor: color }));
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["30%", "75%"]}
        index={1}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        handleStyle={{ height: 30 }}
      >
        <View className="flex-row justify-between px-7 mb-2">
          <View className="">
            <Text className="text-2xl font-bold">{selectedModal}</Text>
          </View>

          <Pressable
            className=""
            onPress={() =>
              ref && (ref as React.RefObject<BottomSheetModal>).current?.close()
            }
          >
            <Text className="text-xl" style={{ color: "gray" }}>
              Close
            </Text>
          </Pressable>
        </View>

        {/* widget preview */}
        <View className="m-5">
          <View
            className="w-40 h-40 mb-2 self-center border items-center justify-center"
            style={{ backgroundColor: theme.bgColor }}
          >
            <Text
              style={{ color: theme.textColor, fontFamily: theme.textFont }}
            >
              Preview
            </Text>
          </View>
        </View>

        {/* color palette */}
        <BottomSheetFlatList
          data={colorPalette}
          keyExtractor={(item: string) => item}
          numColumns={12}
          contentContainerStyle={{
            paddingLeft: 25,
          }}
          renderItem={({ item }: { item: string }) => (
            <Pressable
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: item, margin: 4 }}
              onPress={() => handleColorPress(item)}
            />
          )}
        />
      </BottomSheetModal>
    );
  }
);

export default ColorModal;

const styles = StyleSheet.create({});
