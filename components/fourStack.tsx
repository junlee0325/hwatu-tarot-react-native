import * as Haptics from "expo-haptics";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

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

interface Prop {
  fourCards: Card[];
  updateFourCards: (value: Card[]) => void;
  imageSet: Record<string, any>;
  first: Card | null;
  setFirst: (value: Card | null) => void;
  second: Card | null;
  setSecond: (value: Card | null) => void;
}

const FourStack = ({
  fourCards,
  imageSet,
  first,
  setFirst,
  second,
  setSecond,
}: Prop) => {
  const handlePress = (card: Card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Haptics.selectionAsync();

    if (first === null) {
      setFirst(card);
      console.log("heh");
    }

    if (first !== null && card !== first && second === null) {
      setSecond(card);
      console.log("hi");
    }

    if (first !== null && card === first) {
      setFirst(null);
      setSecond(null);
      console.log("no");
    }
  };



  return (
    <View
      style={{
        width: 70,
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: "center",
        position: "relative",
      }}
    >
      {fourCards.map((x, i) => {
        return (
          <Pressable
            key={i}
            style={{
              ...styles.imageBox,
              top: 18 * i,
              borderColor: first === x ? "indianred" : "indianred",
              borderWidth:
                x === fourCards[fourCards.length - 1]
                  ? first === x
                    ? 1
                    : 1
                  : 0.5,
              transform:
                x === fourCards[fourCards.length - 1]
                  ? [
                      // { translateX: rotateInt[i] },
                      { rotate: `${x.rotation}deg` },
                      { scale: first === x ? 1.15 : 1 },
                    ]
                  : [
                      // { translateX: rotateInt[i] },
                      { rotate: `${x.rotation * -1}deg` },
                    ],
              boxShadow: x === fourCards[fourCards.length - 1] ? first === x ? "1px 1px 15px yellow" : "2px 2px 2px black" : "1px 1px 2px black",
              zIndex: first === x ? 10 : 1,
            }}
            onPressIn={() => handlePress(x)}
            disabled={x === fourCards[fourCards.length - 1] ? false : true}
          >
            <Image
              source={
                x === fourCards[fourCards.length - 1]
                  ? imageSet[x.img]
                  : require("../assets/cardImgs/backOG.webp")
              }
              style={styles.image}
              resizeMode="stretch"
            ></Image>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FourStack;

const styles = StyleSheet.create({
  imageBox: {
    width: 60,
    aspectRatio: "230/360",
    position: "absolute",
    borderRadius: 3,
    backgroundColor: "rgba(188, 26, 8, 1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
