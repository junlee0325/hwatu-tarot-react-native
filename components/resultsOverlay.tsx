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
  title1: string;
  title2: string;
  meaning: string;
}

type Props = {
  setOpenResults: (value: boolean) => void;
  boxOne: Card[];
  boxTwo: Card[];
  boxThree: Card[];
  boxFour: Card[];
  imageSet: Record<string, any>;
};

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
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.75, // scale down 95%
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
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 20,
        backgroundColor: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#f3f3f3",
          borderRadius: 10,
          padding: 10,
          width: "90%",
          height: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "8%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Results</Text>
        </View>
        <View
          style={{
            height: "30%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
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
                justifyContent: "space-evenly",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#e0e0e0ff",
                boxShadow: "inset 1px 1px 4px black",
                paddingVertical: 5,
                borderRadius: 8,
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
                      width: hasFour ? 25 : 20,
                      aspectRatio: 230 / 360,
                      borderRadius: 2,
                      transform: [{ rotate: `${card.rotation}deg` }],
                      borderColor: "indianred",
                      borderWidth: 1,
                      boxShadow: "1px 1px 2px black",
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
        </View>
        <ScrollView
          style={{
            width: "100%",
            height: "45%",
            borderRadius: 8,
            borderColor: "black",
            borderWidth: 0,
            boxShadow: "inset 1px 1px 5px black",
            backgroundColor: "#e0e0e0",
          }}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            gap: 5,
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
                padding: 8,
                // borderWidth: 1,
                // borderColor: "blue",
              }}
            >
              <View style={{ width: "30%" }}>
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
                      boxShadow: "2px 2px 2px black",
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end"
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>{matches[i][1].title2}</Text>
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>{matches[i][1].title1}</Text>
                </View>
                <View style={{width: "100%", height: 1, backgroundColor: "black"}}></View>
                <Text style={{ fontSize: 14, paddingTop: 4 }}>{matches[i][1].meaning}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={{ height: "10%" }}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setOpenResults(false);
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View
              style={{
                marginTop: 20,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                transform: [{ scale }],
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ResultsOverlay;

const styles = StyleSheet.create({});
