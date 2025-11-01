import { BottomSheetModal, BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { forwardRef, useRef, useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import ColorModal from "./CusSheetComponents/ColorModal";
import FontModal from "./CusSheetComponents/FontModal";
import TopicModal from "./CusSheetComponents/TopicModal";
import WidgetSelector from "./CusSheetComponents/WidgetSelector";

type SectionItem = string;
type Section = {
  title: string;
  data: SectionItem[];
};

const CustomizeSheet = forwardRef<BottomSheetModal>((props, ref) => {
  const { theme } = useTheme();
  const colorModalRef = useRef<BottomSheetModal>(null);
  const fontModalRef = useRef<BottomSheetModal>(null);
  const topicModalRef = useRef<BottomSheetModal>(null);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  // Snap points for the bottom sheet
  const sections: Section[] = [
    { title: "", data: ["Widget Selector"] },
    { title: "Appearances", data: ["Background Color", "Text Color", "Font"] },
    { title: "Settings", data: ["Topic"] },
  ];

  const renderRightContent = (item: string) => {
    switch (item) {
      case "Background Color":
        return (
          <Image
            source={require("../assets/icons/palette.png")}
            style={{ width: 20, height: 20 }}
          />
        );
      case "Text Color":
        return (
          <Image
            source={require("../assets/icons/palette.png")}
            style={{ width: 20, height: 20 }}
          />
        );
      case "Font":
        return (
          <Text className="text-lg font-bold color-blueButton">
            {theme.textFont}
          </Text>
        );
      case "Topic":
        return (
          <Text className="text-lg font-bold color-blueButton">
            {theme.topic}
          </Text>
        );
      default:
        return null;
    }
  };

  const renderSectionHeader = ({ section }: { section: Section }) => {
    // for WidgetSelector section
    if (!section.title) {
      return null;
    }

    return (
      <View>
        <Text className="text-2xl font-bold mb-1 color-white">
          {section.title}
        </Text>
        <View className="border p-3 rounded-2xl mb-5 bg-white">
          {section.data.map((item, index) => {
            const isLast = index === section.data.length - 1;
            return (
              <React.Fragment key={item}>
                {renderItem({ item, isLast })}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({
    item,
    isLast,
  }: {
    item: SectionItem;
    isLast?: boolean;
  }) => {
    // for Widget Selector
    if (item === "Widget Selector") {
      return <WidgetSelector />;
    }

    // Regular items
    return (
      <View
        className="flex-row justify-between items-center"
        style={{ marginBottom: isLast ? 0 : 20 }}
      >
        <Text className="text-lg font-medium">{item}</Text>
        <Pressable
          onPress={() => {
            if (item === "Background Color" || item === "Text Color") {
              setSelectedModal(item);
              colorModalRef.current?.present();
            } else if (item === "Font") {
              fontModalRef.current?.present();
            } else if (item === "Topic") {
              topicModalRef.current?.present();
            }
          }}
        >
          {renderRightContent(item)}
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <BottomSheetModal
        ref={ref}
        snapPoints={["30%", "55%"]}
        index={1}
        backgroundStyle={{ borderRadius: 25, backgroundColor: "#000021" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        handleStyle={{ height: 30 }}
      >
        <ImageBackground
          source={require("../assets/images/bg.png")}
          style={{ flex: 1 }}
        >
          <View className="px-5 flex-1">
            <View className="flex-row justify-end px-3">
              <Pressable
                onPress={() =>
                  ref &&
                  (ref as React.RefObject<BottomSheetModal>).current?.close()
                }
              >
                <Text className="text-xl" style={{ color: "white" }}>
                  Close
                </Text>
              </Pressable>
            </View>
            <WidgetSelector />
            <BottomSheetSectionList
              sections={sections}
              keyExtractor={(i: string) => i}
              renderSectionHeader={renderSectionHeader}
              renderItem={() => null}
            />
          </View>
        </ImageBackground>
      </BottomSheetModal>
      <ColorModal ref={colorModalRef} selectedModal={selectedModal} />
      <FontModal ref={fontModalRef} />
      <TopicModal ref={topicModalRef} />
    </>
  );
});

export default CustomizeSheet;
