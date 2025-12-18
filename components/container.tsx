import * as Haptics from 'expo-haptics';
import React, { useState } from "react";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";

interface Card {
  month: string;
  rank: string;
  id: string;
  img: string;
  rotation: number;
  title1: string;
  title2: string;
  meaning: string;
}

interface Prop {
  pairs: Card[];
  imageSet: Record<string, any>;
  boxTarget: number;
  index: number;
  setOpenCheckBox: (value: boolean) => void;
  setSelectedBox: (pairs: Card[]) => void;
}

const Container = ({
  pairs,
  imageSet,
  boxTarget,
  index,
  setOpenCheckBox,
  setSelectedBox,
}: Prop) => {
  const handleCheck = () => {
    Haptics.selectionAsync()
    setSelectedBox(pairs);
    setOpenCheckBox(true);
  };

  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.5, // scale down 95%
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

  return (
    <Pressable
      style={{
        width: 50,
        aspectRatio: 3 / 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => handleCheck()}
      onPressIn={() => handlePressIn()}
      onPressOut={() => handlePressOut()}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          borderWidth: 0,
          borderStyle: "dotted",
          borderRadius: 5,
          borderColor:
            boxTarget === index
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.25)",
          backgroundColor: boxTarget === index ? "rgba(255, 255, 255, .5)" : "rgba(255, 255, 255, 0.2)",
          transform: [{ scale }],
        }}
      >
        {pairs.length > 0 && (
          <View style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              source={imageSet[pairs[pairs.length - 1].img]}
              style={{ ...styles.image, left: "40%", top: "45%" }}
              resizeMode="stretch"
            ></Image>
            <Image
              source={imageSet[pairs[pairs.length - 2].img]}
              style={{ ...styles.image, left: "60%", top: "55%" }}
              resizeMode="stretch"
            ></Image>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default Container;

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: "auto",
    aspectRatio: "230/360",
    borderWidth: 1,
    borderRadius: 2,
    position: "absolute",
    transform: [{ translateX: -15 }, { translateY: (-30 * (360 / 230)) / 2 }],
  },
});
