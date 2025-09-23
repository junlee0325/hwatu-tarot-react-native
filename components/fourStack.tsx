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
  imageSet: Record<string, any>;
  first: Card | null;
  setFirst: (value: Card) => void;
  second: Card | null;
  setSecond: (value: Card) => void
}

const FourStack = ({fourCards, imageSet, first, setFirst, second, setSecond} : Prop) => {

  const handlePress = (card:Card) => {
    if(first === null) {
      setFirst(card)
    } else {
      setSecond(card)
    }
  }
    
  return (
    <View style={{width: 48, display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', position: 'relative'}}>
        {fourCards.map((x,i) => 
            <Pressable 
            key={i} 
            style={{...styles.imageBox, top:15 * i }}
            onPress={() => handlePress(x)}
            >
                <Image source={x === fourCards[fourCards.length - 1] ? imageSet[x.img] : require('../assets/cardImgs/back.webp')} style={styles.image} resizeMode='contain'></Image>
            </Pressable>
        )}
    </View>
  )
}

export default FourStack

const styles = StyleSheet.create({
    imageBox:{
        width: 48,
        aspectRatio: '230/360',
        position:'absolute'
    },
    image: {
        width: "100%",
        height: "100%",
    }
})