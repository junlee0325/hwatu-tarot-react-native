import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
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
  pairs: Card[];
  imageSet: Record<string, any>;
  boxTarget: number;
  index: number;
  setOpenCheckBox: (value: boolean) => void;
  setSelectedBox: (pairs: Card[]) => void;
  box: Card[];
}

const Container = ({
  pairs,
  imageSet,
  boxTarget,
  index,
  setOpenCheckBox,
  setSelectedBox,
  box,
}: Prop) => {
  const { width: vw } = Dimensions.get("window");

  const handleCheck = () => {
    
    // setSelectedBox(pairs);
    // setOpenCheckBox(true);
    setOpen(!open);
  };

  const [scale] = useState(new Animated.Value(1));
  const [white, setWhite] = useState(false);
  const [open, setOpen] = useState(false);

  const monthCounts = box.reduce((acc, card) => {
    acc[card.month] = (acc[card.month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePressIn = () => {
    // Animated.spring(scale, {
    //   toValue: 0.5, // scale down 95%
    //   useNativeDriver: true,
    // }).start();
    setWhite(true);
  };

  const handlePressOut = () => {
    // Animated.spring(scale, {
    //   toValue: 1,
    //   friction: 3,
    //   useNativeDriver: true,
    // }).start();
    setWhite(false);
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.8,
        duration: 1, // very quick shrink
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 20, // quick bounce back
        useNativeDriver: true,
      }),
    ]).start();
  }, [pairs]);

  return (
    <View
      style={{
        width: "25%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <Pressable
        style={{
          width: 50,
          aspectRatio: 3 / 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => handleCheck()}
        onPressIn={() => Haptics.selectionAsync()}
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
                ? "0px 0px 0px 2px rgba(255, 217, 0, 1), inset 1px 1px 1px black"
                : "inset 1px 1px 1px 1px black",
            backgroundColor: open
              ? "rgba(235, 235, 235, 0.9)"
              : "rgba(122, 122, 122, 0.25)",
          }}
        >
          {pairs.length > 0 && (
            <Animated.View
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transform: [{ scale }],
              }}
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
      {open && (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: [{ translateX: "-50%" }],
            width: "85%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={{backgroundColor: "rgba(235, 235, 235, 0.9)", width: 2, height: 5}}></View>
          <View
            style={{
              width: "100%",
              minHeight: 50,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignContent: "center",
              gap: 6,
              backgroundColor: "rgba(235, 235, 235, 0.9)",
              boxShadow: "4px 4px 4px black",
              borderRadius: 5,
              paddingHorizontal: 4,
              paddingVertical: 8,
              // marginTop: 3
            }}
          >
            {box.length > 0 &&
              box.map((card, i) => {
                const hasFour = monthCounts[card.month] === 4;
                return (
                  <View
                    style={{
                      width: vw * 0.08,
                      aspectRatio: 230 / 360,
                      borderRadius: 2,
                      // transform: [{ rotate: `${card.rotation}deg` }],
                      borderColor: "indianred",
                      borderWidth: 1,
                      boxShadow: "2px 2px 2px black",
                      opacity: hasFour ? 1 : 0.4,
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
        </View>
      )}
    </View>
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
