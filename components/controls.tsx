import { useLanguage } from "@/context/LanguageContext";
import {
  Jua_400Regular,
  useFonts as useJuaFonts,
} from "@expo-google-fonts/jua";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Card {
  month: string; // e.g., 'Jan', 'Feb', etc.
  rank: string;
  id: string; // optional, unique identifier
  img: string;
  rotation: number;
  title: { en: string; ko: string };
  meaning: { en: string; ko: string };
}

interface Prop {
  handleDraw: () => void;
  setVisible: (value: boolean) => void;
  remaining: Card[];
  handleReset: () => void;
  first: Card | null;
  mute: Boolean;
  setMute: (value: boolean) => void;
  showLabels: Boolean;
  setShowLabels: (value: boolean) => void;
  boxFour: Card[];
  setOpenResults: (value: boolean) => void;
  setOpenInfo: (value: boolean) => void;
}

const audio = { en: "Audio", ko: "음향" };
const helper = { en: "Helper", ko: "도우미" };
const information = { en: "Info", ko: "정보" };
const retry = { en: "Restart", ko: "재시작" };
const cycle = { en: "Cycle Deck", ko: "순환" };
const result = { en: "Open Result", ko: "결과 열기" };
const count = { en: "In Deck", ko: "남은 패" };

const Controls = ({
  handleDraw,
  setVisible,
  remaining,
  handleReset,
  first,
  mute,
  setMute,
  showLabels,
  setShowLabels,
  boxFour,
  setOpenResults,
  setOpenInfo,
}: Prop) => {
  const { lang } = useLanguage();

  const [juaLoaded] = useJuaFonts({ Jua_400Regular });

  // Sounds
  //////////////////////
  // 🔊 DROP-SAFE SOUND POOLS
  //////////////////////
  const plasticPlayers = [
    useAudioPlayer(require("../assets/plastic.mp3")),
    useAudioPlayer(require("../assets/plastic.mp3")),
    useAudioPlayer(require("../assets/plastic.mp3")),
    useAudioPlayer(require("../assets/plastic.mp3")),
  ];

  const clickPlayers = [
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
  ];

  useEffect(() => {
    plasticPlayers.forEach((p) => (p.volume = 0.05));
    clickPlayers.forEach((p) => (p.volume = 0.5));
  }, []);

  const playPlastic = () => {
    for (let i = 0; i < plasticPlayers.length; i++) {
      const p = plasticPlayers[i];
      if (!p.playing) {
        p.seekTo(0);
        p.play();
        return;
      }
    }

    // setTimeout(() => {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // }, 200);
  };

  const playClick = () => {
    for (let i = 0; i < clickPlayers.length; i++) {
      const p = clickPlayers[i];
      if (!p.playing) {
        p.seekTo(0);
        p.play();
        return;
      }
    }

    // setTimeout(() => {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // }, 200);
  };
  //////////////////////////

  const { width: vw } = Dimensions.get("window");

  const [showCycle, setShowCycle] = useState(false);

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (remaining.length === 0) return;
    Animated.timing(translateY, {
      toValue: 0, // move up
      duration: 1,
      useNativeDriver: true,
    }).start();

    setOpacity(1);
  }, [remaining]);

  const translateY = useRef(new Animated.Value(0)).current;

  // const handlePressIn = () => {
  //   if (remaining.length === 0) return;

  //   if (first === null) {
  //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //     // Haptics.selectionAsync();

  //     translateY.setValue(0);
  //     setOpacity(1);

  //     Animated.timing(translateY, {
  //       toValue: -20, // move up
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // };
  const handlePressIn = () => {
    if (remaining.length === 0) return;
    if (first !== null) return;

    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // playSfx(plasticPlayer);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      if (!mute) {
        playPlastic();
      }
    }, 100);

    translateY.setValue(0);
    setOpacity(1);

    Animated.timing(translateY, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // const handlePressOut = () => {
  //   if (first === null) {
  //     setShowCycle(true);

  //     Animated.timing(translateY, {
  //       toValue: -120, // move up
  //       duration: 100,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       setOpacity(0); // fade out last card
  //       handleDraw();
  //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  //     });
  //   }
  // };
  const handlePressOut = () => {
    // if (first !== null) return;

    setShowCycle(true);

    Animated.timing(translateY, {
      toValue: -120,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setOpacity(0);
      handleDraw();

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      setTimeout(() => {
        if (!mute) {
          playClick();
        }
      }, 100);

      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    });
  };

  const handleResetPress = () => {
    Alert.alert("Restart", "Start over with a new deck?", [
      {
        text: "Yes",
        onPress: () => {
          setShowCycle(false);
          handleReset();
        },
        style: "default",
      },
      {
        text: "Cancel",
        style: "destructive",
      },
    ]);
  };

  const [cycleBorder, setCycleBorder] = useState(false);

  const [sound, setSound] = useState(true);
  const [labels, setLabels] = useState(true);
  const [info, setInfo] = useState(true);
  const [restart, setRestart] = useState(true);

  return (
    <View style={styles.bottomBar}>
      <View
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center",
          height: 70,
          paddingVertical: 5,
        }}
      >
        <Pressable
          style={{ width: "50%" }}
          onPressIn={() => {
            Haptics.selectionAsync();
            setLabels(false);
          }}
          onPressOut={() => {
            setLabels(true);
            setShowLabels(!showLabels);
          }}
        >
          {showLabels ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <MaterialCommunityIcons
                name="label-outline"
                size={34}
                color={labels ? "white" : "rgba(255,255,255,0.5)"}
              />
              <Text
                style={{
                  color: labels ? "white" : "rgba(255,255,255,0.5)",
                  fontSize: 18,
                  fontFamily: "Jua_400Regular"
                }}
              >
                {helper[lang]}
              </Text>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <MaterialCommunityIcons
                name="label-off-outline"
                size={34}
                color={labels ? "rgba(255,255,255,0.5)" : "white"}
              />
              <Text
                style={{
                  color: labels ? "rgba(255,255,255,0.5)" : "white",
                  fontSize: 18,
                  fontFamily: "Jua_400Regular"
                }}
              >
                {helper[lang]}
              </Text>
            </View>
          )}
        </Pressable>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            width: "50%",
          }}
        >
          <Text
            style={{
              color: labels ? "white" : "rgba(255,255,255,0.5)",
              fontSize: 26,
              fontFamily: "Jua_400Regular",padding:4
            }}
          >
            {remaining.length}
          </Text>
          <Text
            style={{
              color: labels ? "white" : "rgba(255,255,255,0.5)",
              fontSize: 18,
              fontFamily: "Jua_400Regular"
            }}
          >
            {count[lang]}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          aspectRatio: 230 / 360,
          boxShadow: "inset 1px 1px 2px 1px black",
          backgroundColor: "rgba(122, 122, 122, 0.25)",
        }}
      >
        {remaining.length !== 0 && (
          <Pressable
            style={styles.drawButton}
            onPressIn={() => handlePressIn()}
            onPressOut={() => handlePressOut()}
          >
            {/* <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
                zIndex: 50,
              }}
            >
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "500",
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                {remaining.length}
              </Text>
            </View> */}
            {remaining.map((x, i) => (
              <Animated.View
                key={i}
                style={{
                  ...styles.imageBox,
                  width: vw * 0.15,
                  left: "50%",
                  top: "50%",
                  transform: [
                    // { translateX: -30 },
                    // { translateY: -0.1 * i - 50 },
                    { translateX: -(vw * 0.15) / 2 },
                    { translateY: -(vw * 0.15 * (360 / 230)) / 2 },
                    ...(x === remaining[remaining.length - 1]
                      ? [{ translateY }]
                      : []),
                    { rotate: `${x.rotation * 1.5}deg` },
                  ],
                  opacity: x === remaining[remaining.length - 1] ? opacity : 1,
                }}
              >
                <Image
                  source={require("../assets/cardImgs/backOG.webp")}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </Animated.View>
            ))}
          </Pressable>
        )}
        {remaining.length === 0 && showCycle && (
          <Pressable
            // onPress={() => handleDraw()}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCycleBorder(true);
            }}
            onPressOut={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCycleBorder(false);
              boxFour.length === 12 ? setOpenResults(true) : handleDraw();
              if (!mute && boxFour.length !== 12) {
                playClick();
              }
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0,
              borderColor: !cycleBorder
                ? "rgba(255, 255, 255, 1)"
                : "rgba(255, 255, 255, 0.5)",
              borderRadius: "10%",
              width: vw * 0.15,
              aspectRatio: 230 / 360,
              borderStyle: "dashed",
            }}
          >
            {boxFour.length !== 12 && (
              <Text
                style={{
                  color: !cycleBorder
                    ? "rgba(255, 217, 0, 1)"
                    : "rgba(255, 255, 255, 0.5)",
                  fontWeight: "500",
                  fontSize: lang === "en" ? 20 : 24,
                  textAlign: "center",
                  fontFamily: "Jua_400Regular"
                }}
              >
                {cycle[lang]}
              </Text>
            )}
            {boxFour.length === 12 && (
              <Text
                style={{
                  color: !cycleBorder
                    ? "rgba(255, 217, 0, 1)"
                    : "rgba(255, 255, 255, 0.5)",
                  fontWeight: "500",
                  fontSize: lang === "en" ? 20 : 24,
                  textAlign: "center",
                  fontFamily: "Jua_400Regular"
                }}
              >
                {result[lang]}
              </Text>
            )}
          </Pressable>
        )}
      </View>
      <View
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center",
          height: 70,
          paddingVertical: 5,
          paddingHorizontal: 0,
        }}
      >
        <Pressable
          style={{ width: "50%" }}
          onPressIn={() => {
            Haptics.selectionAsync();
            setSound(false);
          }}
          onPressOut={() => {
            setSound(true);
            setMute(!mute);
          }}
        >
          {!mute ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Feather
                name="volume-2"
                size={32}
                color={sound ? "white" : "rgba(255,255,255,0.5)"}
              />
              <Text
                style={{
                  color: sound ? "white" : "rgba(255,255,255,0.5)",
                  fontSize: 18,
                  fontFamily: "Jua_400Regular"
                }}
              >
                {audio[lang]}
              </Text>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Feather
                name="volume-x"
                size={32}
                color={sound ? "rgba(255,255,255,0.5)" : "white"}
              />
              <Text
                style={{
                  color: sound ? "rgba(255,255,255,0.5)" : "white",
                  fontSize: 18,
                  fontFamily: "Jua_400Regular"
                }}
              >
                {audio[lang]}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={{
            width: "50%",
          }}
          onPressIn={() => {
            Haptics.selectionAsync();
            setRestart(false);
          }}
          onPressOut={() => {
            setRestart(true);
            handleResetPress();
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Entypo
              name="cycle"
              size={28}
              color={restart ? "white" : "rgba(255,255,255,0.5)"}
            />
            <Text
              style={{
                color: restart ? "white" : "rgba(255,255,255,0.5)",
                fontSize: 18,
                fontFamily: "Jua_400Regular"
              }}
            >
              {retry[lang]}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  bottomBar: {
    height: 100,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  drawButton: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageBox: {
    height: "auto",
    aspectRatio: "230/360",
    position: "absolute",
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: "indianred",
    backgroundColor: "rgba(188, 26, 8, 1)",
    boxShadow: "2px 2px 2px 0px black",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
