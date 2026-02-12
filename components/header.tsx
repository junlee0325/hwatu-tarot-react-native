import { useLanguage } from "@/context/LanguageContext";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

interface Prop {
  setOpenInfo: (value: boolean) => void;
}

const language = { en: "ENG", ko: "한국어" };
const information = { en: "Info", ko: "정보" };

const Header = ({ setOpenInfo }: Prop) => {
  const { width: vw } = Dimensions.get("window");

  const { lang, setLang } = useLanguage();
  const toggleLang = () => setLang(lang === "en" ? "ko" : "en");

  const [fontsLoaded] = useFonts({
    // Point directly to your local asset
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
    "Gugi-Regular": require("../assets/fonts/Gugi-Regular.ttf"),
  });

  const date = new Date().toLocaleDateString();
  const dayNum = new Date().getDay();
  const days = [
    { en: "Sun", ko: "일요일" },
    { en: "Mon", ko: "월요일" },
    { en: "Tue", ko: "화요일" },
    { en: "Wed", ko: "수요일" },
    { en: "Thu", ko: "목요일" },
    { en: "Fri", ko: "금요일" },
    { en: "Sat", ko: "토요일" },
  ];

  const [english, setEnglish] = useState(true);
  const [info, setInfo] = useState(true);

  return (
    <View style={styles.header}>
      <View
        style={{
          height: "100%",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
            height: "100%",
            width: 50,
            gap: 4,
          }}
          onPressIn={() => {
            Haptics.selectionAsync();
            setEnglish(false);
          }}
          onPressOut={() => {
            setEnglish(true);
            toggleLang();
          }}
        >
          <Ionicons
            name="globe-outline"
            size={vw * 0.08}
            color={english ? "white" : "rgba(255,255,255,0.5)"}
            allowFontScaling={false}
          />
          <Text
            style={{
              color: english ? "white" : "rgba(255,255,255,0.5)",
              fontSize: vw * 0.04,
              fontFamily: "GowunDodum-Regular",
            }}
            allowFontScaling={false}
          >
            {language[lang]}
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          flex: 2,
          flexDirection: "column",
          flexWrap: "nowrap",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* <View
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Text
            style={{
              fontSize: vw * 0.04,
              color: "rgba(255, 255, 255, 1)",
              fontFamily: "GowunDodum-Regular",
            }}
            allowFontScaling={false}
          >
            {lang === "en" ? "화투점" : "Hwatu Tarot"}
          </Text>
          <Text
            style={{
              fontSize: vw * 0.07,
              color: "rgba(255, 217, 0, 1)",
              fontFamily: "GowunDodum-Regular",
            }}
            allowFontScaling={false}
          >
            {lang === "en" ? "Hwatu Tarot" : "화투점"}
          </Text>
        </View> */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: vw * 0.06,
              color: "rgba(255, 217, 0, 1)",
              fontFamily: "Gugi-Regular",
            }}
            allowFontScaling={false}
          >
            {days[dayNum][lang]}
          </Text>
          <Text
            style={{
              fontSize: vw * 0.06,
              color: "rgba(255, 255, 255, 1)",
              fontFamily: "Gugi-Regular",
            }}
            allowFontScaling={false}
          >
            {date}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: "100%",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            height: "100%",
            width: 50,
            gap: 4,
          }}
          onPressIn={() => {
            Haptics.selectionAsync();
            setInfo(false);
          }}
          onPressOut={() => {
            setInfo(true);
            setOpenInfo(true);
          }}
        >
          <Feather
            name="info"
            size={vw * 0.08}
            color={info ? "white" : "rgba(255,255,255,0.5)"}
            allowFontScaling={false}
          />
          <Text
            style={{
              color: info ? "white" : "rgba(255,255,255,0.5)",
              fontSize: vw * 0.04,
              fontFamily: "GowunDodum-Regular",
            }}
            allowFontScaling={false}
          >
            {information[lang]}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "7%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
