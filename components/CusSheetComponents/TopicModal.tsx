import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

type Topic = {
  name: string;
};

const topics: Topic[] = [
  { name: "General" },
  { name: "Love" },
  { name: "Health" },
  { name: "Career" },
];

const TopicModal = forwardRef<BottomSheetModal>((props, ref) => {
  const { theme, setTheme } = useTheme();

  const renderTopicItem = ({ item }: { item: Topic }) => {
    return (
      <Pressable
        onPress={() => setTheme((prev) => ({ ...prev, topic: item.name }))}
      >
        <View className="flex-row justify-between items-center border rounded-2xl p-5 mb-5">
          <Text className="text-lg font-bold">{item.name}</Text>
          {theme.topic === item.name && (
            <Image
              source={require("../../assets/icons/check.png")}
              style={{ width: 18, height: 18 }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["30%", "50%"]}
      index={1}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      handleStyle={{ height: 30 }}
    >
      <View className="flex-row justify-between px-7">
        <View className="">
          <Text className="text-2xl font-bold">Topics</Text>
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
        data={topics}
        keyExtractor={(item: Topic) => item.name}
        renderItem={renderTopicItem}
        contentContainerStyle={styles.listContainer}
      />
    </BottomSheetModal>
  );
});

export default TopicModal;

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
});
