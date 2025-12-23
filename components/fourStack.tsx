import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
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
  showLabels: Boolean;
  mute: Boolean;
}

const FourStack = ({
  fourCards,
  imageSet,
  first,
  setFirst,
  second,
  setSecond,
  showLabels,
  mute,
}: Prop) => {
  // Sounds
  //////////////////////
  const plasticPlayer = useAudioPlayer(require("../assets/plastic.mp3"));

  useEffect(() => {
    plasticPlayer.volume = 0.2;
  }, []);

  const playSfx = (player: any) => {
    player.seekTo(0);
    player.play();
    player.seekTo(0);
  };
  //////////////////////////

  const { width: vw } = Dimensions.get("window");

  const handlePress = (card: Card) => {
    // Haptics.selectionAsync();

    if (first === null) {
      setFirst(card);
      if (!mute) {
        playSfx(plasticPlayer);
      }
      console.log("first card selected");
    }

    if (first !== null && card !== first && second === null) {
      setSecond(card);
      console.log("initial match");
    }

    if (first !== null && card === first) {
      setFirst(null);
      setSecond(null);

      console.log("same card");
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
              width: vw * 0.15,
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
              boxShadow:
                x === fourCards[fourCards.length - 1]
                  ? first === x
                    ? "1px 1px 10px 1px yellow"
                    : "2px 2px 2px black"
                  : "1px 1px 2px black",
              zIndex: first === x ? 10 : 1,
            }}
            onPressIn={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPressOut={() => handlePress(x)}
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
            {showLabels && (
              <View
                style={{
                  position: "absolute",
                  right:0,
                  left: 0,
                  bottom: 0,
                  marginVertical: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "black",
                    textAlign: "center",
                    borderRadius: 2,
                    fontSize: vw * 0.025,
                    fontWeight: "bold",
                    paddingHorizontal: 4,
                    opacity: x === fourCards[fourCards.length - 1] ? 1 : 0
                  }}
                >
                  {x.title1}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default FourStack;

const styles = StyleSheet.create({
  imageBox: {
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
