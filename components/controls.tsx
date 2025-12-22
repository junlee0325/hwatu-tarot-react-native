import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Card {
  month: string; // e.g., 'Jan', 'Feb', etc.
  rank: string;
  id: string; // optional, unique identifier
  img: string;
  rotation: number;
  title1: string;
  title2: string;
  meaning: string;
}

interface Prop {
  handleDraw: () => void;
  setVisible: (value: boolean) => void;
  remaining: Card[];
  handleReset: () => void;
  first: Card | null;
}

const Controls = ({
  handleDraw,
  setVisible,
  remaining,
  handleReset,
  first,
}: Prop) => {
  // Sounds
  //////////////////////
  // const plasticPlayer = useAudioPlayer(require("../assets/plastic.mp3"));
  // const swishPlayer = useAudioPlayer(require("../assets/swish.mp3"));
  // const clickPlayer = useAudioPlayer(require("../assets/click.mp3"));

  // useEffect(() => {
  //   plasticPlayer.volume = 0.1;
  //   swishPlayer.volume = 0.1;
  //   clickPlayer.volume = 1;
  // }, []);

  // const playSfx = (player: any) => {
  //   player.seekTo(0);
  //   player.play();
  //   player.seekTo(0);
  // };
  //////////////////////////

  // Sounds
  //////////////////////
  // Create a pool of 3 swish players
  const swishPlayers = [
    useAudioPlayer(require("../assets/swish.mp3")),
    useAudioPlayer(require("../assets/swish.mp3")),
    useAudioPlayer(require("../assets/swish.mp3")),
    useAudioPlayer(require("../assets/swish.mp3")),
  ];

  const clickPlayers = [
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
    useAudioPlayer(require("../assets/click.mp3")),
  ];

  let swishIndex = 0;

  let clickIndex = 0;

  // Set volume once after creation
  useEffect(() => {
    swishPlayers.forEach((player) => {
      player.volume = 0.1;
    });
  }, []);

  useEffect(() => {
    clickPlayers.forEach((player) => {
      player.volume = 0.9;
    });
  }, []);

  // Function to play smack sound (spam-safe)
  const playSwish = () => {
    const player = swishPlayers[swishIndex];
    player.seekTo(0);
    player.play();

    swishIndex = (swishIndex + 1) % swishPlayers.length;
  };

  const playClick = () => {
    const player = clickPlayers[clickIndex];
    player.seekTo(0);
    player.play();

    clickIndex = (clickIndex + 1) % clickPlayers.length;
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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // playSfx(plasticPlayer);
    playSwish();

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
    if (first !== null) return;

    setShowCycle(true);
    // playSfx(swishPlayer);

    Animated.timing(translateY, {
      toValue: -120,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setOpacity(0);
      handleDraw();

      setTimeout(() => {
        // playSfx(clickPlayer)
        playClick();
      }, 80);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    });
  };

  const handleResetPress = () => {
    Alert.alert("Reset", "Start over with a new deck?", [
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

  return (
    <View style={styles.bottomBar}>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          height: 50,
        }}
      >
        <Link
          href="/modal"
          style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontWeight: "600",
          }}
        >
          Info
        </Link>
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            padding: 15,
            color: "rgba(255, 255, 255, 0.75)",
            fontWeight: "600",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {remaining.length} Remaining
        </Text>
        {remaining.length !== 0 && (
          <Pressable
            style={styles.drawButton}
            onPressIn={() => handlePressIn()}
            onPressOut={() => handlePressOut()}
          >
            {remaining.map((x, i) => (
              <Animated.View
                key={i}
                style={{
                  ...styles.imageBox,
                  width: vw * 0.15,
                  left: "50%",
                  top: "50%",
                  transform: [
                    { translateX: -30 },
                    { translateY: -0.1 * i - 50 },
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
              handleDraw();
            }}
            style={{
              ...styles.drawButton,
              borderWidth: 2,
              borderColor: cycleBorder
                ? "rgba(255, 255, 255, 1)"
                : "rgba(255, 255, 255, 0.5)",
              borderRadius: "25%",
              aspectRatio: 1,
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                color: cycleBorder
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(255, 255, 255, 0.5)",
                fontWeight: "600",
                fontSize: 24,
                textAlign: "center",
              }}
            >
              Cycle Deck
            </Text>
          </Pressable>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleResetPress()}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          height: 50,
        }}
      >
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontWeight: "600",
            textAlign: "center",
            borderWidth: 2,
          }}
        >
          Reset
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 10,
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
    boxShadow: "1px 1px 2px black",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
