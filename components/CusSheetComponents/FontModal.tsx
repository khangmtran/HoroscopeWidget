import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useFont } from "../../contexts/FontContext";
import { useTheme } from "../../contexts/ThemeContext";

type FontItem = {
  item: string;
};

const FontModal = forwardRef<BottomSheetModal>((props, ref) => {
  const { fonts } = useFont();
  const { setTheme } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => bottomSheetRef.current!);

  const renderFontItem = ({ item }: FontItem) => (
    <Pressable
      className="basis-[48%] h-32 items-center justify-center bg-black mb-5"
      onPress={() => {
        setTheme((prev) => ({ ...prev, textFont: item }));
        bottomSheetRef.current?.dismiss();
      }}
    >
      <Text
        style={{
          fontFamily: item,
          fontSize: 20,
          color: "white",
          textAlign: "center",
        }}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["30%", "75%"]}
      index={1}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      handleStyle={{ height: 30 }}
    >
      <View className="flex-row justify-between px-7">
        <View className="">
          <Text className="text-2xl font-bold">Fonts</Text>
        </View>

        <Pressable
          onPress={() =>
            ref && (ref as React.RefObject<BottomSheetModal>).current?.close()
          }
        >
          <Text className="text-xl" style={{ color: "gray" }}>
            Close
          </Text>
        </Pressable>
      </View>
      <BottomSheetFlatList
        data={fonts}
        keyExtractor={(item: string) => item}
        numColumns={2}
        contentContainerStyle={{ padding: 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={renderFontItem}
      />
    </BottomSheetModal>
  );
});

export default FontModal;
