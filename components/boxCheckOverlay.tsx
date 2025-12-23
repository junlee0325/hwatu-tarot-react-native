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
  title1: string;
  title2: string;
  meaning: string;
}

type Props = {
  setOpenCheckBox: (value: boolean) => void;
  selectedBox: Card[];
  imageSet: Record<string, any>;
};

const BoxCheckOverlay = ({ setOpenCheckBox, selectedBox, imageSet }: Props) => {
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
    Haptics.selectionAsync();
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
        backgroundColor: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <View
        style={{
          backgroundColor: "#cccccc",
          borderRadius: 10,
          padding: 10,
          width: "90%",
          height: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            height: "70%",
            gap: 4,
            backgroundColor: "#e0e0e0ff",
            boxShadow: "inset 1px 1px 4px black",
            paddingVertical: 5,
            borderRadius: 8,
            paddingHorizontal: 12,
          }}
        >
          {selectedBox.length > 0 ? (
            selectedBox.map((card, i) => {
              const hasFour = monthCounts[card.month] === 4;
              return (
                <View
                  style={{
                    width: vw * 0.12,
                    aspectRatio: 230 / 360,
                    borderRadius: 2,
                    transform: [{ rotate: `${card.rotation}deg` }],
                    borderColor: hasFour ? "yellow" : "indianred",
                    borderWidth: 1,
                    boxShadow: "2px 2px 2px black",
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
            })
          ) : (
            <View
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>No cards in this box</Text>
            </View>
          )}
        </View>

        <View style={{ height: "30%" }}>
          <Pressable
            onPress={() => handleClose()}
            onPressIn={() => handlePressIn()}
            onPressOut={() => handlePressOut()}
          >
            <Animated.View
              style={{
                marginTop: 20,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
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

export default BoxCheckOverlay;

const styles = StyleSheet.create({});
