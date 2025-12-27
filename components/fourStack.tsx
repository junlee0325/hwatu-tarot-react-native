import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
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
  title: { en: string; ko: string };
  meaning: { en: string; ko: string };
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
  
  const { lang } = useLanguage();

  const [juaLoaded] = useJuaFonts({ Jua_400Regular });

  // Sounds
  ////////////////
  const plasticPlayers = [
    useAudioPlayer(require("../assets/plastic.mp3")),
    useAudioPlayer(require("../assets/plastic.mp3")),
    useAudioPlayer(require("../assets/plastic.mp3")),
  ];

  useEffect(() => {
    plasticPlayers.forEach((p) => {
      p.volume = 0.05;
    });
  }, []);

  const playPlastic = () => {
    for (let i = 0; i < plasticPlayers.length; i++) {
      const player = plasticPlayers[i];

      if (!player.playing) {
        player.seekTo(0);
        player.play();
        return;
      }
    }
    // all busy → drop sound (correct behavior)
  };
  //////////////////////

  const { width: vw } = Dimensions.get("window");

  const handlePress = (card: Card) => {
    // Haptics.selectionAsync();

    if (first === null) {
      setFirst(card);
      if (!mute) {
        playPlastic();
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
        width: "20%",
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
              top: vw * 0.15 * (360 / 230) * 0.25 * i,
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
                    ? "0px 0px 0px 2px rgba(255, 217, 0, 1)"
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
                  right: 0,
                  left: 0,
                  bottom: 0,
                  marginVertical: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(255, 217, 0, 1)",
                    width: "100%",
                    color: "black",
                    textAlign: "center",
                    borderRadius: 2,
                    fontSize: lang === "en" ? 14 : 16,
                    fontWeight: "bold",
                    paddingVertical: 1,
                    opacity: x === fourCards[fourCards.length - 1] ? 1 : 0,
                    fontFamily: "Jua_400Regular"
                  }}
                >
                  {x.title[lang]}
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
