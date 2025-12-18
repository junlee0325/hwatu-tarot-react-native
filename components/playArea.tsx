import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
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
}: Prop) => {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Haptics.selectionAsync();

    if (first === null) {
      setFirst(card);
      console.log("heh");
    }

    if (first !== null && card !== first && second === null) {
      setSecond(card);
      console.log("hi");
    }

    if (first !== null && card === first) {
      setFirst(null);
      setSecond(null);
      console.log("no");
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

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          height: 260,
          borderRadius: 10,
          borderWidth: 0,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderStyle: "dashed",
        }}
      >
        <ScrollView
          ref={scrollRef}
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
                borderColor: first === x ? "indianred" : "indianred",
                borderWidth: first === x ? 1 : 1,
                transform: [
                  // { translateX: rotateInt[i] },
                  { rotate: `${x.rotation * -1}deg` },
                  { scale: first === x ? 1.15 : 1 },
                ],
                opacity: disableCheck(x) ? 0.5 : 1,
                boxShadow:
                  first === x ? "1px 1px 10px yellow" : "2px 2px 2px black",
                zIndex: first === x ? 10 : 1,
              }}
              onPressIn={() => handlePress(x)}
              disabled={disableCheck(x)}
            >
              <Image
                source={imageSet[x.img]}
                style={styles.image}
                resizeMode="stretch"
              />
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
                  ? "1px 1px 10px yellow"
                  : "2px 2px 2px black",
            }}
            onPressIn={() => handlePress(faceUps[0])}
            disabled={disableCheck(faceUps[0])}
          >
            <Image
              source={imageSet[faceUps[0].img]}
              style={styles.image}
              resizeMode="stretch"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PlayArea;

const styles = StyleSheet.create({
  imageBox: {
    width: 60,
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
