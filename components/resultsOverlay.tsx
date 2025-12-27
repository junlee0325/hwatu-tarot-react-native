import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
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
  setOpenResults: (value: boolean) => void;
  boxOne: Card[];
  boxTwo: Card[];
  boxThree: Card[];
  boxFour: Card[];
  imageSet: Record<string, any>;
};

const close = { en: "Close", ko: "닫기" };

const result = { en: "Reading", ko: "운세" };

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

const ResultsOverlay = ({
  setOpenResults,
  boxOne,
  boxTwo,
  boxThree,
  boxFour,
  imageSet,
}: Props) => {
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
    }).start(() => setOpenResults(false));
  };

  const [boxes] = useState([boxOne, boxTwo, boxThree, boxFour]);

  const [matches, setMatches] = useState<Card[][]>([]);

  useEffect(() => {
    if (boxFour.length === 12) {
      const matched: Card[] = [];

      boxes.map((x, i) => {
        boxes[i].map((card) => {
          const monthCounts = boxes[i].reduce((acc, card) => {
            acc[card.month] = (acc[card.month] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          if (monthCounts[card.month] === 4) {
            matched.push(card);
          }
        });
      });

      const orderedRanks = matched.sort(
        (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank)
      );

      const orderedMonths = orderedRanks.sort(
        (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
      );

      const result: Card[][] = [];

      let currentGroup = [orderedMonths[0]];

      for (let i = 1; i < orderedMonths.length; i++) {
        if (orderedMonths[i].month === orderedMonths[i - 1].month) {
          currentGroup.push(orderedMonths[i]);
        } else {
          result.push(currentGroup);
          currentGroup = [orderedMonths[i]];
        }
      }
      result.push(currentGroup);

      setMatches(result);
    }
  }, [boxFour]);

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
          height: "60%",
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
            backgroundColor: "rgba(235, 235, 235, 0.8)",
            boxShadow: "inset 1px 1px 4px black",
            padding: 8,
            borderRadius: 10,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "Jua_400Regular",  }}>
            {new Date().toLocaleDateString()} {result[lang]}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: "75%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignContent: "center",
            gap: 0,
          }}
        >
          {/* <View
            style={{
              height: "45%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            {boxes.map((x, i) => (
              <View
                key={i}
                style={{
                  width: "100%",
                  height: "22%",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "rgba(235, 235, 235, 0.8)",
                  boxShadow: "inset 1px 1px 4px black",
                  padding: 5,
                  borderRadius: 10,
                }}
              >
                {boxes[i].map((card, index) => {
                  const monthCounts = boxes[i].reduce((acc, card) => {
                    acc[card.month] = (acc[card.month] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  const hasFour = monthCounts[card.month] === 4;

                  return (
                    <View
                      key={index}
                      style={{
                        width: "6%",
                        aspectRatio: 230 / 360,
                        borderRadius: 1,
                        // transform: [{ rotate: `${card.rotation}deg` }],
                        borderColor: "indianred",
                        borderWidth: 1,
                        boxShadow: hasFour
                          ? "0px 0px 0px 3px rgba(56, 129, 50, 1)"
                          : "1px 1px 1px black",
                      }}
                    >
                      <Image
                        key={card.id}
                        source={imageSet[card.img]}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="stretch"
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </View> */}
          <View
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ScrollView
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                borderColor: "black",
                padding: 10,
                boxShadow: "inset 1px 1px 4px black",
                backgroundColor: "rgba(235, 235, 235, 0.8)",
              }}
              contentContainerStyle={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                gap: 0,
              }}
            >
              {matches.map((x, i) => (
                <View
                  key={i}
                  style={{
                    height: 80,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    // borderWidth: 1,
                    // borderColor: "blue",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    {matches[i].map((card, index) => (
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
                      <Text style={{ fontSize: 18, fontWeight: "bold", fontFamily: "Jua_400Regular", }}>
                        {matches[i][1].title.en}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: "bold", fontFamily: "Jua_400Regular", }}>
                        {matches[i][1].title.ko}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <Text style={{ fontSize: 14, paddingTop: 4, fontFamily: "Jua_400Regular", }}>
                      {matches[i][1].meaning[lang]}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
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

export default ResultsOverlay;

const styles = StyleSheet.create({});
