import { useLanguage } from "@/context/LanguageContext";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
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

type Props = {
  setOpenCheckBox: (value: boolean) => void;
  selectedBox: Card[];
  imageSet: Record<string, any>;
};

const close = { en: "Close", ko: "닫기" };

const BoxCheckOverlay = ({ setOpenCheckBox, selectedBox, imageSet }: Props) => {
  const { width: vw } = Dimensions.get("window");

  const { lang } = useLanguage();

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
    }).start(() => setOpenCheckBox(false));
  };

  const monthCounts = selectedBox.reduce((acc, card) => {
    acc[card.month] = (acc[card.month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          height: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "inset 1px 2px 3px 3px white, 1px 3px 3px 2px black",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
            height: "80%",
            gap: 6,
            backgroundColor: "rgba(235, 235, 235, 0.8)",
            boxShadow: "inset 1px 1px 4px black",
            paddingVertical: 5,
            borderRadius: 10,
            paddingHorizontal: 12,
          }}
        >
          {selectedBox.length > 0 &&
            selectedBox.map((card, i) => {
              const hasFour = monthCounts[card.month] === 4;
              return (
                <View
                  style={{
                    width: vw * 0.11,
                    aspectRatio: 230 / 360,
                    borderRadius: 2,
                    // transform: [{ rotate: `${card.rotation}deg` }],
                    borderColor: hasFour ? "rgba(255, 217, 0, 1)" : "indianred",
                    borderWidth: hasFour ? 2 : 1,
                    boxShadow: hasFour
                      ? "0px 0px 0px 2px rgba(0, 0, 0, 1)"
                      : "2px 2px 2px black",
                  }}
                  key={i}
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
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
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

export default BoxCheckOverlay;

const styles = StyleSheet.create({});
