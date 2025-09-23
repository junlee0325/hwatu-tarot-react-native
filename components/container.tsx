
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Card {
    month: string;
    rank: string;
    id: string;
    img: string
}

interface Prop {
    pairs : Card[];
    imageSet: Record<string, any>;
    boxTarget: number;
    index: number;
}

const Container = ({pairs, imageSet, boxTarget, index}: Prop) => {
  return (
    <View style={{width: 48, aspectRatio: '230/360', display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: boxTarget === index ? 4 : 1, borderRadius: 5, }}>
      {pairs.length > 0 &&
        <Image source={imageSet[pairs[pairs.length - 1].img]} style={styles.image} resizeMode='contain'></Image>
      }
    </View>
  )
}

export default Container

const styles = StyleSheet.create({
    image: {
        width: 38,
        height: 'auto',
        aspectRatio: '230/360',
        borderWidth: 1,
        borderRadius: 2
    }
})