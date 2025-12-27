import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Prop {
  setOpenInfo: (value: boolean) => void;
}

const language = { en: "ENG", ko: "한국어" };
const information = { en: "Info", ko: "정보" };

const Header = ({setOpenInfo} : Prop) => {

  const { lang, setLang } = useLanguage();
  const toggleLang = () => setLang(lang === "en" ? "ko" : "en");

  const [juaLoaded] = useJuaFonts({ Jua_400Regular });

  const date = new Date().toLocaleDateString();
  const dayNum = new Date().getDay();
  const days = [
    { en: "Sunday", ko: "일요일" },
    { en: "Monday", ko: "월요일" },
    { en: "Tuesday", ko: "화요일" },
    { en: "Wednesday", ko: "수요일" },
    { en: "Thursday", ko: "목요일" },
    { en: "Friday", ko: "금요일" },
    { en: "Saturday", ko: "토요일" },
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
            size={26}
            color={english ? "white" : "rgba(255,255,255,0.5)"}
          />
          <Text
            style={{
              color: english ? "white" : "rgba(255,255,255,0.5)",
              fontSize: 16,
              fontFamily: "Jua_400Regular"
            }}
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
        <View
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
              fontSize: 16,
              color: "rgba(255, 255, 255, 1)",
              fontFamily: "Jua_400Regular",
            }}
          >
            {lang === "en" ? "화투점" : "Hwatu Tarot"}
          </Text>
          <Text
            style={{
              fontSize: 26,
              color: "rgba(255, 217, 0, 1)",
              fontFamily: "Jua_400Regular",
            }}
          >
            {lang === "en" ? "Hwatu Tarot" : "화투점"}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 14, color: "rgba(255, 217, 0, 1)", fontFamily: "Jua_400Regular" }}>
            {days[dayNum][lang]}
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 1)", fontFamily: "Jua_400Regular" }}>
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
            size={28}
            color={info ? "white" : "rgba(255,255,255,0.5)"}
          />
          <Text
            style={{
              color: info ? "white" : "rgba(255,255,255,0.5)",
              fontSize: 16,
              fontFamily: "Jua_400Regular"
            }}
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
