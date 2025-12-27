import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Card {
  month: string;
  rank: string;
  id: string;
  img: string;
  rotation: number;
  title: { en: string; ko: string };
  meaning: { en: string; ko: string };
}

interface Prop {
  remaining: Card[];
  setRemaining: (value: Card[]) => void;
  setVisible: (value: boolean) => void;
  imageSet: Record<string, any>;
  first: Card | null;
  setFirst: (value: Card | null) => void;
  second: Card | null;
  setSecond: (value: Card | null) => void;
  faceUps: Card[];
  setFaceUps: (value: Card[]) => void;
  showLabels: Boolean;
  mute: Boolean;
}

const PlayArea = ({
  remaining,
  setRemaining,
  setVisible,
  imageSet,
  first,
  setFirst,
  second,
  setSecond,
  faceUps,
  setFaceUps,
  showLabels,
  mute,
}: Prop) => {

  const { lang } = useLanguage();

  const [juaLoaded] = useJuaFonts({ Jua_400Regular });

  // Sounds
  //////////////////////
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
  //////////////////////////

  const { width: vw } = Dimensions.get("window");

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom whenever faceUps changes
    if (faceUps.length !== 0) {
      scrollRef.current?.scrollToEnd({ animated: true });
    } else {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [faceUps]);

  const [showPinned, setShowPinned] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = e.nativeEvent.contentOffset.y;
    // If scrolled past ~10px, pin the first card
    setShowPinned(yOffset > 25);
  };

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

  const disableCheck = (card: Card) => {
    const firstCard = faceUps[0];
    const lastCard = faceUps[faceUps.length - 1];
    const secondLastCard =
      faceUps.length >= 2 ? faceUps[faceUps.length - 2] : null;

    if (card === firstCard) {
      return false;
    }

    if (card === lastCard) {
      return false;
    }

    if (
      first !== null &&
      first.month === card.month &&
      card === secondLastCard &&
      card.month === lastCard.month &&
      first !== firstCard
    ) {
      return false;
    }

    return true;
  };

  const opacityCheck = (card: Card) => {
    const firstCard = faceUps[0];
    const lastCard = faceUps[faceUps.length - 1];
    const secondLastCard =
      faceUps.length >= 2 ? faceUps[faceUps.length - 2] : null;

    if (card === firstCard) {
      return false;
    }

    if (card === lastCard) {
      return false;
    }

    if (
      first !== null &&
      first.month === card.month &&
      card === secondLastCard &&
      card.month === lastCard.month &&
      first !== firstCard
    ) {
      return false;
    }

    if (
      card === secondLastCard &&
      card.month === lastCard.month &&
      first !== firstCard
    ) {
      return false;
    }

    return true;
  };

  return (
    <View
      style={{
        width: "100%",
        height: "30%",
      }}
    >
      <View style={{}}>
        <ScrollView
          ref={scrollRef}
          style={{ height: "100%" }}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            paddingVertical: 16,
            paddingHorizontal: 2,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={200}
        >
          {faceUps.map((x, i) => (
            <Pressable
              key={i}
              style={{
                ...styles.imageBox,
                width: vw * 0.15,
                borderColor: opacityCheck(x)
                  ? "rgba(0, 0, 0, 0.5)"
                  : "indianred",
                borderWidth: first === x ? 1 : 1,
                transform: [
                  // { translateX: rotateInt[i] },
                  { rotate: `${x.rotation * -1}deg` },
                  { scale: first === x ? 1.15 : 1 },
                ],
                opacity: opacityCheck(x) ? 1 : 1,
                boxShadow:
                  first === x
                    ? "0px 0px 0px 2px rgba(255, 217, 0, 1)"
                    : "2px 2px 2px black",
                zIndex: first === x ? 10 : 1,
              }}
              onPressIn={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              onPressOut={() => handlePress(x)}
              disabled={disableCheck(x)}
            >
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: opacityCheck(x) ? "rgba(0, 0, 0, 0.5)" : "",
                  zIndex: 4,
                  opacity: disableCheck(x) ? 1 : 0,
                }}
              >
                <MaterialIcons
                  name="do-not-touch"
                  size={30}
                  color="rgba(255, 255, 255, 0.5)"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: 4,
                    boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </View>
              <Image
                source={imageSet[x.img]}
                style={styles.image}
                resizeMode="stretch"
              />
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
                      fontFamily: "Jua_400Regular"
                    }}
                  >
                    {x.title[lang]}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {showPinned && faceUps.length > 0 && (
        <View
          style={{
            ...styles.pinnedBox,
          }}
        >
          <Pressable
            style={{
              ...styles.imageBox,
              width: vw * 0.15,
              height: "auto",
              borderColor: first === faceUps[0] ? "indianred" : "indianred",
              borderWidth: first === faceUps[0] ? 1 : 1,
              transform: [
                // { translateX: rotateInt[i] },
                { rotate: `${faceUps[0].rotation * -1}deg` },
                { scale: first === faceUps[0] ? 1.15 : 1 },
              ],
              boxShadow:
                first === faceUps[0]
                  ? "0px 0px 0px 2px rgba(255, 217, 0, 1)"
                  : "2px 2px 2px black",
            }}
            onPressIn={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPressOut={() => handlePress(faceUps[0])}
            disabled={disableCheck(faceUps[0])}
          >
            <Image
              source={imageSet[faceUps[0].img]}
              style={styles.image}
              resizeMode="stretch"
            />
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
                    fontFamily: "Jua_400Regular"
                  }}
                >
                  {faceUps[0].title[lang]}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PlayArea;

const styles = StyleSheet.create({
  imageBox: {
    aspectRatio: "230/360",
    borderRadius: 3,
    backgroundColor: "rgba(188, 26, 8, 1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    aspectRatio: "1/1",
    borderRadius: "50%",
    borderWidth: 2,
    padding: 1,
    width: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pinnedBox: {
    position: "absolute",
    top: "2%",
    left: "2%",
    width: 90,
    aspectRatio: 2 / 3,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
