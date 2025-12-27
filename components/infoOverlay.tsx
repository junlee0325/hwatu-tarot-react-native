import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
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
      "A Hwatu deck contains 48 cards, made up of 12 different kinds with four cards each. The goal is simple: pair matching cards until the spread is cleared. Collecting all four cards of a kind in one pile adds that kind to your daily reading.",
    intro2:
      "Some spreads may end up being impossible to clear. When that happens, simply try again. Your reading can be revealed once per day, so each play represents a single day’s reading.",
  },
  ko: {
    intro1:
      "화투는 총 48장의 패로 이루어져 있으며, 12가지 종류가 각각 4장씩 구성되어 있습니다. 목표는 간단합니다. 같은 종류의 카드를 짝지어 펼쳐진 판을 모두 정리하는 것입니다. 한 종류의 카드 4 장을 하나의 더미로 모두 모으면, 그 종류는 오늘의 운세에 포함 됩니다.",
    intro2:
      "일부 판은 정리가 불가능할 수도 있습니다. 그런 경우에는 다시 시도하세요. 운세는 하루에 한 번씩 볼 수 있으며, 한 번의 플레이는 하루의 운세를 의미합니다.",
  },
};

const appTitle = {en: "Hwatu Tarot", ko: "화투점"}

const close = { en: "Close", ko: "닫기" };

const InfoOverlay = ({ setOpenInfo, deck, imageSet }: Props) => {
  const { height: vh } = Dimensions.get("window");

  const { lang } = useLanguage();

  const [juaLoaded] = useJuaFonts({ Jua_400Regular });

  const [scale] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Haptics.selectionAsync();
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

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
              gap: 8,
              backgroundColor: "rgba(235, 235, 235, 0.8)",
              boxShadow: "inset 1px 1px 4px black",
              padding: 8,
              borderRadius: 10,
              width: "100%",
            }}
          >
            <Text
              style={{ fontSize: 30, fontFamily: "Jua_400Regular" }}
            >
              {appTitle[lang]}
            </Text>
          </View>
          <View
            style={{
              height: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "center",
              gap: 10,
            }}
          >
            <ScrollView
              style={{
                height: "20%",
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
              }}
            >
              <Text style={{fontSize: 16 ,fontFamily: "Jua_400Regular"}}>{instructions[lang].intro1}</Text>
              <Text style={{fontSize: 16 ,fontFamily: "Jua_400Regular"}}>{instructions[lang].intro2}</Text>
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
                      height: 80,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      gap: 2,
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
                      <Text style={{ fontSize: 18, fontWeight: "bold", fontFamily: "Jua_400Regular"}}>
                        {grouped[i][1].title.en}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: "bold", fontFamily: "Jua_400Regular" }}>
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
                    <Text style={{ fontSize: 14, paddingTop: 4, fontFamily: "Jua_400Regular" }}>
                      {grouped[i][1].meaning[lang]}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Pressable
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
              onPress={() => handleClose()}
              onPressIn={() => handlePressIn()}
              onPressOut={() => handlePressOut()}
            >
              <Animated.View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(75, 75, 75, 1)",
                  paddingVertical: 8,
                  width: "25%",
                  borderRadius: 10,
                  boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
                  transform: [{ scale }],
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16, fontFamily: "Jua_400Regular" }}
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

export default InfoOverlay;

const styles = StyleSheet.create({});
