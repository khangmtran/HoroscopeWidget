import { useFonts } from "expo-font";
import { createContext, useContext } from "react";

export type FontContextType = {
  fonts: string[];
  fontsLoaded: boolean;
};

const FontContext = createContext<FontContextType | null>(null);

export function useFont(): FontContextType {
  const context = useContext(FontContext);
  if (!context) throw new Error("useFont must be used within FontProvider");
  return context;
}

export const fontNames = [
  "Roboto",
  "OpenSans",
  "FuzzyBubbles",
  "Creepster",
  "Delius",
  "Monoton",
  "Montserrat",
  "Playfair",
  "Sansation",
  "SpecialElite",
  "VT323",
];

// Font provider
export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, fontError] = useFonts({
    Roboto: require("../assets/fonts/Roboto-Regular.ttf"),
    OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
    FuzzyBubbles: require("../assets/fonts/FuzzyBubbles-Regular.ttf"),
    Creepster: require("../assets/fonts/Creepster-Regular.ttf"),
    Delius: require("../assets/fonts/Delius-Regular.ttf"),
    Monoton: require("../assets/fonts/Monoton-Regular.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    Playfair: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    Sansation: require("../assets/fonts/Sansation-Regular.ttf"),
    SpecialElite: require("../assets/fonts/SpecialElite-Regular.ttf"),
    VT323: require("../assets/fonts/VT323-Regular.ttf"),
  });
  if (__DEV__) {
    if (fontError) {
      console.error("Error loading fonts:", fontError);
    }
  }

  return (
    <FontContext.Provider value={{ fonts: fontNames, fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
}
