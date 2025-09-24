import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

interface Card {
  month: string;  // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string;     // optional, unique identifier
  img: string
}

interface Prop {
  fourCards: Card[];
  updateFourCards: (value: Card[]) => void;
  imageSet: Record<string, any>;
  first: Card | null;
  setFirst: (value: Card | null) => void;
  second: Card | null;
  setSecond: (value: Card | null) => void
}

const FourStack = ({ fourCards, imageSet, first, setFirst, second, setSecond }: Prop) => {

  const handlePress = (card: Card) => {
    if (first === null) {
      setFirst(card)
      console.log('heh')
    }

    if (first !== null && card !== first && second === null) {
      setSecond(card)
      console.log('hi')
    }

    if (first !== null && card === first) {
      setFirst(null)
      setSecond(null)
      console.log('no')
    }
  }

  return (
    <View style={{ width: 48, display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', position: 'relative' }}>
      {fourCards.map((x, i) =>
        <Pressable
          key={i}
          style={{ ...styles.imageBox, top: 15 * i, borderColor: first === x ? 'rgba(255, 234, 2, 1)' : 'black' }}
          onPress={() => handlePress(x)}
          disabled={x === fourCards[fourCards.length - 1] ? false : true}
        >
          <Image source={x === fourCards[fourCards.length - 1] ? imageSet[x.img] : require('../assets/cardImgs/back.webp')} style={styles.image} resizeMode='stretch'></Image>
        </Pressable>
      )}
    </View>
  )
}

export default FourStack

const styles = StyleSheet.create({
  imageBox: {
    width: 48,
    aspectRatio: '230/360',
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 3
  },
  image: {
    width: "100%",
    height: "100%",
  }
})