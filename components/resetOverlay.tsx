import { useLanguage } from "@/context/LanguageContext";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Card {
  month: string; // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string; // optional, unique identifier
  img: string;
  rotation: number;
  title: { en: string; ko: string };
  meaning: { en: string; ko: string };
}

type Props = {
  handleReset: () => void;
  setResetOpen: (value: boolean) => void;
};

const close = { en: "Close", ko: "닫기" };
const question = {
  en: "Are you sure you want to restart?",
  ko: "정말 다시 시작하시겠습니까?",
};
const reset = { en: "Restart", ko: "재시작" };

const months: String[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const ranks = ["A", "B", "C", "D"];

const ResetOverlay = ({ handleReset, setResetOpen }: Props) => {
  const { width: vw, height: vh } = Dimensions.get("window");

  const { lang } = useLanguage();

  const [fontsLoaded] = useFonts({
    // Point directly to your local asset
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
    "Gugi-Regular": require("../assets/fonts/Gugi-Regular.ttf"),
  });

  const [translateReset, setTranslateReset] = useState(0);
  const [translateClose, setTranslateClose] = useState(0);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setResetOpen(false));
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 20,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        opacity,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(235, 235, 235, 0.8)",
          borderRadius: 15,
          padding: 10,
          width: "90%",
          height: "20%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          boxShadow: "inset 1px 2px 3px 3px white, 1px 3px 3px 2px black",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            width: "100%",
            height: "60%",
            backgroundColor: "rgb(42, 83, 60)",
          }}
        >
          <Text
            style={{
              fontSize: vw * 0.06,
              fontFamily: "Gugi-Regular",
              color: "rgba(255, 217, 0, 1)",
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            {question[lang]}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: 10,
            height: vh * 0.05,
          }}
        >
          <Pressable
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
            onPress={() => {
              handleReset();
              handleClose();
            }}
            onPressIn={() => {
              Haptics.selectionAsync();
              setTranslateReset(2);
            }}
            onPressOut={() => setTranslateReset(0)}
          >
            <Animated.View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(88, 88, 88)",
                paddingVertical: 0,
                height: "100%",
                width: "100%",
                borderRadius: 10,
                boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
                transform: [{ translateY: translateReset }],
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: vw * 0.05,
                }}
                allowFontScaling={false}
              >
                {reset[lang]}
              </Text>
            </Animated.View>
          </Pressable>
          <Pressable
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
            onPress={() => handleClose()}
            onPressIn={() => {
              Haptics.selectionAsync();
              setTranslateClose(2);
            }}
            onPressOut={() => setTranslateClose(0)}
          >
            <Animated.View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(219, 0, 0)",
                paddingVertical: 0,
                height: "100%",
                width: "100%",
                borderRadius: 10,
                boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
                transform: [{ translateY: translateClose }],
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: vw * 0.05,
                }}
                allowFontScaling={false}
              >
                {close[lang]}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default ResetOverlay;

const styles = StyleSheet.create({});
