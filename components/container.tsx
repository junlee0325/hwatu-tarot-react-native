import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

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
  const { width: vw } = Dimensions.get("window");

  const handleCheck = () => {
    Haptics.selectionAsync();
    setSelectedBox(pairs);
    setOpenCheckBox(true);
  };

  const [scale] = useState(new Animated.Value(1));
  const [white, setWhite] = useState(false)

  const handlePressIn = () => {
    // Animated.spring(scale, {
    //   toValue: 0.5, // scale down 95%
    //   useNativeDriver: true,
    // }).start();
    setWhite(true)
  };

  const handlePressOut = () => {
    // Animated.spring(scale, {
    //   toValue: 1,
    //   friction: 3,
    //   useNativeDriver: true,
    // }).start();
    setWhite(false)
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.8,
        duration: 30, // very quick shrink
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 30, // quick bounce back
        useNativeDriver: true,
      }),
    ]).start();
  }, [pairs]);

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

          borderStyle: "solid",
          borderRadius: 5,
          boxShadow:
            boxTarget === index
              ? "0px 0px 5px 3px white"
              : "",
          backgroundColor:
            white
              ? "rgba(255, 255, 255, 0.75)"
              : "rgba(255, 255, 255, 0.25)",
          
        }}
      >
        {pairs.length > 0 && (
          <Animated.View
            style={{ position: "relative", width: "100%", height: "100%" ,transform: [{ scale }]}}
          >
            <Image
              source={imageSet[pairs[pairs.length - 1].img]}
              style={{
                ...styles.image,
                width: vw * 0.06,
                left: "45%",
                top: "50%",
              }}
              resizeMode="stretch"
            ></Image>
            <Image
              source={imageSet[pairs[pairs.length - 2].img]}
              style={{
                ...styles.image,
                width: vw * 0.06,
                left: "65%",
                top: "65%",
              }}
              resizeMode="stretch"
            ></Image>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default Container;

const styles = StyleSheet.create({
  image: {
    height: "auto",
    aspectRatio: "230/360",
    borderRadius: 2,
    position: "absolute",
    transform: [{ translateX: -15 }, { translateY: (-30 * (360 / 230)) / 2 }],
  },
});
