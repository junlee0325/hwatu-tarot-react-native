
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
    <View style={{width: 45, aspectRatio: 3/4, display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderRadius: 5, borderColor:  boxTarget === index ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
      {pairs.length > 0 &&
        <View style={{position: 'relative', width: '100%', height:'100%'}}>
          <Image source={imageSet[pairs[pairs.length - 1].img]} style={{...styles.image, left:'40%', top: '45%'}} resizeMode='contain'></Image>
          <Image source={imageSet[pairs[pairs.length - 2].img]} style={{...styles.image, left:'60%', top: '55%'}} resizeMode='contain'></Image>
        </View>
      }
    </View>
  )
}

export default Container

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 'auto',
        aspectRatio: '230/360',
        borderWidth: 1,
        borderRadius: 2,
        position: 'absolute',
        transform: [{ translateX: -15 }, { translateY: -30 * (360 / 230) / 2 }]
    }
})