import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
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

type Props = {
  setOpenOptions: (value: boolean) => void;
  mute: boolean;
  setMute: (value: boolean) => void;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
};

const OptionsOverlay = ({
  setOpenOptions,
  mute,
  setMute,
  showLabels,
  setShowLabels,
}: Props) => {
  const { width: vw } = Dimensions.get("window");

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
    Haptics.selectionAsync()
    Animated.spring(scale, {
      toValue: 0.75,
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
    }).start(() => setOpenOptions(false));
  };

  const [sound, setSound] = useState(true)
  const [labels, setLabels] = useState(true)

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 20,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255, 217, 0, 1)",
          borderRadius: 10,
          padding: 10,
          width: "90%",
          height: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "70%",
            paddingVertical: 5,
            borderRadius: 8,
          }}
        >
          <Pressable style={{width: "30%"}} onPressIn={() => {Haptics.selectionAsync(); setSound(false)}} onPressOut={() => {setSound(true); setMute(!mute)}}>
            {!mute ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <Feather name="volume-2" size={60} color={sound ? "black" : "red"} />
                <Text style={{color: sound ? "black" : "red"}}>Sound ON</Text>
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Feather name="volume-x" size={60} color={sound ? "black" : "red"} />
                <Text style={{color: sound ? "black" : "red"}}>Sound OFF</Text>
              </View>
            )}
          </Pressable>
          <Pressable style={{width: "30%"}} onPressIn={() => {Haptics.selectionAsync(); setLabels(false)}} onPressOut={() => {setLabels(true); setShowLabels(!showLabels)}}>
            {showLabels ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="label-outline"
                  size={60}
                  color={labels ? "black" : "red"}
                />
                <Text style={{color: labels ? "black" : "red"}}>Labels ON</Text>
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="label-off-outline"
                  size={60}
                  color={labels ? "black" : "red"}
                />
                <Text style={{color: labels ? "black" : "red"}}>Labels OFF</Text>
              </View>
            )}
          </Pressable>
        </View>
        <View style={{ height: "30%" }}>
          <Pressable
            onPress={() => handleClose()}
            onPressIn={() => handlePressIn()}
            onPressOut={() => handlePressOut()}
          >
            <Animated.View
              style={{
                backgroundColor: "rgba(224, 0, 0, 1)",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                boxShadow: "inset 2px 2px 2px white, 2px 2px 2px 1px black",
                transform: [{ scale }],
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default OptionsOverlay;

const styles = StyleSheet.create({});
