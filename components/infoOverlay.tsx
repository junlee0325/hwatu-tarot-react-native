import { useLanguage } from "@/context/LanguageContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
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
  setOpenInfo: (value: boolean) => void;
  deck: Card[];
  imageSet: Record<string, any>;
};

const instructions = {
  en: {
    intro1:
      "- A Hwatu deck contains 48 cards, made up of 12 different kinds with four cards each.",
    intro2: "- Pair matching cards until the spread is cleared.",
    intro3:
      "- Collecting all four cards of a kind in one pile adds that kind to your daily reading.",
    intro4: "- Some spreads may end up being impossible to clear.",
    intro5: "- When that happens, simply try again.",
    intro6:
      "- Your reading can be revealed once per day, so each play represents a single day’s reading.",
  },
  ko: {
    intro1:
      "- 화투는 총 48장의 패로 이루어져 있으며, 12가지 종류가 각각 4장씩 구성되어 있습니다.",
    intro2: "- 같은 종류의 카드를 짝지어 펼쳐진 판을 모두 정리하면 됩니다.",
    intro3:
      "- 한 종류의 카드 4 장을 하나의 더미로 모두 모으면, 그 종류는 오늘의 운세에 포함 됩니다.",
    intro4: "- 일부 판은 정리가 불가능할 수도 있습니다.",
    intro5: "- 그런 경우에는 다시 시도하세요.",
    intro6:
      "- 운세는 하루에 한 번씩 볼 수 있으며, 한 번의 플레이는 하루의 운세를 의미합니다.",
  },
};

const infoTitle = { en: "HWATU TAROT", ko: "화투점" };
const language = { en: "EN/KO", ko: "한/영" };
const close = { en: "Close", ko: "닫기" };

const InfoOverlay = ({ setOpenInfo, deck, imageSet }: Props) => {
  const { width: vw, height: vh } = Dimensions.get("window");

  const { lang, setLang } = useLanguage();

  const [fontsLoaded] = useFonts({
    // Point directly to your local asset
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
    "Gugi-Regular": require("../assets/fonts/Gugi-Regular.ttf"),
  });

  const [translateClose, setTranslateClose] = useState(0);
  const [translateLang, setTranslateLang] = useState(0);
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
    }).start(() => setOpenInfo(false));
  };

  const [grouped, setGrouped] = useState<Card[][]>([]);

  const groupByMonths = (arr: Card[]): Card[][] => {
    const byMonths: Card[][] = [];

    for (let i = 0; i < arr.length; i += 4) {
      byMonths.push(arr.slice(i, i + 4));
    }

    return byMonths;
  };

  useEffect(() => {
    setGrouped(groupByMonths(deck));
  }, []);

  const toggleLang = () => setLang(lang === "en" ? "ko" : "en");

  const [english, setEnglish] = useState(true);

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
          height: "70%",
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
            padding: 0,
            borderRadius: 10,
            width: "100%",
            height: vh * 0.06,
            backgroundColor: "rgb(42, 83, 60)",
          }}
        >
          <Text
            style={{
              fontSize: vw * 0.1,
              fontFamily: "Gugi-Regular",
              color: "rgba(255, 217, 0, 1)",
            }}
            allowFontScaling={false}
          >
            {infoTitle[lang]}
          </Text>
        </View>
        <ScrollView
          style={{
            height: "30%",
            boxShadow: "inset 1px 1px 4px black",
            padding: 10,
            borderRadius: 10,
            backgroundColor: "rgba(235, 235, 235, 0.8)",
          }}
          contentContainerStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 10,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro1}
          </Text>
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro2}
          </Text>
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro3}
          </Text>
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro4}
          </Text>
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro5}
          </Text>
          <Text
            style={{ fontSize: vw * 0.04, fontFamily: "GowunDodum-Regular" }}
            allowFontScaling={false}
          >
            {instructions[lang].intro6}
          </Text>
        </ScrollView>
        <ScrollView
          style={{
            height: "50%",
            boxShadow: "inset 1px 1px 4px black",
            borderRadius: 10,
            padding: 10,
            backgroundColor: "rgba(235, 235, 235, 0.8)",
          }}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            gap: 5,
          }}
        >
          {grouped.map((x, i) => (
            <View
              key={i}
              style={{
                height: 80,
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "flex-start",

                // borderWidth: 1,
                // borderColor: "blue",
              }}
            >
              <View style={{ width: "40%" }}>
                {grouped[i].map((card, index) => (
                  <View
                    key={index}
                    style={{
                      width: 40,
                      height: "auto",
                      aspectRatio: "230/360",
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: "indianred",
                      position: "absolute",
                      transform: [
                        { translateX: index * 25 },
                        { rotate: `${card.rotation}deg` },
                      ],
                      zIndex: 4 - index,
                      boxShadow: "3px 3px 4px black",
                    }}
                  >
                    <Image
                      key={card.id}
                      source={imageSet[card.img]}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="stretch"
                    />
                  </View>
                ))}
              </View>
              <View
                style={{
                  width: "60%",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: 0,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: lang === "en" ? "row" : "row-reverse",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: vw * 0.04,
                      fontWeight: "bold",
                      fontFamily: "GowunDodum-Regular",
                      textAlign: "right",
                    }}
                    allowFontScaling={false}
                  >
                    {grouped[i][1].title.en}
                  </Text>
                  <Text
                    style={{
                      fontSize: vw * 0.04,
                      fontWeight: "bold",
                      fontFamily: "GowunDodum-Regular",
                    }}
                    allowFontScaling={false}
                  >
                    {grouped[i][1].title.ko}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "black",
                  }}
                ></View>
                <Text
                  style={{
                    fontSize: vw * 0.035,
                    paddingTop: 4,
                    fontFamily: "GowunDodum-Regular",
                  }}
                  allowFontScaling={false}
                >
                  {grouped[i][1].meaning[lang]}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: vh * 0.05,
            gap: 10,
          }}
        >
          <Pressable
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 3,
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
          <Pressable
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-start",
              flex: 1,
              height: "100%",
            }}
            onPressIn={() => {
              Haptics.selectionAsync();
              setTranslateLang(2);
              setEnglish(false);
            }}
            onPressOut={() => {
              setTranslateLang(0);
              setEnglish(true);
              toggleLang();
            }}
          >
            <Animated.View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                gap: 2,
                borderRadius: 10,
                boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
                backgroundColor: "rgb(88, 88, 88)",
                transform: [{ translateY: translateLang }],
              }}
            >
              <Ionicons
                name="globe-outline"
                size={vw * 0.04}
                color={english ? "white" : "rgba(255,255,255,0.5)"}
                allowFontScaling={false}
              />
              <Text
                style={{
                  color: english ? "white" : "rgba(255,255,255,0.5)",
                  fontSize: vw * 0.035,
                  fontWeight: "500",
                }}
                allowFontScaling={false}
              >
                {language[lang]}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default InfoOverlay;

const styles = StyleSheet.create({});
