
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';



const Container = () => {
  return (
    <View style={{width: 48, aspectRatio: '230/360', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', borderWidth: 1}}>
        <Image source={require('../assets/images/back.webp')} style={styles.image}></Image>
    </View>
  )
}

export default Container

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%"
    }
})